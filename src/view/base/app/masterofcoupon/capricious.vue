<template>
  <div class="section-white content-padded">
    <div class="content-bottom-padded clearfix">
      <div class="f_l">
        <el-tooltip class="item" effect="light" content="添加活动" placement="right-start">
          <el-button type="primary" icon="plus" @click="actionCouponAdd"> 添加活动 </el-button>
        </el-tooltip>
      </div>
      <div class="f_r">
        <el-pagination
          layout="prev, pager, next"
          :total="pagers.total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column prop="active_name" label="活动名称" />
        <el-table-column prop="effective_date" label="有效期">
          <template slot-scope="scope">
            {{ scope.row.begin_date }}~{{ scope.row.end_date }}
          </template>
        </el-table-column>
        <el-table-column prop="gift_content" label="礼品内容" />
        <el-table-column prop="join_num" label="参与数" />
        <el-table-column prop="" label="活动状态">
          <template slot-scope="scope">
            {{ scope.row.active_status | formatStatus }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text"> 查看 </el-button>
            <el-button type="text" @click="remove(scope.$index)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    formatStatus(status) {
      var str = ''
      switch (status) {
        case 0:
          str = '未开始'
          break
        case 1:
          str = '进行中'
          break
        case 2:
          str = '已结束'
          break
      }
      return str
    }
  },
  data() {
    return {
      pageSize: 20,
      pagers: {
        total: 0
      },
      dataList: [
        {
          active_name: 'sdfsdf',
          begin_date: '2016-09-10',
          end_date: '2017-09-10',
          gift_content: 'sdfsdf',
          join_num: 20,
          active_status: 0
        }
      ],
      loading: false
    }
  },
  methods: {
    actionCouponAdd() {
      this.$router.push({ path: '/application/masterofcoupon/capriciousadd' })
    },
    handleCurrentChange(val) {},
    remove(index) {
      this.dataList.splice(index, 1)
    }
  }
}
</script>
