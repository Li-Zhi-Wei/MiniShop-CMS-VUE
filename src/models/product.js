import { get, _delete, patch, post, put } from '@/lin/plugins/axios'

class Product {
  // 是否自行处理接口异常
  handleError = true

  showBackend = true

  async getProductsPaginate(params) {
    params.showBackend = this.showBackend
    const res = await get('v1/product/paginate', params)
    return res
  }

  async delProductByIds(ids) {
    // { ids } 等价于 { ids : ids }，对象的key和value命名相同时的一种简写
    const res = await _delete('v1/product', { ids }, { showBackend: this.showBackend })
    return res
  }

  async modifyStatus(id) {
    const res = await patch(`v1/product/${id}`, {}, { showBackend: this.showBackend })
    return res
  }

  async getAllProducts() {
    const res = await get('v1/product', { showBackend: this.showBackend })
    return res
  }

  async createProduct(data) {
    const res = await post('v1/product', { ...data }, { handleError: this.handleError })
    return res
  }

  async editProduct(data) {
    const res = await put('v1/product', data, { handleError: this.handleError })
    return res
  }

  async addImage(image) {
    const res = await post('v1/product/image', { image }, { handleError: this.handleError })
    return res
  }

  async editImage(image) {
    const res = await put('v1/product/image', { image }, { handleError: this.handleError })
    return res
  }

  async delImage(ids) {
    const res = await _delete('v1/product/image', { ids }, { handleError: this.handleError })
    return res
  }

  async addSku(sku) {
    const res = await post('v1/product/sku', { sku }, { handleError: this.handleError })
    return res
  }

  async editSku(sku) {
    const res = await put('v1/product/sku', { sku }, { handleError: this.handleError })
    return res
  }

  async delSku(ids) {
    const res = await _delete('v1/product/sku', { ids }, { handleError: this.handleError })
    return res
  }

  async addProperty(property) {
    const res = await post('v1/product/property', { property }, { handleError: this.handleError })
    return res
  }

  async editProperty(property) {
    const res = await put('v1/product/property', { property }, { handleError: this.handleError })
    return res
  }

  async delProperty(ids) {
    const res = await _delete('v1/product/property', { ids }, { handleError: this.handleError })
    return res
  }
}

export default new Product()
