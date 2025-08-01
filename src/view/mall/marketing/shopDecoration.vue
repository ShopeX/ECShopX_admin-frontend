<template>
  <div>
    <shopDecoration :id="current" />
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import shopDecoration from '@/components/function/shopDecoration'
export default {
  components: {
    shopDecoration
  },
  data() {
    return {
      current: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
