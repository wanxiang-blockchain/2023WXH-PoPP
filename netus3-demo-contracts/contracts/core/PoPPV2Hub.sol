// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {Constants} from '../libraries/Constants.sol';
import {Helpers} from '../libraries/Helpers.sol';
import {DataTypes} from '../libraries/DataTypes.sol';
import {Errors} from '../libraries/Errors.sol';
import {Events} from '../libraries/Events.sol';
import {FollowNFTProxy} from "../upgradeability/FollowNFTProxy.sol";
import {IPoPPHub} from '../interfaces/IPoPPHub.sol';
import {IFollowNFT} from '../interfaces/IFollowNFT.sol';
import {ICollectNFT} from '../interfaces/ICollectNFT.sol';
import {IFollowModule} from '../interfaces/IFollowModule.sol';
import {ICollectModule} from '../interfaces/ICollectModule.sol';
import {IReferenceModule} from '../interfaces/IReferenceModule.sol';
import {IProfile} from "../interfaces/IProfile.sol";
import {IPlanetBase} from "../interfaces/IPlanetBase.sol";
import {IFinancePoolModule} from "../interfaces/IFinancePoolModule.sol";
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {Clones} from '@openzeppelin/contracts/proxy/Clones.sol';
import {Strings} from '@openzeppelin/contracts/utils/Strings.sol';


contract PoPPV2Hub is IPoPPHub {

    using Strings for uint256;

    uint16 internal constant BPS_MAX = 10000;

    address public immutable FINANCE_POOL_IMPL;
    address public immutable FINANCE_POOL_ACCEPT_ERC20;

    IProfile private POPP_PROFILE;
    IPlanetBase private PLANET_BASE;

    address public governance;
    bool public createProfileNeedWhitelist = false;
    address public createPlanetProfileSBT;
    mapping(address => bool) internal _profileCreatorWhitelisted;
    mapping(uint256 => mapping(uint256 => DataTypes.PublicationStruct)) internal _pubByIdByProfile;
    mapping(uint256 => mapping(uint256 => address)) internal _pubByIdByProfileFinancePool;
    mapping(uint256 => mapping(uint256 => uint16)) internal _pubByIdByProfileCollectReferralPoint;
    mapping(uint256 => mapping(uint256 => uint16)) internal _pubByIdByProfileDonateReferralPoint;

    //@deme mute
    //baseProfileId => address => bool
    mapping(uint256 => mapping(address => bool)) public muteFollower;
    //baseProfileId => poppProfileId => bool
    mapping(uint256 => mapping(uint256 => bool)) public mutePoppProfile;

    event DeployedFinancePool(uint256 profileId, uint256 pubId, address financePool);

    constructor(address _profileAddress, address _planetBaseAddress, address financePoolImpl, address erc20) {
        POPP_PROFILE = IProfile(_profileAddress);
        PLANET_BASE = IPlanetBase(_planetBaseAddress);
        FINANCE_POOL_IMPL = financePoolImpl;
        FINANCE_POOL_ACCEPT_ERC20 = erc20;
        _setGovernance(msg.sender);
    }

    modifier onlyGov() {
        if (msg.sender != governance) revert Errors.NotGovernance();
        _;
    }

    //create profile
    function createProfile(DataTypes.CreateProfileData calldata vars) external returns (uint256){
        if (!isProfileCreatorWhitelisted(msg.sender)) revert Errors.ProfileCreatorNotWhitelisted();
        if (vars.profileType == DataTypes.ProfileType.PlanetProfile && createPlanetProfileSBT != address(0)){
            require(IERC721(createPlanetProfileSBT).balanceOf(msg.sender)>0, 'No SBT');
        }
        return POPP_PROFILE.createProfile(vars);
    }

    //create base
    function createPlanetBase(DataTypes.BaseInfo calldata vars) external returns (uint256){
        POPP_PROFILE.validateCallerIsProfileOwner(msg.sender, vars.planetProfileId);
        require(POPP_PROFILE.getProfileById(vars.planetProfileId).profileType == DataTypes.ProfileType.PlanetProfile);
        return PLANET_BASE.createPlanetBase(vars);
    }

    //post
    function post(DataTypes.PostData calldata vars)
    external
    returns (uint256)
    {
        POPP_PROFILE.validateCallerIsProfileOwnerOrDispatcher(msg.sender, vars.profileId);
        require(POPP_PROFILE.getProfileById(vars.profileId).profileType == DataTypes.ProfileType.PoppProfile, 'Not PoppProfile');
        uint256 planetProfileId = 0;
        if (vars.baseProfileId>0){
            DataTypes.BaseInfo memory baseInfo = PLANET_BASE.baseInfo(vars.baseProfileId);
            require(baseInfo.planetProfileId > 0, "Invalid baseId");
            address followNFT = POPP_PROFILE.getProfileById(baseInfo.planetProfileId).followNFT;
            require(IERC721(followNFT).balanceOf(msg.sender) > 0, "Not follower.");
            planetProfileId = vars.baseProfileId;
        }
        require(vars.donateReferralPoint <= BPS_MAX, "Invalid point.");
        return _createPost(
            vars,
            planetProfileId
        );
    }

    //mirror 注意多重转发 前端处理
    function mirror(DataTypes.MirrorData calldata vars)
    external
    returns (uint256)
    {
        POPP_PROFILE.validateCallerIsProfileOwnerOrDispatcher(msg.sender, vars.profileId);
    unchecked {
        uint256 pubId = POPP_PROFILE.addPubCount(vars.profileId);

        (uint256 rootProfileIdPointed, uint256 rootPubIdPointed,) = Helpers.getPointedIfMirror(
            vars.profileIdPointed,
            vars.pubIdPointed,
            _pubByIdByProfile
        );

        _pubByIdByProfile[vars.profileId][pubId].profileIdPointed = rootProfileIdPointed;
        _pubByIdByProfile[vars.profileId][pubId].pubIdPointed = rootPubIdPointed;
        //_pubByIdByProfileFinancePool[vars.profileId][pubId] = _deployFinancePool(vars.profileId, pubId);

        // Reference module initialization
        bytes memory referenceModuleReturnData = new bytes(0);
        if (vars.referenceModule != address(0)) {
            if (!POPP_PROFILE.isReferenceModuleWhitelisted(vars.referenceModule)) {
                revert Errors.ReferenceModuleNotWhitelisted();
            }
            _pubByIdByProfile[vars.profileId][pubId].referenceModule = vars.referenceModule;
            referenceModuleReturnData = IReferenceModule(vars.referenceModule).initializeReferenceModule(
                vars.profileId,
                pubId,
                vars.referenceModuleInitData
            );
        }

        // Reference module validation
        address refModule = _pubByIdByProfile[rootProfileIdPointed][rootPubIdPointed].referenceModule;
        if (refModule != address(0)) {
            IReferenceModule(refModule).processMirror(
                vars.profileId,
                rootProfileIdPointed,
                rootPubIdPointed,
                vars.referenceModuleData
            );
        }

        emit Events.MirrorCreated(
            vars.profileId,
            pubId,
            rootProfileIdPointed,
            rootPubIdPointed,
            vars.referenceModuleData,
            vars.referenceModule,
            referenceModuleReturnData,
            block.timestamp
        );

        return pubId;
    }
    }

    //follow
    function follow(uint256 profileId, bytes calldata data) external returns (uint256) {
        address follower = msg.sender;
        DataTypes.ProfileStruct memory profileById = POPP_PROFILE.getProfileById(profileId);
        string memory handle = profileById.handle;
        bytes32 handleHash = keccak256(bytes(handle));
        if (POPP_PROFILE.getProfileIdByHandleBytes32(handleHash) != profileId)
            revert Errors.TokenDoesNotExist();

        address followModule = profileById.followModule;
        address followNFT = profileById.followNFT;

        if (followNFT == address(0)) {
            followNFT = _deployFollowNFT(profileId);
            POPP_PROFILE.setFollowNFT(profileId, followNFT);
        }

        uint256 followNFTTokenId = IFollowNFT(followNFT).mint(follower);

        if (followModule != address(0)) {
            IFollowModule(followModule).processFollow(
                follower,
                profileId,
                data
            );
        }
        emit Events.Followed1(follower, profileId, data, block.timestamp);
        return followNFTTokenId;
    }

    //collect
    function collect(
        uint256 profileId,
        uint256 pubId,
        bytes calldata collectModuleData
    ) external returns (uint256) {
        (uint256 rootProfileId, uint256 rootPubId, address rootCollectModule) = Helpers
        .getPointedIfMirror(profileId, pubId, _pubByIdByProfile);
        address collector = msg.sender;
        uint256 tokenId;
        // Avoids stack too deep
        {
            address collectNFT = _pubByIdByProfile[rootProfileId][rootPubId].collectNFT;
            if (collectNFT == address(0)) {
                collectNFT = _deployCollectNFT(
                    rootProfileId,
                    rootPubId,
                    POPP_PROFILE.getProfileById(rootProfileId).handle,
                    POPP_PROFILE.getCollectNFTImpl()
                );
                _pubByIdByProfile[rootProfileId][rootPubId].collectNFT = collectNFT;
            }
            tokenId = ICollectNFT(collectNFT).mint(collector);
        }

        ICollectModule(rootCollectModule).processCollect(
            profileId,
            collector,
            rootProfileId,
            rootPubId,
            collectModuleData
        );
        emit Events.Collected(
            collector,
            profileId,
            pubId,
            rootProfileId,
            rootPubId,
            collectModuleData,
            block.timestamp
        );

        return tokenId;
    }

    //mute
    function setMuteFollower(uint256 baseProfileId, address follower, bool mute) public {
        uint256 planetProfileId = PLANET_BASE.baseInfo(baseProfileId).planetProfileId;
        POPP_PROFILE.validateCallerIsProfileOwner(msg.sender, planetProfileId);
        muteFollower[baseProfileId][follower] = mute;
        emit Events.SetMuteFollower(baseProfileId, follower, mute);
    }

    //donate
    function donate(uint256 profileId, uint256 pubId, address erc20Address, uint256 amount) public {
        address financePool = getFinancePool(profileId, pubId);
        if (financePool == address(0)){
            revert Errors.PublicationDoesNotExist();
        }
        DataTypes.PublicationStruct memory publication = _pubByIdByProfile[profileId][pubId];
        if (publication.collectModule != address(0)) {
            IERC20(erc20Address).transferFrom(msg.sender, financePool, amount);
            IFinancePoolModule(financePool).depositERC20ByDonor(amount);
        } else {
            (uint256 rootProfileId, uint256 rootPubId, address rootCollectModule) = Helpers
            .getPointedIfMirror(profileId, pubId, _pubByIdByProfile);

            uint256 donateReferralFee = _pubByIdByProfileDonateReferralPoint[rootProfileId][rootPubId];
            uint256 referralAmount = (amount * donateReferralFee) / BPS_MAX;
            uint256 adjustedAmount = amount - referralAmount;

            IERC20(erc20Address).transferFrom(msg.sender, financePool, amount);

            IFinancePoolModule(financePool).depositERC20ByDonor(adjustedAmount);
            address referralRecipient = POPP_PROFILE.ownerOf(profileId);
            IFinancePoolModule(financePool).depositERC20ByReferral(referralRecipient, amount);
        }
    }

    function setMutePoppProfile(uint256 baseProfileId, uint256 poppProfileId, bool mute) public {
        uint256 planetProfileId = PLANET_BASE.baseInfo(baseProfileId).planetProfileId;
        POPP_PROFILE.validateCallerIsProfileOwner(msg.sender, planetProfileId);
        mutePoppProfile[baseProfileId][poppProfileId] = mute;
        emit Events.SetMutePoppProfile(baseProfileId, poppProfileId, mute);
    }

    function setCreatePlanetProfileSBT(address _createPlanetProfileSBT) external onlyGov{
        createPlanetProfileSBT = _createPlanetProfileSBT;
    }

    function setCreateProfileNeedWhitelist(bool need) external onlyGov {
        createProfileNeedWhitelist = need;
    }

    function setGovernance(address newGovernance) external onlyGov {
        _setGovernance(newGovernance);
    }

    function setCollectReferralPoint(uint256 profileId, uint256 pubId, uint16 referralFee) external {
        address collectModule = _pubByIdByProfile[profileId][pubId].collectModule;
        require(msg.sender == collectModule, "Not collectModule.");
        _pubByIdByProfileCollectReferralPoint[profileId][pubId] = referralFee;
    }

    //==================== set end ====================


    function whitelistProfileCreator(address profileCreator, bool whitelist) external onlyGov {
        _profileCreatorWhitelisted[profileCreator] = whitelist;
        emit Events.ProfileCreatorWhitelisted(profileCreator, whitelist, block.timestamp);
    }

    //==================== get ====================
    function isProfileCreatorWhitelisted(address profileCreator) public view returns (bool) {
        if (!createProfileNeedWhitelist) {
            return true;
        }
        return _profileCreatorWhitelisted[profileCreator];
    }

    function getHandle(uint256 profileId) external view returns (string memory) {
        return POPP_PROFILE.getProfileById(profileId).handle;
    }

    function getFollowNFTURI(uint256 profileId) external view returns (string memory) {
        return POPP_PROFILE.getProfileById(profileId).followNFTURI;
    }

    function getFollowModule(uint256 profileId) external view returns (address) {
        return POPP_PROFILE.getProfileById(profileId).followModule;
    }

    function getFollowNFTImpl() external view returns (address) {
        return POPP_PROFILE.getFollowNFTImpl();
    }

    function getCollectNFTImpl() external view returns (address) {
        return POPP_PROFILE.getCollectNFTImpl();
    }

    function getCollectNFT(uint256 profileId, uint256 pubId) external view returns (address) {
        return _pubByIdByProfile[profileId][pubId].collectNFT;
    }

    function getFinancePool(uint256 profileId, uint256 pubId) public view returns (address) {
        (uint256 rootProfileIdPointed, uint256 rootPubIdPointed,) = Helpers.getPointedIfMirror(
            profileId,
                pubId,
            _pubByIdByProfile
        );
        return _pubByIdByProfileFinancePool[rootProfileIdPointed][rootPubIdPointed];
    }

    function getCollectReferralPoint(uint256 profileId, uint256 pubId) external view returns (uint16) {
        return _pubByIdByProfileCollectReferralPoint[profileId][pubId];
    }

    function getDonateReferralPoint(uint256 profileId, uint256 pubId) external view returns (uint16) {
        return _pubByIdByProfileDonateReferralPoint[profileId][pubId];
    }

    function getCollectModule(uint256 profileId, uint256 pubId) external view returns (address) {
        return _pubByIdByProfile[profileId][pubId].collectModule;
    }

    function getContentURI(uint256 profileId, uint256 pubId) external view returns (string memory) {
        (uint256 rootProfileId, uint256 rootPubId,) = Helpers.getPointedIfMirror(
            profileId,
            pubId,
            _pubByIdByProfile
        );
        return _pubByIdByProfile[rootProfileId][rootPubId].contentURI;
    }

    function getFollowNFT(uint256 profileId) external view returns (address) {
        return POPP_PROFILE.getProfileById(profileId).followNFT;
    }

    function ownerOf(uint256 profileId) external view returns (address){
        return POPP_PROFILE.ownerOf(profileId);
    }

    function balanceOf(address owner) external view returns (uint256){
        return POPP_PROFILE.balanceOf(owner);
    }

    function emitFollowNFTTransferEvent(
        uint256 profileId,
        uint256 followNFTId,
        address from,
        address to
    ) external {
        address expectedFollowNFT = POPP_PROFILE.getProfileById(profileId).followNFT;
        if (msg.sender != expectedFollowNFT) revert Errors.CallerNotFollowNFT();
        emit Events.FollowNFTTransferred(profileId, followNFTId, from, to, block.timestamp);
    }

    function emitCollectNFTTransferEvent(
        uint256 profileId,
        uint256 pubId,
        uint256 collectNFTId,
        address from,
        address to
    ) external {
        address expectedCollectNFT = _pubByIdByProfile[profileId][pubId].collectNFT;
        if (msg.sender != expectedCollectNFT) revert Errors.CallerNotCollectNFT();
        emit Events.CollectNFTTransferred(
            profileId,
            pubId,
            collectNFTId,
            from,
            to,
            block.timestamp
        );
    }

    //==================== internal ====================
    function _setGovernance(address newGovernance) internal {
        address prevGovernance = governance;
        governance = newGovernance;
        emit Events.GovernanceSet(msg.sender, prevGovernance, newGovernance, block.timestamp);
    }

    function _createPost(
        DataTypes.PostData calldata vars,
        uint256 planetProfileId
    ) internal returns (uint256) {
    unchecked{
        if (vars.baseProfileId>0){
            _checkBaseAuth(msg.sender, vars.baseProfileId, false);
            require(!muteFollower[vars.baseProfileId][msg.sender], "Muted");
            require(!mutePoppProfile[vars.baseProfileId][vars.profileId], "Muted");
        }
        uint256 pubId = POPP_PROFILE.addPubCount(vars.profileId);

        _pubByIdByProfileDonateReferralPoint[vars.profileId][pubId] = vars.donateReferralPoint;
        _pubByIdByProfile[vars.profileId][pubId].baseProfileId = vars.baseProfileId;
        _pubByIdByProfile[vars.profileId][pubId].poppProfileId = vars.profileId;
        _pubByIdByProfile[vars.profileId][pubId].planetProfileId = planetProfileId;
        _pubByIdByProfile[vars.profileId][pubId].contentURI = vars.contentURI;
        _pubByIdByProfile[vars.profileId][pubId].pubIdPointed = pubId;
        _pubByIdByProfile[vars.profileId][pubId].profileIdPointed = vars.profileId;

        // Collect module initialization
        if (!POPP_PROFILE.isCollectModuleWhitelisted(vars.collectModule)) revert Errors.CollectModuleNotWhitelisted();
        _pubByIdByProfile[vars.profileId][pubId].collectModule = vars.collectModule;
        //create finance pool
        if (vars.financeModule != address(0)){
            if (!POPP_PROFILE.isFinancePoolModuleWhitelisted(vars.financeModule))
                revert Errors.FinancePoolModuleNotWhitelisted();
            _pubByIdByProfileFinancePool[vars.profileId][pubId] = _deployFinancePool(vars.profileId, pubId, vars.financeModule, vars.collectModule);
        }

        bytes memory collectModuleReturnData = ICollectModule(vars.collectModule).initializePublicationCollectModule(
            vars.profileId,
            pubId,
            vars.collectModuleInitData
        );

        // Reference module initialization
        bytes memory referenceModuleReturnData = new bytes(0);
        if (vars.referenceModule != address(0)) {
            if (!POPP_PROFILE.isReferenceModuleWhitelisted(vars.referenceModule))
                revert Errors.ReferenceModuleNotWhitelisted();
            _pubByIdByProfile[vars.profileId][pubId].referenceModule = vars.referenceModule;
            referenceModuleReturnData = IReferenceModule(vars.referenceModule).initializeReferenceModule(
                vars.profileId,
                pubId,
                vars.referenceModuleInitData
            );
        }

        emit Events.PostCreated(
            vars.profileId,
            vars.baseProfileId,
            pubId,
            planetProfileId,
            vars.contentURI,
            vars.collectModule,
            collectModuleReturnData,
            vars.referenceModule,
            referenceModuleReturnData,
            block.timestamp
        );

        return pubId;
    }
    }

    function _deployFollowNFT(uint256 profileId) private returns (address) {
        bytes memory functionData = abi.encodeWithSelector(
            IFollowNFT.initialize.selector,
            profileId
        );
        address followNFT = address(new FollowNFTProxy(functionData));
        emit Events.FollowNFTDeployed(profileId, followNFT, block.timestamp);

        return followNFT;
    }

    function _deployCollectNFT(
        uint256 profileId,
        uint256 pubId,
        string memory handle,
        address collectNFTImpl
    ) internal returns (address) {
        address collectNFT = Clones.clone(collectNFTImpl);

        bytes4 firstBytes = bytes4(bytes(handle));

        string memory collectNFTName = string(
            abi.encodePacked(handle, Constants.COLLECT_NFT_NAME_INFIX, pubId.toString())
        );
        string memory collectNFTSymbol = string(
            abi.encodePacked(firstBytes, Constants.COLLECT_NFT_SYMBOL_INFIX, pubId.toString())
        );

        ICollectNFT(collectNFT).initialize(profileId, pubId, collectNFTName, collectNFTSymbol);
        emit Events.CollectNFTDeployed(profileId, pubId, collectNFT, block.timestamp);

        return collectNFT;
    }

    function _deployFinancePool(uint256 profileId, uint256 pubId, address financePoolModule, address collectModule) internal returns (address){
        address financePool = Clones.clone(financePoolModule);
        IFinancePoolModule(financePool).init(address(this), collectModule, profileId, pubId, FINANCE_POOL_ACCEPT_ERC20);
        emit DeployedFinancePool(profileId, pubId, financePool);
        return financePool;
    }

    function _checkBaseAuth(address _addr, uint256 baseId, bool checkJoin) internal {
        (bool join, bool post) = PLANET_BASE.authCheck(_addr, baseId);
        if (checkJoin) {
            require(join, "Join auth fail.");
        } else {
            require(post, "Post auth fail.");
        }
    }
}
