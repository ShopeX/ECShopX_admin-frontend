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
  <CustomCard title="物流信息">
    <div>
      <div v-if="orderInfo.receipt_type == 'ziti'">
        <h4>自提地址：</h4>
      </div>
      <div v-if="orderInfo.receipt_type == 'ziti'">
        {{ distributor.store_name }}
        <span class="frm-tips">{{ distributor.store_address }}</span>
      </div>
      <div v-if="orderInfo.receiver_address" class="flex-center">
        <div class="content-right">
          <h4>收货人信息：</h4>
        </div>
        <div>
          {{ orderInfo.receiver_name }} , {{ orderInfo.receiver_mobile }} ,
          {{ orderInfo.receiver_state }}{{ orderInfo.receiver_city }}{{ orderInfo.receiver_district
          }}{{ orderInfo.receiver_address }}
        </div>
      </div>
    </div>
    <customSimpleTable
      :show="isShowLog"
      :columns="columns"
      :data-source="dataSource"
      :order-info="orderInfo"
      @update="getDetail"
    />
  </CustomCard>
</template>

<script>
import customSimpleTable from '@/components/customSimpleTable'
import CustomCard from './CustomCard'
export default {
  components: {
    customSimpleTable,
    CustomCard
  },
  props: ['cardConfig', 'orderInfo', 'memberInfo', 'distributor', 'deliveryData', 'update'],
  data() {
    const self = this
    return {
      columns: [
        { name: '发货时间', field: 'delivery_time' },
        { name: '物流单号', field: 'delivery_code' },
        { name: '快递公司', field: 'delivery_corp_name' },
        { name: '物流编码', field: 'delivery_corp' }
      ],
      dataSource: self.deliveryData
    }
  },
  computed: {
    isShowLog() {
      return (
        (this.orderInfo.receipt_type || this.orderInfo.order_type == 'bargain') &&
        this.orderInfo.delivery_type == 'new'
      )
    }
  },
  watch: {
    deliveryData: {
      handler(val) {
        this.dataSource = val
      },
      deep: true
    }
  },
  methods: {
    getDetail() {
      this.$emit('update')
    }
  }
}
</script>

<style scoped>
.flex-center {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
.ell3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
