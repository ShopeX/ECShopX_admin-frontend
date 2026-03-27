<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <div class="content-bottom-padded">
      <el-alert :title="$t('b65a927c.6f32fc')" type="warning" show-icon />
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button type="primary" icon="plus" size="mini" @click="addServiceLabels">
          {{ $t('b65a927c.b0a7ff') }}
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input v-model="labelsName" :placeholder="$t('b65a927c.69ae78')" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="labelsSearch" />
        </el-input>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="serviceLabelsList" :height="wheight - 270">
      <el-table-column prop="labelName" :label="$t('b65a927c.901fca')" />
      <el-table-column width="120" prop="serviceType" :label="$t('b65a927c.996dc3')">
        <template slot-scope="scope">
          <span v-if="scope.row.serviceType === 'point'">{{ $t('b65a927c.9f68a8') }}</span>
          <span v-if="scope.row.serviceType === 'deposit'">{{ $t('b65a927c.0ae749') }}</span>
          <span v-if="scope.row.serviceType === 'timescard'">{{ $t('b65a927c.cc572d') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="labelPrice"
        :label="$t('b65a927c.43fcf7')"
        :formatter="priceformatter"
      />
      <el-table-column width="120" :label="$t('b65a927c.2b6bc0')">
        <template slot-scope="scope">
          <div class="operating-icons">
            <i
              class="iconfont icon-search-plus"
              @click="serviceLabelsDetail(scope.$index, scope.row)"
            />
            <i
              class="el-icon-edit-outline"
              @click="editServiceLabelsAction(scope.$index, scope.row)"
            />
            <i
              class="mark el-icon-delete-solid"
              @click="deleteServiceLabelsAction(scope.$index, scope.row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="content-center content-top-padded">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="params.page"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      :title="editServiceLabelsTitle"
      :visible.sync="editServiceLabelsVisible"
      :before-close="handleCancel"
    >
      <template>
        <el-form ref="form" :model="form" class="demo-ruleForm" label-width="90px">
          <el-form-item :label="$t('b65a927c.996dc3')">
            <el-col :span="14">
              <el-select v-model="form.service_type">
                <el-option
                  v-for="item in serviceTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('b65a927c.901fca')">
            <el-col :span="14">
              <el-input
                v-model="form.label_name"
                :maxlength="20"
                :placeholder="$t('b65a927c.dad414')"
              />
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('b65a927c.43fcf7')">
            <el-col :span="6">
              <el-input
                v-model="form.label_price"
                type="number"
                required
                min="0"
                :placeholder="$t('b65a927c.c7ff77')"
              />
            </el-col>
            <el-col :span="1"> &nbsp;{{ $t('b65a927c.c16655') }} </el-col>
          </el-form-item>
          <el-form-item :label="$t('b65a927c.aae11e')">
            <el-col :span="14">
              <el-input v-model="form.label_desc" type="textarea" :maxlength="255" />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="handleCancel"> {{ $t('b65a927c.625fb2') }} </el-button>
        <el-button type="primary" @click="submitServiceLabelsAction">
          {{ $t('b65a927c.be5fbb') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加、编辑基础物料-结束 -->
    <!-- 基础物料详情-开始 -->
    <el-dialog :title="$t('b65a927c.fd1456')" :visible.sync="serviceLabelsDetailVisible">
      <template>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">{{ $t('b65a927c.28672e') }}</div>
          </el-col>
          <el-col :span="12">
            <div v-if="serviceLabelsDetailData.service_type === 'point'">
              {{ $t('b65a927c.4ab744') }}
            </div>
            <div v-if="serviceLabelsDetailData.service_type === 'deposit'">
              {{ $t('b65a927c.86268f') }}
            </div>
            <div v-if="serviceLabelsDetailData.service_type === 'timescard'">
              {{ $t('b65a927c.443835') }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">{{ $t('b65a927c.901fca') }}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_name }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">{{ $t('b65a927c.43fcf7') }}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_price }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">{{ $t('b65a927c.aae11e') }}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_desc }}
            </div>
          </el-col>
        </el-row>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click.native="
            serviceLabelsDetailVisible = false
            serviceLabelsDetailData = {}
          "
        >
          {{ $t('b65a927c.625fb2') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- 基础物料详情-结束 -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import { getDefaultCurrency } from '../../../../../api/company'
import {
  getServiceLabelsList,
  getServiceLabelsDetail,
  createServiceLabels,
  deleteServiceLabels,
  updateServiceLabels
} from '../../../../../api/goods'
export default {
  props: ['getStatus'],
  data() {
    return {
      isEdit: false,
      editServiceLabelsVisible: false,
      editServiceLabelsTitle: '',

      form: {
        service_type: 'timescard',
        label_name: '',
        label_price: '',
        label_desc: ''
      },
      activeName: 'first',
      labelsName: '',
      serviceLabelsList: [],
      editServiceLabels: false,
      serviceLabelsDetailVisible: false,
      serviceLabelsDetailData: {},
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      currency: {},
      cursymbol: '￥'
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    serviceTypes() {
      return [{ value: 'timescard', label: this.$t('b65a927c.443835') }]
    }
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.getLabelsList()
      }
    }
  },
  mounted() {
    //this.getCurrencyInfo()
    this.getLabelsList()
  },
  methods: {
    handleCancel() {
      this.editServiceLabelsVisible = false
      this.form.label_name = ''
      this.form.label_price = ''
      this.form.label_desc = ''
      this.form.service_type = ''
      this.form.label_id = ''
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getLabelsList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getLabelsList()
    },
    addServiceLabels() {
      // 添加物料弹框
      this.editServiceLabelsTitle = this.$t('b65a927c.b0a7ff')
      this.editServiceLabelsVisible = true
      this.isEdit = false
    },
    editServiceLabelsAction(index, row) {
      // 编辑物料弹框
      this.editServiceLabelsTitle = this.$t('b65a927c.e8a683')
      this.editServiceLabelsVisible = true
      this.isEdit = true
      this.form.service_type = row.serviceType
      this.form.label_name = row.labelName
      this.form.label_price = row.labelPrice / 100
      this.form.label_desc = row.labelDesc
      this.form.label_id = row.labelId
    },
    submitServiceLabelsAction() {
      // 提交物料
      if (this.form.label_id) {
        let params = {
          service_type: this.form.service_type,
          label_name: this.form.label_name,
          label_price: this.form.label_price,
          label_desc: this.form.label_desc
        }
        updateServiceLabels(this.form.label_id, params).then((response) => {
          this.serviceLabelsDetailData = response.data.data
          this.editServiceLabelsVisible = false
          this.getLabelsList()
          this.handleCancel()
        })
      } else {
        createServiceLabels(this.form).then((response) => {
          this.serviceLabelsDetailData = response.data.data
          this.editServiceLabelsVisible = false
          this.getLabelsList()
          this.handleCancel()
        })
      }
    },
    serviceLabelsDetail(index, row) {
      this.serviceLabelsDetailVisible = true
      getServiceLabelsDetail(row.labelId).then((response) => {
        this.serviceLabelsDetailData = response.data.data
      })
    },
    labelsSearch() {
      this.params.keywords = this.labelsName
      this.params.page = 1
      this.getLabelsList()
    },
    getLabelsList() {
      this.loading = true
      this.params.service_type = 'timescard'
      getServiceLabelsList(this.params).then((response) => {
        this.serviceLabelsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteServiceLabelsAction(index, row) {
      this.$confirm(this.$t('b65a927c.561290'), this.$t('b65a927c.02d981'), {
        confirmButtonText: this.$t('b65a927c.38cf16'),
        cancelButtonText: this.$t('b65a927c.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteServiceLabels(row.labelId).then((response) => {
            this.serviceLabelsList.splice(index, 1)
            this.$message({
              message: this.$t('b65a927c.a226c8'),
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('b65a927c.2111cc')
          })
        })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.labelPrice / 100
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    }
  }
}
</script>
<style scoped lang="scss">
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
.bg-purple-light {
  background: #e5e9f2;
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
