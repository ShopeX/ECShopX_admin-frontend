<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading && !dialogVisible" class="user-center-page">
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      custom-class="user-center-app-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="handleDialogClosed"
    >
      <div v-loading="loading" class="appcenter-embed">
        <div class="appcenter-hero" :style="heroStyle">
          <div class="appcenter-badge">应用中心</div>
          <h1>{{ pageInfo.title || channel }}</h1>
          <p v-if="pageInfo.description">{{ pageInfo.description }}</p>
        </div>

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
            <form class="appcenter-buy-form" @submit.prevent="handleBuy(item)">
              <button
                type="submit"
                class="appcenter-action"
                :disabled="buyingBn === item.goods_bn"
                data-appcenter-buy="1"
              >
                {{ buyingBn === item.goods_bn ? '处理中...' : '立即购买' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </el-dialog>
  </SpPage>
</template>

<script>
import {
  getAppcenterUrl,
  getUsercenterAuthorizeUrl,
  getAppcenterGoods,
  loginUsercenter
} from '@/api/company'
import {
  isUsercenterLoggedIn,
  setUsercenterLoginSuccess
} from '@/utils/usercenter-storage'

export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      buyingBn: '',
      pageInfo: {},
      goodsList: [],
      openBaseUrl: '',
      channel: 'ecshopx'
    }
  },
  computed: {
    heroStyle() {
      const color = this.pageInfo.theme_color || '#2f80ed'
      return { background: color }
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    async initPage() {
      const code = (this.$route.query.code || '').trim()
      if (code) {
        const redirected = await this.exchangeCodeAndLogin(code)
        if (redirected) {
          return
        }
      }

      if (isUsercenterLoggedIn()) {
        this.loading = true
        try {
          await this.redirectToAppcenter()
          return
        } catch (error) {
          this.$message.error(this.resolveErrorMessage(error))
        } finally {
          this.loading = false
        }
      }

      this.dialogVisible = true
      await this.loadGoods()
    },
    async exchangeCodeAndLogin(code) {
      this.loading = true
      try {
        await loginUsercenter({ code })
        setUsercenterLoginSuccess()
        await this.$router.replace({ path: this.$route.path, query: {} })
        this.$message.success('授权登录成功')
        await this.redirectToAppcenter()
        return true
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        await this.$router.replace({ path: this.$route.path, query: {} })
        return false
      } finally {
        this.loading = false
      }
    },
    async redirectToAppcenter() {
      const urlResponse = await getAppcenterUrl()
      const urlData = urlResponse?.data?.data
      const appcenterUrl =
        (typeof urlData === 'string' ? urlData : '') || urlData?.url || ''
      if (!appcenterUrl) {
        throw new Error('获取用户中心地址失败')
      }
      window.location.href = appcenterUrl
    },
    async loadGoods() {
      this.loading = true
      try {
        const goodsRes = await getAppcenterGoods()
        const data = goodsRes?.data?.data || {}
        this.pageInfo = data.page || {}
        this.goodsList = Array.isArray(data.items) ? data.items : []
        this.channel = data.channel || 'ecshopx'
        this.openBaseUrl = (data.open_base_url || '').replace(/\/$/, '')
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
        this.goodsList = []
      } finally {
        this.loading = false
      }
    },
    async handleBuy(item) {
      if (this.buyingBn) return
      this.buyingBn = item.goods_bn
      try {
        const response = await getUsercenterAuthorizeUrl()
        const data = response?.data?.data
        const url = (typeof data === 'string' ? data : '') || data?.url || ''
        if (!url) {
          this.$message.error('获取授权链接失败')
          return
        }
        window.location.href = url
      } catch (error) {
        this.$message.error(this.resolveErrorMessage(error))
      } finally {
        this.buyingBn = ''
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
    },
    handleDialogClosed() {
      if (this.$route.query.code) return
      this.$router.back()
    }
  }
}
</script>

<style lang="scss">
.user-center-app-dialog {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
    height: 100vh;
    overflow: auto;
    background: #f5f7fb;
  }
}
</style>

<style lang="scss" scoped>
.user-center-page {
  min-height: 0;
}

.appcenter-embed {
  min-height: 100vh;
}

.appcenter-hero {
  padding: 24px 28px;
  color: #fff;
}

.appcenter-hero h1 {
  margin: 8px 0 6px;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 600;
}

.appcenter-hero p {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
  line-height: 1.6;
}

.appcenter-badge {
  display: inline-block;
  padding: 3px 8px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  font-size: 12px;
  opacity: 0.95;
}

.appcenter-userbar {
  display: table;
  width: calc(100% - 36px);
  box-sizing: border-box;
  margin: -16px 18px 0;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e1e7f0;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(24, 42, 68, 0.1);
}

.appcenter-user-main {
  display: table-cell;
  vertical-align: middle;
}

.appcenter-user-hover {
  position: relative;
  display: inline-block;
  padding-right: 8px;
  cursor: default;
}

.appcenter-avatar {
  display: inline-block;
  width: 34px;
  height: 34px;
  margin-right: 10px;
  border-radius: 50%;
  background: #263445;
  color: #fff;
  line-height: 34px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  vertical-align: middle;
}

.appcenter-user-text {
  display: inline-block;
  vertical-align: middle;
}

.appcenter-user-title {
  color: #1f2d3d;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.appcenter-cert {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 7px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
}

.appcenter-cert-ok {
  background: #e8f7ef;
  color: #278052;
}

.appcenter-cert-warn {
  background: #fff1df;
  color: #a45c00;
}

.appcenter-user-actions {
  display: table-cell;
  width: 180px;
  vertical-align: middle;
  white-space: nowrap;
  text-align: right;
}

.appcenter-user-actions a,
.appcenter-user-actions button {
  display: inline-block;
  margin-left: 8px;
  padding: 6px 10px;
  border: 1px solid #d7dfeb;
  border-radius: 4px;
  color: #263445;
  background: #fbfcfe;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
  line-height: 1.4;
}

.appcenter-user-actions a:hover,
.appcenter-user-actions button:hover {
  border-color: #263445;
  background: #f2f5f9;
}

.appcenter-user-popover {
  display: none;
  position: absolute;
  z-index: 20;
  top: 42px;
  left: 0;
  width: 260px;
  padding: 14px;
  background: #fff;
  border: 1px solid #dfe6ef;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(20, 35, 60, 0.18);
}

.appcenter-user-popover:before {
  content: '';
  position: absolute;
  top: -7px;
  left: 18px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-left: 1px solid #dfe6ef;
  border-top: 1px solid #dfe6ef;
  transform: rotate(45deg);
}

.appcenter-user-hover:hover .appcenter-user-popover {
  display: block;
}

.appcenter-popover-title {
  margin-bottom: 10px;
  color: #1f2d3d;
  font-size: 13px;
  font-weight: 600;
}

.appcenter-user-popover dl {
  margin: 0;
  color: #5f6f81;
  font-size: 12px;
  line-height: 1.7;
}

.appcenter-user-popover dt {
  float: left;
  clear: left;
  width: 68px;
  color: #8a97a6;
}

.appcenter-user-popover dd {
  margin: 0 0 3px 68px;
  word-break: break-all;
}

.appcenter-items {
  padding: 18px;
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
}

.appcenter-layout-grid .appcenter-card {
  display: inline-block;
  width: 48%;
  margin-right: 1.5%;
  vertical-align: top;
  min-height: 142px;
}

.appcenter-card h2 {
  margin: 0 0 8px;
  font-size: 17px;
  color: #1f2d3d;
}

.appcenter-card p {
  margin: 0 0 12px;
  color: #697789;
  font-size: 13px;
  line-height: 1.6;
}

.appcenter-meta {
  color: #8a97a6;
  font-size: 12px;
}

.appcenter-meta span {
  display: inline-block;
  margin-right: 12px;
}

.appcenter-action {
  display: inline-block;
  margin-top: 14px;
  padding: 7px 14px;
  border-radius: 4px;
  border: 0;
  background: #263445;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  cursor: pointer;
}

.appcenter-buy-form {
  margin: 0;
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

@media (max-width: 640px) {
  .appcenter-hero {
    padding: 20px 18px;
  }

  .appcenter-userbar {
    display: block;
    margin: -10px 12px 0;
    padding: 12px;
  }

  .appcenter-user-main {
    display: block;
    min-width: 0;
  }

  .appcenter-user-popover {
    left: -4px;
    width: 236px;
  }

  .appcenter-user-actions {
    display: block;
    margin-top: 10px;
    text-align: left;
    white-space: normal;
  }

  .appcenter-user-actions a,
  .appcenter-user-actions button {
    margin: 0 6px 6px 0;
  }

  .appcenter-layout-grid .appcenter-card {
    display: block;
    width: auto;
    margin-right: 0;
  }
}
</style>
