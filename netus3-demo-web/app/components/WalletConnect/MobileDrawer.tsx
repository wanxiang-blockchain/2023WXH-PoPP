'use client'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectBtn, MobileDrawerLoadingDiv } from './styled'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { useRafTimeout } from 'ahooks'
import { walletConnectV2 } from '@/connectors/walletConnectV2'

import WalletConnectV2 from './WalletConnectV2'
import { localStorageResetState } from './utils'
import Loading from '@/app/components/Loading'
import { useAppSelector } from '@/redux/hooks'
import { DEFAULT_CHAINID } from '@/contracts/constant'

import { Button } from '@nextui-org/react'

/**
 * 手机端 modal wallet
 * isOpenQrCode - 是否 modal
 * setIsOpenQrCode - 控制是否打开 modal
 */
const MobileDrawerPage = ({
	isOpenQrCode,
	setIsOpenQrCode,
}: {
	isOpenQrCode: boolean
	setIsOpenQrCode: (s: boolean) => void
}) => {
	const { t } = useTranslation()
	const { isActive, connector } = useWeb3React()
	// 点击wallet connect, 获取qr-uri地址时候的加载
	const [loading, setLoading] = useState<boolean>(false)
	/**
	 * 是否打开连接器的modal
	 * 作用：作用于用户弱网或者未开启代理时，加载过慢，动态更改是否需要弹框。有一定的摧毁作用
	 * 若规定时间生成二维码，则为false;若规定时间未生成二维码，则为true
	 */
	const [isCloseQrCode, setIsCloseQrCode] = useState<boolean>(false)

	// redux 获取生成的二维码uri
	const qrCodeUri = useAppSelector(state => state.walletConnectReducer.qrCodeUri)
	// 是否启动定时器，作用：判断规定时间能够生成二维码
	const [delay, setDelay] = useState<number | undefined>(undefined)

	/**
	 * 用户成功链接钱包后，清除定时器
	 */
	useEffect(() => {
		if (isActive) setDelay(undefined)
	}, [isActive])

	/**
	 * 定时器
	 * 判断用户在规定时间内，未生成二维码，对钱包连接器做初始化操作
	 */
	useRafTimeout(() => {
		if (loading) {
			setLoading(false)
			if (connector?.deactivate) void connector.deactivate()
			else void connector.resetState()
			setIsOpenQrCode(false)
			toast.error(t('wallet.login.authorize.error'))
			setDelay(undefined)
			localStorageResetState()
			setIsCloseQrCode(true)
		} else {
			setDelay(undefined)
		}
	}, delay)

	/**
	 * 用户成功链接钱包给予提示
	 */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleReturn = () => {
		toast.success(t('wallet.login.success'))
	}

	/**
	 * 用户点击链接钱包按钮
	 * 若有qrCodeUri：则无需再次生成；若无qrCodeUri：则需要使用默认ChainId生成二维码，并定时1000ms
	 */
	const handleWalletConnectClick = () => {
		setIsCloseQrCode(false)
		try {
			if (qrCodeUri) {
				setLoading(true)
				setIsOpenQrCode(true)
			} else {
				if (connector?.deactivate) void connector.deactivate()
				else void connector.resetState()
				localStorageResetState()
				walletConnectV2.activate(DEFAULT_CHAINID)
				setDelay(10000)
				setIsOpenQrCode(true)
				setLoading(true)
			}
		} catch (error) {
			console.log('error', error)
		}
	}

	return (
		<>
			{loading && (
				<MobileDrawerLoadingDiv>
					<Loading title={t('app.loading')} />
				</MobileDrawerLoadingDiv>
			)}
			{!isActive && (
				<Button color="primary" variant="shadow" onClick={handleWalletConnectClick}>
					{t('wallet.btn.title')}
				</Button>
			)}
			{!isCloseQrCode && (
				<WalletConnectV2 isOpenQrCode={isOpenQrCode} handleReturn={handleReturn} setLoading={s => setLoading(s)} />
			)}
		</>
	)
}

export default MobileDrawerPage
