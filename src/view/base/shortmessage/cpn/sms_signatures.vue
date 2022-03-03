<template>
  <div>
    <div class="sms_signatures" v-if="$route.path.indexOf('edit') === -1">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>短信签名</span>
        </div>
        <SpFinder
          ref="finder"
          :split-count="4"
          :search-row-count="2"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          url="/aliyunsms/sign/list"
        >
          <template v-slot:tableTop>
            <div style="text-align: right; margin-bottom: 20px">
              <el-button size="small" type="primary" @click="addSignature">新增签名</el-button>
            </div>
          </template>
        </SpFinder>
      </el-card>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../finder-setting/sms_signatures'
import { deleteTheSignature } from '@/api/sms'
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
        { label: '审核中', value: '0' },
        { label: '审核通过', value: '1' },
        { label: '审核失败', value: '2' }
      ]
    }
  },
  methods: {
    addSignature() {
      this.$router.push({ path: this.matchHidePage('edit') })
    },
    beforeSearch(params) {
      return { ...params }
    },
    afterSearch() {},
    async deleteSignatureHandle(id) {
      const result = await deleteTheSignature(id)
      this.$message.success('删除成功')
      this.$refs.finder.refresh()
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