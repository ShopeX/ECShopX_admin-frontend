<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addRoleLabels">
          {{ $t('31921bc0.596b04') }}
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="params.role_name" :placeholder="$t('31921bc0.10a6f1')">
          <el-button slot="append" icon="el-icon-search" @click="roleSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="rolesList" :height="wheight - 160">
      <el-table-column prop="role_name" :label="$t('31921bc0.10a6f1')" />
      <el-table-column prop="permission" :label="$t('31921bc0.86a1be')">
        <template slot-scope="scope">
          <el-tree :data="scope.row.permission_tree" :props="defaultProps" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('31921bc0.2b6bc0')">
        <template slot-scope="scope">
          <div class="operating-icons gap-2">
            <el-button type="text" @click="editRoleAction(scope.$index, scope.row)">
{{
              $t('31921bc0.95b351')
            }}
</el-button>
            <el-button type="text" @click="deleteRoleAction(scope.$index, scope.row)">
{{
              $t('31921bc0.2f4aad')
            }}
</el-button>
          </div>
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
    <el-dialog :title="editRoleTitle" :visible.sync="editRoleVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="90px">
          <el-form-item :label="$t('31921bc0.10a6f1')">
            <el-col :span="14">
              <el-input
                v-model="form.role_name"
                :maxlength="20"
                :placeholder="$t('31921bc0.395730')"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('31921bc0.86a1be')">
            <el-tree
              ref="tree"
              :data="$store.getters.menus"
              :default-checked-keys="defaultCheckedKeys"
              node-key="shopmenu_id"
              :props="defaultProps"
              show-checkbox
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('31921bc0.625fb2') }} </el-button>
        <el-button type="primary" @click="submitRoleAction">
          {{ $t('31921bc0.be5fbb') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加、编辑基础物料-结束 -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  createRoles,
  getRolesInfo,
  getRolesList,
  updateRolesInfo,
  deleteRole
} from '../../../api/company'
export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      isEdit: false,
      editRoleVisible: false,
      editRoleTitle: '',
      form: {
        role_name: '',
        role_id: '',
        permission: []
      },
      defaultCheckedKeys: [],
      rolesList: [],
      loading: false,
      total_count: 0,
      params: {
        role_name: '',
        page: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getRolesDataList()
  },
  methods: {
    handleCancel() {
      this.editRoleVisible = false
      this.$refs.tree.setCheckedKeys([])
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getRolesDataList()
    },
    addRoleLabels() {
      // 添加物料弹框
      this.editRoleTitle = this.$t('31921bc0.d36f39')
      this.editRoleVisible = true
      this.isEdit = false
      this.form.role_name = ''
      this.form.role_id = ''
      this.form.permission = []
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([])
      } else {
        this.defaultCheckedKeys = []
      }
    },
    editRoleAction(index, row) {
      // 编辑物料弹框
      this.editRoleTitle = this.$t('31921bc0.b0acd5')
      this.editRoleVisible = true
      this.isEdit = true
      this.form.role_name = row.role_name
      this.form.role_id = row.role_id
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(row.permission.shopmenu_ids)
      } else {
        this.defaultCheckedKeys = row.permission.shopmenu_ids
      }
    },
    submitRoleAction() {
      // 提交物料

      var checkedNodes = this.$refs.tree.getCheckedNodes()
      var checkedKeys = []
      checkedNodes.forEach((item) => {
        if (!item.isChildrenMenu) {
          checkedKeys.push(item.shopmenu_id)
        }
      })

      var version = this.$store.getters.menus[0].version
      this.form.permission = { shopmenu_ids: checkedKeys, version: version }
      if (this.form.role_id) {
        updateRolesInfo(this.form.role_id, this.form).then((response) => {
          this.editRoleVisible = false
          this.getRolesDataList()
          this.handleCancel()
        })
      } else {
        createRoles(this.form).then((response) => {
          this.editRoleVisible = false
          this.getRolesDataList()
          this.handleCancel()
        })
      }
    },
    roleSearch() {
      this.params.page = 1
      this.getRolesDataList()
    },
    getRolesDataList() {
      this.loading = true
      this.params.service_type = 'timescard'
      getRolesList(this.params)
        .then((response) => {
          this.rolesList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('31921bc0.929b60')
          })
        })
    },
    deleteRoleAction(index, row) {
      this.$confirm(this.$t('31921bc0.82cd52'), this.$t('31921bc0.02d981'), {
        confirmButtonText: this.$t('31921bc0.38cf16'),
        cancelButtonText: this.$t('31921bc0.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteRole(row.role_id).then((response) => {
            this.rolesList.splice(index, 1)
            this.$message({
              message: this.$t('31921bc0.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('31921bc0.2111cc')
          })
        })
    }
  }
}
</script>
<style lang="scss">
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
.bg-purple-light {
  background: #e5e9f2;
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
