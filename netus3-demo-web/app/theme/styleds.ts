'use client'
import { H5LayoutContent, WebLayoutContent } from '@/common/styled'
import styled from 'styled-components'

export const ThemeWrapperContent = styled.div`
	${({ theme }) => (theme.isMobile ? H5LayoutContent : WebLayoutContent)}
`
