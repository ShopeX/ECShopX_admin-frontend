<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div v-if="$route.path.indexOf('child') === -1 && $route.path.indexOf('detail') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="mobile" :label="$t('a8b7ec6e.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('a8b7ec6e.6e4f4b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="store_status" :label="$t('a8b7ec6e.7c4b82')">
          <el-select v-model="params.store_status" :placeholder="$t('a8b7ec6e.b276ed')" clearable>
            <el-option :label="$t('a8b7ec6e.f1e0af')" value="0" />
            <el-option :label="$t('a8b7ec6e.30e9f3')" value="1" />
            <el-option :label="$t('a8b7ec6e.9c5850')" value="3" />
            <el-option :label="$t('a8b7ec6e.f6324c')" value="2" />
            <el-option :label="$t('a8b7ec6e.146bb2')" value="4" />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>
      <div v-if="loginType !== 'distributor'" class="action-container">
        <el-button type="primary" icon="el-icon-circle-plus" @click.native="addVisible = true">
          {{ $t('a8b7ec6e.917e6c') }}
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        border
        :data="list"
        :height="wheight - 170"
        :element-loading-text="$t('a8b7ec6e.f09b12')"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column :label="$t('a8b7ec6e.2b6bc0')" width="120">
          <template slot-scope="scope">
            <el-button type="text" class="btn-gap" @click="detail(scope.row)">
              {{ $t('a8b7ec6e.3329bc') }}
            </el-button>
            <el-popover placement="right" width="440" trigger="hover">
              <div class="operating-icons">
                <el-button icon="edit" type="text" class="btn-gap" @click="detail(scope.row)">
                  {{ $t('a8b7ec6e.3329bc') }}
                </el-button>
                <el-button icon="edit" type="text" @click="editTop(scope.row)">
                  {{ $t('a8b7ec6e.d9865f') }}
                </el-button>
                <el-button icon="edit" type="text" @click="editSuperior(scope.row)">
                  {{ $t('a8b7ec6e.23ced7') }}
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
                  {{ $t('a8b7ec6e.7f009c') }}
                </el-button>
                <el-button
                  v-if="scope.row.shop_status === 2"
                  type="text"
                  @click="handleShopStatus(scope.$index, scope.row)"
                >
                  {{ $t('a8b7ec6e.a1d511') }}
                </el-button>
                <el-button
                  v-if="scope.row.shop_status === 1"
                  type="text"
                  @click="handleShopStatus(scope.$index, scope.row)"
                >
                  {{ $t('a8b7ec6e.4be651') }}
                </el-button>
                <el-button
                  v-show="gradeList.isOpenPromoterGrade == 'true'"
                  icon="edit"
                  type="text"
                  @click="editGrade(scope.$index, scope.row)"
                >
                  {{ $t('a8b7ec6e.31520d') }}
                </el-button>
              </div>
              <el-button slot="reference" type="text">
                <i class="el-icon-d-arrow-right" />
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="username" :label="$t('a8b7ec6e.60d045')" />
        <el-table-column prop="mobile" :label="$t('a8b7ec6e.8098e2')" width="150">
          <template slot-scope="scope">
            <i v-if="scope.row.mobile" class="el-icon-mobile" />
            {{ scope.row.mobile }}
            <el-tooltip
              v-if="scope.row.mobile && datapass_block == 0"
              effect="dark"
              :content="$t('a8b7ec6e.79d3ab')"
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
        <el-table-column prop="promoter_grade_name" :label="$t('a8b7ec6e.917de5')" />
        <el-table-column prop="pmobile" :label="$t('a8b7ec6e.5cf93d')" width="150">
          <template slot-scope="scope">
            <i v-if="scope.row.pmobile && scope.row.pmobile != ''" class="el-icon-mobile" />
            {{ scope.row.pmobile && scope.row.pmobile != '' ? scope.row.pmobile : '-' }}
            <el-tooltip
              v-if="scope.row.pmobile && scope.row.pmobile != ''"
              effect="dark"
              :content="$t('a8b7ec6e.79d3ab')"
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
        <el-table-column prop="children_count" width="100" :label="$t('a8b7ec6e.721e8b')" sortable>
          <template slot-scope="scope">
            <el-button size="mini" icon="edit" type="text" @click="count(scope.$index, scope.row)">
              {{ scope.row.children_count }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a8b7ec6e.3fea7c')" width="60">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.disabled == 0"
              active-color="#13ce66"
              inactive-color="#efefef"
              @change="freeze(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('a8b7ec6e.eb96f1')" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.shop_status === 0" size="mini" effect="plain">
              {{ $t('a8b7ec6e.f1e0af') }}
            </el-tag>
            <el-tag v-if="scope.row.shop_status === 1" size="mini" effect="plain" type="success">
              {{ $t('a8b7ec6e.30e9f3') }}
            </el-tag>
            <el-tag v-if="scope.row.shop_status === 2" size="mini" effect="plain">
              {{ $t('a8b7ec6e.f6324c') }}
            </el-tag>
            <el-tag v-if="scope.row.shop_status === 3" size="mini" effect="plain" type="warning">
              {{ $t('a8b7ec6e.87ebc2') }}
            </el-tag>
            <el-popover
              v-if="scope.row.shop_status === 4"
              placement="top-start"
              width="300"
              trigger="hover"
              :content="scope.row.reason"
            >
              <el-tag slot="reference" size="mini" effect="plain">
                {{ $t('a8b7ec6e.146bb2') }}
              </el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="bind_date" :label="$t('a8b7ec6e.8653cd')" width="100" />
        <el-table-column :label="$t('a8b7ec6e.139304')" width="80">
          <template slot-scope="scope">
            ￥{{ (scope.row.rebateTotal - scope.row.noCloseRebate) / 100 }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('a8b7ec6e.facb53')" width="80">
          <template slot-scope="scope"> ￥{{ scope.row.noCloseRebate / 100 }} </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 text-right">
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
        :title="$t('a8b7ec6e.23ced7')"
        :visible.sync="editSuperiorVisible"
        :before-close="handleCancelSuperior"
      >
        <el-row :gutter="10">
          <el-col :md="8" :lg="10">
            <el-input v-model="identifierModal" :placeholder="$t('a8b7ec6e.6e4f4b')">
              <el-button slot="append" icon="el-icon-search" @click="numberSearchModal" />
            </el-input>
          </el-col>
        </el-row>

        <el-table
          v-loading="modalLoading"
          :data="modalList"
          style="width: 100%"
          :height="400"
          :element-loading-text="$t('a8b7ec6e.f09b12')"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" width="50" />
          <el-table-column prop="username" :label="$t('a8b7ec6e.60d045')" />
          <el-table-column prop="mobile" :label="$t('a8b7ec6e.8098e2')" />
          <el-table-column prop="promoter_grade_name" :label="$t('a8b7ec6e.917de5')" />
          <el-table-column prop="disabled" :label="$t('a8b7ec6e.3fea7c')">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.disabled == '0'" type="success" size="mini">
                {{ $t('a8b7ec6e.c6cc39') }}
              </el-tag>
              <el-tag v-else type="info" size="mini"> {{ $t('a8b7ec6e.1abbb1') }} </el-tag>
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
          <el-button @click.native="handleCancelSuperior"> {{ $t('a8b7ec6e.625fb2') }} </el-button>
          <el-button type="primary" @click="submitSuperiorAction">
            {{ $t('a8b7ec6e.38cf16') }}
          </el-button>
        </div>
      </el-dialog>

      <!-- 添加推广员 -->
      <el-dialog
        :title="$t('a8b7ec6e.917e6c')"
        :visible.sync="addVisible"
        :distinguish-cancel-and-close="false"
      >
        <el-row :gutter="10">
          <el-col>
            <el-alert :title="$t('a8b7ec6e.0b61ae')" type="info" show-icon />
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :md="8" :lg="10">
            <el-input v-model="promoter_mobile" :placeholder="$t('a8b7ec6e.6a52ee')" />
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer content-center">
          <el-button @click.native="addVisible = false"> {{ $t('a8b7ec6e.625fb2') }} </el-button>
          <el-button type="primary" @click="addPromoter"> {{ $t('a8b7ec6e.be5fbb') }} </el-button>
        </div>
      </el-dialog>

      <!-- 审核开通虚拟店 -->
      <el-dialog
        :title="$t('a8b7ec6e.b54ce7')"
        :visible.sync="updateShopVisible"
        :close-on-click-modal="false"
      >
        <template>
          <el-form>
            <el-form-item :label="$t('a8b7ec6e.b6d0e9')" label-width="100px">
              <el-radio-group v-model="shop_status">
                <el-radio :label="1"> {{ $t('a8b7ec6e.871a30') }} </el-radio>
                <el-radio :label="4"> {{ $t('a8b7ec6e.146bb2') }} </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="shop_status == 4"
              :label="$t('a8b7ec6e.f48f94')"
              label-width="100px"
            >
              <el-input v-model="currentRow.reason" type="textarea" :rows="4" />
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer content-center">
          <el-button @click.native="updateShopVisible = false">
            {{ $t('a8b7ec6e.625fb2') }}
          </el-button>
          <el-button type="primary" @click="actionShopStatus">
            {{ $t('a8b7ec6e.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
      <!-- 审核开通虚拟店 -->

      <!-- 修改推广员等级-开始 -->
      <el-dialog
        :title="$t('a8b7ec6e.31520d')"
        :visible.sync="editGradeVisible"
        :before-close="handleCancel"
      >
        <template>
          <el-row class="grade-setting-row" :gutter="20">
            <el-col :span="8" class="grade-setting-col">
              {{ row.promoter_grade_name }}
            </el-col>
            <el-col :span="8" class="grade-setting-col"> {{ $t('a8b7ec6e.d4b609') }} </el-col>
            <el-col :span="8" class="grade-setting-col">
              <el-select v-model="newGradeName" :placeholder="$t('a8b7ec6e.708c9d')">
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
        <div slot="footer" class="dialog-footer content-center">
          <el-button @click.native="handleCancel"> {{ $t('a8b7ec6e.625fb2') }} </el-button>
          <el-button type="primary" @click="submitGradeAction">
            {{ $t('a8b7ec6e.1e333a') }}
          </el-button>
        </div>
      </el-dialog>
      <!-- 修改推广员等级-结束 -->
    </div>
    <router-view />
  </SpPage>
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
  data() {
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
  mounted() {
    this.loginType = this.$store.getters.login_type

    this.fetchList(this.params),
      this.getPopularizeListModalFun(this.modalList),
      getPromoterGradeConfig().then((res) => {
        this.gradeList = res.data.data
      })
  },
  methods: {
    onSearch() {
      this.fetchList()
    },
    onReset() {
      this.params = {
        mobile: '',
        store_status: ''
      }
      this.fetchList()
    },
    onCopy() {
      this.$notify.success({
        message: this.$t('a8b7ec6e.20a495'),
        showClose: true
      })
    },
    detail(row) {
      let routeData = this.$router.resolve({
        path: this.matchRoutePath('detail'),
        query: { user_id: row.user_id }
      })
      window.open(routeData.href, '_blank')
    },
    addPromoter() {
      addPromoter({ mobile: this.promoter_mobile }).then((res) => {
        this.promoter_mobile = ''
        this.addVisible = false
        this.$message({
          message: this.$t('a8b7ec6e.9d915b'),
          type: 'success',
          duration: 2 * 1000
        })
        this.fetchList()
      })
    },
    count(index, row) {
      if (row.children_count > 0) {
        let routeData = this.$router.resolve({
          path: this.matchRoutePath('child'),
          query: { promoter_id: row.promoter_id }
        })
        window.open(routeData.href, '_blank')
      }
    },
    editPopularizeRemoveFun() {
      editPopularizeRemove({ user_id: this.row.user_id, new_user_id: this.currentRow }).then(
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
    handleShopStatus(index, row) {
      this.currentRow = row
      var msg = ''
      if (row.shop_status == 0 || row.shop_status == 4 || row.shop_status == 3) {
        msg = this.$t('a8b7ec6e.b132f7')
        this.shop_status = 1
      } else if (row.shop_status == 1) {
        msg = this.$t('a8b7ec6e.5d8928')
        this.shop_status = 3
      } else if (row.shop_status == 2) {
        this.updateShopVisible = true
        return
      }

      this.$confirm(msg, this.$t('a8b7ec6e.02d981'), {
        confirmButtonText: this.$t('a8b7ec6e.38cf16'),
        cancelButtonText: this.$t('a8b7ec6e.625fb2'),
        type: 'warning',
        center: true
      })
        .then(() => {
          this.actionShopStatus()
          this.updateShopVisible = false
          this.list[index].status = this.shop_status
        })
        .catch(() => {
          this.$message({ type: 'info', message: this.$t('a8b7ec6e.2111cc') })
        })
    },
    actionShopStatus() {
      var data = { user_id: this.currentRow.user_id, status: this.shop_status }
      if (this.currentRow.reason && this.shop_status == 4) {
        data.reason = this.currentRow.reason
      }
      updatePromoterShop(data).then((res) => {
        this.$message({ type: 'success', message: this.$t('a8b7ec6e.33130f') })
        this.fetchList()
        this.updateShopVisible = false
      })
      return true
    },
    editTop(row) {
      this.$confirm(this.$t('a8b7ec6e.53ad9e'), this.$t('a8b7ec6e.02d981'), {
        confirmButtonText: this.$t('a8b7ec6e.38cf16'),
        cancelButtonText: this.$t('a8b7ec6e.625fb2'),
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
    editSuperior(row) {
      this.editSuperiorVisible = true
      this.row = row
      this.identifierModal = ''
      this.numberSearchModal()
    },
    editGrade(index, row) {
      this.editGradeVisible = true
      this.row = row
    },
    handleCancel() {
      this.editGradeVisible = false
    },
    submitGradeAction() {
      editPopularizeGrade({ user_id: this.row.user_id, grade_level: this.newGradeName }).then(
        (res) => {
          if (this.newGradeName == '') {
            this.$message({ message: this.$t('a8b7ec6e.8e27d0'), type: 'error' })
            return
          }
          this.editGradeVisible = false
          this.$message({
            message: this.$t('a8b7ec6e.777aca'),
            type: 'success',
            duration: 5 * 1000
          })
          this.fetchList()
        }
      )
    },
    freeze(row) {
      let active = !row.disabled ? false : true
      editPopularizeDisabled({ user_id: row.user_id, active: active }).then((res) => {
        row.disabled = active ? 0 : 1
        console.log(7, row.disabled, active)
        this.$message({
          type: 'success',
          message: this.$t('a8b7ec6e.225b5e')
        })
      })
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
    fetchList() {
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
    handleCurrentChange(val) {
      console.log('handleCurrentChange')
      if (val && val.user_id) {
        this.currentRow = val.user_id
      }
    },
    submitSuperiorAction() {
      this.editPopularizeRemoveFun()
      this.editSuperiorVisible = false
    },
    handleModalPage(page_num) {
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
