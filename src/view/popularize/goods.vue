<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="content-bottom-padded">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="keywords" :label="$t('9b2edf88.1fd1d5')">
          <el-input
            v-model="params.keywords"
            style="width: 100%"
            size="mini"
            :placeholder="$t('9b2edf88.d83187')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="status" :label="$t('9b2edf88.3fea7c')">
          <el-select v-model="status" size="mini" clearable :placeholder="$t('9b2edf88.708c9d')">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>
      <div class="action-container">
        <el-button type="primary" size="mini" @click="showChangeRebateType()">
          {{ $t('9b2edf88.56a8e1') }}
        </el-button>
        <el-button size="mini" @click="handleBatchChangeStatus()">
          {{ $t('9b2edf88.a34edb') }}
        </el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.name"
        :name="item.activeName"
      >
        <el-table
          ref="multipleItemsTable"
          v-loading="loading"
          :data="itemsList"
          style="width: 100%"
          :height="wheight - 240"
          @selection-change="handleItemsSelectionChange"
          @filter-change="filterHandler"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('9b2edf88.2b6bc0')" width="160">
            <template slot-scope="scope">
              <el-button type="text" class="btn-gap" @click="handleRebateConf(scope.row, 1)">
                {{ $t('9b2edf88.ce2557') }}
              </el-button>
              <el-button type="text" class="btn-gap" @click="handleRebateConf(scope.row, 2)">
                {{ $t('9b2edf88.777d86') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('9b2edf88.080a81')"
            width="160"
            column-key="rebate"
            :filter-multiple="false"
          >
            <template slot-scope="scope">
              <div v-if="allSelect && $store.getters.login_type != 'distributor'">
                <el-switch v-model="allSelect" active-color="#13ce66" disabled />
              </div>
              <div v-else>
                <el-tag v-if="scope.row.rebate_audit === 2" size="mini">
                  {{ $t('9b2edf88.f6324c') }}
                </el-tag>
                <el-tag v-if="scope.row.rebate_audit === 3" size="mini" type="warning">
                  {{ $t('9b2edf88.146bb2') }}
                </el-tag>
                <el-switch
                  v-if="
                    scope.row.rebate_audit === 2 ||
                    (scope.row.rebate_audit === 1 && $store.getters.login_type == 'distributor')
                  "
                  v-model="scope.row.rebate"
                  disabled
                  active-color="#13ce66"
                  @change="switchStatusChange(scope.row)"
                />
                <el-switch
                  v-else
                  v-model="scope.row.rebate"
                  active-color="#13ce66"
                  @change="switchStatusChange(scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.9b94b1')" width="80">
            <template slot-scope="scope">
              <el-avatar shape="square" :size="60" fit="fit" :src="scope.row.pics[0]" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.32c65d')" prop="item_name" min-width="250" />
          <el-table-column :label="$t('9b2edf88.e29575')">
            <template slot-scope="scope">
              {{ scope.row.price / 100 }}{{ $t('9b2edf88.c16655') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.2e2ce2')">
            <template slot-scope="scope">
              {{ scope.row.cost_price / 100 }}{{ $t('9b2edf88.c16655') }}
            </template>
          </el-table-column>
          <el-table-column prop="store" :label="$t('9b2edf88.0eac88')" width="80" />
          <el-table-column prop="approve_status" :label="$t('9b2edf88.3fea7c')" min-width="100">
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.approve_status === 'onsale'"
                type="success"
                class="grid-content"
              >
                {{ $t('9b2edf88.9b7481') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.approve_status === 'offline_sale'"
                type="info"
                class="grid-content"
              >
                {{ $t('9b2edf88.2c50a0') }}
              </el-tag>
              <el-tag v-else type="danger" class="grid-content">
                {{ $t('9b2edf88.ae83a3') }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="params.page"
            :page-sizes="[10, 20, 50]"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
    <SideBar :visible.sync="show_task_sideBar" :title="$t('9b2edf88.6f4e7f')" width="67">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">{{ current.item_name }}</span>
          <span>
            <el-alert
              :title="alertTip.title"
              :description="alertTip.description"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
        </div>
        <el-radio-group v-model="current.rebate_type">
          <el-radio label="default"> {{ $t('9b2edf88.10c57a') }} </el-radio>
          <el-radio label="total_money"> {{ $t('9b2edf88.a83e85') }} </el-radio>
          <el-radio label="total_num"> {{ $t('9b2edf88.f80e33') }} </el-radio>
        </el-radio-group>
      </el-card>
      <el-card v-if="current.rebate_type != 'default'" class="box-card">
        <el-table :data="rebateSpecItems">
          <el-table-column :label="$t('9b2edf88.ea887b')" prop="item_spec_desc" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span
              ><span v-else>{{ $t('9b2edf88.048df4') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.e29575')" min-width="80">
            <template slot-scope="scope"> ¥{{ scope.row.price / 100 }} </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.2e2ce2')" min-width="80">
            <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
          </el-table-column>
          <el-table-column
            v-for="(item, key) in floorHead"
            :key="key"
            :label="item.label"
            min-width="120"
          >
            <template slot-scope="scope">
              {{ $t('9b2edf88.a319c8') }}
              <el-input
                v-model="scope.row.rebate_conf.rebate_task[key].filter"
                :min="0"
                size="mini"
                type="number"
                @input="changeLimit(arguments[0], key, scope.row)"
              />

              {{ $t('9b2edf88.aac01c') }}
              <el-input
                v-if="scope.row.rebate_conf.rebate_task_type == 'money'"
                v-model="scope.row.rebate_conf.rebate_task[key].money"
                size="mini"
                type="number"
                suffix-icon="iconfont icon-yen-sign"
              />
              <el-input
                v-else
                v-model="scope.row.rebate_conf.rebate_task[key].ratio"
                size="mini"
                type="number"
                suffix-icon="iconfont icon-percent"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer">
        <el-button type="primary" :loading="submitLoading" @click="saveRebateConf">
          {{ $t('9b2edf88.be5fbb') }}
        </el-button>
      </div>
    </SideBar>
    <SideBar :visible.sync="show_sideBar" :title="$t('9b2edf88.dd803e')" width="67">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="title">{{ current.item_name }}</span>
          <div class="frm-tips">
            {{ $t('9b2edf88.7f3302') }}
          </div>
          <span
            v-if="
              popularizeSetting.popularize_ratio.type == 'profit' &&
              popularizeSetting.commission_type == 'money'
            "
          >
            <el-alert
              :title="$t('9b2edf88.9202b3')"
              :description="$t('9b2edf88.196317')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
          <span
            v-else-if="
              popularizeSetting.popularize_ratio.type == 'profit' &&
              popularizeSetting.commission_type == 'point'
            "
          >
            <el-alert
              :title="$t('9b2edf88.9202b3')"
              :description="$t('9b2edf88.94cec5')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
          <span
            v-else-if="
              popularizeSetting.popularize_ratio.type == 'order_money' &&
              popularizeSetting.commission_type == 'money'
            "
          >
            <el-alert
              :title="$t('9b2edf88.18e6c2')"
              :description="$t('9b2edf88.a1a270')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
          <span
            v-else-if="
              popularizeSetting.popularize_ratio.type == 'order_money' &&
              popularizeSetting.commission_type == 'point'
            "
          >
            <el-alert
              :title="$t('9b2edf88.18e6c2')"
              :description="$t('9b2edf88.bb5650')"
              type="info"
              close-text=" "
              class="alert-text"
              show-icon
            />
          </span>
        </div>
        <el-table :data="rebateSpecItems">
          <el-table-column :label="$t('9b2edf88.ea887b')" prop="item_spec_desc" min-width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span
              ><span v-else>{{ $t('9b2edf88.048df4') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.e29575')" min-width="80">
            <template slot-scope="scope"> ¥{{ scope.row.price / 100 }} </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.2e2ce2')" min-width="80">
            <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
          </el-table-column>
          <el-table-column :label="$t('9b2edf88.226b09')" width="200">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.rebate_conf.type"
                active-value="money"
                inactive-value="ratio"
                :active-text="$t('9b2edf88.4cf24a')"
                :inactive-text="$t('9b2edf88.150075')"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, key) in popularizeSetting.popularize_ratio.profit"
            :key="key"
            :label="item.name"
            min-width="110"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.rebate_conf.type == 'money'"
                v-model="scope.row.rebate_conf.value[key]"
                type="number"
                size="mini"
                suffix-icon="iconfont icon-yen-sign"
              />
              <el-input
                v-else
                v-model="scope.row.rebate_conf.value[key]"
                size="mini"
                type="number"
                suffix-icon="iconfont icon-percent"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="footer">
        <el-button type="primary" :loading="submitLoading" @click="saveRebateConf">
          {{ $t('9b2edf88.be5fbb') }}
        </el-button>
      </div>
    </SideBar>
    <el-dialog :title="$t('9b2edf88.9cff51')" :visible.sync="changeRebateTypeVisible" width="30%">
      <el-radio-group v-model="changeRebateType">
        <el-radio label="default"> {{ $t('9b2edf88.10c57a') }} </el-radio>
        <el-radio label="total_money"> {{ $t('9b2edf88.a83e85') }} </el-radio>
        <el-radio label="total_num"> {{ $t('9b2edf88.f80e33') }} </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeRebateTypeVisible = false">{{ $t('9b2edf88.c08ab9') }}</el-button>
        <el-button type="primary" @click="handleBatchChange">{{ $t('9b2edf88.aa7527') }}</el-button>
      </span>
    </el-dialog>
  </SpPage>
</template>
<script>
import axios from 'axios'
import store from '@/store'
import { mapGetters } from 'vuex'
import SideBar from '@/components/element/sideBar'
import { getPopularizeSetting } from '../../api/promotions'
import { getItemsList, updateItemRebateConf, updateGoodsInfo } from '@/api/goods'

let changeRebateTypeMapKeys = {
  default: { titleKey: '9b2edf88.ad8d43', descriptionKey: '' },
  total_money: { titleKey: '9b2edf88.ee517d', descriptionKey: '9b2edf88.752195' },
  total_num: { titleKey: '9b2edf88.d94c15', descriptionKey: '9b2edf88.3de416' }
}

export default {
  components: {
    SideBar
  },
  data() {
    return {
      changeRebateType: 'default',
      changeRebateTypeVisible: false,
      current: {},
      selectGoodsIds: [],
      rebateSpecItems: [],
      show_sideBar: false,
      show_task_sideBar: false,
      activeName: 'first',
      submitLoading: false,
      allSelect: false,
      total_count: 0,
      loading: false,
      itemsList: [],
      params: {
        item_type: 'normal',
        page: 1,
        pageSize: 10,
        keywords: ''
      },
      popularizeSetting: {
        popularize_ratio: {
          type: 'profit'
        }
      },
      status: '',
      alertTip: {
        title: '',
        description: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tabList() {
      return [
        { name: this.$t('9b2edf88.d2fec2'), value: null, activeName: 'first' },
        { name: this.$t('9b2edf88.10c57a'), value: 'true', activeName: 'default' },
        { name: this.$t('9b2edf88.a83e85'), value: 'true', activeName: 'total_money' },
        { name: this.$t('9b2edf88.f80e33'), value: 'true', activeName: 'total_num' }
      ]
    },
    floorHead() {
      return [
        { label: this.$t('9b2edf88.e53617'), property: 'name' },
        { label: this.$t('9b2edf88.e70156'), property: 'name' },
        { label: this.$t('9b2edf88.402cdf'), property: 'name' }
      ]
    },
    statusOptions() {
      return [
        { value: 1, label: this.$t('9b2edf88.7854b5') },
        { value: 2, label: this.$t('9b2edf88.463776') }
      ]
    }
  },
  watch: {
    status: {
      handler: function (val) {
        this.getGoodsList(val)
      }
    },
    'current.rebate_type': {
      handler: function (val) {
        val = val ? val : 'default'
        const keys = changeRebateTypeMapKeys[val]
        this.alertTip = {
          title: keys.titleKey ? this.$t(keys.titleKey) : '',
          description: keys.descriptionKey ? this.$t(keys.descriptionKey) : ''
        }
      },
      immediate: true
    }
  },
  mounted() {
    getPopularizeSetting().then((res) => {
      this.popularizeSetting = res.data.data
      if (res.data.data.goods == 'all') {
        this.allSelect = true
      } else {
        this.allSelect = false
      }
      this.getGoodsList()
    })
  },
  methods: {
    handleChangeRebate: function (e) {
      console.log('===', e)
    },
    filterHandler(filters) {
      this.params.page = 1
      this.params.rebate = filters.rebate[0]
      this.getGoodsList()
    },
    handleClick() {
      if (this.activeName != 'first') {
        this.params.rebate_type = this.activeName
      } else {
        this.params.rebate_type = ''
      }
      this.params.page = 1
      this.getGoodsList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleItemsSelectionChange(val) {
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.selectGoodsIds = goods_id
    },
    showChangeRebateType() {
      if (this.selectGoodsIds.lenght == 0) {
        this.$message({
          type: 'success',
          message: this.$t('9b2edf88.9598b5')
        })
      } else {
        this.changeRebateTypeVisible = true
        this.changeRebateType = this.activeName
      }
    },
    onSearch() {
      this.params.page = 1
      this.getGoodsList()
    },
    onReset() {
      this.params = {
        item_type: 'normal',
        page: 1,
        keywords: ''
      }
      this.getGoodsList()
    },
    switchStatusChange(data) {
      var rebate = data.rebate ? 1 : 0
      updateGoodsInfo({ goods_id: data.goods_id, rebate: rebate }).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('9b2edf88.33130f')
        })
        this.getGoodsList()
      })
    },
    handleBatchChangeStatus() {
      console.log('====handleBatchChangeStatus===>', this.selectGoodsIds)
      if (this.selectGoodsIds.length == 0) {
        this.$message({
          type: 'success',
          message: this.$t('9b2edf88.9598b5')
        })
      } else {
        updateGoodsInfo({ goods_id: this.selectGoodsIds, rebate: 1 }).then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('9b2edf88.33130f')
          })
          this.getGoodsList()
        })
      }
    },
    handleBatchChange() {
      // console.log(rebate_task)
      if (this.selectGoodsIds.length == 0) {
        this.$message({
          type: 'success',
          message: this.$t('9b2edf88.9598b5')
        })
        this.changeRebateTypeVisible = false
      } else {
        updateGoodsInfo({ goods_id: this.selectGoodsIds, rebate_type: this.changeRebateType }).then(
          (res) => {
            this.$message({
              type: 'success',
              message: this.$t('9b2edf88.33130f')
            })
            this.changeRebateTypeVisible = false
            this.getGoodsList()
          }
        )
      }
    },
    saveRebateConf() {
      console.log(this.current.rebate_type)
      var rebateConf = []
      var firstMoney, firstFilter
      var rebateTask = []
      this.rebateSpecItems.forEach((item) => {
        var rebate_conf = item.rebate_conf
        rebate_conf.ratio_type = this.popularizeSetting.popularize_ratio.type
        firstMoney = rebate_conf.rebate_task[0].money
        firstFilter = rebate_conf.rebate_task[0].filter
        rebateTask = rebate_conf.rebate_task

        rebateConf.push(rebate_conf)
      })
      var errorMsg = ''
      var succCount = 0
      rebateTask.forEach((item, index) => {
        if (item.money != '' && item.filter != '') {
          succCount++
        }
      })
      rebateTask.forEach((item, index) => {
        if (succCount > 0) {
          if ((item.money != '' && item.filter == '') || (item.money == '' && item.filter != '')) {
            errorMsg = '满足条件或返佣金额不能为空'
          }
        }
        // else{
        //   if(item.money == '' || item.filter == ''){
        //     debugger
        //     errorMsg = '满足条件或返佣金额不能为空'
        //   }
        // }
      })
      if (this.current.rebate_type != 'default') {
        if (errorMsg != '') {
          this.$message({
            type: 'error',
            message: this.$t('9b2edf88.128659')
          })
          return
        }
      }

      updateItemRebateConf({
        rebateConf: JSON.stringify(rebateConf),
        rebate_type: this.current.rebate_type
      }).then((res) => {
        this.$message({ message: this.$t('9b2edf88.3b1083'), type: 'success', duration: 2 * 1000 })
      })
    },
    handleRebateConf(data, type) {
      if (type == 1) {
        this.show_sideBar = true
        this.show_task_sideBar = false
      } else {
        this.show_sideBar = false
        this.show_task_sideBar = true
      }
      this.current = data
      getItemsList({
        page: 1,
        pageSize: 1000,
        is_sku: true,
        item_id: data.item_id,
        item_type: 'normal'
      }).then((res) => {
        var rebateSpecItems = []
        res.data.data.list.forEach((item) => {
          if (!item.rebate_conf) {
            item.rebate_conf = {}
            item.rebate_conf.type = 'money'
            item.rebate_conf.rebate_task_type = 'money'
            item.rebate_conf.value = {}
            for (var key in this.popularizeSetting.popularize_ratio.profit) {
              item.rebate_conf.value[key] = ''
            }
          } else {
            if (
              this.popularizeSetting.popularize_ratio.type != item.rebate_conf.ratio_type &&
              item.rebate_conf.type != 'money'
            ) {
              for (var key in this.popularizeSetting.popularize_ratio.profit) {
                item.rebate_conf.value[key] = ''
              }
            }
          }

          if (!item.rebate_conf.rebate_task) {
            item.rebate_conf.rebate_task = []
            for (var n in [0, 1, 2]) {
              item.rebate_conf.rebate_task[n] = {}
              item.rebate_conf.rebate_task[n].filter = ''
              item.rebate_conf.rebate_task[n].ratio = ''
              item.rebate_conf.rebate_task[n].money = ''
            }
          }

          item.rebate_conf.item_id = item.item_id
          rebateSpecItems.push(item)
        })
        this.rebateSpecItems = rebateSpecItems
      })
    },
    getGoodsList(status) {
      this.loading = true
      if (status === 1 || status === 2 || !status) {
        this.params.rebate = status ? (status === 1 ? 1 : 0) : undefined
      }
      getItemsList(this.params).then((response) => {
        this.itemsList = response.data.data.list
        this.itemsList.forEach((item) => {
          item.rebate_audit = ''
          item.rebate_audit = item.rebate
          item.rebate = item.rebate === '1' ? true : false
        })
        console.log(this.itemsList)
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },

    nextChange(value, key, row) {
      let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
      // 下一个的值
      let next = this.rebateSpecItems[index].rebate_conf.rebate_task[key + 1].filter
      if (next <= Number(value)) {
        row.rebate_conf.rebate_task[key + 1].filter = Number(value) + 1
        this.$nextTick(() => {
          row.rebate_conf.rebate_task[key + 1].filter = Number(value) + 1
        })
      }
    },

    // 变更限制
    changeLimit(value, key, row) {
      console.log(value, key, row, '当前数据')
      console.log(this.rebateSpecItems, '列表的数据')
      // 限制后级的最小值要大于上级
      if (key > 0) {
        let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
        // 上一个的值
        let last = this.rebateSpecItems[index].rebate_conf.rebate_task[key - 1].filter
        if (last !== '') {
          row.rebate_conf.rebate_task[key].filter = Number(value)
          this.$nextTick(() => {
            let newVal = Math.max(Number(value), Number(last) + 1)
            row.rebate_conf.rebate_task[key].filter = Number(newVal)
          })
        }
      }
      // 变更上级，下级小于等于上级时自动+1
      if (key === 0) {
        this.nextChange(value, 0, row)
        let index = this.rebateSpecItems.findIndex((v) => v.itemId === row.itemId)
        let nextValue = this.rebateSpecItems[index].rebate_conf.rebate_task[1].filter
        this.nextChange(nextValue, 1, row)
      } else if (key === 1) {
        this.nextChange(value, key, row)
      }
    }
  }
}
</script>
