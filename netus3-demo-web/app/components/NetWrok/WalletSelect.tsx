import Image from 'next/image'
import { useMemo } from 'react'
import { WALLETMETHOD } from '@/contracts/walletMethod'
import { NetWrokWrapper, NetWrokInfo } from './styled'

type Types = {
	handleReturnType: (type: 'Metamask' | 'WalletConnect') => void
}

/**
 * wallet connect modal中的选择连接器的样式
 * handleReturnType - 返回当前的选择连接器
 */
const WalletSelectPage = ({ handleReturnType }: Types) => {
	const list = useMemo(() => {
		if (typeof window !== 'undefined') {
			const { ethereum } = window
			if (!ethereum) return WALLETMETHOD.filter(item => item.name !== 'Metamask')
			return WALLETMETHOD
		}
		return WALLETMETHOD.filter(item => item.name !== 'Metamask')
	}, [])

	return (
		<NetWrokWrapper>
			{list.map((item, key) => (
				<NetWrokInfo key={key} active={false} onClick={() => handleReturnType(item.name as any)}>
					<div className="wallet-select-info">
						<Image src={item.icon} width={24} height={24} alt={item.name} />
						<h4>{item.name}</h4>
					</div>
				</NetWrokInfo>
			))}
		</NetWrokWrapper>
	)
}

export default WalletSelectPage
