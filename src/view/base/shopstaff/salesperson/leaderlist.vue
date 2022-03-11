<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <shop-select
          wxshops
          @update="storeChange"
          @init="initChange"
        />
        <!--distributors wxshops 需要哪个api传哪个-->
      </el-col>
      <el-col
        :md="8"
        :lg="5"
      >
        <el-input
          v-model="mobile"
          placeholder="手机号"
          clearable
          size="mini"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="numberSearch"
          />
        </el-input>
      </el-col>
      <el-col
        :span="3"
        class="content-right"
      >
        <el-button
          size="mini"
          type="primary"
          icon="plus"
          @click="addSalesperson"
        >
          添加管理员
        </el-button>
      </el-col>
    </el-row>
    <el-row />
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="管理员"
        name="admin"
      />
      <el-tab-pane
        label="核销员"
        name="verification_clerk"
      />
      <el-table
        v-loading="loading"
        :data="salespersonList"
        :height="wheight - 160"
      >
        <el-table-column
          prop="name"
          label="姓名"
        />
        <el-table-column
          prop="mobile"
          label="手机号"
        />
        <el-table-column label="所属门店">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getSalepersonShopList(scope.row.salespersonId, 'shop')"
            >
              查看门店
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="所属店铺">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="getSalepersonShopList(scope.row.salespersonId, 'distributor')"
            >
              查看店铺
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operating-icons">
              <i
                class="iconfont icon-edit1"
                @click="updateSalesperson(scope.row)"
              />
              <i
                class="mark iconfont icon-trash-alt1"
                @click="deleteSalesperson(scope.$index, scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-padded content-center"
      >
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

    <el-dialog
      :title="DialogTitle"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
    >
      <el-form
        v-model="form"
        label-width="160px"
      >
        <el-form-item label="管理门店">
          <div style="margin-left: 1.5%">
            <template v-if="rel_shops_ids">
              <el-table
                :data="rel_shops_ids"
                tooltip-effect="dark"
                style="width: 90%"
              >
                <el-table-column
                  prop="storeName"
                  label="门店名称"
                />
                <el-table-column
                  prop="address"
                  label="地址"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="操作"
                  width="120"
                >
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
            <el-button
              type="text"
              @click="addShopAction"
            >
              添加适用门店
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="管理店铺">
          <div style="margin-left: 1.5%">
            <template v-if="rel_distributor_ids">
              <el-table
                :data="rel_distributor_ids"
                style="line-height: normal"
              >
                <el-table-column
                  label="ID"
                  prop="distributor_id"
                  width="60"
                />
                <el-table-column
                  label="店铺名称"
                  prop="name"
                />
                <el-table-column
                  prop="address"
                  label="地址"
                  show-overflow-tooltip
                />
                <el-table-column
                  label="操作"
                  width="50"
                >
                  <template slot-scope="scope">
                    <i
                      class="iconfont icon-trash-alt"
                      @click="deleteStoreRow(scope.$index, rel_distributor_ids)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </template>
            <el-button
              type="text"
              @click="addStoreAction"
            >
              添加适用店铺
            </el-button>
          </div>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="form.mobile"
            placeholder="请输入手机号"
            style="width: 193px"
            :disabled="datapass_block == 1"
          />
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input
            v-model="form.name"
            placeholder="请输入管理员姓名"
            :disabled="datapass_block == 1"
            style="width: 193px"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer content-center"
      >
        <el-button
          type="primary"
          @click="addSalespersonAction"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="门店列表"
      :visible.sync="relShop.relShopVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table
          v-loading="loading"
          :data="relShop.list"
        >
          <el-table-column
            prop="shop_id"
            label="id"
            width="60"
          />
          <el-table-column
            prop="store_name"
            label="门店名称"
            width="300"
          />
          <el-table-column
            prop="address"
            label="门店地址"
          />
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
  data () {
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
  mounted () {
    this.getList()
  },
  methods: {
    // 切换tab
    handleClick (tab, event) {
      if (tab.name == 'admin') {
        this.DialogTitle = '编辑管理员信息'
      } else if (tab.name == 'verification_clerk') {
        this.DialogTitle = '编辑核销员信息'
      }
      this.activeName = tab.name
      this.params.page = 1
      this.params.salesperson_type = tab.name
      this.getList()
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getList()
    },
    addSalesperson () {
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
    addSalespersonAction () {
      if (this.salespersonId) {
        updateSalesperson(this.salespersonId, this.form).then((response) => {
          this.detailDialog = false
          this.getList()
          this.$message({
            type: 'success',
            message: '更新管理员成功'
          })
        })
      } else {
        createSalesperson(this.form).then((response) => {
          this.detailDialog = false
          this.getList()
          this.$message({
            type: 'success',
            message: '添加管理员成功'
          })
        })
      }
    },
    updateSalesperson (row) {
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
    deleteSalesperson (index, row) {
      this.$confirm('此操作将删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSalesperson(row.salespersonId).then((response) => {
            this.salespersonList.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除管理员成功'
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
    storeChange (params) {
      params && params.shop_id
      this.params.shop_id = params.shop_id
      this.params.page = 1
      this.getList()
    },
    initChange () {
      this.shopId = ''
    },
    numberSearch () {
      this.params.mobile = this.mobile
      this.params.page = 1
      this.getList()
    },
    getList () {
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
            message: '获取管理员出错'
          })
        })
    },
    getSalepersonShopList (salespersonId, storetype) {
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
    closeShopDialogAction () {
      this.shopVisible = false
    },
    closeStoreDialogAction () {
      this.storeVisible = false
    },
    handleCancel () {
      this.relShop.relShopVisible = false
    },
    handleRelShopCurrentChange (page_num) {
      this.relShop.params.page = page_num
      this.getSalepersonShopList(this.relShop.params.salesperson_id)
    },
    chooseShopAction (data) {
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
    chooseStoreAction (data) {
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
    deleteRow (index, rows) {
      rows.splice(index, 1)
      this.form.shop_id = []
      for (var i = 0; i < rows.length; i++) {
        if (this.form.shop_id.indexOf(rows[i].wxShopId) < 0) {
          this.form.shop_id.push(Number(rows[i].wxShopId))
        }
      }
      this.rel_shops_ids.splice(index, 1)
    },
    deleteStoreRow (index, rows) {
      rows.splice(index, 1)
      this.form.distributor_id = []
      for (var i = 0; i < rows.length; i++) {
        if (this.form.distributor_id.indexOf(rows[i].distributor_id) < 0) {
          this.form.distributor_id.push(Number(rows[i].distributor_id))
        }
      }
      this.rel_distributor_ids.splice(index, 1)
    },
    addShopAction () {
      this.shopVisible = true
      this.setStatus = true
      this.relShopIds = this.rel_shops_ids
    },
    addStoreAction () {
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
