<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage class="store-wihitelist">
    <SpRouterView>
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="mobile" :label="$t('7f673091.ce2bf3')">
          <el-input v-model="params.mobile" :placeholder="$t('7f673091.6e4f4b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="username" :label="$t('7f673091.75d152')">
          <el-input v-model="params.username" :placeholder="$t('7f673091.8093e3')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" :label="$t('7f673091.efa91f')">
          <SpSelectShop
            v-model="params.distributor_id"
            multiple
            clearable
            :placeholder="$t('7f673091.708c9d')"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="el-icon-circle-plus" @click="clickAddWhiteList()">
          {{ $t('7f673091.45609b') }}
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus" @click="uploadHandleChange()">
          {{ $t('7f673091.a00fda') }}
        </el-button>
        <el-button type="primary" @click="handleWhitelistExport">
          {{ $t('7f673091.55405e') }}
        </el-button>
        <el-button type="primary" icon="el-icon-delete" plain @click="clickDelAllWhiteList()">
          {{ $t('7f673091.ed7589') }}
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" width="55" :reserve-selection="false" />
        <el-table-column :label="$t('7f673091.2b6bc0')" width="120" fixed="left">
          <template slot-scope="scope">
            <el-button type="text" @click="editShopWhite(scope.row)">
              {{ $t('7f673091.95b351') }}
            </el-button>
            <el-button type="text" @click="delWhitelist(scope.row)">
              {{ $t('7f673091.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" :label="$t('7f673091.8098e2')" />
        <el-table-column prop="username" :label="$t('7f673091.60d045')" />
        <el-table-column prop="distributor_info" :label="$t('7f673091.baad7e')">
          <template slot-scope="scope">
            <!-- 店铺端 需要只展示自己的店铺名称 -->
            <span v-if="IS_DISTRIBUTOR()">{{
              scope.row.distributor_info.find((item) => item.distributor_id === shopId)?.name
            }}</span>
            <span v-else>{{ scope.row.distributor_info.map((item) => item.name).join(',') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributor_info" :label="$t('7f673091.f6d738')">
          <template slot-scope="scope">
            <span v-if="IS_DISTRIBUTOR()">{{
              scope.row.distributor_info.find((item) => item.distributor_id === shopId)?.shop_code
            }}</span>
            <span v-else>{{
              scope.row.distributor_info.map((item) => item.shop_code).join(',')
            }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 text-right">
        <el-pagination
          background
          :current-page.sync="page.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
        />
      </div>
      <!-- 添加白名单 -->
      <SpDialog
        ref="whitelistDialogRef"
        v-model="whitelistDialog"
        :title="dialogTitle"
        :modal="false"
        :form="whitelistForm"
        :form-list="whitelistFormList"
        @onSubmit="onWhitelistFormSubmit"
      />
      <!-- 清空白名单 -->
    </SpRouterView>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import shopDecoration from '@/components/function/shopDecoration'
import pcDecoration from '@/view/pc/homePage/default'
import shopSelect from '@/components/shopSelect'
import mixin, { pageMixin } from '@/mixins'
import { handleUploadFile } from '../../../api/common'
import { isMobile } from '@/utils/validate'
import { IS_DISTRIBUTOR } from '@/utils'
export default {
  mixins: [mixin, pageMixin],
  data() {
    const initialParams = {
      username: undefined,
      distributor_id: undefined,
      mobile: undefined
    }

    return {
      tableList: [],
      loading: false,
      params: {
        ...initialParams
      },
      dialogTitle: '',
      editType: '',
      whitelistDialog: false,
      whitelistForm: {
        id: null,
        distributors: [],
        username: '',
        mobile: ''
      },
      whitelistFormList: [
        {
          label: this.$t('7f673091.8098e2'),
          key: 'mobile',
          type: 'input',
          message: this.$t('7f673091.6e4f4b'),
          isShow: () => {
            return this.editType !== 'delAll'
          },
          validator: (rule, value, callback) => {
            const { mobile } = this.whitelistForm
            if (this.editType === 'delAll') {
              callback()
              return
            }
            if (!mobile) {
              callback(new Error(this.$t('7f673091.a11685')))
            } else {
              if (!isMobile(mobile)) {
                callback(new Error(this.$t('7f673091.dc6732')))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: this.$t('7f673091.60d045'),
          key: 'username',
          type: 'input',
          // required: true,
          message: this.$t('7f673091.9e3f21'),
          isShow: () => {
            return this.editType !== 'delAll'
          },
          validator: (rule, value, callback) => {
            const { username } = this.whitelistForm
            if (this.editType === 'delAll') {
              callback()
              return
            }
            if (!username) {
              callback(new Error(this.$t('7f673091.bfc304')))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('7f673091.afa2e6'),
          key: 'num',
          isShow: () => {
            return this.editType !== 'edit' || !this.IS_DISTRIBUTOR() // 店铺端编辑不能选择店铺
          },
          component: () => (
            <div class='distributor-tags'>
              {this.whitelistForm.distributors.map((item, index) => (
                <el-tag key={item.name} closable on-close={this.storeClose.bind(this, index)}>
                  {item.name}
                </el-tag>
              ))}
              <el-button type='text' on-click={this.addStoreAction}>
                {this.$t('7f673091.7b91b1')}
              </el-button>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distributors } = this.whitelistForm
            if (distributors.length == 0) {
              callback(new Error(this.$t('7f673091.06accf')))
            } else {
              callback()
            }
          }
        }
      ],
      selectMobile: [] // 已选中行的 mobile 列表，用于导出
    }
  },
  computed: {
    ...mapGetters(['shopId'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    // 导出白名单：有勾选则导出选中项，无勾选则按当前筛选条件导出全部
    async handleWhitelistExport() {
      const exportData = {
        ...this.getParams()
      }
      if (this.selectMobile && this.selectMobile.length > 0) {
        exportData.search_mobile = this.selectMobile
      }
      const { status } = await this.$api.company.whitelistExport(exportData)
      if (status) {
        this.$message.success(this.$t('7f673091.3e1ddd'))
        this.$export_open('distributor_white_list')
      } else {
        this.$message.error(this.$t('7f673091.dd51ab'))
      }
    },
    // 点击添加白名单
    clickAddWhiteList() {
      this.whitelistForm.id = undefined
      this.whitelistForm.distributors = []
      this.whitelistForm.username = ''
      this.whitelistForm.mobile = ''
      this.editType = 'add'
      this.dialogTitle = this.$t('7f673091.45609b')
      this.whitelistDialog = true
    },
    // 添加白名单适用店铺
    async addStoreAction() {
      const distributor_ids = this.whitelistForm.distributors.map((item) => item.distributor_id)
      const { data } = await this.$picker.shop({
        data: distributor_ids
      })
      this.whitelistForm.distributors = JSON.parse(JSON.stringify(data))
    },
    storeClose(index) {
      this.whitelistForm.distributors.splice(index, 1)
    },
    // 添加白名单
    async addWhitelistFormSubmit() {
      const { distributors, username, mobile, id } = this.whitelistForm
      const distributor_id = distributors.map((item) => item.distributor_id)
      let params = {
        id, // 传了id就是修改
        distributor_id: distributor_id, // 编辑的时候，这里是一条int类型的店铺ID，新增的时候是数组
        username,
        mobile
      }
      const { status } = await this.$api.company.saveShopWhiteList(params)
      if (status) {
        this.$message.success(this.$t('7f673091.3fdaea'))
      } else {
        this.$message.error(this.$t('7f673091.6452a0'))
      }
      this.whitelistForm = {
        id: null,
        distributors: [],
        username: '',
        mobile: ''
      }
      this.whitelistDialog = false
      this.fetchList()
    },
    // 提交白名单表单
    async onWhitelistFormSubmit() {
      if (this.editType === 'delAll') {
        this.delWhitelist()
      } else {
        this.addWhitelistFormSubmit()
      }
    },
    // 导入店铺
    uploadHandleChange(file, fileList) {
      this.$router.push({ path: this.matchRoutePath('storewhitelistUpload') })
    },
    // 编辑白名单
    editShopWhite(row) {
      console.log('🚀🚀🚀 ~ file: storewhitelist.vue:225 ~ editShopWhite ~ row:', row)
      const { distributor_info, mobile, username, id } = row
      const distributors = distributor_info.map((item) => ({
        distributor_id: item.distributor_id,
        name: item.name
      }))
      this.whitelistForm = {
        id,
        distributors,
        username,
        mobile
      }
      this.dialogTitle = this.$t('7f673091.86bbf6')
      this.editType = 'edit'
      this.whitelistDialog = true
    },
    // 删除白名单
    async delWhitelist(row) {
      const type = this.editType === 'delAll' ? 'distributor' : 'id' // 'distributor' 清空店铺白名单，id 清除一个店铺
      const distributorsId = this.whitelistForm.distributors.map((item) => item.distributor_id)
      const id = this.editType === 'delAll' ? distributorsId : [row.id]
      const params = {
        type,
        id,
        login_type: this.IS_DISTRIBUTOR() ? 'distributor' : ''
      }
      const { status } = await this.$api.company.delShopWhite(params)
      if (status) {
        this.$message.success(this.$t('7f673091.0007d1'))
      } else {
        this.$message.error(this.$t('7f673091.acf066'))
      }
      this.whitelistDialog = false
      this.fetchList()
    },
    // 清空白名单
    async clickDelAllWhiteList() {
      this.dialogTitle = this.$t('7f673091.fb44eb')
      this.editType = 'delAll'
      this.whitelistDialog = true
      this.whitelistForm.distributors = []
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }

      // 如果distributor_id不是数组，则转换为数组
      if (params.distributor_id && !Array.isArray(params.distributor_id)) {
        params.distributor_id = [params.distributor_id]
      }
      const { list, total_count } = await this.$api.company.getShopWhiteList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    handleSelectionChange(val) {
      let mobile = []
      for (let i in val) {
        mobile.push(val[i].mobile)
      }
      this.selectMobile = mobile
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('editor') === -1 && to.path.indexOf('details') === -1) {
      this.fetchList()
    }
  }
}
</script>
