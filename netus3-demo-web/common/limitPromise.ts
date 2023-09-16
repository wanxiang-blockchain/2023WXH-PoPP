/** Encapsulates the number of concurrent requests for axios */
export default class LimitPromise {
	private _max: number
	private _count: number
	private _taskQueue: any[]
	private _waitingTime: number

	constructor(max: number, waitingTime: number) {
		this._max = max || 6
		this._count = 0
		this._taskQueue = []
		this._waitingTime = waitingTime || 5000
	}

	call(caller: (...arg: any[]) => any) {
		return new Promise((resolve, reject) => {
			const task = this._createTask(caller, resolve, reject)
			if (this._count >= this._max) {
				this._taskQueue.push(task)
			} else {
				task()
			}
		})
	}

	_createTask(caller: (...arg: any[]) => any, resolve: (value: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
		return () => {
			caller()
				.then(resolve)
				.catch(reject)
				.finally(() => {
					setTimeout(() => {
						this._count--
						if (this._taskQueue.length) {
							const task = this._taskQueue.shift()
							task()
						}
					}, this._waitingTime)
				})
			this._count++
		}
	}
}
