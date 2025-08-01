<template>
  <div>
    <div class="recharge-overview view-flex content-center content-padded">
      <div class="view-flex-item">
        <!-- <i class="iconfont icon-coins" /> -->
        <SpIcon name="layers" :size="50" fill="#ff5000" />
        <div>
          <span>可用积分总额</span> <span class="money mark">{{ count.can_use }}</span>
        </div>
      </div>
      <div class="view-flex-item">
        <SpIcon name="funds" :size="50" fill="#ff5000" />
        <div>
          累计积分总额 <span class="money mark">{{ count.total }}</span>
        </div>
      </div>
      <div class="view-flex-item">
        <SpIcon name="timer" :size="50" fill="#ff5000" />
        <div>
          <span>已使用积分总额</span> <span class="money mark">{{ count.used }}</span>
        </div>
      </div>
    </div>
    <el-table v-loading="loading" :data="dataList" :height="wheight - 240">
      <el-table-column prop="timeStart" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="point" label="积分变动">
        <template slot-scope="scope">
          <span v-if="scope.row.point == 0">{{ scope.row.point }}</span>
          <span
            v-else-if="scope.row.income > 0"
          >+{{ scope.row.income }}</span>
          <span
            v-else-if="scope.row.outcome > 0"
          >-{{ scope.row.outcome }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="point_desc" label="记录" />
      <el-table-column prop="order_id" label="订单号" />
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMemberPoint, getPointCountIndex } from '../../../api/point'

export default {
  data() {
    return {
      loading: false,
      pageSize: 20,
      dataList: [],
      count: {}
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    let query = { pageSize: this.pageSize, page: 1 }
    getMemberPoint(query).then(res => {
      this.dataList = res.data.data.list
    })
    getPointCountIndex().then(res => {
      this.count = res.data.data
    })
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.recharge-overview {
  display: flex;
  justify-content: space-around;
  .i-icon {
    margin-bottom: 10px;
  }
  .view-flex-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  font-size: 20px;
  .money {
    margin-top: 18px;
    color: #ff5000;
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
