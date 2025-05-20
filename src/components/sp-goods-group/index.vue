<template>
  <div class="sp-goods-group">
    <div v-if="value.length == 0" class="sp-goods-group__empty">暂无商品</div>
    <div v-else class="sp-goods-group__list" :style="computedStyle">
      <SpGoodsCard v-for="item in value" :key="item.item_id" :info="item" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpGoodsGroup',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Number,
      default: 2
    }
  },
  computed: {
    computedStyle() {
      return {
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-goods-group {
  background-color: #f5f5f5;
  padding: 10px;

  &__empty {
    text-align: center;
    color: #999;
  }

  &__list {
    display: grid;
    gap: 10px;
  }

  .sp-goods-card {
  }
}
</style>
