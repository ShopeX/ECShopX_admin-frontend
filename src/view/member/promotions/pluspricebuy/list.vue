<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <!-- <el-row :gutter="20">
        <el-col :md="12" :lg="12">
          <shop-select distributors @update="storeSearch"></shop-select>
        </el-col>
        <el-col :md="8" :lg="8">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
            style="width: 100%;"
            @change="dateChange"
            size="mini"
          ></el-date-picker>
        </el-col>
      </el-row> -->
      <el-row :gutter="20">
        <el-col
          :md="8"
          :lg="8"
        >
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="根据添加时间筛选"
            style="width: 100%"
            size="mini"
            @change="dateChange"
          />
        </el-col>
        <el-col
          :md="4"
          :lg="8"
        >
          <el-select
            v-model="params.item_type"
            placeholder="商品类型"
            clearable
            style="width: 100%"
            size="mini"
            @change="itemTypeChange"
          >
            <el-option
              label="全部"
              value="0"
            />
            <el-option
              label="服务类商品"
              value="service"
            />
            <el-option
              label="实体类商品"
              value="normal"
            />
          </el-select>
        </el-col>
        <el-col
          :md="4"
          :lg="8"
        >
          <el-button
            size="mini"
            type="primary"
            icon="plus"
            @click="addActivityData"
          >
            添加加价购促销
          </el-button>
        </el-col>
      </el-row>
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="全部"
          name="all"
        />
        <el-tab-pane
          label="待开始"
          name="waiting"
        />
        <el-tab-pane
          label="进行中"
          name="ongoing"
        />
        <el-tab-pane
          label="已结束"
          name="end"
        />
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
          :height="wheight - 190"
          element-loading-text="数据加载中"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="适用会员">
                  <el-tag
                    v-for="(item, index) in scope.row.member_grade"
                    :key="index"
                  >
                    {{
                      item
                    }}
                  </el-tag>
                </el-form-item>
                <el-form-item label="创建时间">
                  <span>{{ scope.row.created_date }}</span>
                </el-form-item>
                <el-form-item label="适用商品">
                  <div
                    v-for="(item, index) in scope.row.items"
                    :key="index"
                  >
                    {{ item.item_name }}
                  </div>
                </el-form-item>
                <el-form-item label="适用店铺">
                  <span v-if="scope.row.use_shop">
                    <div
                      v-for="(item, index) in scope.row.shops"
                      :key="index"
                    >
                      {{ item.shop_name }}
                    </div>
                  </span>
                  <span v-else> <div>全部店铺</div> </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="marketing_id"
            width="60"
            label="编号"
          />
          <el-table-column
            prop="marketing_name"
            min-width="150"
            label="促销名称"
          />
          <el-table-column
            label="规则"
            min-width="150"
          >
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.condition_value"
                :key="index"
              >
                <span v-if="scope.row.condition_type == 'quantity'">
                  消费满{{ item.full }}件,加价购(<el-button
                    type="text"
                    @click="viewGiftItemList(scope.row)"
                  >加购商品</el-button>)
                </span>
                <span v-if="scope.row.condition_type == 'totalfee'">
                  消费满{{ item.full }}元,加价购(<el-button
                    type="text"
                    @click="viewGiftItemList(scope.row)"
                  >加购商品</el-button>)
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="used_platform"
            min-width="100"
            label="适用平台"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.used_platform == 0">全场可用</span>
              <span v-if="scope.row.used_platform == 1">只用于pc端</span>
              <span v-if="scope.row.used_platform == 2">小程序端</span>
              <span v-if="scope.row.used_platform == 3">h5端</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="total_fee"
            min-width="150"
            label="有效期"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.start_date }}</div>
              <div>~</div>
              <div>{{ scope.row.end_date }}</div>
            </template>
          </el-table-column>
          <el-table-column
            min-width="70"
            label="状态"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'ongoing'">进行中</span>
              <span v-if="scope.row.status == 'waiting'">未开始</span>
              <span v-if="scope.row.status == 'end'">已结束</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="150"
          >
            <template slot-scope="scope">
              <div class="operating-icons">
                <el-button
                  type="text"
                  @click="viewItemList(scope.row.marketing_id)"
                >
                  查看商品
                </el-button>
                <el-button
                  v-if="scope.row.status !== 'end'"
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
        <div
          v-if="total_count > params.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="params.page"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tabs>

      <el-dialog
        title="活动商品列表"
        :visible.sync="activityItemDialog"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table
            v-loading="ItemLoading"
            :data="activityItemListsData"
          >
            <el-table-column
              prop="item_id"
              label="id"
              width="60"
            />
            <el-table-column
              prop="pics[0]"
              label="图片"
              width="80"
            >
              <template slot-scope="scope">
                <img
                  :src="wximageurl + scope.row.pics[0]"
                  width="50"
                  height="50"
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="item_name"
              label="名称"
            />
            <el-table-column
              prop="price"
              label="价格"
              width="100"
            >
              <template slot-scope="scope">
                {{ cursymbol }}{{ scope.row.price / 100 }}
              </template>
            </el-table-column>
            <el-table-column
              prop="store"
              label="库存"
              width="70"
            />
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
          <el-table
            v-loading="ItemLoading"
            :data="purchaseRules"
          >
            <el-table-column
              prop="price"
              label="加价金额"
              width="100"
            >
              <template slot-scope="scope">
                ￥{{ scope.row.price }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pics[0]"
              label="可购买的商品"
            >
              <template slot-scope="scope">
                <div
                  v-for="(newitem, index) in scope.row.gift_item"
                  :key="index"
                >
                  {{ newitem.item_name }} x {{ newitem.gift_num }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getMarketingActivityList,
  getMarketingActivityItemList,
  removeMarketingActivity
} from '../../../../api/promotions'
import shopSelect from '@/components/shopSelect'

export default {
  provide () {
    return {
      refresh: this.getFullGiftLists
    }
  },
  components: {
    shopSelect
  },
  data () {
    return {
      activeName: 'all',
      cursymbol: '￥',
      loading: false,
      create_time: '',
      params: {
        page: 1,
        pageSize: 20,
        marketing_type: 'plus_price_buy',
        item_type: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      activityItemParams: {
        page: 1,
        pageSize: 20
      },
      activityItemTotalCount: 0,
      activityItemListsData: [],
      total_count: 0,
      list: [],
      activityItemDialog: false,
      purchaseRulesDialog: false,
      ItemLoading: false,
      purchaseRules: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.getFullGiftLists()
  },
  methods: {
    // 切换tab
    handleClick (tab, event) {
      this.activeName = tab.name
      this.params.status = tab.name == 'all' ? '' : tab.name
      this.params.page = 1
      this.getFullGiftLists()
    },
    storeSearch (val) {
      val && val.shop_id
      this.params.store_id = val.shop_id
      this.params.page = 1
      this.getFullGiftLists()
    },
    itemTypeChange () {
      this.params.page = 1
      this.getFullGiftLists()
    },
    addActivityData () {
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editActivityAction (index, row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.marketing_id })
    },
    deleteActivityAction (row) {
      removeMarketingActivity({ marketing_id: row.marketing_id }).then((res) => {
        if (res != undefined && res.data.data.status) {
          this.getFullGiftLists()
        }
      })
    },
    viewItemList (id, itemType) {
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
    handleGoodsCurrentChange (page_num) {
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
    handleCancel () {
      this.activityItemDialog = false
      this.purchaseRulesDialog = false
    },
    dateChange (val) {
      if (!val) {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      }
      this.params.page = 1
      this.getFullGiftLists()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.loading = false
      this.getFullGiftLists()
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getFullGiftLists () {
      this.loading = true
      var filter = this.params
      getMarketingActivityList(filter).then((response) => {
        this.list = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    viewGiftItemList (row) {
      this.purchaseRulesDialog = true
      this.purchaseRules = row.gifts
    },
    updateStatusCommunityAction (row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id, isEnd: true }).then(
              (response) => {
                this.getFullGiftLists()
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
    viewDetail (row) {
      this.$router.push({
        path: this.matchHidePage('editor/') + row.marketing_id,
        query: { isnodata: true }
      })
    }
  }
}
</script>
