import
request
  from '@/services/request.service';

import { noticeList, bannerList } from '@/mock/index'

import { ShopTickets, ResBannerItem } from '@/types/index'

// 获取公告列表
export async function getNotices(): Promise<string[]> {
  if (process.env.NODE_ENV === 'developmentLocal') {
    return noticeList;
  }
  const options = {
    pageNo: 1,
    pageSize: 1000000
  }
  return request.post('/api/notices/all', options);
}

// banner轮播图
export async function getBanner(): Promise<ResBannerItem[]> {
  if (process.env.NODE_ENV === 'developmentLocal') {
    return bannerList;
  }
  return request.post('/api/banners/all', { pageNo: 1, pageSize: 10000000 })
}

// 优惠券推荐
export async function ticketsRecommend(options: { pageNo: number, pageSize: number, latitude: number, longitude: number }): Promise<{ data: ShopTickets[], total: number }> {
  return request.post('/api/tickets/recommend', options)
}

// 优惠券附近
export async function ticketsNearby(options: { pageNo: number, pageSize: number, latitude: number, longitude: number }): Promise<{ data: ShopTickets[], total: number }> {
  return request.post('/api/tickets/nearby', options)
}

// 优惠券全部
export async function ticketsAll(options: { pageNo: number, pageSize: number, latitude: number, longitude: number }): Promise<{ data: ShopTickets[], total: number }> {
  return request.post('/api/tickets/all', options)
}