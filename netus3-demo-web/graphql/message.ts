import { getSubgraphsRequest } from '.'

export type MessageInfoTypes = {
	timestamp: string
	referenceModuleReturnData: string
	referenceModule: string
	pubId: string
	profileId: string
	planetProfileId: string
	id: string
	crateAt: string
	contentURI: string
	collectModuleReturnData: string
	collectModule: string
	baseProfileId: string
	planetId?: string
	isLike: boolean
	isCollect: boolean
	profileIdPointed: string
	pubIdPointed: string
	type: 'post' | 'mirror'
	nftData?: {
		name: string
		describe: string
		account: string
		to: string
		imageURI: string
		handle: string
		baseId: string
		planetId: string
		baseName: string
		planetName: string
		[env: string]: string
	}
	collectModuleReturnDatas?: {
		amount: string
		currency: string
		referralFee: string
		followerOnly: boolean
	}
}

type GraphQlMessageInfoDataType = {
	contentInfos: MessageInfoTypes[]
}

export const axiosGraphQlMessageInfoData = async (): Promise<GraphQlMessageInfoDataType> => {
	try {
		let query = `
    query MyQuery {
      contentInfos(orderBy: crateAt, orderDirection: desc) {
        timestamp
        referenceModuleReturnData
        referenceModule
        pubId
        profileId
        planetProfileId
        id
        crateAt
        contentURI
        collectModuleReturnData
        collectModule
        baseProfileId
				profileIdPointed
				pubIdPointed
				type
      }
    }
    `
		const { data } = await getSubgraphsRequest(query)
		console.log('data', data)
		return await {
			contentInfos: data.contentInfos,
		}
	} catch (error) {
		return await {
			contentInfos: [],
		}
	}
}
