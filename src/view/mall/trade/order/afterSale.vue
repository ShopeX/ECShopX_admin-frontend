<style lang="scss">
.sale-after-form {
  .el-form-item {
    &:nth-child(1) {
      .el-form-item__label {
        display: none;
      }
    }
  }
  .receive-info {
    margin-top: 10px;
    background: #f5f5f5;
    padding: 10px;
  }
  .el-select {
    width: 260px;
  }
  .el-textarea {
    width: 500px;
  }
}
</style>
<template>
  <div>
    <!-- form: {{ form }} -->
    <SpForm
      ref="form"
      v-model="form"
      class="sale-after-form"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSubmit"
    />

    <div class="footer-container">
      <el-button
        @click="
          () => {
            this.$router.go(-1)
          }
        "
      >
        取消
      </el-button>
      <el-button
        type="primary"
        @click="
          () => {
            this.$refs['form'].handleSubmit()
          }
        "
      >
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import CompReceiveInfo from '../normalorders/components/comp-receiveInfo'
import CompGoodsList from './comps/comp-goodsList'
import CompRefundAmount from './comps/comp-refundAmount'
export default {
  name: '',
  data() {
    return {
      orderInfo: null,
      form: {
        order_id: '',
        aftersales_type: '1',
        reason: '1',
        goods_returned: '1',
        items: [],
        refund_fee: '',
        cancel_reason: '',
        pic: null
      },
      formList: [
        {
          label: '',
          component: () => {
            const { id: order_id } = this.$route.params
            return <CompReceiveInfo orderId={order_id} on-onLoad={this.onLoad} />
          }
        },
        {
          label: '售后形式',
          key: 'aftersales_type',
          type: 'radio',
          options: [
            { label: '1', name: '仅退款（无需退货）' },
            { label: '2', name: '退货退款' }
          ],
          onChange: (e) => {
            if (e == '2') {
              this.formList[5].isShow = true
            } else {
              this.formList[5].isShow = false
            }
          }
        },
        {
          label: '退款原因',
          key: 'reason',
          placeholder: '请选择退款原因',
          type: 'select',
          options: [
            { title: '收到残次品', value: '1' },
            { title: '商品有污渍', value: '2' },
            { title: '包装破损导致商品损坏', value: '3' },
            { title: '七天无理由退货', value: '4' }
          ]
          // required: true,
          // message: '不能为空',
          // onChange: (e) => {
          //   if (e == 12) {
          //     this.cancelOrderFormList[3].isShow = true
          //   } else {
          //     this.cancelOrderFormList[3].isShow = false
          //   }
          // }
        },
        {
          label: '退款商品',
          key: 'items',
          component: () => (
            <CompGoodsList
              value={this.orderInfo}
              on-onChange={(e) => {
                this.form.items = e
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (this.form.items.length > 0) {
              callback()
            } else {
              callback('请选择售后商品')
            }
          }
        },
        {
          label: '退款金额',
          key: 'refund_fee',
          component: () => (
            <CompRefundAmount
              value={this.orderInfo}
              on-onChange={(e) => {
                this.form.refund_fee = e
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (!this.form.refund_fee) {
              callback('退款金额不能为空')
            } else if (this.form.refund_fee * 100 > parseInt(this.orderInfo.total_fee)) {
              callback('退款金额超过可退金额')
            } else {
              callback()
            }
          }
        },
        {
          label: '回寄方式',
          key: 'goods_returned',
          type: 'radio',
          options: [
            { label: '1', name: '快递发货' },
            { label: '2', name: '到店退货（店员已验货）' }
          ],
          isShow: false
        },
        {
          label: '补充描述',
          key: 'cancel_reason',
          type: 'textarea',
          required: true,
          message: '描述信息不能为空'
        },
        {
          label: '上传凭证',
          key: 'pic',
          component: () => <SpImagePicker v-model={this.form.pic} />,
          validator: (rule, value, callback) => {
            if (this.form.pic) {
              callback()
            } else {
              callback('请上传凭证')
            }
          }
        }
      ]
    }
  },
  created() {},
  methods: {
    onLoad({ orderInfo }) {
      this.orderInfo = orderInfo
    },
    onSubmit() {
      debugger
    }
  }
}
</script>
