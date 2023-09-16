// wallet connect 钱包APP  info
export type WalletConnectV2ListInfoType = {
	id: string
	name: string
	homepage: string
	image_id: string
	order: number
	app: any
	injected: any
	mobile: {
		native: string
		universal: any
	}
	desktop: { native: any; universal: any }
	imageName: string
	image?: any
}

// 用户成功链接后的状态
export type OnConnectType = {
	status: WalletTypes
}

// modal 支持的弹起方向
export type PlacementType = 'buttom' | 'right' | 'left' | 'top'

// 钱包支持连接器的方式
export type WalletTypes = 'NetWork' | 'MetaMask' | 'WalletConnectV2'

// 选择链的信息
export type ChainNetworkInfoType = {
	name: string
	fullName: string
	image: string | any
	chainId: number
	unit: string
}

// 选择钱包的信息
export type WalletMethodType = {
	name: string
	icon: string
	link: string
}

// 合约参数
export type UseConstantType = {
	[chainId: number]: ConstantChainIdType
}

export type ConstantChainIdType = {
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
	apiUrl: string
	apiKey: string
}
