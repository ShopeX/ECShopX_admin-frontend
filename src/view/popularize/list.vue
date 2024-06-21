<template>
  <div>
    <div v-if="$route.path.indexOf('child') === -1 && $route.path.indexOf('detail') === -1">
      <div class="action-container"  v-if="loginType !== 'distributor'">
        <el-button
          type="primary"
          icon="el-icon-circle-plus"
          @click.native="addVisible = true"
        >
          添加推广员
        </el-button>
      </div>
      <SpFilterForm
        :model="params"
        @onSearch="onSearch"
        @onReset="onSearch"
      >
        <SpFilterFormItem
          prop="mobile"
          label="手机号:"
        >
          <el-input
            v-model="params.mobile"
            placeholder="请输入手机号"
          />
        </SpFilterFormItem>
        <SpFilterFormItem
          prop="store_status"
          label="开店状态:"
        >
          <el-select
            v-model="params.store_status"
            placeholder="请输入开店状态"
            clearable
          >
            <el-option
              label="未开店"
              value="0"
            />
            <el-option
              label="已开店"
              value="1"
            />
            <el-option
              label="已关闭"
              value="3"
            />
            <el-option
              label="等待审核"
              value="2"
            />
            <el-option
              label="审核拒绝"
              value="4"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <el-table
        v-loading="loading"
        border
        :data="list"
        :height="wheight - 170"
        element-loading-text="数据加载中"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              class="btn-gap"
              @click="detail(scope.row)"
            >
              分佣详情
            </el-button>
            <el-popover
              placement="right"
              width="440"
              trigger="hover"
            >
              <div class="operating-icons">
                <el-button
                  icon="edit"
                  type="text"
                  class="btn-gap"
                  @click="detail(scope.row)"
                >
                  分佣详情
                </el-button>
                <el-button
                  icon="edit"
                  type="text"
                  @click="editTop(scope.row)"
                >
                  调整至顶级
                </el-button>
                <el-button
                  icon="edit"
                  type="text"
                  @click="editSuperior(scope.row)"
                >
                  调整上级
                </el-button>
                <el-button
                  v-if="
                    scope.row.shop_status === 0 ||
                      scope.row.shop_status === 4 ||
                      scope.row.shop_status === 3
                  "
                  type="text"
                  @click="handleShopStatus(scope.$index, scope.row)"
                >
                  开通虚拟店
                </el-button>
                <el-button
                  v-if="scope.row.shop_status === 2"
                  type="text"
                  @click="handleShopStatus(scope.$index, scope.row)"
                >
                  审核申请
                </el-button>
                <el-button
                  v-if="scope.row.shop_status === 1"
                  type="text"
                  @click="handleShopStatus(scope.$index, scope.row)"
                >
                  关闭虚拟店
                </el-button>
                <el-button
                  v-show="gradeList.isOpenPromoterGrade == 'true'"
                  icon="edit"
                  type="text"
                  @click="editGrade(scope.$index, scope.row)"
                >
                  修改推广员等级
                </el-button>
              </div>
              <el-button
                slot="reference"
                type="text"
              >
                <i class="iconfont icon-angle-double-right" />
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        />
        <el-table-column
          prop="mobile"
          label="手机号"
          width="150"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.mobile"
              class="el-icon-mobile"
            />
            {{ scope.row.mobile }}
            <el-tooltip
              v-if="scope.row.mobile && datapass_block == 0"
              effect="dark"
              content="复制"
              placement="top-start"
            >
              <i
                v-clipboard:copy="scope.row.mobile"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="promoter_grade_name"
          label="推广员等级"
        />
        <el-table-column
          prop="pmobile"
          label="上级联系方式"
          width="150"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.pmobile && scope.row.pmobile != ''"
              class="el-icon-mobile"
            />
            {{ scope.row.pmobile && scope.row.pmobile != '' ? scope.row.pmobile : '-' }}
            <el-tooltip
              v-if="scope.row.pmobile && scope.row.pmobile != ''"
              effect="dark"
              content="复制"
              placement="top-start"
            >
              <i
                v-clipboard:copy="scope.row.pmobile"
                v-clipboard:success="onCopy"
                class="el-icon-document-copy"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="children_count"
          width="100"
          label="直属下级"
          sortable
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="edit"
              type="text"
              @click="count(scope.$index, scope.row)"
            >
              {{ scope.row.children_count }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          width="60"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.disabled == 0"
              active-color="#13ce66"
              inactive-color="#efefef"
              @change="freeze(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="开店状态"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.shop_status === 0"
              size="mini"
              effect="plain"
            >
              未开店
            </el-tag>
            <el-tag
              v-if="scope.row.shop_status === 1"
              size="mini"
              effect="plain"
              type="success"
            >
              已开店
            </el-tag>
            <el-tag
              v-if="scope.row.shop_status === 2"
              size="mini"
              effect="plain"
            >
              等待审核
            </el-tag>
            <el-tag
              v-if="scope.row.shop_status === 3"
              size="mini"
              effect="plain"
              type="warning"
            >
              店铺关闭
            </el-tag>
            <el-popover
              v-if="scope.row.shop_status === 4"
              placement="top-start"
              width="300"
              trigger="hover"
              :content="scope.row.reason"
            >
              <el-tag
                slot="reference"
                size="mini"
                effect="plain"
              >
                审核拒绝
              </el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="bind_date"
          label="加入时间"
          width="100"
        />
        <el-table-column
          label="已结算"
          width="80"
        >
          <template slot-scope="scope">
            ￥{{ (scope.row.rebateTotal - scope.row.noCloseRebate) / 100 }}
          </template>
        </el-table-column>
        <el-table-column
          label="未结算"
          width="80"
        >
          <template slot-scope="scope">
            ￥{{ scope.row.noCloseRebate / 100 }}
          </template>
        </el-table-column>
      </el-table>
      <div class="content-padded content-center">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="page.pageIndex"
          :total="total_count"
          :page-size="page.pageSize"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>

      <!-- 调整上下级弹框 -->
      <el-dialog
        title="调整上级"
        :visible.sync="editSuperiorVisible"
        :before-close="handleCancelSuperior"
      >
        <el-row :gutter="10">
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
        </el-row>

        <el-table
          v-loading="modalLoading"
          :data="modalList"
          style="width: 100%"
          :height="400"
          element-loading-text="数据加载中"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            type="index"
            width="50"
          />
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            label="手机号"
          />
          <el-table-column
            prop="promoter_grade_name"
            label="推广员等级"
          />
          <el-table-column
            prop="disabled"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.disabled == '0'"
                type="success"
                size="mini"
              >
                有效
              </el-tag>
              <el-tag
                v-else
                type="info"
                size="mini"
              >
                无效
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        <div
          v-if="modal_total_count > paramsModal.pageSize"
          class="content-padded content-center"
        >
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="paramsModal.page"
            :total="modal_total_count"
            :page-size="paramsModal.pageSize"
            @current-change="handleModalPage"
          />
        </div>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button @click.native="handleCancelSuperior">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitSuperiorAction"
          >
            确定
          </el-button>
        </div>
      </el-dialog>

      <!-- 添加推广员 -->
      <el-dialog
        title="添加推广员"
        :visible.sync="addVisible"
        :distinguish-cancel-and-close="false"
      >
        <el-row :gutter="10">
          <el-col>
            <el-alert
              title="添加的推广员必须为已经授权手机号的会员"
              type="info"
              show-icon
            />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col
            :md="8"
            :lg="10"
          >
            <el-input
              v-model="promoter_mobile"
              placeholder="会员手机号"
            />
          </el-col>
        </el-row>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button @click.native="addVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="addPromoter"
          >
            保存
          </el-button>
        </div>
      </el-dialog>

      <!-- 审核开通虚拟店 -->
      <el-dialog
        title="审核开通虚拟店"
        :visible.sync="updateShopVisible"
        :close-on-click-modal="false"
      >
        <template>
          <el-form>
            <el-form-item
              label="审核状态"
              label-width="100px"
            >
              <el-radio-group v-model="shop_status">
                <el-radio :label="1">
                  审核通过
                </el-radio>
                <el-radio :label="4">
                  审核拒绝
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="shop_status == 4"
              label="拒绝原因"
              label-width="100px"
            >
              <el-input
                v-model="currentRow.reason"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-form>
        </template>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button @click.native="updateShopVisible = false">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="actionShopStatus"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
      <!-- 审核开通虚拟店 -->

      <!-- 修改推广员等级-开始 -->
      <el-dialog
        title="修改推广员等级"
        :visible.sync="editGradeVisible"
        :before-close="handleCancel"
      >
        <template>
          <el-row
            class="grade-setting-row"
            :gutter="20"
          >
            <el-col
              :span="8"
              class="grade-setting-col"
            >
              {{ row.promoter_grade_name }}
            </el-col>
            <el-col
              :span="8"
              class="grade-setting-col"
            >
              调整为
            </el-col>
            <el-col
              :span="8"
              class="grade-setting-col"
            >
              <el-select
                v-model="newGradeName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gradeList.grade"
                  :key="item.grade_level"
                  :label="item.custom_name"
                  :value="item.grade_level"
                />
              </el-select>
            </el-col>
          </el-row>
        </template>
        <div
          slot="footer"
          class="dialog-footer content-center"
        >
          <el-button @click.native="handleCancel">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submitGradeAction"
          >
            确定调整
          </el-button>
        </div>
      </el-dialog>
      <!-- 修改推广员等级-结束 -->
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  addPromoter,
  getPopularizeList,
  editPopularizeRemove,
  editPopularizeGrade,
  editPopularizeDisabled,
  getPromoterGradeConfig,
  updatePromoterShop
} from '../../api/promotions'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  data () {
    return {
      params: {
        mobile: '',
        store_status: ''
      },
      paramsModal: {
        page: 1,
        pageSize: 14,
        mobile: ''
      },
      list: [],
      modalList: [],
      loading: false,
      modalLoading: false,
      addVisible: false,
      editSuperiorVisible: false,
      editGradeVisible: false,
      updateShopVisible: false,
      row: {},
      newGradeName: '',
      gradeList: {},
      identifierModal: '',
      promoter_mobile: '',
      shop_status: '',
      currentRow: null,
      total_count: 0,
      modal_total_count: 0,
      message: '',
      datapass_block: 1
    }
  },
  mounted () {
    this.loginType = this.$store.getters.login_type

    this.fetchList(this.params),
      this.getPopularizeListModalFun(this.modalList),
      getPromoterGradeConfig().then((res) => {
        this.gradeList = res.data.data
      })
  },
  methods: {
    onCopy () {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    detail (row) {
      let routeData = this.$router.resolve({
        path: this.matchHidePage('detail'),
        query: { user_id: row.user_id }
      })
      window.open(routeData.href, '_blank')
    },
    addPromoter () {
      addPromoter({ mobile: this.promoter_mobile }).then((res) => {
        this.promoter_mobile = ''
        this.addVisible = false
        this.$message({
          message: '添加推广员成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.fetchList()
      })
    },
    count (index, row) {
      if (row.children_count > 0) {
        let routeData = this.$router.resolve({
          path: this.matchHidePage('child'),
          query: { promoter_id: row.promoter_id }
        })
        window.open(routeData.href, '_blank')
      }
    },
    editPopularizeRemoveFun () {
      editPopularizeRemove({ 'user_id': this.row.user_id, 'new_user_id': this.currentRow }).then(
        (res) => {
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
    handleShopStatus (index, row) {
      this.currentRow = row
      var msg = ''
      if (row.shop_status == 0 || row.shop_status == 4 || row.shop_status == 3) {
        msg = '确定当前推广员开通虚拟店？'
        this.shop_status = 1
      } else if (row.shop_status == 1) {
        msg = '确定将当前推广员的虚拟店关闭？'
        this.shop_status = 3
      } else if (row.shop_status == 2) {
        this.updateShopVisible = true
        return
      }

      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.actionShopStatus()
          this.updateShopVisible = false
          this.list[index].status = this.shop_status
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    actionShopStatus () {
      var data = { user_id: this.currentRow.user_id, status: this.shop_status }
      if (this.currentRow.reason && this.shop_status == 4) {
        data.reason = this.currentRow.reason
      }
      updatePromoterShop(data).then((res) => {
        this.$message({ type: 'success', message: '操作成功' })
        this.fetchList()
        this.updateShopVisible = false
      })
      return true
    },
    editTop (row) {
      this.$confirm('调整至顶级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.currentRow = 0
          this.row = row
          this.message = '顶级'
          this.editPopularizeRemoveFun()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    editSuperior (row) {
      this.editSuperiorVisible = true
      this.row = row
      this.identifierModal = ''
      this.numberSearchModal()
    },
    editGrade (index, row) {
      this.editGradeVisible = true
      this.row = row
    },
    handleCancel () {
      this.editGradeVisible = false
    },
    submitGradeAction () {
      editPopularizeGrade({ 'user_id': this.row.user_id, 'grade_level': this.newGradeName }).then(
        (res) => {
          if (this.newGradeName == '') {
            this.$message({ message: '请选择调整后的等级', type: 'error' })
            return
          }
          this.editGradeVisible = false
          this.$message({
            message: '调整等级成功',
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchList()
        }
      )
    },
    freeze (row) {
      let active = !row.disabled ? false : true
      editPopularizeDisabled({ 'user_id': row.user_id, 'active': active }).then((res) => {
        row.disabled = active ? 0 : 1
        console.log(7, row.disabled, active)
        this.$message({
          type: 'success',
          message: '状态修改成功'
        })
      })
    },
    handleCancelSuperior () {
      this.editSuperiorVisible = false
    },

    numberSearchModal (e) {
      this.paramsModal.page = 1
      this.paramsModal.mobile = this.identifierModal
      this.getPopularizeListModalFun(this.paramsModal)
    },
    getPopularizeListModalFun (filter) {
      this.modalLoading = true
      getPopularizeList(filter).then((res) => {
        this.modalList = res.data.data.list
        this.modal_total_count = Number(res.data.data.total_count)
        this.modalLoading = false
      })
    },
    fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getPopularizeList(params).then((res) => {
        this.list = res.data.data.list
        this.total_count = Number(res.data.data.total_count)
        this.datapass_block = res.data.data.datapass_block
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      console.log('handleCurrentChange')
      if (val && val.user_id) {
        this.currentRow = val.user_id
      }
    },
    submitSuperiorAction () {
      this.editPopularizeRemoveFun()
      this.editSuperiorVisible = false
    },
    handleModalPage (page_num) {
      this.paramsModal.page = page_num
      this.getPopularizeListModalFun(this.paramsModal)
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.grade-setting-col {
  line-height: 40px;
}
.btn-gap {
  margin-left: 10px;
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
