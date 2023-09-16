'use client'
import { useState, useEffect, useMemo } from 'react'
import Mock from 'mockjs'
import axios from 'axios'
import { useMemoizedFn, useSessionStorageState } from 'ahooks'
import { useLiveQuery } from 'dexie-react-hooks'
import useDataHooks from '@/hooks/useDataHooks'
import { useWeb3React } from '@web3-react/core'

import { axiosGraphQlProfileCreateData, axiosGraphQlFollowInfoData } from '@/graphql/profile'
import type { ProfileCreateListType, FollowInfosType } from '@/graphql/profile'
import { handleNftImage } from '@/utils'
import { Events_ABI, PlanetBase_ABI } from '@/contracts/constant'
import { db, handleIpfsHistory } from '@/common/db'

// 0=popp 用户 1=planet 星球 2=base 基地
const ProfileTypeOptions = [
	{ value: 0, label: 'popp' },
	{ value: 1, label: 'planet' },
	{ value: 2, label: 'base' },
]

const useProfileCreatedHooks = ({ isRedux }: { isRedux: boolean }) => {
	const { account, isActive } = useWeb3React()
	const { constant, web3, Hub_ADDRESS, Planet_Base_ADDRESS } = useDataHooks().data
	const ipfsLists = useDataHooks().ipfsLists

	const [loading, setLoading] = useState<boolean>(false)
	// 判断是否有创建的权限
	const [createPrivate, setCreatePrivate] = useState<boolean>(false)
	// 列表数据
	const [list, setList] = useState<ProfileCreateListType[]>([])
	// 当前用户的关注或加入的数据
	const [currentAccountFollowList, setCurrentAccountFollowList] = useState<FollowInfosType[]>([])

	useEffect(() => {
		handleFollowedList()
		setCreatePrivate(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRedux, account, isActive])

	// 获取是否有创建的权限
	const handleCreatePrivate = async () => {
		try {
			return await constant.ContractHub.methods.isProfileCreatorWhitelisted(account).call()
		} catch (error) {
			return await false
		}
	}

	// 获取所有创建列表数据
	const handleFollowedList = async () => {
		setLoading(true)
		try {
			// const ContractEvents = new web3.eth.Contract(Events_ABI, Hub_ADDRESS)
			// let lists: any = await ContractEvents.getPastEvents('MirrorCreated', {
			// 	fromBlock: 47531400,
			// 	toBlock: 47531500,
			// })

			// console.log('lists', lists)

			const dataPromise: ProfileCreateListType[] = []
			const promise = await Promise.all([axiosGraphQlProfileCreateData(), axiosGraphQlFollowInfoData({ account: account || '' })])
				.then(res => {
					const { profileCreateInfos } = res[0]
					const { followInfos } = res[1]
					profileCreateInfos.forEach(item => {
						item.profileType = Number(item.profileType) as any
						item.planetId = Number(item.planetId) as any
					})
					return {
						list: profileCreateInfos,
						followInfos,
					}
				})
				.then(res => {
					return {
						list: res.list.map(async element => {
							if (element.profileType === 2)
								return await {
									...element,
									nftData: {
										name: element.baseName,
									},
								}
							try {
								let localData = ipfsLists.find(il => il.followNFTURI === element.followNFTURI)
								let data = localData ? localData : await nftUriAxiosData(element.followNFTURI)
								element.nftData = data
								return await element
							} catch (error) {
								return await element
							}
						}),
						followInfos: res.followInfos,
					}
				})
			for (let i = 0; i < promise.list.length; i++) {
				const item: any = await promise.list[i]
				dataPromise.push({
					...item,
					isCurrentAccountFollow: false,
					nftData: {
						...item.nftData,
						image: handleNftImage(item.nftData?.image, item.profileId),
					} as any,
				})
			}
			let isCreate = isActive && account ? await handleCreatePrivate() : false
			setCurrentAccountFollowList(promise.followInfos)
			setList(dataPromise)
			setCreatePrivate(isCreate)
			setLoading(false)
		} catch (error) {
			console.log('res', error)
			setLoading(false)
			setCreatePrivate(false)
			setList([])
		}
	}

	const poppList = useMemo<ProfileCreateListType[]>(() => {
		if (typeof list === 'undefined' || list?.length === 0) return []
		if (!account) return list.filter(item => item.profileType === 0)
		return list
			.filter(item => item.profileType === 0)
			.map(item => {
				let caflObj = currentAccountFollowList.find(cafl => cafl.profileId === item.profileId.toString())
				return {
					...item,
					isCurrentAccountFollow: typeof caflObj !== 'undefined' ? true : false,
				}
			})
	}, [list, account, currentAccountFollowList])

	const planetList = useMemo<ProfileCreateListType[]>(() => {
		if (typeof list === 'undefined' || list?.length === 0) return []
		if (!account) return list.filter(item => item.profileType === 1)
		return list
			.filter(item => item.profileType === 1)
			.map(item => {
				let caflObj = currentAccountFollowList.find(cafl => cafl.profileId === item.profileId.toString())
				return {
					...item,
					isCurrentAccountFollow: typeof caflObj !== 'undefined' ? true : false,
				}
			})
	}, [list, account, currentAccountFollowList])

	const baseList = useMemo<ProfileCreateListType[]>(() => {
		if (typeof list === 'undefined' || list?.length === 0) return []
		return list.filter(item => item.profileType === 2)
	}, [list])

	return {
		list,
		loading,
		poppList,
		planetList,
		baseList,
		createPrivate,
	}
}

// nft 源数据获取
const nftUriAxiosData = async (uri: string): Promise<any> => {
	try {
		let data = await axios({
			method: 'get',
			url: uri.substring(0, 21) === 'https://netus3mainnet' ? `https://netus3v2${uri.substring(21, uri.length)}` : uri,
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

export default useProfileCreatedHooks
