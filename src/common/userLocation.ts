/**
 * 获取用户经纬度
 */

const UserLocation = {

  longitude: 0,
  latitude: 0,
  refresh: 5000,
  firstBoolean: true,
  pervious: 0,

  // 外部调用，获取经纬度， callback(longitude, latitude)
  getLocation(callback: Function, reject?: Function) {
    // wx请求获取位置权限
    this.getAuthorize()
      .then(() => {
        // 同意后获取
        this.getLocationInfo(callback);
      })
      .catch(() => {
        // 不同意给出弹框，再次确认
        this.openConfirm()
          .then(() => {
            this.getLocationInfo(callback);
          })
          .catch(() => {
            this.rejectGetLocation(reject);
          })
    })
  },

  // 拒绝授权后，弹框提示是否手动打开位置授权
  openConfirm() {
    return new Promise((resolve, reject) => {
      uni.showModal({
        title: "请求授权当前位置",
        content: "我们需要获取地理位置信息",
        success: (res) => {
          if (res.confirm) {
            uni.openSetting({
              success(res) {
                let userLocation = false
                if (res && res[1] && res[1].authSetting && res[1].authSetting["scope.userLocation"]) {
                  userLocation = true
                }
                if (res && res.authSetting && res.authSetting["scope.userLocation"]) {
                  userLocation = true
                }

                if (userLocation) {
                  resolve("ok"); // 打开地图权限设置
                } else {
                  reject();
                }
              },
            });
          } else if (res.cancel) {
            reject();
          }
        }
      })
    })
  },

  // 彻底拒绝位置获取
  rejectGetLocation(reject?: Function) {
    uni.showToast({
      title: "你拒绝了授权，功能无法使用",
      icon: "none",
      duration: 2000,
      complete: () => {
        if (reject) {
          reject()
        }
      }
    })
  },

  // 初次位置授权
  getAuthorize() {
    return new Promise((resolve, reject) => {
      uni.authorize({
        scope: "scope.userLocation",
        success: () => {
          resolve("ok"); // 允许授权
        },
        fail: () => {
          reject(); // 拒绝授权
        }
      })
    })
  },
  
  // 确认授权后，获取用户位置
  getLocationInfo(callback: Function) {
    const now = new Date().getTime()
    if (this.pervious === 0) {
      this.pervious = now
    }
    // 超出时间，就重新获取
    if (now - this.pervious > this.refresh || this.firstBoolean) {
      console.log('重新获取经纬度')
      uni.getLocation({
        type: "gcj02",
        success: (res) => {
          this.longitude = res.longitude
          this.latitude = res.latitude
          // 用户经纬度
          callback(res.longitude, res.latitude)
          // 获取到经纬度了，就更新下状态
          this.firstBoolean = false
          this.pervious = 0
        },
        fail:(rej) => {
          callback(this.longitude, this.latitude)
          this.pervious = 0
        }
      })
    } else {
      callback(this.longitude, this.latitude)
    }
  }
  
  

}

export  default UserLocation
