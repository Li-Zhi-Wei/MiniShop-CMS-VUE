<template>
  <div class="container">
    <div class="header">
      <span>订单详情</span>
      <span class="back" @click="handleBack">
        <i class="iconfont icon-fanhui"/> 返回
      </span>
    </div>
    <el-divider/>
    <div class="form-container">
<!--      <el-row>-->
<!--        <el-col :lg="16" :md="20" :sm="24" :xs="24">-->
<!--          <Form :data="formData" @submit="handleSubmit" @get-detail="getDetail" :fullscreenLoading="fullscreenLoading"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>基础信息</span>
        </div>
        <el-form ref="form" label-width="100px" label-position="left" @submit.native.prevent>
          <el-form-item label="订单编号">
            <span>{{data.order_no}}</span>
          </el-form-item>
          <el-form-item label="商品数量">
            <span>{{data.total_count}}</span>
          </el-form-item>
          <el-form-item label="订单金额">
            <span>{{data.total_price}}</span>
          </el-form-item>
          <el-form-item label="订单邮费">
            <span>{{data.postage_price}}</span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span v-if="data.status===1">未付款</span>
            <span v-if="data.status===2">已付款</span>
            <span v-if="data.status===3">已发货</span>
            <span v-if="data.status===4">超&emsp;卖</span>
            <span v-if="data.status===5">已退款</span>
            <span v-if="data.status===6">已收货</span>
            <span v-if="data.status===7">已关闭</span>
          </el-form-item>
          <el-form-item label="下单时间">
            <span>{{data.create_time}}</span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>商品清单</span>
        </div>
        <div class="product" v-for="product in data.snap_items" :key="product.id">
          <div class="product-image">
            <img :src="product.img">
          </div>
          <div>
            <div style="margin-bottom: 10px;">名称：{{product.name}}</div>
            <div style="margin-bottom: 10px;">数量：{{product.counts}}</div>
            <div>金额：{{product.price}}</div>
          </div>
        </div>
      </el-card>
<!--      -->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>支付详情</span>
        </div>
        <div v-if="orderStatus === null">获取中...</div>
        <div v-else-if="orderStatus === 0">暂无支付信息</div>
        <el-form v-else label-width="120px" label-position="left" @submit.native.prevent>
          <el-form-item label="交易状态">
            <span>{{orderStatus.trade_state}}</span>
          </el-form-item>
          <el-form-item label="交易状态描述">
            <span>{{orderStatus.trade_state_desc}}</span>
          </el-form-item>
          <el-form-item label="商户订单号">
            <span>{{orderStatus.out_trade_no}}</span>
          </el-form-item>
          <el-form-item v-if="orderStatus.transaction_id" label="微信交易单号">
            <span>{{orderStatus.transaction_id}}</span>
          </el-form-item>
          <el-form-item label="订单总金额">
            <span>{{orderStatus.total_fee}}</span>
          </el-form-item>
          <el-form-item v-if="orderStatus.cash_fee" label="支付金额">
            <span>{{orderStatus.cash_fee}}</span>
          </el-form-item>
          <el-form-item v-if="orderStatus.time_end" label="支付时间">
            <span>{{orderStatus.time_end}}</span>
          </el-form-item>
          <el-form-item v-if="orderStatus.is_subscribe" label="是否关注公众号">
            <span>{{orderStatus.is_subscribe}}</span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card v-if="data.status === 5" style="margin-bottom: 50px;">
        <div slot="header">
          <span>退款详情</span>
        </div>
        <div v-if="orderRefund === null">获取中...</div>
        <div v-else-if="orderRefund === 0">查询失败，请刷新重试</div>
        <el-form v-else label-width="120px" label-position="left" @submit.native.prevent>
          <el-form-item v-if="orderRefund.result_code" label="退款状态">
            <span>{{orderRefund.result_code}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.total_fee" label="订单总金额">
            <span>{{orderRefund.total_fee}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.cash_fee" label="用户支付金额">
            <span>{{orderRefund.cash_fee}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.refund_fee" label="退款总金额">
            <span>{{orderRefund.refund_fee}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.refund_count" label="退款次数">
            <span>{{orderRefund.refund_count}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.refund_fee_detail" label="退款详情">
            <div v-for="(item, index) in orderRefund.refund_fee_detail" :key="index" >
              <span>金额：{{item.refund_fee}}</span>&emsp;&emsp;&emsp;
              <span>时间：{{item.refund_success_time}}</span>
            </div>
          </el-form-item>
          <el-form-item v-if="orderRefund.err_code" label="错误码">
            <span>{{orderRefund.err_code}}</span>
          </el-form-item>
          <el-form-item v-if="orderRefund.err_code_des" label="描述">
            <span>{{orderRefund.err_code_des}}</span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>收货人信息</span>
        </div>
        <el-form ref="form" label-width="100px" label-position="left" @submit.native.prevent>
          <el-form-item label="收货人">
            <span>{{data.snap_address.name}}</span>
          </el-form-item>
          <el-form-item label="联系方式">
            <span>{{data.snap_address.mobile}}</span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span>{{data.snap_address.province}}{{data.snap_address.city}}{{data.snap_address.country}}{{data.snap_address.detail}}</span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card v-if="data.status!==7">
        <div slot="header">
          <span>操作</span>
        </div>
        <div>
          <el-button plain type="success" @click="showDialogDeliver = true" v-auth="'订单发货'" v-if="data.status===2||data.status===4">发货</el-button>
          <el-button plain type="danger" @click="handleDel()" v-auth="'关闭订单'" v-if="data.status===1">关闭</el-button>
          <el-button plain type="danger" @click="handleDel()" v-auth="'关闭订单'" v-if="data.status===1">修改状态为已支付</el-button>
          <el-button plain type="danger" @click="handleDel()" v-auth="'订单退款'" v-if="data.status===2||data.status===3||data.status===4||data.status===5||data.status===6">退款</el-button>
        </div>
      </el-card>
<!--      <el-card>-->
<!--        <div slot="header">-->
<!--          <span>物流信息</span>-->
<!--        </div>-->
<!--        <div></div>-->
<!--      </el-card>-->
    </div>
    <!-- 订单发货 -->
    <el-dialog title="登记发货信息" :visible.sync="showDialogDeliver">
      <el-form :model="deliverData" status-icon label-width="80px" @submit.native.prevent>
        <el-form-item label="快递公司" prop="comp">
          <el-select v-model="deliverData.comp" clearable placeholder="必选">
            <el-option v-for="item in compList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号" prop="number">
          <el-input size="medium" v-model="deliverData.number" placeholder="必填"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showDialogDeliver = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitDeliver">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import order from '@/models/order'

export default {
  name: 'Detail',
  props: {
    data: Object,
  },
  data() {
    return {
      orderStatus: null, // 支付状态
      orderRefund: null, // 退款状态
      showDialogDeliver: false,
      deliverData: {
        comp: null,
        number: null
      }, // 发货信息
      compList: [
        { label: '韵达', value: 'yd' },
        { label: '顺丰', value: 'sf' },
        { label: '申通', value: 'sto' },
        { label: '圆通', value: 'yt' },
        { label: '天天', value: 'tt' },
        { label: 'EMS', value: 'ems' },
        { label: '中通', value: 'zto' },
        { label: '汇通', value: 'ht' },
        { label: '邮政', value: 'youzheng' },
        { label: '百世', value: 'bsky' },
        { label: '京东', value: 'jd' },
        { label: '德邦', value: 'db' },
        { label: '宅急送', value: 'zjs' },
        { label: '国通', value: 'gt' },
        { label: '全峰', value: 'qf' },
        { label: '如风达', value: 'rfd' },
      ],
    }
  },
  async created() {
    try {
      this.orderStatus = await order.getPayStatus(this.data.order_no)
      const time = this.orderStatus.time_end
      if (time) {
        this.orderStatus.time_end = `${time.substr(0, 4)}-${time.substr(4, 2)}-${time.substr(6, 2)} ${time.substr(8, 2)}:${time.substr(10, 2)}:${time.substr(12, 2)}`
      }
      if (this.orderStatus.is_subscribe) {
        if (this.orderStatus.is_subscribe === 'Y') {
          this.orderStatus.is_subscribe = '是'
        }
        if (this.orderStatus.is_subscribe === 'N') {
          this.orderStatus.is_subscribe = '否'
        }
      }
    } catch (e) {
      this.orderStatus = 0
      this.$notify.warning({
        message: e.data.msg,
        title: '提示',
      })
    }
    if (this.data.status === 5) {
      try {
        this.orderRefund = await order.getRefundStatus(this.data.order_no)
      } catch (e) {
        this.orderRefund = 0
        this.$notify.warning({
          message: e.data.msg,
          title: '提示',
        })
      }
    }
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },
  }
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
      padding: 40px;
    }
  }

  .product{
    display: flex;
    -webkit-box-align: center;
    -moz-box-align: center;
    border-bottom: 1px solid #edf1f7;
    align-items: center;
    .product-image{
      width: 120px;
      img{
        display: block;
        width: 100%;
        height: auto;
      }
    }
  }
</style>
