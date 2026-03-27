<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="buyerTemplatesList"
      style="width: 100%"
      :height="wheight - 170"
    >
      <el-table-column width="50" prop="template_id" label="ID" />
      <el-table-column prop="name" :label="$t('920c3d68.621f21')" />
      <el-table-column prop="area" :label="$t('920c3d68.087003')">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData }}
        </template>
      </el-table-column>
      <el-table-column width="100" prop="fee" :label="$t('e224c0e0.9a935b')" />
      <el-table-column width="70" :label="$t('920c3d68.3fea7c')">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">{{ $t('920c3d68.7854b5') }}</span>
          <span v-else>{{ $t('920c3d68.b15d91') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('920c3d68.4b9676')">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('920c3d68.2b6bc0')" width="100">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="el-icon-edit-outline" @click="editTemplatesAction(scope.$index, scope.row)" />
            <i
              class="mark el-icon-delete-solid"
              @click="deleteTemplatesAction(scope.$index, scope.row)"
            />
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
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getShippingTemplatesList()
      }
    }
  },
  mounted() {
    this.getShippingTemplatesList()
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
            fee: this.$t('041d0986.56f046'),
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
      this.$confirm(this.$t('920c3d68.e0d827'), this.$t('920c3d68.02d981'), {
        confirmButtonText: this.$t('920c3d68.38cf16'),
        cancelButtonText: this.$t('920c3d68.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteShippingTemplates(row.template_id).then((response) => {
            this.buyerTemplatesList.splice(index, 1)
            this.$message({
              message: this.$t('920c3d68.9f3fee'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('920c3d68.2111cc')
          })
        })
    }
  }
}
</script>

<style scoped></style>
