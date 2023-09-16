import { CHAINS } from '@/contracts/chains'
import type { UseConstantType } from '@/types'
import { REACT_APP_ENV } from '@/contracts/chains'

import Events from '@/contracts/abi/Events.json'
import Hub from '@/contracts/abi/PoPPV2Hub.json'
import PoPPProfile from '@/contracts/abi/PoPPProfileNFT.json'
import PlanetBase from '@/contracts/abi/PlanetBase.json'
import FinancePoolNFTModule from '@/contracts/abi/FinancePoolNFTModule.json'
import FollowNFT from '@/contracts/abi/FollowNFT.json'
import CollectNFT from '@/contracts/abi/CollectNFT.json'
import ModuleGlobals from '@/contracts/abi/ModuleGlobals.json'
import FeeCollectModule from '@/contracts/abi/PoPPFeeCollectModule.json'
import ProfileFollowModule from '@/contracts/abi/ProfileFollowModule.json'
import FollowerPoPPReferenceModule from '@/contracts/abi/FollowerPoPPReferenceModule.json'
import AuthModuleBase from '@/contracts/abi/AuthModuleBase.json'
import AuthHub from '@/contracts/abi/AuthHub.json'
import DAI from '@/contracts/abi/DAI.json'

// 默认链
export const DEFAULT_CHAINID: number = Object.keys(CHAINS).map(Number)[0]

// 判断是否支持该链
export const getActiveChainId = (arr: string[], network: number) => {
	if (network === null) return false
	return arr.some(item => Number(item) === Number(network))
}

// 配置环境变量的合约参数
export const useConstant: { [env: string]: UseConstantType } = {
	dev: {
		137: {
			Hub_ADDRESS: '0xF56D5ed0D91d3419D4B90fb2EbeC51aa67429DD6',
			PoPP_Profile_ADDRESS: '0x04bb645d87baa75DADDc9B71aFE870CE3c863861',
			Planet_Base_ADDRESS: '0xB7fb7B8a34EB58A17e375699886F11812aC67E3B',
			Finance_Pool_Impl_ADDRESS: '0xFEAD1D6502192FDaC57820F15a11A73cba0d71A2',
			Follow_NFT_Impl_ADDRESS: '0xfb77B845C8D6b4536Bd2e5281d466718809729E5',
			Collect_NFT_Impl_ADDRESS: '0x0f032c1b52356c8c21c9d4fe8827e756eaa68600',
			Module_Globals_ADDRESS: '0x035Bc18f0B9ae79A32704134463fc36eE098a9f4',
			Fee_Collect_Module_ADDRESS: '0xC6F96Ca19C5ccd06AA0508261E811C3C741fA9D3',
			Profile_Follow_Module_ADDRESS: '0xF532bBD87D61Ba301ce48ba44E88d843410333Fc',
			Follower_PoPP_Reference_Module_ADDRESS: '0xeD37E5f40e6cB260dE0f9A90B05eB8eECed3c9bC',
			Auth_Hub_ADDRESS: '0x0CbCD2F50A3FF0C94cDC6e5037190A6030a338bd',
			Auth_Module_Base_ADDRESS: '0xBCeba77E7e67Fb19Faea9977b7f74740cB04FB23',
			DAI_ADDRESS: '0x06aaB169089C54786C88D23Dc5934908B3528A76',
			apiKey: '',
			apiUrl: '',
		},
	},
	prd: {
		137: {
			Hub_ADDRESS: '',
			PoPP_Profile_ADDRESS: '',
			Planet_Base_ADDRESS: '',
			Finance_Pool_Impl_ADDRESS: '',
			Follow_NFT_Impl_ADDRESS: '',
			Collect_NFT_Impl_ADDRESS: '',
			Module_Globals_ADDRESS: '',
			Fee_Collect_Module_ADDRESS: '',
			Profile_Follow_Module_ADDRESS: '',
			Follower_PoPP_Reference_Module_ADDRESS: '',
			Auth_Hub_ADDRESS: '',
			Auth_Module_Base_ADDRESS: '',
			DAI_ADDRESS: '',
			apiKey: '',
			apiUrl: '',
		},
	},
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const USECONSTANT: UseConstantType = useConstant[REACT_APP_ENV]

export const Events_ABI: any = Events
export const Hub_ABI: any = Hub
export const PoPPProfile_ABI: any = PoPPProfile
export const PlanetBase_ABI: any = PlanetBase
export const FinancePoolNFTModule_ABI: any = FinancePoolNFTModule
export const FollowNFT_ABI: any = FollowNFT
export const CollectNFT_ABI: any = CollectNFT
export const ModuleGlobals_ABI: any = ModuleGlobals
export const FeeCollectModule_ABI: any = FeeCollectModule
export const ProfileFollowModule_ABI: any = ProfileFollowModule
export const FollowerPoPPReferenceModule_ABI: any = FollowerPoPPReferenceModule
export const AuthModuleBase_ABI: any = AuthModuleBase
export const AuthHub_ABI: any = AuthHub
export const DAI_ABI: any = DAI
