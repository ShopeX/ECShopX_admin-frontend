<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-table
      v-loading="loading"
      :data="list"
      style="width: 100%"
      :height="wheight - 140"
      :element-loading-text="$t('8fe988ed.fdba71')"
    >
      <el-table-column :label="$t('8fe988ed.2b6bc0')" width="120">
        <template slot-scope="scope">
          <el-button icon="edit" type="text" @click="editSuperior(scope.row)">
{{
            $t('8fe988ed.23ced7')
          }}
</el-button>
        </template>
      </el-table-column>

      <el-table-column prop="username" :label="$t('8fe988ed.60d045')" />
      <el-table-column prop="mobile" :label="$t('8fe988ed.8098e2')" />
      <el-table-column prop="bind_date" :label="$t('8fe988ed.8653cd')" />
      <el-table-column :label="$t('8fe988ed.139304')">
        <template slot-scope="scope">
          ￥{{ (scope.row.rebateTotal - scope.row.noCloseRebate) / 100 }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('8fe988ed.facb53')">
        <template slot-scope="scope"> ￥{{ scope.row.noCloseRebate / 100 }} </template>
      </el-table-column>
      <el-table-column prop="disabled" :label="$t('8fe988ed.3fea7c')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini">
{{
            $t('8fe988ed.c6cc39')
          }}
</el-tag>
          <el-tag v-else type="info" size="mini">{{ $t('8fe988ed.1abbb1') }}</el-tag>
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
      :title="$t('8fe988ed.23ced7')"
      :visible.sync="editSuperiorVisible"
      :before-close="handleCancelSuperior"
    >
      <el-row :gutter="10">
        <el-col :md="8" :lg="10">
          <el-input v-model="identifierModal" :placeholder="$t('8fe988ed.6e4f4b')">
            <el-button slot="append" icon="el-icon-search" @click="numberSearchModal" />
          </el-input>
        </el-col>
      </el-row>

      <el-table
        v-loading="modalLoading"
        :data="modalList"
        style="width: 100%"
        :height="400"
        :element-loading-text="$t('8fe988ed.6d7faa')"
        highlight-current-row
        @current-change="handleCurrentChangeUpLV"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="username" :label="$t('8fe988ed.60d045')" />
        <el-table-column prop="mobile" :label="$t('8fe988ed.8098e2')" />
        <el-table-column prop="promoter_grade_name" :label="$t('8fe988ed.917de5')" />
        <el-table-column prop="disabled" :label="$t('8fe988ed.3fea7c')">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini">
{{
              $t('8fe988ed.c6cc39')
            }}
</el-tag>
            <el-tag v-else type="info" size="mini">{{ $t('8fe988ed.1abbb1') }}</el-tag>
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
        <el-button @click.native="handleCancelSuperior">{{ $t('8fe988ed.625fb2') }}</el-button>
        <el-button type="primary" @click="submitSuperiorAction">
{{
          $t('8fe988ed.38cf16')
        }}
</el-button>
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
      getPopularizeList(filter).then((res) => {
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
        (res) => {
          this.loading = false
          this.$message({
            message: this.$t('8fe988ed.2b8558'),
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchList()
        }
      )
    },

    getPopularizeChildrenFun() {
      getPopularizeChildren(this.params).then((res) => {
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
