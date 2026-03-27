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
  <SpRouterView>
    <SpPage>
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" :label="$t('c96a5149.1e5021')">
          <el-input v-model="formQuery.name" :placeholder="$t('c96a5149.9d2c66')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" :label="$t('c96a5149.ce2bf3')">
          <el-input v-model="formQuery.mobile" :placeholder="$t('c96a5149.999e78')" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="el-plus-circle" @click="chiefupload">
          {{ $t('c96a5149.5ad881') }}
        </el-button>
        <el-button type="primary" icon="el-plus-circle" @click="handleApprove">
          {{ $t('c96a5149.794efd') }}
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
        :title="$t('c96a5149.0273ba')"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </SpPage>
  </SpRouterView>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { i18n } from '@/i18n'
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
            name: i18n.t('c96a5149.607e7a'),
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
          { name: i18n.t('c96a5149.15d03b'), key: 'chief_name' },
          { name: i18n.t('c96a5149.8098e2'), key: 'chief_mobile' },
          {
            name: i18n.t('c96a5149.26ca20'),
            key: 'chief_mobile',
            render: (h, { row }) => h('span', {}, this.getSource(row.source))
          },
          {
            name: i18n.t('c96a5149.5ba072'),
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
          label: i18n.t('c96a5149.0273ba'),
          key: 'approve_status',
          type: 'radio',
          options: [
            { label: 1, name: i18n.t('c96a5149.e61f2c') },
            { label: 2, name: i18n.t('c96a5149.1bf19c') }
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
          label: i18n.t('c96a5149.f48f94'),
          key: 'refuse_reason',
          type: 'input',
          placeholder: i18n.t('c96a5149.fc955a'),
          isShow: false,
          validator: (rule, value, callback) => {
            if (this.resloveForm.approve_status == 2 && !value) {
              callback(new Error(i18n.t('c96a5149.281bad')))
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
        return this.$t('c96a5149.b4c3b2')
      } else if (status == '1') {
        return this.$t('c96a5149.562b1a')
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
        title: this.$t('c96a5149.5ad881'),
        content: () => import('@/views/core/upload/upload-chief'),
        buttonCancel: {
          text: this.$t('c96a5149.b15d91')
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
