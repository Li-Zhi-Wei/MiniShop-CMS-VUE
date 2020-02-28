<template>
  <div class="container">
    <div class="header">
      <span>编辑轮播图</span>
      <span class="back" @click="handleBack">
                <i class="iconfont icon-fanhui"/> 返 回
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
import banner from '@/models/banner'
import Form from './components/Form'

export default {
  name: 'Edit',
  components: { Form },
  props: {
    banner: Object,
  },
  data() {
    return {
      formData: null,
      fullscreenLoading: false,
    }
  },
  created() {
    // 深拷贝
    this.formData = JSON.parse(JSON.stringify(this.banner))
  },
  methods: {
    // 表单组件的提交事件
    async handleSubmit(formData) {
      this.fullscreenLoading = true
      try {
        // 轮播图基础信息部分的逻辑处理
        await this.updateBannerInfo(formData)
        // 轮播图元素部分的逻辑处理
        await this.updateBannerItem(formData.items)
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

    // 轮播图信息部分逻辑逻辑
    async updateBannerInfo(formData) {
      // 判断轮播图名称和简介与原数据是否存在差异
      if (formData.name !== this.banner.name || formData.description !== this.banner.description) {
        const { id, name, description } = formData
        await banner.editBanner(id, name, description)
      }
    },

    // 轮播图元素部分逻辑处理
    async updateBannerItem(bannerItems) {
      // 待修改的bannerItem信息
      let editBannerItems = []
      // 待删除的bannerItem信息
      // let delBannerItems = JSON.parse(JSON.stringify(this.banner.items))
      let delBannerItems = []
      // 待新增的bannerItem信息
      let addBannerItems = []
      // 轮播图元素存在变化，进一步遍历判断是属于哪种变化
      if (JSON.stringify(this.banner.items) !== JSON.stringify(bannerItems)) {
        addBannerItems = this._processAddBannerItemsArray(bannerItems)
        editBannerItems = this._processEditBannerItemsArray(bannerItems)
        delBannerItems = this._processDelBannerItemsArray(bannerItems)
      }
      // 判断是否需要发起删除bannerItem
      if (delBannerItems.length > 0) {
        const ids = delBannerItems.map(item => item.id)
        await banner.delBannerItems(ids)
      }
      // 判断是否需要发起新增bannerItem
      if (addBannerItems.length > 0) {
        await banner.addBannerItems(addBannerItems)
      }
      // 判断是否需要发起更新bannerItem
      if (editBannerItems.length > 0) {
        await banner.editBannerItems(editBannerItems)
      }
    },

    // 待新增的bannerItem信息的私有加工函数
    _processAddBannerItemsArray(bannerItems) {
      // 如果轮播图元素的id是空的，代表是一个新增的轮播图元素，因为没有写入过数据库不会有id
      return bannerItems.filter(item => item.id === '')
    },
    _processEditBannerItemsArray(bannerItems) {
      const oriBannerItems = this.banner.items

      return bannerItems.filter(item => {
        const oriItem = oriBannerItems.find(i => i.id === item.id)
        if (typeof (oriItem) !== 'undefined') {
          return item.key_word !== oriItem.key_word || item.type !== oriItem.type || item.img_id !== oriItem.img_id
        }
        return false
      })
    },
    _processDelBannerItemsArray(bannerItems) {
      const oriBannerItems = this.banner.items
      return oriBannerItems.filter(oriItem => {
        const res = bannerItems.find(item => item.id === oriItem.id)
        return typeof (res) === 'undefined'
      })
    },

    // 返回按钮的点击事件
    handleBack() {
      this.$emit('back')
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
