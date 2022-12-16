<template>
  <div>
    <SpRouterView class="merchantList">
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addMerchant">
          新增商户
        </el-button>
      </div>

      <SpFilterForm :model="formParams" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="merchant_name" label="商户名称:">
          <el-input v-model="formParams.merchant_name" placeholder="请输入商户名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="legal_name" label="联系人:">
          <el-input v-model="formParams.legal_name" placeholder="请输入联系人" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="legal_mobile" label="联系电话:">
          <el-input v-model="formParams.legal_mobile" placeholder="请输入联系电话" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="time_start" label="入驻时间:" size="max">
          <el-date-picker
            v-model="formParams.time_start"
            clearable
            type="datetimerange"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            prefix-icon="null"
            :default-time="defaultTime"
            :picker-options="pickerOptions"
          />
        </SpFilterFormItem>
      </SpFilterForm>

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
  </div>
</template>

<script>
import { setCommodityAudit, setMerchantsState } from '@/api/mall/marketing'
import { PICKER_DATE_OPTIONS } from '@/consts'
import { createSetting } from '@shopex/finder'
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
          { name: '商户名称', key: 'merchant_name' },
          { name: '联系人', key: 'legal_name' },
          { name: '联系电话', key: 'legal_mobile' },
          {
            name: '入驻时间',
            key: 'created',
            formatter: (h, { created }) => {
              return moment(created * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: '商品审核（商户商家商品是否需通过平台审核）',
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
                  h('span', { class: 'aaa' }, row.audit_goods ? ' 是 ' : ' 否 '),
                  h('i', { class: 'el-icon-s-tools' }, '')
                ]
              ),

            renderHeader() {
              return (
                <div>
                  <span>商品审核 </span>
                  <el-tooltip
                    class='item'
                    effect='light'
                    content='商户上架商品是否需通过平台审核'
                    placement='top-start'
                  >
                    {/* <span slot='content'>
                      商户商家商品是否<br/>需通过平台审核
                      </span> */}
                    <i class='el-icon-question'></i>
                  </el-tooltip>
                </div>
              )
            }
          }
        ],
        actions: [
          {
            name: '详情',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.$router.push({
                  path: this.matchHidePage('editor'),
                  query: { type: 'detail', merchantId: val[0].id }
                })
              }
            }
          },
          {
            name: '编辑',
            key: 'editor',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async (val) => {
                this.$router.push({
                  path: this.matchHidePage('editor'),
                  query: { type: 'edit', merchantId: val[0].id }
                })
              }
            },
            visible: () => {
              return this.datapass_block == 0
            }
          },
          {
            name: '禁用',
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
            name: '开启',
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
      this.$refs.finder.refresh()
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
      const message = row.audit_goods
        ? '关闭后商户商品上架时无需审核，请确认是否关闭'
        : '开启后商户商品上架时需要审核，请确认是否开启'
      this.$confirm(message, '通知消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setCommodityAudit({ audit_goods: !row.audit_goods }, row.id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$refs.finder.refresh()
        }
      })
      console.log(row)
    },
    fnMerchantsState(row, status) {
      const id = row[0].id
      const message = status
        ? '开启后且该商户及其关联店铺的账号可登录商家端以及店铺端，该商户及其关联店铺在小程序显示，请确认是否开启。'
        : '禁用后该商户及其关联店铺不在小程序显示，且该商户及其关联店铺的账号无法登录商家端以及店铺端，请确认是否禁用该商户。'
      this.$confirm(message, '通知消息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const result = await setMerchantsState({ disabled: !status }, id)
        if (result.data.data.status) {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$refs.finder.refresh()
        }
      })
    },
    addMerchant() {
      this.$router.push({ path: this.matchHidePage('editor'), query: { type: 'add' } })
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
