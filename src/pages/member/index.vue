<template>
  <div>
    <view class="wrap">
      <view class="u-avatar-wrap" @tap="chooseAvatar">
        <image class="u-avatar-demo" :src="userInfo.avatar" mode="aspectFill"></image>
      </view>
      <div class="name" @click="showChangeName">{{userInfo.name}}</div>
    </view>

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
        <u-cell-group title="我的优惠券">
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
              <div class="ticketRemainNum">{{`券号：${item.ticketUseCode}`}}</div>
              <div>{{`商铺名称：${item.shopName}`}}</div>
              <div>{{`开始时间: ${getDateFormat(item.ticketStartTime)}`}}</div>
              <div>{{`到期时间: ${getDateFormat(item.ticketExpireTime)}`}}</div>
              <div>{{`距离：${getDistance(item.distance)}`}}</div>
            </div>
            <u-button
              slot="right-icon"
              size="mini"
              style="margin-left: 20rpx"
              @click="showQr(item)"
              :disabled="!item.ticketCanUse"
            >
              使用
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
    <u-modal v-model="QrState.modal_qr" confirm-text="确定" title="二维码">
      <div
        style="
          padding: 20rpx;
          height: 360rpx;
          width: 100%;
          display: flex;
          justify-content: center;
        "
      >
        <view class="qrimg">
          <tki-qrcode
            ref="qrcode"
            :val="QrState.url"
            :size="150"
            unit="px"
            :usingComponents="usingComponents"
            :showLoading="false"
          />
        </view>
      </div>
      <div style="padding: 20rpx; word-break: break-all;">{{`券号：${QrState.url}`}}</div>
    </u-modal>

    <u-modal
      v-model="showChangeNameBool"
      @confirm="confirmChangeName"
      ref="uModal2"
      show-cancel-button
      :async-close="true"
      confirm-text="确定"
      title="修改用户名称"
    >
      <div style="padding: 20rpx">
        <u-input
          v-model="changeNameValue"
          input-align="center"
        />
      </div>
    </u-modal>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { dateFormat } from '@/common/util'
import UserLocation from "@/common/userLocation";

import { getTicketsList, getUserInfo, setUserInfo } from "@/api/member";
import { getUserId } from "@/services/auth.service";


import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue";

import { ShopTickets } from "@/types/index";
import { UserInfo } from '@/types/member'



@Component({
  components: {
    tkiQrcode,
  },
})
export default class extends Vue {
  private QrState = {
    //二维码相关参数
    modal_qr: false,
    url: "", // 要生成的二维码值
  };

  private ticketList: ShopTickets[] = [];
  $u: any;

  private state = {
    pageNum: 1,
    loadmore: "loading",
    triggered: false, // 下拉刷新状态
  }

  private userInfo: UserInfo = {
    name: '', // 用户名
    phone: '', // 手机号 
    avatar: '' // 头像
  }

  private showChangeNameBool: boolean = false
  private changeNameValue: string = ''


  chooseAvatar() {
    // 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
    this.$u.route({
      // 关于此路径，请见下方"注意事项"
      url: "/pages/avatar/u-avatar-cropper",
      // 内部已设置以下默认参数值，可不传这些参数
      params: {
        // 输出图片宽度，高等于宽，单位px
        destWidth: 300,
        // 裁剪框宽度，高等于宽，单位px
        rectWidth: 200,
        // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
        fileType: "jpg",
      },
    });
  }

  created() {
    // 监听从裁剪页发布的事件，获得裁剪结果
    uni.$on("uAvatarCropper", (path) => {
      console.log(path);
      this.userInfo.avatar = path;
      // 可以在此上传到服务端
    })
    this.getTicketsList()
    this.getUserInfo()
  }
  
  // 获取用户信息
  getUserInfo() {
    getUserInfo({userId: getUserId()})
    .then(res => {
      this.userInfo = res
    })
  }

  // 获取我的优惠券列表
  getTicketsList() {
    // 到底了（没有数据了）,或者在触发刷新中
    if (this.state.loadmore === "nomore") {
      return;
    }

    const callback = (longitude: number, latitude: number) => {
      getTicketsList({
        pageNo: this.state.pageNum,
        pageSize: 10,
        longitude: longitude,
        latitude: latitude,
        userId: getUserId()
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
  
  // 点击唤起修改用户名称
  showChangeName() {
    if (this.userInfo) {
      this.changeNameValue = this.userInfo.name;
      this.showChangeNameBool = true
    }
  }

  confirmChangeName() {
    setUserInfo({name: this.changeNameValue}).then(() => {
      this.showChangeNameBool = false;
      if (this.userInfo) {
        this.userInfo.name = this.changeNameValue
      }
    })
  }

  // 下拉刷新，重置状态
  refresherrefresh() {
    this.state.pageNum = 1;
    this.state.loadmore = "loading";
    this.ticketList = [];
    this.state.triggered = true;
    this.getTicketsList();
  }

  //滑动到底部
  scrolltolower() {
    this.getTicketsList();
  }

  //   显示二维码 ticketUseCode
  showQr(ticket: ShopTickets) {
    if (!ticket.ticketCanUse) {
      return
    }
    this.QrState.url = ticket.ticketUseCode as string
    this.QrState.modal_qr = true;
    setTimeout(() => {
      (this.$refs.qrcode as any)._makeCode();
    }, 50);
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

<style scoped lang="scss">
.header {
  height: 300rpx;
}
.wrap {
  padding: 40rpx;
  display: flex;
  align-items: center;
  height: 300rpx;
  background: rgba(8, 101, 215, 0.208);
  .name {
    margin-left: 40rpx;
    font-size: 40rpx;
    font-weight: 600;
    word-break: break-all;
  }
}

.u-avatar-wrap {
  overflow: hidden;
  text-align: center;
}

.u-avatar-demo {
  width: 150rpx;
  height: 150rpx;
  border-radius: 100rpx;
}
.scroll-view {
  height: calc(100vh - 300rpx);
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