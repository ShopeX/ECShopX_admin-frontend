<template>
  <div class="page-body">
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="polyv/anchor/list"
        fixed-row-action
        row-actions-width="120px"
        :other-config="{}"
        :setting="tableSchema"
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @reset="reset"
      >
        <template v-slot:tableTop>
          <div class="action-container">
            <el-button type="primary" plain @click="addConfigHandle">创建账号</el-button>
            <el-button type="primary" plain @click="importHandle"> 导入账号 </el-button>
            <el-button type="primary" plain @click="exportHandle">导出</el-button>
          </div>
        </template>
        <template v-slot:select_shop>
          <SpSelectShopV2
            ref="selectShop"
            v-model="searchParams.distributor_id"
            clearable
            placeholder="请选择"
          />
        </template>
      </SpFinder>

      <!-- 弹窗 -->
      <SpDialog
        ref="searchDialogRef"
        v-model="showCreateAnchorDialog"
        :title="rowData ? '编辑账号' : '创建账号'"
        :modal="false"
        :form="activityRule"
        :form-list="activityRuleList"
        @onSubmit="onGroupFormSubmit"
      />
    </SpRouterView>
  </div>
</template>
<script>
import schema from './schema.js'
import { generatorParams } from '@/utils/schemaHelper.js'
import api from '@/api'
import { exportAnchorTemplate } from '@/api/common'

export default {
  data() {
    return {
      // 选择的主播数据
      multipleSelection: [],
      // 显示添加主播弹窗
      showCreateAnchorDialog: false,
      // 显示编辑弹窗
      rowData: null,
      // 店铺搜索餐数据
      searchParams: {
        distributor_id: ''
      },
      distributor: null,
      // 区域数据
      areas: [],
      activityRule: generatorParams(schema.formSchema(this))
    }
  },
  computed: {
    tableSchema() {
      return schema.tableSchema(this)
    },
    activityRuleList() {
      return schema.formSchema(this)
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
      this.resetDialogData()
    })
  },
  methods: {
    reset() {
      this.exportParams = null
      this.searchParams = {
        distributor_id: ''
      }
    },
    // 页面初始化
    refresh() {
      this.$refs.finder.refresh(true)
    },
    // 表格选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 添加主播事件
    addConfigHandle() {
      this.resetDialogData()
      this.showCreateAnchorDialog = true
      this.distributor = null
      this.rowData = null
    },
    // 选择店铺
    async handleClick() {
      if (!this.activityRule?.regionauth_id) {
        this.$message({
          type: 'info',
          message: '请先选择区域'
        })
        return
      }
      const { data } = await this.$picker.shopV2({
        data: this.distributor?.distributor_id ? [this.distributor?.distributor_id] : [],
        multiple: false,
        regionauth_id: this.activityRule?.regionauth_id
      })
      if (data) {
        const res = await api.marketing.getDistributorInfo({
          distributor_id: data[0]?.distributor_id
        })
        this.distributor = res
        const [{ distributor_id }] = data
        this.activityRule.distributor_id = distributor_id
      } else {
        this.activityRule.distributor_id = ''
      }
    },
    beforeSearch(params) {
      params = {
        distributor_id: this.searchParams?.distributor_id,
        ...params
        // 以下是mock参数
      }
      this.exportParams = params
      return params
    },
    resetDialogData() {
      this.activityRule = generatorParams(schema.formSchema(this))
    },
    // 直播配置点击事件
    async editConfigHandle(row) {
      this.activityRule = {
        ...generatorParams(schema.formSchema(this), row)
      }
      this.rowData = row
      this.showCreateAnchorDialog = true
      if (row?.distributor_id) {
        const res = await api.marketing.getDistributorInfo({ distributor_id: row.distributor_id })
        this.distributor = res
      } else {
        this.distributor = null
      }
    },
    async onGroupFormSubmit() {
      let text = ''
      const params = {
        ...this.activityRule
      }
      if (!params?.distributor_id) {
        delete params?.distributor_id
      }
      if (!this.rowData) {
        await api.anchor.addAnchor(params)
        text = '添加'
      } else {
        await api.anchor.editAnchorInfo(this.rowData.id, params)
        text = '编辑'
      }
      this.$message({
        type: 'success',
        message: text + '成功'
      })
      this.showCreateAnchorDialog = false
      this.rowData = null
      this.refresh()
    },

    // 导出事件
    exportHandle() {
      if (!this.multipleSelection?.length) {
        this.$message({
          type: 'error',
          message: '没有选择数据'
        })
        return
      }
      let params = {
        // file_name: '商品模板',
        regionauth_id: this.exportParams?.regionauth_id,
        distributor_id: this.exportParams?.distributor_id,
        anchor_account: this.exportParams?.anchor_account,
        id: this.multipleSelection?.map((el) => el.id)
      }
      exportAnchorTemplate(params).then((response) => {
        const { status, url } = response.data.data
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('polyv_anchor')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    // 导出账号
    importHandle(e) {
      this.$router.push({
        path: '/applications/polyv/anchor/management/upload'
      })
    },
    // 删除
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row)
          api.anchor
            .deleteAnchorInfo(row.id, this.activityRule)
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.refresh()
            })
            .catch((err) => {
              this.$message({
                type: 'error',
                message: `${err}`
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
    handleRegionChange() {
      this.activityRule = {
        ...this.activityRule,
        distributor_id: ''
      }
      this.distributor = null
    }
  }
}
</script>
<style scoped>
.base-form >>> .el-form {
  margin-right: 0px;
}
</style>
