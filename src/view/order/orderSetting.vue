<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.page-order-order-setting {
  .el-form-item__error--inline {
    margin-left: 0;
  }
}
</style>
<template>
  <SpPage :title="$t('edc1646b.327b34')" class="page-order-order-setting">
    <SpForm
      ref="form"
      v-model="form"
      :form-list="formList"
      :submit="false"
      @onSubmit="onSaveConfig"
    />
    <div slot="page-footer" class="text-center">
      <el-button
        type="primary"
        @click="
          () => {
            $refs['form'].handleSubmit()
          }
        "
      >
        {{ $t('edc1646b.be5fbb') }}
      </el-button>
    </div>
  </SpPage>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      form: {
        order_cancel_time: 15,
        order_finish_time: 7,
        latest_aftersale_time: 0,
        auto_refuse_time: 0,
        auto_aftersales: false,
        offline_aftersales: false,
        is_refund_freight: false
      },
      formList: [
        {
          label: this.$t('edc1646b.756fb3'),
          key: 'order_cancel_time',
          component: () => (
            <SpInput
              prefix={this.$t('edc1646b.1f092f')}
              suffix={this.$t('edc1646b.2db278')}
              width='100px'
              v-model={this.form.order_cancel_time}
            />
          ),
          validator: (rule, value, callback) => {
            const { order_cancel_time } = this.form
            if (order_cancel_time < 5) {
              callback(new Error(this.$t('edc1646b.18b713')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('edc1646b.5c37bd'),
          key: 'order_finish_time',
          component: () => (
            <SpInput
              prefix={this.$t('edc1646b.d80d26')}
              suffix={this.$t('edc1646b.f18640')}
              width='100px'
              v-model={this.form.order_finish_time}
            />
          )
        },
        {
          label: this.$t('edc1646b.1d7baa'),
          key: 'latest_aftersale_time',
          component: () => (
            <SpInput
              prefix={this.$t('edc1646b.df38fa')}
              suffix={this.$t('edc1646b.b05e2a')}
              width='100px'
              v-model={this.form.latest_aftersale_time}
            />
          ),
          isShow: () => !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('edc1646b.68096d'),
          key: 'auto_refuse_time',
          component: () => (
            <SpInput
              prefix={this.$t('edc1646b.0e40c5')}
              suffix={this.$t('edc1646b.deb459')}
              width='100px'
              v-model={this.form.auto_refuse_time}
            />
          ),
          isShow: () => !this.VERSION_IN_PURCHASE()
        },
        {
          label: this.$t('edc1646b.a76730'),
          key: 'auto_aftersales',
          type: 'switch',
          isShow: () => !this.VERSION_IN_PURCHASE(),
          tip: this.$t('edc1646b.6919fa')
        },
        {
          label: this.$t('edc1646b.11b600'),
          key: 'offline_aftersales',
          type: 'radio',
          options: [
            { label: true, name: this.$t('edc1646b.7854b5') },
            { label: false, name: this.$t('edc1646b.622424') }
          ],
          isShow: () => this.VERSION_STANDARD(),
          tip: this.$t('edc1646b.bc991d')
        },
        {
          label: this.$t('edc1646b.e1414f'),
          key: 'is_refund_freight',
          type: 'radio',
          options: [
            { label: true, name: this.$t('edc1646b.7854b5') },
            { label: false, name: this.$t('edc1646b.622424') }
          ],
          // isShow: () => this.VERSION_STANDARD(),
          tip: this.$t('edc1646b.5c24e1')
        }
      ]
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const res = await this.$api.trade.getOrderSetting()
      this.form = {
        order_cancel_time: res.order_cancel_time,
        order_finish_time: res.order_finish_time,
        latest_aftersale_time: res.latest_aftersale_time,
        auto_refuse_time: res.auto_refuse_time,
        auto_aftersales: res.auto_aftersales,
        offline_aftersales: res.offline_aftersales,
        is_refund_freight: res.is_refund_freight == 1
      }
    },
    async onSaveConfig() {
      const params = this.form
      await this.$api.trade.setOrderSetting({
        ...params,
        is_refund_freight: params.is_refund_freight ? 1 : 0,
        auto_aftersales: params.auto_aftersales ? 1 : 0
      })
      this.$message.success(this.$t('edc1646b.3b1083'))
    }
  }
}
</script>
