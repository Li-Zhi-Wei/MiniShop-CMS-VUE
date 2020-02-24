<template>
  <div class="container">
    <div class="product-box">
      <el-form ref="form" :rules="rules" :model="temp" status-icon label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="temp.name" placeholder="商品名称"/>
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input size="medium" v-model="temp.summary" placeholder="商品简介" type="textarea" :autosize="{minRows:2}"/>
        </el-form-item>
        <el-form-item label="展示价格" prop="price">
          <el-input size="medium" v-model="temp.price" placeholder="展示价格"/>
        </el-form-item>
        <el-form-item label="划线价格" prop="show_price">
          <el-input size="medium" v-model="temp.show_price" placeholder="划线价格"/>
        </el-form-item>
        <el-form-item label="展示的销量" prop="sale">
          <el-input size="medium" v-model="temp.sale" placeholder="划线价格"/>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-switch v-model="temp.stock" active-color="#00C292" active-text="有 货" inactive-text="无 货" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" active-color="#00C292" active-text="上 架" inactive-text="下 架" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="包邮标签" prop="postage">
          <el-switch v-model="temp.postage" active-color="#00C292" active-text="显示包邮标签" inactive-text="不显示" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select v-model="temp.category_id" clearable placeholder="请选择">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主图" prop="main_img">
          <upload-imgs ref="uploadEle_main" :max-num="1" :value="temp.main_img" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
        <el-form-item label="详情图" prop="detail_img">
          <upload-imgs ref="uploadEle_detail" :max-num="1" :value="temp.detail_img" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="sku-box">
      <div class="sku-title">套 餐</div>
      <div class="sku-options">
        <el-button @click="handleAddProduct">编 辑</el-button>
      </div>
      <div class="sku-table">
        <el-table :data="temp.products">
          <el-table-column label="图片" prop="img"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="库存" prop="stock"></el-table-column>
          <el-table-column label="销量" prop="name"></el-table-column>
          <el-table-column label="状态" prop="status"></el-table-column>
          <el-table-column label="运费" prop="postage"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="property-box">
      <div class="property-title">规格参数</div>
      <div class="property-options">
        <el-button @click="handleAddProduct">编 辑</el-button>
      </div>
      <div class="sku-table">
        <el-table :data="temp.products">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="内容" prop="detail"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="submit-box">
      <el-button @click="resetForm">重 置</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </div>
<!--    <el-dialog title="添加关联商品" :visible.sync="showDialog" width="50%">-->
<!--      <el-transfer-->
<!--          filterable-->
<!--          filter-placeholder="输入商品名进行搜索"-->
<!--          :titles="['商品库', '当前主题']"-->
<!--          v-model="selectData"-->
<!--          :data="allProducts">-->
<!--      </el-transfer>-->
<!--      <span slot="footer">-->
<!--        <el-button @click="showDialog = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="changeSelectData">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import UploadImgs from '@/components/base/upload-imgs'
import Utils from '@/lin/utils/util'
import { customImageUpload } from '@/lin/utils/file'
import category from '@/models/category'

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
        price: null,
        stock: null,
        category_id: null,
        main_img_url: null,
        status: null,
        summary: null,
        img_id: null,
        postage: null,
        sale: null,
        show_price: null,
        image: [],
        property: [],
        sku: [],
        main_img: [], // 主图，用来更新 main_img_url, img_id
        detail_img: [], // 详情图，用来更新image
      },
      uploadImage: customImageUpload,
      categoryList: null, // 分类列表
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
    this.temp = this.data || this.temp
    this.categoryList = await category.getCategorys()
  },
}
</script>

<style lang="scss" scoped>
  /*
  .theme-product-box{
    >div{
      margin-top: 20px;
    }
    .theme-product-box-title {
      color: $parent-title-color;
    }
    .theme-product-options{
    }
  }*/
  /*.submit-box{*/
  /*  margin-top: 20px;*/
  /*  margin-left: 280px;*/
  /*}*/
</style>
