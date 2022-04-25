import { ticketsList } from '../mock/member'
import { ShopTickets } from '@/types/index'
import request from '@/services/request.service';

// 获取我的优惠券列表
export async function getTicketsList(options: { pageNo: number, pageSize: number, userId: string, latitude: number, longitude: number }): Promise<{ data: ShopTickets[], total: number }> {
    if (process.env.NODE_ENV === 'developmentLocal') {
        return {
            data:ticketsList,
            total: 10
        };
    }
    return request.post('/api/tickets/getUserTickets', options)
}

export async function getUserInfo(options: {userId: string}) {
    return request.post('/api/users/getUserInfo', options)
}

export async function setUserInfo(options: {name: string}) {
    return request.post('/api/users/edit', options)
}