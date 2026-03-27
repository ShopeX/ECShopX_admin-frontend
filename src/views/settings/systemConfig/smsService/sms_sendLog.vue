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
        url="/aliyunsms/record/list"
      >
        <template #task_name>
          <el-input v-model="task_name" :placeholder="$t('b9fc371b.64615c')" clearable />
        </template>
      </SpFinder>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../../../../view/base/shortmessage/finder-setting/sms_sendLog'
import { deleteSmsTemplate } from '@/api/sms'
export default {
  data() {
    return {
      task_name: '',
      failVisible: false
    }
  },
  computed: {
    search_options() {
      return [
        { label: this.$t('b9fc371b.702513'), value: '1' },
        { label: this.$t('b9fc371b.9db9a7'), value: '3' },
        { label: this.$t('b9fc371b.9ca6a3'), value: '2' }
      ]
    },
    smeType_options() {
      return [
        { label: this.$t('b9fc371b.983f59'), value: '0' },
        { label: this.$t('b9fc371b.e7d158'), value: '1' },
        { label: this.$t('b9fc371b.0a9738'), value: '2' }
      ]
    },
    setting() {
      return setting_(this)
    }
  },
  mounted() {
    const { task_name } = this.$route.query
    console.log(task_name)
    this.task_name = task_name
  },
  methods: {
    addTemplate() {
      this.$router.push({ path: this.matchRoutePath('edit') })
    },
    beforeSearch(params) {
      return { ...params, task_name: this.task_name }
    },
    afterSearch() {},
    async deleteTemplateHandle(id) {
      const result = await deleteSmsTemplate(id)
      this.$message.success(this.$t('b9fc371b.0007d1'))
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
