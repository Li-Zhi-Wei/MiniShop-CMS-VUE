<template>
  <div class="lin-container">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">发货记录</div>
      </div>
      <div class="header-right">
        <div class="search-input">
          <el-input placeholder="请输入内容" size="medium" v-model="input">
            <el-select class="select" size="medium" slot="prepend" placeholder="请选择" v-model="select">
              <el-option label="订单号" value="order_no"></el-option>
              <el-option label="快递单号" value="number"></el-option>
              <el-option label="发货人" value="operator"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="logisticsList">
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="50"></el-table-column>
        <el-table-column label="订单号" prop="order_no"></el-table-column>
        <el-table-column label="快递公司" prop="comp"></el-table-column>
        <el-table-column label="快递单号" prop="number"></el-table-column>
        <el-table-column label="发货人" prop="operator"></el-table-column>
        <el-table-column label="发货时间" prop="create_time"></el-table-column>
      </el-table>
      <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next, jumper" background :total="total_nums"></el-pagination>
    </div>
  </div>
</template>

<script>
import logistics from '@/models/logistics'

export default {
  name: 'List',
  data() {
    return {
      logisticsList: [],
      loading: true, // 显示加载状态
      input: null,
      select: null,
      total_nums: 1,
      currentPage: 1,
    }
  },
  // 生命周期钩子，在该组件被创建后触发
  created() {
    this.getLogistics()
  },

  methods: {
    async getLogistics() {
      this.loading = true
      const params = {
        select: this.select,
        input: this.input,
      }
      try {
        const res = await logistics.getLogistics(10, this.currentPage - 1, params)
        this.logisticsList = res.collection
        this.total_nums = res.total_nums
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message({
          message: e.data.msg,
          type: 'error',
        })
      }
      this.loading = false
    },

    handleCurrentChange() {
      this.getLogistics()
    },

    search() {
      this.getLogistics()
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

      .select{
        width: 110px;
      }
    }
  }
  .table-container{
    margin-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
  }
  .pagination{
    margin: 20px;
    justify-content: flex-end;
    display: flex;
  }
</style>
