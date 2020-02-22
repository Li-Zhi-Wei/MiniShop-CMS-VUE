import { get, _delete } from '@/lin/plugins/axios'

class Category {
  // 是否自行处理接口异常
  handleError = true

  async getCategorys() {
    const res = await get('v1/category')
    return res
  }

  async delCategoryByIds(ids) {
    // { ids } 等价于 { ids : ids }，对象的key和value命名相同时的一种简写
    const res = await _delete('v1/category', { ids }, { handleError: this.handleError })
    return res
  }
}

export default new Category()
