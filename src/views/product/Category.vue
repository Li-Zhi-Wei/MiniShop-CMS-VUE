<template>
  <div class="lin-container">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">商品分类</div>
      </div>
      <div class="header-right">
        <el-button type="primary" v-auth="'添加商品分类'">新 增</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="categoryList">
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="120"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="主图">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.img.url">
          </template>
        </el-table-column>
        <el-table-column label="简介" prop="description"></el-table-column>
        <el-table-column label="操作" fixed="right" width="170">
          <!-- <el-table-column>标签支持在标签内嵌套一个<template>标签实现复杂的页面元素 -->
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)" v-auth="'编辑商品分类'">编 辑</el-button>
            <el-button plain size="mini" type="danger" @click="handleDel(scope.row.id)" v-auth="'删除商品分类'">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="showDialogDelete" width="30%" center>
      <span>确定删除id为{{id}}的分类？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="titel" :visible.sync="showDialogEdit">
      <el-form ref="form" :rules="rules" :model="temp" status-icon label-width="auto" @submit.native.prevent>
        <el-form-item label="名称" prop="name">
          <el-input size="medium" v-model="temp.name" placeholder="主题名称"/>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input size="medium" type="textarea" :rows="4" placeholder="可选，分类简介" v-model="temp.description"/>
        </el-form-item>
        <el-form-item label="图片" prop="img">
          <upload-imgs ref="uploadEle_top" :max-num="1" :value="temp.img" :auto-upload="false"
                       :remote-fuc="uploadImage"/>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import category from '@/models/category'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  name: 'Category',
  components: { UploadImgs },
  data() {
    return {
      categoryList: [],
      showDialogDelete: false,
      showDialogEdit: false,
      id: null,
      loading: true,
      temp: {
        id: null,
        name: null,
        description: null,
        img: [],
      }
    }
  },
  created() {
    this.getCategorys()
  },
  methods: {

    async getCategorys() {
      this.categoryList = await category.getCategorys()
      this.loading = false
    },

    handleDel(id) {
      this.id = id
      this.showDialogDelete = true
    },

    async deleteCategory() {
      this.showDialogDelete = false
      this.loading = true
      try {
        const res = await category.delCategoryByIds([this.id])
        this.getCategorys()
        this.loading = false
        this.$message({
          message: res.msg,
          type: 'success',
        })
      } catch (e) {
        this.loading = false
        this.$message({
          message: e.data.msg,
          type: 'error',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #dae1ed;

    .header-left .lin-title{
      border-bottom: none;
    }
    .header-right{
      padding-right: 30px;
      display: flex;
      align-items: center;
    }
  }
  .table-container{
    margin-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .img {
    height: 100px;
    width: auto;
  }
</style>
