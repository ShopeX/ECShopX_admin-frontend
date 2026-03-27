<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="sms_signatures">
      <SpFinder
        ref="finder"
        :split-count="4"
        :search-row-count="4"
        :fixed-row-action="true"
        :setting="setting"
        no-selection
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/aliyunsms/task/list"
      />
    </div>
    <template v-if="visible">
      <smsMassLogEdit
        :visible="visible"
        :info="info"
        @smsMassLogEditHandler="smsMassLogEditHandler"
        @updateFinder="updateFinder"
      />
    </template>
  </div>
</template>

<script>
import setting_ from '../../../../view/base/shortmessage/finder-setting/sms_MassLog'
import { deleteTaskSms } from '@/api/sms'
import smsMassLogEdit from './sms_MassLog_edit.vue'
import Template from '../../../../view/wxapp/template.vue'

export default {
  components: {
    smsMassLogEdit,
    Template
  },
  data() {
    return {
      visible: false,
      info: {}
    }
  },
  computed: {
    search_options() {
      return [
        { label: this.$t('2736c8ab.65dd9e'), value: '1' },
        { label: this.$t('2736c8ab.4e9e4e'), value: '2' },
        { label: this.$t('2736c8ab.fb96e4'), value: '3' },
        { label: this.$t('2736c8ab.50239f'), value: '4' }
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
    async deleteSMS(id) {
      const message = this.$t('2736c8ab.0a4df9')
      this.$confirm(message, '', {
        confirmButtonText: this.$t('2736c8ab.38cf16'),
        cancelButtonText: this.$t('2736c8ab.625fb2'),
        type: 'warning'
      }).then(async () => {
        const result = await deleteTaskSms({ id })
        this.$message.success(this.$t('2736c8ab.8e05b0'))
        this.$refs.finder.refresh(true)
      })
    },
    smsMassLogEditHandler() {
      this.visible = false
    },
    updateFinder() {
      this.$refs.finder.refresh(true)
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
