<template>
  <SpRouterView>
    <SpFinder
      ref="finder"
      url="/orders/items"
      fixed-row-action
      row-actions-width="100px"
      :setting="tableSchema"
      :hooks="{
        beforeSearch
      }"
      row-actions-fixed-align="left"
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
    >
      <template v-slot:tableTop>
        <!-- 操作按钮 -->
        <div class="action-container">
          <div style="height: 20px" />
          <el-dropdown>
            <el-button type="primary" plain>
              导出<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <export-tip @exportHandle="exportInvoice"> 未开票订单 </export-tip>
              </el-dropdown-item>
              <el-dropdown-item>
                <export-tip @exportHandle="exportDataMaster"> 主订单 </export-tip>
              </el-dropdown-item>
              <el-dropdown-item>
                <export-tip @exportHandle="exportDataNormal"> 子订单 </export-tip>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 选择tab -->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in audit_status"
            :key="item.value"
            :label="item.label"
            :name="item.value"
          />
        </el-tabs>
      </template>
      <template v-slot:shop>
        <SpSelectShop
          ref="selectShop"
          v-model="params.distributor_id"
          clearable
          placeholder="请选择"
        />
      </template>
    </SpFinder>
  </SpRouterView>
</template>
<script>
import api from '@/api'
import moment from 'moment'
import { createTableSchema } from './schema'
import { exportInvoice, orderExport } from '@/api/trade'

export default {
  data() {
    return {
      areas: [],
      activeName: 'all',
      orderSourceList: [],
      audit_status: [
        {
          label: '全部',
          value: 'all'
        }
      ],
      params: {
        distributor_id: ''
      },
      showMobileMap: []
    }
  },
  computed: {
    tableSchema() {
      return createTableSchema(this)
    }
  },
  mounted() {
    this.getAreas()
  },
  methods: {
    beforeSearch(params) {
      if (params.time?.length) {
        params.begin_time = moment(params.time[0]).format('YYYY-MM-DD HH:mm:ss')
        params.end_time = moment(params.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      if (params.delivery_time?.length) {
        params.begin_delivery_time = moment(params.delivery_time[0]).format('YYYY-MM-DD HH:mm:ss')
        params.end_delivery_time = moment(params.delivery_time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      if (params.pay_time?.length) {
        params.begin_pay_time = moment(params.pay_time[0]).format('YYYY-MM-DD HH:mm:ss')
        params.end_pay_time = moment(params.pay_time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      const _after = {
        ...params,
        ...this.params
      }
      this.queryParams = _after
      console.log(_after)
      return _after
    },
    handleClick(tab) {
      console.log(tab)
    },
    getAreas() {
      api.regionauth.getRegionauth().then((res) => {
        this.areas = res?.list?.map((el) => ({
          value: el.regionauth_id,
          label: el.regionauth_name,
          title: el.regionauth_name
        }))
      })
    },
    handleSelectionChange(selection) {
      console.log(selection)
    },
    exportInvoice() {
      let type = 'normal'
      this.$emit('onChangeData', 'params', { type })
      exportInvoice({
        ...this.params,
        type,
        order_type: 'normal'
      }).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('invoice')
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    exportDataNormal() {
      this.exportData('normal_order')
    },
    exportDataMaster() {
      this.exportData('normal_master_order')
    },
    exportData(type) {
      console.log('====exportData', type)
      let params = {
        ...this.params,
        order_type: 'normal',
        type,
        page: this.page.pageIndex
      }
      if (Array.isArray(this.params.create_time) && this.params.create_time.length >= 2) {
        params.time_start_begin = moment(this.params.create_time[0]).unix()
        params.time_start_end = moment(this.params.create_time[1]).unix()
      }

      if (Array.isArray(this.params.delivery_time) && this.params.delivery_time.length >= 2) {
        params.delivery_time_begin = moment(this.params.delivery_time[0]).unix()
        params.delivery_time_end = moment(this.params.delivery_time[1]).unix()
      }

      delete params.create_time
      delete params.delivery_time

      orderExport(params).then((response) => {
        const { status, url, filename } = response.data.data
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open(type)
          return
        } else if (url) {
          window.open(url)
        } else {
          this.$message.error('无内容可导出或执行失败，请检查重试')
          return
        }
      })
    },
    detailHandle(row) {
      console.log(row)
      this.$router.push({
        path: `${this.$route.path}/detail?orderId=${row.order_id}&resource=${this.$route.path}`
      })
    },
    logHandle(row) {
      console.log(row)
      this.$router.push({
        path: `${this.$route.path}/process?orderId=${row.order_id}&resource=${this.$route.path}`
      })
    }
  }
}
</script>
<style lang="scss" scope></style>
