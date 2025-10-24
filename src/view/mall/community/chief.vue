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
<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
</style>
<template>
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" label="团长姓名:">
          <el-input v-model="formQuery.name" placeholder="请输入团长姓名" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="formQuery.mobile" placeholder="请输入团长手机号" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="el-plus-circle" @click="chiefupload"> 团长导入 </el-button>
        <el-button type="primary" icon="el-plus-circle" @click="handleApprove">
          团长审批
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
        url="/community/chief/list"
      />

      <SpDialog
        ref="resloveDialogRef"
        v-model="resloveDialog"
        :title="`审批`"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </SpPage>
  </SpRouterView>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  name: '',
  data() {
    return {
      formQuery: {
        name: '',
        mobile: ''
      },
      setting: createSetting({
        actions: [
          {
            name: '查看',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                const { path } = this.$route
                this.$router.push({
                  path: `${path}/info/${row.chief_id}/${row.distributor_id}`
                })
              }
            }
          }
        ],
        columns: [
          { name: '团长', key: 'chief_name' },
          { name: '手机号', key: 'chief_mobile' },
          {
            name: '来源',
            key: 'chief_mobile',
            render: (h, { row }) => h('span', {}, this.getSource(row.source))
          },
          {
            name: '申请时间',
            key: 'created_at',
            render: (h, { row }) =>
              h('span', {}, moment(row.created_at * 1000).format('YYYY-MM-DD HH:mm:ss'))
          }
        ]
      }),
      resloveDialog: false,
      resloveForm: {
        apply_id: '',
        approve_status: 1,
        refuse_reason: ''
      },
      resloveFormList: [
        {
          label: '审批',
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: '同意' },
            { label: 2, name: '不同意' }
          ],
          onChange: e => {
            if (e == 2) {
              this.resloveFormList[1].isShow = true
            } else {
              this.resloveFormList[1].isShow = false
            }
          }
        },
        {
          label: '拒绝原因',
          key: 'refuse_reason',
          type: 'input',
          placeholder: '请输入拒绝原因',
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error('不能为空'))
            } else {
              callback()
            }
          }
        }
      ]
    }
  },
  created() {},
  methods: {
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(params) {
      const formQuery = JSON.parse(JSON.stringify(this.formQuery))
      if (formQuery.approve_status == '-1') {
        delete formQuery.approve_status
      }
      return { ...params, ...formQuery }
    },
    afterSearch() {},
    async onResloveSubmit() {
      const { apply_id, approve_status, refuse_reason } = this.resloveForm
      await this.$api.community.approveChief(apply_id, {
        approve_status,
        refuse_reason
      })
      this.resloveDialog = false
      this.$refs.finder.refresh(true)
    },
    getSource(status) {
      if (status == '0') {
        return '手动导入'
      } else if (status == '1') {
        return '主动申请'
      }
    },
    handleApprove() {
      const { path } = this.$route
      this.$router.push({
        path: `${path}/approve`
      })
    },
    async chiefupload() {
      await this.$dialog.open({
        title: '团长导入',
        content: () => import('@/views/core/upload/upload-chief'),
        buttonCancel: {
          text: '关闭'
        },
        buttonConfirm: {
          visible: false
        }
      })
    }
  },

  computed: {
    ...mapGetters(['login_type'])
  }
}
</script>
