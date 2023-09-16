'use client'
import { useMemo } from 'react'
import { useBoolean } from 'ahooks'
import useDataHooks from '@/hooks/useDataHooks'
import { BlobkNumberContent, BlobkNumberWrapper } from './styled'
import { useWeb3React } from '@web3-react/core'

const BlockNumberPage = () => {
	const blockNumber = useDataHooks().blockNumber
	const { isActive } = useWeb3React()
	const [loadingBlock, setLoadingBlock] = useBoolean(false)

	useMemo(() => {
		setLoadingBlock.setTrue()
		setTimeout(() => {
			setLoadingBlock.setFalse()
		}, 1000)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [blockNumber])

	if (!isActive) return null

	return (
		<BlobkNumberWrapper className="relative z-10">
			<BlobkNumberContent $coloropacity={loadingBlock}>
				{loadingBlock && (
					<>
						<div className="block-rates"></div>
						<div className="block-rates-modal"></div>
					</>
				)}
				{blockNumber}
			</BlobkNumberContent>
		</BlobkNumberWrapper>
	)
}

export default BlockNumberPage
