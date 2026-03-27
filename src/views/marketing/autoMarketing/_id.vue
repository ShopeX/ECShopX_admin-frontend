<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('ca74325b.1e5200')">
    <div slot="page-footer" class="text-center">
      <el-button :loading="submitLoading" type="primary" @click="handleSave">
{{
        $t('ca74325b.be5fbb')
      }}
</el-button>
    </div>

    <SpFormPlus
      ref="formRef"
      form-type="normalForm"
      :form-items="formItems"
      :show-default-actions="false"
      v-model="formData"
      label-width="180px"
      @submit="handleSubmit"
    />
  </SpPage>
</template>

<script>
import GiftCouponList from './components/gift-coupon-list'
import ActivityDaterange from './components/activity-daterange'
import SmsNotice from './components/sms-notice'
import GiveAwayType from './components/give-away-type'

const ACTIVITY_TYPE_VALUES = {
  member_birthday: [
    { value: 'birthday_month' },
    { value: 'birthday_week' },
    { value: 'birthday_day' }
  ],
  member_upgrade: [{ value: 'member_upgrade' }],
  member_vip_upgrade: [{ value: 'member_vip_upgrade' }],
  member_anniversary: [
    { value: 'anniversary_month' },
    { value: 'anniversary_week' },
    { value: 'anniversary_day' }
  ],
  member_day: [{ value: 'every_year' }, { value: 'every_month' }, { value: 'every_week' }]
}

export default {
  data() {
    const type = this.$route.params.type
    const firstValue = ACTIVITY_TYPE_VALUES[type] && ACTIVITY_TYPE_VALUES[type][0]
    return {
      formData: {
        title: '',
        activity_time: {
          date: [],
          is_forever: false
        },
        condition: {
          type: firstValue ? firstValue.value : '',
          month: '',
          day: '',
          week: ''
        },
        gift_coupons: [],
        sms_notice: {
          is_open: false,
          wxapp_name: ''
        }
      },
      formItems: [],
      activityTypeOptions: {},
      submitLoading: false
    }
  },
  created() {
    const t = this.$t.bind(this)
    this.activityTypeOptions = {
      member_birthday: [
        { label: t('ca74325b.0b8db5'), value: 'birthday_month' },
        { label: t('ca74325b.883212'), value: 'birthday_week' },
        { label: t('ca74325b.503d48'), value: 'birthday_day' }
      ],
      member_upgrade: [{ label: t('ca74325b.e3e252'), value: 'member_upgrade' }],
      member_vip_upgrade: [{ label: t('ca74325b.a2d14e'), value: 'member_vip_upgrade' }],
      member_anniversary: [
        { label: t('ca74325b.ce21e7'), value: 'anniversary_month' },
        { label: t('ca74325b.e8667c'), value: 'anniversary_week' },
        { label: t('ca74325b.5446bf'), value: 'anniversary_day' }
      ],
      member_day: [
        { label: t('ca74325b.281cd3'), value: 'every_year' },
        { label: t('ca74325b.aa3d57'), value: 'every_month' },
        { label: t('ca74325b.09b03b'), value: 'every_week' }
      ]
    }
    this.formItems = [
      {
        component: 'input',
        componentProps: {
          placeholder: t('ca74325b.7528b3'),
          clearable: true,
          maxlength: 20,
          showWordLimit: true
        },
        fieldName: 'title',
        formItemClass: 'w-1/2',
        label: t('ca74325b.39834b'),
        rules: [{ required: true, message: t('ca74325b.7528b3') }]
      },
      {
        component: ({ h, value, onInput }) => {
          return <ActivityDaterange value={value} on-change={onInput} />
        },
        fieldName: 'activity_time',
        label: t('ca74325b.c799f5')
      },
      {
        component: ({ h, value, onInput }) => {
          return (
            <GiveAwayType
              value={value}
              options={this.activityTypeOptions[this.$route.params.type] || []}
              on-change={onInput}
            />
          )
        },
        fieldName: 'condition',
        label: t('ca74325b.cfa851')
      },
      {
        component: ({ h, onInput }) => {
          return <GiftCouponList on-change={onInput} />
        },
        fieldName: 'gift_coupons',
        label: t('ca74325b.91fa9b')
      },
      {
        component: ({ h, value, onInput }) => {
          return <SmsNotice value={value} on-change={onInput} />
        },
        fieldName: 'sms_notice',
        label: t('ca74325b.e7d158')
      }
    ]
  },
  methods: {
    async handleSave() {
      await this.$refs.formRef.handleSubmit()
    },
    async handleSubmit(formData) {
      this.submitLoading = true
      let condition = {}
      if (this.$route.params.type === 'member_day') {
        condition = {
          type: this.formData.condition.type,
          month: this.formData.condition.month,
          week: this.formData.condition.week,
          day: this.formData.condition.day
        }
      } else {
        condition = this.formData.condition.type
      }
      let coupons = {}
      this.formData.gift_coupons.forEach((item) => {
        coupons[item.grade_id] = item.coupons
      })
      const params = {
        title: this.formData.title,
        activity_type: this.$route.params.type,
        trigger_condition: { trigger_time: condition },
        discount_config: {
          coupons: coupons,
          version: 1
        },
        sms_isopen: this.formData.sms_notice.is_open,
        sms_params: {
          app_name: this.formData.sms_notice.wxapp_name
        },
        is_forever: this.formData.activity_time.is_forever,
        begin_time: this.formData.activity_time.date[0]?.getTime() / 1000,
        end_time: this.formData.activity_time.date[1]?.getTime() / 1000
      }
      try {
        await this.$api.promotions.createActivity(params)
        this.submitLoading = false
        this.$message.success(this.$t('ca74325b.04a691'))
        this.$parent.onActivated()
        this.$router.go(-2)
      } catch (error) {
        this.submitLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
