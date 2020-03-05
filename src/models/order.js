import { get } from '@/lin/plugins/axios'

class Order {
  // 是否自行处理接口异常
  handleError = true

  showBackend = true

  async getOrdersPaginate(count, page, params) {
    if (!params.start) {
      params.start = '2019-01-01'
    }
    if (!params.end) {
      const date = new Date()
      const Y = date.getFullYear()
      const M = date.getMonth() + 1
      const D = date.getDate()
      params.end = Y + (M < 10 ? '-0' : '-') + M + (D < 10 ? '-0' : '-') + D
    }
    let url = `v1/order?count=${count}&page=${page}&start=${params.start}&end=${params.end}`
    if (params.input) { // 判断参数是否包含姓名或订单号
      if (/.*[\u4e00-\u9fa5]+.*$/.test(params.input)) {
        url += `&name=${params.input}`
      } else {
        url += `&order_no=${params.input}`
      }
    }
    return get(url, { showBackend: this.showBackend })
  }

  async getPayStatus(orderNo) {
    const res = await get(`v1/order/pay/${orderNo}`, { handleError: this.handleError })
    return res
  }

  async getRefundStatus(orderNo) {
    const res = await get(`v1/order/pay/refund/${orderNo}`, { handleError: this.handleError })
    return res
  }
}

export default new Order()
