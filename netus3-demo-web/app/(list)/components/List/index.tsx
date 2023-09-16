import React from 'react'
import Image from 'next/image'
import ICONDEFAULT from '@/assets/icon-default.svg'
import { Button } from '@nextui-org/react'
import { ProfileCreateListType } from '@/graphql/profile'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'react-i18next'

type Type = {
	userInfo: ProfileCreateListType
	type: 'popp' | 'planet' | 'base'
	handleReturn: () => void
	loading?: boolean
}

const ListPage = ({ userInfo, type, handleReturn, loading = false }: Type) => {
	const { t } = useTranslation()
	const { account } = useWeb3React()
	return (
		<div
			className={`flex h-16 w-full items-center justify-between border-t-1	border-dashed border-gray-300 first:border-0 ${
				type === 'base' ? 'cursor-pointer' : ''
			}`}
		>
			<div className="flex items-center">
				<Image className="mr-2 rounded-[100%]" src={ICONDEFAULT} alt="default" width={32} height={32} />
				<div className="text-base">{userInfo.nftData?.name || `# ${userInfo.profileId}`}</div>
			</div>
			{account?.toLocaleLowerCase() !== userInfo.to.toLocaleLowerCase() && (
				<>
					{type === 'base' && <></>}
					{type === 'popp' && (
						<Button isLoading={loading} isDisabled={userInfo.isCurrentAccountFollow} onClick={handleReturn} size="sm">
							{!userInfo.isCurrentAccountFollow ? t('list.profile.btn.title1') : t('list.profile.btn.title2')}
						</Button>
					)}
				</>
			)}
			{type === 'planet' && (
				<Button isLoading={loading} isDisabled={userInfo.isCurrentAccountFollow} onClick={handleReturn} size="sm">
					{!userInfo.isCurrentAccountFollow ? t('list.planet.btn.title1') : t('list.planet.btn.title2')}
				</Button>
			)}
		</div>
	)
}

export default ListPage
