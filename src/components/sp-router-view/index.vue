<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="sp-router-view">
    <!--
      必须用 v-show 而不是 v-if/互斥 render：
      从子路由返回列表时若销毁再挂载 slot，重页面（多 Tab/表格/弹框）会主线程卡死。
      v-show 保活列表，仅切换显示，避免 ECX-9651 / ECX-9845 类问题。
    -->
    <div v-show="!showRouterView" class="sp-router-view__list">
      <slot />
    </div>
    <router-view v-show="showRouterView" :key="routerViewKey" />
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
    routeViewDepth() {
      const depth = this.$parent?.$vnode?.data?.routerViewDepth
      return typeof depth === 'number' ? depth : null
    },
    showRouterView() {
      const { matched } = this.$route
      if (this.routeViewDepth !== null) {
        return matched.length > this.routeViewDepth + 1
      }
      // 通过父页面在 matched 中的位置判断，避免 matched.length === 3 在不同路由层级失效
      const parentIndex = matched.findIndex(
        (record) => record.instances && record.instances.default === this.$parent
      )
      if (parentIndex !== -1) {
        return matched.length > parentIndex + 1
      }
      return /\/(editor|detail|info)(?:\/|$)/.test(this.$route.path)
    },
    routerViewKey() {
      return this.showRouterView ? this.$route.fullPath : 'sp-router-view-list'
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
    onActivated(resetPage) {
      if (typeof this.$parent.$activated === 'function') {
        this.$parent.$activated(this.currentRoute, this.$route, resetPage)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
