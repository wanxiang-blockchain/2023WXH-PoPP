'use client'
import { createGlobalStyle, css } from 'styled-components'

/**
 * styled-components全局样式
 * prefers-color-scheme: dark 判断系统是否是暗黑模式
 */
const CssDefaultRemove = css`
	* {
		margin: 0;
		padding: 0;
	}

	li {
		list-style: none;
	}

	img {
		vertical-align: top;
		border: none;
	}
`

const GlobalStyle = createGlobalStyle`
  ${CssDefaultRemove}

  body {
    color: rgb(var(--foreground-rgb));
    background: rgb(var(--background-rgb));
  }

  input[type="submit"] {
		all: unset;
		padding: 6px 10px;
		min-width: 80px;
		text-align: center;
		border-radius: var(--border-radius-size);
		color: ${({ theme }) => theme.white};
		background: ${({ theme }) => theme.themeColor};
		margin-top: 10px;
		cursor: pointer;
		&::after,&:hover {
			box-shadow: var(--shadow-down);
		}
	}
  
`

export default GlobalStyle
