'use client'
import { getLocaleOnClient } from '@/i18n/client'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '@/app/loading'

declare var window: any

/**
 * 国际化-客服端渲染
 * 若渲染未完成 显示loading
 * 若渲染完成，则显示children
 */
const ClientPage = ({ children }: { children: React.ReactNode }) => {
	const [loading, setLoading] = useState<boolean>(true)
	const { i18n } = useTranslation()
	useEffect(() => {
		handleChangeLocal()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleChangeLocal = () => {
		try {
			setLoading(true)
			if (typeof window !== 'undefined') {
				i18n.changeLanguage(getLocaleOnClient())
				document.documentElement.lang = i18n.language
				setLoading(false)
			}
		} catch (error) {
			setLoading(false)
		}
	}

	if (loading) return <Loading />

	return <>{children}</>
}

export default ClientPage
