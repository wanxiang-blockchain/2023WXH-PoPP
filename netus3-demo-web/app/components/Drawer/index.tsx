import ReactDOM from 'react-dom'
import { DrawerWrapper, DrawerMask, DrawerConetent, DrawerCloes } from './styled'
import type { PlacementType } from '@/types'
/**
 * open - 是否显示
 * isClose - 是否显示关闭按钮
 * onClose - 关闭弹框 返回函数
 * placement - 弹起的方向 支持 PlacementType
 * contentStyle - content styles
 */
export type DrawerTypes = {
	open: boolean
	isClose?: boolean
	onClose: () => void
	placement?: PlacementType
} & {
	children?: React.ReactNode
	contentStyle?: React.CSSProperties
}

/**
 * 不同方向的动效
 */
const AnimateClass: { [str: string]: string } = {
	buttom: 'animate__fadeInUp',
	right: 'animate__fadeInRight',
	left: 'animate__fadeInLeft',
	top: 'animate__fadeInDown',
}

const DrawerPage = ({ open, children, onClose, isClose = true, contentStyle, placement = 'buttom' }: DrawerTypes) => (
	<DrawerWrapper>
		<DrawerMask onClick={onClose} className="animate__fadeIn" />
		<DrawerConetent className={AnimateClass[placement]} style={{ ...contentStyle }} placement={placement}>
			{isClose && <DrawerCloes className="iconfont icon-close-circle" onClick={onClose} />}
			{children}
		</DrawerConetent>
	</DrawerWrapper>
)

export default function Drawer(params: DrawerTypes) {
	if (!params.open) return <></>

	return ReactDOM.createPortal(<DrawerPage {...params} />, document.body)
}
