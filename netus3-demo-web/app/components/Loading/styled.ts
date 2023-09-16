import styled from 'styled-components'

export const Wrapper = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	z-index: 99;
	top: 0;
	justify-content: center;
	align-items: center;
	&::after {
		content: '';
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.05);
		position: absolute;
		top: 0;
		border-radius: var(--border-radius-size);
		z-index: 0;
		left: 0;
	}
`

export const Content = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;
	z-index: 2;
`

export const LoadnigTitle = styled.div`
	font-size: 14px;
	margin-top: 10px;
	color: ${({ theme }) => `${theme.themeColor}ed`};
`

export const LoadingContent = styled.div``
