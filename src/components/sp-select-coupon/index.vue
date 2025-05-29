<template>
  <SpDialog
    ref="dialogRef"
    v-model="show"
    title="选择优惠券"
    :modal="false"
    class="base-form"
    :form="activityRule"
    :form-list="activityRuleList"
    @onSubmit="onGroupFormSubmit"
  />
</template>

<script>
import { CouponFormSchema, CouponTableSchema } from './schema.js'
import { bindThisForFormSchema, generatorParams } from '@/utils/schemaHelper.js'
import { CARD_TYPE } from '@/consts'
import moment from 'moment'
export default {
  data() {
    return {
      couponTableData: [],
      // 关联券包
      activityRule: {
        ...generatorParams(CouponFormSchema)
      },
      couponTableSchema: CouponTableSchema(this),
      show: true
    }
  },
  computed: {
    activityRuleList() {
      return bindThisForFormSchema(CouponFormSchema, this)
    }
  },
  methods: {
    onGroupFormSubmit() {
      this.$emit('onSubmit', this.couponTableData)
    },
    // 选择优惠券
    async openSelectCouponDialog() {
      const res = await this.$picker.couponV2({
        data: this.couponTableData?.map((el) => el.card_id),
        multiple: true
      })
      const { data } = res
      this.couponTableData = data?.map((el) => {
        return {
          ...el,
          'cover':
            'https://shopex-onex-yundian-image.oss-cn-shanghai.aliyuncs.com/demo-ecshopx/image/38/2025/04/02/8e6ff39e0169d93052c0c138494772f41743569470419.4af6677e-8d6b-4521-a4d7-c86e0a0be62a.png'
        }
      })
    },
    // 弹窗里面删除
    deleteHandle(row) {
      this.$confirm('是否确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.couponTableData = this.couponTableData?.filter((el) => el.card_id !== row.card_id)
        })
        .catch(() => {})
    },
    cardTypeFormatter({ card_type }) {
      return CARD_TYPE[card_type]
    },
    // 以上是关联直播商品操作
    getCardValidate(beginDate, endDate) {
      return `${moment(beginDate * 1000).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(
        endDate * 1000
      ).format('YYYY-MM-DD HH:mm:ss')}`
    }
  }
}
</script>

<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
