'use client'
import React, { useEffect } from 'react'
import { walletConnectV2 } from '@/connectors/walletConnectV2'
import { URI_AVAILABLE } from '@web3-react/walletconnect-v2'
import { saveQrCodeUri } from '@/redux/walletConnect'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useMount } from 'ahooks'
import { DEFAULT_CHAINID } from '@/contracts/constant'

/**
 * 二维码生成监听器，并且用户在进入页面时，生成第一次二维码
 */
const QrCodePage = ({ children }: { children: React.ReactNode }) => {
	const dispatch = useAppDispatch()
	const qrCodeUri = useAppSelector(state => state.walletConnectReducer.qrCodeUri)

	useMount(() => {
		if (!qrCodeUri) walletConnectV2.activate(DEFAULT_CHAINID)
	})

	// log URI when available
	useEffect(() => {
		walletConnectV2.events.on(URI_AVAILABLE, (uri: string) => {
			dispatch(saveQrCodeUri(uri))
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return children
}

export default QrCodePage
