'use client'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import Client from '@/i18n/trans'
import { Providers } from '@/redux/provider'

import { NextUIProvider } from '@nextui-org/react'
import { Card, CardBody } from '@nextui-org/react'

/**
 * Toaster: taost全局写入
 * Client: 客服端渲染语言包
 * Providers: redux 全局引入
 */
const NextProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<NextUIProvider>
			<Toaster />
			<Client>
				<Providers>{children}</Providers>
			</Client>
		</NextUIProvider>
	)
}

export default function NextProvidersLayout({ children }: { children: React.ReactNode }) {
	return (
		<NextProviders>
			<div className="flex h-screen w-screen items-center justify-center">
				<Card
					className="w-[460px] md:my-4 md:h-[94vh] md:w-[400px] md:rounded-2xl"
					radius="none"
					classNames={{
						body: 'py-5 px-0',
					}}
				>
					<CardBody className="relative h-screen">{children}</CardBody>
				</Card>
			</div>
		</NextProviders>
	)
}
