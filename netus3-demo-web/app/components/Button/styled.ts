import styled, { css } from 'styled-components'

const ButtonPrimaryCss = css`
	background-color: ${({ theme }) => theme.themeColor};
	color: ${({ theme }) => theme.white};
	border: 1px solid ${({ theme }) => theme.themeColor};
	&:focus,
	&:hover,
	&:active {
		background-color: ${({ theme }) => theme.themeColor};
		color: ${({ theme }) => theme.white};
		border: 1px solid ${({ theme }) => theme.themeColor};
	}
`

const ButtonSuccessCss = css`
	background-color: ${({ theme }) => theme.successColor};
	color: ${({ theme }) => theme.white};
	border: 1px solid ${({ theme }) => theme.successColor};
	&:focus,
	&:hover,
	&:active {
		background-color: ${({ theme }) => theme.successColor};
		color: ${({ theme }) => theme.white};
		border: 1px solid ${({ theme }) => theme.successColor};
	}
`

const ButtonWarningCss = css`
	background-color: ${({ theme }) => theme.wariningColor};
	color: ${({ theme }) => theme.white};
	border: 1px solid ${({ theme }) => theme.wariningColor};
	&:focus,
	&:active {
		background-color: ${({ theme }) => theme.wariningColor};
		color: ${({ theme }) => theme.white};
		border: 1px solid ${({ theme }) => theme.wariningColor};
	}
`

const ButtonDangerCss = css`
	background-color: ${({ theme }) => theme.dengerColor};
	color: ${({ theme }) => theme.white};
	border: 1px solid ${({ theme }) => theme.dengerColor};
	&:focus,
	&:hover,
	&:active {
		background-color: ${({ theme }) => theme.dengerColor};
		color: ${({ theme }) => theme.white};
		border: 1px solid ${({ theme }) => theme.dengerColor};
	}
`

export const ButtonWrapper = styled.button<{
	color: 'default' | 'primary' | 'success' | 'warning' | 'danger'
	fill: 'solid' | 'outline' | 'none'
}>`
	all: unset;
	padding: 7px 12px;
	border-radius: var(--border-radius-size);
	line-height: 1.4;
	font-size: 16px;
	min-width: 60px;
	text-align: center;
	background-color: ${({ theme }) => theme.white};
	color: ${({ theme }) => theme.black};
	border: 1px solid ${({ theme }) => theme.gary};
	cursor: pointer;
	transition: opacity 0.15s ease;
	${({ color }) => color === 'primary' && ButtonPrimaryCss}
	${({ color }) => color === 'success' && ButtonSuccessCss}
  ${({ color }) => color === 'warning' && ButtonWarningCss}
  ${({ color }) => color === 'danger' && ButtonDangerCss}

  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'default' &&
		css`
			background-color: transparent;
		`}
  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'primary' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.themeColor};
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.themeColor};
			}
		`}
  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'success' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.successColor};
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.successColor};
			}
		`}
  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'warning' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.wariningColor};
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.wariningColor};
			}
		`}
  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'danger' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.dengerColor};
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.dengerColor};
			}
		`}


  ${({ fill, color }) =>
		fill === 'none' &&
		color === 'default' &&
		css`
			background-color: transparent;
			border: 1px solid transparent;
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
			}
		`}
  ${({ fill, color }) =>
		fill === 'none' &&
		color === 'primary' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.themeColor};
			border: 1px solid transparent;
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.themeColor};
				border: 1px solid transparent;
			}
		`}
  ${({ fill, color }) =>
		fill === 'none' &&
		color === 'success' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.successColor};
			border: 1px solid transparent;
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.successColor};
				border: 1px solid transparent;
			}
		`}
  ${({ fill, color }) =>
		fill === 'none' &&
		color === 'warning' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.wariningColor};
			border: 1px solid transparent;
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.wariningColor};
				border: 1px solid transparent;
			}
		`}
  ${({ fill, color }) =>
		fill === 'outline' &&
		color === 'danger' &&
		css`
			background-color: transparent;
			color: ${({ theme }) => theme.dengerColor};
			border: 1px solid transparent;
			&:focus,
			&:hover,
			&:active {
				background-color: transparent;
				color: ${({ theme }) => theme.dengerColor};
				border: 1px solid transparent;
			}
		`}
`
