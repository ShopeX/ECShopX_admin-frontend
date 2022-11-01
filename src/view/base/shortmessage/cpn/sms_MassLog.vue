<template>
  <div>
    <div class="sms_signatures">
      <el-card
        class="box-card"
        shadow="never"
      >
        <div
          slot="header"
          class="clearfix"
        >
          <span>短信群发记录</span>
        </div>
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
      </el-card>
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
import setting_ from '../finder-setting/sms_MassLog'
import { deleteTaskSms } from '@/api/sms'
import smsMassLogEdit from './sms_MassLog_edit.vue'
import Template from '../../../wxapp/template.vue'

export default {
  components: {
    smsMassLogEdit,
    Template
  },
  data () {
    return {
      visible: false,
      info: {},

      search_options: [
        { label: '等待中', value: '1' },
        { label: '群发成功', value: '2' },
        { label: '群发失败', value: '3' },
        { label: '已撤销', value: '4' }
      ]
    }
  },
  computed: {
    setting () {
      return setting_(this)
    }
  },
  methods: {
    addTemplate () {
      this.$router.push({ path: this.matchHidePage('edit') })
    },
    beforeSearch (params) {
      return { ...params }
    },
    afterSearch () {},
    async deleteSMS (id) {
      const message = '选择确定后，群发定时任务将会撤销。'
      this.$confirm(message, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await deleteTaskSms({ id })
        this.$message.success('撤销成功')
        this.$refs.finder.refresh()
      })
    },
    smsMassLogEditHandler () {
      this.visible = false
    },
    updateFinder () {
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
