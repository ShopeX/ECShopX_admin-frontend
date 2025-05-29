<template>
  <div>
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="/discountcard/list"
        fixed-row-action
        row-actions-width="200px"
        :setting="tableSchema"
        :hooks="{
          beforeSearch,
          afterSearch
        }"
        row-actions-fixed-align="left"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange"
        @reset="resetSearchParams"
      >
        <template v-slot:tableTop>
          <el-popover v-model="showCode" placement="top" width="200" trigger="manual">
            <div style="position: relative">
              <img class="page-code" :src="appCodeUrl" />
              <!-- 关闭icon -->
              <i
                class="el-icon-close"
                style="position: absolute; right: 0; top: 0"
                @click="showCode = false"
              />
              <div class="page-btns">
                <el-button type="primary" plain size="mini" @click="handleDownload()">
                  下载码
                </el-button>
                <el-button type="primary" plain size="mini" @click="handleCopyLink()">
                  复制链接
                </el-button>
              </div>
            </div>
          </el-popover>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="addCouponHandle">创建优惠券</el-button>
            <el-button type="primary" plain @click="batchAuditHandle">批量审核</el-button>
          </div>
          <!-- 选择tab -->
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in audit_status"
              :key="item.value"
              :label="item.label"
              :name="item.value"
            />
          </el-tabs>
        </template>

        <template v-slot:select_shop>
          <el-select
            v-model="searchParams.budget_code"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
          >
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </SpFinder>

      <SpDrawer
        v-model="showLogInfoDrawer"
        class="config-drawer"
        :title="'日志'"
        :footer="false"
        :width="900"
      >
        <SpFinder
          v-if="showLogInfoDrawer"
          ref="finder2"
          fixed-row-action
          no-selection
          :setting="logTableSchema"
          row-actions-fixed-align="left"
          :front-paging="true"
          :hooks="{}"
          :data="logTableData"
        />
      </SpDrawer>

      <!-- 审批 -->
      <SpDialog
        ref="auditDialogRef"
        v-model="auditDialog"
        title="审批"
        :modal="false"
        :form="auditForm"
        :form-list="auditFormList"
        @onSubmit="onEditFormSubmit"
      />

      <SpDialog
        ref="editDialogRef"
        v-model="editDialog"
        width="500px"
        :title="'修改库存数'"
        :form="editForm"
        :form-list="editFormList"
        @onSubmit="onEditSubmit"
      />
    </SpRouterView>
  </div>
</template>

<script>
import {
  createTableSchema,
  audit_status,
  createLogTableSchema,
  createAuditFormSchema,
  createEditForm
} from './schema'
import api from '@/api'
import { getPageCode } from '@/api/marketing'
import { generatorParams } from '@/utils/schemaHelper'
import { removeCard } from '@/api/cardticket'
export default {
  data() {
    return {
      activeName: 'all',
      audit_status,
      areas: [],
      appCodeUrl: '', // 小程序码地址
      curPageUrl: '', // 跳转小程序页面地址
      showLogInfoDrawer: false, // 日志信息抽屉
      editRow: null, // 编辑行
      selectedRows: [], // 选中的行
      cardId: null, // 卡券ID
      auditDialog: false, // 审批弹窗
      auditForm: {
        ...generatorParams(createAuditFormSchema(this))
      }, // 审批表单
      logTableData: [], // 日志表格数据
      searchParams: {
        budget_code: []
      }, // 预算编码
      editDialog: false, // 修改库存弹窗
      editForm: generatorParams(createEditForm(this)),
      pageData: [],
      appID: '',
      showCode: false
    }
  },
  provide() {
    return {
      refresh: this.refresh
    }
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
    },
    logTableSchema() {
      return createLogTableSchema(this)
    },
    auditFormList() {
      return createAuditFormSchema(this)
    },
    editFormList() {
      return createEditForm(this)
    }
  },
  mounted() {
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name,
        title: el.regionauth_name
      }))
    })
    this.fetchWechatList()
  },
  methods: {
    queryCardInfo() {
      api.cardticket.getCardDetail({ card_id: this.cardId }).then((res) => {
        this.editRow = res.data
      })
    },
    refresh() {
      this.$refs.finder.refresh(true)
    },
    handleClick() {
      this.refresh()
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    resetSearchParams() {
      this.searchParams = {
        budget_code: []
      }
    },
    afterSearch(response) {
      this.pageData = response.data?.data?.list || []
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        page_no: params.page,
        page_size: params.pageSize,
        ...this.searchParams
      }
      if (this.activeName !== 'all') {
        _params.status = this.activeName
      }
      return _params
    },
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },
    // 创建
    addCouponHandle() {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    // 审核执行
    onEditFormSubmit() {
      api.cardticket
        .batchReview({
          ...this.auditForm
        })
        .then((res) => {
          this.$message.success('操作成功')
          this.refresh()
          this.auditDialog = false
        })
    },
    // 批量审核
    batchAuditHandle() {
      if (!this.selectedRows.length) {
        this.$message.warning('请选择要审核的卡券')
        return
      }
      this.auditForm = {
        ...generatorParams(createAuditFormSchema(this)),
        card_ids: this.selectedRows.map((item) => item.card_id)?.join(',')
      }
      this.auditDialog = true
    },
    // 查看
    showConfigHandle(row) {
      this.$router.push({
        path: this.matchHidePage('editor'),
        query: { chooseCardtype: row.card_type, cardId: row.card_id, onlyShow: true }
      })
    },
    // 编辑
    editRowDataHandle(row) {
      this.$router.push({
        path: this.matchHidePage('editor'),
        query: { chooseCardtype: row.card_type, cardId: row.card_id }
      })
    },
    // 审批
    approveHandle(row) {
      this.auditDialog = true
      this.auditForm = {
        ...generatorParams(createAuditFormSchema(this)),
        card_ids: [row.card_id]?.join(',')
      }
    },
    // 查看日志
    showLogInfo(row) {
      this.showLogInfoDrawer = true
      this.editRow = row
      api.cardticket.getChangeLogs({ card_id: row.card_id, page: 1, pageSize: 999 }).then((res) => {
        this.logTableData = res.list?.map((item) => ({
          ...item,
          log_items: JSON.parse(item.log_items)
        }))
      })
    },
    // 投放
    pushCouponHandle(row) {
      const page = 'subpages/marketing/coupon-center'
      this.curPageUrl = `${page}?card_id=${row.card_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        card_id: row.card_id
      }
      this.editRow = row
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
        this.showCode = true
      })
    },
    // 删除
    deleteRowDataHandle(row) {
      this.$confirm('确定要删除该卡券？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeCard({ 'card_id': row.card_id }).then((res) => {
              this.$message.success('删除成功')
              this.refresh()
            })
          }
          done()
        }
      })
    },
    handleDownload() {
      const { title } = this.editRow
      var a = document.createElement('a')
      var temp = title
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    handleCopyLink() {
      this.$copyText(this.curPageUrl).then(() => {
        this.$message.success('复制成功')
      })
    },
    editCouponStore(row) {
      this.editForm = {
        ...generatorParams(createEditForm(this)),
        card_id: row.card_id
      }
      this.editDialog = true
    },
    async onEditSubmit() {
      await this.$api.cardticket.updateStore(this.editForm)
      this.editDialog = false
      this.refresh()
    },
    changeStatusRowDataHandle(row, status) {
      api.cardticket
        .updateCardStatus({
          card_ids: row.card_id,
          status: status
        })
        .then((res) => {
          this.$message.success('操作成功')
          this.refresh()
        })
    }
  }
}
</script>

<style scoped lang="scss">
.page-code {
  width: 100%;
}
</style>
