<template>
  <div class="page">
    <div class="shops-img">
      <u-swiper
        :list="bannerList"
        title="1"
        :effect3d="false"
        :autoplay="false"
        height="300"
        bg-color="transparent"
        @click="choiceShop"
      />
    </div>
    <div class="notice">
      <u-notice-bar :list="noticeList" />
    </div>
    <div class="notice">
      <u-button @click="gotoRegister">入驻申请</u-button>
    </div>
    <div class="notice">
      <!-- <u-sticky @fixed="isScroll = true" @unfixed="isScroll = false">
        <u-tabs
          :list="tabsList"
          :is-scroll="false"
          :current="currentTab"
          @change="changeTab"
        >
        </u-tabs>
      </u-sticky> -->
      <u-tabs
        :list="tabsList"
        :is-scroll="false"
        :current="currentTab"
        @change="changeTab"
      />
      <template v-for="(item, index) in tabsList">
        <all-tickets
          v-show="currentTab === index"
          :key="index"
          :type="index"
          :isScroll="isScroll"
          :ref="`ticketList${index}`"
        ></all-tickets>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { getNotices, getBanner } from "@/api/index";

import { BannerItem, TabsItem } from "@/types/index";

import allTickets from "./components/all-tickets.vue";

@Component({
  components: {
    allTickets,
  },
})
export default class Detail extends Vue {
  private noticeList: string[] = [];

  private bannerList: BannerItem[] = [];

  private tabsList: TabsItem[] = [
    {
      name: "推荐",
    },
    {
      name: "附近",
    },
    {
      name: "全部",
    },
  ];

  private currentTab: number = 0;

  private isScroll: boolean = true; // 控制开启滚动

  // 选择banner商品跳转
  choiceShop(index: number) {
    const nowShop = this.bannerList[index];
    if (nowShop && nowShop.shopId) {
      uni.navigateTo({
        url: `/pages/detail/index?shopId=${nowShop.shopId}`,
      });
    }
  }

  // 注册
  gotoRegister() {
    uni.navigateTo({
      url: `/pages/register/index`,
    });
  }

  // 切换tab
  changeTab(index: number) {
    this.currentTab = index;
    (this.$refs[`ticketList${index}`] as any)[0].getTicketList();
  }

  // 下拉刷新
  onPullDownRefresh() {
    uni.showLoading({
      title: "加载中",
    });
    setTimeout(function () {
      uni.hideLoading();
      uni.stopPullDownRefresh();
    }, 1000);
  }

  // 获取通知
  getNotices() {
    getNotices()
      .then((res) => {
        this.noticeList = res;
      })
      .catch(() => {
        this.noticeList = [];
      })
      .finally(() => {});
  }

  // 获取banner
  getBanner() {
    getBanner().then((res) => {
      this.bannerList = res.map((item: any) => {
        return {
          image: item.avatar || "https://cdn.uviewui.com/uview/swiper/3.jpg",
          title: item.name,
          shopId: item.shopId
        };
      });
    });
  }
  async created() {
    this.getBanner();
    this.getNotices();
  }
  mounted() {
    (this.$refs[`ticketList0`] as any)[0].getTicketList();
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20rpx 20px 0;
}

.wrapper {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 8rpx 40rpx 0px rgba(133, 161, 237, 0.132);
  margin-bottom: 20rpx;
}

.shops-img {
  @extend .wrapper;
  background-color: transparent;
}

.notice {
  margin-top: 20rpx;
}
</style>