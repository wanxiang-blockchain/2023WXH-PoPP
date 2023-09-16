import styled, { css } from 'styled-components'
import { CssExceededSingle } from '@/common/styled'

export const LanguageWrapper = styled.div`
	margin-right: 10px;
	min-height: 40px;
	min-width: 40px;
	padding: 6px 10px;
	display: flex;
	justify-content: center;
	cursor: pointer;
	align-items: center;
	border-radius: var(--border-radius-size-2);
	box-shadow: var(--shadow-down);
	background: ${({ theme }) => theme.white};
	position: relative;
	.moves {
		position: absolute;
		top: 40px;
		width: calc(100% + 20px);
		height: 100px;
		z-index: 0;
		background-color: transparent;
	}
	span {
		margin-left: 6px;
		display: none;
	}
	${({ theme }) =>
		theme.mediaWidth.md(
			() => css`
				span {
					display: block;
				}
			`,
		)}
`

export const SwitchPopoverDiv = styled.div`
	position: absolute;
	z-index: 2;
	top: 40px;
	width: 100%;
	background: ${({ theme }) => theme.white};
	margin-top: 1.56rem;
	box-shadow: var(--shadow-down);
	border-radius: var(--border-radius-size);
	h5 {
		font-family: 'NotoSansHans-Regular';
		font-weight: 400;
		font-size: 0.88rem;
		line-height: 1.31rem;
		padding: 6px 10px;
		line-height: 3;
		text-align: center;
		${CssExceededSingle}
		max-width: 95%;
		text-align: center;
		cursor: pointer;
		border-bottom: 1px solid ${({ theme }) => theme.line};
		&:hover {
			color: ${p => p.theme.themeColor};
			font-weight: 700;
		}
	}
	h5.active {
		color: ${p => p.theme.themeColor};
		font-weight: 700;
	}
`
