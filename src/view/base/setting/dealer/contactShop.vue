<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="zyk_page_register_Info_contactShop">
    <div class="part1">
      <el-form ref="form" :model="form">
        <div class="top">
          <div class="left">
            <el-form-item>
              <el-select v-model="selectStatus">
                <el-option :label="$t('3e9b9d2e.7d64bb')" value="1" />
                <el-option :label="$t('3e9b9d2e.7c487d')" value="2" />
              </el-select>
            </el-form-item>
            <template v-if="selectStatus == '1'">
              <el-form-item>
                <el-select
                  v-model="form.is_valid"
                  :placeholder="$t('3e9b9d2e.443483')"
                  @change="getList()"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="$t(item.nameKey)"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
            <template v-else>
              <el-cascader
                v-model="form.address"
                :placeholder="$t('3e9b9d2e.491f74')"
                :options="regions"
                filterable
                :props="{ checkStrictly: true }"
                @change="RegionChangeSearch"
              />
            </template>
          </div>
          <div class="right">
            <el-form-item>
              <el-select v-model="nameSelect">
                <el-option :label="$t('3e9b9d2e.0d4934')" value="1" />
                <el-option :label="$t('3e9b9d2e.d9898e')" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="nameSelect == '1'">
              <el-input
                v-model="form.name"
                :placeholder="$t('3e9b9d2e.867738')"
                @change="getList()"
              >
                <el-button slot="append" @click="getList"> {{ $t('3e9b9d2e.e5f71f') }} </el-button>
              </el-input>
            </el-form-item>
            <el-form-item v-else>
              <el-input
                v-model="form.mobile"
                :placeholder="$t('3e9b9d2e.2b28a8')"
                @change="getList()"
              >
                <el-button slot="append" @click="getList"> {{ $t('3e9b9d2e.e5f71f') }} </el-button>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item style="text-align: right">
          <el-button @click="resetForm('form')"> {{ $t('3e9b9d2e.4b9c32') }} </el-button>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <span>{{ $t('3e9b9d2e.9530e8') }}</span>
        <el-button size="mini" @click="dialogOpen()"> {{ $t('3e9b9d2e.5c16c5') }} </el-button>
      </div>
    </div>
    <el-card class="box-card" shadow="never">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="list"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column :label="$t('3e9b9d2e.a3068b')" width="120">
          <template slot-scope="scope">
            {{ scope.row.distributor_id }}
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('3e9b9d2e.9a6d8e')">
          <template slot-scope="scope">
            <div class="store-name">
              {{ scope.row.name }}
            </div>
            <div class="store-contact">
              <span v-if="scope.row.contact">
                <i class="el-icon-user" />
                {{ scope.row.contact }}
              </span>
              <span>
                <i class="el-icon-mobile" />
                {{ scope.row.mobile }}
              </span>
            </div>
            <div v-if="scope.row.store_address" class="store-address">
              <i class="el-icon-place" />
              {{ scope.row.store_address }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" :label="$t('3e9b9d2e.765048')" />
        <el-table-column :label="$t('3e9b9d2e.e28997')">
          <template slot-scope="scope">
            <span>{{
              (scope.row.is_valid === 'true' && $t('3e9b9d2e.7854b5')) ||
              (scope.row.is_valid === 'false' && $t('3e9b9d2e.710ad0')) ||
              (scope.row.is_valid === 'delete' && $t('3e9b9d2e.0044f6'))
            }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('3e9b9d2e.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button
              :style="{ color: 'red' }"
              type="text"
              size="mini"
              @click="cancelHandle(scope.row.distributor_id)"
            >
              {{ $t('3e9b9d2e.eabb6f') }}
            </el-button>
            <el-button type="text" size="mini" @click="checkHandle(scope.row.distributor_id)">
              {{ $t('3e9b9d2e.607e7a') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="form.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="form.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <newShopSelects
      :get-status="ShopStatus"
      :adapay-member-id="adapayMemberId"
      :store-visible="storeVisible"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>

<script>
import districtOptions from '@/mixins/districtOptions'
import { getDistributorList, adapayMemberBind } from '@/api/marketing'
import newShopSelects from '@/components/newShopSelects'

export default {
  mixins: [districtOptions],
  components: { newShopSelects },
  data() {
    return {
      selectStatus: '1',
      nameSelect: '1',
      form: {
        is_valid: '',
        name: '',
        mobile: '',
        address: '',
        page: 1,
        pageSize: 20
      },
      dialogVisible: true,
      storeVisible: false,
      ShopStatus: false,
      adapayMemberId: this.$route.query.id,
      statusList: [
        { nameKey: '3e9b9d2e.a8b0c2', value: '' },
        { nameKey: '3e9b9d2e.7854b5', value: 'true' },
        { nameKey: '3e9b9d2e.710ad0', value: 'false' },
        { nameKey: '3e9b9d2e.0044f6', value: 'delete' }
      ],

      total_count: 0,
      loading: false,

      regions: [],
      list: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getCascaderObj(val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.value === value) {
            opt = itm.children
            return itm
          }
        }
        return null
      })
    },
    async getList() {
      this.loading = true
      if (this.selectStatus == '1') {
        delete this.form.province
        delete this.form.city
        delete this.form.area
      } else {
        delete this.form.is_valid
      }
      if (this.nameSelect == '1') {
        delete this.form.mobile
      } else {
        delete this.form.name
      }
      delete this.form.address

      try {
        const result = await getDistributorList({
          ...this.form,
          adapay_member_id: this.adapayMemberId
        })
        console.log(result)
        this.total_count = result.data.data.total_count
        this.list = result.data.data.list
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$message({
          type: 'error',
          message: this.$t('3e9b9d2e.5b0398')
        })
      }
    },
    RegionChangeSearch(value) {
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.form.province = vals[0].label
        this.form.city = ''
        this.form.area = ''
      } else if (vals.length == 2) {
        this.form.province = vals[0].label
        this.form.city = vals[1].label
        this.form.area = ''
      } else if (vals.length == 3) {
        this.form.province = vals[0].label
        this.form.city = vals[1].label
        this.form.area = vals[2].label
      }
      this.form.page = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.form.page = page
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.form.page = 1
      this.form.pageSize = pageSize
      this.getList()
    },
    resetForm(form) {
      this.$refs.form.resetFields()
      this.form.is_valid = ''
      this.form.name = ''
      this.form.mobile = ''
      this.form.address = ''
    },
    closeStoreDialogAction() {
      this.storeVisible = false
      this.ShopStatus = false
      this.getList()
    },
    dialogOpen() {
      this.storeVisible = true
      this.ShopStatus = true
    },
    // 取消关联
    cancelHandle(id) {
      const h = this.$createElement
      this.$msgbox({
        title: this.$t('3e9b9d2e.02d981'),
        id: id,
        message: h('div', { style: 'padding-top:0px' }, [
          h('i', {
            style: 'color: #ff6700;font-size: 22px;margin-right:10px ;',
            class: 'el-icon-warning-outline icon'
          }),
          h(
            'span',
            { style: 'font-size: 14px;color:#000', class: 'tips' },
            this.$t('3e9b9d2e.770742')
          ),
          h(
            'p',
            { style: 'font-size: 12px;margin-bottom:20px ;margin-left:32px ;' },
            this.$t('3e9b9d2e.37b966')
          )
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('3e9b9d2e.38cf16'),
        cancelButtonText: this.$t('3e9b9d2e.625fb2'),
        beforeClose: async (action, instance, done) => {
          console.log(action)
          console.log(instance)

          if (action === 'confirm') {
            const result = await adapayMemberBind({
              distributor_ids: JSON.stringify(instance.id),
              adapay_member_id: 0
            })
            done()
            if (result.data.data.status) {
              instance.confirmButtonLoading = false
              this.$message.success(this.$t('3e9b9d2e.285f58'))
              this.getList()
              // done("取消成功");
            }
            console.log(result)
          } else {
            done()
          }
        }
      }).then((action) => {
        console.log(123)
      })
    },
    // 查看
    checkHandle(id) {
      this.$router.push({
        path: '/store/storemanager/marketingdistributor/marketingdistributor_editor',
        query: {
          distributor_id: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.zyk_page_register_Info_contactShop {
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
    }
    .right {
      display: flex;
    }
  }
  .bottom {
    padding: 20px 30px;
    border-top: 1px solid #ebeef5;
    span {
      margin-right: 30px;
    }
    button {
      color: #409eff;
      border: 1px solid #409eff;
    }
  }
}
</style>
<style lang="scss">
.zyk_page_register_Info_contactShop {
  .el-message-box {
    display: inline-block;
    width: 450px;
  }
  .el-message-box__wrapper {
    position: fixed;
    top: -200px !important;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
  }
}
</style>
