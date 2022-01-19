<template>
  <div>
    <shopDecoration :id="current" />
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import shopDecoration from '@/components/function/shopDecoration'
export default {
  data() {
    return {
      current: ''
    }
  },
  components: {
    shopDecoration
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
