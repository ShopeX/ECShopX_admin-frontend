<template>
  <div class="zyk_couponDetail">
    <h3>VIP-优惠劵包 领取记录</h3>
    <SpFinder
      ref="finder"
      :split-count="4"
      :fixed-row-action="true"
      :setting="setting"
      :hooks="{ beforeSearch: beforeSearch }"
      noSelection
      url="/voucher/package/get_receives_log"
    >
    </SpFinder>
  </div>
</template>

<script>
import setting_ from './setting/detail'
export default {
  computed: {
    setting() {
      return setting_(this)
    }
  },
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
  methods: {
    beforeSearch(params) {
      return { ...params, package_id: this.$route.query.package_id }
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_couponDetail {
  h3{
    color: cornflowerblue;
  }
  .sp-finder-bd {
    padding: 16px 0px;
  }
}
</style>
