// 商家详情
import
request
from '@/services/request.service'

import { shopInfo, shopGoodsList, shopTicketsList } from '@/mock/detail'
import { ShopInfo, ShopGoods } from '@/types/detail'
import { ShopTickets } from '@/types/index'

// 获取详情
export async function getShopInfo(options: {shopId: string}): Promise<ShopInfo> {
  if (process.env.NODE_ENV === 'developmentLocal') {
    return shopInfo
  }
  return request.post('/api/shops/getShopInfo', options)
}

// 获取商家产品列表  
export async function getShopGoods(options: {pageNo: number, pageSize: number, shopId: string}): Promise<{data: ShopGoods[], total: number}> {
  if (process.env.NODE_ENV === 'developmentLocal') {
    return {data: shopGoodsList, total: 3}
  }

  return request.post('/api/shops/getShopGoods', options)
}

// 获取商家优惠券列表
export async function getShopTickets(options: {pageNo: number, pageSize: number, shopId: string}): Promise<{data: ShopTickets[], total: number}> {
  if (process.env.NODE_ENV === 'developmentLocal') {
    return {data: shopTicketsList, total: 2}
  }

  return request.post('/api/shops/getShopTickets', options)
}

// 触发分享时日志触发上报
export async function shopsShare(options: {shopId: string}) {
  return request.post('/api/shops/share', options)
} 