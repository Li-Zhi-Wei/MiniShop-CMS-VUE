<template>
  <div class="lin-container" v-if="!switchComponent">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">主题列表</div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd" v-auth="'新增主题'">新 增</el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="themeList">
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="120"></el-table-column>
        <el-table-column label="主题名称" prop="name"></el-table-column>
        <el-table-column label="主题描述" prop="description"></el-table-column>
        <el-table-column label="主题图片">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.topic_img.url">
          </template>
        </el-table-column>
        <el-table-column label="主题详情头图">
          <template slot-scope="scope">
            <img class="img" :src="scope.row.head_img.url">
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="170">
          <!-- <el-table-column>标签支持在标签内嵌套一个<template>标签实现复杂的页面元素 -->
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)" v-auth="'编辑主题'">编 辑</el-button>
            <el-button plain size="mini" type="danger" @click="handleDel(scope.row.id)" v-auth="'删除主题'">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="提示" :visible.sync="showDialog" width="30%" center>
      <span>确定删除id为{{id}}的主题？</span>
      <span slot="footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteTheme">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <component v-else :is="targetComponent" :row="row" @back="handleBack"/>
</template>

<script>
import theme from '@/models/theme'
import Add from './Add'
import Edit from './Edit'

export default {
  name: 'List',
  // 组件的数据对象
  data() {
    return {
      themeList: [],
      showDialog: false,
      id: null, // 主题id
      loading: true, // 显示加载状态
      switchComponent: false, // 是否切换组件
      targetComponent: '', // 切换的目标组件
      row: null, // 点击的行数据
    }
  },
  components: { Add, Edit },
  // 生命周期钩子，在该组件被创建后触发
  created() {
    this.getThemes()
  },

  methods: {
    // 获取所有主题数据
    async getThemes() {
      this.loading = true
      this.themeList = await theme.getThemes()
      this.loading = false
    },

    // 删除按钮的点击事件
    handleDel(id) {
      this.id = id
      this.showDialog = true
    },

    // 执行删除轮播图请求
    async deleteTheme() {
      this.showDialog = false
      this.loading = true
      try {
        const res = await theme.delThemeByIds([this.id])
        this.getThemes()
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
      this.getThemes()
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
    height: 120px;
    width: auto;
  }

</style>
