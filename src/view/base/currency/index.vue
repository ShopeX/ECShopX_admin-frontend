<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" @click="addCurrency">
          {{ $t('7c0967bc.e4507b') }}
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="params.currency" :placeholder="$t('7c0967bc.2d2c55')">
          <el-button slot="append" icon="el-icon-search" @click="dataSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="currencyList" :height="wheight - 160">
      <el-table-column prop="title" :label="$t('7c0967bc.dfeeea')">
        <template slot-scope="scope">
          {{ getCurrencyTitle(scope.row.currency, scope.row.title) }}
        </template>
      </el-table-column>
      <el-table-column prop="currency" :label="$t('7c0967bc.64bc57')" />
      <el-table-column prop="symbol" :label="$t('7c0967bc.61134f')" />
      <!-- <el-table-column prop="rate" :label="$t('7c0967bc.f8d735')" /> -->
      <el-table-column prop="is_default" :label="$t('7c0967bc.69c562')">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_default"
            :disabled="scope.row.is_default ? true : false"
            @change="setDefault(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('7c0967bc.2b6bc0')">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.is_default"
            size="mini"
            @click="deleteAction(scope.$index, scope.row)"
          >
            {{ $t('7c0967bc.2f4aad') }}
          </el-button>
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
    <!-- 添加货币-开始 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="handleCancel">
      <template>
        <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm" label-width="220px">
          <el-form-item :label="$t('7c0967bc.c3a8f1')" prop="selectedCurrency">
            <el-col :span="10">
              <el-select
                v-model="form.selectedCurrency"
                :placeholder="$t('7c0967bc.f9b2e4')"
                class="w-full"
                @change="handleCurrencyChange"
              >
                <el-option
                  v-for="item in currencyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('7c0967bc.7e9638')">
            <el-col :span="10">
              <el-input :value="selectedCurrencyTitle" disabled />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('7c0967bc.928964')" prop="currency">
            <el-col :span="10">
              <el-input v-model="form.currency" disabled />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('7c0967bc.61134f')" prop="symbol">
            <el-col :span="10">
              <el-input v-model="form.symbol" disabled />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel">{{ $t('7c0967bc.625fb2') }}</el-button>
        <el-button type="primary" @click="submitAction">{{ $t('7c0967bc.be5fbb') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  createCurrencyInfo,
  getCurrencytLists,
  deleteCurrencyInfo,
  setDefaultCurrency
} from '../../../api/company'

const CURRENCY_PRESET_META = {
  CNY: {
    titleKey: '7c0967bc.e8a1c0',
    titleStore: '中国人民币',
    currency: 'CNY',
    symbol: '￥'
  },
  HKD: {
    titleKey: '7c0967bc.e8h1k0',
    titleStore: '香港港币',
    currency: 'HKD',
    symbol: 'HK$'
  },
  USD: {
    titleKey: '7c0967bc.e8u1s0',
    titleStore: '美国美元',
    currency: 'USD',
    symbol: '$'
  }
}

export default {
  data() {
    return {
      dynamicShopName: [],
      dynamicStoreName: [],
      inputVisible: false,
      inputStoreVisible: false,
      inputValue: '',
      dialogVisible: false,
      dialogTitle: '',
      form: {
        selectedCurrency: '',
        symbol: '',
        currency: '',
        rate: 1,
        is_default: false,
        use_platform: 'normal'
      },
      activeName: 'first',
      currencyList: [],
      detailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        currency: ''
      },
      rules: {
        selectedCurrency: [
          { required: true, message: this.$t('7c0967bc.f9b2e4'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    currencyOptions() {
      return [
        { value: 'CNY', label: this.$t('7c0967bc.b2e5f0') },
        { value: 'HKD', label: this.$t('7c0967bc.c4f6a1') },
        { value: 'USD', label: this.$t('7c0967bc.d5f7b2') }
      ]
    },
    selectedCurrencyTitle() {
      const meta = CURRENCY_PRESET_META[this.form.selectedCurrency]
      return meta ? this.$t(meta.titleKey) : ''
    }
  },
  mounted() {
    this.getCurrencytListData()
  },
  methods: {
    handleCancel() {
      this.dialogVisible = false
      this.form.selectedCurrency = ''
      this.form.symbol = ''
      this.form.currency = ''
      this.form.rate = 1
      this.form.is_default = false
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getCurrencytListData()
    },
    addCurrency() {
      this.dialogTitle = this.$t('7c0967bc.55f870')
      this.dialogVisible = true
      this.form.selectedCurrency = ''
      this.form.symbol = ''
      this.form.currency = ''
      this.form.rate = 1
      this.form.is_default = false
    },
    getCurrencyTitle(currencyCode, fallbackTitle) {
      const meta = CURRENCY_PRESET_META[currencyCode]
      if (meta) {
        return this.$t(meta.titleKey)
      }
      return fallbackTitle
    },
    handleCurrencyChange(value) {
      const meta = CURRENCY_PRESET_META[value]
      if (!meta) {
        return
      }
      this.form.currency = meta.currency
      this.form.symbol = meta.symbol
    },
    submitAction() {
      if (!this.form.selectedCurrency || !this.form.currency) {
        this.$message({
          type: 'error',
          message: this.$t('7c0967bc.d14d9c')
        })
        return
      }

      const exists = this.currencyList.some((item) => item.currency === this.form.currency)
      if (exists) {
        this.$message({
          type: 'error',
          message: this.$t('7c0967bc.a7d1c8')
        })
        return
      }

      const meta = CURRENCY_PRESET_META[this.form.selectedCurrency]
      const payload = {
        currency: meta.currency,
        title: meta.titleStore,
        symbol: meta.symbol,
        rate: 1,
        is_default: this.form.is_default,
        use_platform: this.form.use_platform
      }

      createCurrencyInfo(payload).then(() => {
        this.dialogVisible = false
        this.getCurrencytListData()
        this.handleCancel()
      })
    },
    dataSearch() {
      this.params.page = 1
      this.getCurrencytListData()
    },
    getCurrencytListData() {
      this.loading = true
      getCurrencytLists(this.params).then((response) => {
        this.currencyList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteAction(index, row) {
      this.$confirm(this.$t('7c0967bc.80ae2a'), this.$t('7c0967bc.02d981'), {
        confirmButtonText: this.$t('7c0967bc.38cf16'),
        cancelButtonText: this.$t('7c0967bc.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteCurrencyInfo(row.id).then((response) => {
            this.currencyList.splice(index, 1)
            this.$message({
              message: this.$t('7c0967bc.0007d1'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('7c0967bc.2111cc')
          })
        })
    },
    setDefault(row) {
      setDefaultCurrency(row.id).then((response) => {
        this.getCurrencytListData()
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}
.new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.button-new-tag {
  height: 40px;
  line-height: 40px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  height: 40px;
  line-height: 40px;
  width: 138px;
  vertical-align: bottom;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
