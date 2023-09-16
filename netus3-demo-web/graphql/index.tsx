import request from './axios'

export const getSubgraphsRequest = async (data: any, variables?: any) =>
	request({
		method: 'post',
		data: {
			operationName: 'MyQuery',
			variables: variables ? variables : null,
			query: data,
		},
	})
