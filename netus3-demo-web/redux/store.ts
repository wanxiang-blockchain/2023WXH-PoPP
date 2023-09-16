import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './theme'
import walletConnectReducer from './walletConnect'
import seeionDataReducer from './seeionData'

/**
 * themeReducer - styledComponents 主题配置
 * walletConnectReducer - 钱包链接配置参数
 * seeionDataReducer - 用户交易pending 以及 penging后参数存储
 */
export const store = configureStore({
	reducer: {
		themeReducer,
		walletConnectReducer,
		seeionDataReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
