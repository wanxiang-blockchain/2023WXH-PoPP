'use client'
import LanguageDetector from 'i18next-browser-languagedetector'
import i18n from 'i18next'
import enUsTrans from '@/locales/en-us'
import zhTwTrans from '@/locales/zh-tw'
import { initReactI18next } from 'react-i18next'
import { getLocaleOnClient } from './client'

import type { Locale } from './type'

const resources: any = {
	en: {
		translation: enUsTrans,
	},
	'zh-Hans': {
		translation: zhTwTrans,
	},
}

type Types = {
	locale: Locale
	value: string
}

export const languageList: Types[] = [
	{ locale: 'en', value: 'English' },
	{ locale: 'zh-Hans', value: '繁體中文' },
]

export const localeList: Types[] = [
	{ locale: 'en', value: 'enUs' },
	{ locale: 'zh-Hans', value: 'zhTW' },
]

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		lng: getLocaleOnClient(),
		keySeparator: false,
		interpolation: {
			escapeValue: false,
		},
	})

export default i18n
