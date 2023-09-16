import wallet from './zh-tw/wallet'
import components from './zh-tw/components'
import test from './zh-tw/test'
import home from './zh-tw/home'
import navbar from './zh-tw/navbar'
import list from './zh-tw/list'
import message from './zh-tw/message'
import capitalpool from './zh-tw/capitalpool'

const zh = {
	'app.loading': '加载中...',
	'app.switch.language.tips': '切换{{msg}}成功',
	'app.no.isActive.tips': '请先链接钱包',
	'app.test.amount.tips': '只能是0-100整数',
	NFTs: 'NFTs',
	Activity: '活动',
	...wallet,
	...components,
	...test,
	...home,
	...navbar,
	...list,
	...message,
	...capitalpool,
}

export default zh
