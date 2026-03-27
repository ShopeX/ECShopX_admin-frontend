<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    width="60%"
    :title="$t('86152db6.8f5d8d')"
    :visible.sync="show"
    :close-on-click-modal="false"
    append-to-body
  >
    <div style="margin-bottom: 15px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            v-model="params.title"
            :placeholder="$t('86152db6.39b051')"
            clearable
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchByKey" />
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="itemsData"
      tooltip-effect="dark"
      style="width: 100%"
      :row-key="getRowKeys"
      :select-on-indeterminate="false"
      @select="handleSelectChange"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" :reserve-selection="true" width="50" />
      <el-table-column prop="article_id" :label="$t('86152db6.83361c')" width="70" />
      <el-table-column prop="title" :label="$t('86152db6.64cebd')" />
    </el-table>
    <div v-if="total_count > params.pageSize" class="tr">
      <el-pagination
        layout="prev, pager, next"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAction">{{ $t('86152db6.c08ab9') }}</el-button>
      <el-button type="primary" @click="saveStoreAction">{{ $t('86152db6.aa7527') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getArticleList } from '@/api/article'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    getStatus: {
      type: Boolean,
      default: false
    },
    relItemsIds: {
      type: Array,
      default: []
    },
    limitNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      show: false,
      itemsData: [],
      multipleSelection: [],
      selectRows: [],
      total_count: '',
      params: {
        page: 1,
        pageSize: 10,
        article_id: '',
        article_type: 'bring',
        title: ''
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.show = true
        let ids = []
        this.loading = true
        this.multipleSelection.forEach((item) => {
          ids.push(item.article_id)
        })
        if (ids.length > 0) {
          let param = JSON.parse(JSON.stringify(this.params))
          param.article_id = ids
          this.selectRows = []
          getArticleList(param).then((res) => {
            this.selectRows = res.data.data.list
            this.$refs.multipleTable.clearSelection()
            this.itemsData.forEach((item) => {
              let checked = this.selectRows.find((n) => n.itemId === item.itemId)
              if (checked) {
                this.$refs.multipleTable.toggleRowSelection(item)
              }
            })
            this.loading = false
          })
        } else {
          const that = this
          this.$nextTick(() => {
            that.$refs.multipleTable.clearSelection()
          })
          this.loading = false
        }
      }
    },
    relItemsIds(newVal, oldVal) {
      if (newVal.length > 0) {
        this.multipleSelection = newVal
      }
    },
    itemsData(val) {
      if (this.selectRows.length > 0) {
        this.itemsData.forEach((item) => {
          let checked = this.selectRows.find((n) => n.itemId === item.itemId)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
      }
    },
    getStatus(newVal, oldVal) {
      if (newVal) {
        this.getNewsList()
      }
    },
    itemType(newVal, oldVal) {
      if (newVal) {
        this.params.item_type = newVal
      }
    }
  },
  methods: {
    getRowKeys(row) {
      return row.itemId
    },
    handleCurrentChange(page_num) {
      this.$refs.multipleTable.clearSelection()
      this.params.page = page_num
      this.getNewsList()
    },
    searchByKey() {
      this.params.page = 1
      this.getNewsList()
    },
    handleSelectAll(val) {
      if (this.limitNum) {
        this.$message({ message: this.$t('86152db6.4f180d'), type: 'warning' })
        this.$refs.multipleTable.clearSelection()
        this.itemsData.forEach((item) => {
          let checked = this.selectRows.find((n) => n.article_id === item.article_id)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
        return
      }
      if (val.length > 0) {
        val.forEach((item) => {
          let inChecked = this.selectRows.findIndex((n) => item.article_id === n.article_id)
          if (inChecked === -1) {
            this.selectRows.push(item)
          }
        })
      } else {
        this.itemsData.forEach((item, index) => {
          let inChecked = this.selectRows.findIndex((n) => item.article_id === n.article_id)
          if (inChecked !== -1) {
            this.selectRows.splice(inChecked, 1)
          }
        })
      }
    },
    handleSelectChange(val, row) {
      let inChecked = this.selectRows.findIndex((item) => row.article_id === item.article_id)
      if (inChecked !== -1) {
        this.selectRows.splice(inChecked, 1)
      } else {
        if (this.limitNum && this.selectRows.length >= this.limitNum) {
          this.$message({
            message: this.$t('86152db6.49e280', { n: this.limitNum }),
            type: 'warning'
          })
          this.$refs.multipleTable.clearSelection()
          this.selectRows.forEach((item) => {
            this.$refs.multipleTable.toggleRowSelection(item)
          })
          return
        }
        this.selectRows.push(row)
      }
    },
    cancelAction() {
      this.show = false
      this.$emit('update:visible', false)
    },
    saveStoreAction() {
      this.show = false
      this.$emit('update:visible', false)
      this.$emit('change', this.selectRows)
    },
    getNewsList() {
      if (this.getStatus) {
        this.loading = true
        getArticleList(this.params).then((response) => {
          this.itemsData = response.data.data.list
          this.total_count = parseInt(response.data.data.total_count)
          this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-select .el-input {
  width: 130px;
}
.tab-group {
  .tab-btn {
    &.on {
      border-color: #e6a23c;
      background-color: #e6a23c;
      color: #fff;
    }
  }
}
</style>
