import request from '@/utils/requestApi'

export const getDatas = async (body: { address: string }) =>
	request({
		url: '/test',
		method: 'post',
		data: body,
	})
