<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="8" :lg="7">
        <el-input placeholder="手机号" v-model="mobile" clearable
          ><el-button slot="append" icon="el-icon-search" @click="numberSearch"></el-button
        ></el-input>
      </el-col>
      <el-col :md="8" :lg="7">
        <el-date-picker
          v-model="datetime"
          type="daterange"
          value-format="yyyy/MM/dd"
          placeholder="选择日期范围"
          style="width: 100%;"
          @change="dateChange"
        ></el-date-picker>
      </el-col>
    </el-row>
    <el-table :data="checkInList" :height="wheight - 80" v-loading="loading">
      <el-table-column prop="user_name" label="会员" width="170"></el-table-column>
      <el-table-column prop="create_time" label="签到时间" width="100"></el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-center content-top-padded">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.page_size"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { listCheckInList } from '../../../api/promotions'
export default {
  data() {
    return {
      checkInList: [],
      loading: false,
      total_count: 0,
      datetime: '',
      mobile: '',
      params: {
        mobile: '',
        start_date: '',
        end_date: '',
        page: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    numberSearch() {
      this.params.mobile = this.mobile
      this.params.page = 1
      this.getDataList()
    },
    dateChange(val) {
      if (val && val.length > 0) {
        this.params.start_date = val[0]
        this.params.end_date = val[1]
      } else {
        this.params.start_date = ''
        this.params.end_date = ''
      }
      this.params.page = 1
      this.getDataList(this.params)
    },
    dateStrToTimeStamp(str) {
      return Date.parse(new Date(str)) / 1000
    },
    getDataList() {
      this.loading = true
      listCheckInList(this.params).then((response) => {
        this.checkInList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    }
  },
  mounted() {
    this.getDataList()
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
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
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
