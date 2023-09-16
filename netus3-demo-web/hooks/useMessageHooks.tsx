'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import type { MessageInfoTypes } from '@/graphql/message'
import { axiosGraphQlMessageInfoData } from '@/graphql/message'
import { db, handleIpfsHistory } from '@/common/db'
import { handleNftImage } from '@/utils'
import useDataHooks from '@/hooks/useDataHooks'
import { DAI_ABI, Hub_ABI, ZERO_ADDRESS } from '@/contracts/constant'
import { useWeb3React } from '@web3-react/core'
import { FinancePoolNFTModule_ABI } from '@/contracts/constant'

export type MessageListType = {
	id: number | undefined
	name: string
	content: string
	isLike: boolean
	isCollect: boolean
	collectAmount: string | undefined
	collectScale: string | undefined
	rewardScale: string | undefined
	baseId: string | undefined
	planetId: string | undefined
}

const useMessageHooks = ({ isRedux }: { isRedux: boolean }) => {
	const { account } = useWeb3React()
	const ipfsLists = useDataHooks().ipfsLists
	const { web3, constant, fromWeiPowBanlance } = useDataHooks().data
	const [loading, setLoading] = useState<boolean>(false)
	const [list, setList] = useState<MessageInfoTypes[]>([])

	// 当前用户地址的Dai余额
	const [currentAccountDaiAmount, setCurrentAccountDaiAmount] = useState<number>(0)

	useEffect(() => {
		handleMessageList()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRedux, account])

	useEffect(() => {
		if (account) handleGetDAIAmount()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account, isRedux])

	// 获取当前账户的dai余额
	const handleGetDAIAmount = async () => {
		try {
			let DAI = await constant.ContractDai.methods.balanceOf(account).call()
			let dais = fromWeiPowBanlance({ decimals: '18', balance: DAI })
			console.log('dai', dais)
			setCurrentAccountDaiAmount(parseFloat(dais))
		} catch (error) {
			setCurrentAccountDaiAmount(0)
		}
	}

	const handleMessageList = async () => {
		setLoading(true)
		try {
			const dataPromise: MessageInfoTypes[] = []
			const promise = await Promise.all([axiosGraphQlMessageInfoData()])
				.then(res => {
					const { contentInfos } = res[0]
					return {
						list: contentInfos,
					}
				})
				.then(res => {
					return {
						list: res.list.map(async element => {
							if (element.type === 'mirror') {
								let currentObj = res.list.find(ite => ite.pubId === element.pubIdPointed)
								console.log('currentObj', currentObj)
								if (currentObj) {
									try {
										let localData = ipfsLists.find(il => il.followNFTURI === element.contentURI)
										let data = localData ? localData : await nftUriAxiosData(currentObj.contentURI)
										element.nftData = data
										return await {
											...element,
											collectModuleReturnData: currentObj.collectModuleReturnData,
										}
									} catch (error) {
										return await {
											...element,
											collectModuleReturnData: currentObj.collectModuleReturnData,
										}
									}
								}

								return await element
							}
							try {
								let data = await nftUriAxiosData(element.contentURI)
								element.nftData = data
								return await element
							} catch (error) {
								return await element
							}
						}),
					}
				})
				.then(async res => {
					return {
						list: res.list.map(async items => {
							let item = await items
							let isCollect = false,
								isLike = false
							try {
								let getCollectNFT = await constant.ContractHub.methods.getCollectNFT(item.profileId, item.pubId).call()
								if (getCollectNFT !== ZERO_ADDRESS && account) {
									let deployErc20Dai: any = new web3.eth.Contract(DAI_ABI, getCollectNFT)
									let balanceOfs = await deployErc20Dai.methods.balanceOf(account).call()
									let balanceOfAmount = parseFloat(balanceOfs)
									if (balanceOfAmount > 0) isCollect = true
								}

								let financePools = await constant.ContractHub.methods.getFinancePool(item.profileId, item.pubId).call()
								if (financePools !== ZERO_ADDRESS && account) {
									let financePoolsContract: any = new web3.eth.Contract(FinancePoolNFTModule_ABI, financePools)
									let addressZanCountHistorys = await financePoolsContract.methods.addressZanCountHistory(account).call()
									let addressZanCountHistorysAmount = parseFloat(addressZanCountHistorys)
									if (addressZanCountHistorysAmount > 0) isLike = true
								}
							} catch (error) {}

							return await {
								...item,
								isCollect,
								isLike,
							}
						}),
					}
				})
			for (let i = 0; i < promise.list.length; i++) {
				const item: any = await promise.list[i]
				if (item.type === 'mirror' && item.collectModuleReturnData === ZERO_ADDRESS) {
					dataPromise.push({
						...item,
						nftData: {
							...item.nftData,
							image: handleNftImage(item.nftData?.image, item.profileId),
						} as any,
					})
				} else {
					try {
						let res: any = web3.eth.abi.decodeParameters(['uint256', 'address', 'uint256', 'bool'], item.collectModuleReturnData)
						dataPromise.push({
							...item,
							nftData: {
								...item.nftData,
								image: handleNftImage(item.nftData?.image, item.profileId),
							} as any,
							collectModuleReturnDatas: {
								amount: res[0] ? web3.utils.fromWei(parseFloat(res[0] as any), 'ether') : '0',
								currency: res[1],
								referralFee: parseFloat(res[2] as any),
								followerOnly: res[3],
							},
						})
					} catch (error) {}
				}
			}
			setList(
				dataPromise.sort((a, b) => {
					return Number(a.timestamp) - Number(b.timestamp)
				}),
			)
			setLoading(false)
		} catch (error) {
			console.log('res', error)
			setLoading(false)
			setList([])
		}
	}

	return { messageList: list, loading, currentAccountDaiAmount }
}

// nft 源数据获取
const nftUriAxiosData = async (uri: string): Promise<any> => {
	try {
		let data = await axios({
			method: 'get',
			url: uri,
			timeout: 3000,
		})
		handleIpfsHistory({
			...data.data,
			followNFTURI: uri,
		})
		return await data.data
	} catch (error) {
		return await undefined
	}
}

export default useMessageHooks
