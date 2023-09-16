'use client'
import { useMemo } from 'react'
import { getActiveChainId } from '@/contracts/constant'
import BlockNumber from '../Provider/BlockNumber'
import WalletConnect from '@/app/components/WalletConnect'
import { useWeb3React } from '@web3-react/core'
import { URLS } from '@/contracts/chains'
import NoDate from '@/app/components/NoData'
import { useTranslation } from 'react-i18next'

const chainIds = Object.keys(URLS)

export default function PageProvider({ children }: { children: React.ReactNode }) {
	const { isActive, chainId } = useWeb3React()
	const { t } = useTranslation()

	const isTrue = useMemo(() => {
		if (!chainId) return false
		return getActiveChainId(chainIds, chainId)
	}, [chainId])

	const isLoadPage = useMemo(() => {
		if (isActive && isTrue) return true
		return false
	}, [isTrue, isActive])

	return (
		<div className={`relative ${!isLoadPage ? 'h-full' : ''}`}>
			<WalletConnect />
			<BlockNumber />
			{!isLoadPage ? (
				<NoDate text={t('app.no.isActive.tips')} classOther="h-full flex items-center justify-center " />
			) : (
				<>{children}</>
			)}
		</div>
	)
}
