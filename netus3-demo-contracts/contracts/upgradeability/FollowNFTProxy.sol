// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;


import {Proxy} from '@openzeppelin/contracts/proxy/Proxy.sol';
import {Address} from '@openzeppelin/contracts/utils/Address.sol';

interface IPoPPHub{
    function getHandle(uint256 profileId) external view returns (string memory);
    function getFollowNFTURI(uint256 profileId) external view returns (string memory);
    function getFollowNFTImpl() external view returns (address);
    function getCollectNFTImpl() external view returns (address);
}

contract FollowNFTProxy is Proxy {
    using Address for address;
    address immutable HUB;

    constructor(bytes memory data) {
        HUB = msg.sender;
        IPoPPHub(msg.sender).getFollowNFTImpl().functionDelegateCall(data);
    }

    function _implementation() internal view override returns (address) {
        return IPoPPHub(HUB).getFollowNFTImpl();
    }
}
