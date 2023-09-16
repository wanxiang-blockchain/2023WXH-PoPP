import { createSlice } from '@reduxjs/toolkit'
import { WalletTypes } from '@/types'

type WalletStateType = {
	isLogin: boolean
	walletType: WalletTypes
	qrCodeUri: string | undefined
}

const initialState = {
	isLogin: typeof window !== 'undefined' ? (window.localStorage.getItem('isLogin') ? true : false) : false,
	walletType: typeof window !== 'undefined' ? window.localStorage.getItem('wallet') || 'NetWork' : 'NetWork',
	qrCodeUri: typeof window !== 'undefined' ? window.sessionStorage.getItem('uri') || undefined : undefined,
} as WalletStateType

export const wallet = createSlice({
	name: 'walletConnect',
	initialState,
	reducers: {
		saveIsLogin: (state, action) => {
			state.isLogin = action.payload
		},
		saveWalletType: (state, action) => {
			state.walletType = action.payload
		},
		saveQrCodeUri: (state, action) => {
			state.qrCodeUri = action.payload
			if (typeof window !== undefined && typeof action.payload !== 'undefined')
				window.sessionStorage.setItem('uri', action.payload)
			if (typeof window !== undefined && typeof action.payload === 'undefined') window.sessionStorage.removeItem('uri')
		},
	},
})

export const { saveIsLogin, saveWalletType, saveQrCodeUri } = wallet.actions

export default wallet.reducer
