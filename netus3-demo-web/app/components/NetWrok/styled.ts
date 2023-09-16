import styled, { css } from 'styled-components'
import { CssExceededSingle } from '@/common/styled'

export const Wrapper = styled.div`
	min-height: 40px;
	padding: 6px 10px;
	min-width: 40px;
	display: flex;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	border-radius: var(--border-radius-size-2);
	box-shadow: var(--shadow-down);
	background: ${({ theme }) => theme.white};
	margin-right: 10px;
	.css-1u9des2-indicatorSeparator {
		display: none;
	}
	.css-1fdsijx-ValueContainer {
		display: none;
	}
	${({ theme }) =>
		theme.mediaWidth.md(
			() => css`
				.css-1fdsijx-ValueContainer {
					display: flex;
				}
			`,
		)}
`

export const NetWrokWrapper = styled.div``

export const NetWrokInfo = styled.div<{ active: boolean }>`
	padding: 6px 10px;
	min-height: 30px;
	margin-top: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	border-radius: var(--border-radius-size);
	&:hover {
		color: ${({ theme }) => theme.white};
		background: ${({ theme }) => theme.gary};
	}
	${({ active }) =>
		active &&
		css`
			boxshadow: var(--shadow-down);
			color: ${({ theme }) => theme.white};
			background: ${({ theme }) => theme.themeColor};
			&:hover {
				background: ${({ theme }) => theme.themeColor};
			}
		`}
	span {
		font-size: 16px;
		font-weight: bold;
		margin-left: 6px;
		text-align: start;
		text-indent: 0;
	}
	.nextwork-right {
		display: flex;
		align-items: center;
	}
	.netwrok-drop {
		width: 8px;
		height: 8px;
		margin-left: 6px;
		background: ${({ theme }) => theme.successColor};
		border-radius: 100%;
	}
	h5 {
		font-size: 14px;
		font-weight: 400;
	}
	.wallet-select-info {
		display: flex;
		align-items: center;
		h4 {
			margin-left: 10px;
			font-weight: bold;
		}
	}
`

export const SelectInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 6px 10px;
	width: calc(100% - 20px);
	border-top: 1px solid ${({ theme }) => theme.line};
	&:first-of-type {
		border-top: none;
	}
	img {
		width: 24px;
		height: 24px;
	}
	.network-content {
		display: none;
		width: calc(100% - 24px - 6px);
		h3,
		.span {
			max-width: 95%;
			${CssExceededSingle}
		}
		h3 {
			font-size: 14px;
			margin-bottom: 4px;
			font-weight: bold;
		}
		.span {
			font-size: 12px;
			font-weight: 400;
		}
	}
	${({ theme }) =>
		theme.mediaWidth.md(
			() => css`
				.network-content {
					display: block;
				}
				justify-content: flex-start;
				img {
					margin-right: 6px;
				}
			`,
		)}
`

export const customStyles = {
	placeholder: (provided: any) => ({
		...provided,
		color: '#fff',
		fontWeight: 400,
		fontSize: '0.88rem',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	}),
	control: (provided: any, state: any) => ({
		...provided,
		minWidth: '10.88rem',
		minHeight: 'auto',
		color: '#293543',
		// textIndent: '2em',
		textAlign: 'center',
		border: '0.9px solid transparent',
		borderRadius: '0.31rem',
		display: 'flex',
		background: 'transparent',
		borderColor: 'transparent',
		boxShadow: '1px solid transparent',
		'&:hover': {
			borderColor: 'transparent',
		},
		'@media screen and (max-width: 768px)': {
			minWidth: '3.38rem',
		},
	}),
	option: (provided: any, state: any) => ({
		...provided,
		borderBottom: 'none',
		color: state.isSelected ? '#33CCAE' : '#293543',
		background: '#ffffff',
		textAlign: 'center',
		fontSize: '14px',
		margin: 0,
		':active': {
			backgroundColor: '#EFEEFD',
		},
		':hover': {
			color: '#33CCAE',
			backgroundColor: '#EFEEFD',
		},
	}),
	menu: (provided: any) => ({
		...provided,
		boxShadow: 'none',
		borderRadius: '0.31rem',
		// marginTop: '1.5rem',
		backgroundColor: '#ffffff',
	}),
	menuList: (provided: any) => ({
		...provided,
		borderRadius: '0.31rem',
		padding: '0.5rem 0',
		boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
	}),
	singleValue: (provided: any, state: any) => {
		const transition = 'opacity 300ms'
		return {
			...provided,
			transition,
			color: 'block',
			fontSize: '0.88rem',
			'@media screen and (max-width: 768px)': {
				display: 'none',
			},
		}
	},
}
