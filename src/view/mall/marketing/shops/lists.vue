<template>
  <div>
    <el-tabs
      v-if="$route.path.indexOf('editor') === -1"
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        label="门店管理"
        name="first"
      >
        <el-row>
          <el-col :span="12">
            店铺类型：
            <el-select
              v-model="store_type"
              @change="storeChange"
            >
              <el-option
                label="直营店"
                :value="1"
              >
                直营店
              </el-option>
              <el-option
                label="非直营店"
                :value="2"
              >
                非直营店
              </el-option>
            </el-select>
          </el-col>
          <el-col
            :span="12"
            class="content-right"
          >
            <router-link :to="matchHidePage('editor')">
              <el-button
                type="primary"
                icon="el-icon-plus"
              >
                添加门店
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
          <el-table-column
            prop="storeName"
            label="门店名称"
            width="240"
          />
          <el-table-column
            prop="isDirectStore"
            label="直营店"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isDirectStore === 1">
                <el-tag
                  type="success"
                  size="mini"
                >
                  直营
                </el-tag>
              </div>
              <div v-if="scope.row.isDirectStore === 2">
                <el-tag
                  type="gray"
                  size="mini"
                >
                  非直营
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="240"
            label="地理位置"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isDomestic == 2">
                {{ scope.row.country }} {{ scope.row.city }} {{ scope.row.address }}
              </div>
              <div v-else>
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            width="80"
          >
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
          <el-table-column
            label="设为默认"
            width="80"
          >
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
          <el-table-column
            label="操作"
            width="170"
          >
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" v-if="!scope.row.is_valid" @click="getRes(scope.row)">激活</el-button> -->
              <el-button
                size="mini"
                type="text"
                @click="shopsEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="distributorShopsDetail(scope.$index, scope.row)"
              >
                详情
              </el-button>
              <!-- <el-button size="mini" type="text" @click="deleteDistributorShopAction(scope.$index, scope.row)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="total_count > pageLimit"
          class="content-padded content-center"
        >
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
  provide () {
    return {
      refresh: this.getShopsList
    }
  },
  data () {
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
  mounted () {
    this.params = { page: 1, pageSize: this.pageLimit }
    let resparams = { page_no: 1, page_size: this.pageLimit, is_valid: true }
    this.getShopsList()
    this.getResourceList(resparams)
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params = { page: page_num, pageSize: this.pageLimit }
      this.getShopsList()
    },
    reshandleCurrentChange (page_num) {
      let resparams = { page_no: page_num, page_size: this.pageLimit, is_valid: true }
      this.getResourceList(resparams)
    },
    shopsEdit (index, row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.distributor_id })
    },
    distributorShopsDetail (index, row) {
      this.distributorShopsDetailVisible = true
      getDistributorShopDetail(row.distributor_id)
        .then((response) => {
          this.detailData = response.data.data
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取门店详情出错'
          })
        })
    },
    getShopsList () {
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
            message: '获取门店信息出错'
          })
        })
    },
    getResourceList (filter) {
      getResourceList(filter).then((response) => {
        this.resourceList = response.data.list
        this.resourceCount = response.data.total_count
      })
    },
    setDefault (row) {
      let params = { 'distributor_id': row.distributor_id }
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
            message: '默认门店设置失败'
          })
        })
    },
    getRes (row) {
      this.bindShopId = row.distributor_id
      this.dialogTableVisible = true
      this.currentRow = null
    },
    resCurrentChange (val) {
      this.currentRow = val
    },
    deleteDistributorShopAction (index, row) {
      this.$confirm('此操作将删除该门店, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDistributorShop(row.distributor_id)
            .then((response) => {
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
    syncWxShops () {
      this.$confirm('确定同步微信门店到本系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          syncWxShops().then((response) => {
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
    storeChange (val) {
      this.params.is_direct_store = val
      this.getShopsList()
    },
    setStatus (row) {
      let params = { 'distributor_id': row.distributor_id, 'status': row.is_valid }
      setDistributorShopStatus(params)
        .then((res) => {})
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '门店状态修改失败'
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
