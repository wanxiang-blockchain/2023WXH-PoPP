// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {IFollowModule} from '../interfaces/IFollowModule.sol';
import {PoPPNFTBase} from './base/PoPPNFTBase.sol';
import {PoPPMultiState} from './base/PoPPMultiState.sol';
import {Events} from '../libraries/Events.sol';
import {Errors} from '../libraries/Errors.sol';
import {Constants} from '../libraries/Constants.sol';
import {DataTypes} from '../libraries/DataTypes.sol';
import {VersionedInitializable} from '../upgradeability/VersionedInitializable.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract PoPPProfileNFT is PoPPNFTBase, VersionedInitializable, PoPPMultiState {

    address internal immutable FOLLOW_NFT_IMPL;
    address internal immutable COLLECT_NFT_IMPL;

    uint256 internal constant REVISION = 1;

    address public POPP_HUB;

    address public governance;

    uint256 internal _profileCounter;

    mapping(uint256 => DataTypes.ProfileStruct) internal _profileById;

    mapping(bytes32 => uint256) internal _profileIdByHandleHash;

    mapping(address => bool) internal _followModuleWhitelisted;

    mapping(address => bool) internal _referenceModuleWhitelisted;

    mapping(address => bool) internal _collectModuleWhitelisted;

    mapping(address => bool) internal _financePoolModuleWhitelisted;

    mapping(uint256 => address) internal _dispatcherByProfile;

    mapping(address => uint256) internal _defaultProfileByAddress;

    constructor(address followNFTImpl, address collectNFTImpl) {
        if (followNFTImpl == address(0)) revert Errors.InitParamsInvalid();
        if (collectNFTImpl == address(0)) revert Errors.InitParamsInvalid();
        FOLLOW_NFT_IMPL = followNFTImpl;
        COLLECT_NFT_IMPL = collectNFTImpl;
    }

    modifier onlyGov() {
        _validateCallerIsGovernance();
        _;
    }

    modifier onlyHub() {
        if (msg.sender != POPP_HUB) revert Errors.NotHub();
        _;
    }

    function initialize(
        string calldata name,
        string calldata symbol,
        address newGovernance,
        address poppHubAddress
    ) external initializer {
        super._initialize(name, symbol);
        _setState(DataTypes.ProtocolState.Paused);
        _setGovernance(newGovernance);
        POPP_HUB = poppHubAddress;
    }

    //==================== get ====================

    function getRevision() internal pure virtual override returns (uint256) {
        return REVISION;
    }

    function getFollowModule(uint256 profileId) external view returns (address) {
        return _profileById[profileId].followModule;
    }

    function getProfileById(uint256 profileId) external returns(DataTypes.ProfileStruct memory){
        return _profileById[profileId];
    }

    function getProfileIdByHandle(string calldata handle) external view returns (uint256) {
        bytes32 handleHash = keccak256(bytes(handle));
        return _profileIdByHandleHash[handleHash];
    }

    function getProfileIdByHandleBytes32(bytes32 handleHash) external view returns (uint256) {
        return _profileIdByHandleHash[handleHash];
    }

    function getFollowNFTImpl() external view returns (address) {
        return FOLLOW_NFT_IMPL;
    }

    function getCollectNFTImpl() external view returns (address) {
        return COLLECT_NFT_IMPL;
    }

    function getFollowNFT(uint256 profileId) external view returns (address) {
        return _profileById[profileId].followNFT;
    }

    function isFollower(address follower, uint256 profileId) public view returns(bool){
        address followNFT = _profileById[profileId].followNFT;
        return IERC721(followNFT).balanceOf(follower)>0;
    }

    function validateCallerIsProfileOwner(address _owner, uint256 profileId) public view {
        if (_owner != ownerOf(profileId)) revert Errors.NotProfileOwner();
    }

    function checkHandle(string calldata handle) public view {
        _validateHandle(handle);
        bytes32 handleHash = keccak256(bytes(handle));
        if (_profileIdByHandleHash[handleHash] != 0)
            revert Errors.HandleTaken();
    }

    //==================== public ====================
    function validateCallerIsProfileOwnerOrDispatcher(address _owner, uint256 profileId) public view {
        if (_owner == ownerOf(profileId) || _owner == _dispatcherByProfile[profileId]) {
            return;
        }
        revert Errors.NotProfileOwnerOrDispatcher();
    }

    function addPubCount(uint256 profileId) public onlyHub returns(uint256) {
        uint256 pubId = ++_profileById[profileId].pubCount;
        return pubId;
    }

    function setFollowNFT(uint256 profileId, address _followNFT) public onlyHub{
        _profileById[profileId].followNFT = _followNFT;
    }

    function setState(DataTypes.ProtocolState _status) public onlyGov{
        _setState(_status);
    }


    function createProfile(DataTypes.CreateProfileData calldata vars) public onlyHub returns(uint256){
        uint256 profileId = ++_profileCounter;
        _mint(vars.to, profileId);

        _validateHandle(vars.handle);
        if (bytes(vars.imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH)
            revert Errors.ProfileImageURILengthInvalid();

        bytes32 handleHash = keccak256(bytes(vars.handle));

        if (_profileIdByHandleHash[handleHash] != 0) revert Errors.HandleTaken();

        _profileIdByHandleHash[handleHash] = profileId;
        _profileById[profileId].handle = vars.handle;
        _profileById[profileId].imageURI = vars.imageURI;
        _profileById[profileId].followNFTURI = vars.followNFTURI;
        _profileById[profileId].profileType = vars.profileType;

        bytes memory followModuleReturnData;
        if (vars.followModule != address(0)) {
            _profileById[profileId].followModule = vars.followModule;
            followModuleReturnData = _initFollowModule(
                profileId,
                vars.followModule,
                vars.followModuleInitData,
                _followModuleWhitelisted
            );
        }

        _emitProfileCreated(profileId, vars, followModuleReturnData);

        return profileId;
    }

    function whitelistFollowModule(address followModule, bool whitelist) external onlyGov {
        _followModuleWhitelisted[followModule] = whitelist;
        emit Events.FollowModuleWhitelisted(followModule, whitelist, block.timestamp);
    }

    function whitelistReferenceModule(address referenceModule, bool whitelist) external onlyGov{
        _referenceModuleWhitelisted[referenceModule] = whitelist;
        emit Events.ReferenceModuleWhitelisted(referenceModule, whitelist, block.timestamp);
    }

    function whitelistCollectModule(address collectModule, bool whitelist) external onlyGov {
        _collectModuleWhitelisted[collectModule] = whitelist;
        emit Events.CollectModuleWhitelisted(collectModule, whitelist, block.timestamp);
    }

    function whitelistFinancePoolModule(address financeModule, bool whitelist) external onlyGov {
        _financePoolModuleWhitelisted[financeModule] = whitelist;
        emit Events.FinancePoolModuleWhitelisted(financeModule, whitelist, block.timestamp);
    }

    function burn(uint256 tokenId) public override {
        super.burn(tokenId);
        _clearHandleHash(tokenId);
    }

    //==================== set ====================

    function setGovernance(address newGovernance) external onlyGov {
        _setGovernance(newGovernance);
    }

    function setDispatcher(uint256 profileId, address dispatcher) external whenNotPaused {
        _validateCallerIsProfileOwner(profileId);
        _setDispatcher(profileId, dispatcher);
    }

    function setProfileImageURI(uint256 profileId, string calldata imageURI) external whenNotPaused {
        _validateCallerIsProfileOwnerOrDispatcher(profileId);
        _setProfileImageURI(profileId, imageURI);
    }

    function setFollowNFTURI(uint256 profileId, string calldata followNFTURI) external whenNotPaused {
        _validateCallerIsProfileOwnerOrDispatcher(profileId);
        _setFollowNFTURI(profileId, followNFTURI);
    }

    function setFollowModule(
        uint256 profileId,
        address followModule,
        bytes calldata followModuleInitData
    ) external whenNotPaused {
        _validateCallerIsProfileOwner(profileId);
        DataTypes.ProfileStruct storage _profile = _profileById[profileId];
        if (followModule != _profile.followModule) {
            _profile.followModule = followModule;
        }
        bytes memory followModuleReturnData;
        if (followModule != address(0))
            followModuleReturnData = _initFollowModule(
                profileId,
                followModule,
                followModuleInitData,
                _followModuleWhitelisted
            );
        emit Events.FollowModuleSet(
            profileId,
            followModule,
            followModuleReturnData,
            block.timestamp
        );
    }

    function setDefaultProfile(uint256 profileId) external whenNotPaused {
        _setDefaultProfile(msg.sender, profileId);
    }

    function isFollowModuleWhitelisted(address followModule) external view returns (bool) {
        return _followModuleWhitelisted[followModule];
    }

    function isReferenceModuleWhitelisted(address referenceModule)
    external
    view
    returns (bool)
    {
        return _referenceModuleWhitelisted[referenceModule];
    }

    function isCollectModuleWhitelisted(address collectModule)
    external
    view
    returns (bool)
    {
        return _collectModuleWhitelisted[collectModule];
    }

    function isFinancePoolModuleWhitelisted(address financeModule)
    external
    view
    returns (bool)
    {
        return _financePoolModuleWhitelisted[financeModule];
    }

    function defaultProfile(address wallet) external view returns (uint256) {
        return _defaultProfileByAddress[wallet];
    }

    //==================== internal ====================

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        if (_dispatcherByProfile[tokenId] != address(0)) {
            _setDispatcher(tokenId, address(0));
        }

        if (_defaultProfileByAddress[from] == tokenId) {
            _defaultProfileByAddress[from] = 0;
        }

        super._beforeTokenTransfer(from, to, tokenId);
    }


    function _clearHandleHash(uint256 profileId) internal {
        bytes32 handleHash = keccak256(bytes(_profileById[profileId].handle));
        _profileIdByHandleHash[handleHash] = 0;
    }

    function _setDispatcher(uint256 profileId, address dispatcher) internal {
        _dispatcherByProfile[profileId] = dispatcher;
        emit Events.DispatcherSet(profileId, dispatcher, block.timestamp);
    }

    function _setGovernance(address newGovernance) internal {
        address prevGovernance = governance;
        governance = newGovernance;
        emit Events.GovernanceSet(msg.sender, prevGovernance, newGovernance, block.timestamp);
    }

    function _setProfileImageURI(uint256 profileId, string calldata imageURI) internal {
        if (bytes(imageURI).length > Constants.MAX_PROFILE_IMAGE_URI_LENGTH)
            revert Errors.ProfileImageURILengthInvalid();
        _profileById[profileId].imageURI = imageURI;
        emit Events.ProfileImageURISet(profileId, imageURI, block.timestamp);
    }

    function _setFollowNFTURI(uint256 profileId, string calldata followNFTURI) internal {
        _profileById[profileId].followNFTURI = followNFTURI;
        emit Events.FollowNFTURISet(profileId, followNFTURI, block.timestamp);
    }

    function _validateCallerIsProfileOwnerOrDispatcher(uint256 profileId) internal view {
        if (msg.sender == ownerOf(profileId) || msg.sender == _dispatcherByProfile[profileId]) {
            return;
        }
        revert Errors.NotProfileOwnerOrDispatcher();
    }

    function _validateCallerIsProfileOwner(uint256 profileId) internal view {
        if (msg.sender != ownerOf(profileId)) revert Errors.NotProfileOwner();
    }

    function _validateCallerIsGovernance() internal view {
        if (msg.sender != governance) revert Errors.NotGovernance();
    }

    function _validateHandle(string calldata handle) private pure {
        bytes memory byteHandle = bytes(handle);
        if (byteHandle.length == 0 || byteHandle.length > Constants.MAX_HANDLE_LENGTH)
            revert Errors.HandleLengthInvalid();

        uint256 byteHandleLength = byteHandle.length;
        for (uint256 i = 0; i < byteHandleLength; ) {
            if (
                (byteHandle[i] < '0' ||
                byteHandle[i] > 'z' ||
                (byteHandle[i] > '9' && byteHandle[i] < 'a')) &&
                byteHandle[i] != '.' &&
                byteHandle[i] != '-' &&
                byteHandle[i] != '_'
            ) revert Errors.HandleContainsInvalidCharacters();
        unchecked {
            ++i;
        }
        }
    }

    function _emitProfileCreated(
        uint256 profileId,
        DataTypes.CreateProfileData calldata vars,
        bytes memory followModuleReturnData
    ) internal {
        emit Events.ProfileCreated(
            profileId,
            tx.origin, // Creator is always the msg sender
            vars.to,
            vars.handle,
            vars.imageURI,
            vars.followModule,
            followModuleReturnData,
            vars.followNFTURI,
            block.timestamp,
            vars.profileType
        );
    }

    function _initFollowModule(
        uint256 profileId,
        address followModule,
        bytes memory followModuleInitData,
        mapping(address => bool) storage _followModuleWhitelisted
    ) private returns (bytes memory) {
        if (!_followModuleWhitelisted[followModule]) revert Errors.FollowModuleNotWhitelisted();
        return IFollowModule(followModule).initializeFollowModule(profileId, followModuleInitData);
    }

    function _setDefaultProfile(address wallet, uint256 profileId) internal {
        if (profileId > 0 && wallet != ownerOf(profileId)) revert Errors.NotProfileOwner();

        _defaultProfileByAddress[wallet] = profileId;

        emit Events.DefaultProfileSet(wallet, profileId, block.timestamp);
    }
}
