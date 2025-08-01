<template>
  <div class="section-white">
    <div v-loading="loading" class="detail-info">
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
              <span v-else-if="'distributor' == key.operator_type"> 店铺管理员 </span>
              <span v-else> 未知 </span>
            </p>
            <p>操作详情：{{ key.detail }}</p>
            <SpFinder
              ref="finder"
              :data="key.params"
              :setting="{
                columns: [
                  { name: '商品编码', key: 'outer_id' },
                  { name: '同步状态', key: 'sync_status',render(row) {
                    return row.sync_status == success ? '成功' : '失败'
                  } },
                  { name: '原因', key: 'reason' }
                ]
              }"
              :no-selection="true"
            />
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      list: []
    }
  },
  mounted() {
    this.getProcessLogInfo()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    getProcessLogInfo() {
      this.loading = true
      this.$api.goods
        .getSyncTbSpuLogs({
          page: 1,
          pageSize: 1000
        })
        .then((response) => {
          this.list = response.list
          this.loading = false
        })
    }
  }
}
</script>

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
  // max-width: 100px;
  margin: 0 auto;
}
.block {
  margin-left: 85px;
}
.radio {
  margin-bottom: 15px;
}
.img-box {
  display: flex;
  flex-wrap: wrap;
}
.img-item {
  width: 150px;
  height: 150px;
  margin: 0 20px 20px 0;
}
</style>
