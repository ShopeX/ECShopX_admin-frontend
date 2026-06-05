<template>
  <div class="min-h-full">
    <div
      v-if="!isSupportedScene"
      class="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f8faff] to-[#eef3fb] p-6"
    >
      <div
        class="w-full max-w-[480px] rounded-[20px] border border-[#e7ebf3] bg-white p-8 text-center shadow-[0_20px_40px_rgba(31,45,61,0.08)]"
      >
        <div class="text-xl font-semibold text-[#18222f]">
          {{ $t('f9eb643d.dbc2cc') }}
        </div>
        <div class="mt-2.5 mb-5 leading-[22px] text-[#6b7785]">
          {{ $t('f9eb643d.31d83a') }}
        </div>
        <el-button plain @click="decorationHandleBack">
          {{ $t('f9eb643d.5f4112') }}
        </el-button>
      </div>
    </div>

    <SpWebDecoration
      v-else
      :initial-dsl="initialDsl"
      :loading="isLoading"
      :page-type="routePageType"
      :scene="scene"
      :template-id="templateId"
      :title="decorationTitle"
      @save="decorationHandleSave"
    />
  </div>
</template>

<script>
import decorationRouteMixin from './decorationRouteMixin'
import { normalizeDecorationPageType } from '@/components/sp-web-decoration/utils/pageTypes'

const PAGE_TYPE_LABEL_MAP = {
  home: '首页模板',
  index: '首页模板',
  custom: '自定义页模板',
  list: '列表页模板',
  product_list: '商品列表模板',
  header: '标头模板',
  footer: '页脚模板'
}

/**
 * PC 商城装修器入口（全屏 /decoration/web/template/edit 与布局内 /decoration/web/edit/:pageType 共用）
 */
export default {
  name: 'HomeDecorationRoute',
  mixins: [decorationRouteMixin],
  computed: {
    templateId() {
      return String(this.$route.query.id || '')
    },
    scene() {
      return String(this.$route.query.scene || '1001')
    },
    routePageType() {
      const queryPageType = this.$route.query.page_type || this.$route.query.pageType
      return normalizeDecorationPageType(queryPageType || this.$route.params.pageType || 'home')
    },
    decorationTitle() {
      const label = PAGE_TYPE_LABEL_MAP[this.routePageType] || PAGE_TYPE_LABEL_MAP.home
      return `${label}装修`
    },
    isSupportedScene() {
      return this.scene === '1001'
    }
  },
  watch: {
    '$route.fullPath': {
      immediate: true,
      handler() {
        this.decorationBootstrap()
      }
    }
  }
}
</script>
