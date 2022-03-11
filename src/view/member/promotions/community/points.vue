<template>
  <div>
    <el-tabs
      v-model="activeName"
      type="border-card"
    >
      <el-tab-pane
        :label="tabPaneLabel"
        name="all"
      />
      <div
        v-if="community_id"
        class="recharge-overview view-flex content-center content-padded"
      >
        <div class="view-flex-item">
          <i class="iconfont icon-wallet" />
          <div>
            <span>积分总额</span> <span class="money mark">{{ totalPoints }}</span>
          </div>
        </div>
        <div class="view-flex-item">
          <i class="iconfont icon-credit-card1" />
          <div>
            有效积分<span class="money mark">{{ validPoint }}</span>
          </div>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="create_time"
            value-format="yyyy/MM/dd"
            type="daterange"
            placeholder="选择日期范围"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="journal_type"
            placeholder="交易类型"
            clearable
            style="width: 100%"
            @change="filterTag"
          >
            <el-option
              v-for="item in typeFilters"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="handleChangePoint(false)"
          >
            调整积分
          </el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        :height="wheight - 320"
      >
        <el-table-column label="交易类型">
          <template slot-scope="scope">
            <span v-if="scope.row.journal_type == '1'">入账</span>
            <span v-else-if="scope.row.journal_type == '2'">全额退还</span>
            <span v-else-if="scope.row.journal_type == '3'">部分退还</span>
            <span v-else-if="scope.row.journal_type == '4'">出账</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_id"
          label="积分来源"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.order_id == '-1'">手动调整</span>
            <span
              v-else-if="scope.row.journal_type == '1' && scope.row.order_id.length !== 16"
            >积分兑换拒绝</span>
            <span
              v-else-if="scope.row.journal_type != '1' && scope.row.order_id.length !== 16"
            >积分兑换</span>
            <span v-else>{{ scope.row.order_id }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="money"
          label="积分"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.journal_type == '1'"
            ><el-tag type="success">{{ scope.row.income }}</el-tag></span>
            <span
              v-else
            ><el-tag type="danger">-{{ scope.row.outcome }}</el-tag></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="point_desc"
          label="积分描述"
        />
        <el-table-column
          prop="created_date"
          label="创建时间"
        />
      </el-table>
      <div
        v-if="total_count > params.pageSize"
        class="content-padded content-center"
      >
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page.sync="params.page"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { changeCommunityPoint, getCommunityPointList } from '../../../../api/community'

export default {
  data () {
    return {
      activeName: 'all',
      tabPaneLabel: '积分记录',
      create_time: '',
      loading: false,
      dataList: [],
      name: '',
      params: {
        page: 1,
        pageSize: 20
      },
      typeFilters: [
        { text: '入账', value: '1' },
        { text: '出账', value: '4' }
      ],
      date_begin: '',
      date_end: '',
      community_id: 0,
      totalPoints: 0,
      journal_type: '',
      validPoint: 0,
      total_count: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    if (this.$route.query.community_id) {
      this.params.community_id = this.community_id = this.$route.query.community_id
    }
    if (this.$route.query.name) {
      this.tabPaneLabel = this.$route.query.name
    }
    this.getlist()
  },
  methods: {
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getParams()
      this.getlist()
    },
    filterTag (val) {
      this.params.page = 1
      this.getParams()
      this.getlist()
    },
    handleChangePoint () {
      this.$prompt('请输入调整的积分值', '调整积分', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          changeCommunityPoint({ community_id: this.community_id, point: value }).then((res) => {
            if (value > 0) {
              this.$message({ type: 'success', message: '新增积分: ' + value })
            } else {
              this.$message({ type: 'success', message: '扣减积分: ' + value })
            }
            this.params.page = 1
            this.getParams()
            this.getlist()
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    dateChange (val) {
      if (val && val.length > 0) {
        this.date_begin = this.dateStrToTimeStamp(val[0] + ' 00:00:00')
        this.date_end = this.dateStrToTimeStamp(val[1] + ' 23:59:59')
      } else {
        this.date_begin = ''
        this.date_end = ''
      }
      this.params.page = 1
      this.getParams()
      this.getlist()
    },
    getParams () {
      this.params.start_time = this.date_begin
      this.params.end_time = this.date_end
      this.params.journal_type = this.journal_type
    },
    dateStrToTimeStamp (str) {
      return Date.parse(new Date(str)) / 1000
    },
    getlist () {
      getCommunityPointList(this.params).then((res) => {
        this.dataList = res.data.data.list
        this.total_count = res.data.data.total_count
        if (this.community_id) {
          this.totalPoints = res.data.data.totalPoints
          this.validPoint = res.data.data.validPoint
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.recharge-overview {
  .iconfont {
    font-size: 50px;
    color: #ff5000;
    margin-bottom: 10px;
  }
}
.deposit-des {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #dfe6ec;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  > div {
    float: left;
    width: 33%;
    color: #666;
    margin-left: 5%;
    img {
      float: left;
      margin-right: 10px;
    }
    > div > span {
      text-align: left;
      display: block;
    }
  }
  .money {
    font-size: 20px;
    color: #ff5000;
  }
  img {
    width: 55px;
    height: 55px;
  }
}
.ranking {
  border: 1px solid #dfe6ec;
  &-header {
    padding: 10px 15px;
    border-bottom: 1px solid #efefef;
    cursor: pointer;
    background: #f8f8f8;
  }
  &-body {
    padding: 10px;
  }
  &-list {
    padding: 0 10px;
    margin-bottom: 10px;
    li {
      .store-name,
      .cost-money {
        display: inline-block;
        width: 46%;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      &:hover {
        color: #ff5000;
      }
    }
  }
}
.more {
  cursor: pointer;
  font-size: 12px;
  padding-right: 10px;
  &:hover {
    color: #333;
  }
}
</style>
