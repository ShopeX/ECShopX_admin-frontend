<template>
  <div>
    <div class="content-bottom-padded">
      <el-alert
        title="添加基础物料，方便您个性化的添加各类服务商品(不仅仅是商品)！"
        type="warning"
        show-icon
      />
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button
          type="primary"
          icon="plus"
          size="mini"
          @click="addServiceLabels"
        >
          添加基础物料
        </el-button>
      </el-col>
      <el-col :span="12">
        <el-input
          v-model="labelsName"
          placeholder="基础物料名称"
          size="mini"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="labelsSearch"
          />
        </el-input>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="serviceLabelsList"
      :height="wheight - 270"
    >
      <el-table-column
        prop="labelName"
        label="物料名称"
      />
      <el-table-column
        width="120"
        prop="serviceType"
        label="系统类型"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.serviceType === 'point'">积分</span>
          <span v-if="scope.row.serviceType === 'deposit'">储值</span>
          <span v-if="scope.row.serviceType === 'timescard'">次卡</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="labelPrice"
        label="物料价格(元)"
        :formatter="priceformatter"
      />
      <el-table-column
        width="120"
        label="操作"
      >
        <template slot-scope="scope">
          <div class="operating-icons">
            <i
              class="iconfont icon-search-plus"
              @click="serviceLabelsDetail(scope.$index, scope.row)"
            />
            <i
              class="iconfont icon-edit1"
              @click="editServiceLabelsAction(scope.$index, scope.row)"
            />
            <i
              class="mark iconfont icon-trash-alt1"
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
        <el-form
          ref="form"
          :model="form"
          class="demo-ruleForm"
          label-width="90px"
        >
          <el-form-item label="系统类型">
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
          <el-form-item label="物料名称">
            <el-col
              :span="14"
            >
              <el-input
                v-model="form.label_name"
                :maxlength="20"
                placeholder="基础物料名称，如 积分、预存款、经验值、佣金等等"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="物料价格">
            <el-col
              :span="6"
            >
              <el-input
                v-model="form.label_price"
                type="number"
                required
                min="0"
                placeholder="基础物料的价格"
              />
            </el-col>
            <el-col :span="1">
              &nbsp;元
            </el-col>
          </el-form-item>
          <el-form-item label="物料描述">
            <el-col
              :span="14"
            >
              <el-input
                v-model="form.label_desc"
                type="textarea"
                :maxlength="255"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </template>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click.native="handleCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitServiceLabelsAction"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
    <!-- 添加、编辑基础物料-结束 -->
    <!-- 基础物料详情-开始 -->
    <el-dialog
      title="基础物料详情"
      :visible.sync="serviceLabelsDetailVisible"
    >
      <template>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">
              基础类型
            </div>
          </el-col>
          <el-col :span="12">
            <div v-if="serviceLabelsDetailData.service_type === 'point'">
              积分类型
            </div>
            <div v-if="serviceLabelsDetailData.service_type === 'deposit'">
              储值类型
            </div>
            <div v-if="serviceLabelsDetailData.service_type === 'timescard'">
              次卡类型
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">
              物料名称
            </div>
          </el-col>
          <el-col
            :span="12"
          >
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_name }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">
              物料价格
            </div>
          </el-col>
          <el-col
            :span="12"
          >
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_price }}
            </div>
          </el-col>
        </el-row>
        <el-row class="row-bg">
          <el-col :span="6">
            <div class="grid-content">
              物料描述
            </div>
          </el-col>
          <el-col
            :span="12"
          >
            <div class="grid-content">
              {{ serviceLabelsDetailData.label_desc }}
            </div>
          </el-col>
        </el-row>
      </template>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          @click.native="
            serviceLabelsDetailVisible = false
            serviceLabelsDetailData = {}
          "
        >
          取消
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
  data () {
    return {
      isEdit: false,
      editServiceLabelsVisible: false,
      editServiceLabelsTitle: '',

      serviceTypes: [
        // {
        //   value: 'deposit',
        //   label: '储值类型'
        // },
        // {
        //   value: 'point',
        //   label: '积分类型'
        // },
        {
          value: 'timescard',
          label: '次卡类型'
        }
      ],
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
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus (val) {
      if (val) {
        this.getLabelsList()
      }
    }
  },
  mounted () {
    //this.getCurrencyInfo()
    this.getLabelsList()
  },
  methods: {
    handleCancel () {
      this.editServiceLabelsVisible = false
      this.form.label_name = ''
      this.form.label_price = ''
      this.form.label_desc = ''
      this.form.service_type = ''
      this.form.label_id = ''
    },
    handleCurrentChange (page_num) {
      this.params.page = page_num
      this.getLabelsList()
    },
    handleSizeChange (pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getLabelsList()
    },
    addServiceLabels () {
      // 添加物料弹框
      this.editServiceLabelsTitle = '添加基础物料'
      this.editServiceLabelsVisible = true
      this.isEdit = false
    },
    editServiceLabelsAction (index, row) {
      // 编辑物料弹框
      this.editServiceLabelsTitle = '编辑基础物料'
      this.editServiceLabelsVisible = true
      this.isEdit = true
      this.form.service_type = row.serviceType
      this.form.label_name = row.labelName
      this.form.label_price = row.labelPrice / 100
      this.form.label_desc = row.labelDesc
      this.form.label_id = row.labelId
    },
    submitServiceLabelsAction () {
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
    serviceLabelsDetail (index, row) {
      this.serviceLabelsDetailVisible = true
      getServiceLabelsDetail(row.labelId).then((response) => {
        this.serviceLabelsDetailData = response.data.data
      })
    },
    labelsSearch () {
      this.params.keywords = this.labelsName
      this.params.page = 1
      this.getLabelsList()
    },
    getLabelsList () {
      this.loading = true
      this.params.service_type = 'timescard'
      getServiceLabelsList(this.params).then((response) => {
        this.serviceLabelsList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    deleteServiceLabelsAction (index, row) {
      this.$confirm('此操作将删除该基础物料, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteServiceLabels(row.labelId).then((response) => {
            this.serviceLabelsList.splice(index, 1)
            this.$message({
              message: '删除基础物料成功',
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
    priceformatter (row, column) {
      return this.cursymbol + row.labelPrice / 100
    },
    getCurrencyInfo () {
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
