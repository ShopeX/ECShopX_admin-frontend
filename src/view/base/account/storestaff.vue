<template>
  <div>
    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addLabels"> 添加店铺员工 </el-button>
    </div>
    <tips class="action-container">
      <ul>
        <li v-if="VERSION_PLATFORM">
          平台管理后台仅可给平台自营店铺添加超级管理员，如需给入驻商户的店铺添加超级管理员，请使用商户超级管理员账号登录商户管理后台操作。前往：<el-link
            :href="origin + '/merchant/login'"
            target="_blank"
            type="primary"
          >
            商户后台
</el-link
          >。
        </li>
        <li>每个店铺仅可设置一个超级管理员账号，但一个账号可以同时是多个店铺的超级管理员。</li>
        <li>
          店铺超级管理员拥有店铺所有权限，可登录店铺管理后台为店铺添加子账号，并通过角色控制子账号权限范围。前往：<el-link
            :href="origin + '/shopadmin/login'"
            target="_blank"
            type="primary"
          >
            店铺后台
</el-link
          >。
        </li>
      </ul>
    </tips>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="login_name" label="登录账号:">
        <el-input v-model="params.login_name" placeholder="请输入账号名" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="请输入手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" label="姓名:">
        <el-input v-model="params.username" placeholder="请输入姓名" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="accountsList">
      <el-table-column label="登陆账号">
        <template slot-scope="scope">
          {{ scope.row.login_name }}
          <el-tag v-if="scope.row.is_distributor_main" size="mini" type="danger"> 管理员 </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="username" label="姓名" />
      <el-table-column label="店铺名称">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.distributor_ids" :key="item.distributor_id" size="mini">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="login_type == 'distributor'" prop="roles" label="角色">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_distributor_main == true" size="mini" type="danger">
            管理员
          </el-tag>
          <el-tag
            v-for="item in scope.row.role_data"
            v-else
            :key="item.role_id"
            size="mini"
            type="warning"
          >
            {{ item.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" width="80">
        <template
          v-if="login_type != 'distributor' || scope.row.is_distributor_main == false"
          slot-scope="scope"
        >
          <el-switch
            v-model="scope.row.is_disable"
            active-value="1"
            inactive-value="0"
            active-color="#ff4949"
            inactive-color="#ccc"
            @change="acitonDisabled(scope.$index, scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)"> 编辑 </el-button>
          <!--<el-button
            size="mini"
            @click="deleteAccountAction(scope.$index, scope.row)"
          >
            删除
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="page.pageIndex"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item label="登录账号">
            <el-col :span="10">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                :minlength="4"
                :maxlength="16"
                placeholder="请输入员工登录账号"
              />
              <el-input v-else v-model="form.login_name" :disabled="true" />
            </el-col>
            <p class="frm-tips">账号名称4-16位，名称使用字母开头，字符有有字母，数字，下划线</p>
          </el-form-item>
          <el-form-item label="手机号">
            <el-col :span="10">
              <el-input v-model="form.mobile" :maxlength="11" placeholder="请输入11位手机号" />
            </el-col>
          </el-form-item>
          <el-form-item label="姓名">
            <el-col :span="10">
              <el-input v-model="form.username" required placeholder="请填写姓名" />
            </el-col>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-col :span="10">
              <el-input v-model="form.password" :maxlength="255" />
            </el-col>
          </el-form-item>
          <el-form-item label="所属店铺">
            <el-tag
              v-for="(item, index) in relDistributors"
              :key="item.distributor_id"
              class="new-tag"
              closable
              :disable-transitions="false"
              @close="DistributoreHandleClose(index)"
            >
              {{ item.name }}
            </el-tag>
            <el-button size="medium" class="button-new-tag" @click="addDistributoreAction">
              + 点击搜索店铺
            </el-button>
            <p class="frm-tips">一个店铺只能有一个超级管理员</p>
          </el-form-item>
          <el-form-item
            v-if="login_type == 'distributor' && is_distributor_main != true"
            label="角色"
          >
            <el-checkbox-group v-model="form.role_id">
              <el-checkbox
                v-for="role in rolesListData"
                :key="role.role_id"
                :label="role.role_id"
                :value="role.role_id"
              >
                {{ role.role_name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="团长">
            <el-switch v-model="form.isHead" active-color="#13ce66" inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="选择社区" v-if="form.isHead">
            <el-cascader
              v-model="form.subDistrict"
              clearable
              :props="{
                value: 'id',
                checkStrictly: true
              }"
              :options="subDistrictList"
            />
          </el-form-item> -->
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitAction"> 保存 </el-button>
      </div>
    </el-dialog>
    <template v-if="DistributorVisible">
      <DistributorSelect
        :store-visible="DistributorVisible"
        :is-valid="isValid"
        :get-status="DistributorStatus"
        :rel-data-ids="relDistributors"
        :old-data="oldData"
        :is-single="isSingle"
        :distribution_type="distributionType"
        @chooseStore="DistributorChooseAction"
        @closeStoreDialog="closeDialogAction"
      />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import tips from '@/components/tips'
import {
  createAccount,
  getAccountInfo,
  getAccountList,
  updateAccountInfo,
  deleteAccountInfo,
  getRolesList
} from '../../../api/company'
import { pageMixin } from '@/mixins'
// import StoresSelect from '@/components/storeListSelect'
import { getDistributorList } from '@/api/marketing'
import { changeOperatorStatus } from '@/api/login'

import DistributorSelect from '@/components/function/distributorSelect'
export default {
  components: {
    DistributorSelect,
    tips
  },
  mixins: [pageMixin],
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSingle: false,
      oldData: [],
      isValid: true,
      oldData: [],
      relDistributors: [],
      DistributorVisible: false,
      DistributorStatus: false,
      login_type: 'default',
      isEdit: false,
      editVisible: false,
      origin: '',
      editTitle: '',
      distributionType: '0',
      form: {
        operator_type: 'distributor',
        mobile: '',
        login_name: '',
        username: '',
        distributor_ids: [],
        password: '',
        role_id: [],
        isHead: false,
        subDistrict: []
      },
      activeName: 'distributor',
      subDistrictList: [],
      editLoginName: '',
      accountsList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        mobile: '',
        operator_type: 'distributor'
      },
      operator_id: 0,
      rolesListData: [],
      datapass_block: 0,
      isHead: false,
      is_distributor_main: false,
      loginType: this.$store.getters.login_type
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    status(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.origin = window.location.origin
    this.login_type = this.$store.getters.login_type
    this.fetchList()
    this.getRolesListData()
    this.getSubDistrictList()
  },
  methods: {
    async getSubDistrictList() {
      const res = await this.$api.subdistrict.getSubDistrictList()
      console.log(`getSubDistrictList:`, res)
      this.subDistrictList = res
    },
    DistributoreHandleClose(index) {
      this.DistributorVisible = false
      this.relDistributors.splice(index, 1)
    },
    addDistributoreAction() {
      this.DistributorStatus = true
      this.DistributorVisible = true
    },
    getDistributor(ids) {
      let param = { distributor_id: ids }
      getDistributorList(param).then((res) => {
        this.relDistributors = res.data.data.list
        this.oldData = [...res.data.data.list]
      })
    },
    handleCancel() {
      this.editVisible = false
      this.form.operator_type = 'distributor'
      this.operator_id = ''
      this.form.login_name = ''
      this.form.mobile = ''
      this.form.username = ''
      this.form.password = ''
      this.form.role_id = []
      this.form.distributor_ids = []
      this.form.shop_ids = []
      this.relDistributors = []
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = '添加店铺员工'
      this.editVisible = true
      this.isEdit = false
      this.form.username = ''
      this.form.login_name = ''
      this.editLoginName = ''
      this.operator_id = ''
      this.form.password = ''
      this.form.role_id = []
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = '编辑店铺员工'
      this.editVisible = true
      this.isEdit = true
      this.form.username = row.username
      this.form.login_name = row.login_name
      this.form.mobile = row.mobile
      this.editLoginName = row.login_name
      this.operator_id = row.operator_id
      this.is_distributor_main = row.is_distributor_main
      console.log(1111111, row)
      this.form.password = ''
      row.role_data.forEach((item) => {
        this.form.role_id.push(item.role_id)
      })
      if (row.distributor_ids && row.distributor_ids.length > 0) {
        let ids = []
        row.distributor_ids.forEach((item) => {
          ids.push(item.distributor_id)
        })
        this.getDistributor(ids)
      }
    },
    submitAction() {
      // 提交物料
      this.form.shop_ids = []
      this.form.distributor_ids = []
      if (this.relDistributors.length > 0) {
        this.relDistributors.forEach((distributor) => {
          this.form.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      } else {
        this.$message({ type: 'error', message: '必须关联店铺' })
        return false
      }

      if (this.loginType === 'distributor' && this.form.role_id.length <= 0) {
        this.$message({ type: 'error', message: '至少关联一个角色' })
        return false
      }
      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then((response) => {
          this.$message.success('保存成功')
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
        })
      } else {
        createAccount(this.form).then((response) => {
          this.$message.success('保存成功')
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
          this.handleCancel()
        })
      }
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getAccountList(params).then((response) => {
        let list = response.data.data.list
        list.forEach((item) => {
          if (item.is_disable == 1) {
            item.is_disable = '1'
          } else {
            item.is_disable = '0'
          }
        })

        this.accountsList = list
        this.total_count = response.data.data.total_count
        this.datapass_block = response.data.data.datapass_block
        this.loading = false
      })
    },
    deleteAccountAction(index, row) {
      this.$confirm('此操作将删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id)
            .then((response) => {
              this.accountsList.splice(index, 1)
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
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = '此操作将会禁用该账号，是否继续?'
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            'operator_id': row.operator_id,
            'is_disable': row.is_disable
          }
          changeOperatorStatus(params).then((res) => {
            // this.fetchList()
          })
        })
      } else {
        let params = {
          'operator_id': row.operator_id,
          'is_disable': row.is_disable
        }
        changeOperatorStatus(params).then((res) => {
          // this.fetchList()
        })
      }
    },
    getRolesListData() {
      var params = { page: 1, pageSize: 100, role_source: 'distributor' }
      getRolesList(params).then((res) => {
        this.rolesListData = res.data.data.list
      })
    },
    DistributorChooseAction(data) {
      console.log(data)
      this.DistributorVisible = false
      if (data === null || data.length <= 0) return

      this.relDistributors = data
      this.oldData = data
    },
    closeDialogAction() {
      this.DistributorVisible = false
      this.relDistributors = this.oldData
      this.DistributorStatus = false

      // this.relDistributors = []
      // this.getDistributor();
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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
