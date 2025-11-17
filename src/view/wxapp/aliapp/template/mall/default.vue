<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <MallList v-if="store" :rel-store="store" />
  </div>
</template>

<script>
import MallList from '@/components/function/mallList'
export default {
  components: {
    MallList
  },
  data() {
    return {
      store: null
    }
  },
  mounted() {
    this.store = { id: '0' }
  }
}
</script>
