'use client'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'
import List from '@/app/(list)/components/List'

import { Spinner, Link } from '@nextui-org/react'
import NoData from '@/app/components/NoData'
import { useTranslation } from 'react-i18next'

const PlanetListPage = () => {
	const { t } = useTranslation()
	// 星球信息列表
	const { planetList, loading } = useProfileCreatedHooks({ isRedux: false })

	if (loading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	return (
		<>
			<div className="h-full	px-5">
				<div className={`flex h-[var(--page-height-h5)] w-full md:h-[var(--page-height)]`}>
					<div className="h-full w-full overflow-hidden overflow-y-scroll">
						{planetList.map((pl, key) => (
							<Link
								key={key}
								color="foreground"
								href={`/base/${pl.profileId}`}
								className="w-full border-t-1	border-dashed border-gray-300 first:border-0"
							>
								<List userInfo={pl} type="base" handleReturn={() => {}} />
							</Link>
						))}
						{planetList.length === 0 && <NoData text={t('list.base.no.data.tips')} classOther="h-full" />}
					</div>
				</div>
			</div>
		</>
	)
}
export default PlanetListPage
