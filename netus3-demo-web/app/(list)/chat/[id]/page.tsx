'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollShadow, Input, Button, Spinner } from '@nextui-org/react'
import useChatRoomHooks, { ChatLisType } from '@/hooks/useChatRoomHooks'
import toast from 'react-hot-toast'
import Image from 'next/image'
import ICONDEFAULT from '@/assets/icon-default.svg'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, handleChatRoomHistory } from '@/common/db'
import { useWeb3React } from '@web3-react/core'
import useProfileCreatedHooks from '@/hooks/useProfileCreatedHooks'
import { ForwardSvg } from '@/common/icon'
import { IconDiv } from './styled'
import { useTranslation } from 'react-i18next'

const StateInit: ChatLisType = {
	id: undefined,
	profileId: undefined,
	name: '',
	content: '',
	baseId: undefined,
}

const ChatRoomPage = ({ params }: { params: { id: string } }) => {
	const { t } = useTranslation()
	const { account } = useWeb3React()
	// 当前聊天框的信息的Ref
	const ChatRef = useRef<any>(null)
	// 发布的消息内容
	const [state, setState] = useState<ChatLisType>(StateInit)

	const chatList = useLiveQuery(() => db.chatLists.toArray())

	// 用户列表
	const { poppList, loading: poppLoading } = useProfileCreatedHooks({ isRedux: false })

	// 当前可以发布消息、转发消息的用户信息
	const poppListCurrents = useMemo(() => {
		if (poppList.length === 0 || !account) return undefined
		return poppList.find(item => item.to.toLocaleLowerCase() === account.toLocaleLowerCase())
	}, [poppList, account])

	// 消息列表
	const chatLists = useMemo(() => {
		if (typeof chatList === 'undefined' || chatList.length === 0) return []
		return chatList.filter(item => item.baseId?.toString() === params.id.toString())
	}, [chatList, params.id])

	// 监听消息内容，设置滚动高度
	useMemo(() => {
		if (typeof chatList === 'undefined' || chatList.length === 0) return
		setTimeout(() => {
			if (ChatRef?.current) ChatRef.current.scrollTop = ChatRef.current.scrollHeight + 100
		}, 100)
	}, [chatList])

	//发送消息点击
	const handleClick = async () => {
		if (state.content === '') {
			toast.error(t('list.chat.message.no.data'))
			return
		}
		if (!poppListCurrents) {
			toast.error(t('list.tips.no.popp.error'))
			return
		}
		handleChatRoomHistory({
			...state,
			name: poppListCurrents.nftData?.name || `# ${poppListCurrents.profileId}`,
			profileId: Number(poppListCurrents.profileId),
			baseId: params.id,
			account: account as any,
			times: 0,
		})
		setTimeout(() => {
			setState(StateInit)
		}, 200)
	}

	if (poppLoading)
		return (
			<div className="flex h-[var(--page-height-h5)] w-full items-center justify-center	md:h-[var(--page-height)]">
				<Spinner color="default" />
			</div>
		)

	return (
		<>
			<ScrollShadow ref={ChatRef} size={100} className="h-[var(--page-height-h5)] w-full  md:h-[var(--page-height)]">
				<div className="px-5">
					{chatLists.map((cls, key) => (
						<div key={key} className="flex items-start py-3">
							<Image className="mr-2 rounded-[100%]" src={ICONDEFAULT} alt="default" width={32} height={32} />
							<div className="relative flex flex-col">
								<span className="mb-2 text-xs  text-slate-900">{cls.name}</span>
								<div className="rounded-md bg-slate-200 px-3 py-2 text-sm">
									<span>{cls.content}</span>
								</div>
								{/* {account?.toLocaleLowerCase() === cls.account.toLocaleLowerCase() && <IconDiv>
									<ForwardSvg />
								</IconDiv>} */}
							</div>
						</div>
					))}
					<div className="h-16"></div>
				</div>
			</ScrollShadow>
			<div
				className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-white px-5"
				style={{ boxShadow: '0px -5px 5px rgba(153, 153, 153, 0.1)' }}
			>
				<Input
					placeholder={t('list.chat.message.submit')}
					value={state.content}
					onValueChange={values =>
						setState(s => {
							return {
								...s,
								content: values,
							}
						})
					}
					onKeyDown={event => {
						if (event.key === 'Enter') handleClick()
					}}
					endContent={
						<Button size="sm" color="primary" variant="light" onClick={handleClick}>
							{t('list.chat.message.submit.btn')}
						</Button>
					}
				/>
			</div>
		</>
	)
}

export default ChatRoomPage
