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
<template>
  <SpPage title="创建营销活动">
    <div slot="page-footer" class="text-center">
      <el-button :loading="submitLoading" type="primary" @click="handleSave">保存</el-button>
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

const ACTIVITY_TYPE = {
  'member_birthday': [
    {
      label: '生日当月1日统一发放',
      value: 'birthday_month'
    },
    {
      label: '生日当周周日统一发放',
      value: 'birthday_week'
    },
    {
      label: '生日当日统一发放',
      value: 'birthday_day'
    }
  ],
  'member_upgrade': [
    {
      label: '会员升级成功后发放',
      value: 'member_upgrade'
    }
  ],
  'member_vip_upgrade': [
    {
      label: '付费会员升级成功后发放',
      value: 'member_vip_upgrade'
    }
  ],
  'member_anniversary': [
    {
      label: '周年入会当月1日统一发放',
      value: 'anniversary_month'
    },
    {
      label: '周年入会当周周日统一发放',
      value: 'anniversary_week'
    },
    {
      label: '周年入会当日统一发放',
      value: 'anniversary_day'
    }
  ],
  'member_day': [
    {
      label: '每年',
      value: 'every_year'
    },
    {
      label: '每月',
      value: 'every_month'
    },
    {
      label: '每周',
      value: 'every_week'
    }
  ]
}

export default {
  data() {
    return {
      formData: {
        title: '',
        activity_time: {
          date: [],
          is_forever: false
        },
        condition: {
          type: ACTIVITY_TYPE[this.$route.params.type][0].value,
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
      formItems: [
        {
          component: 'input',
          componentProps: {
            placeholder: '请输入活动名称',
            clearable: true,
            maxlength: 20,
            showWordLimit: true
          },
          fieldName: 'title',
          formItemClass: 'w-1/2',
          label: '活动名称',
          rules: [{ required: true, message: '请输入活动名称' }]
        },
        {
          component: ({ h, value, onInput }) => {
            return <ActivityDaterange value={value} on-change={onInput} />
          },
          fieldName: 'activity_time',
          label: '活动时间'
        },
        {
          component: ({ h, value, onInput }) => {
            return (
              <GiveAwayType
                value={value}
                options={ACTIVITY_TYPE[this.$route.params.type]}
                on-change={onInput}
              />
            )
          },
          fieldName: 'condition',
          label: '赠送方式'
        },
        {
          component: ({ h, onInput }) => {
            return <GiftCouponList on-change={onInput} />
          },
          fieldName: 'gift_coupons',
          label: '赠送优惠券'
        },
        {
          component: ({ h, value, onInput }) => {
            return <SmsNotice value={value} on-change={onInput} />
          },
          fieldName: 'sms_notice',
          label: '短信通知'
        }
      ],
      submitLoading: false
    }
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
        this.$message.success('创建成功')
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
