<template>
  <div class="container">
  <div class="header">
    <span>新增轮播图</span>
    <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"/> 返 回
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
import banner from '@/models/banner'

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
    async handleSubmit(formData) {
      this.fullscreenLoading = true
      // 格式化数据
      formData.items = formData.items.map(item => ({
        img_id: item.img_id,
        key_word: item.key_word,
        type: item.type,
      }))
      // 调用模型方法新增轮播图
      try {
        const res = await banner.createBanner(formData)
        // 添加成功，弹出一条消息提示
        this.$message.success(res.msg)
        // 触发一次返回按钮事件，回到列表列表页面
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
      margin-top: 40px;
    }
  }
</style>
