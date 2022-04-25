import
request
from '@/services/request.service'

import { sha256 } from 'js-sha256'

import { ApplyReq } from '@/types/register'

// 商家申请入住平台
export async function shopsApply(options: ApplyReq) {
  options.password = sha256(options.password)
  return request.post('/api/shops/apply', options)
}