import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { NetWrokWrapper, NetWrokInfo } from './styled'
import { CHAINS } from '@/contracts/chains'
import { CHAINNETWORKINFO } from '@/contracts/networks'
import { useWeb3React } from '@web3-react/core'
import { useTheme } from 'styled-components'
import { useAppDispatch } from '@/redux/hooks'
import { saveQrCodeUri } from '@/redux/walletConnect'
import { useTranslation } from 'react-i18next'

const Chains = Object.keys(CHAINS).map(Number)

type Types = {
	loading: boolean
	handleReturnChainId: (id: number) => void
}

/**
 * wallet connect modal中的选择链的样式
 * handleReturnChainId - 返回选择的chainId
 * loading - 是否加载中，主要用于显示不同的文案提示
 */
const NetWrokListPage = ({ handleReturnChainId, loading }: Types) => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { wariningColor } = useTheme()
	const { chainId, isActive } = useWeb3React()
	const [selectChaind, setSelectChain] = useState<number>(Chains[0])

	// 当前环境中是否支持的链数组
	const list = useMemo(() => {
		return CHAINNETWORKINFO.filter(item => Chains.some(ite => ite === item.chainId))
	}, [])

	useEffect(() => {
		handleReturnChainId(selectChaind)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectChaind])

	useEffect(() => {
		if (isActive && chainId) {
			setSelectChain(chainId)
		}
	}, [isActive, chainId])

	const handleSwitchChainId = (id: number) => {
		try {
			if (!isActive) {
				setSelectChain(id)
				dispatch(saveQrCodeUri(undefined))
			} else {
			}
		} catch (error) {}
	}

	return (
		<NetWrokWrapper>
			{list.map(item => (
				<NetWrokInfo key={item.chainId} active={selectChaind === item.chainId} onClick={() => handleSwitchChainId(item.chainId)}>
					<div style={{ width: '50%' }} className="flex">
						<Image src={item.image} width={24} height={24} alt={item.name} />
						<span>{item.name}</span>
					</div>
					<div>
						{!isActive ? (
							<>
								{item.chainId === selectChaind && !loading && (
									<div className="nextwork-right">
										<h5>{t('components.network.list.state1')}</h5>
										<div className="netwrok-drop" style={{ background: wariningColor }}></div>
									</div>
								)}
								{item.chainId === selectChaind && loading && (
									<div className="nextwork-right">
										<h5>{t('components.network.list.state2')}</h5>
										<div className="netwrok-drop" style={{ background: wariningColor }}></div>
									</div>
								)}
							</>
						) : (
							<>
								{item.chainId === selectChaind && !loading && (
									<div className="nextwork-right">
										<h5>{t('components.network.list.state3')}</h5>
										<div className="netwrok-drop"></div>
									</div>
								)}
								{item.chainId === selectChaind && loading && (
									<div className="nextwork-right">
										<h5>{t('components.network.list.state2')}</h5>
										<div className="netwrok-drop" style={{ background: wariningColor }}></div>
									</div>
								)}
							</>
						)}
					</div>
				</NetWrokInfo>
			))}
		</NetWrokWrapper>
	)
}

export default NetWrokListPage
