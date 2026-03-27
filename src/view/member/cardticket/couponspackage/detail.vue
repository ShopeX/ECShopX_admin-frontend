<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="zyk_couponDetail">
    <h3>{{ $t('4351c920.533c24') }}</h3>
    <SpFinder
      ref="finder"
      :split-count="4"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{ beforeSearch: beforeSearch }"
      no-selection
      url="/voucher/package/get_receives_log"
    />
  </div>
</template>

<script>
import setting_ from './setting/detail'
export default {
  data() {
    return {}
  },
  computed: {
    receive_type() {
      return [
        { key: 'template', value: this.$t('4351c920.a50ef1') },
        { key: 'grade', value: this.$t('4351c920.0eafd9') },
        { key: 'vip_grade', value: this.$t('4351c920.573531') }
      ]
    },
    setting() {
      return setting_(this)
    }
  },
  methods: {
    beforeSearch(params) {
      return { ...params, package_id: this.$route.query.package_id }
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_couponDetail {
  h3 {
    color: cornflowerblue;
  }
  .sp-finder-bd {
    padding: 16px 0px;
  }
}
</style>
