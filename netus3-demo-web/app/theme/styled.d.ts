import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
	white: Color
	black: Color
	themeColor: Color
	successColor: Color
	wariningColor: Color
	dengerColor: Color
	line: Color
	gary: Color
	bgColor: Color
}

export interface MediaWidthTypes {
	xs: number
	sm: number
	md: number
	lg: number
	xl: number
	xxl: number
	maxl: number
}

declare module 'styled-components' {
	export interface DefaultTheme extends Colors {
		mediaWidth: {
			xs: ThemedCssFunction<DefaultTheme>
			sm: ThemedCssFunction<DefaultTheme>
			md: ThemedCssFunction<DefaultTheme>
			lg: ThemedCssFunction<DefaultTheme>
			xl: ThemedCssFunction<DefaultTheme>
			xxl: ThemedCssFunction<DefaultTheme>
			maxl: ThemedCssFunction<DefaultTheme>
		}
		isMobile: boolean
	}
}
