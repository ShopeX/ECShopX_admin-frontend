<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('_child') === -1 && $route.path.indexOf('detail') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="mobile" :label="$t('b03b1d5f.468c2b')">
          <el-input v-model="params.mobile" class="input-m" :placeholder="$t('b03b1d5f.c0e45d')" />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="username" label="会员名称:">
          <el-input
            v-model="params.username"
            class="input-m"
            placeholder="请输入会员名称"
          />
        </SpFilterFormItem> -->
        <shop-select distributors @update="storeChange" @init="initChange" />
      </SpFilterForm>
      <div class="action-container" style="margin-bottom: 0px">
        <div>
          <el-button
            type="primary"
            plain
            v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
            @click="exportPopularizeData"
          >
            {{ $t('b03b1d5f.d65153') }}
          </el-button>
        </div>

        <div>
          <el-button
            type="primary"
            plain
            v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
            @click="exportPopularizeStatic"
          >
            {{ $t('b03b1d5f.8278b7') }}
          </el-button>

          <el-button type="primary" plain @click="exportPopularizeOrder">
            {{ $t('b03b1d5f.bf0b43') }} </el-button
          >* {{ $t('b03b1d5f.1a1ed0') }}
        </div>

        <SpFilterFormItem prop="tag_id" :label="$t('b03b1d5f.d2334d')">
          <el-date-picker
            v-model="created"
            unlink-panels
            type="daterange"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :range-separator="$t('b03b1d5f.981cbe')"
            :start-placeholder="$t('b03b1d5f.b44c0f')"
            :end-placeholder="$t('b03b1d5f.1d468b')"
            prefix-icon="null"
            :picker-options="pickerOptions"
            @change="dateChange"
          />
        </SpFilterFormItem>
      </div>

      <el-table
        v-loading="loading"
        border
        :data="list"
        :height="wheight - 170"
        :element-loading-text="$t('b03b1d5f.f09b12')"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column :label="$t('b03b1d5f.2b6bc0')" width="90">
          <template slot-scope="scope">
            <el-button icon="edit" type="text" class="btn-gap" @click="detail(scope.row)">
              {{ $t('b03b1d5f.3329bc') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="username" :label="$t('b03b1d5f.60d045')" />
        <el-table-column prop="mobile" :label="$t('b03b1d5f.8098e2')" width="150">
          <template slot-scope="scope">
            <i v-if="scope.row.mobile" class="el-icon-mobile" />
            {{ scope.row.mobile }}
            <el-tooltip
              v-if="scope.row.mobile && datapass_block == 0"
              effect="dark"
              :content="$t('b03b1d5f.79d3ab')"
              placement="top-start"
            >
              <i
                v-clipboard:copy="scope.row.mobile"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- v-if="$route.path.indexOf('_child') === -1  -->
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.f7e761')"
        >
          <template slot-scope="scope">
            {{ scope.row.cashWithdrawalRebate / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.70dbe1')"
        >
          <template slot-scope="scope">
            {{ scope.row.payedRebate / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.37fec4')"
        >
          <template slot-scope="scope">
            {{ scope.row.freezeCashWithdrawalRebate / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.facb53')"
        >
          <template slot-scope="scope">
            {{ scope.row.noCloseRebate / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.f131d0')"
        >
          <template slot-scope="scope">
            {{ scope.row.noClosePoint || 0 }}{{ $t('b03b1d5f.9f68a8') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.587e76')"
        >
          <template slot-scope="scope">
            {{ scope.row.rebateTotal / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.521856')"
        >
          <template slot-scope="scope">
            {{ scope.row.pointTotal || 0 }}{{ $t('b03b1d5f.9f68a8') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType !== 'distributor' && $route.path.indexOf('sellers') === -1"
          :label="$t('b03b1d5f.64b8dd')"
        >
          <template slot-scope="scope">
            {{ scope.row.itemTotalPrice / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>

        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          :label="$t('b03b1d5f.295713')"
        >
          <template slot-scope="scope">
            {{ scope.row.store_name }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          :label="$t('b03b1d5f.facb53')"
        >
          <template slot-scope="scope">
            {{ scope.row.rebate_sum_noclose / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          :label="$t('b03b1d5f.587e76')"
        >
          <template slot-scope="scope">
            {{ scope.row.rebate_sum / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="loginType == 'distributor' || $route.path.indexOf('sellers') !== -1"
          :label="$t('b03b1d5f.64b8dd')"
        >
          <template slot-scope="scope">
            {{ scope.row.price_sum / 100 }}{{ $t('b03b1d5f.c16655') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getPopularizeList,
  exportPopularizeData,
  exportPopularizeStatic,
  exportPopularizeOrder
} from '../../api/promotions'
import { pageMixin } from '@/mixins'
import shopSelect from '@/components/shopSelect'

export default {
  components: {
    shopSelect
  },
  mixins: [pageMixin],
  data() {
    return {
      params: {
        mobile: '',
        username: '',
        pathSource: ''
      },
      list: [],
      loading: false,
      row: {},
      username: '',
      total_count: 0,

      created: '',

      datapass_block: 1
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    pickerOptions() {
      return {
        shortcuts: [
          {
            text: this.$t('b03b1d5f.56ee10'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('b03b1d5f.335dfc'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('b03b1d5f.d96eb4'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.loginType = this.$store.getters.login_type
    this.params.pathSource = this.$route.path
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.$route.path)
    console.log(this.loginType)
    console.log(this.loginType)
    console.log(this.loginType)
    this.fetchList()
  },
  methods: {
    onSearch() {
      this.fetchList()
    },
    onReset() {
      this.params = {
        mobile: '',
        username: '',
        pathSource: ''
      }
      this.fetchList()
    },
    exportPopularizeData() {
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      exportPopularizeData(params).then((res) => {
        if (res.data.data.status == true) {
          this.$export_open('popularize')
          this.$message({
            type: 'success',
            message: this.$t('b03b1d5f.3e1ddd')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b03b1d5f.dd51ab')
          })
        }
      })
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

    exportPopularizeStatic() {
      console.log(this.created)
      console.log(this.created[0])
      console.log(this.created[1])
      let date_start = this.created[0]
      let date_end = this.created[1]
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        date_start,
        date_end,
        ...this.params
      }
      exportPopularizeStatic(params).then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('b03b1d5f.3e1ddd')
          })
          this.$export_open('popularizeStatic')
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b03b1d5f.dd51ab')
          })
        }
      })
    },

    exportPopularizeOrder() {
      console.log(this.created)
      console.log(this.created[0])
      console.log(this.created[1])
      let date_start = this.created[0]
      let date_end = this.created[1]
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        date_start,
        date_end,
        ...this.params
      }
      exportPopularizeOrder(params).then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('b03b1d5f.3e1ddd')
          })
          this.$export_open('popularizeOrder')
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b03b1d5f.dd51ab')
          })
        }
      })
    },
    onCopy() {
      this.$notify.success({
        message: this.$t('b03b1d5f.20a495'),
        showClose: true
      })
    },
    detail(row) {
      let routeData = this.$router.resolve({
        // path: '/marketing/popularize/popularizelist/detail',
        path: this.matchRoutePath('detail'),
        query: { user_id: row.user_id, distributor_id: row.distributor_id }
      })
      window.open(routeData.href, '_blank')
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getPopularizeList(params).then((res) => {
        this.list = res.data.data.list
        this.total_count = Number(res.data.data.total_count)
        this.datapass_block = res.data.data.datapass_block
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="scss">
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
