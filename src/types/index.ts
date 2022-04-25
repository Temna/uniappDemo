// 首页

// 商家优惠券
export interface ShopTickets {
  ticketId: string // 优惠券id
  ticketName: string // 优惠券名称
  distance?: string // 距离
  shopName?: string // 所属商铺
  shopId?: string // 所属商铺id
  ticketTotalNum: number // 总张数
  ticketRemainNum: number // 剩余张数
  ticketAvatar?: string // 优惠券封面
  ticketDescription?: string // 优惠券描述
  ticketUseCode?: string // 核销码
  ticketStartTime?: number | string // 优惠券开始时间
  ticketExpireTime?: number | string // 优惠券结束时间
  ticketCanReceive?: boolean // true 表示优惠券可以使用
  ticketCanUse?: boolean // true 表示我的优惠券可以使用
}

// 请求banner返回
export interface ResBannerItem {
  avatar: string // 头像
  name: string // 名字
  shopId: number // 商家id
}

// 轮播图组件用的时候做一下字段转换
export interface BannerItem {
  image: string // 头像
  title: string// 名字
  shopId: number// 商家id
}

// tabs
export interface TabsItem {
  name: string
}