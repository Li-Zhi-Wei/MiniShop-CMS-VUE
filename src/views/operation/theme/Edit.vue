<template>
  <div class="container">
    <div class="header">
      <span>编辑主题</span>
      <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"/> 返回
      </span>
    </div>
    <el-divider/>
    <div class="form-container">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <Form :data="formData" @submit="handleSubmit" @get-detail="getDetail" :fullscreenLoading="fullscreenLoading"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Form from './components/Form'
import theme from '@/models/theme'

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
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },
    /**
     * Form组件获得详细信息后立即通过事件告知于此，详细信息留作提交是比对使用
     * @param data
     */
    getDetail(data) {
      this.formData = data
    },

    async handleSubmit(formData) {
      this.fullscreenLoading = true
      try {
        // 基础信息处理
        await this.updateThemeInfo(formData)
        // 包含商品处理
        await this.updateThemeItem(formData)
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

    async updateThemeInfo(formData) {
      if (this.formData.name !== formData.name
        || this.formData.description !== formData.description
        || this.formData.topic_img[0].imgId !== formData.topic_img[0].imgId
        || this.formData.head_img[0].imgId !== formData.head_img[0].imgId) {
        const data = {
          name: formData.name,
          description: formData.description,
          topic_img_id: formData.topic_img[0].imgId,
          head_img_id: formData.head_img[0].imgId,
        }
        await theme.editTheme(formData.id, data)
      }
    },

    async updateThemeItem(formData) {
      // 通过比较提交的商品和初始商品 2个数组的差别，找到删除或增加的商品的id
      const delItems = this.formData.products.filter(i => !formData.products.find(j => i.id === j.id)).map(item => item.id)
      const addItems = formData.products.filter(i => !this.formData.products.find(j => i.id === j.id)).map(item => item.id)
      if (addItems.length > 0) {
        await theme.addThemeProducts(formData.id, addItems)
      }
      if (delItems.length > 0) {
        await theme.deleteThemeProducts(formData.id, delItems)
      }
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
