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
  <SpPage>
    <SpRouterView>
      <div>
        <el-row :gutter="20">
          <el-col>
            <shop-select distributors @update="storeChange" @init="initChange" />
            <el-input v-model="params.mobile" placeholder="手机号" class="input-m" clearable>
              <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
            </el-input>
            <el-button type="primary" icon="plus" @click="handleAddSalesmanAction">
              添加
            </el-button>
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="列表" name="admin" />
          <!-- <el-tab-pane
        label="禁用"
        name="invalid"
      /> -->
          <el-table v-loading="loading" :data="list">
            <el-table-column prop="salesman_name" label="姓名" />
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="storeInfo.name" label="店铺" />

            <!-- <el-table-column prop="children_count" width="100" label="会员数量">
            <template slot-scope="scope">
              <el-button
                size="mini"
                icon="edit"
                type="text"
                @click="count(scope.$index, scope.row)"
              >
                {{ scope.row.children_count }}
              </el-button>
            </template>
          </el-table-column> -->

            <!-- <el-table-column prop="child_count" label="会员数量">
            <template slot-scope="scope">
              <span v-if="scope.row.child_count > 0">{{ scope.row.child_count }}</span>
              <span v-else>0</span>
            </template>
          </el-table-column> -->
            <!-- <el-table-column label="是否启用">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_valid"
                active-value="true"
                inactive-value="false"
                active-color="#13ce66"
                inactive-color="#ccc"
                @change="defaultSwitchChange(scope.row)"
              />
            </template>
          </el-table-column> -->

            <el-table-column prop="children_count" width="130" label="累计会员数量">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="edit"
                  type="text"
                  @click="count(scope.$index, scope.row)"
                >
                  {{ scope.row.children_count }}
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="是否启用">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.is_valid"
                  active-value="true"
                  inactive-value="false"
                  active-color="#13ce66"
                  inactive-color="#ccc"
                  @change="defaultSwitchChange(scope.row)"
                />
              </template>
            </el-table-column>

            <!--

        <el-table-column label="导购角色">
          <template slot-scope="scope">
            {{ scope.row.role_name }}
            <i
              class="iconfont icon-edit1"
              @click="handleUpdateSalesmanRole(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="绑定关系">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click.stop="handleShowSideBar(scope.row.salespersonId)"
            >
              绑定关系
            </el-button>
          </template>
        </el-table-column>
      -->
            <!-- <router-link :to="{ path: '/store/storemanager/salesmanRelationship', query: {salesperson_id: scope.row.salespersonId, is_bind: 1}}">绑定关系</router-link> -->

            <el-table-column label="操作" width="160px">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <i class="iconfont icon-edit1" @click="handleUpdateSalesman(scope.row)" />
                  <!-- <i
                v-if="activeName == 'admin'"
                class="mark iconfont icon-trash-alt1"
                @click="handleDeleteSalesman(scope.$index, scope.row)"
              /> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-4 text-right">
            <el-pagination
              background
              :current-page="params.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="params.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total_count"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tabs>

        <el-dialog
          v-show="false"
          title="编辑导购员角色"
          :visible.sync="dialog_role"
          :close-on-click-modal="false"
        >
          <el-form v-model="form" label-width="160px">
            <el-form-item label="角色">
              <el-radio-group v-model="roleForm.role">
                <el-radio
                  v-for="(item, index) in roleList"
                  :key="index"
                  :label="item.salesman_role_id"
                >
                  {{ item.role_name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer content-center">
            <el-button type="primary" @click="handleAddSalesmanRole"> 确定 </el-button>
          </div>
        </el-dialog>
        <el-dialog title="添加/编辑" :visible.sync="dialog" :close-on-click-modal="false">
          <el-form v-model="form" label-width="160px">
            <el-form-item label="管理店铺">
              <shop-select
                distributors
                :shop-id-default="form.distributor_id"
                @update="addSelectStoreChange"
                @init="initChange"
              />
              <!--distributors wxshops 需要哪个api传哪个-->
              <!-- <div style="margin-left: 1.5%;">
            <template v-if="rel_distributor_ids">
              <el-tag v-for="(item, index) in rel_distributor_ids" :disable-transitions="false" :key="item.name" closable @close="storeClose(rel_distributor_ids, index)"> {{item.name}} </el-tag>
            </template>
            <el-button type="text" @click="addStoreAction">添加适用店铺</el-button>
          </div> -->
            </el-form-item>
            <el-form-item label="手机号">
              <el-input
                v-model="form.mobile"
                placeholder="请输入手机号"
                style="width: 193px"
                :readonly="salesman_id > 0"
              />
              <div v-if="salesman_id">* 手机号不可修改</div>
            </el-form-item>
            <el-form-item v-show="false" label="角色">
              <el-radio-group v-model="form.role">
                <el-radio
                  v-for="(item, index) in roleList"
                  :key="index"
                  :label="item.salesman_role_id"
                >
                  {{ item.role_name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                v-model="form.salesman_name"
                placeholder="请输入姓名"
                style="width: 193px"
              />
            </el-form-item>
            <el-form-item v-if="activeName == 'invalid'" label="是否启用">
              <el-radio v-model="form.is_valid" label="true"> 启用 </el-radio>
              <el-radio v-model="form.is_valid" label="delete"> 禁用 </el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer content-center">
            <el-button type="primary" @click="handleAddSalesman"> 确定 </el-button>
          </div>
        </el-dialog>
        <el-dialog
          title="店铺列表"
          :visible.sync="relShop.relShopVisible"
          :before-close="handleCancel"
          width="70%"
        >
          <template>
            <el-table v-loading="loading" :data="relShop.list">
              <el-table-column prop="shop_id" label="id" width="60" />
              <el-table-column prop="store_name" label="店铺名称" width="300" />
              <el-table-column prop="address" label="店铺地址" />
            </el-table>
            <div
              v-if="relShop.total_count > relShop.params.pageSize"
              class="content-center content-top-padded"
            >
              <el-pagination
                layout="prev, pager, next"
                :current-page.sync="relShop.params.page"
                :total="relShop.total_count"
                :page-size="relShop.params.pageSize"
                @current-change="handleRelShopCurrentChange"
              />
            </div>
          </template>
        </el-dialog>
        <StoreSelect
          :store-visible="storeVisible"
          :is-valid="true"
          :rel-data-ids="relStores"
          :get-status="setStoreStatus"
          @chooseStore="chooseStoreAction"
          @closeStoreDialog="closeStoreDialogAction"
        />

        <!-- 绑定关系 -->
        <SideBar :visible.sync="showSideBar" title="绑定关系" width="50">
          <div class="relationship">
            <el-card v-loading="relationship.loading">
              <el-table :data="relationship.list">
                <el-table-column label="导购员">
                  <template slot-scope="scope">
                    {{ scope.row.salesperson_info.salesman_name }}
                  </template>
                </el-table-column>
                <el-table-column prop="work_userid" label="导购员企业微信userid" />
                <el-table-column label="手机号">
                  <template slot-scope="scope">
                    {{ scope.row.user_info.mobile }}
                  </template>
                </el-table-column>
                <el-table-column label="会员">
                  <template slot-scope="scope">
                    <router-link
                      :to="{
                        path: '/member/member/memberlist/detail',
                        query: { user_id: scope.row.user_id }
                      }"
                    >
                      {{ scope.row.user_info.username }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column label="是否是朋友">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_friend == 0">否</span>
                    <span v-else>是</span>
                  </template>
                </el-table-column>
                <el-table-column label="是否绑定">
                  <template slot-scope="scope">
                    <span v-if="scope.row.is_bind == 0">否</span>
                    <span v-else>是</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="mt-4 text-right">
                <el-pagination
                  background
                  :current-page="relationship.params.page"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="relationship.params.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="relationship.total_count"
                  @size-change="handleRelaSizeChange"
                  @current-change="handleRelaCurrentChange"
                />
              </div>
            </el-card>
          </div>
        </SideBar>
      </div>
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getSalesmanList,
  updateSalesman,
  addSalesman,
  getRoleList,
  updateSalesmanRole
} from '@/api/marketing'
import { getRelShopList, getSalespersonInfo } from '@/api/shop'
import { getWorkWechatRelList } from '@/api/wechat'
import StoreSelect from '@/components/storeListSelect/newindex'
import shopSelect from '@/components/shopSelect'
import SideBar from '@/components/element/sideBar'

export default {
  components: {
    StoreSelect,
    shopSelect,
    SideBar
  },
  data() {
    return {
      dialog: false,
      dialog_role: false,
      roleList: {},
      roleForm: {
        role: ''
      },
      activeName: 'admin',
      list: [],
      total_count: 0,
      loading: false,
      salesman_id: '',
      params: {
        page: 1,
        pageSize: 20
      },
      form: {
        distributor_id: [],
        mobile: '',
        role: '',
        salesman_name: '',
        is_valid: 'true'
      },
      relShop: {
        list: [],
        total_count: 0,
        params: {
          page: 1,
          pageSize: 20
        },
        relShopVisible: false
      },
      setStoreStatus: false,
      storeVisible: false,
      relStores: [],
      rel_distributor_ids: [],
      showSideBar: false,
      // 绑定关系列表
      relationship: {
        saleId: '',
        total_count: 0,
        loading: false,
        list: [],
        params: {
          page: 1,
          pageSize: 20,
          is_friend: 1,
          is_bind: 0
        }
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    searchMembers(row) {
      let routeData = this.$router.resolve({
        path: '/member/member',
        query: { salesman_mobile: row.mobile }
      })
      window.open(routeData.href, '_blank')
    },
    handleAddSalesmanAction() {
      this.dialog = true
      this.salesman_id = false
      this.form.distributor_id = ''
      this.form.mobile = ''
      this.form.is_valid = 'true'
      this.form.salesman_name = ''
      this.rel_distributor_ids = ''
    },
    addSelectStoreChange(data) {
      this.form.distributor_id = data.shop_id
    },
    count(index, row) {
      if (row.children_count > 0) {
        console.log(this.matchRoutePath('child'))
        console.log(row.promoter_id)
        console.log(row.promoter_id)
        console.log(row.promoter_id)
        let routeData = this.$router.resolve({
          // path: "/sellers/marketingsalesman/children",
          // pathxxx: "/sellers/marketingsalesman/popularizelist/child",
          // path: "/marketing/popularize/popularizelist/child",
          path: this.matchRoutePath('children'),
          query: { promoter_id: row.promoter_id }
        })
        console.log(routeData.href)
        console.log(routeData.href)

        window.open(routeData.href, '_blank')
      }
    },
    storeChange(params) {
      params && params.shop_id
      this.params.distributor_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange() {
      this.shopId = ''
    },
    numberSearch() {
      this.params.page = 1
      this.getList()
    },
    handleUpdateSalesmanRole(row) {
      this.dialog_role = true
      this.salesman_id = row.salespersonId
      this.roleForm.role = row.role
    },
    handleUpdateSalesman(row) {
      this.dialog = true
      this.salesman_id = row.salespersonId
      var params = { salesperson_id: row.salespersonId }
      getSalespersonInfo(params).then(res => {
        this.form = {
          salesman_name: res.data.data.name,
          mobile: res.data.data.mobile,
          salesperson_type: res.data.data.salesperson_type,
          shop_id: res.data.data.shop_ids,
          role: res.data.data.role,
          distributor_id: res.data.data.distributor_id
            ? res.data.data.distributor_id
            : res.data.data.distributor_ids,
          is_valid: res.data.data.is_valid
        }
        this.rel_distributor_ids = res.data.data.distributorList
      })
    },
    handleDeleteSalesman(index, row) {
      this.$confirm('此操作将禁用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateSalesman(row.salespersonId, { is_valid: 'delete' }).then(response => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '操作成功'
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
    defaultSwitchChange(row) {
      updateSalesman(row.salesperson_id, { is_valid: row.is_valid }).then(response => {
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    handleAddSalesman() {
      if (this.salesman_id) {
        this.updateSalesmanAction()
      } else {
        this.addSalesmanAction()
      }
    },
    updateSalesmanAction() {
      updateSalesman(this.salesman_id, this.form).then(res => {
        this.form = {
          distributor_id: '',
          mobile: '',
          role: '',
          salesman_name: ''
        }
        this.dialog = false
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    handleAddSalesmanRole() {
      updateSalesmanRole(this.salesman_id, this.roleForm).then(res => {
        this.dialog_role = false
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    addSalesmanAction() {
      addSalesman(this.form).then(res => {
        this.form = {
          distributor_id: '',
          mobile: '',
          role: '',
          salesman_name: ''
        }
        this.dialog = false
        this.getList()
        this.$message({ type: 'success', message: '操作成功' })
      })
    },
    getList() {
      this.loading = true
      getSalesmanList(this.params).then(response => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total_count = Number(response.data.data.total_count)
        }
        this.loading = false
      })
    },
    getRoleList() {
      getRoleList().then(response => {
        if (response.data.data.list) {
          this.roleList = response.data.data.list
        }
      })
    },
    getSalepersonShopList(salespersonId, storetype) {
      this.relShop.relShopVisible = true
      this.relShop.params.salesperson_id = salespersonId
      if (storetype) {
        this.relShop.params.store_type = storetype
      }
      getRelShopList(this.relShop.params).then(res => {
        this.relShop.list = res.data.data.list
        this.relShop.total_count = res.data.data.total_count
      })
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    handleRelShopCurrentChange(page_num) {
      this.relShop.params.page = page_num
      this.getSalepersonShopList(this.relShop.params.salesperson_id)
    },
    storeClose(list, index) {
      this.setStoreStatus = false
      this.rel_distributor_ids.splice(index, 1)
      this.form.distributor_id = []
      for (var i = 0; i < list.length; i++) {
        if (this.form.distributor_id.indexOf(list[i].distributor_id) < 0) {
          this.form.distributor_id.push(Number(list[i].distributor_id))
        }
      }
      //this.rel_distributor_ids = list
    },
    addStoreAction() {
      this.storeVisible = true
      this.setStoreStatus = true
      this.relStores = JSON.parse(JSON.stringify(this.rel_distributor_ids))
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      this.form.distributor_id = []
      if (data === null || data.length <= 0) return
      this.rel_distributor_ids = data
      for (var i = 0; i < data.length; i++) {
        if (this.form.distributor_id.indexOf(data[i].distributor_id) < 0) {
          this.form.distributor_id.push(Number(data[i].distributor_id))
        }
      }
    },
    handleClick() {
      if (this.activeName == 'invalid') {
        this.params.is_valid = 'delete'
        this.getList()
      } else {
        this.params.is_valid = ''
        this.getList()
      }
    },
    handleSizeChange(val) {
      this.params.page = 1
      this.params.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.getList()
    },
    // 显示sideBar
    handleShowSideBar(saleId) {
      this.showSideBar = true
      this.relationship.saleId = saleId
      this.getWorkWechatRelList()
    },
    // 页面数据条数切换
    handleRelaSizeChange(val) {
      this.relationship.params.page = 1
      this.relationship.params.pageSize = val
      this.getWorkWechatRelList()
    },
    // 分页切换
    handleRelaCurrentChange(val) {
      this.relationship.params.page = val
      this.getWorkWechatRelList()
    },
    // 获取列表
    getWorkWechatRelList() {
      if (!this.relationship.saleId) return
      this.relationship.loading = true
      getWorkWechatRelList(this.relationship.saleId, this.relationship.params).then(res => {
        this.relationship.list = res.data.data.list
        this.relationship.total_count = res.data.data.total_count
        this.relationship.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-preview {
  text-align: center;
  max-width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  img {
    max-width: 200px;
    margin: 0 auto;
  }
}
.text-ellipsis {
  display: inline-block;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
//  绑定关系
.relationship {
  width: 100%;
  height: 100%;
}
</style>
