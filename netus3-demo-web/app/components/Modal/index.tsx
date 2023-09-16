import ReactDOM from 'react-dom'
import { Wrapper, ModalMask, ModalConetent, ModalCloes, ModalTitle, ModalTop } from './styled'

/**
 * open - 是否显示
 * isClose - 是否显示关闭按钮
 * onClose - 关闭弹框 返回函数
 * contentStyle - content styles
 */
export type ModalTypes = {
	open: boolean
	isClose?: boolean
	title?: string
	onClose: () => void
} & {
	children?: React.ReactNode
	contentStyle?: React.CSSProperties
}

const ModalPage = ({ open, children, onClose, isClose = true, contentStyle, title }: ModalTypes) => (
	<Wrapper>
		<ModalMask onClick={onClose} className="animate__fadeIn" />
		<ModalConetent className="animate__fadeIn" style={{ ...contentStyle }}>
			{(title || isClose) && (
				<ModalTop>
					{isClose && <ModalCloes className="iconfont icon-close-circle" onClick={onClose} />}
					{title && <ModalTitle>{title}</ModalTitle>}
				</ModalTop>
			)}
			{children}
		</ModalConetent>
	</Wrapper>
)

export default function Modal(params: ModalTypes) {
	if (!params.open) return <></>

	return ReactDOM.createPortal(<ModalPage {...params} />, document.body)
}
