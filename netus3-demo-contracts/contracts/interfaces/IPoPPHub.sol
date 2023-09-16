// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

interface IPoPPHub{

    function balanceOf(address profileId) external view returns (uint256);
    function ownerOf(uint256 profileId) external view returns (address);
    function getFollowNFT(uint256 profileId) external view returns (address);
    function getCollectNFT(uint256 profileId, uint256 pubId) external view returns (address);
    function getHandle(uint256 profileId) external view returns (string memory);
    function getFinancePool(uint256 profileId, uint256 pubId) external view returns (address);
    function getFollowNFTURI(uint256 profileId) external view returns (string memory);
    function getFollowModule(uint256 profileId) external view returns (address);
    function emitFollowNFTTransferEvent(uint256 profileId,uint256 followNFTId,address from,address to) external;
    function getContentURI(uint256 profileId, uint256 pubId) external view returns (string memory);
    function emitCollectNFTTransferEvent(
        uint256 profileId,
        uint256 pubId,
        uint256 collectNFTId,
        address from,
        address to
    ) external;
}
