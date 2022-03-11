<template>
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
    >
      <el-table-column
        label=""
        width="50"
      >
        <template slot-scope="scope">
          <input
            type="radio"
            name="kq"
            :value="JSON.stringify(scope.row)"
          >
        </template>
      </el-table-column>
      <el-table-column label="卡券类型">
        <template slot-scope="card_type">
          {{ card_type.row.card_type | formatCardStr }}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="全部卡券"
      />
      <el-table-column
        prop="begin_time ~ end_time"
        label="卡券有效期"
      />
      <!-- <el-table-column label="库存" width="200">
        <template scope="scope">
          <el-input-number v-model="scope.row.store" style="width: 140px;"></el-input-number>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="price"
        label="微信价(元)"
      />
      <el-table-column
        prop="state"
        label="卡券状态"
      />
    </el-table>
    <div
      class="clearfix"
      style="margin-top: 20px"
    >
      <div class="mini_tips fl">
        <span>只能投放普通券</span>
      </div>
      <div
        v-if="pagers.total > pageSize"
        class="tc"
      >
        <el-pagination
          layout="prev, pager, next"
          :total="pagers.total"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancelAction">取 消</el-button>
      <el-button
        type="primary"
        @click="saveAction"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getCardList } from '../../api/cardticket'

export default {
  props: ['dialogVisible', 'scStatus'],
  data () {
    return {
      listLoading: true,
      editNumberVisible: true,
      currentPage: 1,
      selectedItem: '',
      tableData: [],
      pagers: {
        total: 0
      },
      pageSize: 3,
      showDialog: false
    }
  },
  watch: {
    scStatus (newV) {
      if (newV) {
        let data = { page_no: 1, page_size: this.pageSize }
        this.getCardList(data)
      }
    },
    dialogVisible (newV, oldV) {
      this.showDialog = newV
    }
  },
  methods: {
    handleCurrentChange (curPage) {
      var data = { page_no: curPage, page_size: this.pageSize }
      this.getCardList(data)
    },
    saveAction () {
      var radios = document.getElementsByName('kq')
      radios.forEach((index) => {
        if (index.checked === true) {
          this.selectedItem = index.value
        }
      })
      this.$emit('chooseKQ', JSON.parse(this.selectedItem))
    },
    cancelAction () {
      this.$emit('closeKQDialog')
    },
    getCardList (data) {
      this.listLoading = true
      if (this.scStatus) {
        getCardList(data).then((response) => {
          this.listLoading = false
          this.tableData = response.data.data.list
          this.pagers.total = response.data.data.pagers.total
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
