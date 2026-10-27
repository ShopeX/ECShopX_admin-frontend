<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addLabels">
        {{ $t('ab2cdfe4.214d48') }}
      </el-button>
    </div>
    <tips class="action-container">
      <ul>
        <li v-if="VERSION_PLATFORM()">
          {{ $t('ab2cdfe4.a36767')
          }}<el-link :href="origin + '/merchant/login'" target="_blank" type="primary">
            {{ $t('ab2cdfe4.a792da') }} </el-link
          >。
        </li>
        <li>{{ $t('ab2cdfe4.09136f') }}</li>
        <li>
          {{ $t('ab2cdfe4.92eb56')
          }}<el-link :href="origin + '/shopadmin/login'" target="_blank" type="primary">
            {{ $t('ab2cdfe4.95ee58') }} </el-link
          >。
        </li>
      </ul>
    </tips>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="login_name" :label="$t('ab2cdfe4.8c2e31')">
        <el-input v-model="params.login_name" :placeholder="$t('ab2cdfe4.3103ef')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" :label="$t('ab2cdfe4.ce2bf3')">
        <el-input v-model="params.mobile" :placeholder="$t('ab2cdfe4.6e4f4b')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" :label="$t('ab2cdfe4.75d152')">
        <el-input v-model="params.username" :placeholder="$t('ab2cdfe4.8093e3')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="shop_name" :label="$t('ab2cdfe4.0d4934')">
        <el-input v-model="params.shop_name" clearable :placeholder="$t('ab2cdfe4.867738')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="shop_code" :label="$t('ab2cdfe4.f6d738')">
        <el-input v-model="params.shop_code" clearable :placeholder="$t('ab2cdfe4.68f04a')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <el-table v-loading="loading" border :data="accountsList">
      <el-table-column :label="$t('ab2cdfe4.2b6bc0')" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.$index, scope.row)">
            {{ $t('ab2cdfe4.95b351') }}
          </el-button>
          <!--<el-button
            type="text"
            @click="deleteAccountAction(scope.$index, scope.row)"
          >
            删除
          </el-button>-->
        </template>
      </el-table-column>
      <!-- <el-table-column label="登陆账号">
        <template slot-scope="scope">
          {{ scope.row.login_name }}
          <el-tag v-if="scope.row.is_distributor_main" size="mini" type="danger"> 管理员 </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="login_name" :label="$t('ab2cdfe4.bb2cdf')" />
      <el-table-column prop="mobile" :label="$t('ab2cdfe4.8098e2')" />
      <el-table-column prop="username" :label="$t('ab2cdfe4.60d045')" />
      <el-table-column :label="$t('ab2cdfe4.0d4934')">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.distributor_ids" :key="item.distributor_id" size="mini">
            {{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('ab2cdfe4.f6d738')">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.distributor_ids"
            :key="'code-' + item.distributor_id"
            size="mini"
          >
            {{ item.shop_code }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="login_type == 'distributor'"
        prop="roles"
        :label="$t('ab2cdfe4.464f3d')"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_distributor_main == true" size="mini" type="danger">
            {{ $t('ab2cdfe4.b1dae9') }}
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
      <el-table-column prop="is_disable" :label="$t('ab2cdfe4.710ad0')" width="80">
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
          <el-form-item :label="$t('ab2cdfe4.bb2cdf')">
            <div class="flex flex-col items-start">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                class="!w-[250px]"
                :minlength="4"
                :maxlength="16"
                :placeholder="$t('ab2cdfe4.2b668a')"
              />
              <el-input
                v-else
                v-model="form.login_name"
                class="!w-[250px]"
                :disabled="true"
              />
              <p class="frm-tips whitespace-nowrap !pb-0">{{ $t('ab2cdfe4.d59d95') }}</p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('ab2cdfe4.8098e2')">
            <el-col :span="10">
              <el-input
                v-model="form.mobile"
                :maxlength="11"
                :placeholder="$t('ab2cdfe4.fed6c9')"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('ab2cdfe4.60d045')">
            <el-col :span="10">
              <el-input v-model="form.username" required :placeholder="$t('ab2cdfe4.629b2e')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('ab2cdfe4.2646b8')">
            <el-col :span="10">
              <el-input v-model="form.password" :maxlength="255" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('ab2cdfe4.baad7e')">
            <div class="flex flex-col items-start">
              <SpSelectShop
                ref="shopSelect"
                v-model="selectedDistributorIds"
                multiple
                clearable
                class="!w-[250px]"
                :placeholder="$t('ab2cdfe4.a5d26b')"
                :query-params="{ distribution_type: distributionType }"
                @change="onShopSelectChange"
              />
              <p class="frm-tips whitespace-nowrap !pb-0">{{ $t('ab2cdfe4.2242ee') }}</p>
            </div>
          </el-form-item>
          <el-form-item
            v-if="login_type == 'distributor' && is_distributor_main != true"
            :label="$t('ab2cdfe4.464f3d')"
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
        <el-button @click.native="handleCancel"> {{ $t('ab2cdfe4.625fb2') }} </el-button>
        <el-button type="primary" @click="submitAction"> {{ $t('ab2cdfe4.be5fbb') }} </el-button>
      </div>
    </el-dialog>
  </SpPage>
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
import { getDistributorList } from '@/api/marketing'
import { changeOperatorStatus } from '@/api/login'

export default {
  components: {
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
      relDistributors: [],
      selectedDistributorIds: [],
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
        login_name: '',
        username: '',
        shop_name: '',
        shop_code: '',
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
    onShopSelectChange(val) {
      const ids = val == null || val === '' ? [] : Array.isArray(val) ? val : [val]
      this.selectedDistributorIds = ids
      if (ids.length > 0) {
        this.getDistributor(ids)
      } else {
        this.relDistributors = []
      }
    },
    syncShopSelectLabel() {
      this.$nextTick(() => {
        const shopSelect = this.$refs.shopSelect
        if (!shopSelect) return
        const list = this.relDistributors
        if (!list.length) {
          shopSelect.selectValue = ''
          return
        }
        shopSelect.selectValue =
          list.length === 1 ? list[0].name : this.$t('d6d1dfc8.013ecd', { n: list.length })
      })
    },
    getDistributor(ids) {
      let param = { distributor_id: ids }
      getDistributorList(param).then((res) => {
        this.relDistributors = res.data.data.list
        this.selectedDistributorIds = this.relDistributors.map((item) => item.distributor_id)
        this.syncShopSelectLabel()
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
      this.selectedDistributorIds = []
      this.syncShopSelectLabel()
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = this.$t('ab2cdfe4.214d48')
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
      this.editTitle = this.$t('ab2cdfe4.7697b1')
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
        this.$message({ type: 'error', message: this.$t('ab2cdfe4.eb0268') })
        return false
      }

      if (this.loginType === 'distributor' && this.form.role_id.length <= 0) {
        this.$message({ type: 'error', message: this.$t('ab2cdfe4.31f03c') })
        return false
      }
      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then((response) => {
          this.$message.success(this.$t('ab2cdfe4.3b1083'))
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
        })
      } else {
        createAccount(this.form).then((response) => {
          this.$message.success(this.$t('ab2cdfe4.3b1083'))
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
      this.$confirm(this.$t('ab2cdfe4.80ae2a'), this.$t('ab2cdfe4.02d981'), {
        confirmButtonText: this.$t('ab2cdfe4.38cf16'),
        cancelButtonText: this.$t('ab2cdfe4.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id)
            .then((response) => {
              this.accountsList.splice(index, 1)
              this.$message({
                message: this.$t('ab2cdfe4.0007d1'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('ab2cdfe4.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('ab2cdfe4.2111cc')
          })
        })
    },
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = this.$t('ab2cdfe4.a26113')
        this.$confirm(msg, this.$t('ab2cdfe4.02d981'), {
          confirmButtonText: this.$t('ab2cdfe4.38cf16'),
          cancelButtonText: this.$t('ab2cdfe4.625fb2'),
          type: 'warning'
        }).then(() => {
          let params = {
            operator_id: row.operator_id,
            is_disable: row.is_disable
          }
          changeOperatorStatus(params).then((res) => {
            // this.fetchList()
          })
        })
      } else {
        let params = {
          operator_id: row.operator_id,
          is_disable: row.is_disable
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
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
