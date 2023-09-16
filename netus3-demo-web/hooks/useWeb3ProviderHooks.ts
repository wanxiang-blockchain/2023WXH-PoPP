'use client'
import { useEffect } from 'react'
import { URLS } from '@/contracts/chains'
import { getActiveChainId } from '@/contracts/constant'
import type WalletConnectProvider from '@walletconnect/ethereum-provider'
import { walletConnectV2 } from '@/connectors/walletConnectV2'
import { metaMask } from '@/connectors/metaMask'

import { useAppSelector } from '@/redux/hooks'
import { saveIsLogin, saveWalletType } from '@/redux/walletConnect'
import { localStorageResetState } from '@/app/components/WalletConnect/utils'
import { toast } from 'react-hot-toast'

// 刷新-是否重连监听器-walletType判断上次链的方式
export const useEagerConnect = (chainId: number | undefined) => {
	const chainIds = Object.keys(URLS)
	const walletType = useAppSelector(state => state.walletConnectReducer.walletType)

	useEffect(() => {
		walletType === 'WalletConnectV2' && void walletConnectV2.connectEagerly()
		walletType === 'MetaMask' && void getInjectedEagerly()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const getInjectedEagerly = async () => {
		if (!chainId) {
			void metaMask.connectEagerly()
			return
		}
		let isTrue = getActiveChainId(chainIds, chainId)
		isTrue && void metaMask.connectEagerly()
	}
}

// 监听WalletConnect链接后的的一些事件触发
export const UseWatchWalletConnectConnect = ({
	provider,
	dispatch,
	t,
}: {
	provider: WalletConnectProvider | any
	dispatch: any
	t: any
}) => {
	const chainIds = Object.keys(URLS)

	provider?.on('chainChanged', (chainId: any) => {
		let isTrue = getActiveChainId(chainIds, chainId)
		console.log('chainChanged', isTrue, chainId)
		if (!isTrue) {
			toast.error(t('wallet.swtich.chainIds.tips', { msg: chainId.toString(10) }))
			setTimeout(() => void walletConnectV2.deactivate(), 5000)
		}
	})
	provider?.on('accountsChanged', (accounts: string[]) => {
		console.log('accounts', accounts)
	})
	provider?.on('disconnect', () => {
		console.log('disconnect')
		dispatch(saveIsLogin(false))
		dispatch(saveWalletType('NetWork'))
		localStorage.removeItem('isLogin')
		localStorage.removeItem('selectChainId')
		localStorage.removeItem('wallet')
		localStorageResetState()
	})
}

// 监听Metamask链接后的的一些事件触发
export const UseWatchInjectedConnect = ({ dispatch, connector }: { dispatch: any; connector: any }) => {
	if (typeof window === 'undefined') return
	const { ethereum } = window as any

	const setActivateChange = (networkId: any) => {
		const chainIds = Object.keys(URLS)
		let isTrue = getActiveChainId(chainIds, Number(networkId))
		console.log('isTrue', isTrue)
		if (!isTrue) {
		} else metaMask.connectEagerly()
		// if (!isTrue) {
		// 	if (connector?.deactivate) {
		// 		void connector.deactivate()
		// 	} else {
		// 		void connector.resetState()
		// 	}
		// 	dispatch(saveIsLogin(false))
		// 	dispatch(saveWalletType('NetWork'))
		// 	localStorage.removeItem('isLogin')
		// 	localStorage.removeItem('selectChainId')
		// 	localStorage.removeItem('wallet')
		// } else metaMask.connectEagerly()
	}

	if (ethereum && ethereum.on) {
		const handleNetworkChanged = (networkId: string | number) => {
			console.log("Handling 'networkChanged' event with payload", networkId)
			setActivateChange(networkId)
			localStorage.setItem('chainId', networkId.toString())
		}

		ethereum.on('connect', () => {
			/** console.log("Handling 'connect' event") */
		})
		ethereum.on('chainChanged', (chainId: string | number) => {
			console.log("Handling 'chainChanged' event with payload", chainId)
			/** console.log("Handling 'chainChanged' event with payload", chainId) */
		})
		ethereum.on('accountsChanged', (accounts: string[]) => {
			console.log("Handling 'accountsChanged' event with payload", accounts)
			/** console.log("Handling 'accountsChanged' event with payload", accounts) */
		})
		ethereum.on('networkChanged', handleNetworkChanged)
	}
}
