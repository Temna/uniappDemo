// 发现


import
request
from '@/services/request.service';

import { ShopDto } from '@/types/shop'

// 参与活动的商家列表
export async function getActivityShopsList(options: {pageNo: number, pageSize: number}): Promise<{data: ShopDto[], total: number}> {
  return request.post('/api/activity/all', options)
}