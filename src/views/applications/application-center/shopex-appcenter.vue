<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage
    v-loading="loading && viewMode !== 'iframe'"
    class="user-center-page"
    :no-sticky="true"
  >
    <div v-if="viewMode === 'goods'" v-loading="loading" class="appcenter-embed">
      <div class="appcenter-workspace">
        <div class="appcenter-tabs appcenter-tabs--no-user">
          <div class="appcenter-tabs-main">
            <button type="button" class="appcenter-tab active">应用市场</button>
          </div>
        </div>

        <div class="appcenter-tab-panel active">
          <div
            v-if="!loading && goodsList.length === 0"
            class="appcenter-empty"
          >
            {{ pageInfo.empty_text || '暂无可展示应用' }}
          </div>
          <div v-else class="appcenter-items appcenter-layout-grid">
            <div
              v-for="item in goodsList"
              :key="item.goods_bn"
              class="appcenter-card"
              :data-goods-bn="item.goods_bn"
            >
              <div class="appcenter-card-main">
                <h2>{{ item.display_name || item.goods?.name }}</h2>
                <p>{{ item.goods_bn }}</p>
                <div class="appcenter-meta">
                  <span>商品 BN：{{ item.goods?.bn || item.goods_bn }}</span>
                  <span>价格：¥{{ formatPrice(item.goods?.price) }}</span>
                </div>
              </div>
              <form
                class="appcenter-buy-form"
                @submit.prevent="handleAppClick(item)"
              >
                <button
                  type="submit"
                  class="appcenter-action"
                  :disabled="openingBn === item.goods_bn"
                  data-appcenter-buy="1"
                >
                  {{ openingBn === item.goods_bn ? '处理中...' : '立即购买' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="usercenter-iframe-wrap">
      <iframe
        v-if="iframeUrl"
        :key="iframeUrl"
        :src="iframeUrl"
        class="usercenter-iframe"
        frameborder="0"
        scrolling="auto"
        title="应用中心"
      />
      <div v-else v-loading="loading" class="usercenter-iframe-placeholder" />
    </div>

    <el-dialog
      title="用户中心授权"
      :visible.sync="authDialogVisible"
      width="480px"
      top="12vh"
      append-to-body
      destroy-on-close
      custom-class="usercenter-auth-dialog"
      @closed="handleAuthDialogClosed"
    >
      <iframe
        v-if="authIframeUrl"
        ref="authIframe"
        :key="authIframeUrl"
        :src="authIframeUrl"
        class="usercenter-auth-iframe"
        frameborder="0"
        scrolling="auto"
        title="用户中心授权"
        @load="onAuthIframeLoad"
      />
    </el-dialog>
  </SpPage>
</template>

<script>
import {
  getAppcenterUrl,
  getUsercenterAuthorizeUrl,
  getAppcenterGoods,
  getCertificate,
  loginUsercenter
} from '@/api/company'
import { setUsercenterLoginSuccess } from '@/utils/usercenter-storage'

export default {
  data() {
    return {
      loading: false,
      openingBn: '',
      pageInfo: {},
      goodsList: [],
      channel: 'ecshopx',
      viewMode: 'goods',
      iframeUrl: '',
      authDialogVisible: false,
      authIframeUrl: '',
      authRedirecting: false,
      codeLoginPromise: null
    }
  },
  mounted() {
    this.initPage()
  },
  beforeDestroy() {
    this.codeLoginPromise = null
  },
  methods: {
    async initPage() {
      const code = (this.$route.query.code || '').trim()
      if (code) {
        // 授权回调会先落在弹窗 iframe 内，避免在 iframe 中重复换票
        if (window.self !== window.top) {
          return
        }

        if (this.codeLoginPromise) {
          await this.codeLoginPromise
          return
        }

        this.codeLoginPromise = this.handleOAuthCallback(code)
        try {
          await this.codeLoginPromise
        } finally {
          this.codeLoginPromise = null
        }
        return
      }

      if (await this.hasAppcenterCertificate()) {
        await this.openAppcenterIframe()
        return
      }

      await this.bootstrapGoodsView()
    },
    async handleOAuthCallback(code) {
      const ok = await this.exchangeCodeAndLogin(code)
      if (ok) {
        await this.openAppcenterIframe()
      } else {
        await this.bootstrapGoodsView()
      }
    },
    async hasAppcenterCertificate() {
      try {
        const response = await getCertificate()
        const data = response?.data?.data || {}
        const nodeId = String(data.node_id || '').trim()
        const shopexUid = String(data.shopex_uid || '').trim()
        return !!(nodeId && shopexUid)
      } catch (error) {
        return false
      }
    },
    async bootstrapGoodsView() {
      this.viewMode = 'goods'
      this.iframeUrl = ''
      this.authDialogVisible = false
      this.authIframeUrl = ''
      await this.loadGoods()
    },
    async exchangeCodeAndLogin(code) {
      this.loading = true
      try {
        await loginUsercenter({ code })
        setUsercenterLoginSuccess()
        await this.$router.replace({ path: this.$route.path, query: {} })
        this.$message.success('授权登录成功')
        return true
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        await this.$router.replace({ path: this.$route.path, query: {} })
        return false
      } finally {
        this.loading = false
      }
    },
    async openAppcenterIframe() {
      this.authDialogVisible = false
      this.authIframeUrl = ''
      this.viewMode = 'iframe'
      this.iframeUrl = ''
      this.loading = true
      try {
        this.iframeUrl = await this.fetchAppcenterUrl()
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        await this.bootstrapGoodsView()
      } finally {
        this.loading = false
      }
    },
    async fetchAppcenterUrl() {
      const urlResponse = await getAppcenterUrl()
      const urlData = urlResponse?.data?.data
      const url =
        (typeof urlData === 'string' ? urlData : '') || urlData?.url || ''
      if (!url) {
        throw new Error('获取应用中心地址失败')
      }
      return url
    },
    async loadGoods() {
      this.loading = true
      try {
        const goodsRes = await getAppcenterGoods()
        const data = goodsRes?.data?.data || {}
        this.pageInfo = data.page || {}
        this.goodsList = Array.isArray(data.items) ? data.items : []
        this.channel = data.channel || 'ecshopx'
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        this.goodsList = []
      } finally {
        this.loading = false
      }
    },
    async handleAppClick(item) {
      if (this.openingBn) return
      this.openingBn = item.goods_bn
      try {
        const response = await getUsercenterAuthorizeUrl()
        const data = response?.data?.data
        const url = (typeof data === 'string' ? data : '') || data?.url || ''
        if (!url) {
          this.$message.error('获取授权链接失败')
          return
        }
        this.authRedirecting = false
        this.authIframeUrl = url
        this.authDialogVisible = true
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
      } finally {
        this.openingBn = ''
      }
    },
    handleAuthDialogClosed() {
      this.authIframeUrl = ''
      this.authRedirecting = false
    },
    onAuthIframeLoad() {
      if (!this.authDialogVisible || this.authRedirecting) return

      try {
        const iframe = this.$refs.authIframe
        const loc = iframe?.contentWindow?.location
        if (!loc?.href) return

        const code = new URL(loc.href).searchParams.get('code')
        if (!code) return

        const callbackPath = this.$route.path
        if (!loc.pathname.endsWith(callbackPath)) return

        this.authRedirecting = true
        window.location.href = loc.href
      } catch (e) {
        // 授权页跨域阶段无法读取 iframe 地址，待回调至同源 redirect_uri 后再处理
      }
    },
    formatPrice(price) {
      const num = Number(price)
      if (Number.isNaN(num)) return price || '0.00'
      return num.toFixed(2)
    },
    resolveErrorMessage(error) {
      return (
        error?.data?.data?.message ||
        error?.data?.message ||
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        error?.message ||
        '操作失败'
      )
    }
  }
}
</script>

<style lang="scss">
.sp-page.user-center-page {
  min-height: 0;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;

  .sp-page__content {
    padding: 14px;
    background: #fff;
  }

  .appcenter-embed {
    box-sizing: border-box;
    min-height: calc(100vh - 160px);
    margin: 0;
    padding: 0;
    background: #f5f7fb;
    overflow: hidden;
    color: #263445;
    font-family: 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    text-align: left;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  }

  .appcenter-workspace {
    position: relative;
    margin: 14px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(20, 35, 60, 0.05);
  }

  .appcenter-tabs {
    min-height: 0;
    padding: 0 16px;
    border-bottom: 1px solid #e5ebf3;
    background: #fbfcfe;
    border-radius: 8px 8px 0 0;

    &.appcenter-tabs--no-user {
      padding-right: 16px;
    }
  }

  .appcenter-tabs-main {
    white-space: nowrap;
    overflow: hidden;
  }

  .appcenter-tab {
    display: inline-block;
    margin: 0 22px 0 0;
    padding: 11px 2px 9px;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: #667789;
    font-size: 14px;
    cursor: default;
    outline: none;
    appearance: none;
    -webkit-appearance: none;

    &.active {
      border-bottom-color: #263445;
      color: #1f2d3d;
      font-weight: 600;
    }
  }

  .appcenter-tab-panel {
    display: block;
  }

  .appcenter-items {
    padding: 18px;
  }

  .appcenter-layout-grid {
    font-size: 0;

    .appcenter-card {
      display: inline-block;
      width: 48%;
      margin-right: 1.5%;
      vertical-align: top;
      min-height: 142px;
      font-size: 14px;
    }
  }

  .appcenter-card {
    position: relative;
    box-sizing: border-box;
    margin-bottom: 14px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e4e9f1;
    border-radius: 8px;
    box-shadow: 0 1px 5px rgba(20, 35, 60, 0.06);

    h2 {
      margin: 0 0 8px;
      padding: 0;
      font-size: 17px;
      font-weight: 600;
      color: #1f2d3d;
    }

    p {
      margin: 0 0 12px;
      padding: 0;
      color: #697789;
      font-size: 13px;
      line-height: 1.6;
    }
  }

  .appcenter-meta {
    color: #8a97a6;
    font-size: 12px;

    span {
      display: inline-block;
      margin-right: 12px;
    }
  }

  .appcenter-buy-form {
    margin: 0;
    padding: 0;
  }

  .appcenter-action {
    display: inline-block;
    margin-top: 14px;
    padding: 7px 14px;
    border: 0;
    border-radius: 4px;
    background: #263445;
    color: #fff;
    font-size: 13px;
    line-height: 1.4;
    text-decoration: none;
    cursor: pointer;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
  }

  button.appcenter-action[disabled] {
    background: #a6b0bd;
    cursor: default;
  }

  .appcenter-empty {
    margin: 22px 18px;
    padding: 36px 16px;
    border: 1px dashed #ccd5e2;
    border-radius: 8px;
    background: #fff;
    color: #8a97a6;
    text-align: center;
  }

  .appcenter-card-main {
    display: block;
  }

  .usercenter-iframe-wrap {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 160px);
    background: #f5f7fb;
    overflow: hidden;
  }

  .usercenter-iframe {
    flex: 1;
    width: 100%;
    min-height: 520px;
    border: 0;
    background: #fff;
  }

  .usercenter-iframe-placeholder {
    flex: 1;
    min-height: 520px;
  }

  @media (max-width: 640px) {
    .sp-page__content {
      padding: 14px;
    }

    .appcenter-layout-grid .appcenter-card {
      display: block;
      width: auto;
      margin-right: 0;
    }
  }
}

.usercenter-auth-dialog {
  max-width: calc(100vw - 32px);
  border-radius: 8px;
  overflow: hidden;

  .el-dialog__header {
    padding: 14px 20px 10px;
  }

  .el-dialog__title {
    font-size: 16px;
    line-height: 1.4;
  }

  .el-dialog__body {
    padding: 0;
    height: 420px;
    overflow: hidden;
  }

  .usercenter-auth-iframe {
    display: block;
    width: 100%;
    height: 420px;
    border: 0;
    background: #fff;
  }
}
</style>
