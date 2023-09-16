// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

interface IFinancePoolModule {
    function init(address hub, address feeCollectModule, uint256 profileId, uint256 pubId, address erc20Address) external;
    function calcReward(address owner) external view returns(uint256);
    function getReward() external;
    function depositERC20ByDonor(uint amount) external;
    function depositERC20ByCollect(uint amount) external;
    function depositERC20ByReferral(address referAddress, uint amount) external;
}
