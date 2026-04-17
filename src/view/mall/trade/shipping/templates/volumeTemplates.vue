<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="weightTemplatesList"
      :span-method="objectSpanMethod"
      style="width: 100%"
      border
      height="580"
    >
      <el-table-column prop="template_id" label="ID" />
      <el-table-column prop="name" :label="$t('647ce252.621f21')" />
      <el-table-column :label="$t('647ce252.087003')">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData(district) }}
        </template>
      </el-table-column>
      <el-table-column prop="start_standard" :label="$t('8106bcba.748118')" />
      <el-table-column prop="start_fee" :label="$t('647ce252.23e30a')" />
      <el-table-column prop="add_standard" :label="$t('8106bcba.2e42ab')" />
      <el-table-column prop="add_fee" :label="$t('647ce252.0dc2ad')" />
      <el-table-column :label="$t('647ce252.3fea7c')">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">{{ $t('647ce252.7854b5') }}</span>
          <span v-else>{{ $t('647ce252.b15d91') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('647ce252.4b9676')">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('647ce252.2b6bc0')" width="250">
        <template slot-scope="scope">
          <div class="operating-icons">
            <el-button type="text" @click="editTemplatesAction(scope.$index, scope.row)">
              {{ $t('647ce252.95b351') }}
            </el-button>
            <el-button type="text" @click="deleteTemplatesAction(scope.$index, scope.row)">
              {{ $t('647ce252.2f4aad') }}
            </el-button>
          </div>
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
import { getShippingTemplatesList, deleteShippingTemplates } from '../../../../../api/shipping'
import { getAddress } from '../../../../../api/common'
export default {
  props: ['getStatus'],
  data() {
    return {
      district: {},
      loading: false,
      templateName: '',
      weightTemplatesList: [],
      total_count: 0,
      params: {
        is_free: 0,
        valuation: 4,
        page: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getShippingTemplatesList()
      }
    }
  },
  mounted() {
    this.getAddress()
    this.getShippingTemplatesList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
    },
    getShippingTemplatesList() {
      this.loading = true
      getShippingTemplatesList(this.params).then((response) => {
        this.weightTemplatesList = []
        for (var item in response.data.data.list) {
          response.data.data.list[item].fee_conf = JSON.parse(
            response.data.data.list[item].fee_conf
          )
          for (var conf_fee_item in response.data.data.list[item].fee_conf) {
            var temp = {
              template_id: response.data.data.list[item].template_id,
              name: response.data.data.list[item].name,
              count: '0',
              area: response.data.data.list[item].fee_conf[conf_fee_item].area,
              start_standard: response.data.data.list[item].fee_conf[conf_fee_item].start_standard,
              start_fee: response.data.data.list[item].fee_conf[conf_fee_item].start_fee,
              add_standard: response.data.data.list[item].fee_conf[conf_fee_item].add_standard,
              add_fee: response.data.data.list[item].fee_conf[conf_fee_item].add_fee,
              status: response.data.data.list[item].status,
              updated_at: response.data.data.list[item].update_time
            }
            if (0 == conf_fee_item) {
              temp.count = response.data.data.list[item].fee_conf.length
            }
            this.weightTemplatesList.push(temp)
          }
        }
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    editTemplatesAction(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.template_id })
    },
    deleteTemplatesAction(index, row) {
      this.$confirm(this.$t('647ce252.e0d827'), this.$t('647ce252.02d981'), {
        confirmButtonText: this.$t('647ce252.38cf16'),
        cancelButtonText: this.$t('647ce252.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteShippingTemplates(row.template_id).then((response) => {
            this.weightTemplatesList.splice(index, 1)
            this.$message({
              message: this.$t('647ce252.9f3fee'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('647ce252.2111cc')
          })
        })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      var arrCol = [0, 1, 7, 8, 9]
      if (arrCol.indexOf(columnIndex) > -1) {
        if (row.count > 0) {
          return {
            rowspan: row.count,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    getAddress() {
      getAddress().then((res) => {
        this.district = res.data.data
      })
    }
  }
}
</script>

<style scoped></style>
