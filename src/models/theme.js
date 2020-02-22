import { get, _delete, post, patch } from '@/lin/plugins/axios'

class Theme {
  // 是否自行处理接口异常
  handleError = true

  async getThemes() {
    const res = await get('v1/theme')
    return res
  }

  async delThemeByIds(ids) {
    const res = await _delete('v1/theme', { ids }, { handleError: this.handleError })
    return res
  }

  async createTheme(data) {
    const res = await post('v1/theme', { ...data }, { handleError: this.handleError })
    return res
  }

  async addThemeProducts(id, products) {
    const res = await post(`v1/theme/product/${id}`, { products }, { handleError: this.handleError })
    return res
  }

  async deleteThemeProducts(id, products) {
    const res = await _delete(`v1/theme/product/${id}`, { products }, { handleError: this.handleError })
    return res
  }

  async getThemeDetail(id) {
    const res = await get(`v1/theme/${id}`)
    return res
  }

  async editTheme(id, data) {
    const res = await patch(`v1/theme/${id}`, data, { handleError: this.handleError })
    return res
  }
}

export default new Theme()
