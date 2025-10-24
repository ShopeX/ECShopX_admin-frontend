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
  <div>
    <div>
      <el-switch v-model="localValue.is_open" />
      <p class="leading-normal flex items-center">
        <span class="text-secondary">请确保短信账户余额充足</span>
        <router-link
          :to="{ path: getUrlPathByLoginType('/setting/system-config/sms-service') }"
          target="_blank"
        >
          <el-link type="primary" class="ml-2">查看短息账户</el-link>
        </router-link>
      </p>
    </div>
    <div v-show="localValue.is_open">
      <el-input
        v-if="$route.params.type === 'member_birthday'"
        v-model="localValue.wxapp_name"
        placeholder="请输入小程序名称"
        class="!w-[300px] mt-4"
      />
      <div class="sms-template mt-4">
        <div class="sms-template__title">短信模板</div>
        <div class="sms-template__content">{{ sms_template }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlPathByLoginType } from '@/utils'
const SMS_TEMPLATE = {
  'member_birthday':
    '尊敬的会员：值此您生日之际，衷心祝您生日快乐！为感谢您对本店的支持，特此赠送您｛赠送内容｝｛数量｝。详情请查看官方小程序',
  'member_day': '｛会员日时间｝是｛品牌｝会员日，特此为您奉上｛奖品｝。到店更有其他惊喜',
  'member_anniversary':
    '历史上的今天，您成为了｛品牌｝会员。感谢您一路来对｛品牌｝的支持，特此为您奉上｛奖品｝。到店更有其他惊喜。',
  'member_upgrade': '恭喜您成为｛品牌｝｛会员等级名称｝，特此为您奉上｛奖品｝。到店更有其他惊喜。',
  'member_vip_upgrade': '恭喜您成为 {品牌} 的 {付费会员等级名称}，特此为您奉上 {赠送内容}'
}

export default {
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      localValue: {
        is_open: this.value.is_open,
        wxapp_name: this.value.wxapp_name
      },
      sms_template: SMS_TEMPLATE[this.$route.params.type]
    }
  },
  watch: {
    localValue: {
      handler(val) {
        this.$emit('change', val)
      },
      deep: true,
      immediate: false
    }
  }
}
</script>

<style lang="scss" scoped>
.sms-template {
  background: #f4f4f5;
  padding: 10px;
  border-radius: 6px;
  line-height: 24px;
  &__title {
    font-size: 14px;
    font-weight: bold;
  }
  &__content {
    font-size: 14px;
    color: #606266;
  }
}
</style>
