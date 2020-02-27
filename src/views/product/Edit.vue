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
          <Form :data="formData" @submit="handleSubmit"/>
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
    }
  },
  async created() {
    // 深拷贝
    this.formData = JSON.parse(JSON.stringify(this.row))
    this.formData.price = parseFloat(this.formData.price) || null
    this.formData.show_price = parseFloat(this.formData.show_price) || null
    this.formData.sale = parseInt(this.formData.sale, 10) || null
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },

    async handleSubmit(formData) {
      console.log('fffff', formData)
      // formData.image = formData.image.map((item, index) => ({
      //   img_id: item.imgId,
      //   order: index,
      // }))
      // formData.property = formData.property.map(item => ({
      //   name: item.name,
      //   detail: item.detail,
      // }))
      // formData.sku = formData.sku.map(item => ({
      //   name: item.name,
      //   postage: item.postage,
      //   price: item.price,
      //   status: item.status,
      //   stock: item.stock,
      //   img_id: item.img.id
      // }))
      console.log('this.formData', this.formData)
      // 基础信息处理
      // await this.updateProductInfo(formData)
      // 详情图处理
      await this.updateImage(formData.image, formData.id)
      // sku处理
      // await this.updateSku(formData.sku)
      // property处理
      // await this.updateProperty(formData.property)
      // console.log('formData', formData)
      // try {
      //   const res = await product.createProduct(formData)
      //   this.$message.success(res.msg)
      //   this.handleBack()
      // } catch (e) {
      //   // 提示异常信息
      //   this.$message.error(e.data.msg)
      // }
    },

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
    }

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
