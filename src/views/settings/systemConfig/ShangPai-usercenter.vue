<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage v-loading="loading">
    <div v-if="loggedIn" class="user-center-info">
      <SpFormPlus
        v-model="userInfo"
        :form-items="formItems"
        form-type="form"
        label-width="150px"
        :show-default-actions="false"
      />
      <div class="user-center-actions">
        <el-button type="primary" @click="openUserCenter">进入用户中心</el-button>
      </div>
    </div>
    <div v-else-if="authorizeUrl" class="user-center-iframe-wrap">
      <iframe
        :src="authorizeUrl"
        class="user-center-iframe"
        frameborder="0"
        scrolling="auto"
        title="商派用户中心登录"
      />
    </div>
  </SpPage>
</template>

<script>
import { getCertificate, getUsercenterAuthorizeUrl, loginUsercenter } from '@/api/company'

export default {
  data() {
    return {
      loading: false,
      loggedIn: false,
      authorizeUrl: '',
      userInfo: {
        node_id: '',
        shopex_uid: ''
      }
    }
  },
  computed: {
    formItems() {
      return [
        {
          fieldName: '__group_title',
          component: 'group',
          label: '商派用户中心'
        },
        {
          fieldName: 'node_id',
          label: this.$t('ef95ad08.cdd576'),
          formItemClass: 'w-1/2',
          component: 'input',
          componentProps: {
            readonly: true
          }
        },
        {
          fieldName: 'shopex_uid',
          label: 'Shopex ID',
          formItemClass: 'w-1/2',
          component: 'input',
          componentProps: {
            readonly: true
          }
        }
      ]
    }
  },
  mounted() {
    if (this.bubbleIframeCallbackToTop()) return
    this.initPage()
  },
  methods: {
    bubbleIframeCallbackToTop() {
      try {
        const inIframe = window.self !== window.top
        if (!inIframe) return false
        const code = (this.$route.query.code || '').trim()
        if (!code) return false
        this.loading = true
        window.top.location.href = window.location.href
        return true
      } catch (e) {
        return false
      }
    },
    async initPage() {
      const code = (this.$route.query.code || '').trim()
      if (code) {
        await this.exchangeCodeAndLogin(code)
        return
      }
      await this.loadPageState()
    },
    async exchangeCodeAndLogin(code) {
      this.loading = true
      this.loggedIn = false
      this.authorizeUrl = ''
      try {
        await loginUsercenter({ code })
        await this.$router.replace({ path: this.$route.path, query: {} })
        await this.loadPageState()
      } catch (error) {
        const errMsg =
          error?.data?.data?.message ||
          error?.data?.message ||
          error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          error?.message ||
          this.$t('1f7b7edc.f50bf4')
        this.$message.error(errMsg)
        await this.$router.replace({ path: this.$route.path, query: {} })
        await this.loadPageState()
      } finally {
        this.loading = false
      }
    },
    async loadPageState() {
      this.loading = true
      this.loggedIn = false
      this.authorizeUrl = ''
      try {
        const loggedIn = await this.loadLoggedInInfo()
        if (!loggedIn) {
          await this.loadAuthorizeIframe()
        }
      } catch (error) {
        await this.loadAuthorizeIframe()
      } finally {
        this.loading = false
      }
    },
    async loadLoggedInInfo() {
      const response = await getCertificate()
      const data = response?.data?.data || {}
      const nodeId = (data.node_id || '').trim()
      if (!nodeId) {
        return false
      }
      this.loggedIn = true
      this.userInfo = {
        node_id: nodeId,
        shopex_uid: (data.shopex_uid || '').trim()
      }
      return true
    },
    async loadAuthorizeIframe() {
      const response = await getUsercenterAuthorizeUrl()
      const data = response?.data?.data
      this.authorizeUrl =
        (typeof data === 'string' ? data : '') || data?.url || ''
      if (!this.authorizeUrl) {
        this.$message.error(this.$t('1f7b7edc.f50bf4'))
      }
    },
    openUserCenter() {
      window.open('https://www.shopex.cn', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.user-center-info {
  max-width: 800px;
}

.user-center-actions {
  padding-left: 150px;
  margin-top: 8px;
}

.user-center-iframe-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 180px);
  padding: 24px 0;
  background: #fff;
}

.user-center-iframe {
  width: 100%;
  max-width: 480px;
  min-height: 520px;
  border: none;
}
</style>
