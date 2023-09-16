'use client'
import type { ProfileCreateListType, FollowInfosType } from '@/graphql/profile'
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
	Link,
} from '@nextui-org/react'
import toast from 'react-hot-toast'
import { useEffect, useMemo, useState } from 'react'
import { SENDSUCCESSTIME } from '@/contracts/methods'

import GlobalTip from '@/app/components/GlobalTip'
import { useRouter } from 'next/navigation'
import useDataHooks from '@/hooks/useDataHooks'
import { useWeb3React } from '@web3-react/core'
import { saveIsPend } from '@/redux/seeionData'
import { useAppDispatch } from '@/redux/hooks'
import NoData from '@/app/components/NoData'
import { useTranslation } from 'react-i18next'

const ProfileListPage = ({ params }: { params: { id: string } }) => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()

	const router = useRouter()
	const { account } = useWeb3React()
	const { constant, PoPP_Profile_ADDRESS } = useDataHooks().data
	const owerBalance = useDataHooks().balance
	const { s3, bucket, storeFilesUpload, makeFileObjects } = useDataHooks().awsStore

	const [loading, setLoading] = useState<boolean>(false)
	// 数据重置
	const [isRedux, setRedux] = useBoolean(false)
	// modal相关设置
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	// 基地列表
	const { baseList, loading: baseListLoading, planetList } = useProfileCreatedHooks({ isRedux })
	// 创建基地的信息
	const [state, setState] = useState<{ name: string }>({
		name: '',
	})

	// 获取基地的对应星球的follow NFT
	const [followNFT, setFollowNFT] = useState<string>(PoPP_Profile_ADDRESS)

	// 提示弹框
	const { isOpen: tipIsOpen, onOpen: tipOnOpen, onOpenChange: tipOnOpenChange, onClose: tipOnClose } = useDisclosure()
	// 当前点击基地信息
	const [currentBaseInfo, setCurrentBaseInfo] = useState<ProfileCreateListType | undefined>(undefined)

	// 当前星球的对应的基地数据
	const baseLists = useMemo(() => {
		if (typeof params.id === 'undefined') return []
		return baseList.filter(item => item.planetId?.toString() === params.id.toString())
	}, [baseList, params.id])

	// 当前选择的星球的信息
	const currentPlanetObj = useMemo(() => {
		if (typeof params.id === 'undefined') return undefined
		return planetList.find(item => item.profileId?.toString() === params.id.toString())
	}, [planetList, params.id])

	// 用户名称验证
	const validationStateName = useMemo(() => {
		if (typeof state.name === 'undefined' || state.name === '') return 'invalid'
		return 'valid'
	}, [state.name])

	useEffect(() => {
		// if (params.id) handleGetPlanetFollowNFT()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.id])

	// 获取星球的 FollowNFT
	const handleGetPlanetFollowNFT = async () => {
		try {
			let FollowNFTs = await constant.ContractPoPPProfile.methods.getFollowNFT(params.id).call()
			console.log('FollowNFTs', FollowNFTs, 'params.id', params.id)
			setFollowNFT(FollowNFTs)
		} catch (error) {
			setFollowNFT(PoPP_Profile_ADDRESS)
		}
	}

	// 修改用户参数
	const handleStateChange = (news: any) =>
		setState(old => {
			return {
				...old,
				...news,
			}
		})

	// 信息提交
	const handleSubmit = async () => {
		if (typeof state.name === 'undefined' || state.name === '') return
		if (typeof owerBalance !== 'number' || Number(owerBalance) === 0) {
			toast.error(t('list.tips.balanof.error'))
			return
		}
		try {
			setLoading(true)

			const paramsObj = {
				planetProfileId: params.id,
				name: state.name,
				imageURI: '0x0',
				joinNft: followNFT || PoPP_Profile_ADDRESS,
				postNft: followNFT || PoPP_Profile_ADDRESS,
			}
			console.log('paramsObj', paramsObj)
			let receipt = await constant.ContractHub.methods
				.createPlanetBase(paramsObj)
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
				toast.success(t('list.base.success'))
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

	// 点击基地，判断是否有进入基地权限
	const handleBaseClick = async (baseId: string) => {
		console.log('bnase', baseId)
		let baseListsCurrents = baseLists.find(ite => ite.profileId?.toString() === baseId.toString())
		setCurrentBaseInfo(baseListsCurrents)
		try {
			const autoCheck = await constant.ContractPlanetBase.methods.authCheck(account, baseId).call()
			if (autoCheck[0] === false || autoCheck[1] === false) {
				console.log('a', autoCheck, autoCheck[0], autoCheck[1])
				tipOnOpen()
			} else {
				router.push(`/chat/${baseListsCurrents?.profileId}`)
				setTimeout(() => {
					setCurrentBaseInfo(undefined)
				}, 500)
			}
		} catch (error: any) {
			toast.error(error.message)
		}
	}

	// 点击领取基地的NFT
	const handleReceiveSubmit = async () => {
		tipOnClose()
		router.push(`/chat/${currentBaseInfo?.profileId}`)
		setTimeout(() => {
			setCurrentBaseInfo(undefined)
		}, 500)
	}

	if (baseListLoading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	return (
		<>
			<div className="h-full	px-5">
				<div className={`flex h-[var(--page-height-h5)] w-full md:h-[var(--page-height)]`}>
					<div className="h-full w-full overflow-hidden overflow-y-scroll">
						{baseLists.length !== 0 && (
							<>
								{baseLists.map((pl, key) => (
									<div
										key={key}
										onClick={() => handleBaseClick(pl.profileId.toString())}
										className="w-full border-t-1	border-dashed border-gray-300 first:border-0"
									>
										<List handleReturn={() => {}} userInfo={pl} type="base" />
									</div>
								))}
								{currentPlanetObj?.to.toLocaleLowerCase() === account?.toLocaleLowerCase() && <div className="h-16"></div>}
							</>
						)}
						{baseLists.length === 0 && (
							<NoData text={t('list.base.no.data.tips1')} classOther="h-full flex items-center justify-center" />
						)}
					</div>
				</div>
			</div>
			{currentPlanetObj?.to.toLocaleLowerCase() === account?.toLocaleLowerCase() && (
				<div
					className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-white px-5"
					style={{ boxShadow: '0px -5px 5px rgba(153, 153, 153, 0.1)' }}
				>
					<Button className="w-full" color="primary" variant="solid" onClick={onOpen}>
						{t('list.base.create.btn')}
					</Button>
				</div>
			)}

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
							<ModalHeader className="flex flex-col gap-1">{t('list.base.modal.create.title')}</ModalHeader>
							<ModalBody>
								<Input
									value={state.name}
									onValueChange={values => handleStateChange({ name: values })}
									type="text"
									name="name"
									label={t('list.base.modal.name')}
									color={validationStateName === 'invalid' ? 'danger' : 'success'}
									errorMessage={validationStateName === 'invalid' && t('list.profile.modal.rules')}
									validationState={validationStateName}
									autoComplete="off"
								/>
								<Input
									value={followNFT}
									// onValueChange={values => handleStateChange({ enterAddress: values })}
									type="text"
									disabled
									name="enterAddress"
									label={t('list.base.modal.enterAddress')}
									autoComplete="off"
								/>
								<Input
									value={followNFT}
									// onValueChange={values => handleStateChange({ speakAddress: values })}
									type="text"
									disabled
									name="speakAddress"
									label={t('list.base.modal.speakAddress')}
									autoComplete="off"
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
			<GlobalTip
				title={t('list.base.global.title')}
				content={t('list.base.global.title', {
					msg: currentBaseInfo?.nftData?.name || `# ${currentBaseInfo?.profileId}`,
				})}
				isOpen={tipIsOpen}
				onOpen={tipOnOpen}
				onClose={tipOnClose}
				onOpenChange={tipOnOpenChange}
				handleSubmit={handleReceiveSubmit}
			/>
		</>
	)
}
export default ProfileListPage
