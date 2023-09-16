'use client'
import { useEffect, useMemo, useState } from 'react'
import { Wrapper } from './styled'

import { MetaMask } from '@web3-react/metamask'
import { useWeb3React } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect-v2'
import { OnConnectType } from '@/types'
import { UseWatchWalletConnectConnect, UseWatchInjectedConnect } from '@/hooks/useWeb3ProviderHooks'
import { useAppDispatch } from '@/redux/hooks'
import { saveIsLogin, saveWalletType } from '@/redux/walletConnect'
import { Adapth5 } from '@/utils'

import UserInfo from '@/app/components/UserInfo'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import MobileDrawerPage from './MobileDrawer'
import WebWalletModalPage from './WebWalletModal'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@nextui-org/react'

/**
 * 钱包连接器 - 入口
 */
const WalletConnectPage = () => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { isActive, connector } = useWeb3React()

	const { innerWidth } = useWindowSizeHooks().windowSize
	// 连接器窗口是否打开
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

	/**
	 * onConnectSuccess - metamask 链接成功配置参数
	 * UseWatchInjectedConnect - metamask 链接成功监听
	 * onConnectSuccess - walletConncet v2链接成功后配置参数
	 * UseWatchWalletConnectConnect - walletConnect V2链接成功后配置参数
	 */
	useEffect(() => {
		if (isActive) {
			connector instanceof MetaMask && onConnectSuccess({ status: 'MetaMask' })
			connector instanceof MetaMask && UseWatchInjectedConnect({ dispatch, connector })
			connector instanceof WalletConnect && onConnectSuccess({ status: 'WalletConnectV2' })
			connector instanceof WalletConnect && UseWatchWalletConnectConnect({ provider: connector.provider, dispatch, t })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive])

	/** 监听宽度变化，判断是否是手机 */
	const isMobileTrue = useMemo(() => {
		if (innerWidth >= Adapth5) return false
		return true
	}, [innerWidth])

	const onConnectSuccess = async ({ status }: OnConnectType) => {
		dispatch(saveIsLogin(true))
		dispatch(saveWalletType(status))
		localStorage.setItem('wallet', status)
		localStorage.setItem('isLogin', 'true')
	}

	return (
		<div className="absolute right-5 top-0 flex w-full flex-wrap justify-end">
			<UserInfo />
			{isMobileTrue ? (
				<MobileDrawerPage isOpenQrCode={isOpen} setIsOpenQrCode={s => (s ? onOpen() : onClose())} />
			) : (
				<WebWalletModalPage isOpen={isOpen} onOpen={onOpen} onClose={onClose} onOpenChange={onOpenChange} />
			)}
		</div>
	)
}

export default WalletConnectPage
