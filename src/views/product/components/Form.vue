<template>
  <div class="container" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="product-box">
      <el-form ref="form" :rules="rules" :model="temp" status-icon label-width="100px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="temp.name" placeholder="商品名称"/>
        </el-form-item>
        <el-form-item label="简介" prop="summary">
          <el-input size="medium" v-model="temp.summary" placeholder="可选，商品简介" type="textarea" :autosize="{minRows:2}"/>
        </el-form-item>
        <el-form-item label="展示价格" prop="price">
          <el-input size="medium" v-model="temp.price" placeholder="展示价格，非真实购买价格"/>
        </el-form-item>
        <el-form-item label="划线价格" prop="show_price">
          <el-input size="medium" v-model="temp.show_price" placeholder="划线价格"/>
        </el-form-item>
        <el-form-item label="展示的销量" prop="sale">
          <el-input size="medium" v-model="temp.sale" placeholder="展示的销量，会随着购买自动增加"/>
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
        <el-form-item label="所属分类" prop="category_id">
          <el-select v-model="temp.category_id" clearable placeholder="可以为空">
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主图" prop="main_img_url">
          <upload-imgs ref="uploadEleMain" :max-num="1" :value="mainImg" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
        <el-form-item label="详情图" prop="image">
          <upload-imgs ref="uploadEleDetail" :value="detailImg" :auto-upload="false" sortable multiple
                       :remote-fuc="uploadImage"/>
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <div class="title">套 餐</div>
      <div class="sku-options">
        <el-button @click="handleAddSku">新 增</el-button>
      </div>
      <div class="sku-table">
        <el-table :data="temp.sku">
          <el-table-column label="图片">
            <template slot-scope="scope">
              <img class="img" :src="scope.row.img.url">
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="库存" prop="stock"></el-table-column>
          <el-table-column label="销量" prop="name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status">上架中</el-tag>
              <el-tag type="info" v-if="!scope.row.status">已下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="运费" prop="postage"></el-table-column>
          <el-table-column label="操作" fixed="right" width="170">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" @click="handleEditSku(scope.row)">编 辑</el-button>
              <el-button plain size="mini" type="danger" @click="handleDelSku(scope)">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="box">
      <div class="title">参 数</div>
      <div class="property-options">
        <el-button @click="handleAddProperty">新 增</el-button>
      </div>
      <div class="property-table">
        <el-table :data="temp.property">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="内容" prop="detail"></el-table-column>
          <el-table-column label="操作" fixed="right" width="170">
            <template slot-scope="scope">
              <el-button plain size="mini" type="primary" @click="handleEditProperty(scope.row)">编 辑</el-button>
              <el-button plain size="mini" type="danger" @click="handleDelProperty(scope)">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="submit-box">
      <el-button @click="resetForm">重 置</el-button>
      <el-button type="primary" @click="showDialogSubmit = true">保 存</el-button>
    </div>
<!--    添加/编辑sku-->
    <el-dialog :title="title" :visible.sync="showDialogSku">
      <el-form ref="skuForm" :rules="skuRules" :model="skuTemp" status-icon label-width="80px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input class="sku-input" size="medium" v-model="skuTemp.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input class="sku-input" size="medium" v-model="skuTemp.price" placeholder="价格"/>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input class="sku-input" size="medium" v-model="skuTemp.stock" placeholder="库存数量"/>
        </el-form-item>
        <el-form-item label="运费" prop="postage">
          <el-input class="sku-input" size="medium" v-model="skuTemp.postage" placeholder="运费"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="skuTemp.status" active-color="#00C292" active-text="上 架" inactive-text="下 架" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <upload-imgs ref="uploadEleSku" :max-num="1" :value="skuImg" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showDialogSku = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSku">确 定</el-button>
      </span>
    </el-dialog>
<!--    添加/编辑Property-->
    <el-dialog :title="title" :visible.sync="showDialogProperty">
      <el-form ref="propertyForm" :rules="propertyRules" :model="propertyTemp" status-icon label-width="80px" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input class="property-input" size="medium" v-model="propertyTemp.name" placeholder="名称"/>
        </el-form-item>
        <el-form-item label="内容" prop="detail">
          <el-input class="property-input" size="medium" v-model="propertyTemp.detail" placeholder="内容" type="textarea" :autosize="{minRows:2}"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showDialogProperty = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProperty">确 定</el-button>
      </span>
    </el-dialog>
<!--    删除sku的提示-->
    <el-dialog title="提示" :visible.sync="showDialogDelSku" width="30%" center>
      <span>确定删除&emsp;<span class="danger-span">{{delItem.name}}</span>&emsp;？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelSku = false">取 消</el-button>
        <el-button type="primary" @click="deleteSku">确 定</el-button>
      </span>
    </el-dialog>
<!--    删除property的提示-->
    <el-dialog title="提示" :visible.sync="showDialogDelProperty" width="30%" center>
      <span>确定删除&emsp;<span class="danger-span">{{delItem.name}}</span>&emsp;？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelProperty = false">取 消</el-button>
        <el-button type="primary" @click="deleteProperty">确 定</el-button>
      </span>
    </el-dialog>
<!--    提交的提示-->
    <el-dialog title="提示" :visible.sync="showDialogSubmit" width="30%" center>
      <span>确定提交？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogSubmit = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
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
    fullscreenLoading: Boolean,
  },
  data() {
    return {
      temp: { // 基础数据
        id: null,
        name: null,
        price: null,
        stock: 1,
        category_id: null,
        main_img_url: null,
        img_id: null,
        status: 1,
        summary: null,
        postage: 0,
        sale: null,
        show_price: null,
        image: [],
        property: [],
        sku: [],
      },
      skuTemp: { // sku数据
        id: null,
        name: null,
        price: null,
        stock: null,
        status: 1,
        postage: null,
        img: {},
      },
      propertyTemp: { // 属性数据
        id: null,
        name: null,
        detail: null,
      },
      mainImg: [], // 主图，用来更新 main_img_url, img_id
      detailImg: [], // 详情图，用来更新image
      skuImg: [], // sku图片，用来更新sku.img
      uploadImage: customImageUpload,
      showDialogProperty: false,
      showDialogSku: false,
      categoryList: null, // 分类列表
      title: null, // 弹出框标题
      delItem: {}, // 删除sku/property时选择的数据
      showDialogDelSku: false,
      showDialogDelProperty: false,
      showDialogSubmit: false,
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '展示价格不能为空', trigger: 'blur' },
        ],
        show_price: [
          { required: true, message: '划线价格不能为空', trigger: 'blur' },
        ],
        sale: [
          { required: true, message: '销量不能为空', trigger: 'blur' },
        ],
        main_img_url: [
          { required: true, message: '主图不能为空', trigger: 'blur' },
        ],
        image: [
          { required: true, message: '详情图不能为空', trigger: 'blur' }
        ],
      },
      skuRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' },
        ],
        stock: [
          { required: true, message: '库存不能为空', trigger: 'blur' },
        ],
        postage: [
          { required: true, message: '运费不能为空', trigger: 'blur' },
        ],
        img: [
          { required: true, message: '图片不能为空', trigger: 'blur' },
        ],
      },
      propertyRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
        ],
        detail: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.temp = this.data ? JSON.parse(JSON.stringify(this.data)) : this.temp
    this.categoryList = await category.getCategorys()
    if (this.data) {
      this.mainImg = [{
        id: Utils.getRandomStr(),
        imgId: this.data.img_id,
        display: this.data.main_img_url,
      }]
      this.detailImg = this.data.image.map(item => ({
        id: item.id, // 此处id为product_image表的主键
        imgId: item.img_id,
        display: item.img.url,
      }))
    }
  },
  methods: {
    /**
     * 新增sku
     */
    handleAddSku() {
      this.skuTemp = {
        id: null,
        name: null,
        price: null,
        stock: null,
        status: 1,
        postage: null,
        img: [],
      }
      this.title = '新增套餐'
      if (this.$refs.uploadEleSku) {
        this.$refs.uploadEleSku.clear()
      }
      this.showDialogSku = true
    },
    /**
     * 编辑sku
     * @param row
     */
    handleEditSku(row) {
      this.skuTemp = JSON.parse(JSON.stringify(row))
      this.skuImg = [{
        id: Utils.getRandomStr(),
        imgId: row.img_id,
        display: row.img.url,
      }]
      this.title = '编辑套餐'
      this.showDialogSku = true
    },
    /**
     * 删除sku
     * @param row
     */
    handleDelSku(scope) {
      this.delItem = scope.row
      this.delItem.index = scope.$index
      this.showDialogDelSku = true
    },
    deleteSku() {
      this.temp.sku.splice(this.delItem.index, 1)
      this.showDialogDelSku = false
    },
    /**
     * 新增/编辑sku对话框提交
     * @returns {Promise<void>}
     */
    async handleSubmitSku() {
      const img = await this.$refs.uploadEleSku.getValue()
      if (img.length > 0) {
        this.skuTemp.img = {
          id: img[0].imgId,
          url: img[0].display,
        }
      }
      this.skuTemp.price = parseFloat(this.skuTemp.price) || null
      this.skuTemp.postage = parseFloat(this.skuTemp.postage) || null
      this.skuTemp.stock = parseInt(this.skuTemp.stock, 10) || null
      this.$refs.skuForm.validate(valid => {
        if (valid) {
          if (this.title === '编辑套餐') {
            this.temp.sku.forEach((item, index) => {
              if (item.id === this.skuTemp.id) {
                this.temp.sku.splice(index, 1, JSON.parse(JSON.stringify(this.skuTemp)))
              }
            })
          } else {
            this.temp.sku.push(JSON.parse(JSON.stringify(this.skuTemp)))
          }
          this.showDialogSku = false
        }
      })
    },
    /**
     * 新增参数
     */
    handleAddProperty() {
      this.propertyTemp = {
        id: null,
        name: null,
        detail: null,
      }
      this.title = '新增参数'
      this.showDialogProperty = true
    },
    /**
     * 编辑参数
     * @param row
     */
    handleEditProperty(row) {
      this.propertyTemp = JSON.parse(JSON.stringify(row))
      this.title = '编辑参数'
      this.showDialogProperty = true
    },
    /**
     * 删除参数
     * @param row
     */
    handleDelProperty(scope) {
      this.delItem = scope.row
      this.delItem.index = scope.$index
      this.showDialogDelProperty = true
    },
    deleteProperty() {
      this.temp.property.splice(this.delItem.index, 1)
      this.showDialogDelProperty = false
    },
    /**
     * 新增/编辑参数对话框提交
     */
    handleSubmitProperty() {
      this.$refs.propertyForm.validate(valid => {
        if (valid) {
          if (this.title === '编辑参数') {
            this.temp.property.forEach((item, index) => {
              if (item.id === this.propertyTemp.id) {
                this.temp.property.splice(index, 1, JSON.parse(JSON.stringify(this.propertyTemp)))
              }
            })
          } else {
            this.temp.property.push(JSON.parse(JSON.stringify(this.propertyTemp)))
          }
          this.showDialogProperty = false
        }
      })
    },
    /**
     * 提交Form
     * @returns {Promise<void>}
     */
    async handleSubmit() {
      this.showDialogSubmit = false
      const mainImg = await this.$refs.uploadEleMain.getValue()
      this.temp.image = await this.$refs.uploadEleDetail.getValue()
      if (mainImg.length > 0) {
        this.temp.main_img_url = mainImg[0].display
        this.temp.img_id = mainImg[0].imgId
      }
      this.temp.price = parseFloat(this.temp.price) || null
      this.temp.show_price = parseFloat(this.temp.show_price) || null
      this.temp.sale = parseInt(this.temp.sale, 10) || null
      if (this.temp.sku.length === 0) {
        this.$message.error('最少添加1个套餐')
        return
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit', JSON.parse(JSON.stringify(this.temp)))
        }
      })
    },
    /**
     * 重置Form
     */
    resetForm() {
      this.$refs.form.resetFields()
      this.temp.sku = this.data ? JSON.parse(JSON.stringify(this.data.sku)) : []
      this.temp.property = this.data ? JSON.parse(JSON.stringify(this.data.property)) : []
      this.$refs.uploadEleMain.reset()
      this.$refs.uploadEleDetail.reset()
    }
  },
}
</script>

<style lang="scss" scoped>
  .box{
    >div{
      margin-top: 20px;
    }
    .title {
      color: $parent-title-color;
    }
  }
  .sku-input{
    width: 400px;
  }
  .property-input{
    width: 400px;
  }
  .submit-box{
    margin-top: 20px;
    margin-left: 280px;
  }
  .danger-span{
    color: red;
  }
</style>
