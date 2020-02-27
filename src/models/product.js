import { get, _delete, patch, post, put } from '@/lin/plugins/axios'

class Product {
  // 是否自行处理接口异常
  handleError = true

  showBackend = true

  async getProductsPaginate(params) {
    params.showBackend = this.handleError
    const res = await get('v1/product/paginate', params)
    return res
  }

  async delProductByIds(ids) {
    // { ids } 等价于 { ids : ids }，对象的key和value命名相同时的一种简写
    const res = await _delete('v1/product', { ids }, { handleError: this.handleError })
    return res
  }

  async modifyStatus(id) {
    const res = await patch(`v1/product/${id}`, {}, { handleError: this.handleError })
    return res
  }

  async getAllProducts() {
    const res = await get('v1/product')
    return res
  }

  async createProduct(data) {
    const res = await post('v1/product', { ...data }, { showBackend: this.showBackend })
    return res
  }

  async editProduct(data) {
    const res = await put('v1/product', data, { showBackend: this.showBackend })
    return res
  }
}

export default new Product()
