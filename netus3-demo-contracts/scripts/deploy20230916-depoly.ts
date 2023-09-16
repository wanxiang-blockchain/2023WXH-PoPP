import '@nomiclabs/hardhat-ethers';
import { hexlify, keccak256, RLP } from 'ethers/lib/utils';
import fs from 'fs';

import {

  PoPPV2Hub__factory,
  PoPPFeeCollectModule__factory,
  FinancePoolNFTModule__factory,
  ModuleGlobals__factory,
  PoPPProfileNFT__factory,
  FollowNFT__factory,
  CollectNFT__factory,
  PlanetBase__factory,
  FollowerPoPPReferenceModule__factory, ProfileFollowModule__factory, DAI__factory
} from "../typechain-types";
import { deployContract, waitForTx, waitForTxWithConsole } from "../tasks/helpers/utils";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber, BigNumberish, BytesLike } from "ethers";

const TREASURY_FEE_BPS = 50;
const HUB_NFT_NAME = 'POPP Protocol Profiles';
const HUB_NFT_SYMBOL = 'PPP';

async function main() {


  const [deployer, governance, treasuryAddress, testAddress, testAddress1]: SignerWithAddress[] = await ethers.getSigners();

  // Nonce management in case of deployment issues
  let deployerNonce = await ethers.provider.getTransactionCount(deployer.address);

  //ModuleGlobals constructor(address governance,address treasury,uint16 treasuryFee)
  console.log('\n\t-- Deploying Module Globals --', deployerNonce, deployerNonce+1);
  const moduleGlobals = await deployContract(
    new ModuleGlobals__factory(deployer).deploy(
      deployer.address,
      treasuryAddress.address,
      TREASURY_FEE_BPS,
      {
        gasPrice: 150000000000,
        nonce: deployerNonce,
      }
    )
  );


  const hubNonce = hexlify(deployerNonce + 4);
  const followNFTNonce = hexlify(deployerNonce + 5);
  const collectNFTNonce = hexlify(deployerNonce + 6);

  const hubAddress =
    '0x' + keccak256(RLP.encode([deployer.address, hubNonce])).substr(26);
  const followNFTImplAddress =
    '0x' + keccak256(RLP.encode([deployer.address, followNFTNonce])).substr(26);
  const collectNFTImplAddress =
    '0x' + keccak256(RLP.encode([deployer.address, collectNFTNonce])).substr(26);

  //PoPPProfileNFT constructor(address followNFTImpl, address collectNFTImpl)
  //PoPPProfileNFT function initialize(string calldata name,string calldata symbol,address newGovernance,address poppHubAddress)
  console.log('\n\t-- Deploying poppProfile --', deployerNonce);
  const poppProfile =  await deployContract(
    new PoPPProfileNFT__factory(deployer).deploy(
      followNFTImplAddress, collectNFTImplAddress,
      {
        nonce: deployerNonce+1,
        gasPrice: 150000000000,
      }
    )
  );


  //FinancePoolNFTModule constructor()
  console.log('\n\t-- Deploying financePoolImpl --', deployerNonce);
  const financePoolImpl =  await deployContract(
    new FinancePoolNFTModule__factory(deployer).deploy(
      {
        nonce: deployerNonce+2,
        gasPrice: 150000000000,
      }
    )
  );

  //PlanetBase  constructor(address poppHubAddress, address planetProfile)
  console.log('\n\t-- Deploying planetBase --', deployerNonce);
  const planetBase =  await deployContract(
    new PlanetBase__factory(deployer).deploy(
      hubAddress,
      poppProfile.address,
      {
        nonce: deployerNonce+3,
        gasPrice: 150000000000,
      }
    )
  );

  const erc20Address = '0x06aaB169089C54786C88D23Dc5934908B3528A76';
  const erc20 = DAI__factory.connect(erc20Address, deployer);

  console.log('\n\t-- Deploying planetBase end --', deployerNonce);

  //PoPPV2Hub constructor(address _profileAddress, address _planetBaseAddress, address financePoolImpl)
  console.log('\n\t-- Deploying hub --', deployerNonce);
  const hub =  await deployContract(
    new PoPPV2Hub__factory(deployer).deploy(
      poppProfile.address,
      planetBase.address,
      financePoolImpl.address,
      erc20.address,
      {
        nonce: hubNonce,
        gasPrice: 150000000000,
      }
    )
  );
  console.log('\n\t-- hub address --', hub.address, hubAddress);

  //FollowNFT constructor(address hub)
  console.log('\n\t-- Deploying followNFTImpl --', deployerNonce);
  const followNFTImpl =  await deployContract(
    new FollowNFT__factory(deployer).deploy(
      hub.address,
      {
        nonce: followNFTNonce,
        gasPrice: 150000000000,
      }
    )
  );
  //FollowNFT function initialize(uint256 profileId) external

  //CollectNFT constructor(address hub)
  console.log('\n\t-- Deploying collectNFTImpl --', deployerNonce);
  const collectNFTImpl =  await deployContract(
    new CollectNFT__factory(deployer).deploy(
      hub.address,
      {
        nonce: collectNFTNonce,
        gasPrice: 150000000000,
      }
    )
  );
  //CollectNFT function initialize(uint256 profileId,uint256 pubId,string calldata name,string calldata symbol)

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- poppProfile.initialize --', deployerNonce, hubAddress);
  await waitForTx(
    poppProfile.initialize(
      HUB_NFT_NAME,
      HUB_NFT_SYMBOL,
      deployer.address,
      hubAddress, {
        gasPrice: 150000000000,
        nonce: deployerNonce,
      })
  );
  await poppProfile.POPP_HUB().then(console.log)

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  //FollowerPoPPReferenceModule constructor(address hub)
  console.log('\n\t-- Deploying followerPoPPReferenceModule --', deployerNonce);
  const followerPoPPReferenceModule =  await deployContract(
    new FollowerPoPPReferenceModule__factory(deployer).deploy(
      hub.address,
      {
        nonce: deployerNonce,
        gasPrice: 150000000000,
      }
    )
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- poppProfile.whitelistReferenceModule --', deployerNonce);
  await waitForTx(
    poppProfile.whitelistReferenceModule(followerPoPPReferenceModule.address, true, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  //ProfileFollowModule  constructor(address hub)
  console.log('\n\t-- Deploying profileFollowModule --', deployerNonce);
  const profileFollowModule =  await deployContract(
    new ProfileFollowModule__factory(deployer).deploy(
      hub.address,
      {
        nonce: deployerNonce,
        gasPrice: 150000000000,
      }
    )
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- poppProfile.whitelistFollowModule --', deployerNonce);
  await waitForTx(
    poppProfile.whitelistFollowModule(profileFollowModule.address, true, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  //PoPPFeeCollectModule constructor(address hub, address moduleGlobals)
  console.log('\n\t-- Deploying poPPFeeCollectModule --', deployerNonce);
  const poPPFeeCollectModule =  await deployContract(
    new PoPPFeeCollectModule__factory(deployer).deploy(
      hub.address,
      moduleGlobals.address,
      {
        nonce: deployerNonce,
        gasPrice: 150000000000,
      }
    )
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- poppProfile.whitelistCollectModule --', deployerNonce);
  await waitForTx(
    poppProfile.whitelistCollectModule(poPPFeeCollectModule.address, true, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  );

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- poppProfile.whitelistCollectModule --', deployerNonce);
  await waitForTx(
    poppProfile.whitelistFinancePoolModule(financePoolImpl.address, true, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  );

  console.log('\n\t-- moduleGlobals.whitelistCurrency --', deployerNonce);
  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  await waitForTx(
    moduleGlobals.whitelistCurrency(erc20.address, true, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  )

  const addrs = {
    'hub': hub.address,
    'poppProfile:': poppProfile.address,
    'planetBase': planetBase.address,
    'financePoolImpl': financePoolImpl.address,
    'follow NFT impl': followNFTImpl.address,
    'collect NFT impl': collectNFTImplAddress,
    'module globals': moduleGlobals.address,
    'fee collect module': poPPFeeCollectModule.address,
    'profile follow module': profileFollowModule.address,
    'FollowerPoPPReferenceModule': followerPoPPReferenceModule.address,
  };
  const json = JSON.stringify(addrs, null, 2);
  console.log(json);

  deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log('\n\t-- setState --');
  await waitForTx(
    poppProfile.setState(0, {
      gasPrice: 150000000000,
      nonce: deployerNonce,
    })
  );

}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

// npx hardhat run scripts/deploy20230916-depoly.ts --network hardhat
// npx hardhat run scripts/deploy20230916-depoly.ts --network opBNB
// npx hardhat run scripts/deploy20230916-depoly.ts --network mumbai
// npx hardhat run scripts/deploy20230916-depoly.ts --network polygon
