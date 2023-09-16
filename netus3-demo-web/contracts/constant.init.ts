import Web3 from 'web3'
import { REACT_APP_ENV } from '@/contracts/chains'
import BigNumber from 'bignumber.js'
import {
	AuthModuleBase_ABI,
	CollectNFT_ABI,
	FeeCollectModule_ABI,
	FinancePoolNFTModule_ABI,
	FollowNFT_ABI,
	FollowerPoPPReferenceModule_ABI,
	Hub_ABI,
	ModuleGlobals_ABI,
	PlanetBase_ABI,
	PoPPProfile_ABI,
	ProfileFollowModule_ABI,
	AuthHub_ABI,
	USECONSTANT,
	DAI_ABI,
} from '@/contracts/constant'

export interface ConstantTypes {
	ContractHub: any
	ContractPoPPProfile: any
	ContractPlanetBase: any
	ContractFinancePoolImpl: any
	ContractFollowNFTImpl: any
	ContractCollectNFTImpl: any
	ContractModuleGlobals: any
	ContractFeeCollectModule: any
	ContractProfileFollowModule: any
	ContractFollowerPoPPReferenceModule: any
	ContractAuthModuleBase: any
	ContractAuthHub: any
	ContractDai: any
}
/**
 * web3 - 根据不同环境、不同链的实例化
 * toWeiPowBanlance - 加多少0 decimals: 多少个0 . balance: 金额
 * fromWeiPowBanlance - 去掉多少个0,保留6位小数
 * fromWeiPowBanlances - 去掉多少个0,保留全局小数
 */
export interface ConstantInitTypes {
	web3: Web3
	constant: ConstantTypes
	apiUrl: string
	apiKey: string
	Hub_ADDRESS: string
	PoPP_Profile_ADDRESS: string
	Planet_Base_ADDRESS: string
	Finance_Pool_Impl_ADDRESS: string
	Follow_NFT_Impl_ADDRESS: string
	Collect_NFT_Impl_ADDRESS: string
	Module_Globals_ADDRESS: string
	Fee_Collect_Module_ADDRESS: string
	Profile_Follow_Module_ADDRESS: string
	Follower_PoPP_Reference_Module_ADDRESS: string
	Auth_Hub_ADDRESS: string
	Auth_Module_Base_ADDRESS: string
	DAI_ADDRESS: string
	toWeiPowBanlance: ({ decimals, balance }: { decimals: string; balance: string }) => string
	fromWeiPowBanlance: ({ decimals, balance }: { decimals: string; balance: string }) => string
	fromWeiPowBanlances: ({ decimals, balance }: { decimals: string; balance: string }) => string
}

export class ConstantInit {
	web3: Web3
	constant: ConstantTypes
	apiUrl: string
	apiKey: string
	Hub_ADDRESS: string
	PoPP_Profile_ADDRESS: string
	Planet_Base_ADDRESS: string
	Finance_Pool_Impl_ADDRESS: string
	Follow_NFT_Impl_ADDRESS: string
	Collect_NFT_Impl_ADDRESS: string
	Module_Globals_ADDRESS: string
	Fee_Collect_Module_ADDRESS: string
	Profile_Follow_Module_ADDRESS: string
	Follower_PoPP_Reference_Module_ADDRESS: string
	Auth_Hub_ADDRESS: string
	Auth_Module_Base_ADDRESS: string
	DAI_ADDRESS: string

	constructor(provider: any, chainId: number) {
		const {
			Hub_ADDRESS,
			PoPP_Profile_ADDRESS,
			Planet_Base_ADDRESS,
			Finance_Pool_Impl_ADDRESS,
			Follow_NFT_Impl_ADDRESS,
			Collect_NFT_Impl_ADDRESS,
			Module_Globals_ADDRESS,
			Fee_Collect_Module_ADDRESS,
			Profile_Follow_Module_ADDRESS,
			Follower_PoPP_Reference_Module_ADDRESS,
			Auth_Hub_ADDRESS,
			Auth_Module_Base_ADDRESS,
			apiKey,
			apiUrl,
			DAI_ADDRESS,
		} = USECONSTANT[chainId]

		this.web3 = new Web3(provider)
		this.apiUrl = apiUrl
		this.apiKey = apiKey
		this.Hub_ADDRESS = Hub_ADDRESS
		this.PoPP_Profile_ADDRESS = PoPP_Profile_ADDRESS
		this.Planet_Base_ADDRESS = Planet_Base_ADDRESS
		this.Finance_Pool_Impl_ADDRESS = Finance_Pool_Impl_ADDRESS
		this.Follow_NFT_Impl_ADDRESS = Follow_NFT_Impl_ADDRESS
		this.Collect_NFT_Impl_ADDRESS = Collect_NFT_Impl_ADDRESS
		this.Module_Globals_ADDRESS = Module_Globals_ADDRESS
		this.Fee_Collect_Module_ADDRESS = Fee_Collect_Module_ADDRESS
		this.Profile_Follow_Module_ADDRESS = Profile_Follow_Module_ADDRESS
		this.Follower_PoPP_Reference_Module_ADDRESS = Follower_PoPP_Reference_Module_ADDRESS
		this.Auth_Hub_ADDRESS = Auth_Hub_ADDRESS
		this.Auth_Module_Base_ADDRESS = Auth_Module_Base_ADDRESS
		this.DAI_ADDRESS = DAI_ADDRESS
		this.constant = {
			ContractHub: new this.web3.eth.Contract(Hub_ABI, Hub_ADDRESS),
			ContractPoPPProfile: new this.web3.eth.Contract(PoPPProfile_ABI, PoPP_Profile_ADDRESS),
			ContractPlanetBase: new this.web3.eth.Contract(PlanetBase_ABI, Planet_Base_ADDRESS),
			ContractFinancePoolImpl: new this.web3.eth.Contract(FinancePoolNFTModule_ABI, Finance_Pool_Impl_ADDRESS),
			ContractFollowNFTImpl: new this.web3.eth.Contract(FollowNFT_ABI, Follow_NFT_Impl_ADDRESS),
			ContractCollectNFTImpl: new this.web3.eth.Contract(CollectNFT_ABI, Collect_NFT_Impl_ADDRESS),
			ContractModuleGlobals: new this.web3.eth.Contract(ModuleGlobals_ABI, Module_Globals_ADDRESS),
			ContractFeeCollectModule: new this.web3.eth.Contract(FeeCollectModule_ABI, Fee_Collect_Module_ADDRESS),
			ContractProfileFollowModule: new this.web3.eth.Contract(ProfileFollowModule_ABI, Profile_Follow_Module_ADDRESS),
			ContractFollowerPoPPReferenceModule: new this.web3.eth.Contract(
				FollowerPoPPReferenceModule_ABI,
				Follower_PoPP_Reference_Module_ADDRESS,
			),
			ContractAuthModuleBase: new this.web3.eth.Contract(AuthModuleBase_ABI, Auth_Module_Base_ADDRESS),
			ContractAuthHub: new this.web3.eth.Contract(AuthHub_ABI, Auth_Hub_ADDRESS),
			ContractDai: new this.web3.eth.Contract(DAI_ABI, DAI_ADDRESS),
		}

		// console.log('REACT_APP_ENV', REACT_APP_ENV)
	}

	fromWeiPowBanlance = ({ decimals, balance }: { decimals: string; balance: string }) => {
		let wei = new BigNumber(10).pow(decimals)
		let balances = new BigNumber(balance).div(wei).toFixed(6)
		return balances
	}

	fromWeiPowBanlances = ({ decimals, balance }: { decimals: string; balance: string }) => {
		let wei = new BigNumber(10).pow(decimals)
		let balances = new BigNumber(balance).div(wei)
		return balances.toString()
	}

	toWeiPowBanlance = ({ decimals, balance }: { decimals: string; balance: string }) => {
		let wei = new BigNumber(10).pow(decimals)
		let balances = new BigNumber(balance).times(wei).toFixed(0)
		return balances
	}
}
