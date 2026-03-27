<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-row :gutter="20">
      <el-col :span="2">
        <div class="p-title">{{ $t('4add4f82.eaa5bb') }}</div>
      </el-col>
      <el-col :span="22">
        <div class="tips" v-html="$t('4add4f82.f9313e')" />
      </el-col>
    </el-row>
    <el-row class="margin-col">
      <el-col>
        <el-button type="primary" @click="handleEdit(true)">{{ $t('4add4f82.09a879') }}</el-button>
      </el-col>
    </el-row>

    <el-card>
      <flaglist
        ref="flaglist"
        :tmp-data="flagList"
        :loading="loading"
        @handleEdit="handleEdit"
        @selectNotes="selectNotes"
        @handleDel="delFalg"
      />
    </el-card>

    <div class="mt-4 text-right">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagers.total"
        :page-size="params.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      :before-close="handleEdit"
      :visible.sync="editFlagShow"
      :title="ruleForm.badge_id ? $t('4add4f82.b57f38') : $t('4add4f82.09a879')"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item prop="badge_name" :label="$t('4add4f82.ec6ceb')">
          <el-input
            v-model="ruleForm.badge_name"
            :placeholder="$t('4add4f82.ec6ceb')"
            maxlength="20"
            :show-word-limit="true"
          />
        </el-form-item>

        <el-form-item prop="badge_memo" :label="$t('e240ae54.2432b5')">
          <el-input
            v-model="ruleForm.badge_memo"
            maxlength="50"
            :placeholder="$t('4add4f82.3cac63')"
            :show-word-limit="true"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updataFalg">{{ $t('09b91dec.e83a25') }}</el-button>
          <el-button @click="handleEdit(false)">{{ $t('09b91dec.625fb2') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <auditStatus
      audit-type="flag"
      :dialog-is-show="auditDialogShow"
      :duf-status="dufStatus"
      @modalHandle="auditNote"
      @cancelLabelsDialog="cancelAuditDialog"
    />
  </SpPage>
</template>
<script>
import { Message } from 'element-ui'
import { getBadge, createBadge, badgeDelete, badgeVerify } from '@/api/ugc'
import flaglist from './comps/flaglist'
import auditStatus from './comps/auditStatus'
export default {
  provide() {
    return {
      refresh: this.getDataList
    }
  },
  components: {
    flaglist,
    auditStatus
  },
  data() {
    return {
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        status: null
      },
      pagers: {
        total: 0
      },
      id_set: [],
      flagList: [],
      ruleForm: {
        badge_name: null,
        badge_memo: null
      },
      editFlagShow: false,
      dufStatus: null,
      auditDialogShow: false
    }
  },
  computed: {
    rules() {
      return {
        badge_name: [
          { required: true, message: this.$t('4add4f82.1b1a37'), trigger: 'blur' },
          { max: 20, message: this.$t('4add4f82.74d186'), trigger: 'blur' }
        ],
        badge_memo: [{ max: 50, message: this.$t('4add4f82.40fd7e'), trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    clearAudioData() {
      this.$data.id_set = []
      this.$data.ruleForm = {}
      //this.$data.auditdiff = false;
    },
    getDataList() {
      const that = this
      var { activeName, params } = this.$data
      //this.loading = true
      //console.log('getDataList',params.status)
      that.$data.loading = true
      getBadge(params).then(
        (res) => {
          var { list, total_count } = res.data.data
          //console.log('res',res)
          that.$data.flagList = list
          that.$data.pagers = { total: total_count }
          that.$data.loading = false
        },
        (err) => {
          that.$data.loading = false
        }
      )
    },
    handleEdit(show, row) {
      const { ruleForm } = this.$data
      //console.log('handleEdit',typeof show )
      if (typeof show == 'boolean') {
        this.$data.editFlagShow = show
      } else {
        this.$data.editFlagShow = false
      }
      //edit & add
      if (row) {
        this.rowTransForm(row)
      }
      //delect
      if (ruleForm.badge_id) {
        this.ruleForm = {}
      }
    },
    rowTransForm(row) {
      var ruleForm = {
        badge_id: row.badge_id,
        badge_name: row.badge_name,
        badge_memo: row.badge_memo
      }

      this.$data.ruleForm = ruleForm
    },
    updataFalg() {
      const that = this
      const { ruleForm } = this.$data
      //console.log('updataFalg',ruleForm)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          createBadge(ruleForm).then((res) => {
            var { message } = res.data.data
            this.$message({
              type: 'success',
              duration: 1500,
              message,
              onClose() {
                that.handleEdit(false)
                that.clearAudioData()
                that.getDataList()
              }
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delFalg(badge_id) {
      var params = { badge_id: [badge_id] }
      this.$confirm(this.$t('4add4f82.cbae1a'), this.$t('4add4f82.02d981'), {
        confirmButtonText: this.$t('4add4f82.38cf16'),
        cancelButtonText: this.$t('09b91dec.625fb2'),
        type: 'warning'
      }).then(() => {
        badgeDelete(params).then((res) => {
          // console.log('notesDelete',res)
          var msg = res.data.data.message
          this.getDataList()
          this.$message({
            type: 'success',
            message: msg
          })
        })
      })
    },
    cancelAuditDialog(show) {
      this.$data.auditDialogShow = show
    },
    selectNotes(params) {
      //console.log('selectNotes',params)
      this.$data.id_set = params.id_set
      if (params.aloneAuditType) {
        this.$data.dufStatus = params.aloneAuditType
        this.auditHandle()
      } else {
        this.$data.dufStatus = 'pass'
      }
    },
    auditHandle() {
      const { id_set, dufStatus } = this.$data
      //console.log('点击审核 auditHandle 22/',dufStatus,id_set);
      if (id_set.length) {
        this.cancelAuditDialog(true)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('4add4f82.858c49')
        })
      }
    },
    auditNote(params) {
      const { id_set } = this.$data
      params.badge_id = id_set
      //console.log('进行审核 auditNote',params);
      badgeVerify(params).then((res) => {
        //console.log('res',res)
        var msg = res.data.data.message
        this.cancelAuditDialog(false)
        this.clearAudioData()
        this.getDataList()
        this.$message({
          type: 'success',
          message: msg
        })
      })
    }
  }
}
</script>
<style scoped lang="scss">
.p-title {
  line-height: 38px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.tips {
  color: #999;
  font-size: 12px;
}
.margin-col {
  margin: 15px auto 20px !important;
}
</style>
