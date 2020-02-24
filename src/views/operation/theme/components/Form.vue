<template>
  <div class="container">
    <div class="theme-box">
      <el-form ref="form" :rules="rules" :model="temp" status-icon label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="temp.name" placeholder="主题名称"/>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input size="medium" type="textarea" :rows="4" placeholder="可选，主题简介" v-model="temp.description"/>
        </el-form-item>
        <el-form-item label="主题图" prop="topic_img">
          <upload-imgs ref="uploadEle_top" :max-num="1" :value="temp.topic_img" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
        <el-form-item label="详情页头图" prop="head_img">
          <upload-imgs ref="uploadEle_head" :max-num="1" :value="temp.head_img" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="theme-product-box">
      <div class="theme-product-title">关联商品</div>
      <div class="theme-product-options">
        <el-button @click="handleAddProduct">编 辑</el-button>
      </div>
      <div class="theme-product-table">
        <el-table :data="temp.products">
          <el-table-column label="商品id" prop="id"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="submit-box">
      <el-button @click="resetForm">重 置</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </div>
    <el-dialog title="添加关联商品" :visible.sync="showDialog" width="50%">
      <el-transfer
          filterable
          filter-placeholder="输入商品名进行搜索"
          :titles="['商品库', '当前主题']"
          v-model="selectData"
          :data="allProducts">
      </el-transfer>
      <span slot="footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="changeSelectData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UploadImgs from '@/components/base/upload-imgs'
import Utils from '@/lin/utils/util'
import { customImageUpload } from '@/lin/utils/file'
import theme from '@/models/theme'
import product from '@/models/product'

export default {
  name: 'Form',
  components: { UploadImgs },
  props: {
    data: Object,
  },
  data() {
    return {
      temp: {
        id: null,
        name: null,
        description: null,
        topic_img: [],
        head_img: [],
        products: [],
      },
      initData: null, // 初始数据的深拷贝
      themeProductList: [], // 主题内关联商品
      showDialog: false, // 添加关联对话框
      selectData: [], // 穿梭框中已选关联商品
      allProducts: [], // 所有商品信息
      uploadImage: customImageUpload,
      rules: {
        name: [
          {
            required: true,
            message: '请输入主题名称',
            trigger: 'blur',
          },
        ],
        topic_img: [
          {
            required: true,
            message: '主题图不能为空',
            trigger: 'blur',
          },
        ],
        head_img: [
          {
            required: true,
            message: '详情页头图不能为空',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  async created() {
    if (this.data) {
      const res = await theme.getThemeDetail(this.data.id)
      this.temp = {
        id: res.id,
        name: res.name,
        description: res.description,
        topic_img: [{
          id: Utils.getRandomStr(),
          imgId: res.topic_img.id,
          display: res.topic_img.url,
        }],
        head_img: [{
          id: Utils.getRandomStr(),
          imgId: res.head_img.id,
          display: res.head_img.url,
        }],
        products: res.products.map(item => ({
          id: item.id,
          name: item.name
        })),
      }
      this.selectData = res.products.map(item => item.id)
      this.initData = JSON.parse(JSON.stringify(this.temp))
      this.$emit('get-detail', this.initData)
    }
  },
  methods: {
    /**
     * 添加关联商品按钮
     */
    async handleAddProduct() {
      this.showDialog = true
      const products = await product.getAllProducts()
      this.allProducts = products.map(item => ({
        key: item.id,
        label: item.name,
        disabled: item.status === 0,
      }))
    },
    /**
     * 确定添加关联商品
     */
    changeSelectData() {
      this.temp.products = this.selectData.map(item => ({
        id: item,
        name: this.allProducts.find(i => i.key === item).label
      }))
      this.showDialog = false
    },
    /**
     * 提交表单
     */
    async handleSubmit() {
      this.temp.topic_img = await this.$refs.uploadEle_top.getValue()
      this.temp.head_img = await this.$refs.uploadEle_head.getValue()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', this.temp)
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm() {
      // 因为数据要获取，所以组件加载时初始数据是空，调用表单的重置方法会重置为空
      this.temp = JSON.parse(JSON.stringify(this.initData))
      this.selectData = this.initData.products.map(item => item.id)
    },
  },
}
</script>

<style lang="scss" scoped>
  .theme-product-box{
    >div{
      margin-top: 20px;
    }
    .theme-product-title {
      color: $parent-title-color;
    }
    .theme-product-options{
    }
  }
  .submit-box{
    margin-top: 20px;
    margin-left: 280px;
  }
  /*对穿梭框样式定制（加长加宽选项换行）*/
  /deep/ .el-transfer-panel{
    width: 306px;
    height: 400px;
  }
  /deep/.el-transfer-panel__list.is-filterable{
    height: 297px;
  }
  /deep/.el-transfer-panel__item{
    display: block;
  }
  /*穿梭框定制结束*/

</style>
