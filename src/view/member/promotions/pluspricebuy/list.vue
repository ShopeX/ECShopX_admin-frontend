<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
.operating-icons {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  white-space: nowrap;
}
.pluspricebuy-waiting-actions {
  display: inline-flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  margin-left: 6px;
  vertical-align: middle;
}
.pluspricebuy-waiting-actions > i {
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}
</style>

<template>
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="create_time" :label="$t('ff141a64.374856')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('ff141a64.e08045')"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_type" :label="$t('ff141a64.a852ea')">
          <el-select v-model="params.item_type" :placeholder="$t('ff141a64.2af133')">
            <el-option :label="$t('ff141a64.a8b0c2')" value="0" />
            <el-option :label="$t('ff141a64.fcd4d7')" value="service" />
            <el-option :label="$t('ff141a64.ddf672')" value="normal" />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          {{ $t('ff141a64.47907d') }}
        </el-button>
      </div>

      <el-tabs v-model="params.status" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table
            v-loading="loading"
            :data="tableList"
            style="width: 100%"
            :height="wheight - 190"
            border
            :element-loading-text="$t('ff141a64.f09b12')"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item :label="$t('ff141a64.6dbb6f')">
                    <el-tag v-for="(item, index) in scope.row.member_grade" :key="index">
                      {{ item }}
                    </el-tag>
                  </el-form-item>
                  <el-form-item :label="$t('ff141a64.eca37c')">
                    <span>{{ scope.row.created_date }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('ff141a64.409ea3')">
                    <div v-for="(item, index) in scope.row.items" :key="index">
                      {{ item.item_name }}
                    </div>
                  </el-form-item>
                  <el-form-item v-if="scope.row.source_id == '0'" :label="$t('ff141a64.eb4307')">
                    <span v-if="scope.row.use_shop">
                      <div v-for="(item, index) in scope.row.shops" :key="index">
                        {{ item.shop_name }}
                      </div>
                    </span>
                    <span v-else>
                      <div>{{ $t('ff141a64.77678b') }}</div>
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="marketing_id" width="60" :label="$t('ff141a64.c515f3')" />
            <el-table-column prop="marketing_name" min-width="150" :label="$t('ff141a64.9cc7a7')" />
            <el-table-column prop="source_name" :label="$t('ff141a64.295713')" />
            <el-table-column :label="$t('ff141a64.b0fae0')" min-width="150">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.condition_value" :key="index">
                  <span v-if="scope.row.condition_type == 'quantity'">
                    {{ $t('ff141a64.13dc43') }}{{ item.full }}{{ $t('ff141a64.f7edf5') }},{{
                      $t('ff141a64.54e654')
                    }}(<el-button type="text" @click="viewGiftItemList(scope.row)">{{
                      $t('ff141a64.81459a')
                    }}</el-button
                    >)
                  </span>
                  <span v-if="scope.row.condition_type == 'totalfee'">
                    {{ $t('ff141a64.13dc43') }}{{ item.full }}{{ $t('ff141a64.c16655') }},{{
                      $t('ff141a64.54e654')
                    }}(<el-button type="text" @click="viewGiftItemList(scope.row)">{{
                      $t('ff141a64.81459a')
                    }}</el-button
                    >)
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="used_platform" min-width="100" :label="$t('ff141a64.b90304')">
              <template slot-scope="scope">
                <span v-if="scope.row.used_platform == 0">{{ $t('ff141a64.6e78ce') }}</span>
                <span v-if="scope.row.used_platform == 1">{{ $t('ff141a64.bb114a') }}</span>
                <span v-if="scope.row.used_platform == 2">{{ $t('ff141a64.3fea7c') }}</span>
                <span v-if="scope.row.used_platform == 3">{{ $t('ff141a64.fb852f') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_fee" min-width="150" :label="$t('ff141a64.dd4e55')">
              <template slot-scope="scope">
                <div>{{ scope.row.start_date }}</div>
                <div>~{{ scope.row.end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="70" :label="$t('ff141a64.047fab')">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'ongoing'">{{ $t('ff141a64.2b6bc0') }}</span>
                <span v-if="scope.row.status == 'waiting'">{{ $t('ff141a64.f13684') }}</span>
                <span v-if="scope.row.status == 'end'">{{ $t('ff141a64.ff6c6a') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('ff141a64.5b48db')" min-width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button type="text" @click="viewItemList(scope.row.marketing_id)">
                    {{ $t('ff141a64.0becf0') }}
                  </el-button>
                  <el-button
                    v-if="endActionVisible(scope.row)"
                    type="text"
                    @click="updateStatusCommunityAction(scope.row)"
                  >
                    {{ $t('ff141a64.6489ff') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status != 'waiting'"
                    type="text"
                    @click="viewDetail(scope.row)"
                  >
                    {{ $t('ff141a64.3ae7e4') }}
                  </el-button>
                  <span
                    v-if="scope.row.status == 'waiting'"
                    class="pluspricebuy-waiting-actions"
                  >
                    <i
                      class="el-icon-edit-outline"
                      @click="editActivityAction(scope.$index, scope.row)"
                    />
                    <i class="el-icon-delete" @click="deleteActivityAction(scope.row)" />
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="page.total > page.pageSize" class="mt-4 text-right">
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
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="$t('ff141a64.d43d09')"
        :visible.sync="activityItemDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="ItemLoading" :data="activityItemListsData">
            <el-table-column prop="item_id" label="id" width="60" />
            <el-table-column prop="pics[0]" :label="$t('ff141a64.20def7')" width="80">
              <template slot-scope="scope">
                <img :src="wximageurl + scope.row.pics[0]" width="50" height="50" />
              </template>
            </el-table-column>
            <el-table-column prop="item_name" :label="$t('ff141a64.d7ec2d')" />
            <el-table-column prop="price" :label="$t('ff141a64.0e9fd9')" width="100">
              <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.price / 100 }} </template>
            </el-table-column>
            <el-table-column prop="store" :label="$t('ff141a64.0eac88')" width="70" />
          </el-table>
          <div
            v-if="activityItemTotalCount > activityItemParams.pageSize"
            class="content-center content-top-padded"
          >
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="activityItemParams.page"
              :total="activityItemTotalCount"
              :page-size="activityItemParams.pageSize"
              @current-change="handleGoodsCurrentChange"
            />
          </div>
        </template>
      </el-dialog>
      <el-dialog
        :title="$t('ff141a64.f7d8de')"
        :visible.sync="purchaseRulesDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="ItemLoading" :data="purchaseRules">
            <el-table-column prop="price" :label="$t('ff141a64.d7abf8')" width="100">
              <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
            </el-table-column>
            <el-table-column prop="pics[0]" :label="$t('ff141a64.696d24')">
              <template slot-scope="scope">
                <div v-for="(newitem, index) in scope.row.gift_item" :key="index">
                  {{ newitem.item_name }} x {{ newitem.gift_num }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-dialog>
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getMarketingActivityItemList, removeMarketingActivity } from '@/api/promotions'
import shopSelect from '@/components/shopSelect'
import mixin, { pageMixin } from '@/mixins'

export default {
  components: {
    shopSelect
  },
  mixins: [mixin, pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      create_time: [],
      status: 'all',
      marketing_type: 'plus_price_buy',
      item_type: '0'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      cursymbol: '￥',
      loading: false,
      activityItemParams: {
        page: 1,
        pageSize: 20
      },
      activityItemTotalCount: 0,
      activityItemListsData: [],
      activityItemDialog: false,
      purchaseRulesDialog: false,
      ItemLoading: false,
      purchaseRules: []
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tabList() {
      return [
        { name: this.$t('ff141a64.a8b0c2'), activeName: 'all' },
        { name: this.$t('ff141a64.1568ba'), activeName: 'waiting' },
        { name: this.$t('ff141a64.2b6bc0'), activeName: 'ongoing' },
        { name: this.$t('ff141a64.ff6c6a'), activeName: 'end' }
      ]
    }
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
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    endActionVisible({ status, source_id }) {
      if (status != 'end') {
        if (this.IS_ADMIN() && source_id == '0') {
          return true
        }
        if (this.IS_DISTRIBUTOR()) {
          return true
        }
      }
      return false
    },
    getParams() {
      const time = {}
      const create_time = this.params.create_time
      if (create_time && create_time.length > 0) {
        time.start_time = this.dateStrToTimeStamp(create_time[0] + ' 00:00:00')
        time.end_time = this.dateStrToTimeStamp(create_time[1] + ' 23:59:59')
      }
      let params = {
        ...this.params,
        status: this.params.status === 'all' ? undefined : this.params.status,
        item_type: this.params.item_type === '0' ? undefined : this.params.item_type,
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
      const { list, total_count } = await this.$api.promotions.getMarketingActivityList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.fetchList()
    },
    addActivityData() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editActivityAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.marketing_id })
    },
    deleteActivityAction(row) {
      removeMarketingActivity({ marketing_id: row.marketing_id }).then((res) => {
        if (res != undefined && res.data.data.status) {
          this.fetchList()
        }
      })
    },
    viewItemList(id, itemType) {
      if (id == 'all') {
        if (itemType == 'normal') {
          this.$router.push({ path: this.matchInternalRoute('goodsphysical') })
        } else {
          this.$router.push({ path: this.matchInternalRoute('servicegoods') })
        }
      } else {
        this.ItemLoading = true
        this.activityItemDialog = true
        this.activityItemParams.marketing_id = id
        getMarketingActivityItemList(this.activityItemParams).then((res) => {
          if (res != undefined && res.data.data && res.data.data.total_count > 0) {
            this.activityItemListsData = res.data.data.list
            this.activityItemTotalCount = res.data.data.total_count
          }
          this.ItemLoading = false
        })
      }
    },
    handleGoodsCurrentChange(page_num) {
      this.ItemLoading = true
      this.activityItemDialog = true
      this.activityItemParams.page = page_num
      getMarketingActivityItemList(this.activityItemParams).then((res) => {
        if (res != undefined && res.data.data && res.data.data.total_count > 0) {
          this.activityItemListsData = res.data.data.list
          this.activityItemTotalCount = res.data.data.total_count
        }
        this.ItemLoading = false
      })
    },
    handleCancel() {
      this.activityItemDialog = false
      this.purchaseRulesDialog = false
    },
    viewGiftItemList(row) {
      this.purchaseRulesDialog = true
      this.purchaseRules = row.gifts
    },
    updateStatusCommunityAction(row) {
      const msg = this.$t('ff141a64.01be42')
      this.$confirm(msg, this.$t('ff141a64.02d981'), {
        cancelButtonText: this.$t('ff141a64.625fb2'),
        confirmButtonText: this.$t('ff141a64.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              (response) => {
                this.fetchList()
                this.$message({
                  message: this.$t('ff141a64.b69694'),
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            )
          }
          done()
        }
      })
    },
    viewDetail(row) {
      this.$router.push({
        path: this.matchRoutePath('editor/') + row.marketing_id,
        query: { isnodata: true }
      })
    }
  }
}
</script>
