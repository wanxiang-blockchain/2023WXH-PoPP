// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import {DataTypes} from "../libraries/DataTypes.sol";

interface IPlanetBase {
    function baseInfo(uint256 baseId) external view returns (DataTypes.BaseInfo memory);

    function authCheck(address addr, uint256 baseId) external view returns (bool, bool);

    function createPlanetBase(DataTypes.BaseInfo calldata vars) external returns (uint256);

    function removePlanetBase(uint planetProfileId, uint baseId) external;

    function setAuth(uint256 baseId, address joinNft, address postNft) external;
}
