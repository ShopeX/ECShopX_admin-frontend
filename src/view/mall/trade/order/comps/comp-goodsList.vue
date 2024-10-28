<style lang="scss">
.comp-goods-list {
  margin-top: 10px;
  .goods-item {
    display: flex;
    align-items: center;
    &:not(:first-child) {
      margin-top: 10px;
    }
  }
  .item-checkbox {
    margin-right: 10px;
  }
  .item-image {
    width: 72px;
    height: 72px;
    margin-right: 10px;
  }

  .item-info {
    line-height: 20px;
  }
  .spec-desc {
    font-size: 13px;
    color: #888;
  }
  .el-input__inner {
    border-color: #d9d9d9 !important;
  }
}
</style>
<template>
  <div v-if="value" class="comp-goods-list">
    <el-table :data="items">
      <el-table-column width="60">
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            :disabled="!scope.row.left_aftersales_num"
            class="item-checkbox"
            @change="onChangeItem"
          />
        </template>
      </el-table-column>
      <el-table-column prop="pic" label="商品图片" width="120">
        <template slot-scope="scope">
          <el-image class="item-image" :src="scope.row.pic" fit="fit" />
        </template>
      </el-table-column>
      <el-table-column label="商品参数" width="180">
        <template slot-scope="scope">
          <div class="item-info">
            <div class="item-name">{{ scope.row.item_name }}</div>
            <div class="item-price">{{ `¥${scope.row.total_fee / scope.row.num / 100}` }}</div>
            <div v-if="scope.row.item_spec_desc" class="spec-desc">
              {{ `规格：${scope.row.item_spec_desc}` }}
            </div>
            <el-input-number
              v-model="scope.row.refundNum"
              size="mini"
              :disabled="!scope.row.left_aftersales_num"
              :step="1"
              :min="1"
              :max="scope.row.left_aftersales_num"
              @change="onChangeItem"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="point_fee" label="抵扣积分" width="120">
        <template slot-scope="scope">
          {{ scope.row.point_fee / 100 }}
        </template>
      </el-table-column>
      <el-table-column v-if="!VERSION_STANDARD" prop="pic" label="成本价(¥)" width="120">
        <template slot-scope="scope">
          {{ scope.row.fee_symbol }}{{ scope.row.cost_price / 100 }}
        </template>
      </el-table-column>
      <el-table-column prop="item_holder" label="商品类型" width="100">
        <template slot-scope="scope">
          <div class="ell3">
            {{ goodCategoryMap[scope.row.item_holder] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="supplier_name" label="来源供应商" width="100"></el-table-column>
    </el-table>

    <!-- <div v-for="(item, index) in items" :key="`goods-item-${index}`" class="goods-item">
      <el-checkbox
        v-model="item.checked"
        :disabled="!item.left_aftersales_num"
        class="item-checkbox"
        @change="onChangeItem"
      />
      <el-image class="item-image" :src="item.pic" fit="fit" />
      <div class="item-info">
        <div class="item-name">{{ item.item_name }}</div>
        <div class="item-price">{{ `¥${item.total_fee / item.num / 100}` }}</div>
        <div v-if="item.item_spec_desc" class="spec-desc">{{ `规格：${item.item_spec_desc}` }}</div>
        <el-input-number
          v-model="item.refundNum"
          size="mini"
          :disabled="!item.left_aftersales_num"
          :step="1"
          :min="1"
          :max="item.left_aftersales_num"
          @change="onChangeItem"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
import { GOOD_CATEGORY_MAP } from '@/consts'
export default {
  name: 'CompGoodsList',
  props: ['value'],
  data() {
    return {
      items: [],
      goodCategoryMap: GOOD_CATEGORY_MAP
    }
  },
  watch: {
    value: function (val) {
      this.items = val.items
      // this.items = val.items.map((item) => {
      //   return {
      //     ...item,
      //     // checked: false
      //   }
      // })
    }
  },
  created() {},
  methods: {
    onChangeItem() {
      const items = this.items
        .filter((item) => item.checked)
        .map((item) => {
          return {
            id: item.id,
            num: item.refundNum
          }
        })
      this.$emit('onChange', items)
    },
    setSelectAllGoods() {
      this.items.forEach((item) => {
        if (item.left_aftersales_num) {
          item.checked = true
          item.refundNum = item.left_aftersales_num
        }
      })
      this.onChangeItem()
    }
  }
}
</script>
