'use client'
import React, { useState, useMemo } from 'react'
import {
	Button,
	Modal,
	useDisclosure,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Textarea,
} from '@nextui-org/react'
import { Spinner } from '@nextui-org/react'
import useCapitalPoolHooks from '@/hooks/useCapitalPoolHooks'
import { useBoolean } from 'ahooks'
import toast from 'react-hot-toast'
import useDataHooks from '@/hooks/useDataHooks'
import { useWeb3React } from '@web3-react/core'
import { saveIsPend } from '@/redux/seeionData'
import { useAppDispatch } from '@/redux/hooks'
import { SENDSUCCESSTIME } from '@/contracts/methods'
import NoData from '@/app/components/NoData'
import { ZERO_ADDRESS } from '@/contracts/constant'
import { useTranslation } from 'react-i18next'
import { validateAmount } from '@/utils/rules'
import BigNumber from 'bignumber.js'

const CapitalPoolPage = ({ params }: any) => {
	const { t } = useTranslation()
	const { account } = useWeb3React()
	const owerBalance = useDataHooks().balance
	const { web3 } = useDataHooks().data

	const dispatch = useAppDispatch()

	const currentProfileId = params.ids[0]
	const currentPubId = params.ids[1]
	// modal相关设置
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	// Reward loaidng
	const [rewardLoading, setRewardLoading] = useState<boolean>(false)

	// 数据重置
	const [isRedux, setRedux] = useBoolean(false)

	const {
		rewardState,
		loading: rewardStateLoading,
		poolFinanceContracts,
		limitsAuthority,
		profitPoint,
	} = useCapitalPoolHooks({ isRedux, currentProfileId, currentPubId })

	// loading
	const [loading, setLoading] = useState<boolean>(false)
	// 类型
	const [currentType, setCurrentType] = useState<'collect' | 'donate' | ''>('')
	// 设置参数
	const [state, setState] = useState<{
		cAddress: string
		rate: string | undefined
		likeRate: string | undefined
		collectRate: string | undefined
		cAddressRate: string | undefined
	}>({
		cAddress: '',
		rate: '',
		likeRate: '',
		collectRate: '',
		cAddressRate: '',
	})
	// 监听modal关闭。重置数据
	useMemo(() => {
		if (!isOpen) {
			setState({ cAddress: '', rate: '', likeRate: '', collectRate: '', cAddressRate: '' })
			setCurrentType('')
		}
	}, [isOpen])

	// 监听详情数据类型
	useMemo(() => {
		if (currentType === 'collect') {
			setState(s => {
				return {
					...s,
					rate: profitPoint.collect.point.toString(),
					likeRate: profitPoint.collect.zanPoint.toString(),
					collectRate: profitPoint.collect.collectPoint.toString(),
					cAddressRate: profitPoint.collect.cAddressRate.toString(),
					cAddress: profitPoint.collect.cAddress === ZERO_ADDRESS ? '' : profitPoint.collect.cAddress,
				}
			})
		}
		if (currentType === 'donate') {
			setState(s => {
				return {
					...s,
					rate: profitPoint.donate.point.toString(),
					likeRate: profitPoint.donate.zanPoint.toString(),
					collectRate: profitPoint.donate.collectPoint.toString(),
					cAddressRate: profitPoint.donate.cAddressRate.toString(),
					cAddress: profitPoint.donate.cAddress === ZERO_ADDRESS ? '' : profitPoint.donate.cAddress,
				}
			})
		}
	}, [currentType, profitPoint])
	// 验证输入的数量
	const validationRate = useMemo(() => {
		if (state.rate === '' || typeof state.rate === 'undefined') return undefined
		return validateAmount(state.rate) ? 'valid' : 'invalid'
	}, [state.rate])
	const validationCAddressRate = useMemo(() => {
		if (state.cAddressRate === '' || typeof state.cAddressRate === 'undefined') return undefined
		return validateAmount(state.cAddressRate) ? 'valid' : 'invalid'
	}, [state.cAddressRate])
	const validationLikeRate = useMemo(() => {
		if (state.likeRate === '' || typeof state.likeRate === 'undefined') return undefined
		return validateAmount(state.likeRate) ? 'valid' : 'invalid'
	}, [state.likeRate])
	const validationCollectRate = useMemo(() => {
		console.log('collectRate', state.collectRate)
		if (state.collectRate === '' || typeof state.collectRate === 'undefined') return undefined
		return validateAmount(state.collectRate) ? 'valid' : 'invalid'
	}, [state.collectRate])

	const handleStateChange = (news: any) =>
		setState(old => {
			return {
				...old,
				...news,
			}
		})

	// 信息提交
	const handleSubmit = async () => {
		console.log('state', state)
		// if (state.rate === '' || state.likeRate === '' || state.collectRate === '') {
		// 	toast.error(t('capitalpool.state.tips'))
		// 	return
		// }
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		if (state.cAddress !== '' && !web3.utils.isAddress(state.cAddress)) {
			toast.error(t('capitalpool.cAddress.error.tips'))
			return
		}
		let totalAmount = new BigNumber(state.cAddressRate || '0').plus(state.likeRate || '0').plus(state.collectRate || '0')
		if (Number(totalAmount) > 100) {
			toast.error(t('capitalpool.total.amount.error'))
			return
		}
		console.log('state', state)
		console.log('currentType', currentType)
		handleSetProfitPoint()
	}

	// 设置分配比例
	const handleSetProfitPoint = async () => {
		setLoading(true)
		if (currentType === 'collect') {
			try {
				let receipt = await poolFinanceContracts.methods
					.setCollectProfitPoint(
						Number(state.rate || 0) * 100,
						Number(state.likeRate || 0) * 100,
						Number(state.collectRate || 0) * 100,
						state.cAddress === '' ? ZERO_ADDRESS : state.cAddress,
						Number(state.cAddressRate || 0) * 100,
					)
					.send({
						from: account,
					})
					.on('transactionHash', function (hash: string) {
						dispatch(saveIsPend(true))
						console.log('hash', hash)
						onClose()
						setLoading(false)
					})
				setTimeout(() => {
					toast.success(t('capitalpool.setCollectProfitPoint.success'))
					console.log('receipt', receipt)
					dispatch(saveIsPend(false))
					void setRedux.toggle()
				}, SENDSUCCESSTIME)
			} catch (error: any) {
				console.log('error.message', error.message)
				dispatch(saveIsPend(false))
				setLoading(false)
				toast.error(error.message)
				onClose()
			}
		} else
			try {
				let receipt = await poolFinanceContracts.methods
					.setDonateProfitPoint(
						Number(state.rate || 0) * 100,
						Number(state.likeRate || 0) * 100,
						Number(state.collectRate || 0) * 100,
						state.cAddress === '' ? ZERO_ADDRESS : state.cAddress,
						Number(state.cAddressRate || 0) * 100,
					)
					.send({
						from: account,
					})
					.on('transactionHash', function (hash: string) {
						dispatch(saveIsPend(true))
						console.log('hash', hash)
						onClose()
						setLoading(false)
					})
				setTimeout(() => {
					toast.success(t('capitalpool.setCollectProfitPoint.success'))
					console.log('receipt', receipt)
					dispatch(saveIsPend(false))
					void setRedux.toggle()
				}, SENDSUCCESSTIME)
			} catch (error: any) {
				console.log('error.message', error.message)
				dispatch(saveIsPend(false))
				setLoading(false)
				toast.error(error.message)
				onClose()
			}
	}

	// 领取奖励
	const handleReward = async () => {
		if (Number(rewardState.currentRewardAmount) === 0) {
			toast.error(t('capitalpool.currentRewardAmount.tips'))
			return
		}
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		try {
			setRewardLoading(true)
			let receipt = await poolFinanceContracts.methods
				.getReward()
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					setRewardLoading(false)
				})
			setTimeout(() => {
				toast.success(t('capitalpool.currentRewardAmount.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('error.message', error.message)
			dispatch(saveIsPend(false))
			setRewardLoading(false)
			toast.error(error.message)
		}
	}

	if (rewardStateLoading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	// if (!limitsAuthority)
	// 	return (
	// 		<NoData
	// 			text={t('capitalpool.limitsAuthority.no')}
	// 			classOther="h-[var(--page-height-h5)] flex items-center justify-center md:h-[var(--page-height)]"
	// 		/>
	// 	)

	return (
		<>
			<div className="p-5">
				<div className="grid grid-cols-3  items-center ">
					<div className="col-span-2">
						<h3 className="mb-2 text-xl">{t('capitalpool.title')}</h3>
						<div className="text-[#ff0000]">
							{rewardState.currentRewardAmount} <span className="ml-1 text-black">DAI</span>
						</div>
					</div>
					<Button isLoading={rewardLoading} className="col-span-1" color="primary" onClick={handleReward}>
						{t('capitalpool.btn')}
					</Button>
				</div>
				<div className="my-5 grid  grid-cols-3 items-center gap-2">
					<div>
						<h4 className="mb-1 text-sm text-slate-400">{t('capitalpool.top.title1')}</h4>
						<span className="text-base">{rewardState.worksAmount} DAI</span>
					</div>
					<div>
						<h4 className="mb-1 text-sm text-slate-400">{t('capitalpool.top.title2')}</h4>
						<span className="text-base">{rewardState.forwardAmount} DAI</span>
					</div>
					<div>
						<h4 className="mb-1 text-sm text-slate-400">{t('capitalpool.top.title3')}</h4>
						<span className="text-base">{rewardState.bonusAmount} DAI</span>
					</div>
				</div>
				<div className="border-t-1	border-dashed border-gray-300"></div>
				<div className="mt-5 text-slate-400">{t('capitalpool.collect.title')}</div>
				<div className="mt-3	flex min-h-[50px] w-full items-center	justify-between rounded-md bg-slate-200 px-3 py-2 text-sm	">
					<span>{rewardState.collectBenefit} DAI</span>
					{limitsAuthority && (
						<Button
							size="sm"
							variant="light"
							onClick={() => {
								setCurrentType('collect')
								onOpen()
							}}
						>
							{t('capitalpool.collect.setting.btn')}
						</Button>
					)}
				</div>
				<div className="mt-5 text-slate-400">{t('capitalpool.donate.title')}</div>
				<div className="mt-3	flex min-h-[50px] w-full items-center	justify-between rounded-md bg-slate-200 px-3 py-2 text-sm	">
					<span>{rewardState.donateBenefit} DAI</span>
					{limitsAuthority && (
						<Button
							size="sm"
							variant="light"
							onClick={() => {
								setCurrentType('donate')
								onOpen()
							}}
						>
							{t('capitalpool.collect.setting.btn')}
						</Button>
					)}
				</div>
			</div>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				classNames={{
					base: 'max-sm:m-0 max-sm:rounded-none max-sm:rounded-t-lg',
					footer: 'flex-col',
				}}
			>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className="flex flex-col gap-1">{t('capitalpool.modal.title')}</ModalHeader>
							<ModalBody>
								<div className="py-2 text-xs">{t('capitalpool.modal.title2')}</div>
								<Input
									value={state.rate}
									onValueChange={values => handleStateChange({ rate: values })}
									type="number"
									name="rate"
									label={t('capitalpool.modal.rate')}
									autoComplete="off"
									endContent={<>%</>}
									color={validationRate === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationRate === 'invalid' && t('app.test.amount.tips')}
									validationState={validationRate}
								/>
								<div className="border-t-1	border-dashed border-gray-300"></div>
								<Input
									value={state.likeRate}
									onValueChange={values => handleStateChange({ likeRate: values })}
									type="number"
									name="likeRate"
									label={t('capitalpool.modal.likeRate')}
									autoComplete="off"
									endContent={<>%</>}
									color={validationLikeRate === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationLikeRate === 'invalid' && t('app.test.amount.tips')}
									validationState={validationLikeRate}
								/>
								<Input
									value={state.collectRate}
									onValueChange={values => handleStateChange({ collectRate: values })}
									type="number"
									name="collectRate"
									label={t('capitalpool.modal.collectRate')}
									autoComplete="off"
									endContent={<>%</>}
									color={validationCollectRate === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationCollectRate === 'invalid' && t('app.test.amount.tips')}
									validationState={validationCollectRate}
								/>
								<Input
									value={state.cAddress}
									onValueChange={values => handleStateChange({ cAddress: values })}
									type="text"
									name="cAddress"
									placeholder={t('capitalpool.modal.cAddress.tips')}
									label={t('capitalpool.modal.cAddress')}
									autoComplete="off"
								/>
								<Input
									value={state.cAddressRate}
									onValueChange={values => handleStateChange({ cAddressRate: values })}
									type="number"
									name="cAddressRate"
									label={t('capitalpool.modal.cAddress.rate')}
									autoComplete="off"
									endContent={<>%</>}
									color={validationCAddressRate === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationCAddressRate === 'invalid' && t('app.test.amount.tips')}
									validationState={validationCAddressRate}
								/>
							</ModalBody>
							<ModalFooter>
								<div className="flex justify-end gap-2 px-6">
									<Button color="danger" variant="light" onPress={onClose}>
										{t('capitalpool.modal.close')}
									</Button>
									<Button color="primary" onClick={handleSubmit} isLoading={loading}>
										{t('capitalpool.modal.submit')}
									</Button>
								</div>
								<div className="mb-1 flex justify-end gap-2 px-6 text-sm text-slate-400">
									{t('capitalpool.modal.submit.tips')}
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default CapitalPoolPage
