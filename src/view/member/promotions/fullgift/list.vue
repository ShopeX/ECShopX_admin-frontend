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
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app pc alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="create_time" :label="$t('e814a89b.374856')">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            :placeholder="$t('e814a89b.e08045')"
            style="width: 100%"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          {{ $t('e814a89b.b154d0') }}
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
            border
            style="width: 100%"
            :height="wheight - 190"
            :element-loading-text="$t('e814a89b.f09b12')"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item :label="$t('e814a89b.6dbb6f')">
                    <el-tag v-for="(item, index) in scope.row.member_grade" :key="index">
                      {{ item }}
                    </el-tag>
                  </el-form-item>
                  <el-form-item :label="$t('e814a89b.eca37c')">
                    <span>{{ scope.row.created_date }}</span>
                  </el-form-item>
                  <el-form-item :label="$t('e814a89b.409ea3')">
                    <div v-for="(item, index) in scope.row.items" :key="index">
                      {{ item.item_name }}
                    </div>
                  </el-form-item>
                  <el-form-item :label="$t('e814a89b.eb4307')">
                    <span v-if="scope.row.use_shop">
                      <div v-for="(item, index) in scope.row.shops" :key="index">
                        {{ item.shop_name }}
                      </div>
                    </span>
                    <span v-else>
                      <div>{{ $t('e814a89b.77678b') }}</div>
                    </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="marketing_id" width="60" :label="$t('e814a89b.c515f3')" />
            <el-table-column prop="marketing_name" min-width="150" :label="$t('e814a89b.9cc7a7')" />
            <el-table-column :label="$t('e814a89b.b0fae0')" min-width="150">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.condition_value" :key="index">
                  <span v-if="scope.row.condition_type == 'quantity'">
                    {{ $t('e814a89b.13dc43') }}{{ item.full }}{{ $t('e814a89b.f7edf5') }},{{
                      $t('e814a89b.7de0a5')
                    }}<el-button
                      type="text"
                      @click="
                        viewGiftItemList(scope.row, item.full, scope.row.condition_value.length)
                      "
                      >{{ $t('e814a89b.d017cc') }}</el-button
                    >)
                  </span>
                  <span v-if="scope.row.condition_type == 'totalfee'">
                    {{ $t('e814a89b.13dc43') }}{{ item.full }}{{ $t('e814a89b.c16655') }},{{
                      $t('e814a89b.7de0a5')
                    }}<el-button
                      type="text"
                      @click="
                        viewGiftItemList(scope.row, item.full, scope.row.condition_value.length)
                      "
                      >{{ $t('e814a89b.d017cc') }}</el-button
                    >)
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="used_platform" min-width="100" :label="$t('e814a89b.b90304')">
              <template slot-scope="scope">
                <span v-if="scope.row.used_platform == 0">{{ $t('e814a89b.6e78ce') }}</span>
                <span v-if="scope.row.used_platform == 1">{{ $t('e814a89b.bff1cb') }}</span>
                <span v-if="scope.row.used_platform == 2">{{ $t('e814a89b.2aa12b') }}</span>
                <span v-if="scope.row.used_platform == 3">{{ $t('e814a89b.0397e1') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_fee" min-width="150" :label="$t('e814a89b.bb114a')">
              <template slot-scope="scope">
                <div>{{ scope.row.start_date }}</div>
                <div>~</div>
                <div>{{ scope.row.end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="70" prop="source_name" :label="$t('e814a89b.295713')" />
            <el-table-column min-width="70" :label="$t('e814a89b.3fea7c')">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'ongoing'">{{ $t('e814a89b.fb852f') }}</span>
                <span v-if="scope.row.status == 'waiting'">{{ $t('e814a89b.dd4e55') }}</span>
                <span v-if="scope.row.status == 'end'">{{ $t('e814a89b.047fab') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('e814a89b.2b6bc0')" min-width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button
                    v-if="scope.row.use_bound != 0"
                    type="text"
                    @click="viewItemList(scope.row.marketing_id)"
                  >
                    {{ $t('e814a89b.f13684') }}
                  </el-button>
                  <el-button v-else type="text" @click="viewItemList('all', scope.row.item_type)">
                    {{ $t('e814a89b.794a4e') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status !== 'end'"
                    type="text"
                    @click="updateStatusCommunityAction(scope.row)"
                  >
                    {{ $t('e814a89b.ff6c6a') }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status != 'waiting' && scope.row.status != 'ongoing'"
                    type="text"
                    @click="viewDetail(scope.row)"
                  >
                    {{ $t('e814a89b.5b48db') }}
                  </el-button>
                  <template v-if="scope.row.edit_btn == 'Y'">
                    <el-button
                      type="text"
                      v-if="scope.row.status == 'waiting' || scope.row.status == 'ongoing'"
                      @click="editActivityAction(scope.$index, scope.row)"
                    >
                      {{ $t('e814a89b.95b351') }}
                    </el-button>
                  </template>
                  <el-button
                    type="text"
                    v-if="scope.row.status == 'waiting'"
                    @click="deleteActivityAction(scope.row)"
                  >
                    {{ $t('e814a89b.2f4aad') }}
                  </el-button>
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
        :title="$t('e814a89b.48d151')"
        :visible.sync="activityItemDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-pagination
            background
            layout="total"
            :current-page.sync="activityItemParams.page"
            :page-sizes="[10, 20, 50]"
            :total="activityItemTotalCount"
            :page-size="activityItemParams.pageSize"
            @current-change="handleGoodsCurrentChange"
            @size-change="handleGoodsSizeChange"
          />
          <el-table v-loading="ItemLoading" :data="activityItemListsData" :height="wheight - 190">
            <el-table-column prop="item_id" label="id" width="60" />
            <el-table-column prop="pics[0]" :label="$t('e814a89b.20def7')" width="80">
              <template slot-scope="scope">
                <img :src="wximageurl + scope.row.pics[0]" width="50" height="50">
              </template>
            </el-table-column>
            <el-table-column prop="item_name" :label="$t('e814a89b.d7ec2d')">
              <template slot-scope="scope">
                <el-col>{{ scope.row.item_name }}</el-col>
                <el-col v-if="scope.row.gift_num"> x {{ scope.row.gift_num }} </el-col>
              </template>
            </el-table-column>
            <el-table-column prop="item_spec_desc" :label="$t('e814a89b.ea887b')">
              <template slot-scope="scope">
                <el-col>{{ scope.row.item_spec_desc }}</el-col>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="price" label="价格" width="100">
              <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.price / 100 }} </template>
            </el-table-column>
            <el-table-column prop="store" label="库存" width="70"></el-table-column> -->
          </el-table>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page.sync="activityItemParams.page"
            :page-sizes="[10, 20, 50]"
            :total="activityItemTotalCount"
            :page-size="activityItemParams.pageSize"
            @current-change="handleGoodsCurrentChange"
            @size-change="handleGoodsSizeChange"
          />
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
      marketing_type: 'full_gift',
      item_type: undefined
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
      ItemLoading: false
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    tabList() {
      return [
        { name: this.$t('e814a89b.a8b0c2'), activeName: 'all' },
        { name: this.$t('e814a89b.1568ba'), activeName: 'waiting' },
        { name: this.$t('e814a89b.fb852f'), activeName: 'ongoing' },
        { name: this.$t('e814a89b.047fab'), activeName: 'end' }
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
        create_time: [],
        ...time
      }
      return params
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    // 切换tab
    handleTabClick(tab, event) {
      this.onSearch()
    },
    addActivityData() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editActivityAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.marketing_id })
    },
    deleteActivityAction(row) {
      const msg = this.$t('e814a89b.143c34')
      this.$confirm(msg, this.$t('e814a89b.02d981'), {
        cancelButtonText: this.$t('e814a89b.625fb2'),
        confirmButtonText: this.$t('e814a89b.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id }).then((res) => {
              this.fetchList()
              this.$message({
                message: this.$t('e814a89b.e236fe'),
                type: 'success',
                duration: 5 * 1000
              })
            })
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
    },
    // TODO:路由跳转
    viewItemList(id, itemType) {
      if (id == 'all') {
        if (itemType == 'normal') {
          this.$router.push({
            path:
              this.$store.getters.login_type != 'distributor'
                ? '/entity/goods/goodsphysical'
                : '/shopadmin/entity/goodsphysical'
          })
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
    handleGoodsSizeChange(pageSize) {
      this.ItemLoading = true
      this.activityItemDialog = true
      this.activityItemParams.page = 1
      this.activityItemParams.pageSize = pageSize
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
    },

    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewGiftItemList(row, full, ele) {
      console.log(row, full, ele)
      this.activityItemDialog = true
      if (ele == 1) {
        this.activityItemListsData = row.gifts
        this.activityItemTotalCount = row.gifts.length
      } else {
        let activityItem = row.gifts.map((item) => {
          if (item.filter_full.split('.')[0] == full) {
            return item
          } else {
            return {}
          }
        })
        let filteredArr = activityItem.filter(function (obj) {
          return Object.keys(obj).length > 0
        })
        this.activityItemListsData = filteredArr
        this.activityItemTotalCount = filteredArr.length
      }
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
    updateStatusCommunityAction(row) {
      const msg = this.$t('e814a89b.01be42')
      this.$confirm(msg, this.$t('e814a89b.02d981'), {
        cancelButtonText: this.$t('e814a89b.625fb2'),
        confirmButtonText: this.$t('e814a89b.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              (response) => {
                this.fetchList()
                this.$message({
                  message: this.$t('e814a89b.b69694'),
                  type: 'success',
                  duration: 5 * 1000
                })
              }
            )
          }
          done()
        }
      })
    }
  }
}
</script>
