'use client'
import { useState, useMemo } from 'react'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'
import { useBoolean } from 'ahooks'
import List from '@/app/(list)/components/List'

import {
	Spinner,
	Button,
	Modal,
	useDisclosure,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	Textarea,
	ScrollShadow,
} from '@nextui-org/react'
import useDataHooks from '@/hooks/useDataHooks'
import toast from 'react-hot-toast'
import { useWeb3React } from '@web3-react/core'
import { saveIsPend } from '@/redux/seeionData'
import { useAppDispatch } from '@/redux/hooks'
import { SENDSUCCESSTIME } from '@/contracts/methods'
import { ProfileCreateListType } from '@/graphql/profile'
import NoData from '@/app/components/NoData'
import { useTranslation } from 'react-i18next'

type InfoStateType = {
	name: string
	describe: string
	account: string
	to: string
	handle: string
}

const InfoStateInit: InfoStateType = {
	name: '',
	describe: '',
	account: '',
	to: '',
	handle: '',
}

const PlanetListPage = () => {
	const { t } = useTranslation()
	const { web3, constant, Profile_Follow_Module_ADDRESS } = useDataHooks().data
	const { account } = useWeb3React()
	const owerBalance = useDataHooks().balance
	const { s3, bucket, storeFilesUpload, makeFileObjects } = useDataHooks().awsStore

	const [loading, setLoading] = useState<boolean>(false)
	// 加入其他星球loading
	const [followLoading, setFollowLoading] = useState<boolean>(false)
	// 当前被加入星球的id
	const [currentFollowAdId, setCurrentFollowAdId] = useState<number | undefined>(undefined)

	const dispatch = useAppDispatch()

	// 数据重置
	const [isRedux, setRedux] = useBoolean(false)
	// modal相关设置
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	// 星球信息列表
	const { planetList, poppList, loading: planetLoading, createPrivate } = useProfileCreatedHooks({ isRedux })
	// 创建星球的信息
	const [state, setState] = useState<InfoStateType>(() => {
		if (account)
			return {
				...InfoStateInit,
				to: account,
			}
		return InfoStateInit
	})
	// 监听modal关闭。重置数据
	useMemo(() => {
		if (!isOpen)
			setState(() => {
				if (account)
					return {
						...InfoStateInit,
						to: account,
					}
				return InfoStateInit
			})
	}, [account, isOpen])
	// 当前可以发布消息、转发消息的用户信息
	const poppListCurrents = useMemo(() => {
		if (poppList.length === 0 || !account) return undefined
		return poppList.find(item => item.to.toLocaleLowerCase() === account.toLocaleLowerCase())
	}, [poppList, account])

	// 用户名称验证
	const validationStateName = useMemo(() => {
		if (typeof state.name === 'undefined' || state.name === '') return 'invalid'
		return 'valid'
	}, [state.name])
	// handle验证
	const validationStateHandle = useMemo(() => {
		if (typeof state.handle === 'undefined' || state.handle === '') return 'invalid'
		return 'valid'
	}, [state.handle])

	// 修改星球提交参数
	const handleStateChange = (news: any) =>
		setState(old => {
			return {
				...old,
				...news,
			}
		})

	// 信息提交
	const handleSubmit = async () => {
		if (state.handle === '' || state.name === '') return
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}

		if (state.to !== '' && !web3.utils.isAddress(state.to)) {
			toast.error(t('list.profile.account.error.tips'))
			return
		}
		try {
			const isHandleValidity = await constant.ContractPoPPProfile.methods.checkHandle(state.handle).call()
			if (isHandleValidity.__length__ !== 0) {
				toast.error(t('list.profile.handle.error.tips'))
				return
			}
			setLoading(true)
			console.log('isHandleValidity', isHandleValidity)
			const filesData = {
				name: state.name,
				describe: state.describe,
				account: account,
				to: state.to || account,
				imageURI: '0x0',
				handle: state.handle,
			}
			const files = makeFileObjects(filesData)
			const nftUri = await handleOtherJsonUpload(files)

			const params = {
				to: state.to || account,
				handle: state.handle,
				imageURI: '0x0',
				followModule: Profile_Follow_Module_ADDRESS,
				followModuleInitData: [],
				followNFTURI: nftUri,
				profileType: 1,
				planetProfileId: 0,
			}
			let receipt = await constant.ContractHub.methods
				.createProfile(params)
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
				toast.success(t('list.planet.crate.tips.success'))
				console.log('receipt', receipt)
				dispatch(saveIsPend(false))
				void setRedux.toggle()
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('error', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setLoading(false)
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

	// 加入其他星球
	const handleFollowProfile = async (str: ProfileCreateListType) => {
		if (!str) return
		if (!poppListCurrents) {
			toast.error(t('list.tips.no.popp.error'))
			return
		}
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		try {
			setCurrentFollowAdId(Number(str.profileId.toString()))
			setFollowLoading(true)
			let params: {
				profileId: number | undefined
				followModule: string | undefined
			} = {
				profileId: Number(str.profileId.toString()),
				followModule: `0x${poppListCurrents.profileId.toString().padStart(64, '0')}`,
			}
			let receipt = await constant.ContractHub.methods
				.follow(params.profileId, params.followModule)
				.send({
					from: account,
				})
				.on('transactionHash', function (hash: string) {
					dispatch(saveIsPend(true))
					console.log('hash', hash)
					setFollowLoading(false)
					setCurrentFollowAdId(undefined)
				})
			setTimeout(() => {
				toast.success(t('list.planet.add.success'))
				console.log('receipt', receipt)
				void setRedux.toggle()
				dispatch(saveIsPend(false))
			}, SENDSUCCESSTIME)
		} catch (error: any) {
			console.log('error', error)
			toast.error(error.message)
			dispatch(saveIsPend(false))
			setFollowLoading(false)
			setCurrentFollowAdId(undefined)
		}
	}

	if (planetLoading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	if (!createPrivate)
		return (
			<NoData
				text={t('list.profile.private.create.tips')}
				classOther="h-[var(--page-height-h5)] flex items-center justify-center md:h-[var(--page-height)]"
			/>
		)

	return (
		<>
			<div className="h-full	px-5">
				<div className={'flex h-[var(--page-height-h5)] w-full md:h-[var(--page-height)]'}>
					<ScrollShadow size={100} className="h-full w-full">
						{planetList.length !== 0 && (
							<>
								{planetList.map((pl, key) => (
									<List
										key={key}
										userInfo={pl}
										type="planet"
										handleReturn={() => handleFollowProfile(pl)}
										loading={followLoading && currentFollowAdId?.toString() === pl.profileId.toString()}
									/>
								))}
								<div className="h-16"></div>
							</>
						)}
						{planetList.length === 0 && (
							<NoData text={t('list.planet.no.tips')} classOther="h-full items-center justify-center flex" />
						)}
					</ScrollShadow>
				</div>
			</div>
			<div
				className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-white px-5"
				style={{ boxShadow: '0px -5px 5px rgba(153, 153, 153, 0.1)' }}
			>
				<Button className="w-full" color="primary" variant="solid" onClick={onOpen}>
					{t('list.planet.create.btn')}
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
							<ModalHeader className="flex flex-col gap-1">{t('list.planet.modal.create.title')}</ModalHeader>
							<ModalBody>
								<Input
									value={state.name}
									onValueChange={values => handleStateChange({ name: values })}
									type="text"
									name="name"
									label={t('list.planet.modal.name')}
									color={validationStateName === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationStateName === 'invalid' && t('list.profile.modal.rules')}
									validationState={validationStateName}
									autoComplete="off"
								/>
								<Input
									value={state.handle}
									onValueChange={values => handleStateChange({ handle: values })}
									type="text"
									name="handle"
									label="handle"
									color={validationStateHandle === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationStateHandle === 'invalid' && t('list.profile.modal.rules')}
									validationState={validationStateHandle}
									autoComplete="off"
								/>
								<Input
									value={state.to}
									onValueChange={values => handleStateChange({ to: values })}
									type="text"
									name="to"
									label={t('list.profile.modal.to')}
									placeholder={t('list.profile.modal.to.placeholder')}
									autoComplete="off"
								/>
								<Textarea
									name="describe"
									label={t('list.profile.modal.describe')}
									value={state.describe}
									onValueChange={values => handleStateChange({ describe: values })}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									{t('list.profile.modal.close')}
								</Button>
								<Button isLoading={loading} color="primary" onClick={handleSubmit}>
									{t('list.profile.modal.submit')}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
export default PlanetListPage
