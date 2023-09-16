'use client'

import { store } from './store'
import { Provider } from 'react-redux'

// redux 全局入口配置，必须在客户端渲染
export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>
}
