import { useContext } from 'react'
import { Context } from '@/app/components/Provider'
import type { ConstantInitTypes } from '@/contracts/constant.init'
import { AwsStorageClientTypes } from '@/contracts/aws'
import { IpfsDataType } from '@/common/db'

export interface DataTypes {
	data: ConstantInitTypes
	blockNumber?: number
	balance?: number
	awsStore: AwsStorageClientTypes
	ipfsLists: IpfsDataType[]
}

// useContext的 value全局代码使用的方式
const useDataHooks = () => {
	const { data, blockNumber, balance, awsStore, ipfsLists }: DataTypes = useContext<any>(Context)
	return { data, blockNumber, balance, awsStore, ipfsLists }
}

export default useDataHooks
