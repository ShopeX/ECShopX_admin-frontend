<template>
  <div class="sp-goods-group">
    <div v-if="localValue.length == 0" class="sp-goods-group__empty">
      <el-empty description="暂无商品" :image-size="60" />
    </div>
    <div v-else class="sp-goods-group__list" :style="computedStyle">
      <SpGoodsCard v-for="(item, index) in localValue" :key="item.item_id" :info="item">
        <template slot="delete">
          <span class="sp-goods-card__delete">
            <i class="iconfont icon-trash-alt1" @click="handleDelete(item, index)" />
          </span>
        </template>
      </SpGoodsCard>
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
  data() {
    return {
      localValue: this.value
    }
  },
  computed: {
    computedStyle() {
      return {
        gridTemplateColumns: `repeat(${this.columns}, 1fr)`
      }
    }
  },
  watch: {
    value(val) {
      this.localValue = val
    }
  },
  methods: {
    handleDelete(item, index) {
      this.localValue.splice(index, 1)
      this.$emit('input', this.localValue)
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
