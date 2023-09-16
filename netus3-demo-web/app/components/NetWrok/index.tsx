import React, { useEffect, useMemo, useState } from 'react'
import { CHAINS } from '@/contracts/chains'
import { CHAINNETWORKINFO } from '@/contracts/networks'
import { useWeb3React } from '@web3-react/core'
import { useLocalStorageState } from 'ahooks'
import { useAppSelector } from '@/redux/hooks'
import { toast } from 'react-hot-toast'
import { metaMask } from '@/connectors/metaMask'
import { getAddChainParameters } from '@/contracts/chains'

import Image from 'next/image'
import { Popover, PopoverTrigger, PopoverContent, Button, useDisclosure, Spinner } from '@nextui-org/react'

const Chains = Object.keys(CHAINS).map(Number)

const NetWork = () => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
	const { isActive, chainId, connector } = useWeb3React()
	const walletType = useAppSelector(state => state.walletConnectReducer.walletType)
	// 切换网络的loading
	const [switchLoading, setSwitchLoading] = useState<boolean>(false)

	// 更具不同环境下配置的支持的链接信息。 value 、 label表示主要写入Select组件
	const list = useMemo(() => {
		return CHAINNETWORKINFO.filter(item => Chains.some(ite => ite === item.chainId)).map(item => {
			return {
				...item,
				value: item.chainId,
				label: item.name,
			}
		})
	}, [])

	// 当前链的信息
	const currentChainInfo = useMemo(() => {
		if (!isActive) return undefined
		return list.find(item => item.chainId === chainId)
	}, [chainId, isActive, list])

	// select 选择的参数。默认选择第一个chainId
	const [selectActive, setSelectActive] = useLocalStorageState<any>('selectChainId', {
		defaultValue: list[0].chainId,
	})

	// 链接成功后，当前chainId写入select中
	useEffect(() => {
		if (isActive) {
			setSelectActive(chainId)
			setSwitchLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive, chainId])

	/**
	 * 用户链接后，手动切换网络问题
	 * WalletConnectV2 - 支持钱包一次性链接的多链切换（V2协议）、(v1协议)单独链接
	 * ethereum - 即区块浏览器支持的参数，简单解释即支持metamask插件链接
	 * ethereum.isMetaMask - 是否支持metamask
	 * @param objChainId  当前选择的chainId
	 */
	const handleSwitchNetWorksChange = (objChainId: number) => {
		setSwitchLoading(true)
		onClose()
		if (walletType === 'WalletConnectV2') handleSwitchTypeWalletConnect(objChainId)
		else {
			if (typeof window === 'undefined') {
				setSelectActive(objChainId)
				setSwitchLoading(false)
				return
			}
			const { ethereum } = window
			if (!ethereum) {
				setSelectActive(objChainId)
				setSwitchLoading(false)
				return
			}
			handleSwitchTypeisMetaMask(objChainId)
		}
	}

	/**
	 * 用户如果多链链接v2协议，直接使用connector.activate切换网络
	 * 若用户支持单独链接链接，则使用wallet_addEthereumChain方法添加网络并切换网络
	 * wallet_addEthereumChain 参考：https://docs.metamask.io/wallet/reference/rpc-api/#wallet_addethereumchain
	 * @param objChainId 当前选择的chainId
	 */
	const handleSwitchTypeWalletConnect = async (objChainId: number) => {
		try {
			await connector.activate(objChainId)
		} catch (error) {
			try {
				let obj = CHAINS[objChainId]
				await connector.provider?.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: `0x${objChainId.toString(16)}`,
							chainName: obj.name,
							rpcUrls: obj.urls,
						},
					],
				})
			} catch (error: any) {
				toast.error(error.message)
				setSwitchLoading(false)
			}
		}
	}

	/**
	 * ethereum.isMetaMask 验证是否上metamask
	 * @param objChainId 当前选择的chainId
	 */
	const handleSwitchTypeisMetaMask = async (objChainId: number) => {
		try {
			const { ethereum } = window
			ethereum &&
				ethereum.isMetaMask &&
				(await new Promise(async (resolve: any, reject) => {
					let obj = list.find(item => item.chainId === Number(objChainId))
					if (typeof window === undefined) {
						let currentChainIds = list.find(item => item.chainId === Number(objChainId))?.chainId
						setSelectActive(currentChainIds || list[0].chainId)
						setSwitchLoading(false)
						reject()
					}
					const { ethereum } = window
					if (ethereum && ethereum.isMetaMask && obj) {
						void metaMask
							.activate(getAddChainParameters(obj.chainId))
							.then(() => {
								setTimeout(resolve, 500)
								setSwitchLoading(false)
							})
							.catch(error => {
								reject(error)
								setSwitchLoading(false)
							})
					} else {
						let currentChainIds = list.find(item => item.chainId === Number(objChainId))?.chainId
						setSelectActive(currentChainIds || list[0].chainId)
						setSwitchLoading(false)
						reject()
					}
				}))
		} catch (error: any) {
			setSwitchLoading(false)
			toast.error(error.message)
		}
	}

	return (
		<Popover placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger>
				{!switchLoading ? (
					<Button onPress={onOpen} variant="shadow" className="mr-2" color="primary" isIconOnly>
						{currentChainInfo && (
							<Image width={24} height={24} alt={currentChainInfo?.name || ''} src={currentChainInfo?.image} />
						)}
					</Button>
				) : (
					<Button variant="shadow" className="mr-2" color="primary" isIconOnly isLoading></Button>
				)}
			</PopoverTrigger>
			<PopoverContent className="rounded">
				{list.map((item, key) => (
					<div className="cursor-pointer  py-1" key={key} onClick={() => handleSwitchNetWorksChange(item.chainId)}>
						<Image width={24} height={24} alt={item.name || ''} src={item.image} />
					</div>
				))}
			</PopoverContent>
		</Popover>
	)
}

export default NetWork
