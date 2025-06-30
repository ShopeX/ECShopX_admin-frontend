<template>
  <div
    class="sp-page p-4 h-full flex flex-col"
    :class="{
      'sp-page--no-header': !hasHeader,
      'sp-page--no-footer': !hasFooter,
      'sp-page--sticky': isSticky
    }"
    ref="pageContainer"
  >
    <div class="sp-page__header py-4 pl-5 pr-4 flex items-center bg-white" ref="header">
      <div class="sp-page__header-title">{{ title }}</div>
      <div class="sp-page__header-toolbar flex-1">
        <slot name="page-header" />
        <slot name="page-common" :is-sticky="isSticky" />
      </div>
    </div>
    <div class="sp-page__content p-4 bg-white flex-1">
      <slot />
    </div>
    <div class="sp-page__footer py-4 bg-white">
      <slot name="page-footer" />
      <slot name="page-common" :is-sticky="isSticky" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpPage',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isSticky: false
    }
  },
  computed: {
    hasHeader() {
      return this.title || this.$scopedSlots['page-header'] || this.$scopedSlots['page-common']
    },
    hasFooter() {
      return this.$scopedSlots['page-footer'] || this.$scopedSlots['page-common']
    }
  },
  created() {},
  mounted() {
    this.initStickyHeader()
  },
  beforeDestroy() {
    this.removeScrollListener()
  },
  methods: {
    initStickyHeader() {
      document.getElementById('page-container').addEventListener('scroll', this.handleScroll)
    },
    handleScroll() {
      if (!this.$refs.header) return

      if (document.getElementById('page-container').scrollTop > 60) {
        this.isSticky = true
      } else {
        this.isSticky = false
      }
    },
    removeScrollListener() {
      if (document.getElementById('page-container')) {
        document.getElementById('page-container').removeEventListener('scroll', this.handleScroll)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-page {
  // border-radius: 6px;
  &--sticky {
    .sp-page__footer {
      position: sticky;
      bottom: 0;
      z-index: 100;
    }
  }
  &--no-header {
    .sp-page__header {
      display: none;
    }
    .sp-page__content {
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
    }
  }
  &--no-footer {
    .sp-page__footer {
      display: none;
    }
    .sp-page__content {
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
    }
  }

  &__header {
    border-radius: 6px 6px 0 0;
    &-title {
      font-size: 22px;
      color: #333;
    }
  }

  &__footer {
    border-radius: 0 0 6px 6px;
    transition: all 0.3s ease;
  }
}
</style>
