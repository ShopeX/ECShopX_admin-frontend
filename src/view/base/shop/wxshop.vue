<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-if="$route.path.indexOf('editor') === -1" v-model="activeName" type="border-card">
      <el-tab-pane :label="$t('c27e774b.793200')" name="first">
        <div class="content-bottom-padded">
          <el-alert type="info" :title="$t('c27e774b.8666d6')" show-icon>
            <div>
              {{ $t('c27e774b.ede760') }}
              <a href="https://mp.weixin.qq.com">{{ $t('c27e774b.ddfd20') }}</a
              >{{ $t('c27e774b.54ea86') }}
            </div>
          </el-alert>
        </div>
        <!-- <div class="content-bottom-padded">
          <el-tooltip class="item" effect="light" content="最多添加100个门店" placement="right-start">
            <router-link to="/base/shop/editshop">
              <el-button type="primary" icon="el-icon-plus">添加门店</el-button>
            </router-link>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="同步微信门店到本地" placement="right-start">
            <el-button type="primary" icon="el-icon-refresh" @click="syncWxShops()"> 同步门店</el-button>
          </el-tooltip>
        </div> -->

        <el-row>
          <el-col :span="12">
            {{ $t('c27e774b.e3d663') }}
            <el-select v-model="store_type" @change="storeChange">
              <el-option :label="$t('c27e774b.4b940c')" :value="1">
{{
                $t('c27e774b.4b940c')
              }}
</el-option>
              <el-option :label="$t('c27e774b.c26325')" :value="2">
{{
                $t('c27e774b.c26325')
              }}
</el-option>
            </el-select>
          </el-col>
          <el-col :span="12" class="content-right">
            <router-link :to="matchRoutePath('editor')">
              <el-button type="primary" icon="el-icon-plus">{{ $t('c27e774b.894d98') }}</el-button>
            </router-link>
            <el-tooltip effect="light" :content="$t('c27e774b.630291')" placement="right-start">
              <el-button type="primary" icon="el-icon-refresh" @click="syncWxShops()">
                {{ $t('c27e774b.3dc167') }}
              </el-button>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-table
          v-loading="loading"
          :data="wxShopsList"
          style="width: 100%"
          :height="wheight - 305"
        >
          <el-table-column prop="storeName" :label="$t('c27e774b.740032')" width="240" />
          <el-table-column prop="isDirectStore" :label="$t('c27e774b.4b940c')">
            <template slot-scope="scope">
              <div v-if="scope.row.isDirectStore === 1">
                <el-tag type="success" size="mini">{{ $t('c27e774b.0f2d3f') }}</el-tag>
              </div>
              <div v-if="scope.row.isDirectStore === 2">
                <el-tag type="gray" size="mini">{{ $t('c27e774b.7439a8') }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="240" :label="$t('c27e774b.fc82aa')">
            <template slot-scope="scope">
              <div v-if="scope.row.isDomestic == 2">
                {{ scope.row.country }} {{ scope.row.city }} {{ scope.row.address }}
              </div>
              <div v-else>
                {{ scope.row.address }}
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('c27e774b.3fea7c')" width="80">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.isOpen"
                active-color="#13ce66"
                inactive-color="#efefef"
                @change="setStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="expiredAt" :label="$t('c27e774b.22e888')" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.expiredAt && scope.row.is_valid">{{
                scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss')
              }}</span>
              <span v-else-if="scope.row.expiredAt && !scope.row.is_valid">
                <el-tag type="danger">{{ $t('c27e774b.4d5ccd') }}</el-tag>
              </span>
              <span v-else> -- </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('c27e774b.1af3ec')" width="80">
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
          <el-table-column :label="$t('c27e774b.2b6bc0')" width="170">
            <template slot-scope="scope">
              <el-button
                v-if="!scope.row.is_valid"
                size="mini"
                type="text"
                @click="getRes(scope.row)"
              >
                {{ $t('c27e774b.83a991') }}
              </el-button>
              <el-button
                v-if="1"
                size="mini"
                type="text"
                @click="wxShopsEdit(scope.$index, scope.row)"
              >
                {{ $t('c27e774b.95b351') }}
              </el-button>
              <el-button v-else size="mini" type="text" :disabled="true">
{{
                $t('c27e774b.95b351')
              }}
</el-button>
              <el-button size="mini" type="text" @click="wxShopsDetail(scope.$index, scope.row)">
                {{ $t('c27e774b.f26225') }}
              </el-button>
              <!-- <el-button size="mini" type="text" @click="deleteWxShopsAction(scope.$index, scope.row)">删除</el-button> -->
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
        <el-dialog
          :title="$t('c27e774b.6a50dc')"
          :close-on-click-modal="false"
          :visible.sync="dialogTableVisible"
          class="resource-dialog"
        >
          <el-table
            ref="resource_list"
            :data="resourceList"
            max-height="420"
            border
            highlight-current-row
            @current-change="resCurrentChange"
            @row-click="getResId"
          >
            <el-table-column :label="$t('c27e774b.94d02e')">
              <template slot-scope="scope">
                <span>{{ scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="resourceName" :label="$t('c27e774b.45d6ec')" />
            <el-table-column prop="leftShopNum" :label="$t('c27e774b.f35334')" />
            <el-table-column :label="$t('c27e774b.2be4ff')">
              <template slot-scope="scope">
                <span>{{ scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="resourceCount > pageLimit" class="content-center">
            <el-pagination
              layout="prev, pager, next"
              :total="resourceCount"
              :page-size="pageLimit"
              @current-change="reshandleCurrentChange"
            />
          </div>
          <div slot="footer" class="dialog-footer content-center">
            <el-button @click="cancelRes()">{{ $t('c27e774b.c08ab9') }}</el-button>
            <el-button type="primary" @click="setResource">{{ $t('c27e774b.aa7527') }}</el-button>
          </div>
        </el-dialog>
        <!-- 微信门店详情-开始 -->
        <el-dialog :title="$t('c27e774b.862c34')" :visible.sync="wxShopsDetailVisible">
          <template>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.6bf1f3') }}</div>
              </el-col>
              <el-col :span="12">
                <div v-if="wxShopsDetailData.status === 1">{{ $t('c27e774b.ecfa64') }}</div>
                <div v-if="wxShopsDetailData.status === 2">{{ $t('c27e774b.b720a6') }}</div>
                <div v-if="wxShopsDetailData.status === 3">{{ $t('c27e774b.fe3661') }}</div>
                <div v-if="wxShopsDetailData.status === 4">{{ $t('c27e774b.a77aa8') }}</div>
              </el-col>
            </el-row>
            <el-row v-if="wxShopsDetailData.status == '3'">
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.df22a4') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.errmsg }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.740032') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.company_name }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.fc82aa') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.address }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.fc82aa') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <img :src="wxShopsDetailData.qqmapimg">
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.09a1f6') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.contract_phone }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.8e8efa') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.credential }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.cc3307') }}</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.hour }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">{{ $t('c27e774b.d63742') }}</div>
              </el-col>
              <el-col
                v-for="(pic, index) in wxShopsDetailData.pic_list"
                :key="pic"
                :span="1"
                :offset="index > 0 ? 1 : 0"
              >
                <img :src="wximageurl + pic" width="40" height="40">
              </el-col>
            </el-row>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="wxShopsDetailVisible = false">
{{
              $t('c27e774b.625fb2')
            }}
</el-button>
          </div>
        </el-dialog>
        <!-- 微信门店详情-结束 -->
      </el-tab-pane>
      <el-tab-pane v-loading="loading" :label="$t('c27e774b.1edb97')" name="resourceList">
        <el-table :data="resourceList" :height="wheight - 110" style="width: 100%">
          <el-table-column prop="resourceName" :label="$t('c27e774b.45d6ec')" />
          <el-table-column prop="shopNum" :label="$t('c27e774b.d09ed0')" />
          <el-table-column prop="leftShopNum" :label="$t('c27e774b.f35334')" />
          <el-table-column :label="$t('c27e774b.94d02e')">
            <template slot-scope="scope">
              <span>{{ scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('c27e774b.2be4ff')">
            <template slot-scope="scope">
              <span>{{ scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="resourceCount > pageLimit" class="content-center content-padded">
          <el-pagination
            layout="prev, pager, next"
            :total="resourceCount"
            :page-size="pageLimit"
            @current-change="reshandleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
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
} from '../../../api/shop'
import { getResourceList } from '../../../api/company'
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
    wxShopsEdit(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.wxShopId })
    },
    wxShopsDetail(index, row) {
      this.wxShopsDetailVisible = true
      getWxShopsDetail(row.wxShopId)
        .then((response) => {
          this.wxShopsDetailData = response.data.data
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('c27e774b.816eba')
          })
        })
    },
    getShopsList() {
      this.loading = true
      getWxShopsList(this.params)
        .then((response) => {
          this.wxShopsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('c27e774b.91e257')
          })
        })
    },
    getResourceList(filter) {
      getResourceList(filter).then((response) => {
        this.resourceList = response.data.data.list
        this.resourceCount = response.data.data.total_count
      })
    },
    setDefault(row) {
      let params = { wx_shop_id: row.wxShopId }
      setDefaultShop(params)
        .then((response) => {
          for (var i = this.wxShopsList.length - 1; i >= 0; i--) {
            if (this.wxShopsList[i].wxShopId != row.wxShopId) {
              this.wxShopsList[i].isDefault = false
            }
          }
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('c27e774b.07c5cc')
          })
        })
    },
    getRes(row) {
      this.bindShopId = row.wxShopId
      this.dialogTableVisible = true
      this.currentRow = null
    },
    resCurrentChange(val) {
      this.currentRow = val
    },
    getResId(row, event, column) {
      if (row.leftShopNum == 0) {
        this.$message({
          type: 'error',
          message: this.$t('c27e774b.0e9de5')
        })
        return
      } else {
        this.bindResId = row.resourceId
      }
    },
    setResource() {
      if (!this.bindResId) {
        this.$message({
          type: 'error',
          message: this.$t('c27e774b.5207e0')
        })
        return
      }
      let params = { wx_shop_id: this.bindShopId, resource_id: this.bindResId }
      setResource(params).then((response) => {
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
      this.$confirm(this.$t('c27e774b.a7a939'), this.$t('c27e774b.02d981'), {
        confirmButtonText: this.$t('c27e774b.38cf16'),
        cancelButtonText: this.$t('c27e774b.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteWxShops(row.wxShopId)
            .then((response) => {
              this.wxShopsList.splice(index, 1)
              this.$message({
                message: this.$t('c27e774b.765351'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('c27e774b.1b9d4c')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('c27e774b.2111cc')
          })
        })
    },
    syncWxShops() {
      this.$confirm(this.$t('c27e774b.275b0e'), this.$t('c27e774b.02d981'), {
        confirmButtonText: this.$t('c27e774b.38cf16'),
        cancelButtonText: this.$t('c27e774b.625fb2'),
        type: 'warning'
      })
        .then(() => {
          syncWxShops().then((response) => {
            this.$message({
              message: this.$t('c27e774b.52b85c'),
              type: 'success',
              duration: 5 * 1000
            })
            this.getShopsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('c27e774b.2111cc')
          })
        })
    },
    storeChange(val) {
      this.params.is_direct_store = val
      this.getShopsList()
    },
    setStatus(row) {
      let params = { wx_shop_id: row.wxShopId, status: row.isOpen }
      setShopStatus(params)
        .then((res) => {})
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('c27e774b.8a004c')
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
