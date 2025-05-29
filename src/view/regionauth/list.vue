<template>
  <div class="page-body">
    <SpRouterView>
      <SpFinder
        ref="finder"
        url="/regionauth"
        fixed-row-action
        row-actions-width="200px"
        :other-config="{}"
        :setting="tableSchema"
        no-selection
        :hooks="{
          beforeSearch
        }"
        row-actions-fixed-align="left"
      >
        <template v-slot:tableTop>
          <!-- 操作按钮 -->
          <div class="action-container">
            <div style="height: 20px" />
            <el-button type="primary" plain @click="addConfigHandle">添加区域</el-button>
          </div>
        </template>
      </SpFinder>
    </SpRouterView>
  </div>
</template>
<script>
import { createTableSchema } from './schema.js'
import api from '@/api'

export default {
  data() {
    return {}
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
    }
  },
  watch: {
    '$route'(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 页面初始化
    init() {
      this.$refs.finder.refresh(true)
    },
    // 新增
    addConfigHandle() {
      this.$router.push({
        path: '/sellers/salesorganization/regionalManagement/detail'
      })
    },
    // 修改
    editRowDataHandle(row) {
      this.$router.push({
        path: '/sellers/salesorganization/regionalManagement/detail/' + row.regionauth_id
      })
    },
    // 删除
    async deleteRowDataHandle(row) {
      this.$confirm('确定删除此区域吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await api.regionauth.delRegionauth(row.regionauth_id)
          this.$refs.finder.refresh(true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 筛选事件
    beforeSearch(params) {
      params = {
        ...params
      }
      return params
    },
    async changeStateHanlde(val) {
      console.log(val)
      try {
        const res = await api.regionauth.enableRegionauth(val.regionauth_id, {
          state: val.state == 'false' ? true : false
        })
        this.$refs.finder.refresh(true)
      } catch (error) {
        console.log(error)
      }
    },
    // 微信支付配置
    wechatPayConfigHandle(row) {
      this.$router.push({
        path: '/sellers/salesorganization/regionalManagement/wechatPayConfig',
        query: {
          regionauth_id: row.regionauth_id
        }
      })
    }
  }
}
</script>
<style scoped></style>
