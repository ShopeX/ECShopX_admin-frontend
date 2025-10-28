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
    <el-tabs v-if="$route.path.indexOf('editor') === -1" v-model="activeName" type="border-card">
      <el-tab-pane label="微信门店管理" name="first">
        <div class="content-bottom-padded">
          <el-alert type="info" title="请先确认您是否已经开通门店小程序！" show-icon>
            <div>
              如果没有请点击
              <a href="https://mp.weixin.qq.com">开通门店小程序</a
              >，去微信后台添加或者升级门店小程序
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
            店铺类型：
            <el-select v-model="store_type" @change="storeChange">
              <el-option label="直营店" :value="1"> 直营店 </el-option>
              <el-option label="非直营店" :value="2"> 非直营店 </el-option>
            </el-select>
          </el-col>
          <el-col :span="12" class="content-right">
            <router-link :to="matchRoutePath('editor')">
              <el-button type="primary" icon="el-icon-plus"> 添加门店 </el-button>
            </router-link>
            <el-tooltip effect="light" content="同步微信门店到本地" placement="right-start">
              <el-button type="primary" icon="el-icon-refresh" @click="syncWxShops()">
                同步门店
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
          <el-table-column prop="storeName" label="门店名称" width="240" />
          <el-table-column prop="isDirectStore" label="直营店">
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
          <el-table-column prop="expiredAt" label="到期时间" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.expiredAt && scope.row.is_valid">{{
                scope.row.expiredAt | datetime('YYYY-MM-DD HH:mm:ss')
              }}</span>
              <span v-else-if="scope.row.expiredAt && !scope.row.is_valid">
                <el-tag type="danger">已过期</el-tag>
              </span>
              <span v-else> -- </span>
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
                v-if="!scope.row.is_valid"
                size="mini"
                type="text"
                @click="getRes(scope.row)"
              >
                激活
              </el-button>
              <el-button
                v-if="1"
                size="mini"
                type="text"
                @click="wxShopsEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
              <el-button v-else size="mini" type="text" :disabled="true"> 编辑 </el-button>
              <el-button size="mini" type="text" @click="wxShopsDetail(scope.$index, scope.row)">
                详情
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
          title="资源列表"
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
            <el-table-column label="激活时间">
              <template slot-scope="scope">
                <span>{{ scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="resourceName" label="资源名称" />
            <el-table-column prop="leftShopNum" label="剩余门店数" />
            <el-table-column label="到期期时间">
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
            <el-button @click="cancelRes()"> 取 消 </el-button>
            <el-button type="primary" @click="setResource"> 确 定 </el-button>
          </div>
        </el-dialog>
        <!-- 微信门店详情-开始 -->
        <el-dialog title="门店详情" :visible.sync="wxShopsDetailVisible">
          <template>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">当前状态</div>
              </el-col>
              <el-col :span="12">
                <div v-if="wxShopsDetailData.status === 1">已通过</div>
                <div v-if="wxShopsDetailData.status === 2">审核中</div>
                <div v-if="wxShopsDetailData.status === 3">审核失败</div>
                <div v-if="wxShopsDetailData.status === 4">审核驳回</div>
              </el-col>
            </el-row>
            <el-row v-if="wxShopsDetailData.status == '3'">
              <el-col :span="6">
                <div class="grid-content">未通过原因</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.errmsg }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">门店名称</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.company_name }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">地理位置</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.address }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">地理位置</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <img :src="wxShopsDetailData.qqmapimg">
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">联系电话</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.contract_phone }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">经营资质证件号</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.credential }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">营业时间</div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  {{ wxShopsDetailData.hour }}
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <div class="grid-content">门店图片</div>
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
            <el-button @click.native="wxShopsDetailVisible = false"> 取消 </el-button>
          </div>
        </el-dialog>
        <!-- 微信门店详情-结束 -->
      </el-tab-pane>
      <el-tab-pane v-loading="loading" label="可用资源包列表" name="resourceList">
        <el-table :data="resourceList" :height="wheight - 110" style="width: 100%">
          <el-table-column prop="resourceName" label="资源名称" />
          <el-table-column prop="shopNum" label="包含门店数" />
          <el-table-column prop="leftShopNum" label="剩余门店数" />
          <el-table-column label="激活时间">
            <template slot-scope="scope">
              <span>{{ scope.row.activeAt | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="到期期时间">
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
        .then(response => {
          this.wxShopsDetailData = response.data.data
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取门店详情出错'
          })
        })
    },
    getShopsList() {
      this.loading = true
      getWxShopsList(this.params)
        .then(response => {
          this.wxShopsList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取门店信息出错'
          })
        })
    },
    getResourceList(filter) {
      getResourceList(filter).then(response => {
        this.resourceList = response.data.data.list
        this.resourceCount = response.data.data.total_count
      })
    },
    setDefault(row) {
      let params = { wx_shop_id: row.wxShopId }
      setDefaultShop(params)
        .then(response => {
          for (var i = this.wxShopsList.length - 1; i >= 0; i--) {
            if (this.wxShopsList[i].wxShopId != row.wxShopId) {
              this.wxShopsList[i].isDefault = false
            }
          }
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '默认门店设置失败'
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
          message: '该资源包门店数已达上限，不能选中'
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
          message: '没有可用的资源包激活门店'
        })
        return
      }
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
      setShopStatus(params)
        .then(res => {})
        .catch(error => {
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
