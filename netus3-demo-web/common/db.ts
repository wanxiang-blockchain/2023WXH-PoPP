import Dexie, { Table } from 'dexie'

export type IpfsDataType = {
	name: string
	describe: string
	account: string
	to: string
	imageURI: string
	handle: string
	times: number
	followNFTURI: string
}

export type ChatLisType = {
	name: string
	profileId: number | undefined
	content: string
	baseId: string | undefined
	account: string
	times: number
}

export class Netus3IPFS extends Dexie {
	ipfsLists!: Table<IpfsDataType, number>
	chatLists!: Table<ChatLisType, number>
	constructor() {
		super('Netus3IPFS')
		this.version(1).stores({
			ipfsLists: '++id,name,describe,account,to,imageURI,handle,times,followNFTURI',
			chatLists: '++id,name,profileId,content,baseId,account,times',
		})
	}
}

export const db = new Netus3IPFS()

// 添加ipfs缓存
export const handleIpfsHistory = async (params: IpfsDataType) => {
	const oldArr = await db.ipfsLists.filter(friend => friend.followNFTURI === params.followNFTURI).toArray()
	if (oldArr.length === 0)
		await db.ipfsLists.add({
			...params,
			times: new Date().getTime(),
		})
}

// 移除某个ipfs记录
export const handleIpfsRemoveId = async (id: number) => db.ipfsLists.delete(id)

// 添加聊天缓存
export const handleChatRoomHistory = async (params: ChatLisType) => {
	await db.chatLists.add({
		...params,
		times: new Date().getTime(),
	})
}
