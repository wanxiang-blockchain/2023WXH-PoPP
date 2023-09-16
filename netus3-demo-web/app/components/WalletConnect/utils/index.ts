/**
 * 主要针对于walletconnect v2连接器
 * 用户在断开链接或者重置时候，将缓存中清除，提高链接效率
 */
export const localStorageResetState = () => {
	localStorage.removeItem('wc@2:core:0.3//keychain')
	localStorage.removeItem('wc@2:universal_provider:/namespaces')
	localStorage.removeItem('wc@2:universal_provider:/optionalNamespaces')
	localStorage.removeItem('wc@2:core:0.3//pairing')
	localStorage.removeItem('wc@2:core:0.3//subscription')
	localStorage.removeItem('wc@2:core:0.3//expirer')
	localStorage.removeItem('wc@2:core:0.3//history')
	localStorage.removeItem('wc@2:client:0.3//proposal')
	localStorage.removeItem('wc@2:client:0.3//session')
	localStorage.removeItem('wc@2:ethereum_provider:/chainId')
	localStorage.removeItem('wc@2:universal_provider:/sessionProperties')
	localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE')
}
