import styled, { css, keyframes } from 'styled-components'

export const TextArea = styled.textarea`
	all: inherit;
	border-radius: var(--border-radius-size);
	line-height: 1.4;
	padding: 6px 10px;
	width: calc(100% - 20px);
	border: 1px solid ${({ theme }) => theme.line};
	&:focus {
		border-color: ${({ theme }) => theme.themeColor};
	}
`

export const Input = styled.input<{ $isRules?: boolean }>`
	all: inherit;
	border-radius: var(--border-radius-size);
	line-height: 1.4;
	padding: 6px 10px;
	width: calc(100% - 20px);
	border: 1px solid ${({ theme }) => theme.line};
	&:focus {
		border-color: ${({ theme }) => theme.themeColor};
	}

	${({ $isRules }) =>
		$isRules &&
		css`
			border-color: ${({ theme }) => theme.dengerColor};
			&:focus {
				border-color: ${({ theme }) => theme.dengerColor};
			}
		`}
`

export const FormItemRules = styled.div`
	padding: 6px 0;
	font-size: 14px;
	line-height: 1.4;
	font-weight: 600;
	color: ${({ theme }) => theme.dengerColor};
`

/**
 * styled适配 不同分辨率的配置文件
 */
const webLayoutAdaptationMax = css`
	max-width: min(75rem, 120rem - 45rem);
	margin: 0 auto;
	position: relative;
`

const webLayoutAdaptation = css`
	max-width: min(96.3%, 100% - 6.4%);
	margin: 0 auto;
	position: relative;
`

const h5LayoutAdaptation = css`
	max-width: min(96.3%, 100% - 6.4%);
	margin: 0 auto;
	position: relative;
`

export const WebLayoutContent = css`
	${h5LayoutAdaptation}
	${props =>
		props.theme.mediaWidth.md(
			() => css`
				${webLayoutAdaptation}
			`,
		)}
  ${props =>
		props.theme.mediaWidth.maxl(
			() => css`
				${webLayoutAdaptationMax}
			`,
		)}
`

export const H5LayoutContent = css`
	${h5LayoutAdaptation}/* ${({ theme }) =>
		theme.isMobile &&
		css`
			@media (min-width: 769px) {
				max-width: 450px;
				max-height: 95vh;
				margin: 0 auto !important;
				box-shadow: var(--shadow-down);
				top: 2.5vh;
				border-radius: var(--border-radius-size);
			}
		`} */
`

// 单行超出...
export const CssExceededSingle = css`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`

// 多行超出...
export const CssExceededMany = ({ number }: { number: number }) => css`
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: ${number};
	-webkit-box-orient: vertical;
`

// 旋转动效
export const loadingRotate = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`

export const identifier = keyframes`
to {
	transform: rotate(1turn);
}
`

export const LoadRotate = styled.i`
	animation: ${loadingRotate} 1.5s linear infinite;
`

export const ScrollbarDefault = css`
	&::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}

	&::-webkit-scrollbar-track {
		background-color: transparent;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 2px;
	}

	&::-webkit-scrollbar-button {
		background-color: #888;
		display: none;
	}
`
