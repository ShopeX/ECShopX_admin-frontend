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
    isMedicine:{
      type: Boolean,
      default: false
    },
    medicinePrescription:{
      type: Boolean,
      default: false
    },
  },
  data() {
    let statusOption = [
      {
        title: '前台可销售',
        value: 'onsale',
        disabled:()=>this.medicinePrescription
      },
      {
        title: '前台仅展示',
        value: 'only_show',
        disabled:()=>this.medicinePrescription
      },
      {
        title: '不可销售',
        value: 'instock'
      }
    ]
    if (!this.VERSION_IN_PURCHASE) {
      statusOption.push({
        title: '前台不展示',
        value: 'offline_sale',
        disabled:()=>this.medicinePrescription
      })
    }
    return {
      form: {
        buy_limit_area:['all'],
        item_id: '',
        approve_status: 'onsale',
        store: 1,
        item_bn: '',
        medicine_spec:'',
        max_num: '',
        weight: '',
        volume: '',
        price: '',
        cost_price: '',
        market_price: '',
        barcode: '',
        delivery_time:"",
        point_num: 0,
        start_num: 0, //起订量
      },
      formList: [
        {
          label: '商品状态',
          key: 'approve_status',
          type: 'select',
          isShow: !IS_SUPPLIER(),//非供应商
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
          required: true,
          message: '请输入商品成本价',
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
          label: '药品规格',
          key: 'medicine_spec',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.medicinePrescription) {
              callback('请输入药品规格')
            } else {
              callback()
            }
          },
          isShow:()=>this.medicinePrescription,
          display: 'inline'
        },
        {
          label: '最大开方数',
          key: 'max_num',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.medicinePrescription) {
              callback('请输入最大开方数量')
            } else {
              callback()
            }
          },
          isShow:()=>this.medicinePrescription,
          display: 'inline'
        },
        {
          label: '起订量',
          key: 'start_num',
          type: 'input',
          display: 'inline'
        },
        {
          label: '发货时间',
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
            label: '获取积分',
            key: 'point_num',
            type: 'input',
            display: 'inline'
          })
        }
      }
    },
    medicinePrescription(nval){
      if(nval){
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
