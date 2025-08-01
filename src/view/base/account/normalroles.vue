<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="role_name" label="角色名称:">
        <el-input v-model="params.role_name" placeholder="请输入角色名称" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" icon="plus" @click="addRoleLabels"> 添加角色 </el-button>
    </div>

    <el-table v-loading="loading" border :data="rolesList">
      <el-table-column prop="role_name" label="角色名称" />
      <el-table-column prop="permission" label="角色权限">
        <template slot-scope="scope">
          <el-tree :data="scope.row.permission_tree" :props="defaultProps" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button type="text" @click="editRoleAction(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteRoleAction(scope.$index, scope.row)">
              删除
            </el-button>
          </div>
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
    <el-dialog :title="editRoleTitle" :visible.sync="editRoleVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="90px">
          <el-form-item label="角色名称">
            <el-col :span="14">
              <el-input
                v-model="form.role_name"
                :maxlength="20"
                placeholder="订单管理员、商品管理员、等等"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="角色权限">
            <el-tree
              ref="tree"
              :data="menu"
              :default-checked-keys="defaultCheckedKeys"
              node-key="alias_name"
              :props="defaultProps"
              show-checkbox
            />
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> 取消 </el-button>
        <el-button type="primary" @click="submitRoleAction"> 保存 </el-button>
      </div>
    </el-dialog>
    <!-- 添加、编辑基础物料-结束 -->
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { pageMixin } from '@/mixins'
import {
  createRoles,
  getRolesInfo,
  getRolesList,
  updateRolesInfo,
  deleteRole
} from '../../../api/company'
export default {
  mixins: [pageMixin],
  data() {
    return {
      menu: [],
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
        role_name: ''
      }
    }
  },
  mounted() {
    this.fetchList()
    const menu = this.$store.state.user.accessMenus
    this.menu = menu
  },
  methods: {
    handleCancel() {
      this.editRoleVisible = false
      this.$refs.tree.setCheckedKeys([])
    },
    addRoleLabels() {
      // 添加物料弹框
      this.editRoleTitle = '角色添加'
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
      this.editRoleTitle = '角色编辑'
      this.editRoleVisible = true
      this.isEdit = true
      this.form.role_name = row.role_name
      this.form.role_id = row.role_id
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(row.permission.shopmenu_alias_name)
      } else {
        this.defaultCheckedKeys = row.permission.shopmenu_alias_name
      }
    },
    submitRoleAction() {
      // 提交物料

      var checkedNodes = this.$refs.tree.getCheckedNodes()
      var checkedKeys = []
      checkedNodes.forEach(item => {
        if (!item.isChildrenMenu) {
          checkedKeys.push(item.alias_name)
        }
      })

      var version = this.$store.getters.menus && this.$store.getters.menus[0]?.version
      this.form.permission = { shopmenu_alias_name: checkedKeys, version: version }
      if (this.form.role_id) {
        updateRolesInfo(this.form.role_id, this.form).then(response => {
          this.editRoleVisible = false
          this.fetchList()
          this.handleCancel()
        })
      } else {
        createRoles(this.form).then(response => {
          this.editRoleVisible = false
          this.fetchList()
          this.handleCancel()
        })
      }
    },
    fetchList() {
      this.loading = true
      this.params.service_type = 'timescard'
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getRolesList(params)
        .then(response => {
          this.rolesList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '页面已过期，请刷新重试'
          })
        })
    },
    deleteRoleAction(index, row) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole(row.role_id).then(response => {
            this.rolesList.splice(index, 1)
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
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
