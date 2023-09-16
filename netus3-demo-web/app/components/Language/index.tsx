import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageWrapper, SwitchPopoverDiv } from './styled'
import { languageList } from '@/i18n'
import { toast } from 'react-hot-toast'
import { setLocaleOnClient } from '@/i18n/client'
import { Locale } from '@/i18n/type'

/**
 * 选择语言的下拉弹框的配置
 */
const LanguagePage = () => {
	const { i18n, t } = useTranslation()
	const [move, setMoveSwitch] = useState(false)

	// 切换选择的语言
	const languageChange = (str: Locale) => i18n.changeLanguage(str)

	const languageChangeSwitch = (str: Locale) => {
		languageChange(str)
		setLocaleOnClient(str)
		toast.success(t('app.switch.language.tips', { msg: languageList.find(l => l.locale === str)?.value }))
		setMoveSwitch(false)
	}

	const SwitchPopover = () => (
		<SwitchPopoverDiv>
			{languageList.map((l, i) => (
				<h5 onClick={() => languageChangeSwitch(l.locale)} key={i} className={l.locale === i18n.language ? 'active' : ''}>
					{l.value}
				</h5>
			))}
		</SwitchPopoverDiv>
	)

	return (
		<LanguageWrapper onMouseOver={() => setMoveSwitch(true)} onMouseOut={() => setMoveSwitch(false)}>
			<i className="iconfont icon-language2"></i>
			<span>{languageList.find(item => item.locale === i18n.language)?.value}</span>
			<div className="moves" style={{ display: move ? 'block' : 'none' }}></div>
			{move && <SwitchPopover />}
		</LanguageWrapper>
	)
}
export default LanguagePage
