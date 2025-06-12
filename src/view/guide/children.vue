<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :height="wheight - 140"
      element-loading-text="数据加载中......"
    >
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button icon="edit" type="text" @click="editSuperior(scope.row)"> 调整上级 </el-button>
        </template>
      </el-table-column>

      <el-table-column prop="username" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="bind_date" label="加入时间" />
      <el-table-column label="已结算">
        <template slot-scope="scope">
          ￥{{ (scope.row.rebateTotal - scope.row.noCloseRebate) / 100 }}
        </template>
      </el-table-column>
      <el-table-column label="未结算">
        <template slot-scope="scope"> ￥{{ scope.row.noCloseRebate / 100 }} </template>
      </el-table-column>
      <el-table-column prop="disabled" label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini"> 有效 </el-tag>
          <el-tag v-else type="info" size="mini"> 无效 </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-sizes="[params.pageSize]"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 调整上下级弹框 -->
    <el-dialog
      title="调整上级"
      :visible.sync="editSuperiorVisible"
      :before-close="handleCancelSuperior"
    >
      <el-row :gutter="10">
        <el-col :md="8" :lg="10">
          <el-input v-model="identifierModal" placeholder="请输入手机号">
            <el-button slot="append" icon="el-icon-search" @click="numberSearchModal" />
          </el-input>
        </el-col>
      </el-row>

      <!-- <el-table
        v-loading="modalLoading"
        :data="modalList"
        style="width: 100%"
        :height="400"
        element-loading-text="数据加载中..."
        highlight-current-row
        @current-change="handleCurrentChangeUpLV"
      > -->
      <!-- <el-row :gutter="10">
          <el-col
            :md="8"
            :lg="10"
          >
            <el-input
              v-model="identifierModal"
              placeholder="请输入手机号"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="numberSearchModal"
              />
            </el-input>
          </el-col>
        </el-row> -->

      <el-table
        v-loading="modalLoading"
        :data="modalList"
        style="width: 100%"
        :height="400"
        element-loading-text="数据加载中..."
        highlight-current-row
        @current-change="handleCurrentChangeUpLV"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="mobile" label="手机号" />
        <!-- <el-table-column prop="promoter_grade_name" label="推广员等级-" /> -->
        <el-table-column prop="disabled" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini"> 有效 </el-tag>
            <el-tag v-else type="info" size="mini"> 无效 </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="modal_total_count > paramsModal.pageSize" class="mt-4 text-right">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="paramsModal.page"
          :total="modal_total_count"
          :page-size="paramsModal.pageSize"
          @current-change="handleModalPage"
        />
      </div>
      <div slot="footer" class="dialog-footer content-center">
        <el-button @click.native="handleCancelSuperior"> 取消 </el-button>
        <el-button type="primary" @click="submitSuperiorAction"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPopularizeChildren } from '../../api/promotions'
import {
  addPromoter,
  getPopularizeList,
  editPopularizeRemove,
  editPopularizeGrade,
  editPopularizeDisabled,
  getPromoterGradeConfig,
  updatePromoterShop
} from '../../api/promotions'
export default {
  data() {
    return {
      editSuperiorVisible: false,
      modalLoading: false,
      paramsModal: {
        page: 1,
        pageSize: 14,
        mobile: ''
      },
      identifierModal: '',
      modalList: [],
      modal_total_count: 0,

      params: {
        page: 1,
        pageSize: 20,
        promoter_id: 0
      },
      list: [],
      loading: false,
      total_count: 0
    }
  },
  mounted() {
    if (this.$route.query.promoter_id) {
      console.log('this.$route----------------------------------')
      console.log(this.$route.query.promoter_id)
      console.log(this.$route.query.promoter_id)
      console.log(this.$route.query.promoter_id)
      console.log(this.$route.query.promoter_id)
      this.params.promoter_id = this.$route.query.promoter_id
    }
    this.getPopularizeChildrenFun()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getPopularizeChildrenFun()
    },
    editSuperior(row) {
      this.editSuperiorVisible = true
      this.row = row
      this.identifierModal = ''
      this.numberSearchModal()
    },
    submitSuperiorAction() {
      this.editPopularizeRemoveFun()
      this.editSuperiorVisible = false
    },
    handleCancelSuperior() {
      this.editSuperiorVisible = false
    },

    numberSearchModal(e) {
      this.paramsModal.page = 1
      this.paramsModal.mobile = this.identifierModal
      this.getPopularizeListModalFun(this.paramsModal)
    },
    getPopularizeListModalFun(filter) {
      this.modalLoading = true
      getPopularizeList(filter).then(res => {
        this.modalList = res.data.data.list
        this.modal_total_count = Number(res.data.data.total_count)
        this.modalLoading = false
      })
    },
    handleCurrentChangeUpLV(val) {
      console.log('handleCurrentChangeUpChange')
      if (val && val.user_id) {
        this.currentRow = val.user_id
      }
    },
    editPopularizeRemoveFun() {
      editPopularizeRemove({ user_id: this.row.user_id, new_user_id: this.currentRow }).then(
        res => {
          this.message = '上下级'
          this.loading = false
          this.$message({
            message: '调整' + this.message + '成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchList()
        }
      )
    },

    getPopularizeChildrenFun() {
      getPopularizeChildren(this.params).then(res => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
