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
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },

    async handleSubmit(formData) {
      console.log('formData', formData)
      this.handleBack()
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
