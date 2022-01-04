<template>
  <div class="distributorAftersalesAddress">
    <el-row :gutter="20">
      <el-col>
        <shop-select distributors @update="handleFilter"></shop-select>
        <el-cascader
          placeholder="售后地区"
          v-model="regionList"
          :options="regions"
          @change="handleChangeregionRegionList"
          :props="{
            checkStrictly: true,
            value: 'label'
          }"
          clearable
        ></el-cascader>
        <!-- <el-button icon="el-icon-search" size="mini" @click="getList(true)"></el-button> -->
        <el-button icon="el-icon-circle-plus" type="primary" @click="handleCreate"
          >添加售后地址</el-button
        >
      </el-col>
    </el-row>
    <el-card>
      <!-- 数据表格 -->
      <el-table :data="list" :span-method="objectSpanMethod" v-loading="tableLoading">
        <el-table-column prop="name" label="店铺"></el-table-column>
        <el-table-column label="售后地址">
          <template slot-scope="scope">
            <i class="el-icon-place"></i>
            {{
              scope.row.province +
                ' ' +
                scope.row.city +
                ' ' +
                scope.row.area +
                ' ' +
                scope.row.address
            }}
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" width="250">
          <template slot-scope="scope">
            <div class=""><i class="el-icon-user"></i> {{ scope.row.contact }}</div>
            <div class=""><i class="el-icon-mobile-phone"></i> {{ scope.row.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column label="是否默认" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_default == 1 ? true : false"
              :disabled="scope.row.is_default == 1 ? true : false"
              active-color="#13ce66"
              inactive-color="#cccccc"
              @change="defaultSwitchChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button v-if="datapass_block=='0'" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="45%"
    >
      <el-form ref="dataForm" :model="dataForm" label-width="100px">
        <el-form-item label="店铺">
          <template v-if="rel_distributor_ids && operate == 'create'">
            <el-tag
              v-for="(item, index) in rel_distributor_ids"
              :disable-transitions="false"
              :key="item.name"
              closable
              @close="storeClose(rel_distributor_ids, index)"
              >{{ item.name }}</el-tag
            >
          </template>
          <el-button
            v-if="rel_distributor_ids && operate == 'create'"
            type="text"
            @click="addStoreAction"
            >添加适用店铺</el-button
          >
          <template v-if="operate == 'update'">
            <span>{{ shopname }}</span>
          </template>
        </el-form-item>
        <el-form-item label="售后地址">
          <el-cascader
            class="w-100"
            v-model="form.regions_id"
            :options="regions"
            @change="handleRegionChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="address" placeholder="" :disabled="datapass_block == 1 && operate == 'update'"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="contact" placeholder="" :disabled="datapass_block == 1 && operate == 'update'"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="mobile" placeholder="" :disabled="datapass_block == 1 && operate == 'update'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="operate == 'create'" type="primary" @click="createAddress"
          >确 定</el-button
        >
        <el-button v-if="operate == 'update'" type="primary" @click="updateAddress"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="店铺列表"
      :visible.sync="relShop.relShopVisible"
      :before-close="handleCancel"
      width="70%"
    >
      <template>
        <el-table :data="relShop.list" v-loading="loading">
          <el-table-column prop="shop_id" label="id" width="60"></el-table-column>
          <el-table-column prop="store_name" label="店铺名称" width="300"></el-table-column>
          <el-table-column prop="address" label="店铺地址"></el-table-column>
        </el-table>
        <div
          v-if="relShop.total_count > relShop.params.page_size"
          class="content-center content-top-padded"
        >
          <el-pagination
            layout="prev, pager, next"
            @current-change="handleRelShopCurrentChange"
            :current-page.sync="relShop.params.page"
            :total="relShop.total_count"
            :page-size="relShop.params.page_size"
          ></el-pagination>
        </div>
      </template>
    </el-dialog>
    <div class="content-center content-top-padded">
      <el-pagination
        background=""
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="listQuery.page_size"
        layout="total, sizes, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-data-ids="relStores"
      :get-status="setStoreStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    ></StoreSelect>
  </div>
</template>

<script>
import StoreSelect from '@/components/storeListSelect/newindex'
import {
  getAftersalesAddressList,
  createAftersalesAddress,
  updateAftersalesAddress,
  deleteAftersalesAddress,
  setDefaultAftersalesAddress
} from '@/api/aftersales'
import district from '../../../common/district.json'
import { getDistributorList } from '../../../api/marketing'
import shopSelect from '@/components/shopSelect'
import store from '@/store'

// 取选中地区的值
function getCascaderObj(val, opt) {
  return val.map(function(value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  components: {
    StoreSelect,
    shopSelect
  },
  data() {
    return {
      regionList: [],
      dataForm: {},
      list: [],
      spanArr: [],
      total: 0,
      tableLoading: true,
      dialogVisible: false,
      loading: false,
      dialogTitle: '添加店铺售后地址',
      distributors: [],
      distributor_id: 0,
      setStoreStatus: false,
      storeVisible: false,
      relStores: [],
      rel_distributor_ids: [],
      regions: district,
      shopname: '',
      address: '',
      contact: '',
      mobile: '',
      operate: '',
      updateRow: {},
      listQuery: {
        page: 1,
        page_size: 10
      },
      form: {
        regions_id: []
      },
      relShop: {
        list: [],
        total_count: 0,
        params: {
          page: 1,
          page_size: 20
        },
        relShopVisible: false
      },
      datapass_block: 1
    }
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    setrowspans() {
      let contactDot = 0
      this.list.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
        } else {
          if (item.distributor_id === this.list[index - 1].distributor_id) {
            this.spanArr[contactDot] += 1
            this.spanArr.push(0)
          } else {
            contactDot = index
            this.spanArr.push(1)
          }
        }
      })
    },
    getList() {
      this.tableLoading = true;
      this.listQuery.province = this.regionList[0];
      this.listQuery.city = this.regionList[1];
      this.listQuery.area = this.regionList[2];
      this.listQuery.distributor_id = (this.distributor_id == 0 || !this.distributor_id) ? undefined : this.distributor_id;
      this.spanArr = []

      getAftersalesAddressList(this.listQuery).then((response) => {
        if (response.data.data.list) {
          this.list = response.data.data.list
          this.total = response.data.data.total_count
          this.datapass_block = response.data.data.datapass_block
        }
        this.tableLoading = false
        this.setrowspans()
      })
    },
    handleFilter(val) {
      val && val.shop_id
      this.distributor_id = val.shop_id
      this.getList()
    },
    handleClose() {
      this.resetInfo()
      this.dialogVisible = false
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.operate = 'update'
      this.shopname = row.name
      this.form.regions_id = JSON.parse(row.regions_id)
      this.form.regions = JSON.parse(row.regions)
      this.address = row.address
      this.mobile = row.mobile
      this.contact = row.contact
      this.updateRow = Object.assign({}, row)
      this.dialogTitle = '修改店铺售后地址'
    },
    handleCreate() {
      this.resetInfo()
      this.operate = 'create'
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该店铺售后地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAftersalesAddress(row.address_id).then((response) => {
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
            this.getList()
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
      this.listQuery.page_size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCancel() {
      this.relShop.relShopVisible = false
    },
    resetInfo() {
      this.rel_distributor_ids = []
      this.form.regions_id = []
      this.form.region = []
      this.address = ''
    },
    addStoreAction() {
      this.storeVisible = true
      this.setStoreStatus = true
      this.relStores = JSON.parse(JSON.stringify(this.rel_distributor_ids))
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      this.form.distributor_id = []
      if (data === null || data.length <= 0) return
      this.rel_distributor_ids = data
      for (var i = 0; i < data.length; i++) {
        if (this.form.distributor_id.indexOf(data[i].shop_id) < 0) {
          this.form.distributor_id.push(Number(data[i].shop_id))
        }
      }
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    handleRegionChange: function(value) {
      var vals = getCascaderObj(value, this.regions)
      this.form.regions_id = []
      this.form.regions = []
      for (var i = 0; i < vals.length; i++) {
        this.form.regions_id[i] = vals[i].value
        this.form.regions[i] = vals[i].label
      }

      if (
        this.form.regions[0] == '北京市' ||
        this.form.regions[0] == '天津市' ||
        this.form.regions[0] == '上海市' ||
        this.form.regions[0] == '重庆市'
      ) {
        this.searchRegion = this.form.regions[0] + this.form.regions[2]
      } else {
        this.searchRegion = this.form.regions[0] + this.form.regions[1] + this.form.regions[2]
      }
    },

    createAddress() {
      const queryData = {}
      const ids = []
      this.rel_distributor_ids.forEach(function(value) {
        ids.push(value.distributor_id)
      })
      queryData['distributor_id'] = JSON.stringify(ids)
      queryData['regions_id'] = JSON.stringify(this.form.regions_id)
      queryData['regions'] = JSON.stringify(this.form.regions)
      queryData['province'] = this.form.regions[0]
      queryData['city'] = this.form.regions[1]
      queryData['area'] = this.form.regions[2]
      queryData['address'] = this.address
      queryData['contact'] = this.contact
      queryData['mobile'] = this.mobile
      createAftersalesAddress(queryData).then((response) => {
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
        this.getList()
      })
    },
    updateAddress() {
      const queryData = {}
      queryData['distributor_id'] = this.updateRow.distributor_id
      queryData['regions_id'] = JSON.stringify(this.form.regions_id)
      queryData['regions'] = JSON.stringify(this.form.regions)
      queryData['province'] = this.form.regions[0]
      queryData['city'] = this.form.regions[1]
      queryData['area'] = this.form.regions[2]
      queryData['address'] = this.address
      queryData['address_id'] = this.updateRow.address_id
      queryData['contact'] = this.contact
      queryData['mobile'] = this.mobile
      updateAftersalesAddress(queryData).then((response) => {
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
        this.getList()
      })
    },

    /**
     * 区域搜索
     * */
    handleChangeregionRegionList(row) {
      this.getList()
    },
    defaultSwitchChange(row) {
      let params = {
        address_id: row.address_id,
        set_default: true
      }
      updateAftersalesAddress(params).then((response) => {
        if (response.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped lang="scss">
.filterInput {
  width: 150px;
}
.distributorAftersalesAddress {
  .w-100 {
    width: 100%;
  }
}
</style>
