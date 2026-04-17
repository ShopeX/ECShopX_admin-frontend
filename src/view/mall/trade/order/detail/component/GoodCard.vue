<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <CustomCard :title="$t('67233cd4.08ea4e')">
    <div v-if="orderInfo.order_type == 'service' || orderInfo.order_type == 'bargain'">
      <el-row>
        <el-col :span="3"> {{ $t('67233cd4.90f08f') }} </el-col>
        <el-col :span="5">
          {{ orderInfo.title }}
        </el-col>
        <el-col :span="3"> {{ $t('67233cd4.65b739') }} </el-col>
        <el-col :span="5">
          {{ orderInfo.item_num }}
        </el-col>
      </el-row>
    </div>

    <div v-else-if="orderInfo.order_type == 'normal'">
      <el-table :data="orderInfo.items" style="width: 100%" size="small">
        <el-table-column prop="item_id" :label="$t('67233cd4.858526')" width="80" />
        <el-table-column class="goods-img" prop="pic" :label="$t('67233cd4.9b94b1')" width="120">
          <template slot-scope="scope">
            <span>
              <img
                class="item-image"
                :src="wximageurl + scope.row.pic"
                :alt="scope.row.item_name"
              />
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="item_name" :label="$t('67233cd4.1fd1d5')" width="180">
          <template slot-scope="scope">
            <div class="ell3">
              {{ scope.row.item_name }}
            </div>
            <el-tag v-if="scope.row.order_item_type == 'gift'" size="mini" type="success">
              {{ $t('67233cd4.d017cc') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('67233cd4.da4abd')" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.price / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="item_spec_desc" :label="$t('67233cd4.ea887b')" width="180">
          <template slot-scope="scope">
            {{ scope.row.item_spec_desc ? scope.row.item_spec_desc : $t('67233cd4.048df4') }}
          </template>
        </el-table-column>
        <el-table-column prop="num" :label="$t('67233cd4.0bf60b')" width="80" />

        <el-table-column
          v-if="orderInfo.type == '1'"
          prop="price"
          :label="$t('67233cd4.18acc2')"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.taxable_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('67233cd4.f599fc')">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.item_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('67233cd4.4b7a91')" width="100">
          <template slot-scope="scope">
            <span
              >{{ scope.row.fee_symbol }}{{ (scope.row.member_discount / 100).toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('67233cd4.6943ad')" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.total_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('67233cd4.913be1')" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_symbol }}{{ (scope.row.discount_fee / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('67233cd4.f8d735')">
          <template slot-scope="scope">
            <span>{{ scope.row.fee_rate }}</span>
          </template>
        </el-table-column>
        <template v-if="orderInfo.delivery_status == 'DONE' && orderInfo.delivery_corp">
          <el-table-column :label="$t('67233cd4.c3c7a1')">
            <template slot-scope="_">
              <span>{{ $t('67233cd4.355409') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('67233cd4.f3af96')" width="150px">
            <template slot-scope="scope">
              <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                <el-select v-model="scope.row.delivery_corp" :placeholder="$t('67233cd4.8367e8')">
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
          <el-table-column :label="$t('67233cd4.3c016d')" width="200px">
            <template slot-scope="scope">
              <span v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'">
                <el-input
                  v-model="scope.row.delivery_code"
                  :maxlength="20"
                  :placeholder="$t('67233cd4.0e9f1e')"
                />
              </span>
              <span v-else>{{ scope.row.delivery_code }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="orderInfo.order_status == 'WAIT_BUYER_CONFIRM'"
            :label="$t('67233cd4.2b6bc0')"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="
                  update(scope.row.delivery_corp, scope.row.delivery_code, scope.row)
                "
              >
                {{ $t('67233cd4.49e56c') }}
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
