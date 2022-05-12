<template>
  <div class="section-white">
    <h3 class="title">
      退款单详情
    </h3>
    <div class="section-body">
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款单号:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refund_bn }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          订单号:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.order_id }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          售后单号:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.aftersales_bn }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          对应支付单号:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.trade_id }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          应退金额:
        </el-col>
        <el-col :span="20">
          ￥{{ refundDetail.refund_fee / 100 }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          实退金额:
        </el-col>
        <el-col :span="20">
          ￥{{ refundDetail.refunded_fee / 100 }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          应退积分:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refund_point }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          实退积分:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refunded_point }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款单状态:
        </el-col>
        <el-col :span="20">
          <el-tag
            v-if="refundDetail.refund_status == 'READY'"
            size="mini"
            type="info"
            effect="plain"
          >
            未审核
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'AUDIT_SUCCESS'"
            size="mini"
            type="success"
            effect="plain"
          >
            审核成功待退款
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'SUCCESS'"
            size="mini"
            type="success"
            effect="dark"
          >
            退款成功
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'REFUSE'"
            size="mini"
            type="danger"
            effect="dark"
          >
            退款驳回
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'CANCEL'"
            size="mini"
            type="info"
            effect="dark"
          >
            撤销退款
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'PROCESSING'"
            size="mini"
            type="success"
            effect="light"
          >
            已发起退款等待到账
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_status == 'CHANGE'"
            size="mini"
            type="danger"
            effect="light"
          >
            退款异常
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款类型:
        </el-col>
        <el-col :span="20">
          <el-tag
            v-if="refundDetail.refund_type == '0'"
            effect="plain"
            type="warning"
            size="mini"
          >
            售后
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_type == '1'"
            effect="plain"
            size="mini"
          >
            售前
          </el-tag>
          <el-tag
            v-else-if="refundDetail.refund_type == '2'"
            effect="plain"
            type="danger"
            size="mini"
          >
            拒单
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          是否退运费:
        </el-col>
        <el-col :span="20">
          <el-tag
            v-if="refundDetail.return_freight == '0'"
            effect="plain"
            type="warning"
            size="mini"
          >
            不退运费
          </el-tag>
          <el-tag
            v-else-if="refundDetail.return_freight == '1'"
            effect="plain"
            size="mini"
          >
            退运费
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款支付方式:
        </el-col>
        <el-col :span="20">
          <span v-if="refundDetail.pay_type == 'wxpay'">微信支付</span>
          <span v-if="refundDetail.pay_type == 'wxpayapp'">微信APP支付</span>
          <span v-if="refundDetail.pay_type == 'wxpayh5'">微信H5支付</span>
          <span v-if="refundDetail.pay_type == 'wxpaypc'">微信POS支付</span>
          <span v-if="refundDetail.pay_type == 'wxpaypos'">微信PC支付</span>
          <span v-if="refundDetail.pay_type == 'alipayapp'">支付宝APP支付</span>
          <span v-if="refundDetail.pay_type == 'alipay'">支付宝支付</span>
          <span v-if="refundDetail.pay_type == 'alipayh5'">支付宝H5支付</span>
          <span v-if="refundDetail.pay_type == 'alipaypos'">支付宝POS支付</span>
          <span v-if="refundDetail.pay_type == 'deposit'">余额支付</span>
          <span v-if="refundDetail.pay_type == 'ebuy'">EBUY支付</span>
          <span v-if="refundDetail.pay_type == 'point'">积分支付</span>
          <span v-if="refundDetail.pay_type == 'pos'">POS银行卡支付</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款渠道:
        </el-col>
        <el-col :span="20">
          <span v-if="refundDetail.refund_channel == 'offline'">线下退款</span>
          <span v-else-if="refundDetail.refund_channel == 'original'">原路返回</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          备注:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refunds_memo }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          第三方退款单号:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refund_id }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          申请时间:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.create_time | datetime('YYYY-MM-DD HH:mm:ss') }}
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          退款成功时间:
        </el-col>
        <el-col
          :span="20"
        >
          <span v-if="refundDetail.refund_success_time">{{
            refundDetail.refund_success_time | datetime('YYYY-MM-DD HH:mm:ss')
          }}</span>
        </el-col>
      </el-row>
      <el-row v-if="refundDetail.refuse_reason">
        <el-col
          :span="3"
          class="col-3 content-right"
        >
          商家处理申请说明:
        </el-col>
        <el-col :span="20">
          {{ refundDetail.refuse_reason }}
        </el-col>
      </el-row>
    </div>
    <div class="content-center">
      <el-button @click.native="handleCancel">
        返回
      </el-button>
    </div>
  </div>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.agreen-info {
  margin-top: 20px;
}
.agreen-right {
  line-height: 40px;
  text-align: right;
}
</style>
<script>
import {
  getRefundsDetail,
  reviewAftersales,
  refundCheck,
  sendConfirm
} from '../../../api/aftersales'
export default {
  data () {
    return {
      isOpenErp: false,
      refund_bn: '',
      refundDetail: {}
    }
  },
  mounted () {
    if (this.$route.query.refund_bn) {
      this.refund_bn = this.$route.query.refund_bn
    }
    this.loading = true
    this.refundsInfo()
  },
  methods: {
    refundsInfo () {
      getRefundsDetail(this.refund_bn).then((response) => {
        let data = response.data.data
        this.refundDetail = data
        this.loading = false
      })
    },
    handleCancel: function () {
      this.$router.back(-1)
    }
  }
}
</script>
