import { DEFAULT_CHAINID } from '@/contracts/constant'
import { WalletConnectV2OpenWrapper, WalletConnectV2OpenBtn } from './styled'
import { walletConnectV2 } from './utils/walletInit'
import { useTranslation } from 'react-i18next'

/**
 * web端 - wallet connect v2 官方钱包启动器
 */
const WalletConnectV2OpenPage = ({ handleReturn }: { handleReturn: () => void }) => {
	const { t } = useTranslation()
	const handleOpenWalletConnectV2 = () => {
		walletConnectV2.activate(DEFAULT_CHAINID)
		handleReturn()
	}

	return (
		<WalletConnectV2OpenWrapper>
			<h5>{t('components.wallet.v2.tips')}</h5>
			<WalletConnectV2OpenBtn color="primary" fill="outline" onClick={handleOpenWalletConnectV2}>
				{t('components.wallet.v2.btn')}
			</WalletConnectV2OpenBtn>
		</WalletConnectV2OpenWrapper>
	)
}

export default WalletConnectV2OpenPage
