import Cookies from 'js-cookie'
import { i18n, LOCALE_COOKIE_NAME, Locale } from './type'

// same logic as server
export const getLocaleOnClient = (): Locale => {
	return i18n.defaultLocale
	return (Cookies.get(LOCALE_COOKIE_NAME) as Locale) || i18n.defaultLocale
}

export const setLocaleOnClient = (locale: Locale) => {
	Cookies.set(LOCALE_COOKIE_NAME, locale)
}
