import configService from './config.service'

import { getToken } from './auth.service'

let apiUrl = configService.apiUrl

function requestType(type: any, url: string, params: any, resolve: any, reject: any) {
	uni.request({
		url: apiUrl + url, 
		method: type,
		data: params,
		header: {
			'authToken': getToken(),
			'content-type': 'application/json'
		},
		success: function(res: any) {
			if (res.data.code === '00000141') {
				uni.reLaunch({
					url: '/pages/login/index'
				})
			} else 
			if (res.data.code !== '200' && res.data.code !== '00000000') {
				wx.showToast({
					icon: 'none',
					title: res.data.msg || '服务器异常',
				});
				reject(new Error(res.data.msg || '服务器异常'))
			} else {
				resolve(res.data.result)
			}
		},
		fail: function(res) {
			reject(res)
		}
	});
}

const request = {
	get(url: string, params?: any) {
		return new Promise((resolve, reject) => {
			requestType('GET', url, params, resolve, reject)
		})
	},
	post(url: string, params?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			requestType('POST', url, params, resolve, reject)
		})
	},
	delete(url: string, params?: any) {
		return new Promise((resolve, reject) => {
			requestType('DELETE', url, params, resolve, reject)
		})
	},
	put(url: string, params?: any) {
		return new Promise((resolve, reject) => {
			requestType('PUT', url, params, resolve, reject)
		})
	}
}

export default request
