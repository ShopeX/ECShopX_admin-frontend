<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <SpFilterForm :model="formData" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="regionauth_id" label="区域:">
          <el-select v-model="formData.regionauth_id" clearable placeholder="请选择区域">
            <el-option
              v-for="item in areas"
              :key="item.value"
              :label="item.label"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop
            v-model="formData.distributor_id"
            clearable
            placeholder="请选择店铺"
            @change="onSearch"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="supplier_name" label="运费模板名称:" class="inputWrap">
          <el-input v-model="formData.supplier_name" placeholder="请输入" />
        </SpFilterFormItem>
      </SpFilterForm>
      <div class="action-container">
        <el-button type="primary" icon="plus" @click="addTemplates"> 新增运费模板 </el-button>
      </div>
      <!--  -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="卖家承担运费" name="first">
          <buyerTemplates ref="buyerTemplates" :get-status="buyerTemplates" :form-data="formData" />
        </el-tab-pane>
        <el-tab-pane label="买家到付运费" name="six">
          <collectFormTemplates
            ref="collectFormTemplates"
            :get-status="buyerTemplates"
            :form-data="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="按重量运费模板" name="second">
          <weightTemplates
            ref="weightTemplates"
            :get-status="weightTemplates"
            :form-data="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="按件数运费模板" name="third">
          <numberTemplates
            ref="numberTemplates"
            :get-status="numberTemplates"
            :form-data="formData"
          />
        </el-tab-pane>
        <el-tab-pane label="按金额运费模板" name="fourth">
          <priceTemplates ref="priceTemplates" :get-status="priceTemplates" :form-data="formData" />
        </el-tab-pane>
        <el-tab-pane label="按体积运费模板" name="fifth">
          <volumeTemplates
            ref="volumeTemplates"
            :get-status="volumeTemplates"
            :form-data="formData"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- 选择店铺 -->
      <SpDialog
        ref="dialogRef"
        v-model="showDialog"
        title="适用店铺"
        class="dialogRef"
        :modal="false"
        width="900px"
        :form="activityRule"
        :form-list="activityRuleList"
        :is-show-footer="false"
      />

      <!-- 同步出现重复的 -->
      <SpDialog
        ref="errorDialogRef"
        v-model="showErrorDialog"
        title="以下店铺已有关联运费模板，是否确认更新关联运费模板"
        class="dialogRef"
        :modal="false"
        :form="activityRule1"
        :form-list="activityRuleList1"
        confirm-btn-text="确认更新"
        @onSubmit="saveSelectAction"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import buyerTemplates from './templates/buyerTemplates'
import weightTemplates from './templates/weightTemplates'
import numberTemplates from './templates/numberTemplates'
import priceTemplates from './templates/priceTemplates'
import volumeTemplates from './templates/volumeTemplates'
import collectFormTemplates from './templates/collectFormTemplates.vue'
import api from '@/api'

import { generatorParams } from '@/utils/schemaHelper.js'

import schema, { createFormSchema, createErrorFormSchema } from './schema'

export default {
  provide() {
    return {
      refresh: this.getList,
      linkShopHanlde: this.linkShopHanlde
    }
  },
  components: {
    buyerTemplates,
    weightTemplates,
    numberTemplates,
    priceTemplates,
    volumeTemplates,
    collectFormTemplates
  },
  data() {
    return {
      loading: false,
      buyerTemplates: false,
      weightTemplates: false,
      numberTemplates: false,
      priceTemplates: false,
      volumeTemplates: false,
      collectFormTemplates: false,
      activeName: 'first',
      list: [],
      formData: {
        area: '',
        distributor_id: '',
        supplier_name: ''
      },
      areas: [],
      showDialog: false,
      showErrorDialog: false,
      activityRule: {
        ...generatorParams(createFormSchema(this))
      },
      activityRule1: {
        ...generatorParams(createErrorFormSchema(this))
      },
      selectRow: null,
      errorTableData: [],
      innerTableData: [],
      innerFormData: {
        shop_code: '',
        name: ''
      }
    }
  },
  computed: {
    activityRuleList() {
      return createFormSchema(this)
    },
    activityRuleList1() {
      return createErrorFormSchema(this)
    },
    innerTableSchema() {
      return schema.innerTableSchema(this)
    },
    errorTableSchema() {
      return schema?.errorTableSchema
    }
  },
  mounted() {
    if ('undefined' != typeof this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName
    }
    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name
      }))
    })
  },

  methods: {
    addTemplates() {
      // 添加运费模板
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.buyerTemplates = true
      } else if (this.activeName === 'second') {
        this.weightTemplates = true
      } else if (this.activeName === 'third') {
        this.numberTemplates = true
      } else if (this.activeName === 'fourth') {
        this.priceTemplates = true
      } else if (this.activeName === 'fifth') {
        this.volumeTemplates = true
      } else if (this.activeName === 'six') {
        this.collectFormTemplates = true
      }
    },
    getList() {
      this.$refs.getShippingTemplatesList
    },
    onSearch() {
      const refMap = {
        first: 'buyerTemplates',
        second: 'weightTemplates',
        third: 'numberTemplates',
        fourth: 'priceTemplates',
        fifth: 'volumeTemplates',
        six: 'collectFormTemplates'
      }
      this.formData = { ...this.formData }
      this.$refs[refMap[this.activeName]].getShippingTemplatesList()
    },
    onReset() {
      this.formData = {
        area: '',
        distributor_id: '',
        supplier_name: ''
      }
      this.onSearch()
    },
    // 以下是关联店铺绑定操作
    refreshInnerTable() {
      this.queryInnerTableData()
    },
    async linkShopHanlde(row) {
      this.showDialog = true
      this.selectRow = row
      this.queryInnerTableData()
    },
    innerSearch() {
      this.refreshInnerTable()
    },
    innerReset() {
      this.innerFormData = {
        shop_code: '',
        name: ''
      }
      console.log(this.$refs.searchForm)
      this.refreshInnerTable()
    },
    // 查询店铺数据
    async queryInnerTableData() {
      const _res = await api.marketing.queryTagShop({
        page: 1,
        pageSize: 20,
        ship_template_id: this.selectRow?.template_id,
        ...this.innerFormData
      })
      this.innerTableData = _res?.list
    },
    // 选择店铺
    async selectShop() {
      const { data } = await this.$picker.shopV3({
        multiple: true,
        data: this.innerTableData?.map((el) => el.distributor_id),
        setting: schema.shopTableSchema,
        parentId: this.selectRow?.regionauth_id
      })
      const _res = await this.saveHandle(data, 1, 0)
      this.selectShopAfter(_res)
    },
    selectShopAfter(_res) {
      if (_res?.exist_distributors?.length) {
        this.showErrorDialog = true
        this.errorTableData = _res?.exist_distributors
      }
      this.refreshInnerTable()
      this.onSearch()
    },
    // 删除店铺绑定
    deleteHandle(row) {
      this.$confirm('是否确认删除，删除后将无法恢复', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          api.shipping
            .bindToDistributor({
              ship_template_id: this.selectRow?.template_id,
              bind_type: 2,
              is_override: 1,
              shop_code: row.shop_code,
              distributor_id: row.distributor_id
            })
            .then((res) => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
              this.refreshInnerTable()
            })
        })
        .catch((error) => {
          console.log(error)
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 以上是关联店铺绑定操作
    // 覆盖关联店铺
    async saveSelectAction() {
      const _res = await this.saveHandle(this.errorTableData, 1, 1)
      this.$message({
        message: '操作' + _res?.status ? '成功' : '失败',
        type: 'success',
        duration: 5 * 1000
      })
      this.refreshInnerTable()
      this.showErrorDialog = false
      this.onSearch()
    },
    // 绑定操作
    saveHandle(data, bind_type, is_override) {
      return api.shipping.bindToDistributor({
        ship_template_id: this.selectRow?.template_id,
        bind_type,
        is_override,
        shop_code: data?.map((el) => el?.shop_code).join(','),
        distributor_id: data?.map((el) => el?.distributor_id)?.join(',')
      })
    },
    async importAfterHandle(_data) {
      const _filter = _data?.map((el) => {
        return {
          distributor_id: el['店铺ID']
        }
      })
      const _res = await this.saveHandle(_filter, 1, 0)
      this.selectShopAfter(_res)
    },
    // 导入店铺
    async importHandle(file) {
      const csvFile = file.raw
      if (!csvFile) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const csvText = e.target.result
        const data = this.parseCSV(csvText)
        console.log('解析结果:', data)
        this.importAfterHandle(data)
        // 此处处理解析后的数据
      }
      reader.readAsText(csvFile, 'UTF-8')
    },

    parseCSV(csvText) {
      const rows = csvText.split(/\r?\n/) // 按换行符拆分成行
      const result = []
      let headers = []

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].trim()
        if (!row) continue // 跳过空行

        // 处理首行作为表头
        if (i === 0) {
          headers = this.parseCSVRow(row)
          continue
        }

        // 解析数据行并与表头对应
        const fields = this.parseCSVRow(row)
        if (fields.length !== headers.length) {
          console.warn('字段数量不匹配，跳过第', i, '行')
          continue
        }

        const item = {}
        headers.forEach((header, index) => {
          item[header] = fields[index] || ''
        })
        result.push(item)
      }

      return result
    },

    // 解析单行 CSV（处理引号、逗号等特殊情况）
    parseCSVRow(row) {
      const fields = []
      let currentField = ''
      let inQuotes = false

      for (let i = 0; i < row.length; i++) {
        const char = row[i]

        // 遇到引号切换状态
        if (char === '"') {
          if (inQuotes && row[i + 1] === '"') {
            // 处理转义引号 ""
            currentField += '"'
            i++ // 跳过下一个引号
          } else {
            inQuotes = !inQuotes
          }
        } else if (char === ',' && !inQuotes) {
          // 字段结束
          fields.push(currentField)
          currentField = ''
        } else {
          currentField += char
        }
      }

      // 添加最后一个字段
      fields.push(currentField)
      return fields
    },
    //  下载模板
    downloadHandle() {
      const csvContent = 'data:text/csv;charset=gb2312,店铺ID'
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', '店铺ID.csv')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped>
.dialogRef >>> .el-form {
  margin-right: 0px;
}
.inputWrap >>> .form-item__label {
  width: 130px;
}
.inputWrap >>> .form-item__content {
  margin-left: 130px;
}
.action-container {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  padding-top: 10px;
}
</style>
