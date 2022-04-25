// 商家详情
export interface ShopInfo {
  shopId: string,
  name: string,
  phone: number,
  avatar: string,
  onlineTicketNum: string,
  sendTicketNum: string,
  address: string,
  longitude: number, // 精度
  latitude: number // 维度
}

// 商家商品
export interface ShopGoods {
  shopId?: string
  shopName?: string
  goodsAvatar: string // 商品封面
  goodsDescription?: string // 商品描述
  goodsName: string // 商品名称
  goodsTotalNum?: number
  goodsRemainNum?: number
}

