<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div>
      <el-switch v-model="localValue.is_open" />
      <p class="leading-normal flex items-center">
        <span class="text-secondary">{{ $t('afae365e.3d70d5') }}</span>
        <router-link
          :to="{ path: getUrlPathByLoginType('/setting/system-config/sms-service') }"
          target="_blank"
        >
          <el-link type="primary" class="ml-2">{{ $t('afae365e.f3a137') }}</el-link>
        </router-link>
      </p>
    </div>
    <div v-show="localValue.is_open">
      <el-input
        v-if="$route.params.type === 'member_birthday'"
        v-model="localValue.wxapp_name"
        :placeholder="$t('afae365e.7437cc')"
        class="!w-[300px] mt-4"
      />
      <div class="sms-template mt-4">
        <div class="sms-template__title">{{ $t('afae365e.dbe8ba') }}</div>
        <div class="sms-template__content">{{ sms_template }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUrlPathByLoginType } from '@/utils'

const SMS_TEMPLATE_KEYS = {
  member_birthday: 'afae365e.77fed3',
  member_day: 'afae365e.62eb69',
  member_anniversary: 'afae365e.6ab1b5',
  member_upgrade: 'afae365e.67eebf',
  member_vip_upgrade: 'afae365e.ce44bb'
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
      }
    }
  },
  computed: {
    sms_template() {
      const key = SMS_TEMPLATE_KEYS[this.$route.params.type]
      return key ? this.$t(key) : ''
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
