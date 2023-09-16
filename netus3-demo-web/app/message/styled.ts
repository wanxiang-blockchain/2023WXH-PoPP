import styled from 'styled-components'

export const IconDiv = styled.div<{ $isTrue: boolean }>`
	cursor: pointer;
	svg {
		fill: ${({ $isTrue }) => ($isTrue ? '#F6B03A' : '#999')};
	}
	&:hover {
		svg {
			fill: #f6b03a;
		}
	}
`
