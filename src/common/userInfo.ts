// 获取用户信息

import { saveUserWXinfo, getUserWXinfo } from '@/services/auth.service'

const UserInfo = {
  user: null,

  // 外部调用，获取微信小程序用户信息， callback(userInfo)
  getUser(callback: Function) {
    const user = getUserWXinfo()
    if (user) {
      this.user = user
    }
    this.getUserInfo(callback)
  },

  // 获取用户信息
  getUserInfo(callback: Function) {
    try {
      if (!this.user) {
        uni.getUserProfile({
          desc: '在我的模块需要展示',
          success: (res: any) => {
            this.user =  res.userInfo as any
            saveUserWXinfo(this.user)
            callback(this.user)
          },
          fail:(rej) => {
            callback(this.user)
          }
       })
      } else {
        callback(this.user)
      }
    } catch (error) {
      callback(this.user)
    }
  }

}

export  default UserInfo