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
          :search-row-count="2"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          url="/aliyunsms/record/list"
        >
          <template v-slot:task_name>
            <el-input v-model="task_name" placeholder="请输入任务名称" clearable />
          </template>
        </SpFinder>
      </el-card>
    </div>
    <router-view />
  </div>
</template>

<script>
import setting_ from '../finder-setting/sms_sendLog'
import { deleteSmsTemplate } from '@/api/sms'
export default {
  computed: {
    setting() {
      return setting_(this)
    }
  },
  mounted(){
     const { task_name } = this.$route.query;
     console.log(task_name);
     this.task_name = task_name
  },
  data() {
    return {
      task_name:'',
      failVisible: false,
      search_options: [
        { label: '发送中', value: '1' },
        { label: '发送成功', value: '3' },
        { label: '发送失败', value: '2' }
      ],
      smeType_options:[
        { label: '验证码', value: '0' },
        { label: '短信通知', value: '1' },
        { label: '推广短信', value: '2' }
      ]
    }
  },
  methods: {
    addTemplate() {
      this.$router.push({ path: this.matchHidePage('edit') })
    },
    beforeSearch(params) {
      return { ...params,task_name:this.task_name }

    },
    afterSearch() {},
    async deleteTemplateHandle(id) {
      const result = await deleteSmsTemplate(id)
      this.$message.success('删除成功')
      this.$refs.finder.refresh()
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