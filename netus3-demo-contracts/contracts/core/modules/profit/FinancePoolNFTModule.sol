// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC721Enumerable} from '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import {SafeMath} from "../../../libraries/SafeMath.sol";
import {IFinancePoolModule} from "../../../interfaces/IFinancePoolModule.sol";
import {IPoPPHub} from "../../../interfaces/IPoPPHub.sol";

contract FinancePoolNFTModule is IFinancePoolModule {

    using SafeMath for uint256;
    struct Benefit {
        uint256 donateBenefit;
        uint256 collectBenefit;
        uint256 zanTotalCount;
        uint256 collectNtfTotalSupply;
        address collectHoldNtfAddress;
        uint256 collectHoldNtfTotalSupply;
        uint256 donateHoldNtfTotalSupply;
        address donateHoldNtfAddress;
        uint256 periodEndTime;
    }
    struct ProfitPoint {
        uint256 point;
        uint256 zanPoint;
        uint256 collectPoint;
        address profitNftAddress;
        uint256 profitNftPoint;
    }

    uint256 public period;
    uint256 public BPS_MAX;
    uint256 public profileId;
    uint256 public pubId;
    address public HUB;
    address public feeCollectModule;
    address public erc20Address;
    uint256 public periodEndTime;
    //历史总收益池子
    uint256 public benefitsHistory;
    mapping(address => uint256) public referralBenefit;
    mapping(address => uint256) public referralBenefitHistory;
    //periodEndTime => tokenId => claimedAmount
    mapping(uint256 => mapping(uint256 => uint256)) public claimedRecord;
    //periodEndTime => address => zanCount
    mapping(uint256 => mapping(address => uint256)) public addressZanCount;
    // address => zanCount
    mapping(address => uint256) public addressZanCountHistory;
    ProfitPoint public collectProfitPoint;
    ProfitPoint public donateProfitPoint;
    //可领取收益(结算上期)
    Benefit private _benefitsAvailableRecord;
    //当期数据
    Benefit private _benefitsOfThisPeriodRecord;
    bool inited = false;

    event NewPeriod(uint256 periodEndTime);
    event Zan(address owner, uint256 blockTime, uint256 periodEndTime);

    constructor(){}

    function init(address hub, address feeCollectModuleAddress, uint256 poppProfileId, uint256 publicationId, address erc20TokenAddress) public {
        require(!inited);
        inited = true;
        HUB = hub;
        feeCollectModule = feeCollectModuleAddress;
        profileId = poppProfileId;
        pubId = publicationId;
        period = 7 days;
        periodEndTime = block.timestamp + period;
        emit NewPeriod(periodEndTime);
        erc20Address = erc20TokenAddress;
        BPS_MAX = 10000;
    }

    function benefitsOfThisPeriodRecord() public view returns (Benefit memory){
        return _benefitsOfThisPeriodRecord;
    }
    function benefitsAvailableRecord() public view returns (Benefit memory){
        if (block.timestamp < periodEndTime){
            return _benefitsAvailableRecord;
        }
        return _benefitsOfThisPeriodRecord;
    }

    function calcReward(address owner) public view returns (uint256){
        (uint256 collect, uint256 referral, uint256 profit) = calcRewardSplit(owner);
        return collect + referral + profit;
    }

    function calcRewardSplit(address owner) public view returns (uint256 collect, uint256 referral, uint256 donate){
        referral = referralBenefit[owner];
        if (block.timestamp < periodEndTime){
            collect = _calcReward(owner, _benefitsAvailableRecord, collectProfitPoint, true);
            donate = _calcReward(owner, _benefitsAvailableRecord, donateProfitPoint, false);
        } else {
            collect = _calcReward(owner, _benefitsOfThisPeriodRecord, collectProfitPoint, true);
            donate = _calcReward(owner, _benefitsOfThisPeriodRecord, donateProfitPoint, false);
        }
    }

    function setCollectProfitPoint(uint256 point, uint256 zanPoint, uint256 collectPoint, address nftAddress, uint256 profitNftPoint) public {
        require(msg.sender == IERC721(HUB).ownerOf(profileId));
        require(point<=BPS_MAX);
        require(zanPoint+collectPoint+profitNftPoint<=BPS_MAX);
        collectProfitPoint.point = point;
        collectProfitPoint.zanPoint = zanPoint;
        collectProfitPoint.collectPoint = collectPoint;
        collectProfitPoint.profitNftAddress = nftAddress;
        collectProfitPoint.profitNftPoint = profitNftPoint;
    }

    function setDonateProfitPoint(uint256 point, uint256 zanPoint, uint256 collectPoint, address nftAddress, uint256 profitNftPoint) public {
        require(msg.sender == IERC721(HUB).ownerOf(profileId));
        require(point<=BPS_MAX);
        require(zanPoint+collectPoint+profitNftPoint<=BPS_MAX);
        donateProfitPoint.point = point;
        donateProfitPoint.zanPoint = zanPoint;
        donateProfitPoint.collectPoint = collectPoint;
        donateProfitPoint.profitNftAddress = nftAddress;
        donateProfitPoint.profitNftPoint = profitNftPoint;
    }

    function getReward() external {
        if (block.timestamp >= periodEndTime){
            setBenefitsAvailableRecord();
        }
        uint256 reward = calcReward(msg.sender);
        IERC20(erc20Address).transfer(msg.sender, reward);
        _getReward(msg.sender, collectProfitPoint.profitNftAddress);
        _getReward(msg.sender, donateProfitPoint.profitNftAddress);
    }

    function zan() external {
        if (block.timestamp >= periodEndTime) {
            setBenefitsAvailableRecord();

            _benefitsOfThisPeriodRecord.donateBenefit = 0;
            _benefitsOfThisPeriodRecord.collectBenefit = 0;
            _benefitsOfThisPeriodRecord.zanTotalCount = 1;
        } else {
            _benefitsOfThisPeriodRecord.zanTotalCount += 1;
        }
        addressZanCount[periodEndTime][msg.sender] += 1;
        addressZanCountHistory[msg.sender] += 1;
        emit Zan(msg.sender, block.timestamp, periodEndTime);
    }

    //打赏记录
    function depositERC20ByDonor(uint amount) external {
        require(msg.sender == HUB, 'Not HUB');
        bool nextPeriod = _benefit(amount);
        if (nextPeriod) {
            setBenefitsAvailableRecord();

            _benefitsOfThisPeriodRecord.donateBenefit = amount;
            _benefitsOfThisPeriodRecord.collectBenefit = 0;
            _benefitsOfThisPeriodRecord.zanTotalCount = 0;
        } else {
            _benefitsOfThisPeriodRecord.donateBenefit += amount;
        }
    }

    //收藏记录
    function depositERC20ByCollect(uint amount) external {
        require(msg.sender == feeCollectModule, 'Not feeCollectModule');
        bool nextPeriod = _benefit(amount);
        if (nextPeriod) {
            setBenefitsAvailableRecord();

            _benefitsOfThisPeriodRecord.donateBenefit = 0;
            _benefitsOfThisPeriodRecord.collectBenefit = amount;
            _benefitsOfThisPeriodRecord.zanTotalCount = 0;
        } else {
            _benefitsOfThisPeriodRecord.collectBenefit += amount;
        }
    }

    //转发收益记录
    function depositERC20ByReferral(address referAddress, uint amount) external {
        require(msg.sender == feeCollectModule || msg.sender == HUB, 'Not feeCollectModule or hub');
        bool nextPeriod = _benefit(amount);
        if (nextPeriod) {
            setBenefitsAvailableRecord();
            _benefitsOfThisPeriodRecord.donateBenefit = 0;
            _benefitsOfThisPeriodRecord.collectBenefit = 0;
            _benefitsOfThisPeriodRecord.zanTotalCount = 0;
        }
        referralBenefit[referAddress] += amount;
        referralBenefitHistory[referAddress] += amount;
    }

    function setBenefitsAvailableRecord() internal {
        _benefitsAvailableRecord.donateBenefit = _benefitsOfThisPeriodRecord.donateBenefit;
        _benefitsAvailableRecord.collectBenefit = _benefitsOfThisPeriodRecord.collectBenefit;
        _benefitsAvailableRecord.zanTotalCount = _benefitsOfThisPeriodRecord.zanTotalCount;
        address collectNftAddress = IPoPPHub(HUB).getCollectNFT(profileId, pubId);
        _benefitsAvailableRecord.collectNtfTotalSupply = IERC721Enumerable(collectNftAddress).totalSupply();

        if (collectProfitPoint.profitNftAddress != address(0)){
            _benefitsAvailableRecord.collectHoldNtfAddress = collectProfitPoint.profitNftAddress;
            _benefitsAvailableRecord.collectHoldNtfTotalSupply = IERC721Enumerable(_benefitsAvailableRecord.collectHoldNtfAddress).totalSupply();
        }

        if (donateProfitPoint.profitNftAddress != address(0)){
            _benefitsAvailableRecord.donateHoldNtfAddress = donateProfitPoint.profitNftAddress;
            _benefitsAvailableRecord.donateHoldNtfTotalSupply = IERC721Enumerable(_benefitsAvailableRecord.donateHoldNtfAddress).totalSupply();
        }

        _benefitsAvailableRecord.periodEndTime = periodEndTime;
        periodEndTime = block.timestamp + period;
        emit NewPeriod(periodEndTime);
    }

    function _getReward(address owner, address nftAddress) internal {
        IERC721 erc721 = IERC721(nftAddress);
        IERC721Enumerable erc721Enumerable = IERC721Enumerable(nftAddress);
        uint256 balance = erc721.balanceOf(owner);
        for (uint8 i = 0; i < balance; i++) {
            uint256 tokenId = erc721Enumerable.tokenOfOwnerByIndex(owner, i);
            claimedRecord[periodEndTime][tokenId] == 1;
        }
    }

    function _benefit(uint amount) internal returns (bool){
        benefitsHistory += amount;
        if (block.timestamp >= periodEndTime) {
            return true;
        }
        return false;
    }

    function _calcReward(address owner, Benefit memory benefit, ProfitPoint memory profitPoint, bool collect) internal view returns (uint256){
        if (profitPoint.profitNftAddress==address(0) || IERC721(profitPoint.profitNftAddress).balanceOf(owner) == 0) {
            return 0;
        }
        uint totalReward = 0;
        if (collect){
            totalReward = benefit.collectBenefit.mul(profitPoint.point).div(BPS_MAX);
        } else {
            totalReward = benefit.donateBenefit.mul(profitPoint.point).div(BPS_MAX);
        }
        uint256 ownerZanCount = addressZanCount[periodEndTime][owner];
        uint256 reward = 0;
        if (benefit.zanTotalCount>0){
            reward = totalReward.mul(profitPoint.zanPoint).div(BPS_MAX).mul(ownerZanCount).div(benefit.zanTotalCount);
        }
        if (benefit.collectNtfTotalSupply>0){
            address collectNftAddress = IPoPPHub(HUB).getCollectNFT(profileId, pubId);
            uint256 collectNftBalance = IERC721(collectNftAddress).balanceOf(owner);
            IERC721Enumerable collectNftEnumerable = IERC721Enumerable(collectNftAddress);
            for (uint256 i = 0; i < collectNftBalance; i++) {
                if (claimedRecord[periodEndTime][collectNftEnumerable.tokenOfOwnerByIndex(owner, i)] == 0) {
                    reward = reward.add(totalReward.mul(profitPoint.collectPoint).div(BPS_MAX).div(benefit.collectNtfTotalSupply));
                }
            }
        }
        if (collect && benefit.collectHoldNtfTotalSupply > 0){
            address nftAddress = benefit.collectHoldNtfAddress;
            uint256 balance = IERC721(nftAddress).balanceOf(owner);
            IERC721Enumerable enumerable = IERC721Enumerable(nftAddress);
            for (uint256 i = 0; i < balance; i++) {
                if (claimedRecord[periodEndTime][enumerable.tokenOfOwnerByIndex(owner, i)] == 0) {
                    reward = reward.add(totalReward.mul(profitPoint.profitNftPoint).div(BPS_MAX).div(benefit.collectHoldNtfTotalSupply));
                }
            }
        } else if (benefit.donateHoldNtfTotalSupply > 0){
            address nftAddress = benefit.donateHoldNtfAddress;
            uint256 balance = IERC721(nftAddress).balanceOf(owner);
            IERC721Enumerable enumerable = IERC721Enumerable(nftAddress);
            for (uint256 i = 0; i < balance; i++) {
                if (claimedRecord[periodEndTime][enumerable.tokenOfOwnerByIndex(owner, i)] == 0) {
                    reward = reward.add(totalReward.mul(profitPoint.profitNftPoint).div(BPS_MAX).div(benefit.donateHoldNtfTotalSupply));
                }
            }
        }

        return reward;
    }
}
