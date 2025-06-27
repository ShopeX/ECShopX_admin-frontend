<template>
  <div
    class="sp-page p-4 h-full flex flex-col"
    :class="{
      'sp-page--no-header': !title && !$slots['page-header'],
      'sp-page--sticky': isSticky
    }"
    ref="pageContainer"
  >
    <div
      v-if="title || $slots['page-header']"
      class="sp-page__header py-4 pl-5 pr-4 flex items-center bg-white"
      ref="header"
    >
      <div class="sp-page__header-title">{{ title }}</div>
      <div class="sp-page__header-toolbar flex-1">
        <slot name="page-header" />
      </div>
    </div>
    <div class="sp-page__content p-4 bg-white flex-1">
      <slot />
    </div>
    <div class="sp-page__footer py-4 bg-white">
      <slot name="page-footer" />
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
  &--sticky {
    .sp-page__footer {
      position: sticky;
      bottom: 0;
      z-index: 100;
    }
  }
  &__header {
    border-radius: 6px 6px 0 0;

    &-title {
      font-size: 22px;
      color: #333;
    }
  }

  &__content {
    border-radius: 0 0 6px 6px;
  }

  .sp-page__footer {
    transition: all 0.3s ease;
  }

  &--no-header {
    .sp-page__content {
      border-radius: 6px;
    }
  }
}
</style>
