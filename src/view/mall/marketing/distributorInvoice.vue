<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="distributorAftersalesAddress">
    <div style="margin-bottom: 15px">
      <div>
        <el-button icon="el-icon-plus" type="primary" @click="handleCreate">
          添加店铺发票信息
        </el-button>
      </div>
      <!-- 数据表格 -->
      <el-table v-loading="tableLoading" :data="list" style="width: 100%">
        <el-table-column prop="distributor_name" label="店铺名" width="200px" />
        <el-table-column prop="invoice_head" label="发票抬头" />
        <el-table-column prop="invoice_code" label="纳税人识别号" width="150px" />
        <el-table-column prop="invoice_code" label="发票类型" width="200px">
          <template slot-scope="scope">
            <span v-if="1 == scope.row.invoice_type">专用增值税发票</span>
            <span v-else-if="2 == scope.row.invoice_type">普通发票</span>
          </template>
        </el-table-column>
        <el-table-column prop="invoice_addr" label="专票注册地址" />
        <el-table-column prop="invoice_phone_number" label="专票注册电话" width="100px" />
        <el-table-column prop="invoice_bank_name" label="专票开户银行" width="200px" />
        <el-table-column prop="invoice_bank_no" label="专票银行卡号" width="100px" />
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
          background=""
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
        title="店铺列表"
        :visible.sync="relShop.relShopVisible"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="shopLoading" :data="relShop.list">
            <el-table-column prop="shop_id" label="id" width="60" />
            <el-table-column prop="store_name" label="店铺名称" width="300" />
            <el-table-column prop="address" label="店铺地址" />
          </el-table>
          <div
            v-if="relShop.total_count > relShop.params.page_size"
            class="content-center content-top-padded"
          >
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="relShop.params.page"
              :total="relShop.total_count"
              :page-size="relShop.params.page_size"
              @current-change="handleRelShopCurrentChange"
            />
          </div>
        </template>
      </el-dialog>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        width="45%"
      >
        <el-form ref="dataForm" :model="data" label-width="100px">
          <el-form-item label="店铺">
            <template v-if="rel_distributor_ids && operate == 'create'">
              <el-tag
                v-for="(item, index) in rel_distributor_ids"
                :key="item.name"
                :disable-transitions="false"
                closable
                @close="storeClose(rel_distributor_ids, index)"
              >
                {{ item.name }}
              </el-tag>
            </template>
            <el-button
              v-if="rel_distributor_ids && operate == 'create'"
              type="text"
              @click="addStoreAction"
            >
              添加适用店铺
            </el-button>
            <template v-if="operate == 'update'">
              <span>{{ shopname }}</span>
            </template>
          </el-form-item>
          <el-form-item label="发票抬头">
            <el-input v-model="data.invoice_head" placeholder="" />
          </el-form-item>
          <el-form-item label="纳税人识别号">
            <el-input v-model="data.invoice_code" placeholder="" />
          </el-form-item>
          <el-form-item label="发票类型">
            <el-radio-group v-model="data.invoice_type">
              <el-radio :label="'1'"> 专用增值税发票 </el-radio>
              <!--              <el-radio :label="'2'">普通发票</el-radio>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="专票注册地址">
            <el-input v-if="1 == data.invoice_type" v-model="data.invoice_addr" placeholder="" />
          </el-form-item>
          <el-form-item label="专票注册电话">
            <el-input
              v-if="1 == data.invoice_type"
              v-model="data.invoice_phone_number"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="专票开户银行">
            <el-input
              v-if="1 == data.invoice_type"
              v-model="data.invoice_bank_name"
              placeholder=""
            />
          </el-form-item>
          <el-form-item label="专票银行卡号">
            <el-input v-if="1 == data.invoice_type" v-model="data.invoice_bank_no" placeholder="" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button v-if="operate == 'create'" type="primary" @click="createDistributorInvoice"
            >确 定</el-button
          >
          <el-button v-if="operate == 'update'" type="primary" @click="updateDistributorInvoice"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-data-ids="relStores"
      :get-status="setStoreStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>

<script>
import {
  getInvoiceList,
  getInvoiceInfo,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from '@/api/aftersales'
import StoreSelect from '@/components/storeListSelect/newindex'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    StoreSelect,
    shopSelect
  },
  data() {
    return {
      tableLoading: false,
      shopLoading: false,
      dialogVisible: false,
      storeVisible: false,
      setStoreStatus: false,
      list: [],
      total_count: 0,
      params: {
        page: 1,
        page_size: 20
      },
      data: {
        invoice_head: '',
        invoice_code: '',
        invoice_type: '1',
        invoice_addr: '',
        invoice_phone_number: '',
        invoice_bank_name: '',
        invoice_bank_no: ''
      },
      dialogTitle: '添加店铺发票信息',
      distributors: [],
      distributor_id: 0,
      shopname: '',
      operate: 'update',
      rel_distributor_ids: [],
      relStores: [],
      relShop: {
        list: [],
        total_count: 0,
        params: {
          page: 1,
          page_size: 20
        },
        relShopVisible: false
      }
    }
  },
  mounted() {
    this.getDistributorInvoiceList()
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
      this.shopname = row.distributor_name
      this.data = Object.assign({}, row)
      this.dialogTitle = '修改店铺发票信息'
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该店铺发票信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteInvoice(row.invoice_id).then(response => {
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
            this.getDistributorInvoiceList()
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
    addStoreAction() {
      this.storeVisible = true
      this.setStoreStatus = true
      this.relStores = JSON.parse(JSON.stringify(this.rel_distributor_ids))
    },
    storeClose(list, index) {
      this.setStoreStatus = false
      this.rel_distributor_ids.splice(index, 1)
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      if (data === null || data.length <= 0) return
      this.rel_distributor_ids = data
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    createDistributorInvoice() {
      const ids = []
      this.rel_distributor_ids.forEach(function (value) {
        ids.push(value.distributor_id)
      })
      this.data.distributor_id = ids
      createInvoice(this.data).then(response => {
        if (response.data.data.status) {
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
        this.getDistributorInvoiceList()
      })
    },
    updateDistributorInvoice(row) {
      updateInvoice(this.data.invoice_id, this.data).then(response => {
        if (response.data.data.status) {
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
        this.getDistributorInvoiceList()
      })
    },
    getDistributorInvoiceList() {
      this.tableLoading = true
      getInvoiceList(this.params).then(response => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
        }
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
