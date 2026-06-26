<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<script>
export default {
  name: 'SpRouterView',
  data() {
    return {
      currentRoute: null
    }
  },
  computed: {
    routeViewDepth() {
      const depth = this.$parent?.$vnode?.data?.routerViewDepth
      return typeof depth === 'number' ? depth : null
    },
    showRouterView() {
      const { matched } = this.$route
      if (this.routeViewDepth !== null) {
        return matched.length > this.routeViewDepth + 1
      }
      return matched.length === 3
    }
  },
  created() {
    this.currentRoute = this.$route
  },
  render(h) {
    if (this.showRouterView) {
      return h('router-view')
    }
    const nodes = this.$slots.default
    if (!nodes || !nodes.length) {
      return h('span', { style: { display: 'none' }, attrs: { 'aria-hidden': 'true' } })
    }
    if (nodes.length === 1) {
      return nodes[0]
    }
    return h('div', { style: { display: 'contents' } }, nodes)
  },
  methods: {
    onActivated() {
      this.$parent.$activated(this.currentRoute, this.$route)
    }
  }
}
</script>

<style lang="scss" scoped></style>
