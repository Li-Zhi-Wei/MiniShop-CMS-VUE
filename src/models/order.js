import { get, post, put } from '@/lin/plugins/axios'

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
      const M = date.getMonth() + 1 // 月份从0开始，所以要+1
      const D = date.getDate() + 1 // 默认是0点，所以查当天的要+1
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

  async deliver(id, data) {
    const res = await post(`v1/order/shipment/${id}`, data, { handleError: this.handleError })
    return res
  }

  async refund(data) {
    const res = await post('v1/order/pay/refund', data, { handleError: this.handleError })
    return res
  }

  async close(id) {
    const res = await put(`v1/order/close/${id}`, {}, { showBackend: this.showBackend })
    return res
  }

  async paid(id) {
    const res = await put(`v1/order/paid/${id}`, {}, { showBackend: this.showBackend })
    return res
  }
}

export default new Order()
