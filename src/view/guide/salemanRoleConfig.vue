<template>
  <div class="distributorAftersalesAddress">
    <div style="margin-bottom: 15px">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="handleCreate">
          添加门店角色
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="tableLoading" :data="list" style="width: 100%">
        <el-table-column prop="role_name" label="角色" width="200px" />
        <el-table-column prop="rule_ids" label="角色权限">
          <template slot-scope="scope">
            <div v-if="scope.row.rule_ids">
              <span v-for="(item, index) in scope.row.rule_ids" :key="index">
                {{ roleList[item] ? roleList[item].name : '' }},
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button circle type="primary" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button
              circle
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="content-center content-top-padded">
        <el-pagination
          background
          :current-page="params.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="params.page_size"
          layout="total, sizes, prev, pager, next"
          :total="total_count"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="45%"
      >
        <el-form ref="dataForm" :model="data" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="data.role_name" placeholder />
          </el-form-item>
          <el-form-item label="权限">
            <el-checkbox-group v-model="data.rule_ids">
              <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.key">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button v-if="operate == 'create'" type="primary" @click="createDistributorRole"
            >确 定</el-button
          >
          <el-button v-if="operate == 'update'" type="primary" @click="updateDistributorRole"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getRoleInfo,
  createRole,
  updateRole,
  deleteRole,
  getSalesmanRole
} from '@/api/marketing'

export default {
  data() {
    return {
      roleList: {},
      tableLoading: false,
      dialogVisible: false,
      list: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 20
      },
      data: {
        role_name: '',
        rule_ids: []
      },
      dialogTitle: '添加门店角色',
      operate: 'update'
    }
  },
  mounted() {
    this.getDistributorRoleList()
    this.getSalesmanRoleList()
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
    },
    handleCreate() {
      this.dialogVisible = true
      this.operate = 'create'
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.operate = 'update'
      this.data.rule_ids = row.rule_ids
      this.data.role_name = row.role_name
      this.data = Object.assign({}, row)
      this.dialogTitle = '修改门店角色'
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该店铺发票信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRole(row.salesman_role_id).then(response => {
            if (response.data.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
            this.getDistributorRoleList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSizeChange(val) {
      this.params.page_size = val
    },
    handleCurrentChange(val) {
      this.params.page = val
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    createDistributorRole() {
      createRole(this.data).then(response => {
        if (response.data.data.salesman_role_id) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorRoleList()
      })
    },
    updateDistributorRole(row) {
      updateRole(this.data.salesman_role_id, this.data).then(response => {
        if (response.data.data.salesman_role_id) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '修改失败',
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorRoleList()
      })
    },
    getDistributorRoleList() {
      this.tableLoading = true
      getRoleList(this.params).then(response => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          for (var item in this.list) {
            this.list[item].rule_ids = JSON.parse(this.list[item].rule_ids)
          }
          this.total_count = response.data.data.total_count
        }
        this.tableLoading = false
      })
    },
    getSalesmanRoleList() {
      getSalesmanRole().then(response => {
        if (response.data.data) {
          this.roleList = response.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
