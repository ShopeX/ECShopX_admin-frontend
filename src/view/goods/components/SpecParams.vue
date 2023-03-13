<style lang="scss"></style>
<template>
  <div>
    <!-- form: {{ form }} -->
    <SpForm ref="form" v-model="form" label-width="100px" :form-list="formList" :submit="false" />
  </div>
</template>

<script>
export default {
  name: 'SpecParams',
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let statusOption = [
      {
        title: '前台可销售',
        value: 'onsale'
      },
      {
        title: '前台仅展示',
        value: 'only_show'
      },
      {
        title: '不可销售',
        value: 'instock'
      }
    ]
    if (!this.VERSION_IN_PURCHASE) {
      statusOption.push({
        title: '前台不展示',
        value: 'offline_sale'
      })
    }
    return {
      form: {
        approve_status: 'onsale',
        store: 1,
        item_bn: '',
        weight: '',
        volume: '',
        price: '',
        cost_price: '',
        market_price: '',
        barcode: '',
        point_num: 0
      },
      formList: [
        {
          label: '商品状态',
          key: 'approve_status',
          type: 'select',
          options: statusOption,
          display: 'inline'
        },
        {
          label: '库存',
          key: 'store',
          type: 'input',
          display: 'inline'
        },
        {
          label: '商品货号',
          key: 'item_bn',
          type: 'input',
          display: 'inline'
        },
        {
          label: '重量',
          key: 'weight',
          type: 'input',
          display: 'inline'
        },
        {
          label: '体积',
          key: 'volume',
          type: 'input',
          display: 'inline'
        },
        {
          label: '销售价',
          key: 'price',
          type: 'input',
          required: true,
          message: '请输入商品销售价',
          display: 'inline'
        },
        {
          label: '成本价',
          key: 'cost_price',
          type: 'input',
          display: 'inline'
        },
        {
          label: '市场价',
          key: 'market_price',
          type: 'input',
          display: 'inline'
        },
        {
          label: '条形码',
          key: 'barcode',
          type: 'input',
          display: 'inline'
        },
        {
          label: '获取积分',
          key: 'point_num',
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
    }
  },
  methods: {
    async handleSubmit() {
      await this.$refs['form'].handleSubmit()
    }
  }
}
</script>
