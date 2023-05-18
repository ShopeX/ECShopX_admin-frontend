<template>
  <div>
    <el-dialog
      title="选择优惠券包"
      :visible.sync="visible"
      class="couponSelect"
      :before-close="cancelHandle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <div class="query">
        <div />
        <el-input
          v-model="query.title"
          placeholder="请输入优惠券包名称"
          style="width: 300px"
          class="input-with-select"
        >
          <el-button slot="append" @click="queryHandle"> 查询 </el-button>
        </el-input>
      </div>
      <div class="list">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          border
          :row-key="getRowKeys"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" width="55" />
          <el-table-column prop="title" label="劵包标题" width="220" />
          <el-table-column prop="package_describe" label="描述" show-overflow-tooltip />
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        background
        :current-page="paging.page"
        :page-sizes="[10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div class="tips" style="margin-top: 30px">
        <p>已选择：{{ multipleSelection.length }} 包</p>
        <p style="padding: 3px 0">
          <i class="el-icon-warning icon" /> 若有优惠券限领 1 张，券包组合含 2 张，按优惠券规则领取
          1 张
        </p>
      </div>
      <div class="btn">
        <el-button @click="cancelHandle(true)"> 取消 </el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </el-dialog>
    <model
      :model-info="modelInfo"
      :model-visible="modelVisible"
      @closeModel="closeModel"
      @closeCouponHandle="cancelHandle"
    />
  </div>
</template>

<script>
import model from '@/view/member/membercard/cpn/model.vue'
export default {
  components: {
    model
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    packageId: {
      type: Number
    },
    seletedCouponPackage: {
      type: Array
    },
    isModel: {
      type: Boolean,
      default: false
    },
    type: {
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      loading: false,
      modelInfo: '',
      modelVisible: false,
      query: {
        title: ''
      },
      total: 0,
      paging: {
        page: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    multipleSelection() {
      console.log('==this.multipleSelection==', this.multipleSelection)
      // if (this.packageId!=undefined) {

      this.$emit('seletedDataHandle', this.multipleSelection, this.packageId)
      // }

      // if (voucher_package !== undefined && voucher_package.length > 0) {
      // debugger
      // this.$refs.multipleTable.clearSelection()

      // this.toggleSelection(arr)
      // } else {
      // }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      const { list, count } = await this.$api.coupons_package.packageList({
        ...this.query,
        ...this.paging
      })
      this.loading = false

      this.tableData = list
      this.total = count

      let voucher_package

      if (!this.packageId && this.packageId != 0) {
        voucher_package = this.seletedCouponPackage
      } else {
        voucher_package = this.seletedCouponPackage[this.packageId].voucher_package
      }
      console.log(voucher_package)

      if (voucher_package !== undefined && voucher_package.length > 0) {
        // debugger
        this.$refs.multipleTable.clearSelection()
        this.toggleSelection(voucher_package)
      } else {
      }
    },
    confirm() {
      if (this.isModel) {
        this.checkConpon(this.multipleSelection, this.packageId)
        this.$emit('seletedDataHandle', this.multipleSelection, this.packageId)
      } else {
        this.$emit('seletedDataHandle', this.multipleSelection)
        this.$emit('closeHandle')
      }
    },
    async checkConpon(seletedCoupon = [], packageId) {
      if (seletedCoupon.length == 0) {
        this.$emit('closeHandle')
        return
      }
      let voucher_package = seletedCoupon.map((item) => {
        return item.package_id
      })
      const type = this.type == 'grade' ? 'grade_id' : 'vip_grade_id'
      const obj = {
        package_id_list: voucher_package,
        set_type: this.type,
        grade_id: this.seletedCouponPackage[packageId][type]
      }

      const res = await this.$api.coupons_package.checkCouponPackage(obj)

      if (res.length > 0) {
        this.modelInfo = res
        this.modelVisible = true
      } else {
        this.$emit('closeHandle')
      }
    },
    closeModel() {
      this.modelVisible = false
    },
    // 获取原先数据加关闭操作
    cancelHandle(isOld) {
      if (isOld) {
        this.$emit('oldDataHandle') // 获取原先数据
      }
      this.$emit('closeHandle')
    },

    selectHandle(val) {
      this.query.card_type = val
      this.getConfig()
    },
    handleSizeChange(val) {
      this.paging.pageSize = val
      this.paging.page = 1
      this.getConfig()
    },
    handleCurrentChange(val) {
      this.paging.page = val

      this.getConfig()
    },
    queryHandle() {
      this.paging.page = 1
      this.getConfig()
    },

    handleSelectionChange(val) {
      // debugger
      console.log('handleSelectionChange', val)
      if (val.length > 0) {
        this.multipleSelection = val
      }
    },
    getRowKeys(val) {
      return val.package_id
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.couponSelect {
  .query {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list {
    padding: 30px 0px;
  }
  .tips {
    padding: 10px;
    padding-bottom: 0;
    color: #999;
  }
  .btn {
    text-align: right;
    margin-top: 20px;
  }
  .icon {
    font-size: 20px;
    margin-right: 6px;
    color: #409eff;
  }
}
</style>
<style lang="scss">
.couponSelect {
  .el-dialog {
    min-width: 1000px;
  }
}
</style>
