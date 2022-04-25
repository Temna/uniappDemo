import
request
from '../services/request.service';

import { UserInfo } from '@/types/member'


// login获取token
export async function login(options: {code: string, nickName: string, avatarUrl: string, province: string, city: string, country: string, gender: string, language?: string, mobile?: string}): Promise<UserInfo> {
	return request.post('/api/users/login', options)
}
