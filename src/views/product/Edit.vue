<template>
  <div class="container">
    <div class="header">
      <span>编辑商品</span>
      <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"/> 返回
      </span>
    </div>
    <el-divider/>
    <div class="form-container">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <Form :data="formData" :fullscreenLoading="fullscreenLoading" @submit="handleSubmit"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Form from './components/Form'
import product from '@/models/product'

export default {
  name: 'Edit',
  components: { Form },
  props: {
    row: Object,
  },
  data() {
    return {
      formData: null,
      fullscreenLoading: false,
    }
  },
  async created() {
    // 深拷贝
    this.formData = JSON.parse(JSON.stringify(this.row))
    // 数据类型转换，避免后面校验时出现数据类型不一致的错误
    this.formData.price = parseFloat(this.formData.price) || null
    this.formData.show_price = parseFloat(this.formData.show_price) || null
    this.formData.sale = parseInt(this.formData.sale, 10) || null
    this.formData.sku.forEach(item => {
      item.price = parseFloat(item.price) || null
      item.postage = parseFloat(item.postage) || null
      item.stock = parseInt(item.stock, 10) || null
    })
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },

    async handleSubmit(formData) {
      this.fullscreenLoading = true
      try {
        // 基础信息处理
        await this.updateProductInfo(formData)
        // 详情图处理
        await this.updateImage(formData.image, formData.id)
        // sku处理
        await this.updateSku(formData.sku, formData.id)
        // property处理
        await this.updateProperty(formData.property, formData.id)
        this.$message.success('编辑成功')
        this.handleBack()
      } catch (e) {
        this.$notify.error({
          message: e.data.msg,
          title: '错误',
          duration: 0,
        })
        this.fullscreenLoading = false
      }
    },
    /**
     * 更新基础信息
     * @param formData
     * @returns {Promise<void>}
     */
    async updateProductInfo(formData) {
      if (this.formData.category_id !== formData.category_id
        || this.formData.img_id !== formData.img_id
        || this.formData.main_img_url !== formData.main_img_url
        || this.formData.name !== formData.name
        || this.formData.postage !== formData.postage
        || this.formData.price !== formData.price
        || this.formData.show_price !== formData.show_price
        || this.formData.sale !== formData.sale
        || this.formData.status !== formData.status
        || this.formData.stock !== formData.stock
        || this.formData.summary !== formData.summary) {
        const data = {
          id: formData.id,
          category_id: formData.category_id,
          img_id: formData.img_id,
          main_img_url: formData.main_img_url,
          name: formData.name,
          postage: formData.postage,
          price: formData.price,
          show_price: formData.show_price,
          sale: formData.sale,
          status: formData.status,
          stock: formData.stock,
          summary: formData.summary,
        }
        await product.editProduct(data)
      }
    },
    /**
     * 更新详情图
     * @param image
     * @param id
     * @returns {Promise<void>}
     */
    async updateImage(image, id) {
      let addImage = []
      const delImage = []
      let editImage = []
      const oriImage = this.formData.image
      const curImage = image.map((item, index) => ({
        id: item.id, // 此处id为product_image表的主键
        img_id: item.imgId,
        order: index,
        product_id: id,
      }))
      // 找到删除的图片(只有product_image表的主键不见了才要删除)
      oriImage.forEach(item => {
        if (!curImage.find(i => i.id === item.id)) {
          delImage.push(item.id)
        }
      })
      // 删除没变的图片, 倒序遍历解决删除数组元素后索引改变的问题
      if (oriImage.length > curImage.length) {
        for (let i = curImage.length - 1; i >= 0; i--) {
          if (curImage[i].img_id === oriImage[i].img_id) {
            curImage.splice(i, 1)
          }
        }
      } else {
        for (let i = oriImage.length - 1; i >= 0; i--) {
          if (curImage[i].img_id === oriImage[i].img_id) {
            curImage.splice(i, 1)
          }
        }
      }
      // 找到新增的图片
      addImage = curImage.filter(item => item.id === '').map(item => ({
        img_id: item.img_id,
        order: item.order,
        product_id: item.product_id,
      }))
      // 删除新增的图片
      for (let i = curImage.length - 1; i >= 0; i--) {
        if (curImage[i].id === '') {
          curImage.splice(i, 1)
        }
      }
      // 剩下的就是编辑的图片
      editImage = curImage
      console.log('addImage', addImage)
      console.log('delImage', delImage)
      console.log('editImage', editImage)
      if (addImage.length > 0) {
        await product.addImage(addImage)
      }
      if (delImage.length > 0) {
        await product.delImage(delImage)
      }
      if (editImage.length > 0) {
        await product.editImage(editImage)
      }
    },
    /**
     * 更新Sku
     * @param sku
     * @param id
     * @returns {Promise<void>}
     */
    async updateSku(sku, id) {
      let addSku = []
      const delSku = []
      let editSku = []
      const oriSku = this.formData.sku
      // 找到新增的sku
      addSku = sku.filter(item => item.id === null).map(item => ({
        name: item.name,
        price: item.price,
        postage: item.postage,
        status: item.status,
        stock: item.stock,
        product_id: id,
        img_id: item.img.id
      }))
      // 找到删除的sku
      oriSku.forEach(item => {
        if (!sku.find(i => i.id === item.id)) {
          delSku.push(item.id)
        }
      })
      // 找到编辑的sku
      editSku = sku.filter(item => {
        const oriItem = oriSku.find(i => i.id === item.id)
        if (typeof (oriItem) !== 'undefined') {
          return item.img.id !== oriItem.img_id || item.name !== oriItem.name || item.postage !== oriItem.postage
            || item.price !== oriItem.price || item.status !== oriItem.status || item.stock !== oriItem.stock
        }
        return false
      }).map(item => ({
        id: item.id,
        name: item.name,
        img_id: item.img.id,
        postage: item.postage,
        price: item.price,
        status: item.status,
        stock: item.stock,
      }))
      console.log('addSku', addSku)
      console.log('editSku', editSku)
      console.log('delSku', delSku)
      if (addSku.length > 0) {
        await product.addSku(addSku)
      }
      if (editSku.length > 0) {
        await product.editSku(editSku)
      }
      if (delSku.length > 0) {
        await product.delSku(delSku)
      }
    },
    /**
     * 更新Property
     * @param property
     * @param id
     * @returns {Promise<void>}
     */
    async updateProperty(property, id) {
      let addProperty = []
      const delProperty = []
      let editProperty = []
      const oriProperty = this.formData.property
      // 找到新增的property
      addProperty = property.filter(item => item.id === null).map(item => ({
        name: item.name,
        detail: item.detail,
        product_id: id
      }))
      // 找到删除的property
      oriProperty.forEach(item => {
        if (!property.find(i => i.id === item.id)) {
          delProperty.push(item.id)
        }
      })
      // 找到编辑的property
      editProperty = property.filter(item => {
        const oriItem = oriProperty.find(i => i.id === item.id)
        if (typeof (oriItem) !== 'undefined') {
          return item.name !== oriItem.name || item.detail !== oriItem.detail
        }
        return false
      })
      console.log('addProperty', addProperty)
      console.log('delProperty', delProperty)
      console.log('editProperty', editProperty)
      if (addProperty.length > 0) {
        await product.addProperty(addProperty)
      }
      if (editProperty.length > 0) {
        await product.editProperty(editProperty)
      }
      if (delProperty.length > 0) {
        await product.delProperty(delProperty)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .el-divider--horizontal {
    margin: 0
  }

  .container {

    .header {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
      text-indent: 40px;

      .back {
        float: right;
        margin-right: 40px;
        cursor: pointer;
      }
    }

    .form-container {
      padding: 40px;
    }
  }
</style>
