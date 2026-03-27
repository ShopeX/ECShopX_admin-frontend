<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <shop-select wxshops @update="storeChange" @init="initChange" />
        <!--distributors wxshops 需要哪个api传哪个-->
      </el-col>
      <el-col :md="8" :lg="5">
        <el-input v-model="mobile" :placeholder="$t('5d24fd22.8098e2')" clearable size="mini">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
      </el-col>
      <el-col :span="3" class="content-right">
        <el-button size="mini" type="primary" icon="plus" @click="addSalesperson">
          {{ $t('5d24fd22.19070d') }}
        </el-button>
      </el-col>
    </el-row>
    <el-row />
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('5d24fd22.b1dae9')" name="admin" />
      <el-tab-pane :label="$t('5d24fd22.ec69fc')" name="verification_clerk" />
      <el-table v-loading="loading" :data="salespersonList" :height="wheight - 160">
        <el-table-column prop="name" :label="$t('5d24fd22.60d045')" />
        <el-table-column prop="mobile" :label="$t('5d24fd22.8098e2')" />
        <el-table-column :label="$t('5d24fd22.a6cf26')">
          <template slot-scope="scope">
            <el-button type="text" @click="getSalepersonShopList(scope.row.salespersonId, 'shop')">
              {{ $t('5d24fd22.726b20') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5d24fd22.baad7e')">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getSalepersonShopList(scope.row.salespersonId, 'distributor')"
            >
              {{ $t('5d24fd22.7e651b') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5d24fd22.2b6bc0')">
          <template slot-scope="scope">
            <div class="operating-icons">
              <i class="el-icon-edit-outline" @click="updateSalesperson(scope.row)" />
              <i
                class="mark el-icon-delete-solid"
                @click="deleteSalesperson(scope.$index, scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total_count > params.pageSize" class="mt-4 text-right">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>

    <el-dialog :title="DialogTitle" :visible.sync="detailDialog" :close-on-click-modal="false">
      <el-form v-model="form" label-width="160px">
        <el-form-item :label="$t('5d24fd22.1dcfcf')">
          <div style="margin-left: 1.5%">
            <template v-if="rel_shops_ids">
              <el-table :data="rel_shops_ids" tooltip-effect="dark" style="width: 90%">
                <el-table-column prop="storeName" :label="$t('5d24fd22.740032')" />
                <el-table-column
                  prop="address"
                  :label="$t('5d24fd22.765048')"
                  show-overflow-tooltip
                />
                <el-table-column :label="$t('5d24fd22.2b6bc0')" width="120">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-delete"
                      style="font-size: 18px"
                      @click.native.prevent="deleteRow(scope.$index, rel_shops_ids)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-button type="text" @click="addShopAction">{{ $t('5d24fd22.8af2f4') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('5d24fd22.fbf1b2')">
          <div style="margin-left: 1.5%">
            <template v-if="rel_distributor_ids">
              <el-table :data="rel_distributor_ids" style="line-height: normal">
                <el-table-column label="ID" prop="distributor_id" width="60" />
                <el-table-column :label="$t('5d24fd22.0d4934')" prop="name" />
                <el-table-column
                  prop="address"
                  :label="$t('5d24fd22.765048')"
                  show-overflow-tooltip
                />
                <el-table-column :label="$t('5d24fd22.2b6bc0')" width="50">
                  <template slot-scope="scope">
                    <i
                      class="el-icon-delete"
                      @click="deleteStoreRow(scope.$index, rel_distributor_ids)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-button type="text" @click="addStoreAction">{{ $t('5d24fd22.7b91b1') }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('5d24fd22.8098e2')">
          <el-input
            v-model="form.mobile"
            :placeholder="$t('5d24fd22.6e4f4b')"
            style="width: 193px"
            :disabled="datapass_block == 1"
          />
        </el-form-item>
        <el-form-item :label="$t('5d24fd22.1b260c')">
          <el-input
            v-model="form.name"
            :placeholder="$t('5d24fd22.9bafb0')"
            :disabled="datapass_block == 1"
            style="width: 193px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer content-center">
        <el-button type="primary" @click="addSalespersonAction">
{{
          $t('5d24fd22.38cf16')
        }}
</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('5d24fd22.9f3102')"
      :visible.sync="relShop.relShopVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table v-loading="loading" :data="relShop.list">
          <el-table-column prop="shop_id" label="id" width="60" />
          <el-table-column prop="store_name" :label="$t('5d24fd22.740032')" width="300" />
          <el-table-column prop="address" :label="$t('5d24fd22.85c7c1')" />
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
    <shopSelect
      :store-visible="shopVisible"
      :is-valid="true"
      :rel-shop-ids="relShopIds"
      :get-status="setStatus"
      @chooseStore="chooseShopAction"
      @closeStoreDialog="closeShopDialogAction"
    />
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-shop-ids="relStores"
      :get-status="setStoreStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  createSalesperson,
  getSalespersonList,
  deleteSalesperson,
  updateSalesperson,
  getRelShopList,
  getSalespersonInfo
} from '../../../../api/shop'
import shopSelect from '@/components/storeselect'
import StoreSelect from '@/components/storeListSelect'
export default {
  components: {
    shopSelect,
    StoreSelect
  },
  data() {
    return {
      activeName: 'admin',
      storeList: [],
      salespersonList: [],
      mobile: '',
      total_count: 0,
      loading: false,
      detailDialog: false,
      salespersonId: null,
      form: {
        name: '',
        shop_id: [],
        shop_name: '',
        mobile: '',
        salesperson_type: 'admin',
        distributor_id: []
      },
      rel_shops_ids: null,
      rel_distributor_ids: null,
      relShopIds: '',
      relStores: '',
      params: {
        page: 1,
        pageSize: 20,
        salesperson_type: 'admin'
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
      setStatus: false,
      setStoreStatus: false,
      shopVisible: false,
      storeVisible: false,
      DialogTitle: '',
      datapass_block: 1
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 切换tab
    handleClick(tab, event) {
      if (tab.name == 'admin') {
        this.DialogTitle = this.$t('5d24fd22.627f73')
      } else if (tab.name == 'verification_clerk') {
        this.DialogTitle = this.$t('5d24fd22.23e994')
      }
      this.activeName = tab.name
      this.params.page = 1
      this.params.salesperson_type = tab.name
      this.getList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    addSalesperson() {
      this.detailDialog = true
      this.form = {
        name: '',
        shop_id: [],
        mobile: '',
        salesperson_type: this.params.salesperson_type
      }
      this.rel_shops_ids = null
      this.rel_distributor_ids = null
      this.salespersonId = null
    },
    addSalespersonAction() {
      if (this.salespersonId) {
        updateSalesperson(this.salespersonId, this.form).then((response) => {
          this.detailDialog = false
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('5d24fd22.bba1f8')
          })
        })
      } else {
        createSalesperson(this.form).then((response) => {
          this.detailDialog = false
          this.getList()
          this.$message({
            type: 'success',
            message: this.$t('5d24fd22.6b84d5')
          })
        })
      }
    },
    updateSalesperson(row) {
      this.salespersonId = row.salespersonId
      this.detailDialog = true
      var params = { salesperson_id: row.salespersonId }
      getSalespersonInfo(params).then((res) => {
        this.form = {
          name: res.data.data.name,
          mobile: res.data.data.mobile,
          salesperson_type: res.data.data.salesperson_type,
          shop_id: res.data.data.shop_ids,
          distributor_id: res.data.data.distributor_ids
        }
        this.rel_shops_ids = res.data.data.shopList
        this.rel_distributor_ids = res.data.data.distributorList
      })
    },
    deleteSalesperson(index, row) {
      this.$confirm(this.$t('5d24fd22.07b471'), this.$t('5d24fd22.02d981'), {
        confirmButtonText: this.$t('5d24fd22.38cf16'),
        cancelButtonText: this.$t('5d24fd22.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteSalesperson(row.salespersonId).then((response) => {
            this.salespersonList.splice(index, 1)
            this.$message({
              type: 'success',
              message: this.$t('5d24fd22.da52a9')
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('5d24fd22.2111cc')
          })
        })
    },
    storeChange(params) {
      params && params.shop_id
      this.params.shop_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange() {
      this.shopId = ''
    },
    numberSearch() {
      this.params.mobile = this.mobile
      this.params.page = 1
      this.getList()
    },
    getList() {
      this.loading = true
      getSalespersonList(this.params)
        .then((response) => {
          if (response.data.data.list) {
            this.salespersonList = response.data.data.list
            this.total_count = Number(response.data.data.total_count)
            this.datapass_block = response.data.data.datapass_block
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('5d24fd22.431bcb')
          })
        })
    },
    getSalepersonShopList(salespersonId, storetype) {
      this.relShop.relShopVisible = true
      this.relShop.params.salesperson_id = salespersonId
      if (storetype) {
        this.relShop.params.store_type = storetype
      }
      getRelShopList(this.relShop.params).then((res) => {
        this.relShop.list = res.data.data.list
        this.relShop.total_count = res.data.data.total_count
      })
    },
    closeShopDialogAction() {
      this.shopVisible = false
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    handleRelShopCurrentChange(page_num) {
      this.relShop.params.page = page_num
      this.getSalepersonShopList(this.relShop.params.salesperson_id)
    },
    chooseShopAction(data) {
      this.shopVisible = false
      this.form.shop_id = []
      if (data === null || data.length <= 0) return
      this.rel_shops_ids = data
      for (var i = 0; i < data.length; i++) {
        if (this.form.shop_id.indexOf(data[i].wxShopId) < 0) {
          this.form.shop_id.push(Number(data[i].wxShopId))
        }
      }
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
    deleteRow(index, rows) {
      rows.splice(index, 1)
      this.form.shop_id = []
      for (var i = 0; i < rows.length; i++) {
        if (this.form.shop_id.indexOf(rows[i].wxShopId) < 0) {
          this.form.shop_id.push(Number(rows[i].wxShopId))
        }
      }
      this.rel_shops_ids.splice(index, 1)
    },
    deleteStoreRow(index, rows) {
      rows.splice(index, 1)
      this.form.distributor_id = []
      for (var i = 0; i < rows.length; i++) {
        if (this.form.distributor_id.indexOf(rows[i].distributor_id) < 0) {
          this.form.distributor_id.push(Number(rows[i].distributor_id))
        }
      }
      this.rel_distributor_ids.splice(index, 1)
    },
    addShopAction() {
      this.shopVisible = true
      this.setStatus = true
      this.relShopIds = this.rel_shops_ids
    },
    addStoreAction() {
      this.storeVisible = true
      this.setStoreStatus = true
      this.relStores = this.rel_distributor_ids
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
</style>
