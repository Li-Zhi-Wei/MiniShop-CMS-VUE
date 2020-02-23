<template>
  <div class="lin-container">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">商品列表</div>
      </div>
      <div class="header-right">
        <el-button type="primary">新 增</el-button>
        <el-input class="input" placeholder="搜索商品名" size="medium" v-model="input">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="productList">
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="50"></el-table-column>
        <el-table-column label="主图">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.main_img_url">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="分类" prop="category.name"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="划线价" prop="show_price"></el-table-column>
        <el-table-column label="库存">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.stock">有&#12288;货</el-tag>
            <el-tag type="info" v-if="!scope.row.stock">无&#12288;货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status">上架中</el-tag>
            <el-tag type="info" v-if="!scope.row.status">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="邮费" prop="postage"></el-table-column>
        <el-table-column label="销量" prop="sale"></el-table-column>
        <el-table-column label="摘要" prop="summary"></el-table-column>
        <el-table-column label="操作" fixed="right" width="210">
          <!-- <el-table-column>标签支持在标签内嵌套一个<template>标签实现复杂的页面元素 -->
          <template slot-scope="scope">
            <el-button plain size="mini" type="warning" @click="handleModifyStatus(scope.row.id)" v-if="scope.row.status" v-auth="'商品上架/下架'">下 架</el-button>
            <el-button plain size="mini" type="success" @click="handleModifyStatus(scope.row.id)" v-if="!scope.row.status" v-auth="'商品上架/下架'">上 架</el-button>
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)" v-auth="'编辑商品'">编 辑</el-button>
            <el-button plain size="mini" type="danger" @click="handleDel(scope.row.id)" v-auth="'删除商品'">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next, jumper" background :total="total_nums"></el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="showDialog" width="30%" center>
      <span>确定删除id为{{id}}的商品？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import product from '@/models/product'

export default {
  name: 'List',
  data() {
    return {
      productList: [],
      showDialog: false,
      id: null, // product id
      loading: true, // 显示加载状态
      total_nums: null,
      currentPage: 1,
      input: null
    }
  },
  created() {
    this.getProducts()
  },
  methods: {

    async getProducts() {
      this.loading = true
      const params = {
        count: 10,
        page: this.currentPage - 1,
        product_name: this.input
      }
      const res = await product.getProductsPaginate(params)
      this.productList = res.collection
      this.total_nums = res.total_nums
      this.loading = false
    },

    // 翻页
    handleCurrentChange() {
      this.getProducts()
    },

    search() {
      this.getProducts()
    },

    handleDel(id) {
      this.id = id
      this.showDialog = true
    },

    // 执行删除轮播图请求
    async deleteProduct() {
      this.showDialog = false
      this.loading = true
      try {
        const res = await product.delProductByIds([this.id])
        this.getProducts()
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

    // 上架/下架操作
    async handleModifyStatus(id) {
      this.loading = true
      try {
        const res = await product.modifyStatus(id)
        this.getProducts()
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

      .input{
        width: 200px;
        padding-left: 20px;
      }
    }
  }

  .table-container{
    margin-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .img {
    /*margin: 10px;*/
    height: 100px;
    max-width:150px;
    width: auto;
  }
  .pagination{
    margin: 20px;
    justify-content: flex-end;
    display: flex;
  }

</style>
