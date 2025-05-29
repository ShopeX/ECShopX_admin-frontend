<template>
  <div class="page-body">
    <SpFinder
      ref="finder"
      url="/search/placeholder/list"
      fixed-row-action
      row-actions-width="200px"
      no-selection
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-button type="primary" plain @click="addConfigHandle">添加底纹词</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 弹窗 -->
    <SpDialog
      ref="searchDialogRef"
      v-model="showCreateInfoDialog"
      :title="editRowInfo ? '编辑' : '添加' + '底纹词'"
      :modal="false"
      :form="activityRule"
      :form-list="activityRuleList"
      @onSubmit="onGroupFormSubmit"
    />
  </div>
</template>
<script>
import { createFormSchema, createTableSchema } from './schema.js'
import api from '@/api'
import moment from 'moment'

import CompPickerLink from '@/components/compPickerLink/index.vue'

import { generatorParams } from '@/utils/schemaHelper.js'

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
      //
      activityRule: {
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      },
      options: [],
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
    const all = [api.member.getTagList(), api.regionauth.getRegionauth()]
    // 查询区域数据
    Promise.all(all).then((res) => {
      this.areas = res?.[1]?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
      this.options = res?.[0]?.list?.map((el) => ({
        value: el.tag_id,
        label: el.tag_name
      }))
    })
  },
  methods: {
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
    // 页面初始化
    refresh() {
      this.$refs.finder.refresh(true)
    },
    // 添加事件
    addConfigHandle() {
      this.activityRule = {
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      }
      this.showCreateInfoDialog = true
    },
    // 编辑点击事件
    editConfigHandle(row) {
      this.editRowInfo = row
      this.activityRule = {
        regionauth_id: row.regionauth_id,
        text: row.text,
        show_time: [
          moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss'),
          moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')
        ],
        user: row.rel_tags?.map((el) => el.tag_id),
        sort: row.sort,
        link_type: row.link_type,
        link_path: row.link_path ? JSON.parse(row.link_path) : null
      }
      this.showCreateInfoDialog = true
    },
    async onGroupFormSubmit() {
      const { regionauth_id, text, sort, link_type, link_path, show_time, user } = this.activityRule
      const result = {
        regionauth_id,
        text,
        sort,
        link_type,
        start_time: moment(show_time[0]).unix(),
        end_time: moment(show_time[1]).unix(),
        rel_tags: user?.map((el) => {
          const find = this.options.find((one) => one.value == el)
          return {
            tag_id: find.value,
            tag_name: find.label
          }
        }),
        link_path: JSON.stringify(link_path)
      }
      let res = null
      try {
        if (this.editRowInfo) {
          res = await api.shadedword.updatePlaceholder(this.editRowInfo?.id, result)
        } else {
          res = await api.shadedword.addPlaceholder(result)
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
    onChangeLink(e) {
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
          api.shadedword.deletePlaceholder(row.id).then((res) => {
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
    async selectPathHandle() {
      const res = await this.$picker.path({
        multiple: false,
        params: {
          regionauth_id: this.activityRule.regionauth_id
        }
      })
      this.activityRule.link_path = JSON.stringify(res)
    }
  }
}
</script>
<style scoped></style>
