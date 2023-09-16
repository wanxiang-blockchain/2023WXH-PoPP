import { createSlice } from '@reduxjs/toolkit'

export type ListType = {
	name: string
	hash: string
	describe: string
	timestamp: number
}
type SeeionDataType = {
	isPend: boolean
	list: ListType[]
}

const initialState = {
	isPend: false,
	list: [],
} as SeeionDataType

export const seeion = createSlice({
	name: 'seeionData',
	initialState,
	reducers: {
		saveIsPend: (state, action) => {
			state.isPend = action.payload
		},
		saveSeeionData: (state, action) => {
			state.list = action.payload
		},
	},
})

export const { saveIsPend, saveSeeionData } = seeion.actions

export default seeion.reducer
