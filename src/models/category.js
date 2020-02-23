import { get, _delete, post, put } from '@/lin/plugins/axios'

class Category {
  // 是否自行处理接口异常
  handleError = true

  // 弹出提示显示后端返回的错误信息
  showBackend = true

  async getCategorys() {
    const res = await get('v1/category')
    return res
  }

  async delCategoryByIds(ids) {
    // { ids } 等价于 { ids : ids }，对象的key和value命名相同时的一种简写
    const res = await _delete('v1/category', { ids }, { handleError: this.handleError })
    return res
  }

  async createCategory(data) {
    const res = await post('v1/category', data, { showBackend: this.showBackend })
    return res
  }

  async editCategory(id, data) {
    const res = await put(`v1/category/${id}`, data, { showBackend: this.showBackend })
    return res
  }
}

export default new Category()
