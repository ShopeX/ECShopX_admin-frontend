<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div v-if="$route.path.indexOf('edit') === -1" class="sms_signatures">
      <SpFinder
        ref="finder"
        :split-count="4"
        :search-row-count="2"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/aliyunsms/sign/list"
      >
        <template #tableTop>
          <div class="mb-5">
            <el-button type="primary" @click="addSignature">{{ $t('523e1e97.156c42') }}</el-button>
            <el-button :loading="syncLoading" @click="syncSignature">{{
              $t('523e1e97.23e901')
            }}</el-button>
          </div>
        </template>
      </SpFinder>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../../../../view/base/shortmessage/finder-setting/sms_signatures'
import { deleteTheSignature, syncSmsSignatures } from '@/api/sms'
export default {
  data() {
    return {
      failVisible: false,
      syncLoading: false,
      syncRefreshTimer: null
    }
  },
  beforeDestroy() {
    if (this.syncRefreshTimer) {
      clearTimeout(this.syncRefreshTimer)
      this.syncRefreshTimer = null
    }
  },
  computed: {
    search_options() {
      return [
        { label: this.$t('523e1e97.b720a6'), value: '0' },
        { label: this.$t('523e1e97.871a30'), value: '1' },
        { label: this.$t('523e1e97.fe3661'), value: '2' }
      ]
    },
    setting() {
      return setting_(this)
    }
  },
  methods: {
    addSignature() {
      this.$router.push({ path: this.matchRoutePath('edit') })
    },
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch() {},
    async syncSignature() {
      if (this.syncLoading) return
      this.syncLoading = true
      try {
        const result = await syncSmsSignatures()
        if (result?.data?.data?.status) {
          // 异步入队成功：仅提示已提交，不展示统计
          this.$message.success(result.data.data.message || this.$t('523e1e97.124550'))
          if (this.syncRefreshTimer) {
            clearTimeout(this.syncRefreshTimer)
          }
          // 延迟刷新列表以感知 upsert / 孤儿清理结果
          this.syncRefreshTimer = setTimeout(() => {
            this.$refs.finder && this.$refs.finder.refresh(true)
            this.syncRefreshTimer = null
          }, 3000)
        }
      } finally {
        this.syncLoading = false
      }
    },
    async deleteSignatureHandle(id) {
      const result = await deleteTheSignature(id)
      this.$message.success(this.$t('523e1e97.0007d1'))
      this.$refs.finder.refresh(true)
      console.log(result)
    }
  }
}
</script>
<style lang="scss">
.sms_signatures {
  .status-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #409eff;
    display: inline-block;
    margin-right: 4px;
    &.fail {
      background: red;
    }
    &.success {
      background: #67c23a;
    }
  }
  .sp-finder-search .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .clearfix span {
    font-weight: 700;
  }
  .search-field {
    width: 500px !important;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
    text-align: center;
  }
}
</style>
