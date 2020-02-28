<template>
  <div class="container">
    <div class="header">
      <span>新增商品</span>
      <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"/> 返回
      </span>
    </div>
    <el-divider/>
    <div class="form-container">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <Form @submit="handleSubmit" :fullscreenLoading="fullscreenLoading"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Form from './components/Form'
import product from '@/models/product'

export default {
  name: 'Add',
  components: { Form },
  data() {
    return {
      fullscreenLoading: false,
    }
  },
  methods: {
    // 返回按钮点击事件
    handleBack() {
      this.$emit('back')
    },
    /**
     * 提交
     * @param formData
     * @returns {Promise<void>}
     */
    async handleSubmit(formData) {
      this.fullscreenLoading = true
      formData.image = formData.image.map((item, index) => ({
        img_id: item.imgId,
        order: index,
      }))
      formData.property = formData.property.map(item => ({
        name: item.name,
        detail: item.detail,
      }))
      formData.sku = formData.sku.map(item => ({
        name: item.name,
        postage: item.postage,
        price: item.price,
        status: item.status,
        stock: item.stock,
        img_id: item.img.id
      }))
      delete formData.id
      try {
        const res = await product.createProduct(formData)
        this.$message.success(res.msg)
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
