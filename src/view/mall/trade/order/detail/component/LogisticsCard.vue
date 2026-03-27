<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard :title="$t('068002ef.24bc07')">
    <div>
      <div v-if="orderInfo.receipt_type == 'ziti'">
        <h4>{{ $t('068002ef.d87411') }}</h4>
      </div>
      <div v-if="orderInfo.receipt_type == 'ziti'">
        {{ distributor.store_name }}
        <span class="frm-tips">{{ distributor.store_address }}</span>
      </div>
      <div v-if="orderInfo.receiver_address" class="flex-center">
        <div class="content-right">
          <h4>{{ $t('068002ef.0dd68e') }}</h4>
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
        { name: self.$t('068002ef.bfd255'), field: 'delivery_time' },
        { name: self.$t('068002ef.0bb075'), field: 'delivery_code' },
        { name: self.$t('068002ef.f3af96'), field: 'delivery_corp_name' },
        { name: self.$t('068002ef.28acd4'), field: 'delivery_corp' }
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
