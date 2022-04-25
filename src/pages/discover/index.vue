<template>
  <div class="page">
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
      <div class="activity-list">
        <!-- 瀑布流组件 -->
        <u-waterfall v-model="shopsList" add-time="100" ref="uWaterfall">
          <template v-slot:left="{ leftList }">
            <!-- 每项内容 -->
            <view
              v-for="(item, index) in leftList"
              @click="choiceShop(item)"
              :key="index"
              class="activity-item"
            >
              <u-lazy-load
                threshold="-200"
                border-radius="10"
                :image="item.avatar"
                :index="index"
              ></u-lazy-load>
              <div class="activity-item-name">{{ item.name }}</div>
              <div class="activity-item-address">{{ item.address }}</div>
              <div class="activity-item-phone">{{ item.phone }}</div>
            </view>
          </template>
          <template v-slot:right="{ rightList }">
            <view
              v-for="(item, index) in rightList"
              :key="index"
              class="activity-item"
              @click="choiceShop(item)"
            >
              <u-lazy-load
                threshold="-200"
                border-radius="10"
                :image="item.avatar"
                :index="index"
              ></u-lazy-load>
              <div class="activity-item-name">{{ item.name }}</div>
              <div class="activity-item-address">{{ item.address }}</div>
              <div class="activity-item-phone">{{ item.phone }}</div>
            </view>
          </template>
        </u-waterfall>
      </div>

      <u-loadmore
        :status="state.loadmore"
        :margin-top="20"
        :margin-bottom="20"
      />
    </scroll-view>
  </div>
</template>

<script lang="ts">
// 模块 发现
import { Component, Vue } from "vue-property-decorator";
import { getActivityShopsList } from "@/api/discover";

import { ShopDto } from '@/types/shop'

@Component
export default class Discover extends Vue {
  private state = {
    pageSize: 10,
    pageNum: 1,
    loadmore: "loading",
    total: 0,
    triggered: false, // 下拉刷新状态
  };
  //   商家列表
  private shopsList: ShopDto[] = [];

  // 初始化
  onLoad() {
    this.getShopsList();
  }

  //   获取商家列表
  getShopsList() {
    // 到底了（没有数据了）,或者在触发刷新中
    if (this.state.loadmore === "nomore") {
      return;
    }

    getActivityShopsList({
      pageNo: this.state.pageNum,
      pageSize: this.state.pageSize,
    })
      .then((res) => {
        this.state.total = res.total;
        if (this.state.total === 0) {
          this.state.loadmore = "nomore";
          return;
        }
        // 第二次进来时候判断，如果相同，后面就不合并数据了。当前接口返回会有问题（多个分页都有数据）
        if (this.state.total === this.shopsList.length) {
          this.state.loadmore = "nomore";
          return;
        }

        this.shopsList = this.shopsList.concat(res.data);

        if (this.state.total === this.shopsList.length) {
          this.state.loadmore = "nomore";
          return;
        }

        this.state.pageNum++;
      })
      .catch()
      .finally(() => {
        this.state.triggered = false;
      });
  }

  // 下拉刷新，重置状态
  refresherrefresh() {
    this.state.triggered = true;
    this.state.pageNum = 1;
    this.state.loadmore = "loading";
    this.shopsList = [];
    this.clear();
    this.getShopsList();
  }

  //滑动到底部
  scrolltolower() {
    this.getShopsList();
  }

  choiceShop(item: ShopDto) {
    if (item && item.shopId) {
      uni.navigateTo({
        url: `/pages/detail/index?shopId=${item.shopId}`,
      });
    }
  }

  clear() {
    (this.$refs.uWaterfall as any).clear();
  }
}
</script>

<style lang="scss">
.scroll-view {
  height: calc(100vh);
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
.activity-list {
  .activity-item {
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