import { get } from '@/lin/plugins/axios'

class Logistics {
  // 是否自行处理接口异常
  handleError = true

  async getLogistics(count, page, params) {
    let url = `v1/order/shipment/record?page=${page}&count=${count}`
    if (params.select && params.input) {
      url += `&${params.select}=${params.input}`
    }
    const res = await get(url, { handleError: this.handleError })
    return res
  }
}

export default new Logistics()
