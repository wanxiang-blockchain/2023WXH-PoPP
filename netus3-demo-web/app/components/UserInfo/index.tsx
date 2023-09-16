import { useCallback, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Wrapper } from './styled'
import Info from './Info'
import Setting from './Setting'
import NetWrok from '@/app/components/NetWrok'
import { useAppSelector } from '@/redux/hooks'
import { URLS } from '@/contracts/chains'
import { getActiveChainId } from '@/contracts/constant'

import PendingPage from './Pending'
import SwitchNetWork from '@/app/components/NetWrok/SwitchNetWork'

/**
 * 用户登录后显示的信息
 */
const UserInfoPage = () => {
	const { isActive, chainId } = useWeb3React()
	// 用户在交易过程中的pending 状态
	const isPend = useAppSelector(state => state.seeionDataReducer.isPend)

	const chainIds = Object.keys(URLS)

	const isTrueChainId = useMemo(() => {
		return getActiveChainId(chainIds, Number(chainId))
	}, [chainId, chainIds])

	const UserInfoData = useCallback(() => {
		if (isPend) return <PendingPage />

		if (!isTrueChainId) return <SwitchNetWork />

		return <Info />
	}, [isPend, isTrueChainId])

	if (!isActive) return <></>

	return (
		<div className="flex flex-wrap items-center justify-center">
			{isTrueChainId && <NetWrok />}
			<UserInfoData />
		</div>
	)
}

export default UserInfoPage
