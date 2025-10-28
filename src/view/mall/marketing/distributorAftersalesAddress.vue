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
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage class="distributorAftersalesAddress">
    <SpPlatformTip h5 app alipay />
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="distributor_id" label="店铺:">
        <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="regionList" label="售后地区:">
        <el-cascader
          v-model="params.regionList"
          placeholder="售后地区"
          :options="regions"
          :props="{
            checkStrictly: true,
            value: 'label'
          }"
          clearable
        />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button icon="el-icon-circle-plus" type="primary" @click="handleCreate">
        添加售后地址
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col>
        <!-- <el-button icon="el-icon-search" size="mini" @click="getList(true)"></el-button> -->
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="tableLoading" :data="tableList" border>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="datapass_block == '0'"
            type="text"
            @click="onEditSalesAfterAddress(scope.row)"
          >
            编辑
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)"> 删除 </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="店铺" />
      <el-table-column label="售后地址">
        <template slot-scope="scope">
          <i class="el-icon-place" />
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
          <div class=""><i class="el-icon-user" /> {{ scope.row.contact }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系电话" width="250">
        <template slot-scope="scope">
          <div class=""><i class="el-icon-mobile-phone" /> {{ scope.row.mobile }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否默认" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_default"
            active-value="1"
            inactive-value="0"
            :disabled="scope.row.is_default == 1"
            @change="onSwitchChange(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="content-center content-top-padded">
      <el-pagination
        background=""
        layout="total, sizes, prev, pager, next"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :total="page.total"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>

    <!-- 添加售后地址 -->
    <SpDialog
      ref="addressDialogRef"
      v-model="addressDialog"
      :title="dialogTitle"
      :modal="false"
      :form="addressForm"
      :form-list="addressFormList"
      @onSubmit="onAddressFormSubmit"
    />
  </SpPage>
</template>

<script>
import mixin, { pageMixin } from '@/mixins'
import { getRegionNameById } from '@/utils'

export default {
  mixins: [mixin, pageMixin],
  data() {
    return {
      params: {
        distributor_id: '',
        regionList: []
      },
      regions: [],
      tableLoading: false,
      dialogTitle: '添加售后地址',
      datapass_block: 1,
      addressDialog: false,
      addressForm: {
        address_id: '',
        distributors: [],
        regions_id: [],
        address: '',
        contact: '',
        mobile: ''
      },
      addressFormList: [
        {
          label: '店铺',
          key: 'num',
          component: () => (
            <div class="distributor-tags">
              {this.addressForm.distributors.map((item, index) => (
                <el-tag
                  key={item.name}
                  closable={!this.addressForm.address_id}
                  on-close={this.storeClose.bind(this, index)}
                >
                  {item.name}
                </el-tag>
              ))}
              {!this.addressForm.address_id && (
                <el-button type="text" on-click={this.addStoreAction}>
                  添加适用店铺
                </el-button>
              )}
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distributors } = this.addressForm
            if (distributors.length == 0) {
              callback(new Error('请选择店铺'))
            } else {
              callback()
            }
          }
        },
        {
          label: '地区',
          key: 'regions_id',
          component: () => (
            <el-cascader v-model={this.addressForm.regions_id} options={this.regions} />
          ),
          validator: (rule, value, callback) => {
            const { regions_id } = this.addressForm
            if (regions_id.length == 0) {
              callback(new Error('请选择地区'))
            } else {
              callback()
            }
          }
        },
        {
          label: '详细地址',
          key: 'address',
          type: 'input',
          required: true,
          message: '请输入详细地址'
        },
        {
          label: '联系人',
          key: 'contact',
          type: 'input',
          required: true,
          message: '请输入联系人'
        },
        {
          label: '联系方式',
          key: 'mobile',
          type: 'input',
          required: true,
          message: '请输入联系方式'
        }
      ]
    }
  },
  async created() {
    const res = await this.$api.common.getAddress()
    this.regions = res
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    async fetchList() {
      this.tableLoading = true
      const { pageIndex: page, pageSize: page_size } = this.page
      const [province, city, area] = getRegionNameById(this.params.regionList, this.regions)
      const { distributor_id } = this.params
      const query = {
        page,
        page_size,
        distributor_id,
        province,
        city,
        area
      }
      const { list, total_count, datapass_block } =
        await this.$api.aftersales.getAftersalesAddressList(query)
      this.tableList = list
      this.page.total = total_count
      this.datapass_block = datapass_block
      this.tableLoading = false
    },
    async onEditSalesAfterAddress({
      address_id,
      distributor_id,
      regions_id,
      address,
      contact,
      mobile
    }) {
      this.dialogTitle = '编辑售后地址'
      const res = await this.$api.marketing.getDistributorInfo({ distributor_id })
      this.addressForm.address_id = address_id
      this.addressForm.distributors = [res]
      this.addressForm.regions_id = JSON.parse(regions_id)
      this.addressForm.address = address
      this.addressForm.contact = contact
      this.addressForm.mobile = mobile
      this.addressDialog = true
    },
    handleCreate() {
      this.dialogTitle = '添加售后地址'
      this.addressForm.address_id = ''
      this.addressForm.distributors = []
      this.addressForm.regions_id = []
      this.addressForm.address = ''
      this.addressForm.contact = ''
      this.addressForm.mobile = ''
      this.addressDialog = true
    },
    async handleDelete(row) {
      await this.$confirm('此操作将永久删除该店铺售后地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const { status } = await this.$api.aftersales.deleteAftersalesAddress(row.address_id)
      if (status) {
        this.$message.success('删除成功!')
      } else {
        this.$message.error('删除失败!')
      }
      this.fetchList()
    },
    async addStoreAction() {
      const distributor_ids = this.addressForm.distributors.map(item => item.distributor_id)
      const { data } = await this.$picker.shop({
        data: distributor_ids
      })
      this.addressForm.distributors = JSON.parse(JSON.stringify(data))
    },
    async onAddressFormSubmit() {
      const [province, city, area] = getRegionNameById(this.addressForm.regions_id, this.regions)
      const { distributors, regions_id, address, contact, mobile } = this.addressForm
      const distributor_id = distributors.map(item => item.distributor_id)
      let params = {
        distributor_id: JSON.stringify(distributor_id),
        regions_id: JSON.stringify(regions_id),
        regions: JSON.stringify([province, city, area]),
        province,
        city,
        area,
        address,
        contact,
        mobile
      }
      if (this.addressForm.address_id) {
        const [distributor_id] = this.addressForm.distributors.map(item => item.distributor_id)
        params = {
          ...params,
          distributor_id,
          address_id: this.addressForm.address_id
        }
        const { status } = await this.$api.aftersales.updateAftersalesAddress(params)
        if (status) {
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      } else {
        const { status } = await this.$api.aftersales.createAftersalesAddress(params)
        if (status) {
          this.$message.success('添加成功')
        } else {
          this.$message.error('添加失败')
        }
      }
      this.addressDialog = false
      this.fetchList()
    },
    async onSwitchChange({ address_id }) {
      const { status } = await this.$api.aftersales.updateAftersalesAddress({
        address_id,
        set_default: true
      })
      if (status) {
        this.$message.success('修改成功')
        this.fetchList()
      }
    },
    storeClose(index) {
      this.addressForm.distributors.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.distributor-tags {
  .el-tag {
    margin-right: 10px;
  }
}
</style>
