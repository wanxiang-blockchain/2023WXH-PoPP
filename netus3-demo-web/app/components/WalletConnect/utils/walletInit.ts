import { initializeConnector } from '@web3-react/core'
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2'

import { CHAINS } from '@/contracts/chains'

/**
 * mainnet - default ChainId
 * optionalChains - other ChainIds
 */
const [mainnet, ...optionalChains] = Object.keys(CHAINS).map(Number)

/**
 * web端，调用walletconnect v2官方连接器时候，启用
 */
export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
	actions =>
		new WalletConnectV2({
			actions,
			options: {
				projectId: process.env.walletConnectProjectId || '46e0742f7e47ff9d8158e939e5161615',
				chains: [mainnet],
				optionalChains,
				showQrModal: true,
				qrModalOptions: {
					themeMode: 'light',
					themeVariables: {
						'--wcm-background-border-radius': '20px',
						'--wcm-z-index': '9999',
					},
					explorerRecommendedWalletIds: [
						'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
						'971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
						'38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
						'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef',
						'4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
						'20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66',
						'ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18',
					],
					explorerExcludedWalletIds: 'ALL',
				},
				metadata: {
					name: 'PoPP',
					description: 'PoPP for WalletConnect',
					url: 'https://deme.studio/',
					icons: ['https://poppclub.oss-cn-chengdu.aliyuncs.com/image/logo-square.svg'],
				},
			},
		}),
)
