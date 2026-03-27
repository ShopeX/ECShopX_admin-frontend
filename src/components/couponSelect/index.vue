<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="$t('0b1d1f8f.45bcee')"
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
          :placeholder="$t('0b1d1f8f.708c9d')"
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
          :placeholder="$t('0b1d1f8f.b998dc')"
          style="width: 300px"
          class="input-with-select"
        >
          <el-button slot="append" @click="queryHandle"> {{ $t('0b1d1f8f.bee912') }} </el-button>
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
          <el-table-column :reserve-selection="true" type="selection" width="55" />
          <el-table-column :label="$t('0b1d1f8f.041148')" width="120">
            <template slot-scope="scope">
              <template v-if="scope.row.card_type == 'new_gift'">
                {{ $t('0b1d1f8f.8bc752') }}
              </template>
              <template v-else-if="scope.row.card_type == 'gift'">
                {{ $t('0b1d1f8f.8bc752') }}
              </template>
              <template v-else-if="scope.row.card_type == 'discount'">
                {{ $t('0b1d1f8f.c23d22') }}
              </template>
              <template v-else-if="scope.row.card_type == 'cash'">
                {{ $t('0b1d1f8f.f23195') }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="title" :label="$t('0b1d1f8f.439249')" width="120" />
          <el-table-column
            prop="description"
            :label="$t('0b1d1f8f.8c8ca4')"
            show-overflow-tooltip
          />
          <el-table-column prop="fixed_term" :label="$t('0b1d1f8f.ee9534')" show-overflow-tooltip>
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
          <el-table-column prop="quantity" :label="$t('0b1d1f8f.4b06cf')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.quantity - scope.row.get_num }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('0b1d1f8f.95eb49')" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                v-model.number="scope.row.give_num"
                :placeholder="$t('0b1d1f8f.02cc4f')"
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
        <p>{{ $t('0b1d1f8f.986ffb') }}{{ multipleSelection.length }}{{ $t('0b1d1f8f.0d6bd1') }}</p>
      </div>
      <div class="btn">
        <el-button @click="cancelHandle"> {{ $t('0b1d1f8f.625fb2') }} </el-button>
        <el-button type="primary" @click="confirm"> {{ $t('0b1d1f8f.38cf16') }} </el-button>
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
  data() {
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
      }
    }
  },
  computed: {
    options() {
      const opts = [
        { label: this.$t('0b1d1f8f.c079e7'), value: 'all' },
        { label: this.$t('0b1d1f8f.c23d22'), value: 'discount' },
        { label: this.$t('0b1d1f8f.f23195'), value: 'cash' }
      ]
      if (this.VERSION_STANDARD()) {
        opts.push({ label: this.$t('0b1d1f8f.8bc752'), value: 'new_gift' })
      }
      return opts
    }
  },
  watch: {
    multipleSelection() {
      this.$emit('seletedDataHandle', this.multipleSelection)
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      this.loading = true
      const { list, total_count } = await this.$api.coupons_package.couponList({
        ...this.query,
        ...this.paging,
        is_guide: 0
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
    closeHandle() {
      this.$emit('closeHandle')
    },
    cancelHandle() {
      this.multipleSelection = []
      this.$emit('seletedDataHandle', this.multipleSelection)
      this.$emit('closeHandle')
    },
    selectHandle(val) {
      this.query.card_type = val
      this.getConfig()
    },
    handleSizeChange(val) {
      this.paging.page_size = val
      this.paging.page_no = 1
      this.getConfig()
    },
    handleCurrentChange(val) {
      this.paging.page_no = val
      this.getConfig()
    },
    queryHandle() {
      this.paging.page_no = 1
      this.getConfig()
    },
    confirm() {
      if (this.multipleSelection.length <= 0) {
        return this.$message.error(this.$t('0b1d1f8f.1128cb'))
      }

      if (this.multipleSelection.length > 20) {
        return this.$message.error(this.$t('0b1d1f8f.9af997'))
      }

      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (
          this.multipleSelection[i].give_num >
          this.multipleSelection[i].quantity - this.multipleSelection[i].get_num
        ) {
          return this.$message.error(this.$t('0b1d1f8f.3fbc08'))
        }

        if (String(this.multipleSelection[i].give_num).indexOf('.') == '1') {
          return this.$message.error(this.$t('0b1d1f8f.ded522'))
        }

        if (this.multipleSelection[i].give_num < 1) {
          return this.$message.error(this.$t('0b1d1f8f.a05c63'))
        }
      }

      this.$emit('seletedDataHandle', this.multipleSelection)
      this.$emit('closeHandle')
    },
    handleSelectionChange(val) {
      if (val) {
        this.multipleSelection = val
      }
    },
    getRowKeys(val) {
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
