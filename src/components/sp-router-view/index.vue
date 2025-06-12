<template>
  <div class="sp-router-view">
    <div v-show="!showRouterView">
      <slot />
    </div>
    <div v-show="showRouterView">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpRouterView',
  data() {
    return {
      currentRoute: null
    }
  },
  computed: {
    showRouterView() {
      const { matched } = this.$route
      return matched.length == 3
    }
  },
  created() {
    this.currentRoute = this.$route
  },
  methods: {
    onActivated() {
      this.$parent.$activated(this.currentRoute, this.$route)
    }
  }
}
</script>

<style lang="scss" scoped></style>
