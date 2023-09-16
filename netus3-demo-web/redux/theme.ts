import { createSlice } from '@reduxjs/toolkit'

type ThemeStateType = {
	themeBoolean: boolean
	isMobile: boolean
}

const initialState = {
	themeBoolean: false,
	isMobile: true,
} as ThemeStateType

export const theme = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		saveTheme: (state, action) => {
			state.themeBoolean = action.payload
		},
		saveIsMobile: (state, action) => {
			state.isMobile = action.payload
		},
	},
})

export const { saveTheme, saveIsMobile } = theme.actions

export default theme.reducer
