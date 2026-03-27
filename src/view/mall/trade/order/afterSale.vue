<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
  <SpPage :title="$t('9ebd763b.a518ff')">
    <template slot="page-footer">
      <div class="text-center">
        <el-button
          @click="
            () => {
              this.$router.go(-1)
            }
          "
        >
          {{ $t('9ebd763b.625fb2') }}
        </el-button>
        <el-button type="primary" @click="submitRefund">{{ $t('9ebd763b.be5fbb') }}</el-button>
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
import CompRefundFreight from './comps/comp-refundFreight.vue'

export default {
  name: '',
  data() {
    const REASONS = [
      { title: this.$t('9ebd763b.c84563'), value: '1' },
      { title: this.$t('9ebd763b.2dc870'), value: '2' },
      { title: this.$t('9ebd763b.04996d'), value: '3' },
      { title: this.$t('9ebd763b.42065f'), value: '4' }
    ]
    return {
      orderInfo: null,
      reasonOptions: REASONS,
      form: {
        order_id: '',
        aftersales_type: 'ONLY_REFUND',
        reason: '1',
        goods_returned: false,
        items: [],
        refund_point: 0,
        refund_fee: 0,
        description: '',
        pic: '',
        freight: 0
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
          label: this.$t('9ebd763b.632e0a'),
          key: 'aftersales_type',
          type: 'radio',
          options: [
            { label: 'ONLY_REFUND', name: this.$t('9ebd763b.e04db3') },
            { label: 'REFUND_GOODS', name: this.$t('9ebd763b.cc0193') }
          ],
          onChange: (e) => {
            if (e == 'REFUND_GOODS') {
              this.formList[6].isShow = true
            } else {
              this.formList[6].isShow = false
            }
          }
        },
        {
          label: this.$t('9ebd763b.220bc2'),
          key: 'reason',
          placeholder: this.$t('9ebd763b.9318de'),
          type: 'select',
          options: REASONS
        },
        {
          label: this.$t('9ebd763b.67148e'),
          key: 'items',
          component: () => (
            <CompGoodsList
              ref='compGoodsRef'
              value={this.orderInfo}
              on-onChange={(e) => {
                this.form.items = e
                this.$refs['compRefundRef'].getTotalFee()
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (this.form.items.length > 0) {
              callback()
            } else {
              callback(this.$t('9ebd763b.175653'))
            }
          }
        },
        {
          label: this.$t('9ebd763b.401595'),
          key: 'refund_point',
          component: () => (
            <CompRefundPoint
              value={this.orderInfo}
              on-onChange={(e) => {
                this.form.refund_point = e
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (this.form.refund_point > this.orderInfo?.refund_point_amount / 100) {
              callback(this.$t('9ebd763b.5706af'))
            } else if (
              this.form.refund_point === '' ||
              this.form.refund_point === null ||
              this.form.refund_point === undefined
            ) {
              callback(this.$t('9ebd763b.3ae867'))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('9ebd763b.a0cd4c'),
          key: 'refund_fee',
          component: () => (
            <CompRefundAmount
              ref='compRefundRef'
              value={this.orderInfo}
              on-onChangeFee={(e) => {
                this.form.refund_fee = e
              }}
              on-onChange={(e) => {
                this.$refs['compGoodsRef'].setSelectAllGoods()
                {
                  /* this.form.refund_fee = e */
                }
              }}
            />
          ),
          validator: (rule, value, callback) => {
            if (
              this.form.refund_fee === '' ||
              this.form.refund_fee === null ||
              this.form.refund_fee === undefined
            ) {
              callback(this.$t('9ebd763b.18f5bc'))
            } else if (
              parseFloat(this.form.refund_fee) > parseFloat(this.$refs['compRefundRef'].refundFee)
            ) {
              callback(this.$t('9ebd763b.7d7771'))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('9ebd763b.662229'),
          key: 'freight',
          component: () => {
            return (
              <CompRefundFreight
                value={this.orderInfo}
                on-onChange={(e) => {
                  this.form.freight = e
                }}
              />
            )
          },
          validator: (rule, value, callback) => {
            console.log(this.form.freight)
            if (
              this.form.freight === '' ||
              this.form.freight === null ||
              this.form.freight === undefined
            ) {
              callback(this.$t('9ebd763b.ad6507'))
            } else if (
              parseFloat(this.form.freight) >
              parseFloat(this.orderInfo?.refund_freight_amount / 100)
            ) {
              callback(this.$t('9ebd763b.4a32c4'))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('9ebd763b.89c604'),
          key: 'goods_returned',
          type: 'radio',
          options: [
            { label: false, name: this.$t('9ebd763b.118582') },
            { label: true, name: this.$t('9ebd763b.66b764') }
          ],
          isShow: false
        },
        {
          label: this.$t('9ebd763b.f55683'),
          key: 'description',
          type: 'textarea'
        },
        {
          label: this.$t('9ebd763b.9f447d'),
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
      orderInfo.items = orderInfo.items.map((item) => {
        return {
          ...item,
          refundNum: item.left_aftersales_num,
          checked: false
        }
      })

      this.orderInfo = orderInfo
    },
    async submitRefund() {
      try {
        await this.$refs['form'].handleSubmit()
      } catch (error) {
        console.log(error)
        const message = error.items?.[0]?.message
        this.$message.error(message)
      }
    },
    async onSubmit() {
      await this.$confirm(this.$t('9ebd763b.ee8174'), this.$t('9ebd763b.02d981'), {
        confirmButtonText: this.$t('9ebd763b.38cf16'),
        cancelButtonText: this.$t('9ebd763b.625fb2')
      })
      const { id: order_id } = this.$route.params
      const reason =
        this.reasonOptions.find((item) => item.value == this.form.reason)?.title || ''
      const params = {
        order_id,
        aftersales_type: this.form.aftersales_type,
        goods_returned: this.form.goods_returned,
        reason,
        detail: JSON.stringify(this.form.items),
        refund_fee: this.form.refund_fee * 100,
        refund_point: this.form.refund_point,
        freight: this.form.freight * 100,
        description: this.form.description,
        evidence_pic: [this.form.pic]
      }
      try {
        await this.$api.trade.salesAfterApply(params)
      } catch (error) {
        this.$message.error(error.message)
        return
      }
      this.$message.success(this.$t('9ebd763b.913abc'))
      this.$EventBus.$emit('event.tradelist.refresh')
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    }
  }
}
</script>
