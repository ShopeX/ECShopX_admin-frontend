<template lang="html">
  <div>
    <alllist v-if="$route.path.indexOf('editor') === -1" ref="alllist" :get-status="alllist" />
    <router-view />
  </div>
</template>

<script>
import alllist from './list.vue'

export default {
  provide() {
    return {
      refresh: this.refresh
    }
  },
  components: {
    alllist
  },
  data() {
    return {
      activeName: 'first',
      alllist: true
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'first') {
      this.alllist = true
    }
  },
  methods: {
    //充值送钱
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.alllist = true
      }
    },
    refresh() {
      this.$refs.getActivityLists
      this.$refs.getCurrencyInfo
    }
  }
}
</script>

<style scoped lang="scss"></style>
