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
  <SpPage>
    <SpRouterView>
      <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />

      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="create_time" label="时间:">
          <el-date-picker
            v-model="params.create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_type" label="商品类型:">
          <el-select v-model="params.item_type" placeholder="商品类型">
            <el-option label="全部" value="0" />
            <el-option label="服务类商品" value="service" />
            <el-option label="实体类商品" value="normal" />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addActivityData">
          添加加价购促销
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
            element-loading-text="数据加载中"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="适用会员">
                    <el-tag v-for="(item, index) in scope.row.member_grade" :key="index">
                      {{ item }}
                    </el-tag>
                  </el-form-item>
                  <el-form-item label="创建时间">
                    <span>{{ scope.row.created_date }}</span>
                  </el-form-item>
                  <el-form-item label="适用商品">
                    <div v-for="(item, index) in scope.row.items" :key="index">
                      {{ item.item_name }}
                    </div>
                  </el-form-item>
                  <el-form-item v-if="scope.row.source_id == '0'" label="适用店铺">
                    <span v-if="scope.row.use_shop">
                      <div v-for="(item, index) in scope.row.shops" :key="index">
                        {{ item.shop_name }}
                      </div>
                    </span>
                    <span v-else> <div>全部店铺</div> </span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="marketing_id" width="60" label="编号" />
            <el-table-column prop="marketing_name" min-width="150" label="促销名称" />
            <el-table-column prop="source_name" label="店铺" />
            <el-table-column label="规则" min-width="150">
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.condition_value" :key="index">
                  <span v-if="scope.row.condition_type == 'quantity'">
                    消费满{{ item.full }}件,加价购(<el-button
                      type="text"
                      @click="viewGiftItemList(scope.row)"
                      >加购商品</el-button
                    >)
                  </span>
                  <span v-if="scope.row.condition_type == 'totalfee'">
                    消费满{{ item.full }}元,加价购(<el-button
                      type="text"
                      @click="viewGiftItemList(scope.row)"
                      >加购商品</el-button
                    >)
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="used_platform" min-width="100" label="适用平台">
              <template slot-scope="scope">
                <span v-if="scope.row.used_platform == 0">全场可用</span>
                <span v-if="scope.row.used_platform == 1">只用于pc端</span>
                <span v-if="scope.row.used_platform == 2">小程序端</span>
                <span v-if="scope.row.used_platform == 3">h5端</span>
              </template>
            </el-table-column>
            <el-table-column prop="total_fee" min-width="150" label="有效期">
              <template slot-scope="scope">
                <div>{{ scope.row.start_date }}</div>
                <div>~{{ scope.row.end_date }}</div>
              </template>
            </el-table-column>
            <el-table-column min-width="70" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'ongoing'">进行中</span>
                <span v-if="scope.row.status == 'waiting'">未开始</span>
                <span v-if="scope.row.status == 'end'">已结束</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="150">
              <template slot-scope="scope">
                <div class="operating-icons">
                  <el-button type="text" @click="viewItemList(scope.row.marketing_id)">
                    查看商品
                  </el-button>
                  <el-button
                    v-if="endActionVisible(scope.row)"
                    type="text"
                    @click="updateStatusCommunityAction(scope.row)"
                  >
                    终止
                  </el-button>
                  <el-button
                    v-if="scope.row.status != 'waiting'"
                    type="text"
                    @click="viewDetail(scope.row)"
                  >
                    查看详情
                  </el-button>
                  <i
                    v-if="scope.row.status == 'waiting'"
                    class="iconfont icon-edit1"
                    @click="editActivityAction(scope.$index, scope.row)"
                  />
                  <i
                    v-if="scope.row.status == 'waiting'"
                    class="iconfont icon-trash-alt"
                    @click="deleteActivityAction(scope.row)"
                  />
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
        title="活动商品列表"
        :visible.sync="activityItemDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="ItemLoading" :data="activityItemListsData">
            <el-table-column prop="item_id" label="id" width="60" />
            <el-table-column prop="pics[0]" label="图片" width="80">
              <template slot-scope="scope">
                <img :src="wximageurl + scope.row.pics[0]" width="50" height="50">
              </template>
            </el-table-column>
            <el-table-column prop="item_name" label="名称" />
            <el-table-column prop="price" label="价格" width="100">
              <template slot-scope="scope"> {{ cursymbol }}{{ scope.row.price / 100 }} </template>
            </el-table-column>
            <el-table-column prop="store" label="库存" width="70" />
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
        title="加价购赠品"
        :visible.sync="purchaseRulesDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table v-loading="ItemLoading" :data="purchaseRules">
            <el-table-column prop="price" label="加价金额" width="100">
              <template slot-scope="scope"> ￥{{ scope.row.price }} </template>
            </el-table-column>
            <el-table-column prop="pics[0]" label="可购买的商品">
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
      purchaseRules: [],
      tabList: [
        { name: '全部', activeName: 'all' },
        { name: '待开始', activeName: 'waiting' },
        { name: '进行中', activeName: 'ongoing' },
        { name: '已结束', activeName: 'end' }
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
      removeMarketingActivity({ marketing_id: row.marketing_id }).then(res => {
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
        getMarketingActivityItemList(this.activityItemParams).then(res => {
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
      getMarketingActivityItemList(this.activityItemParams).then(res => {
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
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              response => {
                this.fetchList()
                this.$message({
                  message: '修改活动状态成功',
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
