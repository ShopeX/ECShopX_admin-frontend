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
  <CustomCard title="商品清单">
    <div v-if="orderInfo.order_type == 'service' || orderInfo.order_type == 'bargain'">
      <el-row>
        <el-col :span="3"> 商品名称： </el-col>
        <el-col :span="5">
          {{ orderInfo.title }}
        </el-col>
        <el-col :span="3"> 商品数量： </el-col>
        <el-col :span="5">
          {{ orderInfo.item_num }}
        </el-col>
      </el-row>
    </div>

    <div v-else-if="orderInfo.order_type == 'normal'">
      <el-table :data="orderInfo.items" style="width: 100%" size="small">
        <el-table-column prop="item_id" label="商品ID" width="80" />
        <el-table-column class="goods-img" prop="pic" label="商品图片" width="120">
          <template slot-scope="scope">
            <span>
              <img
                class="item-image"
                :src="wximageurl + scope.row.pic"
                :alt="scope.row.item_name"
              >
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="item_name" label="商品名称" width="180">
          <template slot-scope="scope">
            <div class="ell3">
              {{ scope.row.item_name }}
            </div>
            <el-tag v-if="scope.row.order_item_type == 'gift'" size="mini" type="success">
              赠品
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.price / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_spec_desc" label="规格" width="180">
          <template slot-scope="scope">
            {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : '单规格' }}
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" width="80" />

        <el-table-column v-if="orderInfo.type == '1'" prop="price" label="计税单价" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.taxable_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="小计">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.item_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员优惠(元)" width="100">
          <template slot-scope="scope">
            <span
              >{{ scope.row.fee_symbol }}{{ (scope.row.member_discount / 100).toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="总支付价(元)" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.total_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总优惠(元)" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.discount_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="货币汇率">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_rate }}</span>
          </template>
        </el-table-column>
        <template v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_corp">
          <el-table-column label="发货状态">
            <template slot-scope="scope">
              <span>已发货</span>
            </template>
          </el-table-column>
          <el-table-column label="快递公司" width="150px">
            <template slot-scope="scope">
              <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                <el-select v-model="scope.row.delivery_corp" placeholder="请选择快递公司">
                  <el-option
                    v-for="item in dlycorps"
                    :key="item.name"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </span>
              <span v-else>{{ scope.row.delivery_corp_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="快递单号" width="200px">
            <template slot-scope="scope">
              <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                <el-input
                  v-model="scope.row.delivery_code"
                  :maxlength="20"
                  placeholder="物流公司单号"
                />
              </span>
              <span v-else>{{ scope.row.delivery_code }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="
                  update(scope.row.delivery_corp, scope.row.delivery_code, scope.row)
                "
              >
                确认修改
              </el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './CustomCard'
export default {
  components: {
    CustomCard
  },
  props: ['orderInfo', 'memberInfo', 'dlycorps'],
  data() {
    const self = this
    return {}
  },
  methods: {
    update(corp, code, row) {
      this.$emit('updatedelivery_', { corp, code, row })
    }
  }
}
</script>

<style scoped>
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
