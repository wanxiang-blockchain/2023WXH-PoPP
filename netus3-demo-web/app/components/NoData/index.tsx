type Types = {
	text: string
	classOther?: string
}

const NoDatePage = ({ text, classOther = '' }: Types) => {
	return (
		<div className={`w-full py-2 text-center text-sm text-xs text-gray-400 ${classOther}`}>
			<span>--{text}--</span>
		</div>
	)
}

export default NoDatePage
