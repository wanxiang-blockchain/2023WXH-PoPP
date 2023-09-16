import styled, { css } from 'styled-components'
import { CssExceededSingle, loadingRotate } from '@/common/styled'

export const Wrapper = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row;
`

export const AmountUnitWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-right: 6px;
	display: none;
	${({ theme }) =>
		theme.mediaWidth.md(
			() => css`
				display: block;
			`,
		)}
`

export const InfoModalTitle = styled.h1`
	all: unset;
	font-size: 20px;
	font-weight: bold;
	margin: 20px 0 10px 0;
`

export const InfoModalUnit = styled.span`
	font-size: 16px;
	color: rgba(60, 66, 66, 0.6);
`

export const InfoList = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	margin-top: 20px;
`

export const InfoBtn = styled.div`
	width: calc(50% - 20px);
	min-height: 50px;
	padding: 10px 6px;
	border-radius: var(--border-radius-size-2);
	background: ${({ theme }) => theme.white};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	flex-direction: column;
	box-shadow: var(--shadow-down);
	font-size: 12px;
	font-weight: bold;
	&:first-child {
		margin-right: 20px;
	}
	i {
		color: ${({ theme }) => theme.black};
		font-size: 18px;
	}
	span {
		margin-top: 6px;
	}
`

export const SettingTopBar = styled.div`
	display: flex;
	padding: 10px;
	span {
		color: ${({ theme }) => theme.gary};
		margin-right: 10px;
		cursor: pointer;
		&:last-of-type {
			margin-right: 0;
		}
	}
	span.active {
		color: ${({ theme }) => theme.black};
	}
`

export const SettingConetnt = styled.div`
	padding: 20px 10px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	overflow-y: scroll;
	height: 50%;
	.activity-info {
		display: flex;
		flex-direction: column;
		padding-bottom: 10px;
		text-indent: 1em;
		&:first-of-type {
			padding-top: 10px;
			border-top: 1px solid ${({ theme }) => theme.line};
		}
		border-bottom: 1px solid ${({ theme }) => theme.line};
		span {
			font-size: 16px;
			font-weight: bold;
			margin-top: 6px;
			line-height: 1.4;
			${CssExceededSingle}
		}
		p {
			font-size: 12px;
			line-height: 1.4;
			margin-top: 6px;
			color: ${({ theme }) => theme.gary};
			${CssExceededSingle}
		}
	}
`
