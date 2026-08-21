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
        url="/aliyunsms/template/list"
      >
        <template #tableTop>
          <div class="mb-5">
            <el-button type="primary" @click="addTemplate">{{ $t('ae4ac261.6fef15') }}</el-button>
            <el-button :loading="syncLoading" @click="syncTemplate">同步已有模板</el-button>
          </div>
        </template>
      </SpFinder>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../../../../view/base/shortmessage/finder-setting/sms_template'
import { deleteSmsTemplate, syncSmsTemplates } from '@/api/sms'
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
        { label: this.$t('ae4ac261.b720a6'), value: '0' },
        { label: this.$t('ae4ac261.871a30'), value: '1' },
        { label: this.$t('ae4ac261.fe3661'), value: '2' }
      ]
    },
    sceneAssignedOptions() {
      return [
        { label: '全部', value: '' },
        { label: '仅看已绑定场景模板', value: '1' },
        { label: '仅看未分配模板', value: '0' }
      ]
    },
    setting() {
      return setting_(this)
    }
  },
  methods: {
    addTemplate() {
      this.$router.push({ path: this.matchRoutePath('edit') })
    },
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch() {},
    async syncTemplate() {
      if (this.syncLoading) return
      this.syncLoading = true
      try {
        const result = await syncSmsTemplates()
        if (result?.data?.data?.status) {
          this.$message.success(result.data.data.message || '同步任务已提交')
          if (this.syncRefreshTimer) {
            clearTimeout(this.syncRefreshTimer)
          }
          this.syncRefreshTimer = setTimeout(() => {
            this.$refs.finder && this.$refs.finder.refresh(true)
            this.syncRefreshTimer = null
          }, 3000)
        }
      } finally {
        this.syncLoading = false
      }
    },
    async deleteTemplateHandle(id) {
      const result = await deleteSmsTemplate(id)
      this.$message.success(this.$t('ae4ac261.0007d1'))
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
