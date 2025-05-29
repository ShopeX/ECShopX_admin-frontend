<template>
  <div class="page-body">
    <SpFinder
      ref="finder"
      url="/search/hotkeyword/list"
      fixed-row-action
      row-actions-width="200px"
      :other-config="{}"
      no-selection
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-button type="primary" plain @click="addConfigHandle">添加热词</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 弹窗 -->
    <SpDialog
      ref="searchDialogRef"
      v-model="showCreateInfoDialog"
      :title="editRowInfo ? '编辑' : '添加' + '热词'"
      :modal="false"
      :form="activityRule"
      :form-list="activityRuleList"
      @onSubmit="onGroupFormSubmit"
    />
  </div>
</template>
<script>
import { createFormSchema, createTableSchema } from './schema.js'

import { generatorParams } from '@/utils/schemaHelper.js'

import CompPickerLink from '@/components/compPickerLink/index.vue'
import api from '@/api'
import moment from 'moment'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    CompPickerLink
  },
  data() {
    return {
      // 显示添加行弹窗
      showCreateInfoDialog: false,
      // 行数据
      editRowInfo: null,
      activityRule: {
        color: '#1a1a1a',
        background: '#1a1a1a',
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      },
      areas: []
    }
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
    },
    activityRuleList() {
      return createFormSchema(this)
    }
  },
  mounted() {
    // 查询区域数据
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
  },
  methods: {
    // 页面初始化
    refresh() {
      this.$refs.finder.refresh(true)
    },
    // 添加事件
    addConfigHandle() {
      this.showCreateInfoDialog = true
      this.activityRule = {
        color: '#1a1a1a',
        background: '#1a1a1a',
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      }
    },
    // 编辑点击事件
    editConfigHandle(row) {
      this.editRowInfo = row
      this.activityRule = {
        regionauth_id: row.regionauth_id,
        keyword: row.keyword,
        keyword_type: row.keyword_type,
        textColor: row.color === '#1a1a1a' ? '0' : '1',
        color: row.color,
        backColor: row.background === '#1a1a1a' ? '0' : '1',
        background: row.background,
        icon: row.icon,
        sort: row.sort,
        show_time: [
          moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss'),
          moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')
        ],
        link_type: row.link_type,
        link_path: row.link_path ? JSON.parse(row.link_path) : null
      }
      this.showCreateInfoDialog = true
    },
    beforeSearch(params) {
      params = {
        ...params
      }
      if (params?.start_time?.length) {
        params.start_time[0] = moment(
          moment(params.start_time[0]).format('yyyy-MM-DD 00:00:00')
        ).unix()
        params.start_time[1] = moment(
          moment(params.start_time[1]).format('yyyy-MM-DD 23:59:59')
        ).unix()
      }
      if (params?.end_time?.length) {
        params.end_time[0] = moment(moment(params.end_time[0]).format('yyyy-MM-DD 00:00:00')).unix()
        params.end_time[1] = moment(moment(params.end_time[1]).format('yyyy-MM-DD 23:59:59')).unix()
      }
      return params
    },
    async onGroupFormSubmit() {
      const {
        regionauth_id,
        keyword,
        keyword_type,
        sort,
        link_type,
        link_path,
        show_time,
        color,
        background,
        icon
      } = this.activityRule
      const result = {
        regionauth_id,
        keyword,
        keyword_type,
        start_time: moment(show_time[0]).unix(),
        end_time: moment(show_time[1]).unix(),
        sort,
        link_type,
        color,
        background,
        icon,
        link_path: JSON.stringify(link_path)
      }
      let res = null
      try {
        if (this.editRowInfo) {
          res = await api.hotkey.updateHotkeyword(this.editRowInfo.id, result)
        } else {
          res = await api.hotkey.addHotkeyword(result)
        }
        this.$message({
          type: 'success',
          message: `操作成功`
        })
        this.refresh()
        this.editRowInfo = null
        this.showCreateInfoDialog = false
      } catch (error) {
        this.$message({
          type: 'error',
          message: `${error}`
        })
      }
    },
    async selectPathHandle() {
      const res = await this.$picker.path({
        multiple: false,
        params: {
          regionauth_id: this.activityRule.regionauth_id
        }
      })
      this.activityRule.link_path = JSON.stringify(res)
    },
    onChangeLink(e) {
      console.log(e)
      if (e.linkType == 0) {
        this.activityRule = {
          ...this.activityRule,
          link_type: 'wx_path',
          link_path: null
        }
      } else {
        this.activityRule = {
          ...this.activityRule,
          link_type: 'url_link',
          link_path: e
        }
      }
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.hotkey.deleteHotkeyword(row.id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.refresh()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    changeTextColor(val) {
      if (val === '0') {
        this.activityRule.color = '#1a1a1a'
      }
    },
    changeBackColor(val) {
      if (val === '0') {
        this.activityRule.background = '#1a1a1a'
      }
    }
  }
}
</script>
<style scoped>
.refund-address >>> .el-color-picker {
  height: auto;
}

.refund-address >>> .el-color-picker__trigger {
  padding: 0px;
  border: none;
  height: 16px;
  width: 17px;
  position: absolute;
  top: -15px;
  left: 13px;
}

.refund-address >>> .el-icon-close:before {
}

.refund-address >>> .el-color-picker__color {
  border: none;
}
</style>
