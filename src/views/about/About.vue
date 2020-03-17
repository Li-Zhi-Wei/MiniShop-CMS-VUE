<template>
  <div class="container">
    <div class="lin-info">
      <div class="lin-info-left">
        <div class="welcome">
          <div class="welcome-title">欢迎来到厚德云创商城管理后台</div>
<!--          <img src="../../assets/img/about/welcome.png" class="welcome-title" alt="" />-->
<!--          <div class="subtitle">-->
<!--            <div class="guide">您还可以点击林间有风官方网站，查看更多作品</div>-->
<!--            <div class="link"><a href="http://www.7yue.pro" target="_blank">http://www.7yue.pro</a></div>-->
<!--          </div>-->
        </div>
        <img class="welcome-bg" src="../../assets/img/about/header-bg.png" alt="" />
      </div>
      <div class="lin-info-right">
        <div class="team-detail">
          <div class="team-box">
            <div class="team-title">店铺设置</div>
            <ul v-if="config" class="team-ul">
              <li>
                <span class="shadow-box"> <i class="team-shadow"></i> </span> <span class="team-role">店铺开关</span>
                <el-switch v-model="config.shopStatus" @change="modifyShopStatus" active-color="#00C292" active-text="开" inactive-text="关" :active-value="1" :inactive-value="0"></el-switch>
              </li>
              <li>
                <span class="shadow-box"> <i class="team-shadow"></i> </span> <span class="team-role">全场满xx元包邮开关</span>
                <el-switch v-model="config.postageFlag" @change="modifyPostageFlag" active-color="#00C292" active-text="开" inactive-text="关" :active-value="1" :inactive-value="0"></el-switch>
                <el-input class="postage-input" size="mini" v-if="config.postageFlag" v-model="config.postage" placeholder="包邮条件">
                  <el-button slot="append" @click="setPostage">提交</el-button>
                </el-input>
              </li>
            </ul>
          </div>
<!--          <div class="team-icon"><img src="../../assets/img/about/qrcode.jpg" alt="" /></div>-->
<!--          <p class="team-label">林间有风公众号</p>-->
        </div>
      </div>
    </div>
<!--    统计数据-->
<!--    <div class="quantity-statistics">-->
<!--      <div class="quantity-item">-->
<!--        <div class="quantity-detail">-->
<!--          <div class="quantity-detail-box">-->
<!--            <div class="quantity-title">总访问量</div>-->
<!--            <div class="quantity-border-line"></div>-->
<!--            <div class="quantity">11,590</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>-->
<!--      </div>-->
<!--      <div class="quantity-item">-->
<!--        <div class="quantity-detail">-->
<!--          <div class="quantity-detail-box">-->
<!--            <div class="quantity-title">总用户数</div>-->
<!--            <div class="quantity-border-line"></div>-->
<!--            <div class="quantity">51,862</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>-->
<!--      </div>-->
<!--      <div class="quantity-item">-->
<!--        <div class="quantity-detail">-->
<!--          <div class="quantity-detail-box">-->
<!--            <div class="quantity-title">新增访问量 (月)</div>-->
<!--            <div class="quantity-border-line"></div>-->
<!--            <div class="quantity">1,862</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>-->
<!--      </div>-->
<!--      <div class="quantity-item">-->
<!--        <div class="quantity-detail">-->
<!--          <div class="quantity-detail-box">-->
<!--            <div class="quantity-title">新增用户数</div>-->
<!--            <div class="quantity-border-line"></div>-->
<!--            <div class="quantity">1,323</div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="quantity-icon"><img src="../../assets/img/about/icon.png" alt="" /></div>-->
<!--      </div>-->
<!--    </div>-->
    <!--统计卡片-->
    <div class="base-statistics">
      <!--订单统计-->
      <el-card class="order-statistics">
        <div slot="header" class="card-header">
          <span>交易趋势</span>
          <el-date-picker
              v-model="orderDate"
              type="daterange"
              size="small"
              style="width: 300px"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getOrderData"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <ve-line :loading="orderLoading" :data="orderData"></ve-line>
      </el-card>
      <!--用户统计-->
      <el-card class="user-statistics">
        <div slot="header" class="card-header">
          <span>新增会员趋势</span>
          <el-date-picker
              v-model="userDate"
              type="daterange"
              size="small"
              style="width: 300px"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="getUserData"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <ve-line :loading="userLoading" :data="userData"></ve-line>
      </el-card>
    </div>
    <!--首页提示-->
    <el-dialog v-if="config" title="使用提示" :visible.sync="config.showDialog" center>
      <div class="dialog">
        <div>1. 邮费计算规则：如果订单中有包邮商品，则整单包邮。若开启了全场满xx元包邮，则达到条件的订单包邮。若以上条件都不满足，则取邮费最高的商品的邮费为订单邮费</div>
        <div>2. 商品库存为无货时可以看到但不可购买，商品状态为下架时无法看到此商品。商品套餐状态为下架时可以看到此套餐但无法购买。</div>
        <div>3. 商品分类最多添加16个</div>
        <div>4. 订单详情里的 ‘支付详情’ 是直接从微信获取的，以此为准。可能因网络阻塞等情况导致用户支付了，但本系统未收到通知，此时通过 ‘支付详情’ 确认用户已支付，可以手动修改订单状态</div>
        <div>5. 订单退款可自定义退款金额，可多次退款，总退款金额不得大于订单总金额</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyShowDialog">我明白了，下次不再显示</el-button>
        <el-button type="primary" @click="config.showDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import 'v-charts/lib/style.css'
import about from '@/models/about'

export default {
  data() {
    return {
      activeName: 'first',
      config: null,
      orderDate: [],
      userDate: [],
      orderLoading: true,
      userLoading: true,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      orderData: {
        columns: ['日期', '订单数', '金额'],
        rows: []
      },
      userData: {
        columns: ['日期', '会员数'],
        rows: []
      },
    }
  },
  components: { VeLine },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.getOrderData()
      this.getUserData()
      this.getConfig()
    },

    async getOrderData() {
      this.orderLoading = true
      const params = { // 初始化时this.orderDate是[]，判断是真，取值undefined，叉掉日期后this.orderDate为null，判断为假
        start: this.orderDate ? this.orderDate[0] : null,
        end: this.orderDate ? this.orderDate[1] : null,
      }/* eslint-disable */
      const orderData = await about.getOrderData(params)
      this.orderData.rows = orderData.map(item => ({
        '日期': item.date,
        '订单数': item.count,
        '金额': item.total_price ? item.total_price : 0
      }))
      this.orderLoading = false
    },

    async getUserData() {
      this.userLoading = true
      const params = { // 初始化时this.orderDate是[]，判断是真，取值undefined，叉掉日期后this.orderDate为null，判断为假
        start: this.userDate ? this.userDate[0] : null,
        end: this.userDate ? this.userDate[1] : null,
      }
      const userData = await about.getUserData(params)
      this.userData.rows = userData.map(item => ({
        '日期': item.date,
        '会员数': item.count,
      }))
      this.userLoading = false
    },

    async getConfig() {
      const res = await about.getConfig()
      this.config = {
        postage: res.postage,
        postageFlag: res.postageFlag,
        showDialog: Boolean(res.showDialog),
        shopStatus: res.shopStatus,
      }
    },

    async setPostage() {
      const res = await about.setPostage(this.config.postage)
      this.$message({
        message: res.msg,
        type: 'success',
      })
    },

    async modifyPostageFlag() {
      const res = await about.modifyPostageFlag()
      this.$message({
        message: res.msg,
        type: 'success',
      })
    },

    async modifyShopStatus() {
      const res = await about.modifyShopStatus()
      this.$message({
        message: res.msg,
        type: 'success',
      })
    },

    async modifyShowDialog() {
      this.config.showDialog = false
      await about.modifyShowDialog()
    },

  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  .lin-info {
    display: flex;
    flex: 1;
    height: 160px;
    width: 100%;
    .lin-info-left {
      position: relative;
      /*width: 100%;*/
      width: 690px;
      height: 100%;
      background: rgba(69, 119, 255, 1);
      box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
      border-radius: 8px;
      .welcome {
        margin: 28px 0 0 30px;
        .welcome-title {
          width: 640px;
          height: 40px;
          font-size: 35px;
          color: #fff;
          letter-spacing: 10px;
        }
        .subtitle {
          display: flex;
          flex-direction: column;
          margin-top: 16px;
          color: #fff;
          .guide {
            margin-right: 20px;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }
          .link {
            margin-top: 6px;
            width: 160px;
            height: 22px;
            background: rgba(44, 95, 233, 1);
            border-radius: 11px;
            text-align: center;
            line-height: 20px;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
      .welcome-bg {
        position: absolute;
        bottom: 0;
        right: 10px;
        width: 393px;
        height: 121px;
      }
    }
    .lin-info-right {
      flex: 1;
      margin-left: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .team-detail {
        position: relative;
        height: 160px;
        background: rgba(255, 176, 139, 1);
        box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
        border-radius: 8px;

        .team-box {
          margin: 20px 0 0 22px;

          .team-ul {
            margin-top: 15px;

            .postage-input{
              width: 140px;
              margin-left: 20px;
              /deep/.el-input__inner{
                background-color: #FFE7DC;
              }
            }

            li {
              height: 28px;
              line-height: 28px;
              margin-bottom: 15px;
              font-size: 14px;

              .shadow-box {
                position: relative;
                display: inline-block;
                margin-right: 10px;
                width: 14px;
                height: 14px;
                border-radius: 14px;
                background-color: #fff;
                transform: translateY(2px);

                .team-shadow {
                  position: absolute;
                  top: 25%;
                  left: 25%;
                  display: inline-block;
                  width: 6px;
                  height: 6px;
                  border-radius: 6px;
                  background-color: #ffb9a4;
                }
              }

              .team-role {
                display: inline-block;
                width: 150px;
                margin-right: 15px;
                font-weight: 400;
                color: #45526b;
              }

              .team-name {
                font-weight: 400;
                color: #fff;

                ul {
                  display: inline;

                  li {
                    display: inline;
                    margin-right: 15px;
                  }
                }
              }
            }
          }
        }

        .team-icon {
          position: absolute;
          top: 25%;
          right: 33px;
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          box-shadow: 0 0 10px 0 #cfd5e3;

          img {
            width: 62px;
            height: 62px;
          }
        }
        .team-label {
          position: absolute;
          top: 73%;
          right: 20px;
          font-size: 13px;
          font-weight: 400;
          color: rgba(69, 82, 107, 1);
          line-height: 20px;
        }
      }
    }
  }
  /*.quantity-statistics {*/
  /*  display: flex;*/
  /*  justify-content: space-between;*/
  /*  margin-top: 20px;*/
  /*  height: 90px;*/
  /*  .quantity-item {*/
  /*    display: flex;*/
  /*    width: 23%;*/
  /*    height: 100%;*/
  /*    background: rgba(255, 255, 255, 1);*/
  /*    box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);*/
  /*    border-radius: 8px;*/
  /*    .quantity-detail {*/
  /*      flex: 1;*/
  /*      .quantity-detail-box {*/
  /*        margin: 12px 0 0 30px;*/
  /*        .quantity-title {*/
  /*          margin-bottom: 2px;*/
  /*          height: 20px;*/
  /*          line-height: 20px;*/
  /*          color: #495468;*/
  /*          font-size: 14px;*/
  /*          font-weight: 400;*/
  /*        }*/
  /*        .quantity-border-line {*/
  /*          width: 46px;*/
  /*          height: 2px;*/
  /*          background: rgba(73, 84, 104, 1);*/
  /*        }*/
  /*        .quantity {*/
  /*          margin-top: 7px;*/
  /*          height: 48px;*/
  /*          font-size: 32px;*/
  /*          color: rgba(73, 84, 104, 1);*/
  /*          line-height: 38px;*/
  /*          letter-spacing: 2px;*/
  /*        }*/
  /*      }*/
  /*    }*/
  /*    .quantity-icon {*/
  /*      display: flex;*/
  /*      justify-content: center;*/
  /*      align-items: center;*/
  /*      width: 90px;*/
  /*      height: 100%;*/
  /*      background: rgba(69, 119, 255, 0.1);*/
  /*      border-top-right-radius: 8px;*/
  /*      border-bottom-right-radius: 8px;*/
  /*      img {*/
  /*        width: 28px;*/
  /*        height: 33px;*/
  /*      }*/
  /*    }*/
  /*  }*/
  /*}*/
  .base-statistics{
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .card-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .order-statistics{
      width: 100%;
      margin-right: 20px;
    }
    .user-statistics{
      width: 100%;
    }
  }

  .dialog{
    line-height: 28px;
  }
}

/*@media screen and (max-width: 1200px) {*/
/*  .container .lin-info .lin-info-right {*/
/*    display: none;*/
/*  }*/
/*  .container .lin-info .lin-info-left {*/
/*    width: 100%;*/
/*  }*/
/*  .container .quantity-statistics .quantity-item {*/
/*    width: 32%;*/
/*    &:last-child {*/
/*      display: none;*/
/*    }*/
/*  }*/
/*  .container .information .personal {*/
/*    display: none;*/
/*  }*/
/*}*/

/*@media screen and (max-width: 1200px) {*/
/*  .container .lin-info .lin-info-left {*/
/*    width: 100%;*/
/*  }*/
/*}*/
</style>
