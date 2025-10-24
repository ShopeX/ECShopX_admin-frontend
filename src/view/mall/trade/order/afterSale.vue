<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
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
  <SpPage title="售后申请">
    <template slot="page-footer">
      <div class="text-center">
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
    </template>
    <!-- form: {{ form }} -->
    <SpForm
      ref="form"
      v-model="form"
      class="sale-after-form"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSubmit"
    />
  </SpPage>
</template>

<script>
import CompReceiveInfo from '../normalorders/components/comp-receiveInfo'
import CompGoodsList from './comps/comp-goodsList'
import CompRefundAmount from './comps/comp-refundAmount'
import CompRefundPoint from './comps/comp-refundPoint'

const REASONS = [
  { title: '收到残次品', value: '1' },
  { title: '商品有污渍', value: '2' },
  { title: '包装破损导致商品损坏', value: '3' },
  { title: '七天无理由退货', value: '4' }
]
export default {
  name: '',
  data() {
    return {
      orderInfo: null,
      form: {
        order_id: '',
        aftersales_type: 'ONLY_REFUND',
        reason: '1',
        goods_returned: false,
        items: [],
        refund_point: '0',
        refund_fee: '',
        description: '',
        pic: ''
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
            { label: 'ONLY_REFUND', name: '仅退款（无需退货）' },
            { label: 'REFUND_GOODS', name: '退货退款' }
          ],
          onChange: e => {
            if (e == 'REFUND_GOODS') {
              this.formList[6].isShow = true
            } else {
              this.formList[6].isShow = false
            }
          }
        },
        {
          label: '退款原因',
          key: 'reason',
          placeholder: '请选择退款原因',
          type: 'select',
          options: REASONS
        },
        {
          label: '退款商品',
          key: 'items',
          component: () => (
            <CompGoodsList
              ref="compGoodsRef"
              value={this.orderInfo}
              on-onChange={e => {
                this.form.items = e
                this.$refs['compRefundRef'].getTotalFee()
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
          label: '退积分',
          key: 'refund_point',
          component: () => (
            <CompRefundPoint
              value={this.orderInfo}
              on-onChange={e => {
                this.form.refund_point = e
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (this.form.refund_point >= 0) {
              callback()
            } else {
              callback('积分不能为空')
            }
          }
        },
        {
          label: '退款金额',
          key: 'refund_fee',
          component: () => (
            <CompRefundAmount
              ref="compRefundRef"
              value={this.orderInfo}
              on-onChangeFee={e => {
                this.form.refund_fee = e
              }}
              on-onChange={e => {
                this.$refs['compGoodsRef'].setSelectAllGoods()
                {
                  /* this.form.refund_fee = e */
                }
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (!this.form.refund_fee) {
              callback('退款金额不能为空')
            } else if (
              parseFloat(this.form.refund_fee) > parseFloat(this.$refs['compRefundRef'].refundFee)
            ) {
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
            { label: false, name: '快递发货' },
            { label: true, name: '到店退货（店员已验货）' }
          ],
          isShow: false
        },
        {
          label: '补充描述',
          key: 'description',
          type: 'textarea'
        },
        {
          label: '上传凭证',
          key: 'pic',
          component: ({ key }, value) => {
            return <SpImagePicker v-model={value[key]} />
          }
          // component: () => <SpImagePicker v-model={this.form.pic} />
          // validator: (rule, value, callback) => {
          //   if (this.form.pic) {
          //     callback()
          //   } else {
          //     callback('请上传凭证')
          //   }
          // }
        }
      ]
    }
  },
  created() {},
  methods: {
    onLoad({ orderInfo }) {
      orderInfo.items = orderInfo.items.map(item => {
        return {
          ...item,
          refundNum: item.left_aftersales_num,
          checked: false
        }
      })

      this.orderInfo = orderInfo
    },
    async onSubmit() {
      await this.$confirm('请确认申请售后', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      const { id: order_id } = this.$route.params
      const reason = REASONS.find(item => item.value == this.form.reason).title
      const params = {
        order_id,
        aftersales_type: this.form.aftersales_type,
        goods_returned: this.form.goods_returned,
        reason,
        detail: JSON.stringify(this.form.items),
        refund_fee: this.form.refund_fee * 100,
        refund_point: this.form.refund_point,
        description: this.form.description,
        evidence_pic: [this.form.pic]
      }
      await this.$api.trade.salesAfterApply(params)
      this.$message.success('售后申请提交成功')
      this.$EventBus.$emit('event.tradelist.refresh')
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    }
  }
}
</script>
