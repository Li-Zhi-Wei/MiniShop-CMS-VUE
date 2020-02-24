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
          <Form @submit="handleSubmit"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Form from './components/Form'

export default {
  name: 'Add',
  components: { Form },
  methods: {
    // 返回按钮点击事件
    handleBack() {
      this.$emit('back')
    },
    async handleSubmit(formData) {
      // const data = {
      //   id: formData.id,
      //   name: formData.name,
      //   description: formData.description,
      //   topic_img_id: formData.topic_img[0].imgId,
      //   head_img_id: formData.head_img[0].imgId,
      //   products: formData.products.map(item => item.id),
      // }
      // try {
      //   const res = await theme.createTheme(data)
      //   await theme.addThemeProducts(res.result.id, data.products)
      //   this.$message.success('添加成功')
      //   this.handleBack()
      // } catch (e) {
      //   // 提示异常信息
      //   this.$message.error(e.data.msg)
      // }
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
