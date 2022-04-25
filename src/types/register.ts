// 入住

import { Type } from '@/types/shop'

export interface ApplyReq {
  name: string // 商铺名称
  address: string // 商铺地址
  phone: number | null // 商家手机号
  type: Type | string | Type[] | null  // 商家所属行业分类
  consumption: string // 人均消费
  extra: string // 备注信息
  username: string // 登录账号
  password: string // 登录密码
  cost: number // 入住费用
  latitude: number // 维度
  longitude: number // 经度
  contactPerson: string // 联系人
}