import axios, { AxiosRequestConfig } from 'axios'
import LimitPromise from '@/common/limitPromise'

const limtReq = new LimitPromise(5, 10000)

/** Create Axios instance */
const service = axios.create({
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
})

/** request Interceptor */
service.interceptors.request.use(
	config => {
		return config
	},
	(error: any) => {
		Promise.reject(error)
	},
)

/** Response interceptor */
service.interceptors.response.use(
	res => {
		return res.data
	},
	error => {
		return Promise.reject(error)
	},
)

const limitGet = (
	url: string,
	config?: AxiosRequestConfig,
	resolve?: (value: any | PromiseLike<any>) => void,
	reject?: (reason?: any) => void,
) =>
	limtReq
		.call(() => service.get(url, config))
		.then(resolve)
		.catch(reject)

export default limitGet
