<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="distributorAftersalesAddress">
    <div style="margin-bottom: 15px">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="handleCreate">
          {{ $t('bedd692a.ff62dd') }}
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="tableLoading" :data="list" style="width: 100%">
        <el-table-column prop="role_name" :label="$t('bedd692a.464f3d')" width="200px" />
        <el-table-column prop="rule_ids" :label="$t('bedd692a.86a1be')">
          <template slot-scope="scope">
            <div v-if="scope.row.rule_ids">
              <span v-for="(item, index) in scope.row.rule_ids" :key="index">
                {{ roleList[item] ? roleList[item].name : '' }},
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('bedd692a.2b6bc0')" width="200px">
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
          <el-form-item :label="$t('bedd692a.10a6f1')">
            <el-input v-model="data.role_name" placeholder />
          </el-form-item>
          <el-form-item :label="$t('bedd692a.ba6e91')">
            <el-checkbox-group v-model="data.rule_ids">
              <el-checkbox v-for="(item, index) in roleList" :key="index" :label="item.key">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('bedd692a.c08ab9') }}</el-button>
          <el-button v-if="operate == 'create'" type="primary" @click="createDistributorRole">{{
            $t('bedd692a.aa7527')
          }}</el-button>
          <el-button v-if="operate == 'update'" type="primary" @click="updateDistributorRole">{{
            $t('bedd692a.aa7527')
          }}</el-button>
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
      dialogTitle: '',
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
      this.dialogTitle = this.$t('bedd692a.ff62dd')
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.operate = 'update'
      this.data.rule_ids = row.rule_ids
      this.data.role_name = row.role_name
      this.data = Object.assign({}, row)
      this.dialogTitle = this.$t('bedd692a.8d7970')
    },
    handleDelete(row) {
      this.$confirm(this.$t('bedd692a.edc438'), this.$t('60e84c78.02d981'), {
        confirmButtonText: this.$t('bedd692a.aa7527'),
        cancelButtonText: this.$t('bedd692a.c08ab9'),
        type: 'warning'
      })
        .then(() => {
          deleteRole(row.salesman_role_id).then((response) => {
            if (response.data.data.status) {
              this.$message({
                type: 'success',
                message: this.$t('bedd692a.fc9bdd')
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$t('bedd692a.9cf7a3')
              })
            }
            this.getDistributorRoleList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('bedd692a.c34281')
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
      createRole(this.data).then((response) => {
        if (response.data.data.salesman_role_id) {
          this.$message({
            message: this.$t('bedd692a.3fdaea'),
            type: 'success'
          })
        } else {
          this.$message({
            message: this.$t('bedd692a.6452a0'),
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorRoleList()
      })
    },
    updateDistributorRole(row) {
      updateRole(this.data.salesman_role_id, this.data).then((response) => {
        if (response.data.data.salesman_role_id) {
          this.$message({
            message: this.$t('bedd692a.69be67'),
            type: 'success'
          })
        } else {
          this.$message({
            message: this.$t('bedd692a.5badb3'),
            type: 'error'
          })
        }
        this.dialogVisible = false
        this.getDistributorRoleList()
      })
    },
    getDistributorRoleList() {
      this.tableLoading = true
      getRoleList(this.params).then((response) => {
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
      getSalesmanRole().then((response) => {
        if (response.data.data) {
          this.roleList = response.data.data
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
