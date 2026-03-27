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
  <SpPage class="merchantVerify">
    <div v-if="$route.path.indexOf('verify') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="audit_status" :label="$t('52713abc.c4565a')">
          <el-select
            v-model="params.audit_status"
            :placeholder="$t('52713abc.a7dd1f')"
            class="input-m"
          >
            <el-option
              v-for="(item, index) in approveStatusList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="merchant_name" :label="$t('52713abc.a1b85f')">
          <el-input v-model="params.merchant_name" :placeholder="$t('52713abc.02cc4f')" clearable />
        </SpFilterFormItem>
        <SpFilterFormItem prop="regions_value" :label="$t('52713abc.60b13d')">
          <el-cascader
            v-model="params.regions_value"
            :placeholder="$t('52713abc.491f74')"
            :options="regions"
            filterable
            clearable
            :props="{ checkStrictly: true }"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="settled_type" :label="$t('52713abc.b7785f')">
          <el-select v-model="params.settled_type" :placeholder="$t('52713abc.708c9d')">
            <el-option :label="$t('52713abc.04c9e3')" value="enterprise" />
            <el-option :label="$t('52713abc.a41061')" value="soletrader" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="time_start" :label="$t('52713abc.cb535c')">
          <el-date-picker
            v-model="params.time_start"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            :start-placeholder="$t('52713abc.b44c0f')"
            :end-placeholder="$t('52713abc.1d468b')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-card v-if="tableList.length > 0" shadow="never">
        <div v-for="item in tableList" :key="item.id" class="cus-list">
          <el-row class="cus-row">
            <!-- <el-col :span="3">
              <img
                v-if="item.settled_type === 'soletrader'"
                class="cus-row-img"
                style="width: 90px; height: 90px"
                src="@/assets/img/adapay/distributor.png"
                alt=""
              >
              <img
                v-else
                class="cus-row-img"
                src="@/assets/img/adapay/dealer.png"
                alt=""
              >
            </el-col> -->
            <el-col :span="13">
              <router-link
                :to="{
                  path: matchRoutePath('verify'),
                  query: { type: 'verify', merchantId: item.id }
                }"
              >
                <span class="cus-row-name">{{ item.merchant_name }}</span>
              </router-link>
              <div class="cus-row-time">
                <span
                  >{{ $t('52713abc.402d96')
                  }}{{ item.created ? createTimeFilter(item.created) : '-' }}</span
                >
                <span
                  >{{ $t('52713abc.801525')
                  }}{{ item.province + '-' + item.city + '-' + item.area || '-' }}</span
                >
              </div>
            </el-col>
            <el-col :span="5">
              <img
                v-if="item.audit_status === '2'"
                src="@/assets/img/adapay/pass.png"
                alt=""
                style="width: 85px; height: 85px"
              >
              <img
                v-if="item.audit_status === '3'"
                src="@/assets/img/adapay/reject.png"
                alt=""
                style="width: 92px; height: 92px"
              >
            </el-col>
            <el-col class="cus-row-btn" :span="3" :offset="item.audit_status !== '1' ? 0 : 5">
              <router-link
                v-if="item.audit_status === '1'"
                :to="{
                  path: matchRoutePath('verify'),
                  query: { type: 'verify', merchantId: item.id }
                }"
              >
                <el-button type="primary"> {{ $t('52713abc.0273ba') }} </el-button>
              </router-link>
              <el-button v-else type="info" plain disabled> {{ $t('52713abc.618acb') }} </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="page.pageIndex"
            :page-sizes="[10, 20, 50]"
            :total="page.total"
            :page-size="page.pageSize"
            @current-change="onCurrentChange"
            @size-change="onSizeChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import district from '@/common/district.json'
import mixin, { pageMixin } from '@/mixins'
import { i18n } from '@/i18n'
export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      audit_status: undefined,
      merchant_name: undefined,
      regions_value: [],
      settled_type: undefined,
      time_start: undefined
    }
    return {
      initialParams,
      params: { ...initialParams },
      regions: district,
      loading: true,
      approveStatusList: [
        { name: i18n.t('52713abc.b0bf01'), value: '1' },
        { name: i18n.t('52713abc.23c1f3'), value: '2' },
        { name: i18n.t('52713abc.325254'), value: '3' }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
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
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    regionChangeSearch(value) {
      var vals = this.getCascaderObj(value, this.regions)
      let currentArea = {}
      if (vals.length == 1) {
        currentArea.province = vals[0].label
      } else if (vals.length == 2) {
        currentArea.province = vals[0].label
        currentArea.city = vals[1].label
      } else if (vals.length == 3) {
        currentArea.province = vals[0].label
        currentArea.city = vals[1].label
        currentArea.area = vals[2].label
      }
      return currentArea
    },
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
    getParams() {
      let area = {}
      if (this.params.regions_value.length > 0) {
        area = this.regionChangeSearch(this.params.regions_value)
      }
      let params = {
        ...this.params,
        regions_value: [],
        ...area
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize: page_size } = this.page
      let params = {
        page,
        page_size,
        ...this.getParams()
      }
      const { list, count } = await this.$api.mall_marketing.getApplicationListForMerchantEntry(
        params
      )
      this.tableList = list
      this.page.total = count
      this.loading = false
    },

    createTimeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('verify') === -1) {
      this.fetchList()
    }
  }
}
</script>
<style lang="scss" scoped>
.cus-list {
  .cus-row {
    border: 1px solid #ccc;
    padding: 10px;
    color: #222;
    margin-bottom: 20px !important;
    &-img {
      width: 90px;
      height: 90px;
    }
    &-name {
      font-size: 20px;
      font-weight: bold;
    }
    &-time {
      margin-top: 30px;
      :nth-child(2) {
        margin-left: 60px;
      }
    }
    &-btn {
      height: 90px;
      line-height: 90px;
    }
  }
}
.cus-card {
  .el-row {
    margin-bottom: 0 !important;
  }
}
</style>

<style lang="scss">
.merchantVerify {
  .input-m {
    width: 90% !important;
  }
}
</style>
