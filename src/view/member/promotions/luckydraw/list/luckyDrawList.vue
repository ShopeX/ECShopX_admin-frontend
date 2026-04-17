<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table v-loading="loading" :data="luckydrawList" :height="wheight - 240">
      <el-table-column prop="luckydraw_name" :label="$t('f31a353f.39834b')" />
      <!--  <el-table-column label="商品类型" width="120">
          <template slot-scope="scope">
              <el-tag  v-if="scope.row.goods_type=='services'" type="success">服务类商品</el-tag>
              <el-tag v-else>实体类商品</el-tag>
          </template>
      </el-table-column> -->
      <el-table-column prop="goods_info.itemName" :label="$t('f31a353f.1fd1d5')" />
      <el-table-column :label="$t('f31a353f.e7adc9')" width="160">
        <template slot-scope="scope">
          {{ scope.row.start_time | datetime }}<br />{{ scope.row.end_time | datetime }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('f31a353f.c5f711')" width="120">
        <template v-if="scope.row.luckydraw_payment == 'cash'" slot-scope="scope">
          <span>{{ cursymbol + scope.row.luckydraw_price / 100 }}{{ $t('f31a353f.c16655') }}</span>
        </template>
        <template v-if="scope.row.luckydraw_payment == 'point'" slot-scope="scope">
          <span>{{ scope.row.luckydraw_point }} {{ $t('f31a353f.9f68a8') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('f31a353f.3fea7c')" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.activity_status == 1">{{ $t('f31a353f.dd4e55') }}</span>
          <span v-else-if="scope.row.activity_status == 2">{{ $t('f31a353f.fb852f') }}</span>
          <span v-else>{{ $t('f31a353f.047fab') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('f31a353f.2981da')" width="120">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.lucky_code"
            placement="top-start"
            :title="$t('f31a353f.65cba2')"
            width="200"
            trigger="hover"
          >
            <span v-if="scope.row.third_info.name"
              >{{ $t('f31a353f.842867') }}{{ scope.row.third_info.name }}</span
            ><br />
            <span v-if="scope.row.third_info.period"
              >{{ $t('f31a353f.d24a26') }}{{ scope.row.third_info.period }}</span
            ><br />
            <span v-if="scope.row.third_info.number"
              >{{ $t('f31a353f.e5aaf0') }}{{ scope.row.third_info.number }}</span
            >
            <el-tag slot="reference" type="danger">
              {{ scope.row.lucky_code }}
            </el-tag>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('f31a353f.2b6bc0')" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="edit"
            @click="showLuckyDrawDataAction(scope.$index, scope.row)"
          >
            {{ $t('f31a353f.ee30fd') }}
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1"
            size="mini"
            icon="edit"
            @click="editLuckyDrawAction(scope.$index, scope.row)"
          >
            {{ $t('f31a353f.95b351') }}
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="showLuckyDrawAction(scope.$index, scope.row)"
          >
            {{ $t('f31a353f.607e7a') }}
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 2"
            size="mini"
            @click="finishLuckyDrawAction(scope.$index, scope.row)"
          >
            {{ $t('f31a353f.ff6c6a') }}
          </el-button>
          <el-button
            v-if="scope.row.activity_status == 1"
            size="mini"
            type="danger"
            @click="deleteLuckyDrawAction(scope.$index, scope.row)"
          >
            {{ $t('f31a353f.3f6975') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDefaultCurrency } from '../../../../../api/company'
import {
  getLuckyDrawList,
  finishLuckyDrawActivity,
  deleteLuckyDrawActivity
} from '../../../../../api/promotions'

export default {
  props: ['view'],
  data() {
    return {
      loading: false,
      luckydrawList: [],
      total_count: 0,
      params: {
        view: 0,
        page: 1,
        pageSize: 20,
        keywords: ''
      },
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.params.view = this.view
    this.getLuckyDrawList()
    //this.getCurrencyInfo()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getLuckyDrawList()
    },
    getLuckyDrawList() {
      this.loading = true
      getLuckyDrawList(this.params)
        .then((response) => {
          this.luckydrawList = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('f31a353f.6ddd9b')
          })
        })
    },
    showLuckyDrawDataAction(index, row) {
      this.$router.push({ path: '/member/marketing/luckydraw/team/' + row.luckydraw_id })
    },
    showLuckyDrawAction(index, row) {
      this.$router.push({
        path: '/member/marketing/luckydraw/add/' + row.luckydraw_id,
        query: { show: '1' }
      })
    },
    editLuckyDrawAction(index, row) {
      this.$router.push({ path: '/member/marketing/luckydraw/add/' + row.luckydraw_id })
    },
    finishLuckyDrawAction(index, row) {
      this.$confirm(this.$t('f31a353f.cc0663'), this.$t('f31a353f.02d981'), {
        confirmButtonText: this.$t('f31a353f.38cf16'),
        cancelButtonText: this.$t('f31a353f.625fb2'),
        type: 'warning'
      })
        .then(() => {
          finishLuckyDrawActivity(row.luckydraw_id).then((res) => {
            this.getLuckyDrawList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('f31a353f.2111cc')
          })
        })
    },
    deleteLuckyDrawAction(index, row) {
      this.$confirm(this.$t('f31a353f.f6e90f'), this.$t('f31a353f.02d981'), {
        confirmButtonText: this.$t('f31a353f.38cf16'),
        cancelButtonText: this.$t('f31a353f.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteLuckyDrawActivity(row.luckydraw_id).then((res) => {
            this.getLuckyDrawList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('f31a353f.2111cc')
          })
        })
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    }
  }
}
</script>

<style scoped></style>
