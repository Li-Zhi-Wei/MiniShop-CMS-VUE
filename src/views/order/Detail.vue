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
            <span></span>
          </el-form-item>
          <el-form-item label="商品数量">
            <span></span>
          </el-form-item>
          <el-form-item label="订单金额">
            <span></span>
          </el-form-item>
          <el-form-item label="订单状态">
            <span></span>
          </el-form-item>
          <el-form-item label="下单时间">
            <span></span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>商品清单</span>
        </div>
        <div>product</div>
      </el-card>
<!--      -->
      <el-card style="margin-bottom: 50px;">
        <div slot="header">
          <span>支付详情</span>
        </div>
        <el-form ref="form" label-width="120px" label-position="left" @submit.native.prevent>
          <el-form-item label="支付状态">
            <span></span>
          </el-form-item>
          <el-form-item label="商户订单号">
            <span></span>
          </el-form-item>
          <el-form-item label="微信交易单号">
            <span></span>
          </el-form-item>
          <el-form-item label="订单总金额">
            <span></span>
          </el-form-item>
          <el-form-item label="支付金额">
            <span></span>
          </el-form-item>
          <el-form-item label="支付时间">
            <span></span>
          </el-form-item>
          <el-form-item label="是否关注公众号">
            <span></span>
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
            <span></span>
          </el-form-item>
          <el-form-item label="联系方式">
            <span></span>
          </el-form-item>
          <el-form-item label="收货地址">
            <span></span>
          </el-form-item>
        </el-form>
      </el-card>
<!--      -->
      <el-card>
        <div slot="header">
          <span>物流信息</span>
        </div>
        <div></div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
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
</style>
