<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <SpFilterFormItem prop="distributor_id" :label="$t('b30cce08.efa91f')">
        <SpSelectShop
          v-model="params.distributor_id"
          clearable
          :placeholder="$t('b30cce08.708c9d')"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="regionList" :label="$t('b30cce08.7f3dd5')">
        <el-cascader
          v-model="params.regionList"
          :placeholder="$t('b30cce08.b51d4f')"
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
        {{ $t('b30cce08.db472b') }}
      </el-button>
    </div>

    <el-row :gutter="20">
      <el-col>
        <!-- <el-button icon="el-icon-search" size="mini" @click="getList(true)"></el-button> -->
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="tableLoading" :data="tableList" border>
      <el-table-column :label="$t('b30cce08.2b6bc0')" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="datapass_block == '0'"
            type="text"
            @click="onEditSalesAfterAddress(scope.row)"
          >
            {{ $t('b30cce08.95b351') }}
          </el-button>
          <el-button type="text" @click="handleDelete(scope.row)">
            {{ $t('b30cce08.2f4aad') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" :label="$t('b30cce08.295713')" />
      <el-table-column :label="$t('b30cce08.c096c4')">
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
      <el-table-column prop="contact" :label="$t('b30cce08.52409d')" width="250">
        <template slot-scope="scope">
          <div class=""><i class="el-icon-user" /> {{ scope.row.contact }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="contact" :label="$t('b30cce08.09a1f6')" width="250">
        <template slot-scope="scope">
          <div class=""><i class="el-icon-mobile-phone" /> {{ scope.row.mobile }}</div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('b30cce08.d1c357')" width="100">
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
      dialogTitle: this.$t('b30cce08.db472b'),
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
          label: this.$t('b30cce08.295713'),
          key: 'num',
          component: () => (
            <div class='distributor-tags'>
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
                <el-button type='text' on-click={this.addStoreAction}>
                  {this.$t('b30cce08.7b91b1')}
                </el-button>
              )}
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distributors } = this.addressForm
            if (distributors.length == 0) {
              callback(new Error(this.$t('b30cce08.06accf')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('b30cce08.2560b3'),
          key: 'regions_id',
          component: () => (
            <el-cascader v-model={this.addressForm.regions_id} options={this.regions} />
          ),
          validator: (rule, value, callback) => {
            const { regions_id } = this.addressForm
            if (regions_id.length == 0) {
              callback(new Error(this.$t('b30cce08.ad1a24')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('b30cce08.61a0ec'),
          key: 'address',
          type: 'input',
          required: true,
          message: this.$t('b30cce08.80d685')
        },
        {
          label: this.$t('b30cce08.52409d'),
          key: 'contact',
          type: 'input',
          required: true,
          message: this.$t('b30cce08.9e3f21')
        },
        {
          label: this.$t('b30cce08.b58943'),
          key: 'mobile',
          type: 'input',
          required: true,
          message: this.$t('b30cce08.8f7e96')
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
      this.dialogTitle = this.$t('b30cce08.b2867a')
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
      this.dialogTitle = this.$t('b30cce08.db472b')
      this.addressForm.address_id = ''
      this.addressForm.distributors = []
      this.addressForm.regions_id = []
      this.addressForm.address = ''
      this.addressForm.contact = ''
      this.addressForm.mobile = ''
      this.addressDialog = true
    },
    async handleDelete(row) {
      await this.$confirm(this.$t('b30cce08.e853b3'), this.$t('b30cce08.02d981'), {
        confirmButtonText: this.$t('b30cce08.38cf16'),
        cancelButtonText: this.$t('b30cce08.625fb2'),
        type: 'warning'
      })
      const { status } = await this.$api.aftersales.deleteAftersalesAddress(row.address_id)
      if (status) {
        this.$message.success(this.$t('b30cce08.fc9bdd'))
      } else {
        this.$message.error(this.$t('b30cce08.9cf7a3'))
      }
      this.fetchList()
    },
    async addStoreAction() {
      const distributor_ids = this.addressForm.distributors.map((item) => item.distributor_id)
      const { data } = await this.$picker.shop({
        data: distributor_ids,
        queryParams: {
          show_distributor_self: 1
        }
      })
      this.addressForm.distributors = JSON.parse(JSON.stringify(data))
    },
    async onAddressFormSubmit() {
      const [province, city, area] = getRegionNameById(this.addressForm.regions_id, this.regions)
      const { distributors, regions_id, address, contact, mobile } = this.addressForm
      const distributor_id = distributors.map((item) => item.distributor_id)
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
        const [distributor_id] = this.addressForm.distributors.map((item) => item.distributor_id)
        params = {
          ...params,
          distributor_id,
          address_id: this.addressForm.address_id
        }
        const { status } = await this.$api.aftersales.updateAftersalesAddress(params)
        if (status) {
          this.$message.success(this.$t('b30cce08.69be67'))
        } else {
          this.$message.error(this.$t('b30cce08.5badb3'))
        }
      } else {
        const { status } = await this.$api.aftersales.createAftersalesAddress(params)
        if (status) {
          this.$message.success(this.$t('b30cce08.3fdaea'))
        } else {
          this.$message.error(this.$t('b30cce08.6452a0'))
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
        this.$message.success(this.$t('b30cce08.69be67'))
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
