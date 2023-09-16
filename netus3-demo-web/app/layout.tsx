import 'animate.css'
import '@/i18n/index'
import './globals.css'
import './../public/icon/iconfont.css'
import GlobalStyle from './globals'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { StyledComponentsRegistry } from './theme'

import PageProvider from '@/app/components/PageProvider'
import Web3ProviderPage from '@/app/components/Wbe3Provider'
import { getUserLanguage } from '@/i18n/server'
import NextProviders from './providers'

const inter = Inter({
	weight: ['400', '500'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Netus3-demo',
	description: 'PoPP Netus3 Protocol Demo',
	icons: 'https://poppclub.oss-cn-chengdu.aliyuncs.com/image/logo-square.svg',
}

/**
 * getUserLanguage: 服务端渲染，通过nextjs获取当前语言版本，写入html的lang中
 * inter: 配置默认字体大小、默认字体参数，可自定义，参考 https://nextjs.org/docs/app/building-your-application/optimizing/fonts
 * metadata: 配置系统标题、描述文件等参数
 * StyledComponents: 全局引入，可参考文档：https://nextjs.org/docs/app/building-your-application/styling/css-in-js
 * Web3ProviderPage: web3-react 全局入口, Context.Provider全局变量入口
 * PageProvider: 实例化完成web3-react, 进入页面最后一次全局数据设置
 * NextProviders: next ui导入
 */
const RootLayout = ({ children }: { children: React.ReactNode }) => {
	const locale = getUserLanguage()
	return (
		<html lang={locale ?? 'en'} className="light">
			<body className={` ${inter.className}`}>
				<NextProviders>
					<StyledComponentsRegistry>
						<Web3ProviderPage>
							<PageProvider>{children}</PageProvider>
						</Web3ProviderPage>
						<GlobalStyle />
					</StyledComponentsRegistry>
				</NextProviders>
			</body>
		</html>
	)
}

export default RootLayout
