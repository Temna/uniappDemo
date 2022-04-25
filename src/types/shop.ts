// 商家

export enum Type {
  '美容洗车' = 1,
  '玩车改装' = 2,
  '大小保养' = 3,
  '贴膜镀晶' = 4
}

export const labelTypeMap = {
  [Type.美容洗车]: '美容洗车',
  [Type.玩车改装]: '玩车改装',
  [Type.大小保养]: '大小保养',
  [Type.贴膜镀晶]: '贴膜镀晶'
}

export const typeValueMap: any= {
  '美容洗车' : Type.美容洗车,
  '玩车改装' : Type.玩车改装,
  '大小保养' : Type.大小保养,
  '贴膜镀晶' : Type.贴膜镀晶
}

// 行业分类
export const TypeMap = [
  {
    label: '美容洗车',
    value: Type.美容洗车
  },
  {
    label: '玩车改装',
    value: Type.玩车改装
  },
  {
    label: '大小保养',
    value: Type.大小保养
  },
  {
    label: '贴膜镀晶',
    value: Type.贴膜镀晶
  }
]


export interface ShopDto {
  shopId: string // 商家id
  name: string // 商家名称
  phone: number // 手机号
  avatar: string // 商家店铺贴图
  distance: number // 用户距离商家距离 
  address: string // 商家地址
}

export const ShopTabs = [
  {
    name: '美容洗车',
    value: Type.美容洗车
  },
  {
    name: '玩车改装',
    value: Type.玩车改装
  },
  {
    name: '大小保养',
    value: Type.大小保养
  },
  {
    name: '贴膜镀晶',
    value: Type.贴膜镀晶
  }
]