<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-button :type="type" :size="size" :loading="loading" @click="btnHandle">
    {{ text || $t('c4bbc9c6.38cf16') }}
  </el-button>
</template>

<script>
export default {
  props: {
    size: {
      default: 'medium'
    },
    type: {
      default: 'primary'
    },
    text: {
      default: ''
    }
  },

  data() {
    return {
      loading: false
    }
  },
  methods: {
    btnHandle() {
      this.loading = true
      this.$emit('clickHandle')
    },
    closeLoading() {
      this.loading = false
    }
  }
}
</script>

<style></style>
