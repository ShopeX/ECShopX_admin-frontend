<style scoped lang="scss">
  .sp-filter-form {
    margin-bottom: 16px;
  }
</style>

<template>
  <div class="distributorAftersalesAddress">
    <SpPlatformTip h5 app alipay/>

    <el-form :model="searchParams" :inline="true">
      <el-form-item label="供应商名称">
        <el-input v-model="searchParams.supplier_name" clearable/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="searchParams.mobile" clearable/>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchParams.is_check" placeholder="请选择" clearable>
          <el-option
              v-for="item in check_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table v-loading="tableLoading" :data="dataList" border>
      <el-table-column prop="supplier_name" label="供应商名称"/>
      <el-table-column prop="contact" label="负责人"/>
      <el-table-column prop="mobile" label="手机号"/>
      <el-table-column prop="login_name" label="登录账号"/>
      <el-table-column prop="check_state" label="审核状态"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              v-if="scope.row.check_state == '审核通过'"
              type="text"
              @click="editRow(scope.row)"
          >
            修改
          </el-button>
          <el-button
              v-else
              type="text"
              @click="editRow(scope.row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="content-center content-top-padded">
      <el-pagination
          background=""
          layout="total, sizes, prev, pager, next"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onSizeChange"
      />
    </div>

    <!-- 审核供应商 -->
    <el-dialog
        title="审核供应商"
        :visible.sync="editDialog"
        :close-on-click-modal="false"
        width="800px"
    >
      <!--supplier_name', 'contact', 'mobile', 'business_license', 'wechat_qrcode', 'service_tel', 'bank_name', 'bank_account-->
      <el-descriptions :column="2" border :labelStyle="{width:'150px', textAlign:'right'}">
        <el-descriptions-item>
          <template slot="label">
            供应商名称
          </template>
          {{ editForm.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            联系人
          </template>
          {{ editForm.contact }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile"></i>
            手机号
          </template>
          {{ editForm.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            客服电话
          </template>
          {{ editForm.service_tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            营业执照
          </template>
          <a :href="editForm.business_license" target="_blank"><img :src="editForm.business_license" height="100"/></a>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            客服二维码
          </template>
          <a :href="editForm.wechat_qrcode" target="_blank"><img :src="editForm.wechat_qrcode" height="100"/></a>
        </el-descriptions-item>        
        <el-descriptions-item>
          <template slot="label">
            收款银行
          </template>
          {{ editForm.bank_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            收款账号
          </template>
          {{ editForm.bank_account }}
        </el-descriptions-item>
<!--        <el-descriptions-item>-->
<!--          <template slot="label">-->
<!--            公众号openid-->
<!--          </template>-->
<!--          <el-input-->
<!--              type="textarea"-->
<!--              :rows="2"-->
<!--              placeholder="每行输入一个openid"-->
<!--              v-model="editForm.wx_openid">-->
<!--          </el-input>-->
<!--        </el-descriptions-item>-->
      </el-descriptions>

      <el-form ref="editForm" label-width="160px" style="padding-top: 10px;">
        <el-form-item label="审核结果">
          <el-radio v-model="editForm.is_check" label="1">审核通过</el-radio>
          <el-radio v-model="editForm.is_check" label="2">审核拒绝</el-radio>
        </el-form-item>
        <el-form-item label="审核备注" v-if="editForm.is_check == '2'">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="editForm.audit_remark">
          </el-input>
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="editFormSubmit"> 确认</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import mixin, {pageMixin} from '@/mixins'

  export default {
    mixins: [mixin, pageMixin],
    data() {
      return {
        searchParams: {
          agent_name: '',
          province: []
        },
        check_options: [
          {label: '待审核', value: 0},
          {label: '审核通过', value: 1},
          {label: '审核拒绝', value: 2},
        ],
        dataList: [],
        provinces: [],
        tableLoading: false,
        loading: false,
        editDialog: false,
        editForm: {
          id: '',
          is_check: '0',
          agent_name: '',
          wx_openid: '',
          province: [],
        }
      }
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      onSearch() {
        this.page.pageIndex = 1
        this.$nextTick(() => {
          this.fetchList()
        })
      },
      async fetchList() {
        this.tableLoading = true
        const {pageIndex: page, pageSize: page_size} = this.page
        this.searchParams = {...this.searchParams , page, page_size}
        const {list, total_count} = await this.$api.supplier.getSupplierList(this.searchParams)
        this.dataList = list
        this.page.total = total_count
        this.tableLoading = false
      },
      async editRow(row) {
        this.editForm = {...row}
        this.editDialog = true
        this.loading = false
      },
      async editFormSubmit() {
        if (!parseInt(this.editForm.is_check)) {
          this.$message.error('请选择审核结果')
          return false;
        }
        this.loading = true
        try {
          const {status} = await this.$api.supplier.checkSupplier(this.editForm)
          this.$message.success('保存成功')
          this.editDialog = false
          this.fetchList()
        } catch (e) {
          
        }
        this.loading = false
      },
    }
  }
</script>

<style scoped lang="scss">
  .distributor-tags {
    .el-tag {
      margin-right: 10px;
    }
  }
</style>
