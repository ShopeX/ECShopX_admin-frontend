<template>
  <SpDialog
    ref="selectCouponPackDialogRef"
    v-model="show"
    title="选择优惠券包"
    :modal="false"
    class="base-form"
    :form="couponPackForm"
    :form-list="couponPackFormList"
    @onSubmit="onGroupFormSubmit"
  />
</template>

<script>
import { generatorParams, bindThisForFormSchema } from '@/utils/schemaHelper.js'
import { CouponPackFormSchema, CouponPackTableSchema } from './schema.js'
export default {
  data() {
    return {
      // 关联券包
      couponPackForm: {
        ...generatorParams(CouponPackFormSchema)
      },
      couponPackTableData: [],
      show: true
    }
  },
  computed: {
    couponPackFormList() {
      return bindThisForFormSchema(CouponPackFormSchema, this)
    },
    couponPackTableSchema() {
      return CouponPackTableSchema(this)
    }
  },
  methods: {
    onGroupFormSubmit() {
      this.$emit('onSubmit', this.couponPackTableData)
    },
    // 选择优惠包
    async openSelectCouponPackageDialog() {
      const res = await this.$picker.couponPackage({
        data: this.couponPackTableData?.map((el) => el.package_id),
        multiple: true
      })
      const { data } = res
      this.couponPackTableData = data?.map((el) => {
        return {
          ...el,
          'cover':
            'https://shopex-onex-yundian-image.oss-cn-shanghai.aliyuncs.com/demo-ecshopx/image/38/2025/04/02/8e6ff39e0169d93052c0c138494772f41743569470419.4af6677e-8d6b-4521-a4d7-c86e0a0be62a.png'
        }
      })
    },
    // 弹窗里面删除// 弹窗里面删除
    deleteHandle(row, type) {
      this.$confirm('是否确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.couponPackTableData = this.couponPackTableData?.filter(
            (el) => el.package_id !== row.package_id
          )
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
