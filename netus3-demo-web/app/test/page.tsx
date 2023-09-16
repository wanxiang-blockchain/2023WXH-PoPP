'use client'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Wrapper } from './styled'
import WalletConnect from '@/app/components/WalletConnect'

import { useTranslation } from 'react-i18next'
import useDataHooks from '@/hooks/useDataHooks'
import { useAppDispatch } from '@/redux/hooks'
import type { ListType } from '@/redux/seeionData'
import { saveIsPend, saveSeeionData } from '@/redux/seeionData'
import { CHAINNETWORKINFO } from '@/contracts/networks'

import { toast } from 'react-hot-toast'
import { Button } from '@nextui-org/react'

/**
 * 演示：用户链接钱包后，实现签名、转账功能实现
 */
const HomePage = () => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	// sign
	const [loading, setLoading] = useState<boolean>(false)
	// transfer
	const [transferLoading, setTransferLoading] = useState<boolean>(false)
	const { isActive, provider, account, chainId } = useWeb3React()
	const { web3 } = useDataHooks().data
	const balance = useDataHooks().balance

	const handleSignClick = async () => {
		console.log('provider', provider)
		setLoading(true)
		try {
			const signature = await provider?.getSigner(account).signMessage('👋')
			console.log('signature', signature)
			setLoading(false)
		} catch (error: any) {
			console.log('error', error)
			toast.error(error.message)
			setLoading(false)
		}
	}

	const handleTranFormClick = async () => {
		if (Number(balance) < 0.1) {
			toast.error(t('test.tranform.account.banlanof.tips', { msg: balance }))
			return
		}
		const transaction = {
			from: account,
			to: account,
			value: web3.utils.toWei('0.01', 'ether'),
		}
		setTransferLoading(true)
		try {
			web3.eth
				.sendTransaction(transaction)
				.on('transactionHash', function (hash) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					setTransferLoading(false)
				})
				.on('receipt', function (receipt) {
					toast.success(t('test.tranform.success'))
					console.log('re', receipt)
					const info: ListType = {
						name: 'Transaction',
						hash: receipt.transactionHash,
						describe: `A Transaction B to 0.1 ${CHAINNETWORKINFO.find(item => item.chainId === chainId)?.unit}`,
						timestamp: receipt.blockNumber as any,
					}
					dispatch(saveSeeionData([info]))
					dispatch(saveIsPend(false))
				})
				.on('error', function (err) {
					toast.error(err.message)
					dispatch(saveIsPend(false))
					setTransferLoading(false)
				})
				.catch((err: any) => {
					console.log('err', err)
					toast.error(err.message)
					dispatch(saveIsPend(false))
					setTransferLoading(false)
				})
		} catch (error: any) {
			console.log('error', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setTransferLoading(false)
		}
	}

	return (
		<>
			<WalletConnect />
			<Wrapper>
				{isActive && (
					<div style={{ marginTop: '50px' }}>
						<Button onClick={handleSignClick} color="primary" isLoading={loading}>
							{t('test.sign.title')}
						</Button>
						<Button onClick={handleTranFormClick} color="secondary" isLoading={transferLoading} style={{ marginLeft: '10px' }}>
							{t('test.tranform.btn')}
						</Button>
					</div>
				)}
			</Wrapper>
		</>
	)
}

export default HomePage
