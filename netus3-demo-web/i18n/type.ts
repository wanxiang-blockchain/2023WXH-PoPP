/**
 * 国际化默认语言 en
 * 支持语言 ['en', 'zh-Hans']
 */
export const i18n = {
	defaultLocale: 'zh-Hans',
	locales: ['en', 'zh-Hans'],
} as const

export type Locale = (typeof i18n)['locales'][number]

export const LOCALE_COOKIE_NAME = 'locale'
