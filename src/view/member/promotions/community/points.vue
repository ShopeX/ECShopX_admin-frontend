<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="tabPaneLabel" name="all" />
      <div v-if="community_id" class="recharge-overview view-flex content-center content-padded">
        <div class="view-flex-item">
          <i class="iconfont icon-wallet" />
          <div>
            <span>{{ $t('eaf690f0.521856') }}</span>
            <span class="money mark">{{ totalPoints }}</span>
          </div>
        </div>
        <div class="view-flex-item">
          <i class="iconfont icon-credit-card1" />
          <div>
            {{ $t('eaf690f0.140315') }}<span class="money mark">{{ validPoint }}</span>
          </div>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-date-picker
            v-model="create_time"
            value-format="yyyy/MM/dd"
            type="daterange"
            :placeholder="$t('eaf690f0.4b8cb9')"
            style="width: 100%"
            @change="dateChange"
          />
        </el-col>
        <el-col :span="6">
          <el-select
            v-model="journal_type"
            :placeholder="$t('eaf690f0.806363')"
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
          <el-button type="primary" @click="handleChangePoint(false)">
            {{ $t('eaf690f0.979034') }}
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="dataList" :height="wheight - 320">
        <el-table-column :label="$t('eaf690f0.806363')">
          <template slot-scope="scope">
            <span v-if="scope.row.journal_type == '1'">{{ $t('eaf690f0.5922f2') }}</span>
            <span v-else-if="scope.row.journal_type == '2'">{{ $t('eaf690f0.bd863a') }}</span>
            <span v-else-if="scope.row.journal_type == '3'">{{ $t('eaf690f0.2cd83a') }}</span>
            <span v-else-if="scope.row.journal_type == '4'">{{ $t('eaf690f0.272069') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="order_id" :label="$t('eaf690f0.b0780b')">
          <template slot-scope="scope">
            <span v-if="scope.row.order_id == '-1'">{{ $t('eaf690f0.33da57') }}</span>
            <span v-else-if="scope.row.journal_type == '1' && scope.row.order_id.length !== 16">{{
              $t('eaf690f0.10b552')
            }}</span>
            <span v-else-if="scope.row.journal_type != '1' && scope.row.order_id.length !== 16">{{
              $t('eaf690f0.7a395c')
            }}</span>
            <span v-else>{{ scope.row.order_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="money" :label="$t('eaf690f0.9f68a8')">
          <template slot-scope="scope">
            <span v-if="scope.row.journal_type == '1'"
              ><el-tag type="success">{{ scope.row.income }}</el-tag></span
            >
            <span v-else
              ><el-tag type="danger">-{{ scope.row.outcome }}</el-tag></span
            >
          </template>
        </el-table-column>
        <el-table-column prop="point_desc" :label="$t('eaf690f0.22677e')" />
        <el-table-column prop="created_date" :label="$t('eaf690f0.eca37c')" />
      </el-table>
      <div v-if="total_count > params.pageSize" class="mt-4 text-right">
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
  data() {
    return {
      activeName: 'all',
      tabPaneLabel: '',
      create_time: '',
      loading: false,
      dataList: [],
      name: '',
      params: {
        page: 1,
        pageSize: 20
      },
      typeFilters: [],
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
    ...mapGetters(['wheight']),
    typeFilters() {
      return [
        { text: this.$t('eaf690f0.5922f2'), value: '1' },
        { text: this.$t('eaf690f0.272069'), value: '4' }
      ]
    }
  },
  mounted() {
    if (this.$route.query.community_id) {
      this.params.community_id = this.community_id = this.$route.query.community_id
    }
    if (this.$route.query.name) {
      this.tabPaneLabel = this.$route.query.name
    } else {
      this.tabPaneLabel = this.$t('eaf690f0.dc8c37')
    }
    this.getlist()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getParams()
      this.getlist()
    },
    filterTag(val) {
      this.params.page = 1
      this.getParams()
      this.getlist()
    },
    handleChangePoint() {
      this.$prompt(this.$t('eaf690f0.ef45f4'), this.$t('eaf690f0.979034'), {
        confirmButtonText: this.$t('eaf690f0.38cf16'),
        cancelButtonText: this.$t('eaf690f0.625fb2')
      })
        .then(({ value }) => {
          changeCommunityPoint({ community_id: this.community_id, point: value }).then((res) => {
            if (value > 0) {
              this.$message({ type: 'success', message: this.$t('eaf690f0.887aac') + value })
            } else {
              this.$message({ type: 'success', message: this.$t('eaf690f0.e6e1a2') + value })
            }
            this.params.page = 1
            this.getParams()
            this.getlist()
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: this.$t('eaf690f0.2111cc') })
        })
    },
    dateChange(val) {
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
    getParams() {
      this.params.start_time = this.date_begin
      this.params.end_time = this.date_end
      this.params.journal_type = this.journal_type
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getlist() {
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
