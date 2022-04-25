<template>
  <div>
    <div class="address-ipnut">
      <u-input placeholder="请输入地址" v-model="addressName"></u-input>
      <u-button @click="confirm">确定</u-button>
    </div>
    <map
      style="width: 100vw; height: 100vh;"
      :latitude="localtion.latitude"
      :longitude="localtion.longitude"
      :scale="localtion.scale"
      :markers="localtion.markers"
      @regionchange="mapChange"
    />
    <view>
      <u-icon name="map-fill" class="map-icon" color="green"></u-icon>
    </view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import UserLocation from '@/common/userLocation'
import { navigateBack } from '@/common/util'


@Component({})
export default class Map extends Vue {
  private localtion = {
    latitude: 0,
    longitude: 0,
    scale: 19, // 默认16
    markers: [],
    markerHeight: 30
  }

  private addressName = ""


  mapChange(e: any) {
    if (e.type == "end" && (e.causedBy == "scale" || e.causedBy == "drag")) {
      // 用户经纬度
      this.localtion.longitude = e.mp.detail.centerLocation.longitude;
      this.localtion.latitude = e.mp.detail.centerLocation.latitude;
    }
  }

  confirm() {
    if (!this.addressName) {
      uni.showToast({
        title: "请输入地址",
        icon: "none"
      })
      return
    }

    navigateBack()

    uni.$emit("changeAddress",{address: this.addressName, longitude: this.localtion.longitude, latitude: this.localtion.latitude})
  }

  setLocation(longitude: number, latitude: number) {
    // 用户经纬度
    if (!this.localtion.longitude) {
      this.localtion.longitude = longitude
      this.localtion.latitude = latitude
    }

    const obj: any = {
      id: "",
      latitude: this.localtion.latitude,
      longitude: this.localtion.longitude,
      iconPath: "../../static/logo.png",
      width: this.localtion.markerHeight, //宽
      height: this.localtion.markerHeight, //高
    }

    let markers: any = this.localtion.markers;
    markers = [obj];
    this.localtion.markers = markers;
  }

  onLoad(options: {address: string, longitude: number, latitude: number}) {
    this.addressName = options.address
    try {
      this.localtion.longitude = Number(options.longitude)
      this.localtion.latitude = Number(options.latitude)
    } catch (error) {
      
    }

    UserLocation.getLocation((longitude:number, latitude: number) => this.setLocation(longitude, latitude))
  }
}
</script>

<style scoped>
.map-icon {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 1;
  font-size: 60rpx;
}
.address-ipnut {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: #ffffff;
  z-index: 1;
  padding: 20rpx;
}
</style>