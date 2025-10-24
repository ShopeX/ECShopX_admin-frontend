<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage class="distributorAftersalesAddress">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem label="供应商名称" prop="supplier_name">
        <el-input v-model="searchParams.supplier_name" placeholder="请输入供应商名称" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem label="手机号" prop="mobile">
        <el-input v-model="searchParams.mobile" placeholder="请输入手机号" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem label="审核状态" prop="is_check">
        <el-select v-model="searchParams.is_check" placeholder="请选择" clearable>
          <el-option
            v-for="item in check_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>

    <SpFinder
      ref="finder"
      url="/supplier/get_supplier_list"
      fixed-row-action
      row-actions-width="200px"
      :other-config="{}"
      :setting="tableSetting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
      no-selection
      row-actions-fixed-align="left"
    />

    <!-- 审核供应商 -->
    <el-dialog
      title="审核供应商"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <!--supplier_name', 'contact', 'mobile', 'business_license', 'wechat_qrcode', 'service_tel', 'bank_name', 'bank_account-->
      <el-descriptions :column="2" border :label-style="{ width: '150px', textAlign: 'right' }">
        <el-descriptions-item>
          <template slot="label"> 供应商名称 </template>
          {{ editForm.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            联系人
          </template>
          {{ editForm.contact }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile" />
            手机号
          </template>
          {{ editForm.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 客服电话 </template>
          {{ editForm.service_tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 营业执照 </template>
          <a :href="editForm.business_license" target="_blank"
            ><img :src="editForm.business_license" height="100"
          ></a>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 客服二维码 </template>
          <a :href="editForm.wechat_qrcode" target="_blank"
            ><img :src="editForm.wechat_qrcode" height="100"
          ></a>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 收款银行 </template>
          {{ editForm.bank_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 收款账号 </template>
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

      <el-form ref="editForm" label-width="160px" style="padding-top: 10px">
        <el-form-item label="审核结果">
          <el-radio v-model="editForm.is_check" label="1">审核通过</el-radio>
          <el-radio v-model="editForm.is_check" label="2">审核拒绝</el-radio>
        </el-form-item>
        <el-form-item label="审核备注" v-if="editForm.is_check == '2'">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="editForm.audit_remark"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="editFormSubmit"> 确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </SpPage>
</template>

<script>
import mixin, { pageMixin } from '@/mixins'

export default {
  mixins: [mixin, pageMixin],
  data() {
    return {
      searchParams: {
        agent_name: '',
        province: []
      },
      check_options: [
        { label: '待审核', value: 0 },
        { label: '审核通过', value: 1 },
        { label: '审核拒绝', value: 2 }
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
        province: []
      },
      tableSetting: {
        columns: [
          { name: '审核状态', key: 'check_state' },
          { name: '供应商名称', key: 'supplier_name' },
          { name: '负责人', key: 'contact' },
          { name: '手机号', key: 'mobile' },
          { name: '登录账号', key: 'login_name' }
        ],
        actions: [
          {
            name: '修改',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return row.check_state == '审核通过'
            },
            action: {
              type: 'link',
              handler: ([row]) => {
                this.editRow(row)
              }
            }
          },
          {
            name: '审核',
            key: 'review',
            type: 'button',
            buttonType: 'text',
            visible: row => {
              return row.check_state != '审核通过'
            },
            action: {
              type: 'link',
              handler: ([row]) => {
                this.editRow(row)
              }
            }
          }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    beforeSearch(params) {
      return {
        ...params,
        ...this.searchParams
      }
    },
    onSearch() {
      this.$refs['finder'].refresh(true)
    },
    async editRow(row) {
      this.editForm = { ...row }
      this.editDialog = true
      this.loading = false
    },
    async editFormSubmit() {
      if (!parseInt(this.editForm.is_check)) {
        this.$message.error('请选择审核结果')
        return false
      }
      this.loading = true
      try {
        const { status } = await this.$api.supplier.checkSupplier(this.editForm)
        this.$message.success('保存成功')
        this.editDialog = false
        this.$refs['finder'].refresh()
      } catch (e) {}
      this.loading = false
    }
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
