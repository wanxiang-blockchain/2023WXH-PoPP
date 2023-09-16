import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Image from 'next/image'
import { CHAINNETWORKINFO } from '@/contracts/networks'
import { InfoModalTitle, InfoModalUnit, InfoList, InfoBtn } from './styled'
import { formatStrAddress } from '@/utils'
import { useAppDispatch } from '@/redux/hooks'
import { saveIsLogin, saveWalletType } from '@/redux/walletConnect'

import useDataHooks from '@/hooks/useDataHooks'
import { localStorageResetState } from '../WalletConnect/utils'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import AVATERSVG from '@/assets/avater.svg'

import { Button, Modal, useDisclosure, ModalContent, ModalBody } from '@nextui-org/react'

/**
 * 用户个人信息，钱包地址、操作是否断开、复制 account
 */
const Info = () => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	const { balance } = useDataHooks()
	const { account, connector, chainId } = useWeb3React()

	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

	// 用户断开链接按钮
	const handleDeactivate = async () => {
		if (connector?.deactivate) void connector.deactivate()
		else void connector.resetState()
		onClose()
		localStorageResetState()
		dispatch(saveIsLogin(false))
		dispatch(saveWalletType('NetWork'))
		localStorage.removeItem('isLogin')
		localStorage.removeItem('selectChainId')
		localStorage.removeItem('wallet')
	}

	// 用户复制 account
	const handleCopy = async () => {
		const input = document.createElement('input')
		input.setAttribute('value', account || '')
		document.body.appendChild(input)
		input.select()
		document.execCommand('Copy')
		document.body.removeChild(input)
		toast.success(t('components.userinfo.copy.success'))
	}

	return (
		<div>
			<Button variant="shadow" color="primary" onClick={onOpen}>
				<Image src={AVATERSVG} alt="avater" width={24} height={24} />
				{formatStrAddress(6, 4, account || '')}
				<i className="iconfont icon-arrow-down-bold"></i>
			</Button>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				classNames={{
					base: 'max-sm:m-0 max-sm:rounded-none max-sm:rounded-t-lg',
				}}
			>
				<ModalContent className="rounded-lg pb-4 pt-8	">
					{onClose => (
						<ModalBody className="flex w-full flex-col items-center justify-center">
							<Image src="/favicon.ico" alt="avater" width={60} height={60} />
							<InfoModalTitle>{formatStrAddress(6, 4, account || '')}</InfoModalTitle>
							{chainId && (
								<InfoModalUnit>
									{balance} {CHAINNETWORKINFO.find(item => item.chainId === chainId)?.unit}
								</InfoModalUnit>
							)}
							<InfoList>
								<InfoBtn onClick={() => handleCopy()}>
									<i className="iconfont icon-copy"></i>
									<span>{t('components.userinfo.modal.tips1')}</span>
								</InfoBtn>
								<InfoBtn onClick={() => handleDeactivate()}>
									<i className="iconfont icon-disconnect"></i>
									<span>{t('components.userinfo.modal.tips2')}</span>
								</InfoBtn>
							</InfoList>
						</ModalBody>
					)}
				</ModalContent>
			</Modal>
		</div>
	)
}

export default Info
