<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="login_name" :label="$t('81d2acb6.8c2e31')">
        <el-input v-model="params.login_name" :placeholder="$t('81d2acb6.3103ef')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" :label="$t('81d2acb6.ce2bf3')">
        <el-input v-model="params.mobile" :placeholder="$t('81d2acb6.6e4f4b')" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" :label="$t('81d2acb6.75d152')">
        <el-input v-model="params.username" :placeholder="$t('81d2acb6.8093e3')" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addLabels">
        {{ $t('81d2acb6.f0677c') }}
      </el-button>
    </div>

    <el-table v-loading="loading" border :data="accountsList">
      <el-table-column :label="$t('81d2acb6.2b6bc0')" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="editAction(scope.$index, scope.row)">
            {{ $t('81d2acb6.95b351') }}
          </el-button>
          <!--<el-button
            type="text"
            @click="deleteAccountAction(scope.$index, scope.row)"
          >
            删除
          </el-button>-->
        </template>
      </el-table-column>
      <el-table-column prop="login_name" :label="$t('81d2acb6.bb2cdf')" />
      <el-table-column prop="mobile" :label="$t('81d2acb6.8098e2')" />
      <el-table-column prop="username" :label="$t('81d2acb6.60d045')" />
      <el-table-column :label="$t('f3a67ede.5c16c5')" min-width="180">
        <template slot-scope="scope">
          <template v-if="scope.row.distributor_ids && scope.row.distributor_ids.length">
            <el-tag
              v-for="item in scope.row.distributor_ids"
              :key="item.distributor_id"
              size="mini"
              class="rel-distributor-tag"
            >
              {{ item.name }}
            </el-tag>
          </template>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="roles" :label="$t('81d2acb6.464f3d')">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.role_data"
            :key="item.role_id"
            size="mini"
            type="warning"
          >
            {{ item.role_name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" :label="$t('81d2acb6.710ad0')" width="80">
        <template slot-scope="scope">
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
          <el-form-item :label="$t('81d2acb6.bb2cdf')">
            <el-col :span="10">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                :minlength="4"
                :maxlength="16"
                :placeholder="$t('81d2acb6.2b668a')"
              />
              <el-input v-else v-model="form.login_name" :disabled="true" />
            </el-col>
            <p class="frm-tips">{{ $t('81d2acb6.d59d95') }}</p>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.8098e2')">
            <el-col :span="10">
              <el-input
                v-if="!isEdit"
                v-model="form.mobile"
                :maxlength="11"
                :placeholder="$t('81d2acb6.fed6c9')"
              />
              <el-input v-else v-model="editMobile" :disabled="true" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.60d045')">
            <el-col :span="10">
              <el-input v-model="form.username" required :placeholder="$t('81d2acb6.629b2e')" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.2646b8')">
            <el-col :span="10">
              <el-input v-model="form.password" :maxlength="255" />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.baad7e')">
            <el-tag
              v-for="(item, index) in relDistributors"
              :key="item.distributor_id"
              class="new-tag"
              closable
              :disable-transitions="false"
              @close="handleClose(index)"
            >
              {{ item.name }}
            </el-tag>
            <el-button size="medium" class="button-new-tag" @click="addDistributoreAction">
              {{ $t('81d2acb6.a5d26b') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('81d2acb6.464f3d')">
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
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('81d2acb6.625fb2') }} </el-button>
        <el-button type="primary" @click="submitAction"> {{ $t('81d2acb6.be5fbb') }} </el-button>
      </div>
    </el-dialog>
    <DistributorSelect
      :store-visible="DistributorVisible"
      :is-valid="isValid"
      :rel-data-ids="relDistributors"
      :get-status="DistributorStatus"
      @chooseStore="DistributorChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
    <ShopSelect
      :store-visible="ShopVisible"
      :is-valid="isValid"
      :rel-data-ids="relShops"
      :old-data="oldData"
      :get-status="ShopStatus"
      @chooseStore="ShopChooseAction"
      @closeStoreDialog="closeDialogAction"
    />
  </SpPage>
</template>
<script>
import {
  createAccount,
  getAccountInfo,
  getAccountList,
  updateAccountInfo,
  deleteAccountInfo,
  getRolesList
} from '../../../api/company'
import { getDistributorList } from '@/api/marketing'
import { changeOperatorStatus } from '@/api/login'
import { pageMixin } from '@/mixins'
import DistributorSelect from '@/components/function/distributorSelect'
import ShopSelect from '@/components/function/shopSelect'
export default {
  components: {
    DistributorSelect,
    ShopSelect
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
      oldData: [],
      isValid: true,
      DistributorStatus: false,
      ShopStatus: false,
      relDistributors: [],
      relShops: [],
      DistributorVisible: false,
      ShopVisible: false,
      isEdit: false,
      editVisible: false,
      editTitle: '',

      form: {
        operator_type: 'staff',
        mobile: '',
        login_name: '',
        username: '',
        distributor_ids: [],
        password: '',
        role_id: []
      },
      activeName: 'staff',

      editLoginName: '',
      editMobile: '',
      accountsList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        mobile: '',
        operator_type: 'staff'
      },
      operator_id: 0,
      rolesListData: [],
      datapass_block: 0
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
    this.fetchList()
    this.getRolesListData()
  },
  methods: {
    handleClose(index) {
      this.relDistributors.splice(index, 1)
      this.form.distributor_ids.splice(index, 1)
      //this.$forceUpdate()
    },
    storeHandleClose(index) {
      this.DistributorStatus = false
      this.form.shop_ids.splice(index, 1)
      this.relShops.splice(index, 1)
      //this.$forceUpdate()
    },
    addDistributoreAction() {
      this.DistributorVisible = true
      this.DistributorStatus = true
    },
    addStoreAction() {
      this.ShopVisible = true
      this.ShopStatus = true
    },
    getDistributor(ids) {
      let param = { distributor_id: ids }
      getDistributorList({ ...param, is_app: 1 }).then((res) => {
        this.relDistributors = res.data.data.list
        this.oldData = [...res.data.data.list]
      })
    },
    handleCancel() {
      this.editVisible = false
      this.form.operator_type = 'staff'
      this.operator_id = ''
      this.form.login_name = ''
      this.form.mobile = ''
      this.form.username = ''
      this.form.password = ''
      this.form.role_id = []
      this.form.distributor_ids = []
      this.form.shop_ids = []
      this.relDistributors = []
      this.relShops = []
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = this.$t('81d2acb6.f1333f')
      this.editVisible = true
      this.isEdit = false
      this.form.username = ''
      this.form.login_name = ''
      this.editLoginName = ''
      this.editMobile = ''
      this.operator_id = ''
      this.form.password = ''
      this.form.role_id = []
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = this.$t('81d2acb6.67b76a')
      this.editVisible = true
      this.isEdit = true
      this.form.username = row.username
      this.form.login_name = row.login_name
      this.editLoginName = row.login_name
      this.editMobile = row.mobile
      this.operator_id = row.operator_id
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
      if (this.relShops.length > 0) {
        this.relShops.forEach((shop) => {
          this.form.shop_ids.push({ name: shop.storeName, shop_id: shop.wxShopId })
        })
      }
      if (this.relDistributors.length > 0) {
        this.relDistributors.forEach((distributor) => {
          this.form.distributor_ids.push({
            name: distributor.name,
            distributor_id: distributor.distributor_id
          })
        })
      }

      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.fetchList()
        })
      } else {
        createAccount(this.form).then((response) => {
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
      this.$confirm(this.$t('81d2acb6.80ae2a'), this.$t('81d2acb6.02d981'), {
        confirmButtonText: this.$t('81d2acb6.38cf16'),
        cancelButtonText: this.$t('81d2acb6.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id)
            .then((response) => {
              this.accountsList.splice(index, 1)
              this.$message({
                message: this.$t('81d2acb6.0007d1'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('81d2acb6.acf066')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('81d2acb6.2111cc')
          })
        })
    },
    acitonDisabled(index, row) {
      if (row.is_disabled === true) {
        var msg = this.$t('81d2acb6.a26113')
        this.$confirm(msg, this.$t('81d2acb6.02d981'), {
          confirmButtonText: this.$t('81d2acb6.38cf16'),
          cancelButtonText: this.$t('81d2acb6.625fb2'),
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
      var params = { page: 1, pageSize: 100, version: 1 }
      getRolesList(params).then((res) => {
        this.rolesListData = res.data.data.list
      })
    },
    DistributorChooseAction(data) {
      this.DistributorVisible = false
      this.DistributorStatus = false
      if (data === null || data.length <= 0) return
      this.relDistributors = data
    },
    ShopChooseAction(data) {
      this.ShopVisible = false
      this.ShopStatus = false
      if (data === null || data.length <= 0) return
      this.relShops = data
      this.relDistributors = data
    },
    closeDialogAction() {
      this.ShopVisible = false
      this.ShopStatus = false
      this.relDistributors = this.oldData
      this.DistributorStatus = false
      this.DistributorVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.rel-distributor-tag + .rel-distributor-tag {
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
