import styled from 'styled-components'

export const Wrapper = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 999;
`

export const ModalMask = styled.div`
	position: fixed;
	top: 0;
	z-index: 98;
	left: 0;
	width: 100vw;
	height: 100%;
	background: rgba(0, 0, 0, 0.25);
	animation-duration: 0.2s;
`

export const ModalConetent = styled.div`
	border-radius: var(--border-radius-size);
	padding: 10px 10px;
	margin: 0 10px;
	width: calc(100% - 20px);
	max-width: 350px;
	min-height: 40vh;
	z-index: 100;
	animation-duration: 0.5s;
	background: ${({ theme }) => theme.white};
`

export const ModalCloes = styled.div`
	color: ${({ theme }) => theme.black};
	cursor: pointer;
`

export const ModalTitle = styled.h1`
	font-size: 20px;
	font-weight: bold;
`

export const ModalTop = styled.div`
	display: flex;
	align-items: center;
	flex-direction: row-reverse;
	justify-content: space-between;
`
