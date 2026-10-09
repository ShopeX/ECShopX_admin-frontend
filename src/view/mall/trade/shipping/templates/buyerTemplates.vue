<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table v-loading="loading" :data="buyerTemplatesList" border style="width: 100%">
      <el-table-column width="50" prop="template_id" label="ID" />
      <el-table-column prop="name" :label="$t('647ce252.621f21')" />
      <el-table-column prop="area" :label="$t('647ce252.087003')">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData }}
        </template>
      </el-table-column>
      <el-table-column width="100" :label="$t('5946f71f.9a935b')">
        <template slot-scope="scope">
          {{ scope.row.fee === $t('372bd421.56f046') ? $t('372bd421.56f046') : scope.row.fee }}
        </template>
      </el-table-column>
      <el-table-column width="70" :label="$t('647ce252.3fea7c')">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">{{ $t('647ce252.7854b5') }}</span>
          <span v-else>{{ $t('647ce252.b15d91') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('647ce252.4b9676')">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('647ce252.2b6bc0')" width="180">
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
import { mapGetters } from 'vuex'
import { getShippingTemplatesList, deleteShippingTemplates } from '../../../../../api/shipping'
export default {
  props: ['getStatus'],
  data() {
    return {
      loading: false,
      buyerTemplatesList: [],
      total_count: 0,
      params: {
        is_free: 1,
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
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
    },
    getShippingTemplatesList() {
      this.loading = true
      getShippingTemplatesList(this.params).then((response) => {
        this.buyerTemplatesList = []
        for (var item in response.data.data.list) {
          this.buyerTemplatesList.push({
            template_id: response.data.data.list[item].template_id,
            name: response.data.data.list[item].name,
            area: '0',
            fee: this.$t('372bd421.56f046'),
            status: response.data.data.list[item].status,
            updated_at: response.data.data.list[item].update_time
          })
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
            this.buyerTemplatesList.splice(index, 1)
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
    }
  }
}
</script>

<style scoped></style>
