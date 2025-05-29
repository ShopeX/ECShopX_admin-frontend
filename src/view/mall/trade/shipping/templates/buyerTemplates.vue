<template>
  <div>
    <el-table
      v-loading="loading"
      :data="buyerTemplatesList"
      border
      style="width: 100%"
      :height="wheight - 170"
    >
      <el-table-column width="50" prop="template_id" label="ID" />
      <el-table-column prop="name" label="运费模板名称" />
      <el-table-column prop="area" label="配送地区">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData }}
        </template>
      </el-table-column>
      <el-table-column width="100" prop="fee" label="运费" />
      <el-table-column width="100" prop="regionauth_name" label="适用区域" />
      <el-table-column width="100" prop="distributor_names" label="适用店铺">
        <template slot-scope="scope">
          <span>{{ scope.row.distributor_names?.toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="price_model" label="计费模式">
        <template slot-scope="scope">
          <span>{{ scope.row.price_model === 'single' ? '单店计费' : '合并计费' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="70" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">启用</span>
          <span v-else>关闭</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="最后修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i class="iconfont icon-edit1" @click="editTemplatesAction(scope.$index, scope.row)" />
            <i
              class="mark iconfont icon-trash-alt1"
              @click="deleteTemplatesAction(scope.$index, scope.row)"
            />
            <span @click="linkHanlde(scope.$index, scope.row)">关联店铺</span>
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
import { getShippingTemplatesList, deleteShippingTemplates } from '@/api/shipping'
export default {
  props: ['getStatus', 'formData'],
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
  inject: ['linkShopHanlde'],
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
      getShippingTemplatesList({ ...this.params, ...this.formData }).then((response) => {
        this.buyerTemplatesList = []
        for (var item in response.data.data.list) {
          const _inner = response.data.data.list[item]
          this.buyerTemplatesList.push({
            template_id: _inner.template_id,
            name: _inner.name,
            area: '0',
            fee: '包邮',
            status: _inner.status,
            updated_at: _inner.update_time,
            distributor_names: _inner.distributor_names,
            price_model: _inner.price_model,
            regionauth_name: _inner.regionauth_name,
            regionauth_id: _inner.regionauth_id
          })
        }
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    editTemplatesAction(index, row) {
      this.$router.push({ path: this.matchHidePage('editor/') + row.template_id })
    },
    deleteTemplatesAction(index, row) {
      this.$confirm('此操作将删除该运费模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteShippingTemplates(row.template_id).then((response) => {
            this.buyerTemplatesList.splice(index, 1)
            this.$message({
              message: '删除运费模板成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    linkHanlde(_, row) {
      this.linkShopHanlde(row)
    }
  }
}
</script>

<style scoped></style>
