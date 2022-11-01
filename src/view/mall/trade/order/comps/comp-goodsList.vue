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
    <div v-for="(item, index) in items" :key="`goods-item-${index}`" class="goods-item">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompGoodsList',
  props: ['value'],
  data() {
    return {
      items: []
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
