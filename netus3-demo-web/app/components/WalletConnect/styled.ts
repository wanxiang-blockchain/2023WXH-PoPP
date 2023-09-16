import Image from 'next/image'
import styled from 'styled-components'
import Button from '@/app/components/Button'
import { CssExceededSingle, identifier } from '@/common/styled'

export const Wrapper = styled.div`
	position: absolute;
	top: 0;
	padding-top: 10px;
	right: 0;
	display: flex;
	justify-content: flex-end;
	width: 100%;
`

export const WalletModalContent = styled.div`
	padding: 10px;
	margin-top: 10px;
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	border-top: 1px solid ${({ theme }) => theme.line};
	position: relative;
`

export const WalletModalConentLoad = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
`

export const WalletModalSubTitle = styled.div`
	position: relative;
	${CssExceededSingle}
	h2 {
		font-size: 16px;
		font-weight: bold;
		line-height: 2;
		text-indent: 1rem;
		background-color: ${({ theme }) => theme.themeColor}32;
		text-align: start;
		position: relative;
		&::after {
			content: '';
			width: 4px;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			background-color: ${({ theme }) => theme.themeColor};
		}
	}
`

export const WalletConnectBtn = styled(Button)``

export const MobileDrawerLoadingDiv = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
`

export const WalletDrawerTopBar = styled.div`
	height: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10px;
`

export const WalletDrawerClose = styled.div`
	width: 28px;
	height: 28px;
	border-radius: 100%;
	background: ${({ theme }) => theme.white};
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	cursor: pointer;
	color: ${({ theme }) => theme.black};
`

export const WalletDrawerContent = styled.div`
	padding: 0 10px 20px;
	min-height: 40vh;
	border-top-left-radius: var(--border-radius-size-3);
	border-top-right-radius: var(--border-radius-size-3);
	background: ${({ theme }) => theme.white};
`

export const WalletQrCode = styled.div`
	cursor: pointer;
	position: absolute;
	right: 10px;
	top: 15px;
	color: ${({ theme }) => theme.themeColor};
`

export const WalletQrCodeClose = styled.div`
	cursor: pointer;
	position: absolute;
	left: 0;
	top: 15px;
	color: ${({ theme }) => theme.black};
`

export const WalletQrCodeCopy = styled.div`
	cursor: pointer;
	position: absolute;
	right: 0;
	top: 15px;
	color: ${({ theme }) => theme.themeColor};
`

export const WalletTitle = styled.div`
	text-align: center;
	font-size: 18px;
	font-weight: bold;
	padding: 20px;
	position: relative;
`

export const WalletQrCodeDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

export const WalletList = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 80px);
	justify-content: space-between;
	row-gap: 10px;
`

export const WalletListInfo = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
`

export const InfoTitle = styled.span`
	font-size: 12px;
	text-align: center;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-weight: 500;
`

export const InfoImage = styled(Image)`
	width: 60px;
	height: 60px;
	border-radius: var(--border-radius-size-2);
	margin-bottom: 15px;
	border: 1px solid rgba(0, 0, 0, 0.1);
`

export const WalletDrawerContentInfo = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.logo-img {
		margin: 40px 0 20px;
		position: relative;
		.rates {
			position: absolute;
			width: 110px;
			height: 110px;
			background: transparent;
			z-index: 1;
			top: -10px;
			left: -10px;
			border-radius: var(--border-radius-size-3);
			background: transparent;
			overflow: hidden;
			&::after {
				content: '';
				width: 100px;
				height: 100px;
				background: ${({ theme }) => theme.themeColor};
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: -2;
				transform-origin: 0 0;
				animation: ${identifier} 1.2s infinite linear;
			}
			&::before {
				content: '';
				width: calc(100% - 4px);
				height: calc(100% - 4px);
				position: absolute;
				top: 2px;
				left: 2px;
				background-color: ${({ theme }) => theme.white};
				border-radius: var(--border-radius-size-3);
			}
		}
	}
	img {
		position: relative;
		z-index: 2;
		width: 90px;
		height: 90px;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: var(--border-radius-size-3);
	}
	h5 {
		font-size: 16px;
		font-weight: bold;
		margin-bottom: 40px;
	}
`

export const WalletRetry = styled.div`
	padding: 10px 20px 20px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${({ theme }) => theme.line};
	button {
		all: unset;
		border-radius: var(--border-radius-size-2);
		padding: 6px 12px;
		background: ${({ theme }) => theme.themeColor};
		color: ${({ theme }) => theme.white};
		display: flex;
		align-items: center;
		i {
			margin-left: 6px;
			font-size: 16px;
		}
	}
`

export const WebWalletQrCodeClose = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	i {
		cursor: pointer;
		position: relative;
		z-index: 99;
		&:last-of-type {
			color: ${({ theme }) => theme.themeColor};
		}
	}
	span {
		position: absolute;
		width: 100%;
		z-index: 1;
		text-align: center;
		font-size: 16px;
		font-weight: bold;
		line-height: 2;
	}
`

export const QrCodeMoveDiv = styled.div`
	margin-top: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	.qrcode-loading {
		width: 200px;
		height: 200px;
		position: absolute;
		left: calc(50% - 100px);
		top: 20px;
	}
`

export const WalletConnectV2OpenWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20px 0;
	h5 {
		width: 60%;
		font-size: 12px;
		font-weight: bold;
		${CssExceededSingle}
	}
`

export const WalletConnectV2OpenBtn = styled(Button)`
	font-size: 12px;
	padding: 6px 10px;
`
