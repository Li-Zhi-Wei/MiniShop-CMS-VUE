<template>
  <div class="lin-container" v-if="!switchComponent">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">轮播图列表</div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd" v-auth="'新增轮播图'">新 增</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="bannerList">
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="expand-container">
              <div v-for="(img,index) in scope.row.items" :key="index">
                <img class="img" :src="img.img.url">
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="120"></el-table-column>
        <el-table-column label="轮播图名称" prop="name"></el-table-column>
        <el-table-column label="轮播图简介" prop="description"></el-table-column>
        <el-table-column label="操作" fixed="right" width="170">
          <!-- <el-table-column>标签支持在标签内嵌套一个<template>标签实现复杂的页面元素 -->
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)" v-auth="'编辑轮播图'">编 辑</el-button>
            <el-button plain size="mini" type="danger" @click="handleDel(scope.row.id)" v-auth="'删除轮播图'">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="showDialog" width="30%" center>
      <span>确定删除id为{{id}}的轮播图？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteBanner">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <component v-else :is="targetComponent" :row="row" @back="handleBack"/>
</template>

<script>
import banner from '@/models/banner' // 简写
// import banner from '../../../models/banner'
import Add from './Add'
import Edit from './Edit'

export default {
  name: 'List',
  // 组件的数据对象
  data() {
    return {
      bannerList: [],
      showDialog: false,
      id: null, // 轮播图id
      loading: true, // 显示加载状态
      switchComponent: false, // 是否切换组件
      targetComponent: '', // 切换的目标组件
      row: null, // 点击的行数据
    }
  },
  // 注册组件
  components: { Add, Edit },
  // 生命周期钩子，在该组件被创建后触发，执行该函数内的逻辑
  created() {
    // 当组件被创建时，调用组件内的getBanners()方法
    this.getBanners()
  },
  // 组件的选项之一，用于定义该组件所拥有的方法
  methods: {

    // 获取所有轮播图数据
    async getBanners() {
      // 调用banner模型类下的方法，并将结果赋值给组件的数据对象实现数据绑定并响应渲染到页面上
      this.bannerList = await banner.getBanners()
      this.loading = false
    },

    // 删除按钮的点击事件
    handleDel(id) {
      // 数据绑定，用于显示对话框内容
      this.id = id
      // 数据绑定，显示对话框
      this.showDialog = true
    },

    // 执行删除轮播图请求
    async deleteBanner() {
      // 关闭对话框
      this.showDialog = false
      // 显示加载状态
      this.loading = true
      try {
        // 调用模型方法删除轮播图
        const res = await banner.delBannerByIds([this.id])
        // 再次调用获取所有轮播图的方法
        this.getBanners()
        // 关闭加载状态
        this.loading = false
        // 消息提示
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

    /**
     * 新增按钮点击事件
     */
    handleAdd() {
      this.switchComponent = true
      this.targetComponent = 'Add'
    },
    /**
     *  编辑按钮点击事件
     */
    handleEdit(row) {
      this.switchComponent = true
      this.targetComponent = 'Edit'
      this.row = row
    },
    /**
     * 处理子组件里点击返回的事件
     */
    handleBack() {
      this.switchComponent = false
      this.targetComponent = ''
      this.getBanners()
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
  .expand-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .img {
      margin: 10px;
      width: auto;
      height: 100px;
    }
  }
</style>
