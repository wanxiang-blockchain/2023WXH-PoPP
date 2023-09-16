import styled from 'styled-components'
import { identifier } from '@/common/styled'

export const BlobkNumberContent = styled.div<{ $coloropacity: boolean }>`
	position: fixed;
	bottom: 20px;
	right: 20px;
	color: ${({ theme, $coloropacity }) => (!$coloropacity ? `${theme.successColor}80` : theme.successColor)};
	&::after {
		content: '';
		position: absolute;
		width: 8px;
		z-index: 99;
		height: 8px;
		border-radius: 100%;
		left: -14px;
		top: calc(50% - 4px);
		background-color: ${({ theme }) => theme.successColor};
	}
`

export const BlobkNumberWrapper = styled.div`
	.block-rates {
		width: 16px;
		height: 16px;
		border-radius: 100%;
		position: absolute;
		left: -18px;
		top: calc(50% - 8px);
		background-color: transparent;
		z-index: 10;
		overflow: hidden;
		&::after {
			content: '';
			width: 40px;
			height: 40px;
			background: ${({ theme }) => theme.successColor};
			position: absolute;
			z-index: -2;
			left: 50%;
			top: 50%;
			transform-origin: 0 0;
			animation: ${identifier} 1s infinite linear;
		}
	}
	.block-rates-modal {
		width: 12px;
		height: 12px;
		border-radius: 100%;
		background-color: ${({ theme }) => theme.white};
		position: absolute;
		left: -16px;
		z-index: 11;
		top: calc(50% - 6px);
	}
`
