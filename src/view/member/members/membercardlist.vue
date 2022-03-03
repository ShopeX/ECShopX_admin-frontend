<template>
  <div class="section-white">
    <el-row v-if="vipGradeIsOpen" class="content-bottom-padded" :gutter="24">
      <div v-for="item in userVipGrade" :key="item.vip_grade_id">
        <el-col :span="10">
          {{ item.grade_name }}
          <el-input
            v-if="item.is_had_vip"
            type="number"
            maxlength="4"
            minlength="1"
            v-model="vipGradeAddDay[item.lv_type].day"
            :blur="updateVipGradeDate(item.vip_grade_id, item.lv_type)"
          >
            <template slot="prepend">{{ item.end_time }} 到期，延期</template
            ><template slot="append">天</template>
          </el-input>
          <el-input
            v-else
            type="number"
            maxlength="4"
            minlength="1"
            v-model="vipGradeAddDay[item.lv_type].day"
            :blur="updateVipGradeDate(item.vip_grade_id, item.lv_type)"
          >
            <template slot="prepend">未购买过该会员卡，当天延期</template
            ><template slot="append">天</template>
          </el-input>
        </el-col>
      </div>
      <el-button type="primary" @click="saveVipGradeDate()">保存</el-button>
    </el-row>
    <div class="membercard-list">
      <el-table :data="vipGradeList" border v-loading="loading">
        <el-table-column prop="order_id" label="订单号"></el-table-column>
        <el-table-column prop="lv_type" label="会员卡等级" width="100"></el-table-column>
        <el-table-column prop="title" label="会员卡名称"></el-table-column>
        <el-table-column prop="card_type" label="会员卡类型" width="100">
          <template slot-scope="scope">
            {{ scope.row.card_type.desc }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="会员手机号"></el-table-column>
        <el-table-column prop="price" label="购买金额" width="100">
          <template slot-scope="scope"> ￥{{ scope.row.price / 100 }} </template>
        </el-table-column>
        <el-table-column prop="discount" label="折扣值" width="100">
          <template slot-scope="scope">{{ (100 - scope.row.discount) / 100 }}折</template>
        </el-table-column>
        <el-table-column prop="created" label="下单时间" width="170">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="source_type" label="来源" width="170">
          <template slot-scope="scope">
            <span v-if="scope.row.source_type == 'receive'">领取获得</span>
            <span v-if="scope.row.source_type == 'sale'">购买获得</span>
            <span v-if="scope.row.source_type == 'gift'">赠送获得</span>
            <span v-if="scope.row.source_type == 'admin'">后台手动操作</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total_count > params.pageSize" class="content-padded tc">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        @current-change="handleCurrentChange"
        :total="total_count"
        :page-size="params.pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { listVipGrade } from '../../../api/member'
import { getAllUserVipGrade, receiveMemberCard } from '../../../api/cardticket'
export default {
  props: ['userId', 'userMobile', 'isLoad'],
  data() {
    return {
      loading: false,
      total_count: 0,
      vipGradeList: [],
      userVipGrade: [],
      vipGradeAddDay: {
        vip: {
          day: 0,
          vip_grade_id: 0
        },
        svip: {
          day: 0,
          vip_grade_id: 0
        }
      },
      vipGradeIsOpen: false,
      currentPage: 1,
      pageSize: 20,
      params: {}
    }
  },
  methods: {
    updateVipGradeDate(vip_grade_id, type) {
      if (type == 'vip') {
        this.vipGradeAddDay.vip.vip_grade_id = vip_grade_id
      } else {
        this.vipGradeAddDay.svip.vip_grade_id = vip_grade_id
      }
    },
    saveVipGradeDate() {
      var params = {
        user_id: this.userId,
        mobile: this.userMobile,
        vipGradeAddDay: JSON.stringify(this.vipGradeAddDay)
      }
      receiveMemberCard(params).then((res) => {
        this.getAllUserVipGrade()
        this.getList({ page: 1, pageSize: this.pageSize, user_id: this.userId })
        this.vipGradeAddDay = {
          vip: {
            day: 0,
            vip_grade_id: 0
          },
          svip: {
            day: 0,
            vip_grade_id: 0
          }
        }
        this.$message({
          type: 'success',
          message: '操作成功'
        })
      })
    },

    getAllUserVipGrade() {
      if (this.userId) {
        getAllUserVipGrade({ user_id: this.userId }).then((res) => {
          this.vipGradeIsOpen = res.data.data.is_open
          this.userVipGrade = res.data.data.list
        })
      }
    },
    getList(params) {
      this.loading = true
      this.getAllUserVipGrade()
      listVipGrade(params).then((res) => {
        this.vipGradeList = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.loading = false
      this.getParams()
      this.getList(this.params)
    },
    getParams() {
      this.params.page = this.currentPage
      this.params.pageSize = this.pageSize
    }
  },
  mounted() {
    this.params.user_id = this.userId
    this.getParams()
    this.getList(this.params)
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: newVal }
        this.getList(this.params)
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        this.params = { page: this.currentPage, pageSize: this.pageSize, user_id: this.userId }
        this.getList(this.params)
      }
    }
  }
}
</script>
<style type="text/css">
.record-list .el-table .cell,
.record-list .el-table th > div {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
