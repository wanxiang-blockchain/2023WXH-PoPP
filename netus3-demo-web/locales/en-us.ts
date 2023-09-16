import wallet from './en-us/wallet'
import components from './en-us/components'
import test from './en-us/test'
import home from './en-us/home'
import navbar from './en-us/navbar'
import list from './en-us/list'
import message from './en-us/message'
import capitalpool from './en-us/capitalpool'

const en = {
	'app.loading': 'loading...',
	'app.switch.language.tips': 'Switch {{msg}} Success',
	'app.no.isActive.tips': 'PoPP Netus3 Protocol Demo',
	'app.test.amount.tips': 'Only integers from 0 to 100',
	NFTs: 'NFTs',
	Activity: 'Activity',
	...wallet,
	...components,
	...test,
	...home,
	...navbar,
	...list,
	...message,
	...capitalpool,
}

export default en
