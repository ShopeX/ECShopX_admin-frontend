<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <!-- <el-row :gutter="20">
        <el-col :md="12" :lg="12">
          <shop-select
            v-if="$store.getters.login_type != 'distributor'"
            distributors
            @update="storeSearch"
          ></shop-select>
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
        <!-- <el-col :md="4" :lg="8">
          <el-select
            v-model="params.item_type"
            @change="itemTypeChange"
            placeholder="商品类型"
            clearable
            style="width: 100%;"
            size="mini"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="服务类商品" value="service"></el-option>
            <el-option label="实体类商品" value="normal"></el-option>
          </el-select>
        </el-col> -->
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
            添加满赠促销
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
                  消费满{{ item.full }}件,赠送(<el-button
                    type="text"
                    @click="viewGiftItemList(scope.row)"
                  >赠品</el-button>)
                </span>
                <span v-if="scope.row.condition_type == 'totalfee'">
                  消费满{{ item.full }}元,赠送(<el-button
                    type="text"
                    @click="viewGiftItemList(scope.row)"
                  >赠品</el-button>)
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
            prop="source_name"
            label="店铺"
          />
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
                  v-if="scope.row.use_bound != 0"
                  type="text"
                  @click="viewItemList(scope.row.marketing_id)"
                >
                  查看商品
                </el-button>
                <el-button
                  v-else
                  type="text"
                  @click="viewItemList('all', scope.row.item_type)"
                >
                  全部商品
                </el-button>
                <el-button
                  v-if="scope.row.status !== 'end'"
                  type="text"
                  @click="updateStatusCommunityAction(scope.row)"
                >
                  终止
                </el-button>
                <el-button
                  v-if="scope.row.status != 'waiting' && scope.row.status != 'ongoing'"
                  type="text"
                  @click="viewDetail(scope.row)"
                >
                  查看详情
                </el-button>
                <template v-if="scope.row.edit_btn == 'Y'">
                  <i
                    v-if="scope.row.status == 'waiting' || scope.row.status == 'ongoing'"
                    class="iconfont icon-edit1"
                    @click="editActivityAction(scope.$index, scope.row)"
                  />
                </template>
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
        title="活动商品列表 OR 赠品"
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
          <el-table
            v-loading="ItemLoading"
            :data="activityItemListsData"
            :height="wheight - 190"
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
            >
              <template slot-scope="scope">
                <el-col>{{ scope.row.item_name }}</el-col>
                <el-col v-if="scope.row.gift_num">
                  x {{ scope.row.gift_num }}
                </el-col>
              </template>
            </el-table-column>
            <el-table-column
              prop="item_spec_desc"
              label="规格"
            >
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
        marketing_type: 'full_gift',
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
      ItemLoading: false
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
      var msg = '你确定要删除该活动吗?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            removeMarketingActivity({ marketing_id: row.marketing_id }).then((res) => {
              this.getFullGiftLists()
              this.$message({
                message: '删除活动成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
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
    },
    viewItemList (id, itemType) {
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
    handleGoodsSizeChange (pageSize) {
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
    handleCancel () {
      this.activityItemDialog = false
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getFullGiftLists()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.loading = false
      this.getFullGiftLists()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
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
      console.log(row)
      this.activityItemDialog = true
      this.activityItemListsData = row.gifts
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
    }
  }
}
</script>
