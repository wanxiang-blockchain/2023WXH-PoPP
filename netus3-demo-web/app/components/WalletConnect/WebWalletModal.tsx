'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import {
	WalletModalContent,
	WalletModalSubTitle,
	WalletConnectBtn,
	WalletModalConentLoad,
	WebWalletQrCodeClose,
	QrCodeMoveDiv,
} from './styled'
import { toast } from 'react-hot-toast'
import { useWeb3React } from '@web3-react/core'
import { metaMask } from '@/connectors/metaMask'
import { getAddChainParameters } from '@/contracts/chains'
import { useTranslation } from 'react-i18next'

import Loading from '@/app/components/Loading'
import NetWrokList from '@/app/components/NetWrok/NetWrokList'
import WalletSelectPage from '@/app/components/NetWrok/WalletSelect'
import { QRCodeSVG } from 'qrcode.react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { localStorageResetState } from './utils'
import { saveQrCodeUri } from '@/redux/walletConnect'
import { walletConnectV2 } from '@/connectors/walletConnectV2'
import WalletConnectV2Open from './WalletConnectV2Open'

import { Button, useDisclosure, ModalContent, ModalBody, Modal, Spinner } from '@nextui-org/react'

/**
 * web端钱包 modal
 * isOpen 是否打开
 * onOpen 打开
 * onClose 关闭
 * onOpenChange  更改
 */
const WebWalletModalPage = ({
	isOpen,
	onOpen,
	onClose,
	onOpenChange,
}: {
	isOpen: boolean
	onOpenChange: () => void
	onClose: () => void
	onOpen: () => void
}) => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	const { isActive } = useWeb3React()
	// modal 页面 是否加载Loading
	const [selectLoading, setSelectLoading] = useState<boolean>(false)
	// modal 选中的chainId
	const [currentSelectChainId, setCurrentSelectChainId] = useState<number | undefined>(undefined)

	// 是否显示二维码（walletconnect v2）
	const [isModalQrCode, setIsModalQrCode] = useState<boolean>(false)
	const qrCodeUri = useAppSelector(state => state.walletConnectReducer.qrCodeUri)

	// 用户登录后，关闭弹框即关闭loading
	useEffect(() => {
		if (isActive) {
			onClose()
			setSelectLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive])

	/**
	 * 用户点击第二步 select wallet
	 * @param type 选择的链接方式
	 */
	const handleReturnType = (type: 'Metamask' | 'WalletConnect') => {
		setSelectLoading(true)
		try {
			if (!currentSelectChainId) {
				toast.error(t('components.wallet.chainId.tips'))
				setSelectLoading(false)
				return
			}
			if (type === 'Metamask') {
				metaMask.activate(getAddChainParameters(currentSelectChainId)).catch(err => {
					console.log('err', err)
					setSelectLoading(false)
					toast.error(err.message)
				})
				return
			}
			if (typeof qrCodeUri === 'undefined') walletConnectV2.activate(currentSelectChainId)
			setIsModalQrCode(true)
			setSelectLoading(false)
		} catch (error) {
			setSelectLoading(false)
		}
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

	// 二维码显示的窗口大小，以及二维码为加载出来之前的loading
	const QrCodeMove = useCallback(() => {
		if (qrCodeUri === undefined)
			return (
				<div className="qrcode-loading">
					<Loading />
				</div>
			)
		return (
			<QRCodeSVG
				value={qrCodeUri || ''}
				size={220}
				level="H"
				imageSettings={{
					src: 'https://poppclub.oss-cn-chengdu.aliyuncs.com/image/logo-square.svg',
					height: 56,
					width: 56,
					excavate: true,
				}}
			/>
		)
	}, [qrCodeUri])

	return (
		<>
			{!isActive && (
				<Button color="primary" variant="shadow" onClick={onOpen}>
					{t('wallet.btn.title')}
				</Button>
			)}
			<Modal
				isOpen={isOpen}
				size="3xl"
				onOpenChange={onOpenChange}
				classNames={{
					base: 'max-sm:m-0 max-sm:rounded-none max-sm:rounded-t-lg',
				}}
			>
				<ModalContent className="rounded-lg pb-4 pt-8">
					{onClose => (
						<ModalBody className=" grid w-full grid-cols-2 gap-4" style={{ minHeight: '300px' }}>
							{selectLoading && (
								<div
									className="t-0 absolute z-[9999] flex items-center justify-center bg-black bg-opacity-10	"
									style={{ width: 'calc(100% - 2rem)', height: 'calc(100% - 3rem)' }}
								>
									<Spinner labelColor="primary" label={t('app.loading')} />
								</div>
							)}
							<WalletModalSubTitle className=" min-h-[50%]">
								<h2>{t('components.wallet.modal.select1')}</h2>
								<NetWrokList
									loading={selectLoading}
									handleReturnChainId={id => {
										setCurrentSelectChainId(id)
										walletConnectV2.activate(id)
									}}
								/>
							</WalletModalSubTitle>
							<WalletModalSubTitle className=" min-h-[50%]">
								{!isModalQrCode ? (
									<>
										<h2>{t('components.wallet.modal.select2')}</h2>
										<WalletSelectPage handleReturnType={handleReturnType} />
									</>
								) : (
									<>
										<WebWalletQrCodeClose>
											<i
												className="iconfont icon-arrow-left-bold"
												onClick={() => {
													setIsModalQrCode(false)
												}}
											></i>
											<span>{t('wallet.modal.qrcode.title')}</span>
											<i className="iconfont icon-copy1" onClick={handleLinkCopy}></i>
										</WebWalletQrCodeClose>
										<QrCodeMoveDiv>
											<QrCodeMove />
										</QrCodeMoveDiv>
										{qrCodeUri !== undefined && (
											<WalletConnectV2Open
												handleReturn={() => {
													onClose()
													setSelectLoading(false)
													setIsModalQrCode(false)
													dispatch(saveQrCodeUri(undefined))
													localStorageResetState()
												}}
											/>
										)}
									</>
								)}
							</WalletModalSubTitle>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>
			{/* <Modal
				open={open}
				onClose={() => {
					setOpen(false)
					setSelectLoading(false)
					setIsModalQrCode(false)
					dispatch(saveQrCodeUri(undefined))
					localStorageResetState()
				}}
				title={t('components.wallet.modal.title')}
				contentStyle={{
					minWidth: 600,
				}}
			>
				<WalletModalContent>
					
				</WalletModalContent>
			</Modal> */}
		</>
	)
}

export default WebWalletModalPage
