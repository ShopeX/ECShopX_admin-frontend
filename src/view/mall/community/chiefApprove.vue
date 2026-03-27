<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
</style>
<template>
  <SpPage>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" :label="$t('38b8511c.1e5021')">
          <el-input v-model="formQuery.name" :placeholder="$t('38b8511c.9d2c66')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('38b8511c.ce2bf3')">
          <el-input v-model="formQuery.mobile" :placeholder="$t('38b8511c.999e78')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <el-tabs v-model="formQuery.approve_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="item in stateList"
          :key="item.value"
          :label="item.title"
          :name="item.value"
        />

        <SpFinder
          ref="finder"
          no-selection
          :setting="setting"
          :hooks="{
            beforeSearch: beforeSearch,
            afterSearch: afterSearch
          }"
          url="/community/chief/apply/list"
        />
      </el-tabs>

      <SpDialog
        ref="resloveDialogRef"
        v-model="resloveDialog"
        :title="$t('38b8511c.0273ba')"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { i18n } from '@/i18n'

export default {
  name: '',
  data() {
    return {
      formQuery: {
        name: '',
        mobile: '',
        approve_status: '-1'
      },
      stateList: [
        { title: i18n.t('38b8511c.a8b0c2'), value: '-1' },
        { title: i18n.t('38b8511c.b0bf01'), value: '0' }
      ],
      setting: createSetting({
        actions: [
          {
            name: i18n.t('38b8511c.607e7a'),
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                const { path } = this.$route
                console.log()
                this.$router.push({
                  path: `${path.split('/approve')[0]}/detail/${row.apply_id}`
                })
              }
            }
          },
          {
            name: i18n.t('38b8511c.0273ba'),
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.approve_status == '0'
            },
            action: {
              handler: async ([row]) => {
                this.resloveForm.apply_id = row.apply_id
                this.resloveDialog = true
              }
            }
          }
        ],
        columns: [
          { name: i18n.t('38b8511c.15d03b'), key: 'chief_name' },
          { name: i18n.t('38b8511c.8098e2'), key: 'chief_mobile' },
          {
            name: i18n.t('38b8511c.d352ae'),
            key: 'approve_status',
            render: (h, { row }) => h('span', {}, this.getApproveStatus(row.approve_status))
          },
          {
            name: i18n.t('38b8511c.5ba072'),
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
          label: i18n.t('38b8511c.717b4d'),
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: i18n.t('38b8511c.e61f2c') },
            { label: 2, name: i18n.t('38b8511c.1bf19c') }
          ],
          onChange: (e) => {
            if (e == 2) {
              this.resloveFormList[1].isShow = true
            } else {
              this.resloveFormList[1].isShow = false
            }
          }
        },
        {
          label: i18n.t('38b8511c.de77c5'),
          key: 'refuse_reason',
          type: 'input',
          placeholder: i18n.t('38b8511c.fc955a'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error(i18n.t('38b8511c.281bad')))
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
    getApproveStatus(status) {
      if (status == '0') {
        return this.$t('38b8511c.97a81d')
      } else if (status == '1') {
        return this.$t('38b8511c.9d5b9b')
      } else if (status == '2') {
        return this.$t('38b8511c.81233d')
      }
    }
  }
}
</script>
