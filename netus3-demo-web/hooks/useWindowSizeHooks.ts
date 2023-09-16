import { useEffect } from 'react'
import { useRafState } from 'ahooks'

/**
 * 页面窗口变化监听器
 */
export function useWindowSizeHooks() {
	const [state, setState] = useRafState({
		innerHeight: 0,
		innerWidth: 0,
	})

	useEffect(() => {
		const onResize = () => {
			// console.log('document.documentElement.clientWidth', document.documentElement.clientWidth)
			setState({
				innerWidth: document.documentElement.clientWidth,
				innerHeight: document.documentElement.clientHeight,
			})
		}
		onResize()

		window.addEventListener('resize', onResize)

		return () => {
			window.removeEventListener('resize', onResize)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { windowSize: state }
}
