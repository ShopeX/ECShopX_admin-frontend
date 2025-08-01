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
            <h2>{{ key.operator_content?.title }}</h2>
            <p>操作人员：{{ key.operator_id ?? key.user_id }}</p>
            <p>
              人员类型：{{ key.operator_id > 0 ? '管理员' : '-' }}
            </p>
            <p>操作详情：{{ key.operator_content?.remark }}</p>
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
<script>
export default {
  data() {
    return {
      loading: false,
      invoice_id: '',
      list: []
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.invoice_id = this.$route.query.id
    }
    this.getProcessLogInfo()
  },
  methods: {
    retrunClick() {
      this.$router.go(-1)
    },
    getProcessLogInfo() {
      this.loading = true
      this.$api.financial.getInvoiceLog({invoice_id:this.invoice_id}).then((response) => {
        this.list = response.list.map(item=>({...item,operator_content:JSON.parse(item.operator_content)}))
        console.log(this.list)
        this.loading = false
      })
    }
  }
}
</script>
