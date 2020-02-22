import { get } from '@/lin/plugins/axios'

class Order {
  // 是否自行处理接口异常
  handleError = true

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
    return get(url, { handleError: this.handleError })
  }

  // async delProductByIds(ids) {
  //   // { ids } 等价于 { ids : ids }，对象的key和value命名相同时的一种简写
  //   const res = await _delete('v1/product', { ids }, { handleError: this.handleError })
  //   return res
  // }
}

export default new Order()
