<script lang="ts">
import Vue from "vue";

import UserLocation from "@/common/userLocation";
export default Vue.extend({
  mpType: "app",
  globalData: {
    longitude: 116,
    latitude: 39,
  },
  onLaunch() {
    console.log("App Launch");
    // // 获取经纬度
    // const setLocation = (longitude: number, latitude: number) => {
    //   (getApp().globalData as any).longitude = longitude;
    //   (getApp().globalData as any).latitude = latitude;

    //   const onLocationChange = () => {
    //     //   监听位置改变
    //     wx.onLocationChange((res) => {
    //       setLocation(res.longitude, res.latitude);
    //       console.log("位置改变了", res);
    //     });
    //   };

    //   //   开启小程序进入前台时接收位置消息
    //   wx.startLocationUpdate({
    //     success: function () {
    //       onLocationChange();
    //     },
    //     fail: function () {},
    //   });
    // };
    // UserLocation.getLocation((longitude: number, latitude: number) =>
    //   setLocation(longitude, latitude)
    // );
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>

<style lang="scss">
@import "uview-ui/index.scss";
page {
  color: $uni-text-color;
  // background: #f2f2f2;
}
/*每个页面公共css */
</style>
