import { get, put } from '@/lin/plugins/axios'

class About {
  handleError = true

  showBackend = true

  async getOrderData(params) {
    const param = this._getDate(params)
    const res = await get('v1/analysis/order/base', {
      start: param.start,
      end: param.end,
      type: param.type,
      showBackend: this.showBackend,
    })
    return res
  }

  async getUserData(params) {
    const param = this._getDate(params)
    const res = await get('v1/analysis/user/base', {
      start: param.start,
      end: param.end,
      type: param.type,
      showBackend: this.showBackend,
    })
    return res
  }

  async getConfig() {
    const res = await get('v1/config', { showBackend: this.showBackend })
    return res
  }

  async setPostage(postage) {
    const res = await put('v1/config/postage', { postage }, { showBackend: this.showBackend })
    return res
  }

  async modifyPostageFlag() {
    const res = await put('v1/config/postageFlag')
    return res
  }

  async modifyShopStatus() {
    const res = await put('v1/config/shopStatus')
    return res
  }

  async modifyShowDialog() {
    const res = await put('v1/config/showDialog')
    return res
  }

  /**
   * 如果未传入时间，则设置时间为一周
   * @param params
   * @private
   */
  _getDate(params) {
    if (!params.start) {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      const Y = date.getFullYear()
      const M = date.getMonth() + 1 // 月份从0开始，所以要+1
      const D = date.getDate()
      params.start = Y + (M < 10 ? '-0' : '-') + M + (D < 10 ? '-0' : '-') + D
    }
    if (!params.end) {
      const date = new Date()
      const Y = date.getFullYear()
      const M = date.getMonth() + 1 // 月份从0开始，所以要+1
      const D = date.getDate()
      params.end = Y + (M < 10 ? '-0' : '-') + M + (D < 10 ? '-0' : '-') + D
    }
    const sta_date = new Date(params.start.replace(/-/g, '/'))
    const end_date = new Date(params.end.replace(/-/g, '/'))
    const days = (end_date - sta_date) / (1000 * 3600 * 24)
    if (days < 2) {
      params.type = 'hour'
    } else if (days < 91) {
      params.type = 'day'
    } else if (days < 730) {
      params.type = 'month'
    } else {
      params.type = 'year'
    }
    return params
  }
}

export default new About()
