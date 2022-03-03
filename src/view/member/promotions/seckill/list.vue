<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input
            v-model="params.name"
            placeholder="活动名称"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="dataSearch"
            />
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="params.status"
            placeholder="活动状态"
            clearable
            style="width: 100%"
            @change="dataSearch"
          >
            <el-option
              label="全部"
              value="0"
            />
            <el-option
              label="未开始"
              value="waiting"
            />
            <el-option
              label="预告中"
              value="in_the_notice"
            />
            <el-option
              label="售卖中"
              value="in_sale"
            />
            <el-option
              label="已结束"
              value="it_has_ended"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="create_time"
            type="daterange"
            value-format="yyyy/MM/dd"
            placeholder="添加时间筛选"
            style="width: 100%; min-width: 250px"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            icon="plus"
            @click="addActivityData"
          >
            添加活动
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="activityLists"
        :height="wheight - 150"
      >
        <el-table-column
          prop="seckill_id"
          label="ID"
          width="50"
        />
        <el-table-column label="活动">
          <template slot-scope="scope">
            {{ scope.row.activity_name }}<br>
            <span class="text-muted">{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activity_release_date"
          label="预告时间"
          width="160"
        />
        <el-table-column
          label="活动时间"
          width="190"
        >
          <template slot-scope="scope">
            {{ scope.row.activity_start_date }} <span class="text-muted">开始</span>
            {{ scope.row.activity_end_date }} <span class="text-muted">结束</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_date"
          label="创建时间"
          width="160"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="70"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'waiting'">待开始</span>
            <span v-else-if="scope.row.status == 'in_the_notice'">预告中</span>
            <span v-else-if="scope.row.status == 'in_sale'">进行中</span>
            <span v-else-if="scope.row.status == 'it_has_ended'">已结束</span>
            <span v-else-if="scope.row.status == 'close'">已终止</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="items"
          label="商品"
          width="50"
        >
          <template slot-scope="scope">
            <i
              class="iconfont icon-search-plus"
              @click="viewGoodsList(scope.row.seckill_id)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="60"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 'it_has_ended'"
              type="text"
              @click="updateStatusCommunityAction(scope.row)"
            >
              终止
            </el-button>
            <div class="operating-icons">
              <!-- <i class="iconfont icon-search-plus" @click="communityDetail(scope.$index, scope.row)"></i> -->
              <i
                v-if="scope.row.status == 'waiting'"
                class="iconfont icon-edit1"
                @click="editCommunityAction(scope.$index, scope.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-center content-top-padded"
      >
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>

      <el-dialog
        title="活动商品列表"
        :visible.sync="goodsVisible"
        :before-close="handleCancel"
        width="70%"
      >
        <template>
          <el-table
            v-loading="loading"
            :data="goodsList"
          >
            <el-table-column
              prop="item_id"
              label="id"
              width="60"
            />
            <el-table-column
              prop="item_name"
              label="商品名称"
            />
            <el-table-column
              prop="activity_price"
              label="活动价"
              width="100"
            >
              <template slot-scope="scope">
                {{ cursymbol }}{{ scope.row.activity_price / 100 }}
                <!-- <el-input v-model="scope.row.activity_price"  @change="editItemPrice(scope.$index, scope.row)"><i slot="prefix" class="el-input__icon el-icon-edit"></i><i slot="suffix" class="el-input__icon">元</i></el-input> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="activity_store"
              label="库存"
              width="70"
            />
            <el-table-column
              prop="limit_num"
              label="限购"
              width="50"
            />
            <el-table-column
              prop="sort"
              label="排序"
              width="60"
            />
          </el-table>
          <div
            v-if="goodsCount > goodsPageSize"
            class="content-center content-top-padded"
          >
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="goodsPage"
              :total="goodsCount"
              :page-size="goodsPageSize"
              @current-change="handleGoodsCurrentChange"
            />
          </div>
        </template>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../../api/company'
import {
  seckillActivityGetList,
  seckillActivityUpdateStatus,
  getSeckillItemList
} from '../../../../api/promotions'
export default {
  props: ['getStatus'],
  provide () {
    return {
      refresh: this.refresh
    }
  },
  data () {
    return {
      create_time: '',
      activeName: 'first',
      activityLists: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        status: '',
        activity_name: ''
      },
      communityVisible: false,
      couponVisible: false,
      goodsVisible: false,
      goodsList: [],
      goodsCount: 0,
      goodsPageSize: 10,
      goodsPage: 1,
      nowActivity: '',
      cursymbol: '',
      currency: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getActivityLists(this.params)
      }
    }
  },
  mounted () {
    if (this.$route.query.status) {
      this.params.status = this.$route.query.status
    }
    this.getActivityLists(this.params)
    this.getCurrencyInfo()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getActivityLists(this.params)
    },
    handleGoodsCurrentChange (page_num) {
      this.goodsPage = page_num
      this.viewGoodsList(this.nowActivity)
    },
    addActivityData () {
      // 添加物料弹框
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    editCommunityAction (index, row) {
      // 编辑物料弹框
      this.$router.push({ path: this.matchHidePage('editor/') + row.seckill_id })
    },
    dataSearch () {
      // this.params.start_time = ''
      // this.params.end_time = ''
      // this.create_time = ''
      this.params.page = 1
      this.getActivityLists(this.params)
    },
    getActivityLists (params) {
      this.loading = true
      seckillActivityGetList(params).then((response) => {
        this.activityLists = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    updateStatusCommunityAction (row) {
      var msg = '此操作将永久终止该活动, 是否继续?'
      this.$confirm(msg, '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            seckillActivityUpdateStatus({ seckill_id: row.seckill_id }).then((response) => {
              this.getActivityLists()
              this.$message({
                message: '修改活动状态成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
          done()
        }
      })
    },
    dateChange (val) {
      // this.params.status = ''
      if (val && val.length > 0) {
        this.params.start_time = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.params.end_time = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.params.start_time = ''
        this.params.end_time = ''
      }
      this.params.page = 1
      this.getActivityLists(this.params)
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    viewGoodsList (activityId) {
      this.nowActivity = activityId
      this.goodsVisible = true
      getSeckillItemList({
        seckill_id: activityId,
        page: this.goodsPage,
        pageSize: this.goodsPageSize
      }).then((res) => {
        this.goodsList = res.data.data.list
        this.goodsCount = res.data.data.total_count
      })
    },
    viewCouponList (ids) {
      this.couponVisible = true
    },
    handleCancel () {
      this.communityVisible = false
      this.couponVisible = false
      this.goodsVisible = false
    },
    getCurrencyInfo () {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    updateActivityData (params) {
      updateActivityItemData(params).then((res) => {})
    },
    editItemPrice (row) {
      let form = {
        'id': row.id,
        'item_id': row.item_id,
        'activity_price': row.activity_price,
        'vip_price': row.vip_price,
        'svip_price': row.svip_price,
        'activity_store': row.activity_store,
        'points': row.points
      }
      this.updateActivityData(form)
    },
    refresh () {
      this.getActivityLists(this.params)
      this.getCurrencyInfo()
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
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.icon-search-plus {
  cursor: pointer;
}
.text-muted {
  color: #999;
}
</style>
