<template>
  <div>
    <div class="sms_signatures" v-if="$route.path.indexOf('edit') === -1">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>短信发送记录</span>
        </div>
        <SpFinder
          ref="finder"
          :split-count="4"
          :search-row-count="4"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          url="/aliyunsms/task/list"
        >
        </SpFinder>
      </el-card>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../finder-setting/sms_MassLog'
import { deleteSmsTemplate } from '@/api/sms'
export default {
  computed: {
    setting() {
      return setting_(this)
    }
  },
  data() {
    return {
      failVisible: false,
      search_options: [
        { label: '等待中', value: '1' },
        { label: '群发成功', value: '2' },
        { label: '群发失败', value: '3' },
        { label: '已撤销', value: '4' },

      ],
    }
  },
  methods: {
    addTemplate() {
      this.$router.push({ path: this.matchHidePage('edit') })
    },
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch() {},
    async deleteTemplateHandle(id) {
      const result = await deleteSmsTemplate(id)
      this.$message.success('删除成功')
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