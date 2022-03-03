<template>
  <div class="finder view-flex view-flex-middle">
    <slot />
    <div class="view-flex-item">
      <el-input
        v-model="keywords"
        placeholder="请输入内容"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearch"
        />
      </el-input>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      keywords: '',
      store: ''
    }
  },
  methods: {
    handleSearch () {
      this.$emit('onSearch', this.keywords)
    },
    handleChange () {
      this.$emit('onChange', this.distributor)
    }
  }
}
</script>

<style scoped lang="scss">
.finder {
  margin-bottom: 20px;
}
.store-picker {
  padding: 0 20px;
  margin-right: 20px;
  height: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 3px;
  &:hover {
    background: #f5f7fa;
  }
  .store-info {
    padding-right: 20px;
  }
  .store-name {
    @include text-overflow();
  }
  .store-address {
    @include text-overflow();
    font-size: 12px;
    color: #999;
  }
}
</style>
