export interface TicketsList {
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
    type?: number // 优惠券: 0已经过期1-可用
}

// 用户信息
export interface UserInfo {
    authToken?: string // 登录凭证
    name: string // 用户名
    phone: string // 手机号 
    avatar: string // 头像
}