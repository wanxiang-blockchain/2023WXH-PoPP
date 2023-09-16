'use client'
import { Link, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
	const { t } = useTranslation()
	return (
		<div className="mt-24 grid grid-cols-1 gap-4 px-5">
			<Link href="/profile">
				<Button className="w-full">{t('home.list.title1')}</Button>
			</Link>
			<Link href="/planet">
				<Button className="w-full">{t('home.list.title2')}</Button>
			</Link>
			<Link href="/base">
				<Button className="w-full">{t('home.list.title3')}</Button>
			</Link>
			<Link href="/message">
				<Button className="w-full">{t('home.list.title4')}</Button>
			</Link>
		</div>
	)
}

export default HomePage
