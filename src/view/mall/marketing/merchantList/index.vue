<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <SpRouterView class="merchantList">
      <SpFilterForm :model="formParams" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="merchant_name" :label="$t('5f6110bf.a1b85f')">
          <el-input v-model="formParams.merchant_name" :placeholder="$t('5f6110bf.18213b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="legal_name" :label="$t('5f6110bf.eaa028')">
          <el-input v-model="formParams.legal_name" :placeholder="$t('5f6110bf.9e3f21')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="legal_mobile" :label="$t('5f6110bf.733e3f')">
          <el-input v-model="formParams.legal_mobile" :placeholder="$t('5f6110bf.7b540b')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="time_start" :label="$t('5f6110bf.02a31d')" size="max">
          <el-date-picker
            v-model="formParams.time_start"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            :range-separator="$t('5f6110bf.981cbe')"
            :start-placeholder="$t('5f6110bf.b44c0f')"
            :end-placeholder="$t('5f6110bf.1d468b')"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="ecx-icon icon-xinzeng" @click="addMerchant">
          {{ $t('5f6110bf.8a69a5') }}
        </el-button>
      </div>

      <SpFinder
        ref="finder"
        no-selection
        :setting="setting"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        url="/merchant/list"
      />
    </SpRouterView>
  </SpPage>
</template>

<script>
import { setCommodityAudit, setMerchantsState } from '@/api/mall/marketing'
import { PICKER_DATE_OPTIONS } from '@/consts'
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
export default {
  data() {
    return {
      defaultTime: ['00:00:00', '23:59:59'],
      pickerOptions: PICKER_DATE_OPTIONS,
      formParams: {
        merchant_name: '',
        legal_name: '',
        legal_mobile: '',
        time_start: []
      },
      datapass_block: 0,
      setting: createSetting({
        columns: [
          { name: this.$t('5f6110bf.e6f169'), key: 'merchant_name' },
          { name: this.$t('5f6110bf.52409d'), key: 'legal_name' },
          { name: this.$t('5f6110bf.09a1f6'), key: 'legal_mobile' },
          {
            name: this.$t('5f6110bf.773775'),
            key: 'created',
            formatter: (h, { created }) => {
              return moment(created * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: this.$t('5f6110bf.fc90f2'),
            key: 'audit_goods',
            width: '100px',
            render: (h, { row }) =>
              h(
                'el-button',
                {
                  class: 'yahh',
                  props: { type: 'text' },
                  on: {
                    click: () => {
                      this.fnAffirm(row)
                    }
                  }
                },
                [
                  h(
                    'span',
                    { class: 'aaa' },
                    row.audit_goods ? this.$t('5f6110bf.0a60ac') : this.$t('5f6110bf.c9744f')
                  ),
                  h('i', { class: 'el-icon-s-tools' }, '')
                ]
              ),

            renderHeader: () => {
              return (
                <div>
                  <span>{this.$t('5f6110bf.fc90f2').split('（')[0]} </span>
                  <el-tooltip
                    class='item'
                    effect='light'
                    content={this.$t('5f6110bf.3792c2')}
                    placement='top-start'
                  >
                    <i class='el-icon-question'></i>
                  </el-tooltip>
                </div>
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('5f6110bf.f26225'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.$router.push({
                  path: this.matchRoutePath('editor'),
                  query: { type: 'detail', merchantId: val[0].id }
                })
              }
            }
          },
          {
            name: this.$t('5f6110bf.95b351'),
            key: 'editor',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.$router.push({
                  path: this.matchRoutePath('editor'),
                  query: { type: 'edit', merchantId: val[0].id }
                })
              }
            },
            visible: () => {
              return this.datapass_block == 0
            }
          },
          {
            name: this.$t('5f6110bf.710ad0'),
            key: 'off',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.fnMerchantsState(val, false)
              }
            },
            visible: (val) => {
              return !val.disabled
            }
          },
          {
            name: this.$t('5f6110bf.cc42dd'),
            key: 'off',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.fnMerchantsState(val, true)
              }
            },
            visible: (val) => {
              return val.disabled
            }
          }
        ]
      })
    }
  },
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      return {
        ...params,
        ...this.formParams
      }
    },
    afterSearch({ data }) {
      const { datapass_block } = data.data
      this.datapass_block = datapass_block
    },
    fnAffirm(row) {
      const message = row.audit_goods ? this.$t('5f6110bf.a38759') : this.$t('5f6110bf.fd1322')
      this.$confirm(message, this.$t('5f6110bf.59a702'), {
        confirmButtonText: this.$t('5f6110bf.38cf16'),
        cancelButtonText: this.$t('5f6110bf.625fb2'),
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setCommodityAudit({ audit_goods: !row.audit_goods }, row.id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('5f6110bf.a3869d')
          })
          this.$refs.finder.refresh(true)
        }
      })
    },
    fnMerchantsState(row, status) {
      const id = row[0].id
      const message = status ? this.$t('5f6110bf.415601') : this.$t('5f6110bf.8dcbc7')
      this.$confirm(message, this.$t('5f6110bf.59a702'), {
        confirmButtonText: this.$t('5f6110bf.38cf16'),
        cancelButtonText: this.$t('5f6110bf.625fb2'),
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setMerchantsState({ disabled: !status }, id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: this.$t('5f6110bf.a3869d')
          })
          this.$refs.finder.refresh(true)
        }
      })
    },
    addMerchant() {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { type: 'add' } })
    }
  }
}
</script>

<style lang="scss">
.merchantList {
  .yahh {
    color: #409eff;
  }
}
</style>
