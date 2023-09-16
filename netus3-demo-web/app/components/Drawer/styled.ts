import styled, { css } from 'styled-components'
import type { PlacementType } from '@/types'

export const DrawerWrapper = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 100vw;
	height: 100vh;
	z-index: 999;
`

export const DrawerMask = styled.div`
	position: fixed;
	top: 0;
	z-index: 98;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.25);
	animation-duration: 0.2s;
`

export const DrawerConetent = styled.div<{ placement: PlacementType }>`
	padding: 20px 10px;
	z-index: 100;
	position: absolute;
	animation-duration: 0.4s;
	background: ${({ theme }) => theme.white};
	${({ placement }) =>
		placement === 'buttom' &&
		css`
			width: calc(100% - 20px);
			min-height: 20vh;
			bottom: 0;
			left: 0;
			border-top-left-radius: var(--border-radius-size);
			border-top-right-radius: var(--border-radius-size);
		`}
	${({ placement }) =>
		placement === 'right' &&
		css`
			right: 0;
			min-height: calc(100vh - 40px);
			min-width: 350px;
			max-width: 70%;
			border-bottom-left-radius: var(--border-radius-size);
			border-top-left-radius: var(--border-radius-size);
		`}

  ${({ placement }) =>
		placement === 'top' &&
		css`
			top: 0;
			min-height: 20vh;
			width: calc(100% - 20px);
			border-bottom-left-radius: var(--border-radius-size);
			border-bottom-right-radius: var(--border-radius-size);
		`}
  ${({ placement }) =>
		placement === 'left' &&
		css`
			left: 0;
			min-height: calc(100vh - 40px);
			min-width: 350px;
			max-width: 70%;
			border-bottom-right-radius: var(--border-radius-size);
			border-top-right-radius: var(--border-radius-size);
		`}
`

export const DrawerCloes = styled.div`
	text-align: right;
	cursor: pointer;
	color: ${({ theme }) => theme.black};
`
