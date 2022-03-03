<template>
  <el-dialog
    class="new_tagselect"
    title="选择标签"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="60%"
    :show-close="false"
    :before-close="handleClose"
  >
    <div class="query">
      <div />
      <el-input
        v-model="query.tag_name"
        placeholder="请输入查找的标签名"
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
        border
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
          prop="tag_name"
          label="标签名称"
          width="220"
        />
        <el-table-column
          prop="description"
          label="标签描述"
          show-overflow-tooltip
        />
      </el-table>
    </div>
    <el-pagination
      style="text-align: center"
      background
      :current-page="params.page"
      :page-sizes="[10, 20, 30]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <p>已选择：{{ multipleSelection.length }}</p>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        size="small"
        type="primary"
        @click="confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTagList } from '@/api/marketing'
import { getTagList as getGoodsTag } from '@/api/goods'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      default: ''
    },
    seletedTags: {
      type: Array
    },
    //当type = ‘store’ 需要
    storeID: {
      default: null
    }
  },
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      total: 0,
      loading: false,
      query: {
        tag_name: '',
        front_show: 1
      },
      params: {
        page: 1,
        pageSize: 10,
        front_show: 1
      }
    }
  },
  watch: {
    multipleSelection () {
      this.$emit('seletedTagsHandle', this.multipleSelection)
    }
  },

  mounted () {
    this.getConfig()
  },
  methods: {
    async getConfig () {
      this.loading = true
      let type = this.type

      if (type == 'nearby_shop') {
        const result = await getTagList({ ...this.query, ...this.params })
        this.handle(result)
      } else if ((type = 'store')) {
        console.log(this.storeID)
        const result = await getGoodsTag({
          ...this.query,
          ...this.params,
          distributor_id: this.storeID
        })
        this.handle(result)
      }
    },

    handle (result) {
      this.loading = false
      const { list, total_count } = result.data.data
      this.tableData = list
      this.total = total_count

      if (this.seletedTags !== undefined && this.seletedTags.length > 0) {
        this.$refs.multipleTable.clearSelection()
        this.toggleSelection(this.seletedTags)
      }
    },
    checkTags (fn) {
      if (this.type == 'store') {
        if (this.multipleSelection.length > 3) {
          return this.$message.error('所选标签数量不得大于3')
        }
      }

      if (this.type == 'nearby_shop') {
        if (this.multipleSelection.length > 10) {
          return this.$message.error('所选标签数量不得大于10')
        }
      }
      fn()
    },

    confirm () {
      this.checkTags(() => {
        this.$emit('seletedTagsHandle', this.multipleSelection)
        this.$emit('visibleHandle')
      })
    },
    queryHandle () {
      this.getConfig()
    },

    handleClose () {
      this.checkTags(() => {
        this.$emit('visibleHandle')
      })
    },
    handleSelectionChange (val) {
      console.log('handleSelectionChange', val)

      if (val.length > 0) {
        this.multipleSelection = val
      }
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.params.page = 1
      this.getConfig()
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getConfig()
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    getRowKeys (val) {
      return val.tag_id
    }
  }
}
</script>

<style lang="scss" scoped>
.new_tagselect {
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
