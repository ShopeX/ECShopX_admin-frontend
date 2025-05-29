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
      <el-table-column width="100" prop="regionauth_name" label="适用区域" />
      <el-table-column prop="name" label="运费模板名称" />
      <el-table-column label="配送地区">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData(district) }}
        </template>
      </el-table-column>
      <el-table-column prop="start_standard" label="首体积(m³)" />
      <el-table-column prop="start_fee" label="首费(元)" />
      <el-table-column prop="add_standard" label="续体积(m³)" />
      <el-table-column prop="add_fee" label="续费(元)" />
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
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == true">启用</span>
          <span v-else>关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at | datetime('YYYY-MM-DD') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
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
import { getShippingTemplatesList, deleteShippingTemplates } from '@/api/shipping'
import { getAddress } from '@/api/common'
export default {
  props: ['getStatus', 'formData'],
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
  inject: ['linkShopHanlde'],
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
      getShippingTemplatesList({ ...this.params, ...this.formData }).then((response) => {
        this.weightTemplatesList = []
        for (var item in response.data.data.list) {
          response.data.data.list[item].fee_conf = JSON.parse(
            response.data.data.list[item].fee_conf
          )
          const _inner = response.data.data.list[item]
          for (var conf_fee_item in _inner.fee_conf) {
            const _innerConfig = _inner.fee_conf[conf_fee_item]
            var temp = {
              template_id: _inner.template_id,
              name: _inner.name,
              count: '0',
              area: _innerConfig.area,
              start_standard: _innerConfig.start_standard,
              start_fee: _innerConfig.start_fee,
              add_standard: _innerConfig.add_standard,
              add_fee: _innerConfig.add_fee,
              status: _inner.status,
              updated_at: _inner.update_time,
              distributor_names: _inner.distributor_names,
              price_model: _inner.price_model,
              regionauth_name: _inner.regionauth_name,
              regionauth_id: _inner.regionauth_id
            }
            if (0 == conf_fee_item) {
              temp.count = _inner.fee_conf.length
            }
            this.weightTemplatesList.push(temp)
          }
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
            this.weightTemplatesList.splice(index, 1)
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
    },
    linkHanlde(_, row) {
      this.linkShopHanlde(row)
    }
  }
}
</script>

<style scoped></style>
