import { HtmlHTMLAttributes } from 'react'
import { ButtonWrapper } from './styled'

/**
 * Button
 * title - 标题
 * color - 颜色选择
 * fill - solid: 实心 outline:空心 none:无
 * buttonStyle - button styles
 */
export type ButtonProps = {
	title?: string
	color?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
	fill?: 'solid' | 'outline' | 'none'
} & {
	buttonStyle?: React.CSSProperties
	children?: React.ReactNode
} & HtmlHTMLAttributes<HTMLButtonElement>

const ButtonPage = ({ title, buttonStyle, children, color = 'default', fill = 'solid', ...ButtonPages }: ButtonProps) => {
	return (
		<ButtonWrapper color={color} fill={fill} style={buttonStyle} {...ButtonPages}>
			{children ? children : title}
		</ButtonWrapper>
	)
}

export default ButtonPage
