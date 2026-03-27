<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
    <el-tab-pane :label="$t('510bb360.48529f')" name="staff">
      <normalstaffManager :is-load="normalStaff" />
    </el-tab-pane>
    <el-tab-pane :label="$t('510bb360.41c6e5')" name="store">
      <storestaffManager :is-load="storeStaff" />
    </el-tab-pane>
  </el-tabs>
</template>
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addLabels">{{
          $t('510bb360.f0677c')
        }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-input :placeholder="$t('510bb360.8098e2')" v-model="mobile"
          ><el-button slot="append" icon="el-icon-search" @click="dataSearch"></el-button
        ></el-input>
      </el-col>
    </el-row>
    <el-table :data="accountsList" :height="wheight - 160" v-loading="loading">
      <el-table-column prop="login_name" :label="$t('510bb360.17327f')"></el-table-column>
      <el-table-column prop="mobile" :label="$t('510bb360.8098e2')"></el-table-column>
      <el-table-column prop="username" :label="$t('510bb360.60d045')"></el-table-column>
      <el-table-column prop="roles" :label="$t('510bb360.464f3d')">
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
      <el-table-column :label="$t('510bb360.2b6bc0')">
        <template slot-scope="scope">
          <el-button size="mini" @click="editAction(scope.$index, scope.row)">{{
            $t('510bb360.95b351')
          }}</el-button>
          <el-button size="mini" @click="deleteAccountAction(scope.$index, scope.row)">{{
            $t('510bb360.2f4aad')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
      >
      </el-pagination>
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog :title="editTitle" :visible.sync="editVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="120px">
          <el-form-item :label="$t('510bb360.bb2cdf')">
            <el-col :span="10">
              <el-input
                v-if="!editLoginName"
                v-model="form.login_name"
                :minlength="4"
                :maxlength="16"
                :placeholder="$t('510bb360.2b668a')"
              ></el-input>
              <el-input v-else v-model="form.login_name" :disabled="true"></el-input>
            </el-col>
            <p class="frm-tips">{{ $t('510bb360.d59d95') }}</p>
          </el-form-item>
          <el-form-item :label="$t('510bb360.8098e2')">
            <el-col :span="10">
              <el-input
                v-if="!isEdit"
                v-model="form.mobile"
                :maxlength="11"
                :placeholder="$t('510bb360.fed6c9')"
              ></el-input>
              <el-input v-else v-model="editMobile" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('510bb360.60d045')">
            <el-col :span="10"
              ><el-input
                required
                v-model="form.username"
                :placeholder="$t('510bb360.76e7b3')"
              ></el-input
            ></el-col>
          </el-form-item>
          <el-form-item :label="$t('510bb360.2646b8')">
            <el-col :span="10"><el-input :maxlength="255" v-model="form.secret"></el-input></el-col>
          </el-form-item>
          <el-form-item :label="$t('510bb360.baad7e')">
            <el-tag
              :key="shop_name"
              class="new-tag"
              v-for="shop_name in dynamicShopName"
              closable
              :disable-transitions="false"
              @close="handleClose(shop_name)"
            >
              {{ shop_name }}
            </el-tag>
            <el-autocomplete
              class="input-new-tag"
              v-if="inputVisible"
              popper-class="my-autocomplete"
              :fetch-suggestions="queryShopNameSearch"
              :placeholder="$t('510bb360.a11cc7')"
              prefix-icon="el-icon-search"
              @select="shopNameSearch"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
              </template>
            </el-autocomplete>
            <el-button v-else size="medium" class="button-new-tag" @click="showInput"
              >{{ $t('510bb360.a5d26b') }}
            </el-button>
          </el-form-item>
          <el-form-item :label="$t('510bb360.464f3d')">
            <el-checkbox-group v-model="form.role_id">
              <el-checkbox
                v-for="role in rolesListData"
                :label="role.role_id"
                :key="role.role_id"
                :value="role.role_id"
                >{{ role.role_name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">{{ $t('510bb360.625fb2') }}</el-button>
        <el-button type="primary" @click="submitAction">{{ $t('510bb360.be5fbb') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  createAccount,
  getAccountInfo,
  getAccountList,
  updateAccountInfo,
  deleteAccountInfo,
  getRolesList
} from '../../../api/company'
import { getDistributorList } from '../../../api/marketing'
import StoreSelect from '@/components/storeselect'
export default {
  components: {},
  props: ['getStatus'],
  data() {
    return {
      dynamicShopName: [],
      dynamicStoreName: [],
      dynamicStoreId: [],
      inputVisible: false,
      inputValue: '',
      setStatus: false,
      isEdit: false,
      editVisible: false,
      editTitle: '',
      form: {
        mobile: '',
        login_name: '',
        username: '',
        distributor_ids: [],
        secret: '',
        role_id: []
      },
      activeName: 'first',
      mobile: '',
      editLoginName: '',
      editMobile: '',
      accountsList: [],
      editLabels: false,
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      operator_id: 0,
      rolesListData: [],
      relShopIds: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getAccountListData()
      }
    }
  },
  mounted() {
    this.getAccountListData()
    this.getRolesListData()
  },
  methods: {
    shopNameSearch(item) {
      if (this.dynamicShopName.indexOf(item.name) != -1) {
        this.$message({
          type: 'error',
          message: this.$t('510bb360.fad882')
        })
      } else {
        this.dynamicShopName.push(item.name)
        var data = { name: item.name, distributor_id: item.distributor_id }
        this.form.distributor_ids.push(data)
        this.inputVisible = false
      }
    },
    queryShopNameSearch(queryString, cb) {
      var restaurants = []
      getDistributorList({ name: queryString, page: 1, pageSize: 500 }).then((res) => {
        restaurants = res.data.data.list
        // 调用 callback 返回建议列表的数据
        cb(restaurants)
      })
    },
    handleClose(item) {
      this.dynamicShopName.splice(this.dynamicShopName.indexOf(item), 1)
      this.form.distributor_ids.splice(this.dynamicShopName.indexOf(item), 1)
    },
    showInput() {
      this.inputVisible = true
    },
    handleCancel() {
      this.editVisible = false
      this.operator_id = ''
      this.form.login_name = ''
      this.form.mobile = ''
      this.form.username = ''
      this.form.secret = ''
      this.form.role_id = []
      this.form.distributor_ids = []
      this.dynamicStoreName = []
      this.dynamicShopName = []
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getAccountListData()
    },
    addLabels() {
      // 添加物料弹框
      this.handleCancel()
      this.editTitle = this.$t('510bb360.f1333f')
      this.editVisible = true
      this.isEdit = false
    },
    editAction(index, row) {
      // 编辑物料弹框
      this.handleCancel()
      this.editTitle = this.$t('510bb360.67b76a')
      this.editVisible = true
      this.isEdit = true
      this.form.username = row.username
      this.form.login_name = row.login_name
      this.editLoginName = row.login_name
      this.editMobile = row.mobile
      this.operator_id = row.operator_id

      this.form.distributor_ids = row.distributor_ids ? row.distributor_ids : []
      if (this.form.distributor_ids.length > 0) {
        this.form.distributor_ids.forEach((item) => {
          this.dynamicShopName.push(item.name)
        })
      }

      this.form.secret = ''
      row.role_data.forEach((item) => {
        this.form.role_id.push(item.role_id)
      })
    },
    submitAction() {
      // 提交物料
      if (this.operator_id) {
        updateAccountInfo(this.operator_id, this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getAccountListData()
        })
      } else {
        createAccount(this.form).then((response) => {
          this.detailData = response.data.data
          this.editVisible = false
          this.getAccountListData()
          this.handleCancel()
        })
      }
    },
    dataSearch() {
      this.params.mobile = this.mobile
      this.params.page = 1
      this.getAccountListData()
    },
    getAccountListData() {
      this.loading = true
      getAccountList(this.params).then((response) => {
        this.accountsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteAccountAction(index, row) {
      this.$confirm(this.$t('510bb360.80ae2a'), this.$t('510bb360.02d981'), {
        confirmButtonText: this.$t('510bb360.38cf16'),
        cancelButtonText: this.$t('510bb360.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteAccountInfo(row.operator_id).then((response) => {
            this.accountsList.splice(index, 1)
            this.$message({
              message: this.$t('510bb360.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('510bb360.2111cc')
          })
        })
    },
    getRolesListData() {
      var params = { page: 1, pageSize: 100 }
      getRolesList(params).then((res) => {
        this.rolesListData = res.data.data.list
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

<script>
import normalstaffManager from './normalstaff'
import storestaffManager from './storestaff'

export default {
  components: {
    normalstaffManager,
    storestaffManager
  },
  data() {
    return {
      activeName: 'staff',
      normalStaff: true,
      storeStaff: false
    }
  },
  methods: {
    handleClick() {
      if (this.activeName === 'staff') {
        this.normalStaff = true
        this.storeStaff = false
      } else if (this.activeName === 'store') {
        this.normalStaff = false
        this.storeStaff = true
      }
    }
  },
  mounted() {
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name
    }
    if (this.activeName === 'staff') {
      this.normalStaff = true
      this.storeStaff = false
    } else if (this.activeName === 'store') {
      this.normalStaff = false
      this.storeStaff = true
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss"></style>
