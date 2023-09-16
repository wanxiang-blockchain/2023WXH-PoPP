'use client'
import { useRef, useState, useMemo } from 'react'
import {
	ScrollShadow,
	Button,
	Modal,
	useDisclosure,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Textarea,
	Select,
	SelectItem,
	Spinner,
} from '@nextui-org/react'
import useDataHooks from '@/hooks/useDataHooks'
import { IconDiv } from './styled'
import type { MessageInfoTypes } from '@/graphql/message'
import useMessageHooks, { MessageListType } from '@/hooks/useMessageHooks'
import Image from 'next/image'
import ICONDEFAULT from '@/assets/icon-default.svg'
import { LikeSvg, CollectSvg, CollectActiveSvg, ForwardSvg, BountySvg } from '@/common/icon'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'
import { useWeb3React } from '@web3-react/core'
import toast from 'react-hot-toast'
import { saveIsPend } from '@/redux/seeionData'
import { useAppDispatch } from '@/redux/hooks'
import { useBoolean } from 'ahooks'
import { SENDSUCCESSTIME } from '@/contracts/methods'
import GlobalTip from '@/app/components/GlobalTip'
import { DAI_ABI, FinancePoolNFTModule_ABI } from '@/contracts/constant'
import Link from 'next/link'
import NoData from '@/app/components/NoData'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { validateAmount } from '@/utils/rules'
import BigNumber from 'bignumber.js'

const MessageInit: MessageListType = {
	id: undefined,
	name: '',
	content: '',
	isLike: false,
	isCollect: false,
	collectAmount: undefined,
	collectScale: undefined,
	rewardScale: undefined,
	baseId: undefined,
	planetId: undefined,
}

type SelectListType = {
	label: string
	value: string
}

const MessagePage = () => {
	const { t } = useTranslation()
	const { account } = useWeb3React()
	const owerBalance = useDataHooks().balance
	const {
		Fee_Collect_Module_ADDRESS,
		Follower_PoPP_Reference_Module_ADDRESS,
		web3,
		DAI_ADDRESS,
		constant,
		Hub_ADDRESS,
		Finance_Pool_Impl_ADDRESS,
		fromWeiPowBanlances,
	} = useDataHooks().data
	const { s3, bucket, storeFilesUpload, makeFileObjects } = useDataHooks().awsStore
	const [isRedux, setRedux] = useBoolean(false)
	const dispatch = useAppDispatch()

	// 发布消息loading
	const [postLoading, setPostLoading] = useState<boolean>(false)
	// 消息转发loading
	const [mirrorLoading, setMirrorLoading] = useState<boolean>(false)
	// 消息转发当前Id
	const [mirrorPutId, setMirrorPutId] = useState<string | undefined>(undefined)

	const ScrollRef = useRef<any>(null)
	// modal相关设置
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	// 收藏的modal
	const {
		isOpen: collectIsOpen,
		onOpen: collectOnOpen,
		onOpenChange: collectOnOpenChange,
		onClose: collectOnClose,
	} = useDisclosure()
	// 点击收藏当前的消息内容
	const [collectCurrentMessgaeInfo, setCollectCurrentMessgaeInfo] = useState<MessageInfoTypes | undefined>(undefined)
	// 收藏消息loading
	const [collectLoading, setCollectLoading] = useState<boolean>(false)

	// 消息信息
	const [state, setState] = useState<MessageListType>(MessageInit)

	// 点赞loading
	const [likeLoading, setLikeLoading] = useState<boolean>(false)
	// 点赞当前的消息内容
	const [likeCurrentMessgaeInfo, setLikeCurrentMessgaeInfo] = useState<MessageInfoTypes | undefined>(undefined)

	// 打赏Loading
	const [donateLoading, setDonateLoading] = useState<boolean>(false)
	// 点赞当前的消息内容
	const [donateCurrentMessgaeInfo, setDonateCurrentMessgaeInfo] = useState<MessageInfoTypes | undefined>(undefined)
	// 打赏modal窗口
	const { isOpen: donateIsOpen, onOpen: donateOnOpen, onOpenChange: donateOnOpenChange, onClose: donateOnClose } = useDisclosure()
	// 打赏金额state
	const [donateState, setDonateState] = useState<{ amount: string }>({ amount: '' })
	// 监听modal关闭。重置打赏数据
	useMemo(() => {
		if (!donateIsOpen) {
			setDonateState({ amount: '' })
			setDonateCurrentMessgaeInfo(undefined)
			setDonateLoading(false)
		}
	}, [donateIsOpen])

	const { messageList, loading: messgeListLoading, currentAccountDaiAmount } = useMessageHooks({ isRedux })
	const { baseList, planetList, poppList } = useProfileCreatedHooks({ isRedux: false })
	// 监听modal关闭。重置数据
	useMemo(() => {
		if (!isOpen) setState(MessageInit)
	}, [isOpen])

	// 当前可以发布消息、转发消息的用户信息
	const poppListCurrents = useMemo(() => {
		if (poppList.length === 0 || !account) return undefined
		return poppList.find(item => item.to.toLocaleLowerCase() === account.toLocaleLowerCase())
	}, [poppList, account])

	// 得到星球的Select列表
	// const planetListSelect = useMemo<SelectListType[]>(() => {
	// 	if (planetList.length === 0 || !account) return []
	// 	return planetList
	// 		.filter(item => item.isCurrentAccountFollow)
	// 		.map(item => {
	// 			return {
	// 				value: item.profileId.toString(),
	// 				label: item.nftData?.name || `Planet #${item.profileId}`,
	// 			}
	// 		})
	// }, [account, planetList])

	// 得到基地的Select列表
	// const baseListSelect = useMemo<SelectListType[]>(() => {
	// 	if (baseList.length === 0 || !account) return []
	// 	return baseList
	// 		.filter(item => item.planetId.toString() === state.planetId?.toString())
	// 		.map(item => {
	// 			return {
	// 				value: item.profileId.toString(),
	// 				label: item.nftData?.name || `Base #${item.profileId}`,
	// 			}
	// 		})
	// }, [account, baseList, state.planetId])

	// 消息列表
	const messageLists = useMemo<MessageInfoTypes[]>(() => {
		if (typeof messageList === 'undefined' || messageList.length === 0) return []
		return messageList
	}, [messageList])

	// 监听消息内容，设置滚动高度
	useMemo(() => {
		if (typeof messageList === 'undefined' || messageList.length === 0) return
		setTimeout(() => {
			ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight + 100
		}, 100)
	}, [messageList])

	// 名称验证
	const validationStateName = useMemo(() => {
		if (typeof state.name === 'undefined' || state.name === '') return 'invalid'
		return 'valid'
	}, [state.name])
	// 验证输入的数量
	const validationCollectScale = useMemo(() => {
		if (state.collectScale === '' || typeof state.collectScale === 'undefined') return undefined
		return validateAmount(state.collectScale) ? 'valid' : 'invalid'
	}, [state.collectScale])
	const validationRewardScale = useMemo(() => {
		if (state.rewardScale === '' || typeof state.rewardScale === 'undefined') return undefined
		return validateAmount(state.rewardScale) ? 'valid' : 'invalid'
	}, [state.rewardScale])

	// 修改参数
	const handleStateChange = (news: any) =>
		setState(old => {
			return {
				...old,
				...news,
			}
		})

	// 信息提交
	const handleSubmit = async () => {
		if (!poppListCurrents) {
			toast.error(t('list.tips.no.popp.error'))
			return
		}
		if (typeof state.name === 'undefined' || state.name === '') return
		// if (typeof state.planetId === 'undefined' || state.planetId === '') {
		// 	toast.error(t('message.tips.planet'))
		// 	return
		// }
		// if (typeof state.baseId === 'undefined' || state.baseId === '') {
		// 	toast.error(t('message.tips.base'))
		// 	return
		// }
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		let totalAmount = new BigNumber(state.collectScale || '0').plus(state.rewardScale || '0')
		if (Number(totalAmount) > 100) {
			toast.error(t('message.total.amount.error'))
			return
		}
		if (typeof state.collectAmount !== undefined && Number(state.collectAmount) <= 0) {
			toast.error(t('message.total.collectAmount.error'))
			return
		}
		try {
			setPostLoading(true)
			// const baseIdData = baseList.find(item => item.profileId.toString() === state.baseId?.toString()),
			// 	planetIdData = planetList.find(item => item.profileId.toString() === state.planetId?.toString())
			const filesData = {
				name: state.name,
				describe: state.content,
				account: account,
				to: '',
				imageURI: '0x0',
				handle: '',
				baseId: 0,
				planetId: 0,
				// baseId: state.baseId,
				// planetId: state.planetId,
				// baseName: baseIdData?.nftData?.name || `base #${state.baseId}`,
				// planetName: planetIdData?.nftData?.name || `base #${state.planetId}`,
			}
			const files = makeFileObjects(filesData)
			const nftUri = await handleOtherJsonUpload(files)

			const collectAmounts = state.collectAmount ? web3.utils.toWei(state.collectAmount, 'ether') : '0'
			const collectScales = state.collectScale ? Number(state.rewardScale) * 100 : 0
			const collectModuleInitData = web3.eth.abi.encodeParameters(
				['uint256', 'address', 'uint256', 'bool'],
				[collectAmounts, DAI_ADDRESS, collectScales.toString(), false],
			)

			const params = {
				profileId: Number(poppListCurrents.profileId),
				// baseProfileId: Number(state.baseId),
				baseProfileId: Number(0),
				donateReferralPoint: state.rewardScale ? Number(state.rewardScale) * 100 : 0,
				contentURI: nftUri,
				collectModule: Fee_Collect_Module_ADDRESS,
				financeModule: Finance_Pool_Impl_ADDRESS,
				collectModuleInitData: collectModuleInitData,
				referenceModule: Follower_PoPP_Reference_Module_ADDRESS,
				referenceModuleInitData: [],
			}
			console.log('params', params)
			let receipt = await constant.ContractHub.methods
				.post(params)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					onClose()
					setPostLoading(false)
				})
			setTimeout(() => {
				toast.success(t('message.post.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('err', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setPostLoading(false)
		}
	}

	// 其他信息上传(nft)
	const handleOtherJsonUpload = (blob: any): Promise<string> =>
		new Promise(async resolve => {
			const { data, key } = await storeFilesUpload({
				s3,
				bucket,
				file: blob,
				type: 'json',
			})
			resolve(await `https://${bucket}.4everland.store/json/${key}`)
		})

	// 转发内容
	const handleMirrorContent = async (msl: MessageInfoTypes) => {
		if (!poppListCurrents) {
			toast.error(t('list.tips.no.popp.error'))
			return
		}
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		try {
			setMirrorLoading(true)
			setMirrorPutId(msl.pubId)
			const params = {
				profileId: Number(poppListCurrents.profileId), //我的 profileId: 我要发布内容的profileId
				profileIdPointed: msl.profileId, // 转发的消息拥有者 profileId
				pubIdPointed: msl.pubId, // 被转发的消息 Id
				contentURI: msl.contentURI,
				referenceModuleData: [],
				referenceModule: Follower_PoPP_Reference_Module_ADDRESS,
				referenceModuleInitData: [],
			}

			let receipt = await constant.ContractHub.methods
				.mirror(params)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					onClose()
					setMirrorLoading(false)
				})
			setTimeout(() => {
				toast.success(t('message.mirror.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				void setRedux.toggle()
				setMirrorPutId(undefined)
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('err', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setMirrorLoading(false)
			setMirrorPutId(undefined)
		}
	}

	// 收藏消息先授权
	const handleCollectMessageApprove = async () => {
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		const amounts = collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount
		if (Number(amounts) > currentAccountDaiAmount) {
			toast.error(t('message.dai.collect.message.error', { msg: currentAccountDaiAmount, amount: amounts }))
			return
		}
		setCollectLoading(true)
		try {
			const collectAmounts = collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount
				? web3.utils.toWei(collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount, 'ether')
				: '0'
			if (Number(collectAmounts) === 0) {
				handleCollectMessage()
				return
			}
			const uriAddress = collectCurrentMessgaeInfo?.collectModuleReturnDatas?.currency
				? collectCurrentMessgaeInfo?.collectModuleReturnDatas?.currency
				: DAI_ADDRESS
			const deployErc20Dai: any = new web3.eth.Contract(DAI_ABI, uriAddress)
			let allowance = await deployErc20Dai.methods.allowance(account, Fee_Collect_Module_ADDRESS).call()
			let allowances = fromWeiPowBanlances({ decimals: '18', balance: allowance })
			console.log('allowances', allowances, 'amounts', Number(amounts))
			if (Number(allowances) >= Number(amounts)) {
				handleCollectMessage()
				return
			}
			let receipt = await deployErc20Dai.methods
				.approve(Fee_Collect_Module_ADDRESS, collectAmounts)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
				})
			dispatch(saveIsPend(false))
			handleCollectMessage()
		} catch (error) {
			dispatch(saveIsPend(false))
			setCollectLoading(false)
		}
	}

	// 收藏消息
	const handleCollectMessage = async () => {
		try {
			console.log('collectCurrentMessgaeInfo', collectCurrentMessgaeInfo)
			const collectAmounts = collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount
				? web3.utils.toWei(collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount, 'ether')
				: '0'
			let collectModuleData = web3.eth.abi.encodeParameters(
				['address', 'uint256'],
				[collectCurrentMessgaeInfo?.collectModuleReturnDatas?.currency, collectAmounts],
			)
			let paramsObj = {
				profileId: collectCurrentMessgaeInfo?.profileId,
				pubId: collectCurrentMessgaeInfo?.pubId,
				collectModuleData,
			}
			console.log('paramsObj', paramsObj)
			let receipt = await constant.ContractHub.methods
				.collect(Number(paramsObj.profileId), Number(paramsObj.pubId), paramsObj.collectModuleData)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					collectOnClose()
					setCollectLoading(false)
				})
			setTimeout(() => {
				toast.success(t('message.collect.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				setCollectCurrentMessgaeInfo(undefined)
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('err', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setCollectCurrentMessgaeInfo(undefined)
			setCollectLoading(false)
			collectOnClose()
		}
	}

	// 点赞消息
	const handleLikeContent = async (msl: MessageInfoTypes) => {
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		setLikeCurrentMessgaeInfo(msl)
		try {
			setLikeLoading(true)
			let financePools = await constant.ContractHub.methods.getFinancePool(msl.profileId, msl.pubId).call()
			let financePoolsContract: any = new web3.eth.Contract(FinancePoolNFTModule_ABI, financePools)
			let receipt = await financePoolsContract.methods
				.zan()
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					setLikeLoading(false)
				})
			setTimeout(() => {
				toast.success(t('message.zan.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				setLikeCurrentMessgaeInfo(undefined)
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
			console.log(financePools)
		} catch (error: any) {
			console.log('err', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setLikeCurrentMessgaeInfo(undefined)
			setLikeLoading(false)
		}
	}

	// 打赏授权
	const handleDonateSubmitApprove = async () => {
		if (donateState.amount === '') {
			toast.error(t('message.tips.amount'))
			return
		}
		if (Number(donateState.amount) <= 0) {
			toast.error(t('message.tips.amount1'))
			return
		}
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		if (Number(donateState.amount) > currentAccountDaiAmount) {
			toast.error(t('list.tips.dai.banlanof.error', { msg: currentAccountDaiAmount }))
			return
		}
		setDonateLoading(true)
		try {
			const Amounts = web3.utils.toWei(donateState.amount, 'ether')
			const uriAddress = donateCurrentMessgaeInfo?.collectModuleReturnDatas?.currency
				? donateCurrentMessgaeInfo?.collectModuleReturnDatas?.currency
				: DAI_ADDRESS
			const deployErc20Dai: any = new web3.eth.Contract(DAI_ABI, uriAddress)
			let allowance = await deployErc20Dai.methods.allowance(account, Hub_ADDRESS).call()
			let allowances = fromWeiPowBanlances({ decimals: '18', balance: allowance })
			console.log('allowances', allowances)
			if (Number(allowances) >= Number(donateState.amount)) {
				handleDonateSubmit(Amounts, uriAddress)
				return
			}
			let receipt = await deployErc20Dai.methods
				.approve(Hub_ADDRESS, Amounts)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
				})
			dispatch(saveIsPend(false))
			handleDonateSubmit(Amounts, uriAddress)
		} catch (error) {
			dispatch(saveIsPend(false))
			setDonateLoading(false)
		}
	}

	// 打赏执行
	const handleDonateSubmit = async (amount: string, addresss: string) => {
		try {
			console.log('donateCurrentMessgaeInfo', donateCurrentMessgaeInfo)
			let receipt = await constant.ContractHub.methods
				.donate(donateCurrentMessgaeInfo?.profileId, donateCurrentMessgaeInfo?.pubId, addresss, amount)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					donateOnClose()
					setDonateLoading(false)
				})
			setTimeout(() => {
				toast.success(t('message.donate.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('err', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setDonateLoading(false)
			donateOnClose()
		}
	}

	if (messgeListLoading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	return (
		<>
			<ScrollShadow ref={ScrollRef} size={100} className="h-[var(--page-height-h5)] w-full  md:h-[var(--page-height)]">
				<div className={`px-5 ${messageLists.length === 0 ? 'h-full' : ''}`}>
					{messageLists.map((msl, key) => (
						<div key={key} className="flex flex-col items-start border-t-1 border-dashed	border-gray-300 py-3 first:border-0">
							<div className="flex items-center">
								<Image className="mr-2 rounded-[100%]" src={ICONDEFAULT} alt="default" width={32} height={32} />
								<div>
									<span className="text-xs text-slate-900">{msl.nftData?.name}</span>
									<h5 className="text-xs text-gray-400">{moment.unix(Number(msl.timestamp)).format('YYYY-MM-DD HH:mm:ss')}</h5>
								</div>
							</div>
							<span className="mt-3	min-h-[100px] w-full rounded-md bg-slate-200	px-3 py-2 text-sm">{msl.nftData?.describe}</span>
							<div className="mt-2 flex w-full justify-end">
								<div className="flex items-center">
									{/* {msl.type !== 'mirror' && msl.nftData?.account?.toLocaleLowerCase() === account?.toLocaleLowerCase() && (
										
									)} */}
									<Link href={`/capitalpool/${msl.profileId}/${msl.pubId}`}>
										<Button size="sm" className="mr-2" color="danger" variant="light">
											{t('message.join.capitalpool')}
										</Button>
									</Link>
									{likeCurrentMessgaeInfo?.pubId === msl.pubId && likeLoading ? (
										<Spinner color="default" size="sm" />
									) : (
										<IconDiv
											$isTrue={msl.isLike}
											title={t('message.zan.tips')}
											onClick={() => {
												handleLikeContent(msl)
											}}
										>
											<LikeSvg />
										</IconDiv>
									)}
									<div className="w-2"></div>
									<IconDiv
										$isTrue={msl.isCollect}
										onClick={() => {
											if (msl.isCollect) {
												toast.success(t('message.collect.tips.success'))
												return
											}
											setCollectCurrentMessgaeInfo(msl)
											collectOnOpen()
										}}
										title={t('message.collect.tips')}
									>
										{msl.isCollect ? <CollectActiveSvg /> : <CollectSvg />}
									</IconDiv>
									<div className="w-2"></div>
									<IconDiv
										$isTrue={false}
										title={t('message.donate.tips')}
										onClick={() => {
											setDonateCurrentMessgaeInfo(msl)
											donateOnOpen()
										}}
									>
										<BountySvg />
									</IconDiv>
									<div className="w-2"></div>
									{mirrorLoading && Number(msl.pubId) === Number(mirrorPutId) ? (
										<Spinner color="default" size="sm" />
									) : (
										<IconDiv $isTrue={false} onClick={() => handleMirrorContent(msl)} title={t('message.mirror.tips')}>
											<ForwardSvg />
										</IconDiv>
									)}
								</div>
							</div>
							{msl.type === 'mirror' && (
								<div className="mt-2 flex w-full justify-end">
									<span className="text-xs text-gray-400">
										{t('message.mirror.bottom.tips', {
											msg: poppList.find(p => p.profileId.toString() === msl.profileIdPointed)?.nftData?.name,
										})}
									</span>
								</div>
							)}
						</div>
					))}
					{messageLists.length !== 0 ? (
						<div className="h-16"></div>
					) : (
						<NoData text={t('message.no.data.content.tips')} classOther="h-full items-center justify-center flex" />
					)}
				</div>
			</ScrollShadow>
			<div
				className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-white px-5"
				style={{ boxShadow: '0px -5px 5px rgba(153, 153, 153, 0.1)' }}
			>
				<Button
					className="w-full"
					color="primary"
					variant="solid"
					onClick={() => {
						// if (planetListSelect.length === 0) {
						// 	toast.error(t('message.no.plate.tips'))
						// 	return
						// }

						if (!poppListCurrents) {
							toast.error(t('list.tips.no.popp.error'))
							return
						}
						onOpen()
					}}
				>
					{t('message.post.content.btn')}
				</Button>
			</div>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				classNames={{
					base: 'max-sm:m-0 max-sm:rounded-none max-sm:rounded-t-lg',
				}}
			>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className="flex flex-col gap-1">{t('message.post.content.title')}</ModalHeader>
							<ModalBody>
								<ScrollShadow ref={ScrollRef} size={10} className="h-[60vh] w-full">
									{/* <div className="mt-4 py-2 text-xs font-black  text-blue-800">{t('message.modal.title1')}</div>
									<Select
										label={t('message.modal.select.plate')}
										className="max-w-xs"
										selectedKeys={state.planetId ? [state.planetId] : ''}
										onSelectionChange={(values: any) => handleStateChange({ planetId: values['anchorKey'], baseId: undefined })}
									>
										{planetListSelect.map(pls => (
											<SelectItem key={pls.value} value={pls.value}>
												{pls.label}
											</SelectItem>
										))}
									</Select>
									{state.planetId &&
										(baseListSelect.length !== 0 ? (
											<Select
												label={t('message.modal.select.base')}
												className="mt-4 max-w-xs"
												selectedKeys={state.baseId ? [state.baseId] : ''}
												onSelectionChange={(values: any) => handleStateChange({ baseId: values['anchorKey'] })}
											>
												{baseListSelect.map(pls => (
													<SelectItem key={pls.value} value={pls.value}>
														{pls.label}
													</SelectItem>
												))}
											</Select>
										) : (
											<NoData text={t('message.modal.select.base.no')} />
										))} */}

									<div className="mt-4 py-2 text-xs font-black text-blue-800">{t('message.modal.title2')}</div>
									<Input
										value={state.name}
										onValueChange={values => handleStateChange({ name: values })}
										type="text"
										name="name"
										label={t('message.modal.name')}
										className="mt-4"
										color={validationStateName === 'invalid' ? 'danger' : 'success'}
										errorMessage={validationStateName === 'invalid' && t('list.profile.modal.rules')}
										validationState={validationStateName}
										autoComplete="off"
									/>
									<Textarea
										name="content"
										className="mt-4"
										value={state.content}
										onValueChange={values => handleStateChange({ content: values })}
										label={t('message.modal.content')}
									/>
									<Input
										value={state.collectAmount || ''}
										onValueChange={values => handleStateChange({ collectAmount: values })}
										type="number"
										name="name"
										label={t('message.modal.collectAmount')}
										className="mt-4"
										placeholder={t('message.modal.collectAmount.placeholder')}
										autoComplete="off"
									/>
									<div className="mt-4 py-2 text-xs font-black  text-blue-800">{t('message.modal.title3')}</div>
									<Input
										value={state.collectScale || ''}
										onValueChange={values => handleStateChange({ collectScale: values })}
										type="number"
										name="name"
										label={t('message.modal.collectScale')}
										className="mt-4"
										min={1}
										max={100}
										autoComplete="off"
										color={validationCollectScale === 'invalid' ? 'danger' : 'success'}
										errorMessage={validationCollectScale === 'invalid' && t('app.test.amount.tips')}
										validationState={validationCollectScale}
										endContent={<>%</>}
									/>

									<Input
										value={state.rewardScale || ''}
										onValueChange={values => handleStateChange({ rewardScale: values })}
										type="number"
										name="name"
										className="mt-4"
										label={t('message.modal.rewardScale')}
										min={1}
										max={100}
										autoComplete="off"
										color={validationRewardScale === 'invalid' ? 'danger' : 'success'}
										errorMessage={validationRewardScale === 'invalid' && t('app.test.amount.tips')}
										validationState={validationRewardScale}
										endContent={<>%</>}
									/>
								</ScrollShadow>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{t('list.profile.modal.close')}
								</Button>
								<Button color="primary" onClick={handleSubmit} isLoading={postLoading}>
									{t('list.profile.modal.submit')}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal
				isOpen={donateIsOpen}
				onOpenChange={donateOnOpenChange}
				classNames={{
					base: 'max-sm:m-0 max-sm:rounded-none max-sm:rounded-t-lg',
				}}
			>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader className="flex flex-col gap-1">{t('message.modal2.title')}</ModalHeader>
							<ModalBody>
								<Input
									value={donateState.amount || ''}
									onValueChange={values =>
										setDonateState({
											amount: values,
										})
									}
									type="number"
									name="name"
									label={t('message.modal2.amount')}
									className="mt-4"
									autoComplete="off"
								/>
								<div className=" flex items-center text-sm">
									<span>
										{t('message.dai.amount.title')}
										<span className="ml-2 mr-1 font-black">{currentAccountDaiAmount}</span>
										DAI
									</span>
									<Button
										color="danger"
										size="sm"
										variant="light"
										onClick={() => {
											setDonateState({
												amount: currentAccountDaiAmount.toString(),
											})
										}}
									>
										MAX
									</Button>
								</div>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={donateOnClose}>
									{t('list.profile.modal.close')}
								</Button>
								<Button color="primary" onClick={handleDonateSubmitApprove} isLoading={donateLoading}>
									{t('list.profile.modal.submit')}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<GlobalTip
				submitTitle={t('message.global.sbmit.btn')}
				title={t('message.global.title')}
				content={t('message.global.content', {
					name: collectCurrentMessgaeInfo?.nftData?.name || `# ${collectCurrentMessgaeInfo?.pubId}`,
					amount: collectCurrentMessgaeInfo?.collectModuleReturnDatas?.amount,
				})}
				isOpen={collectIsOpen}
				onOpen={collectOnOpen}
				onClose={collectOnClose}
				onOpenChange={collectOnOpenChange}
				handleSubmit={handleCollectMessageApprove}
				isloading={collectLoading}
			/>
		</>
	)
}

export default MessagePage
