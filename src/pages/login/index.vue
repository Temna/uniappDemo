<template>
<u-modal 
v-model="show" 
:show-title="false" 
:show-confirm-button="false"
>
  <div class="slot-content">
    <u-button @click="onGetUser" v-if="showUserInfo">请先点击同意获取用户信息</u-button>
    <div v-else>
      <u-loading mode="circle"></u-loading><span class="loginTip">登录中...</span>
    </div>
    
  </div>
</u-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"


import { navigateBack } from '@/common/util'
import { login } from "@/api/login";
import { saveUserInfo } from "@/services/auth.service";
import UserLocation from '@/common/userLocation'
import UserInfo from '@/common/userInfo'
import { getUserWXinfo } from '@/services/auth.service'

@Component({})
export default class Login extends Vue {
  private show = true
  private showUserInfo = true 

  created() {
    if (getUserWXinfo()) {
      this.login()
    }
  }

  // 登录，获取token
  login() {
    const userInfo = {
      code: '',
      nickName: '',
      avatarUrl: '',
      gender: '',
      province: '',
      city: '',
      country: ''
    }
   
    const fn = () =>{
      wx.login({
        success: async (result: any) => {
          if (result.code) {
            userInfo.code = result.code
            let res = await login(userInfo);

            const fail = () => {
              fn()
            }

            const success = () => {
              saveUserInfo(res)
              navigateBack()
            }

            // 授权成功后， 登录成功，返回上一页
            UserLocation.getLocation(() => { success() }, () => { fail() })
          }
        }
      })
    }
    
    // 不管有没有获取到用户信息，都执行到下一步
    const getUserInfoCallback = (user: any) => {
      if (user) {
        userInfo.nickName = user.nickName
        userInfo.avatarUrl = user.avatarUrl
        userInfo.gender = user.gender //性别 0：未知、1：男、2：女
        userInfo.province = user.province
        userInfo.city = user.city
        userInfo.country = user.country
      }
      this.showUserInfo = false

      fn()
    }

    // 授权获取用户信息
    UserInfo.getUser((userInfo: any) => { getUserInfoCallback(userInfo) })
  }

  onGetUser() {
    this.showUserInfo = true
    this.login()
  }

}

</script>

<style lang="scss" scoped>
.slot-content {
  text-align: center;
  padding: 30rpx;
}
.loginTip {
  margin-left: 10rpx;
}
</style>