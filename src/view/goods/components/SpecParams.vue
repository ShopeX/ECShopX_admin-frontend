<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss"></style>
<template>
  <div>
    <!-- form: {{ form }} -->
    <SpForm ref="form" v-model="form" label-width="100px" :form-list="formList" :submit="false" />
  </div>
</template>

<script>
import { GOODS_TAX_RATE } from '@/consts'
import { IS_SUPPLIER } from '@/utils'
export default {
  name: 'SpecParams',
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    isShowPoint: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    provinceList: {
      type: Array,
      default: () => []
    },
    isMedicine: {
      type: Boolean,
      default: false
    },
    medicinePrescription: {
      type: Boolean,
      default: false
    },
    isPrescriptionApproved: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let statusOption = [
      {
        title: this.$t('52409ed2.9b7481'),
        value: 'onsale',
        disabled: () => this.medicinePrescription && !this.isPrescriptionApproved
      },
      {
        title: this.$t('52409ed2.acf86b'),
        value: 'only_show',
        disabled: () => this.medicinePrescription && !this.isPrescriptionApproved
      },
      {
        title: this.$t('52409ed2.ae83a3'),
        value: 'instock'
      }
    ]
    if (!this.VERSION_IN_PURCHASE()) {
      statusOption.push({
        title: this.$t('52409ed2.2c50a0'),
        value: 'offline_sale',
        disabled: () => this.medicinePrescription && !this.isPrescriptionApproved
      })
    }
    return {
      form: {
        buy_limit_area: ['all'],
        item_id: '',
        approve_status: 'onsale',
        store: 1,
        item_bn: '',
        medicine_spec: '',
        max_num: '',
        weight: '',
        volume: '',
        price: '',
        cost_price: '',
        market_price: '',
        barcode: '',
        delivery_time: '',
        point_num: 0,
        start_num: 0 //起订量
      },
      formList: [
        {
          label: this.$t('52409ed2.ce0008'),
          key: 'approve_status',
          type: 'select',
          isShow: !IS_SUPPLIER(),
          options: statusOption,
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.0eac88'),
          key: 'store',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.e9de29'),
          key: 'item_bn',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.fcd943'),
          key: 'weight',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.972d5f'),
          key: 'volume',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.e29575'),
          key: 'price',
          type: 'input',
          required: true,
          message: this.$t('52409ed2.f68807'),
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.2e2ce2'),
          key: 'cost_price',
          type: 'input',
          required: this.$store.getters.login_type != 'admin',
          message: this.$t('52409ed2.7bdb46'),
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.818fc4'),
          key: 'market_price',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.1e8836'),
          key: 'barcode',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.e20511'),
          key: 'medicine_spec',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.medicinePrescription) {
              callback(this.$t('52409ed2.35e76f'))
            } else {
              callback()
            }
          },
          isShow: () => this.medicinePrescription,
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.06bdef'),
          key: 'max_num',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.medicinePrescription) {
              callback(this.$t('52409ed2.8d1f7c'))
            } else {
              callback()
            }
          },
          isShow: () => this.medicinePrescription,
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.ed52fd'),
          key: 'start_num',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('52409ed2.bfd255'),
          key: 'delivery_time',
          type: 'input',
          display: 'inline'
        }
      ]
    }
  },
  watch: {
    value(newVal) {
      this.form = newVal
    },
    form: {
      deep: true,
      handler(newVal) {
        this.$emit('input', newVal)
      }
    },
    isShowPoint: {
      handler(newVal) {
        if (newVal) {
          this.formList.push({
            label: this.$t('52409ed2.c07abe'),
            key: 'point_num',
            type: 'input',
            display: 'inline'
          })
        }
      }
    },
    medicinePrescription(nval) {
      if (nval && !this.isPrescriptionApproved) {
        this.form.approve_status = 'instock'
      }
    }
  },
  methods: {
    async handleSubmit() {
      await this.$refs['form'].handleSubmit()
    }
  }
}
</script>
