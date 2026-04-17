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
  <SpPage class="distributorAftersalesAddress">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem :label="$t('bb662cf9.9190cc')" prop="supplier_name">
        <el-input
          v-model="searchParams.supplier_name"
          :placeholder="$t('bb662cf9.f0c2bb')"
          clearable
        />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('bb662cf9.8098e2')" prop="mobile">
        <el-input v-model="searchParams.mobile" :placeholder="$t('bb662cf9.6e4f4b')" clearable />
      </SpFilterFormItem>
      <SpFilterFormItem :label="$t('bb662cf9.b6d0e9')" prop="is_check">
        <el-select v-model="searchParams.is_check" :placeholder="$t('bb662cf9.708c9d')" clearable>
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
      :title="$t('bb662cf9.d3f7d8')"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <!--supplier_name', 'contact', 'mobile', 'business_license', 'wechat_qrcode', 'service_tel', 'bank_name', 'bank_account-->
      <el-descriptions :column="2" border :label-style="{ width: '150px', textAlign: 'right' }">
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.9190cc') }} </template>
          {{ editForm.supplier_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user" />
            {{ $t('bb662cf9.52409d') }}
          </template>
          {{ editForm.contact }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile" />
            {{ $t('bb662cf9.8098e2') }}
          </template>
          {{ editForm.mobile }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.e84643') }} </template>
          {{ editForm.service_tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.e0b8cc') }} </template>
          <a :href="editForm.business_license" target="_blank"
            ><img :src="editForm.business_license" height="100"
          /></a>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.939fdb') }} </template>
          <a :href="editForm.wechat_qrcode" target="_blank"
            ><img :src="editForm.wechat_qrcode" height="100"
          /></a>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.bd4097') }} </template>
          {{ editForm.bank_name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> {{ $t('bb662cf9.31eab8') }} </template>
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
        <el-form-item :label="$t('bb662cf9.8beefb')">
          <el-radio v-model="editForm.is_check" label="1">{{ $t('bb662cf9.871a30') }}</el-radio>
          <el-radio v-model="editForm.is_check" label="2">{{ $t('bb662cf9.146bb2') }}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('bb662cf9.200d69')" v-if="editForm.is_check == '2'">
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('bb662cf9.a11cc7')"
            v-model="editForm.audit_remark"
          />
        </el-form-item>
        <div class="section-footer with-border content-center">
          <el-button v-loading="loading" type="primary" @click="editFormSubmit">
            {{ $t('bb662cf9.e83a25') }}
          </el-button>
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
        { label: this.$t('bb662cf9.5cb424'), value: 0 },
        { label: this.$t('bb662cf9.871a30'), value: 1 },
        { label: this.$t('bb662cf9.146bb2'), value: 2 }
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
          { name: this.$t('bb662cf9.b6d0e9'), key: 'check_state' },
          { name: this.$t('bb662cf9.9190cc'), key: 'supplier_name' },
          { name: this.$t('bb662cf9.b29725'), key: 'contact' },
          { name: this.$t('bb662cf9.8098e2'), key: 'mobile' },
          { name: this.$t('bb662cf9.bb2cdf'), key: 'login_name' }
        ],
        actions: [
          {
            name: this.$t('bb662cf9.8347a9'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.check_state == this.$t('bb662cf9.871a30')
            },
            action: {
              type: 'link',
              handler: ([row]) => {
                this.editRow(row)
              }
            }
          },
          {
            name: this.$t('bb662cf9.cf13b1'),
            key: 'review',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.check_state != this.$t('bb662cf9.871a30')
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
        this.$message.error(this.$t('bb662cf9.5ff8e8'))
        return false
      }
      this.loading = true
      try {
        const { status } = await this.$api.supplier.checkSupplier(this.editForm)
        this.$message.success(this.$t('bb662cf9.3b1083'))
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
