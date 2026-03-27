<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-receive-info {
  &.receive-info {
    line-height: 22px;
  }
  .receive-item {
    color: #7d7d7d;
  }
  .receive-label {
    color: #b8b8b8;
  }
}
</style>
<template>
  <div class="comp-receive-info receive-info">
    <div class="receive-item">
      <label class="item-label">{{ $t('5d259f05.45bcf2') }}</label>
      {{ orderId }}
    </div>
    <div class="receive-item">
      <label class="item-label">{{ $t('5d259f05.60db2a') }}</label>
      {{ `${buy_member} | ${buy_mobile}` }}
    </div>
    <div class="receive-item">
      <label class="item-label">{{ isZiti ? $t('5d259f05.6b1044') : $t('5d259f05.02ddb4') }}</label>
      {{ `${receive_name} | ${receive_mobile}` }}
    </div>
    <div class="receive-item">
      <label class="item-label">
        {{ isZiti ? $t('5d259f05.d87411') : $t('5d259f05.e512d6') }}
      </label>
      {{ receive_address }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompReceiveInfo',
  props: ['orderId'],
  data() {
    return {
      buy_member: '',
      buy_mobile: '',
      isZiti: false,
      receive_name: '',
      receive_mobile: '',
      receive_address: ''
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { orderInfo, distributor, profit, tradeInfo } = await this.$api.trade.getOrderDetail(
        this.orderId
      )
      const { store_address, store_name } = distributor
      const {
        items = [],
        user_id,
        receiver_name,
        receiver_mobile,
        receiver_state,
        receiver_city,
        receiver_district,
        receiver_address,
        order_class,
        total_fee,
        freight_fee,
        item_fee_new,
        item_total_fee,
        receipt_type,
        point_freight_fee,
        ziti_info
      } = orderInfo
      const { username, mobile } = await this.$api.member.getMember({
        user_id: user_id
      })
      this.buy_member = username
      this.buy_mobile = mobile
      if (order_class == 'excard' || order_class == 'shopadmin') {
        this.receive_name = username
        this.receive_mobile = mobile
        this.receive_address = `${store_address}（${store_name}）`
        this.isZiti = true
      } else if (receipt_type == 'ziti') {
        const { province, city, area, address, pickup_date, pickup_time } = ziti_info
        this.receive_name = receiver_name
        this.receive_mobile = receiver_mobile
        this.receive_address = `${province}${city}${area}${address}`
        this.isZiti = true
      } else {
        this.receive_name = receiver_name
        this.receive_mobile = receiver_mobile
        this.receive_address = `${receiver_state}${receiver_city}${receiver_district}${receiver_address}`
        this.isZiti = false
      }
      this.$emit('onLoad', { orderInfo })
    }
  }
}
</script>
