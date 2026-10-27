<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('approve') === -1">
      <el-card class="cus-card">
        <el-form ref="myForm" :model="params" label-width="80px">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('f07e83f6.d352ae')">
                <el-select
                  v-model="params.status"
                  :placeholder="$t('f07e83f6.a7dd1f')"
                  class="input-m"
                >
                  <el-option
                    v-for="(item, index) in approveStatusList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('f07e83f6.e6f169')">
                <el-input
                  v-model="params.user_name"
                  class="input-m"
                  :placeholder="$t('f07e83f6.02cc4f')"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item :label="$t('f07e83f6.4c9c23')">
                <el-date-picker
                  v-model="created"
                  type="daterange"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :start-placeholder="$t('f07e83f6.b44c0f')"
                  :end-placeholder="$t('f07e83f6.1d468b')"
                  @change="dateChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="12" style="text-align: right">
              <el-form-item>
                <el-button type="primary" @click="searchData">
                  {{ $t('f07e83f6.e5f71f') }}
                </el-button>
                <el-button @click="resetForm('myForm')"> {{ $t('f07e83f6.4b9c32') }} </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <div v-for="item in list" :key="item.id" class="cus-list">
          <el-row class="cus-row">
            <el-col :span="3">
              <img
                v-if="item.operator_type === 'distributor'"
                class="cus-row-img"
                src="@/assets/img/adapay/distributor.png"
                alt=""
              />
              <img
                v-if="item.operator_type === 'merchant'"
                class="cus-row-img"
                src="@/assets/img/adapay/dealer.png"
                alt=""
              />
            </el-col>
            <el-col :span="13">
              <router-link :to="{ path: matchRoutePath('approve'), query: { id: item.id } }">
                <span class="cus-row-name">{{ item.user_name }}</span>
              </router-link>
              <div class="cus-row-time">
                <span
                  >{{ $t('f07e83f6.402d96')
                  }}{{ item.created ? createTimeFilter(item.created) : '-' }}</span
                >
                <span>{{ $t('f07e83f6.801525') }}{{ item.address || '-' }}</span>
                <span>
                  {{ $t('f07e83f6.ab1d93') }}
                  <span v-if="item.operator_type === 'supplier'">{{ $t('f07e83f6.bab268') }}</span>
                  <span v-if="item.operator_type === 'distributor'">{{
                    $t('f07e83f6.295713')
                  }}</span>
                  <span v-if="item.operator_type === 'merchant'">{{ $t('f07e83f6.9f1ea3') }}</span>
                </span>
              </div>
            </el-col>
            <el-col :span="5">
              <img
                v-if="item.status === 'APPROVED'"
                src="@/assets/img/adapay/pass.png"
                alt=""
                style="width: 100px; height: 84px"
              />
              <img
                v-if="item.status === 'REJECT'"
                src="@/assets/img/adapay/reject.png"
                alt=""
                style="width: 90px; height: 89px"
              />
            </el-col>
            <el-col class="cus-row-btn" :span="3" :offset="item.status === 'WAIT_APPROVE' ? 5 : 0">
              <router-link
                v-if="item.status === 'WAIT_APPROVE'"
                :to="{ path: matchRoutePath('approve'), query: { id: item.id } }"
              >
                <el-button type="primary"> {{ $t('f07e83f6.0273ba') }} </el-button>
              </router-link>
              <el-button v-else type="info" plain disabled> {{ $t('f07e83f6.618acb') }} </el-button>
            </el-col>
          </el-row>
        </div>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>
    </div>
    <router-view />
  </SpPage>
</template>
<script>
import districtOptions from '@/mixins/districtOptions'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getOpenApprovedList } from '@/api/adapay/dealer'
export default {
  mixins: [districtOptions],
  data() {
    return {
      loading: true,
      regions: [],
      created: '',
      params: {
        page: 1,
        pageSize: 20,
        user_name: '',
        status: '',
        time_star: '',
        time_end: ''
      },
      regions_value: [],
      total_count: 0,
      list: []
    }
  },
  computed: {
    approveStatusList() {
      return [
        { name: this.$t('f07e83f6.a8b0c2'), value: '' },
        { name: this.$t('f07e83f6.b0bf01'), value: 'WAIT_APPROVE' },
        { name: this.$t('f07e83f6.6e6732'), value: 'APPROVED' },
        { name: this.$t('f07e83f6.9a27ff'), value: 'REJECT' }
      ]
    }
  },
  mounted() {
    this.getList(this.params)
  },
  methods: {
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    dateChange(val) {
      if (val.length > 0) {
        this.params.time_star = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.time_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.time_star = ''
        this.params.time_end = ''
      }
      this.params.page = 1
    },
    searchData(e) {
      this.params.page = 1
      this.getList(this.params)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.loading = false
      this.getList(this.params)
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList(this.params)
    },
    getList(params) {
      this.loading = true
      this.$api.bspay.getSubApproveList(params).then((response) => {
        this.list = response.list
        this.total_count = Number(response.total_count)
        this.loading = false
      })
    },
    RegionChangeSearch(value) {
      var vals = this.getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.address = vals[0].label
      } else if (vals.length == 2) {
        this.params.address = vals[0].label + '-' + vals[1].label
      } else if (vals.length == 3) {
        this.params.address = vals[0].label + '-' + vals[1].label + '-' + vals[2].label
      } else {
        this.params.address = ''
      }
      this.params.page = 1
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    createTimeFilter(time) {
      return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss')
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
      font-size: 22px;
      font-weight: bold;
    }
    &-time {
      margin-top: 30px;
      :nth-child(2) {
        margin-left: 60px;
      }
      :nth-child(3) {
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
