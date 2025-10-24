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
      <label class="item-label">订单ID：</label>
      {{ orderId }}
    </div>
    <div class="receive-item">
      <label class="item-label">买家：</label>
      {{ `${buy_member} | ${buy_mobile}` }}
    </div>
    <div class="receive-item">
      <label class="item-label">{{ `${isZiti ? '提货人：' : '收货人：'}` }}</label>
      {{ `${receive_name} | ${receive_mobile}` }}
    </div>
    <div class="receive-item">
      <label class="item-label">
        {{ `${isZiti ? '自提地址：' : '收货地址：'}` }}
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
