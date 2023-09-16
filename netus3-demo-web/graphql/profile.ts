import { getSubgraphsRequest } from '.'

/**
 * 获取所有的创建数据
 * isCurrentAccountFollow 在用户列表和星球列表判断当前用户是否关注或加入；基地列表判断是否有权限可进行聊天
 */
export type ProfileCreateListType = {
	creator: string
	followModule: string
	followModuleReturnData: string
	followNFTURI: string
	handle: string
	imageURI: string
	profileId: number | string
	timestamp: number
	to: string
	profileType: 0 | 1 | 2
	crateAt?: number
	isCurrentAccountFollow?: boolean
	planetId: number | string
	baseName: string
	nftData?: {
		image: string
		name: string
		describe: string
		account: string
		[env: string]: string
	}
}

type GraphQlProfileCreateDataType = {
	profileCreateInfos: ProfileCreateListType[]
}

export const axiosGraphQlProfileCreateData = async (): Promise<GraphQlProfileCreateDataType> => {
	try {
		let query = `
    query MyQuery {
      profileCreateInfos(orderBy: crateAt, orderDirection: desc) {
        to
        timestamp
        profileType
        profileId
        imageURI
        id
        handle
        followNFTURI
        followModuleReturnData
        followModule
        creator
        crateAt
				planetId
				baseName
      }
    }
    `
		const { data } = await getSubgraphsRequest(query)
		return await {
			profileCreateInfos: data.profileCreateInfos,
		}
	} catch (error) {
		return await {
			profileCreateInfos: [],
		}
	}
}

/** 加入星球、关注用户的数据 */
export type FollowInfosType = {
	timestamp: string
	profileId: string
	isProhibitionProfileId: boolean
	isProhibitionAddress: boolean
	isKickOut: boolean
	follower: string
	id: string
	followModuleData: string
	crateAt: string
}

type GraphQlFollowInfosDataType = {
	followInfos: FollowInfosType[]
}

export const axiosGraphQlFollowInfoData = async ({ account }: { account: string }): Promise<GraphQlFollowInfosDataType> => {
	try {
		let query = `
			query MyQuery {
				followInfos(
					orderBy: crateAt
					orderDirection: desc
					where: {follower: "${account.toLocaleLowerCase()}"}
				) {
					timestamp
					profileId
					isProhibitionProfileId
					isProhibitionAddress
					isKickOut
					follower
					id
					followModuleData
					crateAt
				}
			}
    `
		const { data } = await getSubgraphsRequest(query)
		return await {
			followInfos: data.followInfos,
		}
	} catch (error) {
		return await {
			followInfos: [],
		}
	}
}
