// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {DataTypes} from "../libraries/DataTypes.sol";

interface IProfile {
    function ownerOf(uint256 profileId) external view returns (address);

    function balanceOf(address profileId) external view returns (uint256);

    function getFollowModule(uint256 profileId) external view returns (address);

    function getProfileById(uint256 profileId) external view returns (DataTypes.ProfileStruct memory);

    function getProfileIdByHandle(string calldata handle) external view returns (uint256);

    function getProfileIdByHandleBytes32(bytes32 handle) external view returns (uint256);

    function getFollowNFTImpl() external view returns (address);

    function getCollectNFTImpl() external view returns (address);

    function validateCallerIsProfileOwner(address _owner, uint256 profileId) external view;

    function validateCallerIsProfileOwnerOrDispatcher(address _owner, uint256 profileId) external view;

    function isCollectModuleWhitelisted(address collectModule) external view returns (bool);

    function isReferenceModuleWhitelisted(address referenceModule) external view returns (bool);

    function isFinancePoolModuleWhitelisted(address financePoolModule) external view returns (bool);

    function addPubCount(uint256 profileId) external returns (uint256);

    function setFollowNFT(uint256 profileId, address _followNFT) external;

    function createProfile(DataTypes.CreateProfileData calldata vars) external returns (uint256);
}
