<template>
  <div class="section-white">
    <div
      v-loading="loading"
      class="detail-info"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(key, index) in list"
          :key="index"
          :timestamp="key.create_time | datetime('YYYY-MM-DD HH:mm:ss')"
          placement="top"
        >
          <el-card>
            <h2>{{ key.remarks }}</h2>
            <p>操作人员：{{ key.operator_name }}</p>
            <p>
              人员类型：
              <span v-if="'user' == key.operator_type"> 用户 </span>
              <span v-else-if="'salesperson' == key.operator_type"> 导购员 </span>
              <span v-else-if="'admin' == key.operator_type"> 管理员 </span>
              <span v-else-if="'system' == key.operator_type"> 系统 </span>
              <span v-else> 未知 </span>
            </p>
            <p>操作详情：{{ key.detail }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped lang="scss" type="text/css">
h3.title {
  padding: 20px;
  font-size: 18px;
  color: #ff5000;
}
.col-3 {
  width: 120px;
  margin-right: 10px;
}
.detail-info {
  margin: 0 10px;
}
.el-row {
  margin-bottom: 10px;
}
.item-image {
  max-width: 80px;
  margin: 0 auto;
}
img {
  max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
</style>
<script>
import { getProcessLog } from '@/api/trade'
export default {
  data () {
    return {
      loading: false,
      order_id: '',
      list: []
    }
  },
  mounted () {
    if (this.$route.query.orderId) {
      this.order_id = this.$route.query.orderId
    }
    this.getProcessLogInfo()
  },
  methods: {
    retrunClick () {
      this.$router.go(-1)
    },
    getProcessLogInfo () {
      this.loading = true
      getProcessLog(this.order_id).then((response) => {
        this.list = response.data.data
        this.loading = false
      })
    }
  }
}
</script>
