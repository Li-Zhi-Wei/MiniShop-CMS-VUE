<template>
  <div class="lin-container" v-if="!switchComponent">
    <div class="header">
      <div class="header-left">
        <div class="lin-title">订单列表</div>
      </div>
      <div class="header-right">
        <div class="search-input">
          <el-input placeholder="订单号/收货人姓名" size="medium" v-model="input">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </div>
        <div class="date-picker">
          <el-date-picker
              v-model="date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="table-container">
      <el-table v-loading="loading" :data="orderList">
        <!-- label定义列头显示的文本，prop定义要渲染data数组中元素的哪个字段，width定义列宽 -->
        <el-table-column label="id" prop="id" width="80"></el-table-column>
        <el-table-column label="订单号" prop="order_no" width="160"></el-table-column>
        <el-table-column label="商品概要" prop="snap_name"></el-table-column>
        <el-table-column label="商品数量" prop="total_count" width="90"></el-table-column>
        <el-table-column label="订单金额" prop="total_price" width="90"></el-table-column>
        <el-table-column label="收货人" prop="snap_address.name" width="90"></el-table-column>
        <el-table-column label="联系方式" prop="snap_address.mobile" width="120"></el-table-column>
        <el-table-column label="订单状态" prop="status" width="90">
          <template slot-scope="scope">
            <el-tag type="danger" effect="dark" v-if="scope.row.status===1">未付款</el-tag>
            <el-tag type="warning" effect="dark" v-if="scope.row.status===2">已付款</el-tag>
            <el-tag type="success" v-if="scope.row.status===3">已发货</el-tag>
            <el-tag type="danger"  v-if="scope.row.status===4">超&emsp;卖</el-tag>
            <el-tag type="info" effect="dark" v-if="scope.row.status===5">已退款</el-tag>
            <el-tag type="success" effect="dark" v-if="scope.row.status===6">已收货</el-tag>
            <el-tag type="info" v-if="scope.row.status===7">已关闭</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="110"></el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <!-- <el-table-column>标签支持在标签内嵌套一个<template>标签实现复杂的页面元素 -->
          <template slot-scope="scope">
            <el-button plain size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" @current-change="handleCurrentChange" :current-page.sync="currentPage" layout="prev, pager, next, jumper" background :total="total_nums"></el-pagination>
    </div>
    <el-dialog title="提示" :visible.sync="showDialog" width="30%" center>
      <span>确定关闭id为{{id}}的订单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <component v-else :is="targetComponent" :data="data" @back="handleBack"/>
</template>

<script>
import order from '@/models/order'
import Detail from './Detail'

export default {
  name: 'List',
  components: { Detail },
  data() {
    return {
      orderList: [],
      showDialog: false,
      id: null, // 订单id
      loading: true, // 显示加载状态
      date: [],
      input: null,
      total_nums: 1,
      currentPage: 1,
      switchComponent: false, // 是否切换组件
      targetComponent: '', // 切换的目标组件
      data: null, // 点击详情时选择的数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
    }
  },
  // 生命周期钩子，在该组件被创建后触发
  created() {
    this.getOrder()
  },

  methods: {
    async getOrder() {
      this.loading = true
      const params = {
        start: this.date ? this.date[0] : null,
        end: this.date ? this.date[1] : null,
        input: this.input,
      }
      try {
        const res = await order.getOrdersPaginate(10, this.currentPage - 1, params)
        this.orderList = res.collection
        this.total_nums = res.total_nums
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message({
          message: e.data.msg,
          type: 'error',
        })
      }
    },

    handleDel(id) {
      this.id = id
      this.showDialog = true
    },

    changeDate() {
      this.getOrder()
    },

    handleCurrentChange() {
      this.getOrder()
    },

    search() {
      this.getOrder()
    },

    handleDetail(row) {
      this.data = row
      this.switchComponent = true
      this.targetComponent = 'Detail'
    },
    /**
     * 处理子组件里点击返回的事件
     */
    handleBack() {
      this.switchComponent = false
      this.targetComponent = ''
      this.getOrder()
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

      .date-picker{
        padding-left: 20px;
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
