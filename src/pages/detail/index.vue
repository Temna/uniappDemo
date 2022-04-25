<template>
  <div class="page">
    <template v-if="!detailLoading">
      <div class="shops-info">
        <div class="shops-info-name">
          <span>{{ detail.name }}</span>
          <button 
          open-type="share" 
          size="mini"
          class="shareBtn"
          >
            <u-icon name="zhuanfa" size="40"></u-icon>
          </button>
        </div>
        <div class="shops-info-img">
          <u-swiper
            :list="goodslist"
            title="1"
            height="300"
            bg-color="transparent"
          ></u-swiper>
        </div>
        <div class="shops-info-other">
          <div class="shops-info-other-address">
            <u-icon name="map-fill" size="32"></u-icon>
            <div>{{ detail.address }}</div>
          </div>
          <div class="shops-info-other-phone" @click="makeCall">
            <u-icon name="phone-fill" size="32"></u-icon>
            <div>联系商家</div>
          </div>
        </div>
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
          <u-cell-group title="优惠券列表">
            <u-cell-item
              :hover-class="false"
              v-for="(item, index) in ticketList"
              :key="index"
              :arrow="false"
              :border="false"
            >
            <div slot="title" class="titleTicket">
              <u-icon name="coupon"/>
              <span class="titleText">{{item.ticketName}}</span>
            </div>
            <div slot="label" class="labelTicket">
              <div class="ticketRemainNum">{{`剩余：${item.ticketRemainNum}`}}张</div>
              <div>{{`开始时间: ${getDateFormat(item.ticketStartTime)}`}}</div>
              <div>{{`到期时间: ${getDateFormat(item.ticketExpireTime)}`}}</div>
              <div>{{`总张数：${item.ticketTotalNum}张 | 距离：${getDistance(item.distance)}`}}</div>
            </div>
            <u-button
              slot="right-icon"
              size="mini"
              style="margin-left: 20rpx"
              @click="receive(item)"
              :disabled="!item.ticketCanReceive"
            >
              领取
            </u-button>
            </u-cell-item>
          </u-cell-group>
        </div>
        <u-loadmore :status="state.loadmore" />
      </scroll-view>
    </template>
  </div>
</template>

<script lang="ts">
// 商家详情
import { Component, Vue } from "vue-property-decorator";
import { getShopInfo, getShopGoods, getShopTickets } from "@/api/detail";
import { ShopInfo } from "@/types/detail";
import { ShopTickets } from "@/types/index";
import { receive } from "@/api/common";

import { dateFormat } from '@/common/util'

@Component({})
export default class Detail extends Vue {
  // 获取商家基本信息状态
  private detailLoading = true;
  private detail: ShopInfo | null = null;
  private shopId: string | null = null;

  private state = {
    pageNum: 1,
    pageSize: 10,
    loadmore: "loading",
    triggered: false, // 下拉刷新状态
  };

  private goodslist: { image: string; title: string }[] = [];

  private ticketList: ShopTickets[] = [];

  onLoad(options: { shopId: string }) {
    console.log(options.shopId)
    this.shopId = options.shopId;
    if (!this.shopId) {
      this.detailLoading = false;
      return;
    }

    this.getShopInfo();
    this.getShopGoods();
    this.getShopTickets();
  }

  onShareAppMessage() {
    if (this.detail) {
      return {
        title: `普星商铺:${this.detail.name}`,
        path: `/pages/detail/index?shopId=${this.shopId}`
      }
    }
  }

  async onReachBottom() {
    if (this.state.pageNum == 5) {
      this.state.loadmore = "nomore";
      return;
    }
    this.state.pageNum++;
  }

  makeCall() {
    uni.makePhoneCall({
      phoneNumber: this.detail?.phone + "",
    });
  }

  getShopInfo() {
    if (!this.shopId) {
      return;
    }
    this.detailLoading = true;
    getShopInfo({ shopId: this.shopId })
      .then((res) => {
        this.detail = res;
      })
      .catch(() => {})
      .finally(() => {
        this.detailLoading = false;
      });
  }

  // 获取商家商品列表
  getShopGoods() {
    if (!this.shopId) {
      return;
    }
    getShopGoods({ pageNo: 1, pageSize: 10000000, shopId: this.shopId }).then(
      (res) => {
        this.goodslist = [];
        res.data.forEach((goods) => {
          this.goodslist.push({
            image: goods.goodsAvatar,
            title: goods.goodsName,
          });
        });
      }
    );
  }

  getShopTickets() {
    if (!this.shopId) {
      return;
    }
    // 到底了（没有数据了）,或者在触发刷新中
    if (this.state.loadmore === "nomore" || this.state.triggered) {
      return;
    }

    this.state.triggered = true;

    getShopTickets({
      pageNo: this.state.pageNum,
      pageSize: this.state.pageSize,
      shopId: this.shopId,
    })
      .then((res) => {
        this.ticketList = this.ticketList.concat(res.data);
        if (res.total === this.ticketList.length) {
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
    this.state.pageNum = 1;
    this.state.loadmore = "loading";
    this.ticketList = [];
    this.getShopTickets();
  }

  //滑动到底部
  scrolltolower() {
    this.getShopTickets();
  }

  // 领取
 receive(ticket: ShopTickets) {
    if (!ticket.ticketCanReceive) {
      return
    }

    receive({ ticketId: ticket.ticketId }).then(res => {
      this.ticketList.forEach(ticket => {
        if (ticket.ticketId === ticket.ticketId) {
          ticket.ticketRemainNum --
        }
      })
      wx.showToast({
        icon: 'success',
        title: '领取成功'
      });
    })
  }
  getDistance(distance: number) {
    let str = ''
    if (distance >= 1000) {
      str = distance / 1000 + '千米'
    } else {
      str = distance + '米'
    }
    return str
  }

  getDateFormat(time: number) {
    if (!time) {
      return '-'
    }
    return dateFormat("YYYY-mm-dd HH:MM", time)
  }

}
</script>

<style lang="scss">
.scroll-view {
  height: calc(100vh - 556rpx);
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss" scoped>
.wrapper {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 8rpx 40rpx 0px rgba(133, 161, 237, 0.132);
  margin-bottom: 20rpx;
}
.page {
  padding: 20rpx;
}

.shops-info {
  @extend .wrapper;
  padding: 20rpx;
  &-name {
    font-size: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
  }
  &-img {
    margin: 20rpx 0;
    background-color: transparent;
  }
  &-other {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-address {
      font-size: 24rpx;
      display: flex;
      align-items: center;
    }
    &-phone {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20rpx;
    }
  }
}
.coupon-list {
  width: 100%;
  // border: 1px dashed #ccc;
  box-sizing: border-box;
  @extend .wrapper;
}

.titleTicket {
  font-size: 30rpx;

  .titleText {
    margin-left: 10rpx;
  }
}

.labelTicket {
  &>div {
    margin-bottom: 10rpx;
  }
  .ticketRemainNum {
    font-weight: bold;
  }
}
.shareBtn {
  background: #fff;
  padding: 0;
  margin: 0;

  &::after {
    border: none;
  }
}
</style>