import { useState } from 'react'
import { SettingTopBar, SettingConetnt } from './styled'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/redux/hooks'
import moment from 'moment'
import { Modal, ModalContent, Button, useDisclosure, ModalHeader, ModalBody } from '@nextui-org/react'

type TopBarValueType = 'NFTs' | 'Activity'

const TopBarDefault: {
	lable: string
	value: TopBarValueType
}[] = [
	{ lable: 'NFTs', value: 'NFTs' },
	{ lable: 'Activity', value: 'Activity' },
]

// 用户设置按钮，主要查看 NFT 以及目前的交易活跃的信息
const Setting = () => {
	const { t } = useTranslation()

	// 用户交易活跃的数据列表
	const ActivityList = useAppSelector(state => state.seeionDataReducer.list)

	// Drawer topbar Active参数
	const [topBarActive, setTopBarActive] = useState<TopBarValueType>('NFTs')

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<Button variant="shadow" onPress={onOpen} className="ml-2 bg-white" isIconOnly>
				<i className="iconfont icon-setting"></i>
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={true} placement="bottom-center">
				<ModalContent className="h-2/4">
					{onClose => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<i className="iconfont icon-arrow-left-bold"></i>
							</ModalHeader>
							<ModalBody>
								<SettingTopBar>
									{TopBarDefault.map(item => (
										<span
											key={item.value}
											onClick={() => setTopBarActive(item.value)}
											className={topBarActive === item.value ? 'active' : ''}
										>
											{t(item.lable)}
										</span>
									))}
								</SettingTopBar>
								{topBarActive === 'Activity' && (
									<SettingConetnt>
										{ActivityList.map((item, key) => (
											<div className="activity-info" key={key}>
												<span>{item.name}</span>
												<p>{item.describe}</p>
												<p>{moment.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}</p>
											</div>
										))}
									</SettingConetnt>
								)}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}

export default Setting
