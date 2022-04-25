<template>
  <div>
    <scroll-view
      :scroll-y="isScroll"
      :refresher-enabled="true"
      :show-scrollbar="false"
      class="scroll-view"
      @refresherrefresh="refresherrefresh"
      :refresher-triggered="state.triggered"
      @scrolltolower="scrolltolower"
      scroll-anchoring
    >
      <div class="coupon-list">
        <u-cell-group :border="false">
          <u-cell-item
            :hover-class="false"
            v-for="(item, index) in ticketList"
            :key="index"
            :arrow="false"
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
      <u-loadmore
        :status="state.loadmore"
        :margin-top="20"
        :margin-bottom="20"
      />
    </scroll-view>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { dateFormat } from '@/common/util'

import { ticketsNearby, ticketsAll, ticketsRecommend } from "@/api/index";
import { receive } from "@/api/common";
import UserLocation from "@/common/userLocation";

import { ShopTickets } from "@/types/index";

@Component({})
export default class extends Vue {
  @Prop(Number) readonly type: number | undefined;
  @Prop(Boolean) readonly isScroll: Boolean | undefined;

  private state = {
    pageNum: 1,
    loadmore: "loading",
    triggered: false, // 下拉刷新状态
  };

  private ticketList: ShopTickets[] = [];

  // 获取优惠券列表
  getTicketList() {
    // 到底了（没有数据了）,或者在触发刷新中
    if (this.state.loadmore === "nomore") {
      return;
    }

    let fn: any;

    if (this.type === 0) {
      fn = ticketsRecommend;
    } else if (this.type === 1) {
      fn = ticketsNearby;
    } else if (this.type === 2) {
      fn = ticketsAll;
    }

  
    const callback = (longitude: number, latitude: number) => {
      fn({
        pageNo: this.state.pageNum,
        pageSize: 10,
        longitude: longitude,
        latitude: latitude,
      })
        .then((res: { data: ShopTickets[]; total: number }) => {
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
    };
    UserLocation.getLocation((longitude: number, latitude: number) =>
      callback(longitude, latitude)
    );
  }

  // 下拉刷新，重置状态
  refresherrefresh() {
    this.state.pageNum = 1;
    this.state.loadmore = "loading";
    this.ticketList = [];
    this.state.triggered = true;
    this.getTicketList();
  }

  //滑动到底部
  scrolltolower() {
    this.getTicketList();
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
  height: calc(100vh - 616rpx);
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
<style  lang="scss" scoped>
.wrapper {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 8rpx 40rpx 0px rgba(133, 161, 237, 0.132);
  margin-bottom: 20rpx;
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

</style>