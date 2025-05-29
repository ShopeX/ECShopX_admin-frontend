<template>
  <el-dialog
    class="store-list-select"
    title="选择店铺"
    :visible.sync="showDialog"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <div style="margin-bottom: 15px">
      <!-- <el-input
        v-model="name"
        placeholder="输入店铺名称"
        clearable
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleIconClick"
        />
      </el-input> -->

      <SpFilterForm :model="formData" size="small" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="distributor_id">
          <el-input v-model="formData.distributor_id" placeholder="请输入店铺编号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="name">
          <el-input v-model="formData.name" placeholder="请输入店铺名称" />
        </SpFilterFormItem>
      </SpFilterForm>

      <!-- <el-switch v-model="is_distributor" active-text="店铺" inactive-text="门店" @change="handleIconClick"></el-switch> -->
    </div>
    <div style="margin-bottom: 15px" />
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="storeData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      @select="handleSelectionChange"
      @select-all="selectAll"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50" />
      <el-table-column prop="distributor_id" label="店铺ID" />
      <el-table-column prop="regionauth_name" label="所属区域" />
      <el-table-column prop="name" label="店铺名称" />
      <el-table-column prop="address" label="店铺地址" show-overflow-tooltip />
      <el-table-column prop="category_name" label="店铺分类" />
      <el-table-column prop="contact" label="是否展示">
        <template slot-scope="scope">
          {{ scope.row.is_display == 1 ? '展示' : '不展示' }}
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="状态">
        <template slot-scope="scope">
          {{ statusMap[scope.row.status] }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="contact"
        label="联系人"
      /> -->
      <!-- <el-table-column prop="store_name" label="门店"></el-table-column> -->
    </el-table>
    <div class="tr">
      <!-- v-if="total_count > params.pageSize" -->
      <el-pagination
        class="store-pagination is-background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count"
        :current-page="params.page"
        :page-sizes="[10, 20, 30]"
        :page-size="pageLimit"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">取 消</el-button>
      <el-button type="primary" @click="saveStoreAction">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDistributorEasyList } from '@/api/marketing'
export default {
  props: {
    relDataIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    getStatus: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: false
    },
    storeVisible: {
      type: Boolean,
      default: false
    },
    sourceType: {
      type: String,
      default: 'distributor'
    },
    returnType: {
      type: String,
      default: 'selectRow'
    }
  },
  data() {
    return {
      loading: false,
      storeData: [],
      multipleSelection: [],
      pageLimit: 10,
      selectRows: [],
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        is_valid: 'true'
      },
      name: '',
      is_distributor: true,
      formData: {
        distributor_id: '',
        name: ''
      },
      statusMap: {
        0: '待审核',
        1: '已上架',
        2: '已下架',
        9: '已撤柜'
      }
    }
  },
  computed: {
    showDialog() {
      return this.storeVisible
    }
  },
  watch: {
    relDataIds: {
      handler: function (newVal, oldVal) {
        if (newVal) {
          this.selectRows = JSON.parse(JSON.stringify(newVal))
          this.getNewsList()
        } else {
          this.selectRows = []
        }
      },
      immediate: true,
      deep: true
    },
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.params.is_valid = this.isValid ? this.isValid : 'true'
        this.getNewsList()
      }
    },
    sourceType(newVal, oldVal) {
      console.log(newVal)
      if (newVal) {
      }
    }
  },
  methods: {
    onSearch() {
      this.getNewsList()
    },
    getRowKeys(row) {
      return row.distributor_id
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getNewsList()
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.params.page = 1
      this.getNewsList()
    },
    handleIconClick() {
      this.params.name = this.name
      this.params.is_distributor = this.is_distributor
      console.log(this.params)
      this.getNewsList()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val,row) {
      if (val.length > 0) {
        this.multipleSelection = val
        const newVal = this.selectRows.filter((item) => {
          const isHaveRow = this.storeData.some((row) => {
            if (item.distributor_id) {
              return item.distributor_id == row.distributor_id
            } else {
              return item == row.distributor_id
            }
          })
          return !isHaveRow
        })
        this.selectRows = [...newVal, ...val]
      } else {
        const list = this.selectRows.filter((row) => {
          const isHave = this.storeData.some((item) => {
            if (row.distributor_id) {
              return item.distributor_id == row.distributor_id
            } else {
              return item.distributor_id == row
            }
          })
          return !isHave
        })
        this.selectRows = list
      }
    },
    // 全选事件
    selectAll(val) {
      if (val.length > 0) {
        this.multipleSelection = val
        val.forEach((item) => {
          let isInArr = -1
          if (this.selectRows.length > 0) {
            isInArr = this.selectRows.findIndex((n) => {
              if (n.distributor_id) {
                return n.distributor_id == item.distributor_id
              } else {
                return n.distributor_id == item.distributor_id
              }
            })
          }
          if (isInArr === -1) {
            this.selectRows.push(item)
          }
        })
      } else {
        const list = this.selectRows.filter((item) => {
          const isHave = this.storeData.some((n) => item.distributor_id === n.distributor_id)
          return !isHave
        })
        this.selectRows = list
      }
    },
    cancelAction() {
      this.$emit('closeStoreDialog')
    },
    saveStoreAction() {
      if (this.returnType === 'selectRow') {
        this.$emit('chooseStore', JSON.parse(JSON.stringify(this.selectRows)))
      } else {
        this.$emit('chooseStore', this.multipleSelection)
      }
    },
    getNewsList() {
      if (this.getStatus) {
        this.loading = true
        getDistributorEasyList({ ...this.params, ...this.formData }).then((response) => {
          this.storeData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
          this.multipleSelection = []
          this.$refs.multipleTable.clearSelection()
          if (this.selectRows) {
            this.storeData.forEach((item) => {
              const isHave = this.selectRows.findIndex((n) => {
                if (n.distributor_id) {
                  return n.distributor_id && n.distributor_id == item.distributor_id
                } else {
                  return n == item.distributor_id
                }
              })
              if (isHave !== -1) {
                setTimeout(() => {
                  this.$refs.multipleTable.toggleRowSelection(item)
                })
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.store-list-select {
  .el-checkbox {
    display: inline;
  }
  .store-pagination {
    text-align: right;
    margin-top: 10px;
  }
  .sp-filter-form {
    padding: 8px 8px 0px 8px;
  }
  .sp-finder-hd {
    display: none;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
