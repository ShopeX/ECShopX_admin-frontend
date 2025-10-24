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
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row>
        <el-col :span="12">
          门店类型：
          <el-select v-model="store_type" @change="storeChange">
            <el-option label="直营店" :value="1"> 直营店 </el-option>
            <el-option label="非直营店" :value="2"> 非直营店 </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" class="content-right">
          <router-link :to="matchRoutePath('editor')">
            <el-button type="primary" icon="el-icon-plus"> 添加门店 </el-button>
          </router-link>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="wxShopsList" style="width: 100%" :height="wheight - 305">
        <el-table-column prop="storeName" label="门店名称" width="240" />
        <el-table-column prop="isDirectStore" label="门店类型">
          <template slot-scope="scope">
            <div v-if="scope.row.isDirectStore === 1">
              <el-tag type="success" size="mini"> 直营 </el-tag>
            </div>
            <div v-if="scope.row.isDirectStore === 2">
              <el-tag type="gray" size="mini"> 非直营 </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="240" label="地理位置">
          <template slot-scope="scope">
            <div v-if="scope.row.isDomestic == 2">
              {{ scope.row.country }} {{ scope.row.city }} {{ scope.row.address }}
            </div>
            <div v-else>
              {{ scope.row.address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOpen"
              active-color="#13ce66"
              inactive-color="#efefef"
              @change="setStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="设为默认" width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isDefault"
              active-color="#13ce66"
              inactive-color="#efefef"
              :disabled="scope.row.isDefault ? true : false"
              @change="setDefault(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <template slot-scope="scope">
            <el-button
              v-if="1"
              size="mini"
              type="text"
              @click="wxShopsEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button v-else size="mini" type="text" :disabled="true"> 编辑 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > pageLimit" class="mt-4 text-right">
        <el-pagination
          layout="prev, pager, next"
          :total="total_count"
          :page-size="pageLimit"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import {
  getWxShopsList,
  getWxShopsDetail,
  createWxShops,
  deleteWxShops,
  updateWxShops,
  syncWxShops,
  setDefaultShop,
  setResource,
  setShopStatus
} from '@/api/shop'
export default {
  provide() {
    return {
      refresh: this.getShopsList
    }
  },
  data() {
    return {
      fileList: [],
      activeName: 'first',
      wxShopsList: [],
      wxShopsDetailVisible: false,
      wxShopsDetailData: {},
      loading: false,
      pageLimit: 10,
      total_count: 0,
      params: {},
      dialogTableVisible: false,
      resourceList: [],
      resourceCount: 0,
      bindShopId: '',
      bindResId: '',
      currentRow: null,
      store_type: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params = { page: 1, pageSize: this.pageLimit }
    let resparams = { page_no: 1, page_size: this.pageLimit, is_valid: true }
    this.getShopsList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params = { page: page_num, pageSize: this.pageLimit }
      this.getShopsList()
    },
    reshandleCurrentChange(page_num) {
      let resparams = { page_no: page_num, page_size: this.pageLimit, is_valid: true }
    },
    wxShopsEdit(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.wxShopId })
      //let routeData = this.$router.resolve({path: this.matchRoutePath('editor/') + row.wxShopId})
      //window.open(routeData.href, '_blank')
    },
    wxShopsDetail(index, row) {
      this.wxShopsDetailVisible = true
      getWxShopsDetail(row.wxShopId).then(response => {
        this.wxShopsDetailData = response.data.data
      })
    },
    getShopsList() {
      this.loading = true
      getWxShopsList(this.params).then(response => {
        this.wxShopsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    setDefault(row) {
      let params = { wx_shop_id: row.wxShopId }
      setDefaultShop(params).then(response => {
        for (var i = this.wxShopsList.length - 1; i >= 0; i--) {
          if (this.wxShopsList[i].wxShopId != row.wxShopId) {
            this.wxShopsList[i].isDefault = false
          }
        }
      })
    },
    resCurrentChange(val) {
      this.currentRow = val
    },
    setResource() {
      let params = { wx_shop_id: this.bindShopId, resource_id: this.bindResId }
      setResource(params).then(response => {
        for (var i = this.wxShopsList.length - 1; i >= 0; i--) {
          if (this.wxShopsList[i].wxShopId == this.bindShopId) {
            this.wxShopsList[i].is_valid = true
            this.wxShopsList[i].expiredAt = response.data.data.status.expired_at
          }
        }
        this.dialogTableVisible = false
      })
    },
    cancelRes() {
      this.dialogTableVisible = false
      this.$refs.resource_list.setCurrentRow()
    },
    deleteWxShopsAction(index, row) {
      this.$confirm('此操作将删除该门店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteWxShops(row.wxShopId)
            .then(response => {
              this.wxShopsList.splice(index, 1)
              this.$message({
                message: '删除门店成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除门店失败'
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
    syncWxShops() {
      this.$confirm('确定同步微信门店到本系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncWxShops().then(response => {
            this.$message({
              message: '同步成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.getShopsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    storeChange(val) {
      this.params.is_direct_store = val
      this.getShopsList()
    },
    setStatus(row) {
      let params = { wx_shop_id: row.wxShopId, status: row.isOpen }
      setShopStatus(params).then(res => {})
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
<style lang="scss">
.wxshop-box {
  .el-switch.is-disabled .el-switch__core {
    border-color: rgb(19, 206, 102) !important;
    background-color: rgb(19, 206, 102) !important;
  }
}
.resource-dialog {
  .el-table__row {
    cursor: pointer;
  }
  .el-table__empty-text {
    left: 50%;
  }
}
</style>
