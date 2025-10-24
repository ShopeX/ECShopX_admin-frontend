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
  <div class="zyk_couponDetail">
    <h3>VIP-优惠劵包 领取记录</h3>
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
    return {
      receive_type: [
        {
          key: 'template',
          value: '模版领取'
        },
        {
          key: 'grade',
          value: '等级领取'
        },
        {
          key: 'vip_grade',
          value: 'vip等级领取'
        }
      ]
    }
  },
  computed: {
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
