<template>
  <div>
    <el-dialog
      title="选择优惠券"
      :visible.sync="visible"
      class="couponSelect"
      :before-close="cancelHandle"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="query">
        <el-select
          v-model="query.card_type"
          placeholder="请选择"
          @change="selectHandle"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input
          v-model="query.title"
          placeholder="请输入卡券名称"
          style="width: 300px"
          class="input-with-select"
        >
          <el-button
            slot="append"
            @click="queryHandle"
          >
            查询
          </el-button>
        </el-input>
      </div>
      <div class="list">
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :row-key="getRowKeys"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            :reserve-selection="true"
            type="selection"
            width="55"
          />
          <el-table-column
            label="卡劵类型"
            width="120"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.card_type == 'new_gift'">
                兑换券
              </template>
              <template v-else-if="scope.row.card_type == 'gift'">
                兑换券
              </template>
              <template v-else-if="scope.row.card_type == 'discount'">
                折扣卷
              </template>
              <template v-else-if="scope.row.card_type == 'cash'">
                满减券
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="卡劵名称"
            width="120"
          />
          <el-table-column
            prop="description"
            label="卡劵说明"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fixed_term"
            label="卡劵有效期"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <template
                v-if="
                  scope.row.date_type == 'DATE_TYPE_FIX_TIME_RANGE' ||
                    scope.row.date_type == 'DATE_TYPE_SHORT'
                "
              >
                {{ scope.row.begin_time | formatDataTime('YYYY-MM-DD hh:mm:ss') }} -
                {{ scope.row.end_time | formatDataTime('YYYY-MM-DD hh:mm:ss') }}
              </template>
              <template
                v-else-if="
                  scope.row.date_type == 'DATE_TYPE_FIX_TERM' ||
                    scope.row.date_type == 'DATE_TYPE_LONG'
                "
              >
                {{ scope.row.takeEffect }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="可领取库存"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.quantity - scope.row.get_num }}
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="发送数量"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.give_num"
                placeholder="请输入"
                type="number"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        style="text-align: center"
        background
        :current-page="paging.page_no"
        :page-sizes="[10, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <div class="tips">
        <p>已选择：{{ multipleSelection.length }} 张，最多选择 20 张优惠券</p>
      </div>
      <div class="btn">
        <el-button @click="cancelHandle">
          清空
        </el-button>
        <el-button
          type="primary"
          @click="confirm"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    seletedCoupon: {
      type: Array
    }
  },
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      loading: false,
      query: {
        card_type: 'all',
        title: ''
      },
      total: 0,
      paging: {
        page_no: 1,
        page_size: 10
      },
      options: [
        {
          label: '全部类型',
          value: 'all'
        },
        {
          label: '兑换券',
          value: 'new_gift'
        },
        // {
        //   label: '兑换券',
        //   value: 'gift'
        // },
        {
          label: '折扣卷',
          value: 'discount'
        },
        {
          label: '满减券',
          value: 'cash'
        }
      ]
    }
  },
  watch: {
    multipleSelection () {
      this.$emit('seletedDataHandle', this.multipleSelection)
    }
  },
  mounted () {
    this.getConfig()
  },
  methods: {
    async getConfig () {
      this.loading = true
      const { list, total_count } = await this.$api.coupons_package.couponList({
        ...this.query,
        ...this.paging
      })
      this.loading = false

      list.forEach((element) => {
        element.give_num = 0
      })

      this.tableData = list
      this.total = total_count
      this.$refs.multipleTable.clearSelection()
      if (this.seletedCoupon.length > 0) {
        this.seletedCoupon.forEach((item) => {
          console.log('this.seletedCoupon', this.seletedCoupon)
          this.$refs.multipleTable.toggleRowSelection(item)
        })

        this.seletedCoupon.forEach((itemX) => {
          this.tableData.forEach((itemY, indexY) => {
            if (itemX.card_id == itemY.card_id) {
              this.tableData.splice(indexY, 1, itemX)
            }
          })
        })
      }
    },
    closeHandle () {
      this.$emit('closeHandle')
    },
    cancelHandle () {
      this.multipleSelection = []
      this.$emit('seletedDataHandle', this.multipleSelection)
      this.$emit('closeHandle')
    },
    selectHandle (val) {
      this.query.card_type = val
      this.getConfig()
    },
    handleSizeChange (val) {
      this.paging.page_size = val
      this.paging.page_no = 1
      this.getConfig()
    },
    handleCurrentChange (val) {
      this.paging.page_no = val
      this.getConfig()
    },
    queryHandle () {
      this.paging.page_no = 1
      this.getConfig()
    },
    confirm () {
      if (this.multipleSelection.length <= 0) {
        return this.$message.error('请选择兑换券~')
      }

      if (this.multipleSelection.length > 20) {
        return this.$message.error('最多可以选择20张优惠券~')
      }

      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].give_num >
          this.multipleSelection[i].quantity - this.multipleSelection[i].get_num
        ) {
          return this.$message.error('所选劵包发送数量大于库存，请修改~')
        }

        if (String(this.multipleSelection[i].give_num).indexOf('.') == '1') {
          return this.$message.error('所选优惠券发送数量必须为正整数~')
        }

        if (this.multipleSelection[i].give_num < 1) {
          return this.$message.error('所选优惠券发送数量不可小于1~')
        }
      }

      this.$emit('seletedDataHandle', this.multipleSelection)
      this.$emit('closeHandle')
    },
    handleSelectionChange (val) {
      if (val) {
        this.multipleSelection = val
      }
    },
    getRowKeys (val) {
      return val.card_id
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
}
</style>
<style lang="scss">
.couponSelect {
  .el-dialog {
    min-width: 1000px;
  }
}
</style>
