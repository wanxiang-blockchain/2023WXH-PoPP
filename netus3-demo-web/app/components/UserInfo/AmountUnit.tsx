import useDataHooks from '@/hooks/useDataHooks'
import { AmountUnitWrapper } from './styled'
import { CHAINNETWORKINFO } from '@/contracts/networks'
import { useWeb3React } from '@web3-react/core'

/**
 * 用户登录后 显示钱包余额以及原生币符号
 */
const AmountUnit = () => {
	const { chainId } = useWeb3React()
	return (
		<AmountUnitWrapper>
			{useDataHooks().balance} {CHAINNETWORKINFO.find(item => item.chainId === chainId)?.unit}
		</AmountUnitWrapper>
	)
}

export default AmountUnit
