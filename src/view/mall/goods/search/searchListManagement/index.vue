<template>
  <div class="page-body">
    <SpFinder
      ref="finder"
      url="/goods/ranking/list"
      fixed-row-action
      row-actions-width="120px"
      no-selection
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
    >
      <template v-slot:tableTop>
        <div class="action-container">
          <el-button type="primary" plain @click="addConfigHandle">添加</el-button>
        </div>
      </template>
    </SpFinder>

    <!-- 弹窗 -->
    <SpDialog
      ref="searchDialogRef"
      v-model="showCreateInfoDialog"
      :title="editRowInfo ? '编辑' : '添加' + '榜单'"
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
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      },
      // 商品范围
      district1: [],
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
    const all = [api.regionauth.getRegionauth(), api.goods.getCategory({ is_main_category: true })]
    // 查询区域数据
    Promise.all(all).then((res) => {
      this.areas = res?.[0]?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
      this.district1 = res?.[1]
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
    async onGroupFormSubmit() {
      const { show_time, scope_id, link_path } = this.activityRule
      const result = {
        ...generatorParams(createFormSchema(this), this.activityRule),
        start_time: moment(show_time[0]).unix(),
        end_time: moment(show_time[1]).unix(),
        scope_id: scope_id.pop(),
        link_path: JSON.stringify(link_path)
      }
      try {
        if (this.editRowInfo) {
          await api.ranking.updateRanking(this.editRowInfo?.id, result)
        } else {
          await api.ranking.addRanking(result)
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
    // 添加事件
    addConfigHandle() {
      this.showCreateInfoDialog = true
      this.activityRule = {
        link_type: 'wx_path',
        ...generatorParams(createFormSchema(this))
      }
    },
    // 编辑点击事件
    editConfigHandle(row) {
      this.editRowInfo = row
      this.activityRule = {
        ...generatorParams(createFormSchema(this), row),
        show_time: [
          moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss'),
          moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')
        ],
        link_type: row.link_type,
        link_path: row.link_path ? JSON.parse(row.link_path) : null
      }
      this.showCreateInfoDialog = true
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.ranking.deleteRanking(row.id).then((response) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 5 * 1000
            })
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
    }
  }
}
</script>
<style scoped></style>
