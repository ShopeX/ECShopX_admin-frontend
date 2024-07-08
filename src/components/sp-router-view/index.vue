<style lang="scss"></style>
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
    return {}
  },
  computed: {
    showRouterView() {
      const { matched } = this.$route
      return matched.length == 3
    }
  },
  created() {},
  methods: {
    onHooksRouteBack() {
      this.$parent.onHooksRouteBack()
    }
  }
}
</script>
