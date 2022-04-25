// 商家

import
request
from '@/services/request.service';

import { Type, ShopDto } from '@/types/shop'

// 商家列表
export async function getShopsList(options: {pageNo: number, pageSize: number, type: Type}): Promise<{data: ShopDto[], total: number}> {
  return request.post('/api/shops/all', options)
}