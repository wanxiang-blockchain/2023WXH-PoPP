'use client'

import { useEffect, useMemo, useState } from 'react'
import useDataHooks from '@/hooks/useDataHooks'
import { FinancePoolNFTModule_ABI, ZERO_ADDRESS } from '@/contracts/constant'
import { useWeb3React } from '@web3-react/core'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'

type Types = { currentProfileId: string; currentPubId: string; isRedux: boolean }

export type RewardType = {
	currentRewardAmount: number
	worksAmount: number
	forwardAmount: number
	bonusAmount: number
	collectBenefit: number
	donateBenefit: number
}

const RewardInit: RewardType = {
	currentRewardAmount: 0,
	worksAmount: 0,
	forwardAmount: 0,
	bonusAmount: 0,
	collectBenefit: 0,
	donateBenefit: 0,
}

export type PointType = {
	collectPoint: number
	point: number
	zanPoint: number
	cAddress: string
	cAddressRate: number
}

export type ProfitPointType = {
	collect: PointType
	donate: PointType
}

const ProfitPointInit: ProfitPointType = {
	collect: {
		collectPoint: 0,
		point: 0,
		zanPoint: 0,
		cAddress: '',
		cAddressRate: 0,
	},
	donate: {
		collectPoint: 0,
		point: 0,
		zanPoint: 0,
		cAddress: '',
		cAddressRate: 0,
	},
}

const useCapitalPoolHooks = ({ currentProfileId, currentPubId, isRedux }: Types) => {
	const { constant, web3 } = useDataHooks().data
	const { account } = useWeb3React()

	const { poppList } = useProfileCreatedHooks({ isRedux: false })

	// 当前账号拥有的nft
	const poppListCurrents = useMemo(() => {
		if (!account || poppList.length === 0) return []
		return poppList.filter(item => item.to.toLocaleLowerCase() === account?.toLocaleLowerCase())
	}, [account, poppList])

	// 查询当前可领取的收益以及其他分类收益
	const [state, setState] = useState<RewardType>(RewardInit)
	const [loading, setLoading] = useState<boolean>(false)
	const [poolFinanceContracts, setPoolFinanceContracts] = useState<any>(undefined)

	/**
	 * await poolFinance.collectProfitPoint()//收藏池分配比例
    .then(console.log)
  await poolFinance.donateProfitPoint()//打赏池分配比例
    .then(console.log)
	 */
	// 获取各类的分配比例
	const [profitPoint, setProfitPoint] = useState<ProfitPointType>(ProfitPointInit)

	useEffect(() => {
		if (typeof currentProfileId !== 'undefined' && typeof currentPubId !== 'undefined' && account) handleGetRewardData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentProfileId, currentPubId, isRedux, account])

	// 判断是否拥有设置权限
	const limitsAuthority = useMemo(() => {
		setLoading(false)
		if (poppListCurrents.length === 0 || typeof currentProfileId === 'undefined') return false
		let obj = poppListCurrents.find(item => item.profileId.toString() === currentProfileId.toString())
		return obj ? true : false
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [poppListCurrents, currentProfileId, isRedux])

	const handleGetRewardData = async () => {
		setLoading(true)
		try {
			const promise = await Promise.all([constant.ContractHub.methods.getFinancePool(currentProfileId, currentPubId).call()])
				.then(res => {
					let poolFinanceAddress = res[0]
					const poolFinanceContract: any = new web3.eth.Contract(FinancePoolNFTModule_ABI, poolFinanceAddress)
					return {
						poolFinanceContract,
					}
				})
				.then(async res => {
					const poolFinanceContract = res.poolFinanceContract
					let calcReward = await poolFinanceContract.methods.calcReward(account).call()
					let calcRewardSplit = await poolFinanceContract.methods.calcRewardSplit(account).call()
					let benefitsAvailableRecord = await poolFinanceContract.methods.benefitsAvailableRecord().call()

					let collectProfitPoint = await poolFinanceContract.methods.collectProfitPoint().call()
					let donateProfitPoint = await poolFinanceContract.methods.donateProfitPoint().call()

					return await {
						...res,
						calcReward,
						calcRewardSplit,
						benefitsAvailableRecord,
						collectProfitPoint,
						donateProfitPoint,
					}
				})
			console.log('promise', promise)
			setPoolFinanceContracts(promise.poolFinanceContract)
			setState({
				currentRewardAmount: parseFloat(web3.utils.fromWei(parseFloat(promise.calcReward), 'ether')),
				worksAmount: parseFloat(web3.utils.fromWei(parseFloat(promise.calcRewardSplit.collect), 'ether')),
				forwardAmount: parseFloat(web3.utils.fromWei(parseFloat(promise.calcRewardSplit.referral), 'ether')),
				bonusAmount: parseFloat(web3.utils.fromWei(parseFloat(promise.calcRewardSplit.donate), 'ether')),
				collectBenefit: parseFloat(web3.utils.fromWei(parseFloat(promise.benefitsAvailableRecord.collectBenefit), 'ether')),
				donateBenefit: parseFloat(web3.utils.fromWei(parseFloat(promise.benefitsAvailableRecord.donateBenefit), 'ether')),
			})
			setProfitPoint({
				collect: {
					collectPoint:
						parseFloat(promise.collectProfitPoint.collectPoint) === 0
							? 0
							: parseFloat(promise.collectProfitPoint.collectPoint) / 100,
					point: parseFloat(promise.collectProfitPoint.point) === 0 ? 0 : parseFloat(promise.collectProfitPoint.point) / 100,
					zanPoint:
						parseFloat(promise.collectProfitPoint.zanPoint) === 0 ? 0 : parseFloat(promise.collectProfitPoint.zanPoint) / 100,
					cAddress: promise.collectProfitPoint.profitNftAddress,
					cAddressRate:
						parseFloat(promise.collectProfitPoint.profitNftPoint) === 0
							? 0
							: parseFloat(promise.collectProfitPoint.profitNftPoint) / 100,
				},
				donate: {
					collectPoint:
						parseFloat(promise.donateProfitPoint.collectPoint) === 0
							? 0
							: parseFloat(promise.donateProfitPoint.collectPoint) / 100,
					point: parseFloat(promise.donateProfitPoint.point) === 0 ? 0 : parseFloat(promise.donateProfitPoint.point) / 100,
					zanPoint:
						parseFloat(promise.donateProfitPoint.zanPoint) === 0 ? 0 : parseFloat(promise.donateProfitPoint.zanPoint) / 100,
					cAddress: promise.donateProfitPoint.profitNftAddress,
					cAddressRate:
						parseFloat(promise.donateProfitPoint.profitNftPoint) === 0
							? 0
							: parseFloat(promise.donateProfitPoint.profitNftPoint) / 100,
				},
			})
			if (limitsAuthority) setLoading(false)
		} catch (error: any) {
			setLoading(false)
			console.log('err', error.messge)
		}
	}

	return {
		rewardState: state,
		loading,
		poolFinanceContracts,
		limitsAuthority,
		profitPoint,
	}
}

export default useCapitalPoolHooks
