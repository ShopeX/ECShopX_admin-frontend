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
          </div>
        </template>
      </SpFinder>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../../../../view/base/shortmessage/finder-setting/sms_template'
import { deleteSmsTemplate } from '@/api/sms'
export default {
  data() {
    return {
      failVisible: false
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
