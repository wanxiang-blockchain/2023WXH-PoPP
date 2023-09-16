'use client'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'
import { Navbar, NavbarContent, Link, Spinner } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const NavBarPage = () => {
	const pathname = usePathname()
	const router = useRouter()
	const { t } = useTranslation()

	const { planetList, baseList, loading } = useProfileCreatedHooks({ isRedux: false })

	// 若是基地列表，显示当前星球名称
	const planetName = useMemo(() => {
		if (pathname.substring(0, 6) === '/base/') {
			let id = pathname.substring(6, pathname.length)
			return planetList.find(ite => ite.profileId.toString() === id.toString())?.nftData?.name
		}
		return undefined
	}, [pathname, planetList])

	// 若是聊天室，显示当前基地名称
	const baseName = useMemo(() => {
		if (pathname.substring(0, 6) === '/chat/') {
			let id = pathname.substring(6, pathname.length)
			return baseList.find(ite => ite.profileId.toString() === id.toString())?.nftData?.name
		}
		return undefined
	}, [baseList, pathname])

	return (
		<Navbar height="3rem" isBordered>
			<NavbarContent
				justify="start"
				onClick={() => {
					if (typeof window !== undefined) {
						window.history.go(-1)
					} else {
						router.replace('/home')
					}
				}}
			>
				<i className="iconfont icon-arrow-left-bold cursor-pointer text-2xl"></i>
			</NavbarContent>
			<NavbarContent justify="center">
				{pathname === '/profile' && t('navbar.popp.title')}
				{pathname === '/planet' && t('navbar.planet.title')}
				{pathname === '/base' && t('navbar.base.select.title')}
				{(pathname.substring(0, 6) === '/base/' || pathname.substring(0, 6) === '/chat/') && loading ? (
					<Spinner color="default" size="sm" />
				) : (
					<>
						{pathname.substring(0, 6) === '/base/' && t('navbar.base.title1', { msg: planetName })}
						{pathname.substring(0, 6) === '/chat/' && t('navbar.base.title2', { msg: baseName })}
					</>
				)}
				{pathname === '/message' && t('navbar.message.title')}
				{pathname === '/capitalpool' && t('navbar.pool.title')}
			</NavbarContent>

			<NavbarContent justify="end">
				<Link href="/home" color="foreground">
					<i className="iconfont icon-home cursor-pointer text-2xl" title={t('navbar.home.tips')}></i>
				</Link>
			</NavbarContent>
		</Navbar>
	)
}

export default NavBarPage
