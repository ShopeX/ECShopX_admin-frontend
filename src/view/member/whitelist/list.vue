<template>
  <SpPage>
    <SpFilterForm :model="formData" @onSearch="dataSearch" @onReset="dataSearch">
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </SpFilterFormItem>
    </SpFilterForm>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addData"> 添加白名单 </el-button>
        <el-button type="primary" icon="plus" @click="setTips"> 白名单提示 </el-button>
      </el-col>
      <!-- <el-col :span="12">
        <el-input v-model="mobile" placeholder="手机号">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col> -->
    </el-row>
    <el-table v-loading="loading" :data="whitelistList" :height="wheight - 160">
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)"> 编辑 </el-button>
          <el-button size="mini" @click="deleteAction(scope.$index, scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item label="手机号">
            <el-col :span="10">
              <el-input
                v-if="!isEdit"
                v-model="form.mobile"
                :maxlength="11"
                placeholder="请输入11位手机号"
              />
              <el-input v-else v-model="editMobile" :disabled="true" />
            </el-col>
          </el-form-item>
          <el-form-item label="姓名">
            <el-col :span="10">
              <el-input
                v-model="form.name"
                required
                placeholder="请填写名称"
                :disabled="datapass_block == 1 && isEdit"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitAction"> 保存 </el-button>
      </div>
    </el-dialog>
    <!-- 设置提示语句 -->
    <el-dialog :title="editTitle" :visible.sync="editTipsVisible" :before-close="handleCancelTips">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item label="提示">
            <el-col :span="20">
              <el-input v-model="form.tips" required placeholder="请填写提示" />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancelTips"> 取消 </el-button>
        <el-button type="primary" @click="submitTipsAction"> 保存 </el-button>
      </div>
    </el-dialog>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getMembersWhitelistList,
  createMembersWhitelist,
  updateMembersWhitelist,
  deleteMembersWhitelist
} from '@/api/member'
import { getWhitelistSetting, setWhitelistSetting } from '@/api/company'
import { pageMixin } from '@/mixins'

export default {
  mixins: [pageMixin],
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isValid: true,
      isEdit: false,
      editVisible: false,
      editTitle: '',
      editTipsVisible: false,
      form: {
        mobile: '',
        name: '',
        tips: ''
      },
      mobile: '',
      editMobile: '',
      editName: '',
      whitelistList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      whitelist_id: 0,
      datapass_block: 1,
      formData: {
        mobile: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    status(val) {
      if (val) {
        this.getListData()
      }
    }
  },
  mounted() {
    this.getListData()
  },
  methods: {
    handleClose(index) {
      this.relDistributors.splice(index, 1)
      this.form.distributor_ids.splice(index, 1)
    },
    handleCancel() {
      this.editVisible = false
      this.whitelist_id = ''
      this.editMobile = ''
      this.form.mobile = ''
      this.form.name = ''
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getListData()
    },
    addData() {
      this.handleCancel()
      this.editTitle = '添加白名单'
      this.editVisible = true
      this.isEdit = false
      this.form.mobile = ''
      this.form.name = ''
      this.whitelist_id = ''
      this.editMobile = ''
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = '编辑白名单信息'
      this.editVisible = true
      this.isEdit = true
      this.editMobile = row.mobile
      this.form.mobile = row.mobile
      this.form.name = row.name
      this.whitelist_id = row.whitelist_id
    },
    submitAction() {
      // 提交物料
      if (this.whitelist_id) {
        updateMembersWhitelist(this.whitelist_id, this.form).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getListData()
        })
      } else {
        createMembersWhitelist(this.form).then(response => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getListData()
          this.handleCancel()
        })
      }
    },
    dataSearch() {
      this.params.mobile = this.formData.mobile
      this.params.page = 1
      this.getListData()
    },
    getListData() {
      this.loading = true
      getMembersWhitelistList(this.params).then(response => {
        this.whitelistList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除该白名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteMembersWhitelist(row.whitelist_id)
            .then(response => {
              this.whitelistList.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
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
    setTips(data) {
      this.handleCancel()
      this.handleCancelTips()
      this.editTitle = '白名单提示'
      this.editTipsVisible = true
      getWhitelistSetting().then(response => {
        this.form.tips = response.data.data.whitelist_tips
      })
    },
    handleCancelTips() {
      this.editTipsVisible = false
      this.form.tips = ''
    },
    submitTipsAction() {
      // 提交物料
      const params = { whitelist_tips: this.form.tips }
      setWhitelistSetting(params).then(response => {
        this.editTipsVisible = false
        this.handleTipsCancel()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 40px;
  line-height: 40px;
  width: 138px;
  vertical-align: bottom;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
