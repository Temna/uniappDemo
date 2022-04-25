
import
request
  from '@/services/request.service';

export async function receive(options: { ticketId: string }): Promise<{ code: number, msg: string, result: any }> {
    if (process.env.NODE_ENV === 'developmentLocal') {
        return {
            code: 200,
            msg: '成功',
            result: null
        }
    }
    return request.post('/api/tickets/receive', options)
  }
  