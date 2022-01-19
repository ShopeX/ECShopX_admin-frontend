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
    const { distributor_id, address, name } = this.$route.query
    this.store = {
      id: distributor_id,
      address,
      name
    }
  }
}
</script>
