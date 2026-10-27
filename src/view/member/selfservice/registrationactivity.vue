<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFormPlus
        ref="searchForm"
        v-model="params"
        form-type="searchForm"
        :inline="true"
        :form-items="searchFormItems"
        @submit="onSearch"
        @reset="onReset"
      />

      <div class="action-container mt-4">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addElement">
          {{ $t('15ecc99b.e8c939') }}
        </el-button>
      </div>

      <el-table v-loading="loading" border :data="tableList" style="width: 100%">
        <el-table-column
          :label="$t('8da83775.2b6bc0')"
          fixed="left"
          :width="IS_DISTRIBUTOR() ? 150 : 250"
        >
          <template slot-scope="scope">
            <el-button
              v-if="
                (scope.row.status === 'ongoing' || scope.row.status === 'waiting') &&
                !IS_DISTRIBUTOR()
              "
              type="text"
              @click="onOperationChange(scope.row, 'edit')"
            >
              {{ $t('15ecc99b.95b351') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'end' || IS_DISTRIBUTOR()"
              type="text"
              @click="onOperationChange(scope.row, 'detail')"
            >
              {{ $t('15ecc99b.607e7a') }}
            </el-button>
            <el-button
              v-if="scope.row.status === 'waiting' && !IS_DISTRIBUTOR()"
              type="text"
              @click="onStopChange(scope.row)"
            >
              {{ $t('15ecc99b.ff6c6a') }}
            </el-button>
            <el-button type="text" @click="onOperationChange(scope.row, 'record')">
              {{ $t('15ecc99b.42a5b5') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('5cceb5ec.ae57b1')" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_show"
              :active-value="1"
              :inactive-value="0"
              :disabled="IS_DISTRIBUTOR()"
              @change="onIsShowChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="activity_id" :label="$t('15ecc99b.c515f3')" width="100" />
        <el-table-column prop="activity_name" :label="$t('15ecc99b.39834b')" width="200" />
        <el-table-column :label="$t('15ecc99b.8c5a3c')" width="120">
          <template slot-scope="scope">
            {{ scope.row.is_offline_verify == 1 ? $t('15ecc99b.0a60ac') : $t('15ecc99b.c9744f') }}
          </template>
        </el-table-column>
        <el-table-column prop="gift_points" :label="$t('15ecc99b.c07abe')" width="120" />
        <el-table-column :label="$t('15ecc99b.ac7bd3')" width="120">
          <template slot-scope="scope">
            {{ scope.row.is_white_list == 1 ? $t('15ecc99b.0a60ac') : $t('15ecc99b.c9744f') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('15ecc99b.c799f5')" width="300">
          <template slot-scope="scope">
            {{ scope.row.start_date }} ~ {{ scope.row.end_date }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('15ecc99b.a06b35')" width="120">
          <template slot-scope="scope">
            {{ scope.row.total_join_num || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status_name" :label="$t('15ecc99b.3fea7c')" width="120" />
        <el-table-column prop="distributor_name" :label="$t('15ecc99b.295713')" width="120" />
      </el-table>
      <div class="content-center content-top-padded">
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
      <EnterpriseDialog
        :visible.sync="dialogVisible"
        :data="dialogData"
        @closeDialog="closeDialog"
      />
    </SpRouterView>
  </SpPage>
</template>
<script>
import mixin, { pageMixin } from '@/mixins'
import { IS_DISTRIBUTOR } from '@/utils'
import { regActivityInvalid } from '@/api/selfhelpform'
import EnterpriseDialog from './components/enterpriseDialog'
export default {
  components: {
    EnterpriseDialog
  },
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      field_title: '',
      status: '',
      create_time: [],
      distributor_id: ''
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      loading: false,
      statusOption: [
        { nameKey: 'ac2a6290.a8b0c2', value: '' },
        { nameKey: '15ecc99b.1568ba', value: 'waiting' },
        { nameKey: '15ecc99b.fb852f', value: 'ongoing' },
        { nameKey: '15ecc99b.047fab', value: 'end' }
      ],
      shopList: [],
      dialogData: {},
      dialogVisible: false
    }
  },
  computed: {
    searchFormItems() {
      return [
        {
          fieldName: 'field_title',
          label: this.$t('15ecc99b.39834b'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('15ecc99b.39834b'),
            clearable: true
          }
        },
        {
          fieldName: 'status',
          label: this.$t('15ecc99b.3fea7c'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('15ecc99b.3fea7c'),
            options: this.statusOption.map((item) => ({
              label: this.$t(item.nameKey),
              value: item.value
            }))
          }
        },
        {
          fieldName: 'distributor_id',
          label: this.$t('6b57cb80.4de1b7'),
          cellWidth: 1.3,
          component: ({ h, value, onInput }) => {
            return h('SpSelectShop', {
              props: {
                value,
                clearable: true,
                size: 'small',
                placeholder: this.$t('ac2a6290.708c9d')
              },
              on: {
                input: onInput
              }
            })
          }
        },
        {
          fieldName: 'create_time',
          label: this.$t('6b57cb80.374856'),
          cellWidth: 2,
          component: ({ h, value, onInput }) => {
            return h('el-date-picker', {
              props: {
                value: value || [],
                type: 'daterange',
                valueFormat: 'yyyy/MM/dd',
                clearable: true,
                size: 'small',
                startPlaceholder: this.$t('6b57cb80.e08045'),
                endPlaceholder: this.$t('6b57cb80.e08045')
              },
              on: {
                input: (val) => onInput(val || [])
              }
            })
          }
        }
      ]
    }
  },
  watch: {},
  mounted() {
    this.fetchList()
    this.getStoreList()
  },
  methods: {
    addElement() {
      // 添加商品
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
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
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (Array.isArray(create_time) && create_time.length >= 2) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 00:00:00')
      }
      let params = {
        ...this.params,
        create_time: [],
        ...time
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.regActivityList(params)
      this.tableList = (list || []).map((item) => ({
        ...item,
        is_show: item.is_show === false || item.is_show === 0 || item.is_show === '0' ? 0 : 1
      }))
      this.page.total = total_count
      this.loading = false
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    async getStoreList() {
      let params = { page: 1, pageSize: 500 }
      const { list } = await this.$api.marketing.getDistributorList(params)
      if (list) {
        list.forEach((row) => {
          this.shopList.push({ value: row.name, distributor_id: row.distributor_id })
        })
      }
    },
    // TODO:路由跳转
    onOperationChange(row, type) {
      if (type == 'edit') {
        this.$router.push({
          path: this.matchRoutePath('editor'),
          query: { id: row.activity_id, type: 'edit' }
        })
      } else if (type == 'detail') {
        this.$router.push({
          path: this.matchRoutePath('editor'),
          query: { id: row.activity_id, type: 'detail' }
        })
      } else if (type == 'record') {
        this.$router.push({
          path:
            (IS_DISTRIBUTOR() ? `/shopadmin` : '') + `/marketing/activity-apply/activity-record`,
          query: { id: row.activity_id }
        })
      }
    },
    onStopChange(row) {
      this.$confirm(this.$t('15ecc99b.01be42'), this.$t('8da83775.02d981'), {
        cancelButtonText: this.$t('8da83775.625fb2'),
        confirmButtonText: this.$t('8da83775.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            regActivityInvalid({ activity_id: row.activity_id }).then((res) => {
              this.fetchList()
              this.$message({
                message: this.$t('15ecc99b.69be67'),
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    async onIsShowChange(row) {
      const nextValue = row.is_show
      try {
        await this.$api.selfhelpform.regActivitySetIsShow({
          activity_id: row.activity_id,
          is_show: nextValue
        })
        this.$message.success(this.$t('15ecc99b.69be67'))
        this.fetchList()
      } catch (e) {
        row.is_show = nextValue === 1 ? 0 : 1
      }
    },
    onShowChange(row) {
      this.dialogData = row
      this.closeDialog(true)
    },
    closeDialog(visible) {
      this.dialogVisible = visible
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  img {
    width: 90%;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 10px;

  img {
    width: 90%;
  }
}

.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}

.service-label .el-checkbox:first-child {
  margin-left: 15px;
}

.service-label .el-input:first-child {
  margin-left: 15px;
}

.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}

.el-carousel {
  width: 375px;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }

  img {
    width: 100%;
  }
}

.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
