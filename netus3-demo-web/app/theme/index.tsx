'use client'
import { useMemo, useState } from 'react'
import { css, DefaultTheme, ServerStyleSheet, StyleSheetManager, ThemeProvider } from 'styled-components'
import { Colors, MediaWidthTypes } from './styled'
import { useAppSelector } from '@/redux/hooks'
import { useServerInsertedHTML } from 'next/navigation'

const MEDIA_WIDTHS: MediaWidthTypes = {
	xs: 576,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1600,
	maxl: 1920,
}

/**
 * 参考 https://ant.design/components/grid-cn 的布局方式，基本满足通用配置Row Col
 *
 */
const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
	(accumulator, size) => {
		size === 'xs'
			? ((accumulator as any)[size] = (a: any, b: any, c: any) => css`
					@media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
						${css(a, b, c)}
					}
			  `)
			: ((accumulator as any)[size] = (a: any, b: any, c: any) => css`
					@media (min-width: ${(MEDIA_WIDTHS as any)[size]}px) {
						${css(a, b, c)}
					}
			  `)
		return accumulator
	},
	{},
) as any

const themeColor = '#3396FF'
const white = '#FFFFFF'
const black = 'rgba(0,0,0,.85)'
const successColor = '#00b578'
const wariningColor = '#ff8f1f'
const dengerColor = '#ff3141'

export const colors = (darkMode: boolean): Colors => {
	return {
		white,
		black,
		themeColor,
		successColor,
		wariningColor,
		dengerColor,
		line: darkMode ? '#f0f0f0' : '#f0f0f0',
		gary: darkMode ? '#98a1c0' : '#98a1c0',
		bgColor: darkMode ? '#fff' : '#fff',
	}
}

export const theme = (darkMode: boolean, isMobile: boolean): DefaultTheme => {
	return {
		...colors(darkMode),
		mediaWidth: mediaWidthTemplates,
		isMobile,
	}
}

/**
 * 配置StyledComponents组件
 * 参考： https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components
 */
export const StyledComponentsRegistry = ({ children }: { children: React.ReactNode }) => {
	const themeBoolean = useAppSelector(state => state.themeReducer.themeBoolean)
	const isMobile = useAppSelector(state => state.themeReducer.isMobile)
	const darkMode = themeBoolean
	const themeObject = useMemo(() => theme(darkMode, isMobile), [darkMode, isMobile])

	const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

	useServerInsertedHTML(() => {
		const styles = styledComponentsStyleSheet.getStyleElement()
		styledComponentsStyleSheet.instance.clearTag()
		return <ThemeProvider theme={themeObject}>{styles}</ThemeProvider>
	})

	if (typeof window !== 'undefined') return <ThemeProvider theme={themeObject}>{children}</ThemeProvider>

	return (
		<StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
			<ThemeProvider theme={themeObject}>{children}</ThemeProvider>
		</StyleSheetManager>
	)
}
