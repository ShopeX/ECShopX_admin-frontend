<template>
  <div class="merchantList">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>操作列表</span>
        </div>
        <SpFinder
          ref="finder"
          :split-count="2"
          :search-row-count="2"
          :fixed-row-action="true"
          :setting="setting"
          noSelection
          :hooks="{
            beforeSearch: beforeSearch
          }"
          url="/merchant/list"
        >
         <template v-slot:date>
                <!-- 默认今天，时间最长一周 -->
              <el-date-picker
                v-model="time"
                style="width: 100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeHandle"
              >
              </el-date-picker>
         </template>
        </SpFinder>
      </el-card>
  </div>
</template>

<script>
import setting_ from './setting/setting'
export default {
  data() {
    return {
      time: [],
      operator: '',
      begin_time:'',
      end_time:'',
    }
  },
  mounted() {
    // this.currentDay();
    //  this.$refs.finder.refresh()
  },
  computed: {
    setting() {
      return setting_(this)
    }
  },
  methods: {

    timeHandle(val){
      this.begin_time = val[0];
      this.end_time = val[1];
    },
    day(n) {
      const startTimestamp = new Date(this.begin_time).getTime()
      const endTimestamp = new Date(this.end_time).getTime()
      if (endTimestamp - startTimestamp > n * 24 * 60 * 60 * 1000) {
        this.$message.error('查询范围不能超过一周')
      }
    },
    beforeSearch(params) {
      params.begin_time = this.begin_time
      params.end_time = this.end_time
      
      this.day(7)
      return {...params}
    },
    

  }
}
</script>

<style lang="scss">
.merchantList {
    .yahh{
    color: #ff6700;
  }
  .sp-finder-search .el-input__inner {
    height: 40px;
    line-height: 40px;
  }
  .clearfix span {
    font-weight: 700;
  }
  .search-field{
    width: 500px !important;
  }
  label {
    font-size: 12px;
    color: #000;
  }
  .el-row {
    margin-bottom: 0px;
  }
  .el-table th {
    background: #f5f5f5;
    color: #000;
  }
  .btn {
    border: none;
  }
}
</style>

<style lang="scss" scoped>
.zyk_adapay_account {

  .group {
    margin: 30px 0;
    border: 1px solid #f5f5f5;
    .item {
      padding: 14px 0;
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      .state {
        font-size: 14px;
        color: #000;
        font-weight: 300;
        margin-bottom: 20px;
      }
      .title {
        margin-bottom: 10px;
        border-right: 1px solid #000;
      }
    }
  }
  .tablelist {
    margin: 40px 0;
  }
  .pagination {
    margin: 20px 0;
    text-align: center;
  }
  .tips {
    .title {
      font-size: 15px;
    }
  }
}
</style>