<template>
  <div>
    <el-dialog
      class="img_dialog"
      title="选择卡券"
      :visible="showDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelAction"
    >
      <el-table
        v-loading.body="listLoading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="卡券类型">
          <template slot-scope="card_type">
            {{ card_type.row.card_type | formatCardStr }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="全部卡券" />
        <el-table-column label="卡券有效期">
          <template slot-scope="card_type">
            <i class="el-icon-time" />
            <template v-if="card_type.row.takeEffect">
              {{ card_type.row.takeEffect }}
            </template>
            <template v-else>
              {{ card_type.row.begin_time | datetime }}
              <template v-if="card_type.row.end_time"> ~ </template>
              {{ card_type.row.end_time | datetime }}
              {{ Date.parse(new Date()) > card_type.row.end_time * 1000 ? '已过期' : '' }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix" style="margin-top: 20px">
        <div v-if="total_count > pageSize" class="tc">
          <el-pagination
            layout="prev, pager, next"
            :total="total_count"
            :page-size="pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAction">取 消</el-button>
        <el-button type="primary" @click="saveAction">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEffectiveCardList } from '../../api/cardticket'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    scStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listLoading: true,
      editNumberVisible: true,
      currentPage: 1,
      selectedItem: '',
      tableData: [],
      selectItem: [],
      total_count: 0,
      pageSize: 10,
      showDialog: false
    }
  },
  watch: {
    scStatus(newV) {
      console.log('newV', newV)
      if (newV) {
        let data = { page_no: 1, page_size: this.pageSize }
        this.getCardList(data)
      }
    },
    dialogVisible(newV, oldV) {
      this.showDialog = newV
    }
  },
  methods: {
    handleCurrentChange(curPage) {
      var data = { page_no: curPage, page_size: this.pageSize }
      this.getCardList(data)
    },
    handleSelectionChange(item) {
      this.selectItem = item
    },
    cancelAction() {
      this.$emit('closeKQDialog')
    },
    saveAction() {
      this.$emit('chooseKQ', this.selectItem)
    },
    getCardList(data) {
      this.listLoading = true
      if (this.scStatus) {
        getEffectiveCardList(data).then(response => {
          this.listLoading = false
          this.tableData = response.data.data.list
          this.total_count = response.data.data.total_count
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.fl {
  float: left;
}
.fr {
  float: right;
}
</style>
<style lang="scss">
.el-input-number {
  display: block;
}
</style>
