<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-if="$route.path.indexOf('editor') === -1" v-model="activeName" type="border-card">
      <el-tab-pane :label="$t('aa338e9b.b94273')" name="first">
        <el-row>
          <el-col :span="12">
            {{ $t('aa338e9b.e3d663') }}
            <el-select v-model="store_type" @change="storeChange">
              <el-option :label="$t('aa338e9b.4b940c')" :value="1">
                {{ $t('aa338e9b.4b940c') }}
              </el-option>
              <el-option :label="$t('aa338e9b.c26325')" :value="2">
                {{ $t('aa338e9b.c26325') }}
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="12" class="content-right">
            <router-link :to="matchRoutePath('editor')">
              <el-button type="primary" icon="el-icon-plus">
                {{ $t('aa338e9b.894d98') }}
              </el-button>
            </router-link>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="wxShopsList"
          style="width: 100%"
          :height="wheight - 305"
        >
          <el-table-column prop="storeName" :label="$t('aa338e9b.740032')" width="240" />
          <el-table-column prop="isDirectStore" :label="$t('aa338e9b.4b940c')">
            <template slot-scope="scope">
              <div v-if="scope.row.isDirectStore === 1">
                <el-tag type="success" size="mini"> {{ $t('aa338e9b.0f2d3f') }} </el-tag>
              </div>
              <div v-if="scope.row.isDirectStore === 2">
                <el-tag type="gray" size="mini"> {{ $t('aa338e9b.7439a8') }} </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="240" :label="$t('aa338e9b.fc82aa')">
            <template slot-scope="scope">
              <div v-if="scope.row.isDomestic == 2">
                {{ scope.row.country }} {{ scope.row.city }} {{ scope.row.address }}
              </div>
              <div v-else>
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('aa338e9b.3fea7c')" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_valid"
                active-color="#13ce66"
                inactive-color="#efefef"
                @change="setStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <!-- <el-table-column prop="expiredAt" label="到期时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.expiredAt && scope.row.is_valid">{{scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss')}}</span>
            <span v-else-if="scope.row.expiredAt && !scope.row.is_valid">
              <el-tag type="danger">已过期</el-tag>
            </span>
            <span v-else> -- </span>
          </template>
          </el-table-column> -->
          <el-table-column :label="$t('aa338e9b.1af3ec')" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_default"
                active-color="#13ce66"
                inactive-color="#efefef"
                :disabled="scope.row.is_default ? true : false"
                @change="setDefault(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('aa338e9b.2b6bc0')" width="170">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" v-if="!scope.row.is_valid" @click="getRes(scope.row)">激活</el-button> -->
              <el-button size="mini" type="text" @click="shopsEdit(scope.$index, scope.row)">
                {{ $t('aa338e9b.95b351') }}
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="distributorShopsDetail(scope.$index, scope.row)"
              >
                {{ $t('aa338e9b.f26225') }}
              </el-button>
              <!-- <el-button size="mini" type="text" @click="deleteDistributorShopAction(scope.$index, scope.row)">删除</el-button> -->
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
        <!-- 资源列表 -->
        <!-- <el-dialog title="资源列表" :close-on-click-modal="false" :visible.sync="dialogTableVisible" class="resource-dialog">
          <el-table :data="resourceList" max-height="420" border ref="resource_list" highlight-current-row @current-change="resCurrentChange" @row-click="getResId">
            <el-table-column label="激活时间" >
              <template slot-scope="scope">
                <span>{{scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="resourceName" label="资源名称" ></el-table-column>
            <el-table-column prop="leftShopNum" label="剩余门店数"></el-table-column>
            <el-table-column label="到期期时间">
              <template slot-scope="scope">
                <span>{{scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="resourceCount > pageLimit" class="content-center">
            <el-pagination
            layout="prev, pager, next"
            @current-change="reshandleCurrentChange"
            :total="resourceCount" :page-size="pageLimit">
            </el-pagination>
          </div>
          <div slot="footer" class="dialog-footer content-center">
            <el-button @click="cancelRes()">取 消</el-button>
            <el-button type="primary" @click="setResource">确 定</el-button>
          </div>
        </el-dialog> -->
      </el-tab-pane>
      <!-- <el-tab-pane label="可用资源包列表" name="resourceList"  v-loading="loading">
        <el-table :data="resourceList" :height="wheight-110" style="width: 100%">
          <el-table-column prop="resourceName" label="资源名称" ></el-table-column>
          <el-table-column prop="shopNum" label="包含门店数" ></el-table-column>
          <el-table-column prop="leftShopNum" label="剩余门店数"></el-table-column>
          <el-table-column label="激活时间" >
            <template slot-scope="scope">
              <span>{{scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="到期期时间">
            <template slot-scope="scope">
              <span>{{scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss')}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="resourceCount > pageLimit" class="content-center content-padded">
          <el-pagination
          layout="prev, pager, next"
          @current-change="reshandleCurrentChange"
          :total="resourceCount" :page-size="pageLimit">
          </el-pagination>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { setResource } from '@/api/shop'
import {
  setDefaultDistributorShop,
  setDistributorShopStatus,
  getDistributorShopList,
  getDistributorShopDetail,
  deleteDistributorShop
} from '@/api/marketing'
import { getResourceList } from '@/api/company'
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
      distributorShopsDetailVisible: false,
      detailData: {},
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
    this.getResourceList(resparams)
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params = { page: page_num, pageSize: this.pageLimit }
      this.getShopsList()
    },
    reshandleCurrentChange(page_num) {
      let resparams = { page_no: page_num, page_size: this.pageLimit, is_valid: true }
      this.getResourceList(resparams)
    },
    shopsEdit(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.distributor_id })
    },
    distributorShopsDetail(index, row) {
      this.distributorShopsDetailVisible = true
      getDistributorShopDetail(row.distributor_id)
        .then((response) => {
          this.detailData = response.data.data
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('aa338e9b.816eba')
          })
        })
    },
    getShopsList() {
      this.loading = true
      getDistributorShopList(this.params)
        .then((response) => {
          this.wxShopsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('aa338e9b.91e257')
          })
        })
    },
    getResourceList(filter) {
      getResourceList(filter).then((response) => {
        this.resourceList = response.data.list
        this.resourceCount = response.data.total_count
      })
    },
    setDefault(row) {
      let params = { distributor_id: row.distributor_id }
      setDefaultDistributorShop(params)
        .then((response) => {
          for (var i = this.wxShopsList.length - 1; i >= 0; i--) {
            if (this.wxShopsList[i].distributor_id != row.distributor_id) {
              this.wxShopsList[i].is_default = false
            }
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('aa338e9b.07c5cc')
          })
        })
    },
    getRes(row) {
      this.bindShopId = row.distributor_id
      this.dialogTableVisible = true
      this.currentRow = null
    },
    resCurrentChange(val) {
      this.currentRow = val
    },
    deleteDistributorShopAction(index, row) {
      this.$confirm(this.$t('aa338e9b.a7a939'), this.$t('aa338e9b.02d981'), {
        confirmButtonText: this.$t('aa338e9b.38cf16'),
        cancelButtonText: this.$t('aa338e9b.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteDistributorShop(row.distributor_id)
            .then((response) => {
              this.wxShopsList.splice(index, 1)
              this.$message({
                message: this.$t('aa338e9b.765351'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('aa338e9b.1b9d4c')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('aa338e9b.2111cc')
          })
        })
    },
    syncWxShops() {
      this.$confirm(this.$t('aa338e9b.275b0e'), this.$t('aa338e9b.02d981'), {
        confirmButtonText: this.$t('aa338e9b.38cf16'),
        cancelButtonText: this.$t('aa338e9b.625fb2'),
        type: 'warning'
      })
        .then(() => {
          syncWxShops().then((response) => {
            this.$message({
              message: this.$t('aa338e9b.52b85c'),
              type: 'success',
              duration: 5 * 1000
            })
            this.getShopsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('aa338e9b.2111cc')
          })
        })
    },
    storeChange(val) {
      this.params.is_direct_store = val
      this.getShopsList()
    },
    setStatus(row) {
      let params = { distributor_id: row.distributor_id, status: row.is_valid }
      setDistributorShopStatus(params)
        .then((res) => {})
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('aa338e9b.8a004c')
          })
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
