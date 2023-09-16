'use client'
import React from 'react'
import { Modal, Button, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

type GlobalTipTypes = {
	isOpen: boolean
	onOpen: () => void
	onOpenChange: () => void
	onClose: () => void
	title?: string
	content: string
	handleSubmit: () => void
	isloading?: boolean
	submitTitle?: string
}
const GlobalTip = ({
	content,
	title,
	submitTitle,
	isOpen,
	onOpen,
	onClose,
	onOpenChange,
	handleSubmit,
	isloading = false,
}: GlobalTipTypes) => {
	const { t } = useTranslation()
	return (
		<Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						{title && <ModalHeader>{title}</ModalHeader>}
						<ModalBody>
							<p>{content}</p>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="light" onPress={onClose}>
								{t('list.global.close')}
							</Button>
							<Button color="primary" onClick={handleSubmit} isLoading={isloading}>
								{submitTitle ? submitTitle : t('list.global.submit')}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default GlobalTip
