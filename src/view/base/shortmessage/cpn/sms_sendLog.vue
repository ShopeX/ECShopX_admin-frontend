<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
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
          <el-input v-model="task_name" placeholder="请输入任务名称" clearable />
        </template>
      </SpFinder>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../finder-setting/sms_sendLog'
import { deleteSmsTemplate } from '@/api/sms'
export default {
  data() {
    return {
      task_name: '',
      failVisible: false,
      search_options: [
        { label: '发送中', value: '1' },
        { label: '发送成功', value: '3' },
        { label: '发送失败', value: '2' }
      ],
      smeType_options: [
        { label: '验证码', value: '0' },
        { label: '短信通知', value: '1' },
        { label: '推广短信', value: '2' }
      ]
    }
  },
  computed: {
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
      this.$message.success('删除成功')
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
