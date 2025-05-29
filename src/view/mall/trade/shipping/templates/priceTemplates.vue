<template>
  <div>
    <el-table
      v-loading="loading"
      :data="priceTemplatesList"
      :span-method="objectSpanMethod"
      border
      :height="wheight - 170"
    >
      <el-table-column width="50" prop="template_id" label="ID" />
      <el-table-column width="100" prop="regionauth_name" label="适用区域" />
      <el-table-column width="150" prop="name" label="运费模板名称" />
      <el-table-column width="200" label="配送地区">
        <template slot-scope="scope">
          {{ scope.row.area | formatCityData(district) }}
        </template>
      </el-table-column>
      <el-table-column prop="up" label="金额下限(元)" />
      <el-table-column prop="down" label="金额上限(元)" />
      <el-table-column prop="basefee" label="运费" />
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
      <el-table-column label="操作" width="140">
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
import { getAddress } from '@/api/common'
export default {
  props: ['getStatus', 'formData'],
  data() {
    return {
      district: {},
      loading: false,
      templateName: '',
      priceTemplatesList: [],
      total_count: 0,
      params: {
        is_free: 0,
        valuation: 3,
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
        this.priceTemplatesList = []
        var temp = []
        for (var item in response.data.data.list) {
          response.data.data.list[item].fee_conf = JSON.parse(
            response.data.data.list[item].fee_conf
          )
          const _inner = response.data.data.list[item]
          temp[_inner.template_id] = []
          for (var conf_fee_item in _inner.fee_conf) {
            const _innerConfig = _inner.fee_conf[conf_fee_item]
            for (var rules_item in _innerConfig.rules) {
              temp[_inner.template_id].push({
                area: _innerConfig.area,
                up: _innerConfig.rules[rules_item].up,
                down: _innerConfig.rules[rules_item].down,
                basefee: _innerConfig.rules[rules_item].basefee,
                template_id: _inner.template_id,
                name: _inner.name,
                count: '0',
                status: _inner.status,
                updated_at: _inner.update_time,
                distributor_names: _inner.distributor_names,
                price_model: _inner.price_model,
                regionauth_name: _inner.regionauth_name,
                regionauth_id: _inner.regionauth_id
              })
            }
          }
        }
        for (var i in temp) {
          for (var j in temp[i]) {
            if (0 == j) {
              temp[i][j].count = temp[i].length
            }
            this.priceTemplatesList.push(temp[i][j])
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
            this.priceTemplatesList.splice(index, 1)
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
      var arrCol = [0, 1, 6, 7, 8]
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
