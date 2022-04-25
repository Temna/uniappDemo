<template>
  <div class="page">
    <div class="notice">
      <u-notice-bar :list="noticeList" />
    </div>
    <div class="notice">
      <u-button @click="gotoRegister">入驻申请</u-button>
    </div>
    <div class="notice">
      <u-sticky>
        <u-tabs
          :list="tabsList"
          :is-scroll="false"
          :current="currentTab"
          @change="changeTab"
        ></u-tabs>
      </u-sticky>
    </div>

    <scroll-view
      :scroll-y="true"
      :refresher-enabled="true"
      :show-scrollbar="false"
      class="scroll-view"
      @refresherrefresh="refresherrefresh"
      :refresher-triggered="state.triggered"
      @scrolltolower="scrolltolower"
      scroll-anchoring
    >
      <div class="coupon-list">
        <!-- 瀑布流组件 -->
        <u-waterfall v-model="shopsList" add-time="100"  ref="uWaterfall">
          <template v-slot:left="{ leftList }">
            <!-- 每项内容 -->
            <view
              v-for="(item, index) in leftList"
              @click="choiceShop(item)"
              :key="index"
              class="coupon-item"
            >
              <u-lazy-load
                threshold="-200"
                border-radius="10"
                :image="item.avatar"
                :index="index"
              ></u-lazy-load>
              <div class="coupon-item-name">{{item.name}}</div>
              <div class="coupon-item-address">{{item.address}}</div>
              <div class="coupon-item-phone">{{item.phone}}</div>
            </view>
          </template>
          <template v-slot:right="{ rightList }">
            <view
              v-for="(item, index) in rightList"
              :key="index"
              class="coupon-item"
              @click="choiceShop(item)"
            >
              <u-lazy-load
                threshold="-200"
                border-radius="10"
                :image="item.avatar"
                :index="index"
              ></u-lazy-load>
              <div class="coupon-item-name">{{item.name}}</div>
              <div class="coupon-item-address">{{item.address}}</div>
              <div class="coupon-item-phone">{{item.phone}}</div>
            </view>
          </template>
        </u-waterfall>
      </div>
      <u-loadmore :status="state.loadmore"  :margin-top="20" :margin-bottom="20"/>
    </scroll-view>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"

import { getNotices } from "@/api/index"
import { getShopsList } from '@/api/shop'

import { ShopTabs, ShopDto } from '@/types/shop'

@Component({})
export default class Detail extends Vue {
  private noticeList: string[] = []
  private tabsList = ShopTabs
  private currentTab = 0

  private state = {
    pageSize: 10,
    pageNo: 1,
    loadmore: "loading",
    total: 0,
    triggered: false // 下拉刷新状态
  }

  //   商家列表
  private shopsList: ShopDto[] = []

  // 初始化
  onLoad() {
    this.getNotices()
    this.getShopsList()
  }
  
  // 获取公告
  getNotices() {
    getNotices()
      .then((res) => {
        this.noticeList = res
      })
      .catch(() => {
        this.noticeList = []
      })
      .finally(() => {});
  }
  
  // 跳转到商家入住页
  gotoRegister() {
    uni.navigateTo({
      url: `/pages/register/index`
    });
  }

  // 切换店铺分类
  changeTab(index: number) {
    this.currentTab = index
    this.shopsList = []
    this.clear()
    this.state.total = 0
    this.state.pageNo = 1
    this.state.loadmore = "loading"
    this.getShopsList()
  }

  // 获取商家列表
  getShopsList() {
    // if (this.state.triggered) {
    //   return
    // }
    
    const type = this.tabsList[this.currentTab].value
    getShopsList({pageNo: this.state.pageNo, pageSize: this.state.pageSize, type: type})
    .then(res => {
      this.state.total = res.total
      if (this.state.total === 0) {
        this.state.loadmore = "nomore"
        return
      }
      // 第二次进来时候判断，如果相同，后面就不合并数据了。当前接口返回会有问题（多个分页都有数据）
      if (this.state.total === this.shopsList.length) {
        this.state.loadmore = "nomore"
        return
      }

      this.shopsList = this.shopsList.concat(res.data)

      if (this.state.total === this.shopsList.length) {
        this.state.loadmore = "nomore"
        return
      }

      this.state.pageNo++
    })
    .catch()
    .finally(() => {
      this.state.triggered = false
    })
  }

  //滑动到底部
  scrolltolower() {
    this.getShopsList()
  }

  // 下拉刷新，重置状态
  refresherrefresh() {
    this.state.triggered = true
    this.state.total = 0
    this.state.pageNo = 1
    this.state.loadmore = "loading"
    this.shopsList = []
    this.clear()
    this.getShopsList()
  }


  // 选择某个商铺，跳转到详情页
  choiceShop(item: ShopDto) {
    if (item && item.shopId) {
      uni.navigateTo({
        url: `/pages/detail/index?shopId=${item.shopId}`
      })
    }
  }

  clear() {
    (this.$refs.uWaterfall as any).clear();
  }

}
</script>

<style lang="scss">
.scroll-view {
  height: calc(100vh - 316rpx);
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss" scoped>

.page {
  padding: 20rpx 20rpx;
}

.wrapper {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 8rpx 40rpx 0px rgba(230, 231, 237, 0.571);
  margin-bottom: 20rpx;
}

.notice {
  margin-top: 10px;
}

.coupon-list {
  .coupon-item {
    @extend .wrapper;
    border-radius: 8px;
    margin: 5px;
    padding: 8px;
    position: relative;
    &-name {
      color: #333;
      font-size: 30rpx;
      font-weight: 600;
      margin: 10rpx 10rpx 14rpx;
    }
    &-phone {
      color: #666;
      font-size: 20rpx;
      margin: 4rpx 10rpx 0rpx;
    }
    &-address {
      font-size: 22rpx;
      margin: 10rpx 10rpx 0;
    }
  }
}
</style>