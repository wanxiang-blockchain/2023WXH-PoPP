'use client'
import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useRafInterval, useMount } from 'ahooks'
import Image from 'next/image'
import {
	Wrapper,
	WalletDrawerTopBar,
	WalletDrawerClose,
	WalletListInfo,
	WalletList,
	InfoTitle,
	InfoImage,
	WalletTitle,
	WalletDrawerContent,
	WalletQrCode,
	WalletQrCodeDiv,
	WalletQrCodeClose,
	WalletQrCodeCopy,
	WalletDrawerContentInfo,
	WalletRetry,
} from './styled'
import { getAddChainParameters } from '@/contracts/chains'
import { DEFAULT_CHAINID } from '@/contracts/constant'
import { localStorageResetState } from './utils'
import { useTheme } from 'styled-components'
import { QRCodeSVG } from 'qrcode.react'
import { hooks, walletConnectV2 } from '@/connectors/walletConnectV2'

import Drawer from '@/app/components/Drawer'
import { WalletConnectV2ListInfo } from '@/app/components/WalletConnect/utils/walletInfo'
import WALLETCONNECTV2LOGO from '@/assets/wallet/walletConnectV2Logo.svg'
import { useWindowSizeHooks } from '@/hooks/useWindowSizeHooks'
import { useTranslation } from 'react-i18next'
import { WalletConnectV2ListInfoType } from '@/types'
import { saveQrCodeUri } from '@/redux/walletConnect'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-hot-toast'
import { metaMask } from '@/connectors/metaMask'
import { useWeb3React } from '@web3-react/core'

/**
 * Drawer deafult Styled
 */
const DrawerContentStyle: React.CSSProperties = {
	minHeight: 'calc(40vh + 50px)',
	padding: '0',
	width: '100%',
}

/**
 * wallet APP Logo
 */
const WalletIcons: any = {
	metamask: require('./assets/metamask.png'),
	okeWallet: require('./assets/okeWallet.png'),
	bitkeep: require('./assets/bitkeep.png'),
	imtoken: require('./assets/imToken.png'),
	trustwallet: require('./assets/trustwallet.png'),
	tokenPocket: require('./assets/tokenPocket.png'),
	zerion: require('./assets/zerion.png'),
}

const { useIsActive } = hooks

let timer: any

/**
 * 手机端，自定义wallet connect v2钱包 modal
 * handleReturn - 用户成功链接后，返回给予主组件
 * setLoading - 设置主组件是否显示loading
 * isOpenQrCode - 是否 modal
 */
const WalletConnect = ({
	handleReturn,
	setLoading,
	isOpenQrCode,
}: {
	handleReturn: () => void
	setLoading: (s: boolean) => void
	isOpenQrCode: boolean
}) => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	// const isActive = useIsActive()
	const { isActive } = useWeb3React()
	/**
	 * theme - styledComponents全局配置的主题
	 */
	const theme = useTheme()
	const { windowSize } = useWindowSizeHooks()
	const qrCodeUri = useAppSelector(state => state.walletConnectReducer.qrCodeUri)

	// 是否显示 modal
	const [show, setShow] = useState<boolean>(false)
	// modal显示后，是否显示二维码页面
	const [isQrCodeShow, setIsQrCodeShow] = useState<boolean>(false)

	// 是否再显示钱包链接中的App页面
	const [isOpenMobileApp, setIsOpenMobileApp] = useState<boolean>(false)
	// 当前选择的是那个APP
	const [currentSelectInfo, setCurrentSelectInfo] = useState<WalletConnectV2ListInfoType | undefined>(undefined)
	// 是否是第一次登录
	const [OneLogin, setOneLogin] = useState<boolean>(false)

	// 定时器
	const [delay, setDelay] = useState<number | undefined>(undefined)

	/**
	 * 监听用户点击某个钱包链接后，是否成功离开页面
	 * 作用：判断用户手机是否存在某个钱包APP
	 * 若存在，清除定时器；若不存在，则不清除定时器
	 */
	useRafInterval(() => {
		window.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				clearTimeout(timer)
			}
		})
	}, delay)

	/**
	 * wallet APP list
	 * 作用：WalletConnectV2ListInfo 用于服务端渲染，而其中的图片存在客服端，即需要做此步骤获取钱包图标
	 */
	const List = useMemo<WalletConnectV2ListInfoType[]>(() => {
		return WalletConnectV2ListInfo.map(item => {
			item.image = WalletIcons[item.imageName]
			return item
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [WalletConnectV2ListInfo, WalletIcons])

	/**
	 * 首次进入页面初始值
	 */
	useMount(() => {
		setOneLogin(false)
	})

	/**
	 * 监听是否是否打开二维码 modal和qrCodeUri是否存在
	 * 若二者都有，则关闭点击按钮的loading 并打开Modal
	 */
	useEffect(() => {
		if (qrCodeUri && isOpenQrCode) {
			setShow(true)
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [qrCodeUri, isOpenQrCode])

	/**
	 * 判断用户是否链接
	 * 链接后执行 handleModalClose
	 */
	useEffect(() => {
		console.log('isActive', isActive)
		if (isActive) handleModalClose()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive])

	/**
	 * 关闭modal、返回 handleReturn
	 */
	const handleModalClose = () => {
		setShow(false)
		setTimeout(() => {
			handleReset()
			if (OneLogin) handleReturn()
		}, 50)
	}

	/**
	 * 重置参数
	 */
	const handleReset = () => {
		setCurrentSelectInfo(undefined)
		setIsOpenMobileApp(false)
		setIsQrCodeShow(false)
		setLoading(false)
		clearTimeout(timer)
	}

	/**
	 *
	 * @param prefix 某个钱包的前缀
	 * @param href 钱包APP的地址
	 * @param name 钱包的名称
	 * href和name作用于：用户链接某个APP，后期签名、send，可以成功打开钱包APP
	 * WALLETCONNECT_DEEPLINK_CHOICE 设置参数，作用于自动跳转钱包 - 调用签名等send方法
	 */
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleWalletAPP = (prefix: string, href: any, name: any) => {
		const ethereum = typeof window !== 'undefined' ? window.ethereum : undefined
		if (prefix === 'metamask://wc?uri=' && ethereum?.isMetaMask) {
			metaMask.activate(getAddChainParameters(DEFAULT_CHAINID))
			setIsOpenMobileApp(true)
			setOneLogin(true)
			return
		}
		try {
			if (!qrCodeUri) return
			const url = `${prefix}${escape(qrCodeUri)}`
			setDelay(1000)
			console.log('url', url)
			setIsOpenMobileApp(true)
			setOneLogin(true)
			setTimeout(() => {
				handleOpenApp(url)
			}, 1000)
			const dataUri = {
				href,
				name,
			}
			localStorage.setItem('WALLETCONNECT_DEEPLINK_CHOICE', JSON.stringify(dataUri))
		} catch (error) {}
	}

	/**
	 * 若用户8000ms未打开，执行定时器任务，关闭弹框，初始化参数
	 * @param url 打开钱包的url地址
	 */
	const handleOpenApp = (url: string) => {
		// window.location.href = url
		window.open(url, '_self')
		timer = setTimeout(() => {
			toast.error(t('wallet.login.app.error'))
			setShow(false)
			walletConnectV2.resetState()
			dispatch(saveQrCodeUri(undefined))
			localStorageResetState()
			handleReset()
		}, 8000)
	}

	/**
	 * 复制二维码uri
	 */
	const handleLinkCopy = () => {
		try {
			const input = document.createElement('input')
			input.setAttribute('value', qrCodeUri || '')
			document.body.appendChild(input)
			input.select()
			document.execCommand('Copy')
			document.body.removeChild(input)
			toast.success(t('components.userinfo.copy.success'))
		} catch (error) {}
	}

	/**
	 * 手机端 显示二维码的大小
	 */
	const QrCodeMove = useCallback(() => {
		if (windowSize.innerWidth > 375)
			return (
				<QRCodeSVG
					value={qrCodeUri || ''}
					size={345}
					level="H"
					imageSettings={{
						src: 'https://poppclub.oss-cn-chengdu.aliyuncs.com/image/logo-square.svg',
						height: 96,
						width: 96,
						excavate: true,
					}}
				/>
			)
		return (
			<QRCodeSVG
				value={qrCodeUri || ''}
				size={windowSize.innerWidth - 40}
				level="H"
				imageSettings={{
					src: 'https://poppclub.oss-cn-chengdu.aliyuncs.com/image/logo-square.svg',
					height: 96,
					width: 96,
					excavate: true,
				}}
			/>
		)
	}, [windowSize.innerWidth, qrCodeUri])

	/**
	 * modal -链接 wallet APP 的页面样式
	 */
	const OpenMobileDiv = useCallback(() => {
		return (
			<>
				<WalletDrawerContent>
					<WalletTitle>
						<WalletQrCodeClose
							className="iconfont icon-arrow-left-bold"
							onClick={() => {
								setIsOpenMobileApp(false)
								setOneLogin(false)
								clearTimeout(timer)
							}}
						/>
						<span>{currentSelectInfo?.name}</span>
					</WalletTitle>
					<WalletDrawerContentInfo>
						<div className="logo-img">
							<div className="rates"></div>
							<Image src={currentSelectInfo?.image} alt="Logo" />
						</div>
						<h5>{t('wallet.modal.tips')}</h5>
					</WalletDrawerContentInfo>
				</WalletDrawerContent>
				<WalletRetry>
					<button
						onClick={() => {
							handleWalletAPP(
								`${currentSelectInfo?.mobile.native}wc?uri=`,
								currentSelectInfo?.mobile.native,
								currentSelectInfo?.name,
							)
						}}
					>
						<span>{t('wallet.modal.retry')}</span>
						<i className="iconfont icon-shuaxin"></i>
					</button>
				</WalletRetry>
			</>
		)
	}, [currentSelectInfo?.image, currentSelectInfo?.mobile.native, currentSelectInfo?.name, handleWalletAPP, t])

	if (isActive) return <></>

	return (
		<>
			<Drawer
				onClose={() => {
					setShow(false)
					walletConnectV2.resetState()
					dispatch(saveQrCodeUri(undefined))
					localStorageResetState()
					handleReset()
				}}
				isClose={false}
				open={show}
				contentStyle={{
					...DrawerContentStyle,
					background: theme.themeColor,
				}}
			>
				<WalletDrawerTopBar>
					<Image src={WALLETCONNECTV2LOGO} alt="walletconnect v2" height={26} />
					<WalletDrawerClose
						className="iconfont icon-close-bold"
						onClick={() => {
							setShow(false)
							walletConnectV2.resetState()
							dispatch(saveQrCodeUri(undefined))
							localStorageResetState()
							handleReset()
						}}
					/>
				</WalletDrawerTopBar>
				{isQrCodeShow ? (
					<WalletDrawerContent>
						<WalletTitle>
							<WalletQrCodeClose
								className="iconfont icon-arrow-left-bold"
								onClick={() => {
									setIsQrCodeShow(false)
									setOneLogin(false)
								}}
							/>
							<span>{t('wallet.modal.qrcode.title')}</span>
							<WalletQrCodeCopy className="iconfont icon-copy1" onClick={handleLinkCopy} />
						</WalletTitle>
						<WalletQrCodeDiv>
							<QrCodeMove />
						</WalletQrCodeDiv>
					</WalletDrawerContent>
				) : (
					<>
						{!isOpenMobileApp ? (
							<WalletDrawerContent>
								<WalletTitle>
									<span>{t('wallet.modal.title')}</span>
									<WalletQrCode
										className="iconfont icon-qrcode"
										onClick={() => {
											setIsQrCodeShow(true)
											setOneLogin(true)
										}}
									></WalletQrCode>
								</WalletTitle>
								<WalletList>
									{List.map((wl, key) => (
										<WalletListInfo
											key={key}
											onClick={() => {
												handleWalletAPP(`${wl.mobile.native}wc?uri=`, wl.mobile.native, wl.name)
												setCurrentSelectInfo(wl)
											}}
										>
											<InfoImage src={wl.image} alt={wl.name} />
											<InfoTitle>{wl.name}</InfoTitle>
										</WalletListInfo>
									))}
								</WalletList>
							</WalletDrawerContent>
						) : (
							<OpenMobileDiv />
						)}
					</>
				)}
			</Drawer>
		</>
	)
}

export default WalletConnect
