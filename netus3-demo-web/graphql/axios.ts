import axios, { AxiosRequestConfig } from 'axios'
import { graphURL as baseURL } from '@/utils'

/** Create Axios instance */
const service = axios.create({
	timeout: 10000,
	baseURL,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
})

const maxRetryCount = 3
const retryInterval = 1000

let retryCount = 0

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
		const { config, response } = error

		if (response && response.status === 503 && retryCount < maxRetryCount) {
			retryCount++
			return new Promise(resolve => setTimeout(() => resolve(service(config)), retryInterval))
		}

		return Promise.reject(error)
	},
)

export default service
