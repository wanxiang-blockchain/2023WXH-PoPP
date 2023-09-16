import React from 'react'
import { useBoolean, useMount } from 'ahooks'
import { useAppSelector } from '@/redux/hooks'
import { walletConnectV2 } from '@/connectors/walletConnectV2'
import { metaMask } from '@/connectors/metaMask'
import { getAddChainParameters } from '@/contracts/chains'
import { DEFAULT_CHAINID } from '@/contracts/constant'
import { useWeb3React } from '@web3-react/core'
import { toast } from 'react-hot-toast'

import { useTranslation } from 'react-i18next'
import { Button } from '@nextui-org/react'

// 网络错误页面，需要用户手动切换到正确的网络
const SwitchNetWork = () => {
	const { t } = useTranslation()
	const { connector } = useWeb3React()
	const [loading, setLoading] = useBoolean(false)
	const walletType = useAppSelector(state => state.walletConnectReducer.walletType)

	useMount(() => {
		void setLoading.setFalse()
	})

	const handleSwitchNetWrok = async () => {
		setLoading.setTrue()
		try {
			if (walletType === 'WalletConnectV2') {
				await walletConnectV2.activate(DEFAULT_CHAINID)
			} else if (walletType === 'MetaMask') {
				await metaMask.activate(getAddChainParameters(DEFAULT_CHAINID))
			} else {
				if (connector?.deactivate) void connector.deactivate()
				else void connector.resetState()
				setLoading.setFalse()
			}
		} catch (error: any) {
			toast.error(error.message)
			setLoading.setFalse()
			if (connector?.deactivate) void connector.deactivate()
			else void connector.resetState()
		}
	}

	return (
		<Button isLoading={loading} variant="shadow" color="danger" onClick={handleSwitchNetWrok}>
			{t('wallet.swtich.error.network.tips')}
		</Button>
	)
}

export default SwitchNetWork
