import 'server-only'
import { cookies, headers } from 'next/headers'
import { Locale, i18n } from './type'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

export const getUserLanguage = (): Locale => {
	// @ts-expect-error locales are readonly
	const locales: string[] = i18n.locales

	let languages: string[] | undefined
	// get locale from cookie
	const localeCookie = cookies().get('locale')
	languages = localeCookie?.value ? [localeCookie.value] : []

	if (!languages.length) {
		// Negotiator expects plain object so we need to transform headers
		const negotiatorHeaders: Record<string, string> = {}
		headers().forEach((value, key) => (negotiatorHeaders[key] = value))
		// Use negotiator and intl-localematcher to get best locale
		languages = new Negotiator({ headers: negotiatorHeaders }).languages()
	}

	// match locale
	const matchedLocale = match(languages, locales, i18n.defaultLocale) as Locale
	return matchedLocale
}
