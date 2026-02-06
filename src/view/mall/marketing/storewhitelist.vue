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
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="params.mobile" placeholder="请输入手机号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="username" label="姓名:">
          <el-input v-model="params.username" placeholder="请输入姓名" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop v-model="params.distributor_id" multiple clearable placeholder="请选择" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="el-icon-circle-plus" @click="clickAddWhiteList()">
          添加白名单
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus" @click="uploadHandleChange()">
          导入白名单
        </el-button>
        <el-button type="primary" @click="handleWhitelistExport"> 导出 </el-button>
        <el-button type="primary" icon="el-icon-delete" plain @click="clickDelAllWhiteList()">
          清空白名单
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editShopWhite(scope.row)"> 编辑 </el-button>
            <el-button type="text" @click="delWhitelist(scope.row)"> 删除 </el-button>
          </template>
        </el-table-column>
        <el-table-column type="selection" align="center" label="全选" />
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="distributor_info" label="所属店铺">
          <template slot-scope="scope">
            <!-- 店铺端 需要只展示自己的店铺名称 -->
            <span v-if="IS_DISTRIBUTOR()">{{
              scope.row.distributor_info.find((item) => item.distributor_id === shopId)?.name
            }}</span>
            <span v-else>{{ scope.row.distributor_info.map((item) => item.name).join(',') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributor_info" label="店铺号">
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
      tableList: null,
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
          label: '手机号',
          key: 'mobile',
          type: 'input',
          message: '请输入手机号',
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
              callback(new Error('手机号不能为空'))
            } else {
              if (!isMobile(mobile)) {
                callback(new Error('手机号格式错误'))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: '姓名',
          key: 'username',
          type: 'input',
          // required: true,
          message: '请输入联系人',
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
              callback(new Error('联系人不能为空'))
            } else {
              callback()
            }
          }
        },
        {
          label: '选择店铺',
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
                添加适用店铺
              </el-button>
            </div>
          ),
          validator: (rule, value, callback) => {
            const { distributors } = this.whitelistForm
            if (distributors.length == 0) {
              callback(new Error('请选择店铺'))
            } else {
              callback()
            }
          }
        }
      ],
      selectMobile: '' // 已选中row
    }
  },
  computed: {
    ...mapGetters(['shopId'])
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    // 导出白名单
    async handleWhitelistExport() {
      if (this.selectMobile.length) {
        const exportData = {
          search_mobile: this.selectMobile,
          ...this.getParams()
        }
        console.log(
          '🚀🚀🚀 ~ file: storewhitelist.vue:205 ~ whitelistExport ~ exportData:',
          exportData
        )
        const { status } = await this.$api.company.whitelistExport(exportData)
        if (status) {
          this.$message.success('已加入执行队列，请在设置-导出列表中下载')
          this.$export_open('distributor_white_list')
        } else {
          this.$message.error('导出失败')
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请选择需要导出的数据'
        })
      }
    },
    // 点击添加白名单
    clickAddWhiteList() {
      this.whitelistForm.id = undefined
      this.whitelistForm.distributors = []
      this.whitelistForm.username = ''
      this.whitelistForm.mobile = ''
      this.editType = 'add'
      this.dialogTitle = '添加白名单'
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
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
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
      this.dialogTitle = '编辑白名单'
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
        this.$message.success('删除成功')
      } else {
        this.$message.error('删除失败')
      }
      this.whitelistDialog = false
      this.fetchList()
    },
    // 清空白名单
    async clickDelAllWhiteList() {
      this.dialogTitle = '清空店铺白名单'
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
