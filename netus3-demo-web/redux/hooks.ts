import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// useAppDispatch - redux 写入
export const useAppDispatch = () => useDispatch<AppDispatch>()
// useAppSelector - redux 读取
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
