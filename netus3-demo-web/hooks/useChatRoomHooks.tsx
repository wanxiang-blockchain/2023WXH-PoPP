import { useSessionStorageState } from 'ahooks'
import { useEffect, useState } from 'react'
import Mock from 'mockjs'

export type ChatLisType = {
	id: number | undefined
	name: string
	profileId: number | undefined
	content: string
	baseId: string | undefined
}

const useChatRoomHooks = ({ baseId }: { baseId: string }) => {
	// 获取当前的聊天消息
	const [chatList, setChatList] = useSessionStorageState<ChatLisType[]>('chatList', {
		defaultValue: [],
	})

	useEffect(() => {
		if (baseId) handleChatList()
	}, [baseId])

	const handleChatList = () => {}

	// 发布消息设置
	const handleAddChat = (list: ChatLisType) =>
		setChatList((s: any) => {
			if (typeof s === 'undefined') return [list]
			let newList: any = [...s, ...[list]]
			newList.forEach((element: any, key: number) => {
				element.id = key
			})
			return newList
		})

	return { chatList, handleAddChat }
}

export default useChatRoomHooks
