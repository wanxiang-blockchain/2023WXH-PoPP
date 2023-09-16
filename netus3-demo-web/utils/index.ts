import { REACT_APP_ENV } from '@/contracts/chains'

export const formatStrAddress = (left: number, right: number, str: string) =>
	str.substring(0, left) + new Array(4).join('.') + str.substring(str.length - right, str.length)

export const baseURL = '/api'

export const graphURL = REACT_APP_ENV === 'prd' ? '' : 'https://api.thegraph.com/subgraphs/name/poppdev2/netus3-mainnet'

export const Adapth5 = 768

// 随机生成颜色
export const getRandomColor = () => {
	var letters = '0123456789ABCDEF'
	var color = '#'
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

// 没有图片创建一个新的图片
export const handleNftImage = (uri: any, text: any): string => {
	if (uri) return uri
	const canvas: any = document.createElement('canvas')
	canvas.width = 100
	canvas.height = 100
	const ctx = canvas.getContext('2d')
	const bgColor = getRandomColor()

	ctx.fillStyle = bgColor
	ctx.fillRect(0, 0, 100, 100)

	ctx.font = '110px Arial'
	ctx.fillStyle = 'white'
	ctx.textAlign = 'center'
	ctx.fillText(text, 50, 100)
	return canvas.toDataURL()
}
