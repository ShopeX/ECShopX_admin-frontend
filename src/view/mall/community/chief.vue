<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
</style>
<template>
  <SpRouterView>
  <SpPage>
    <div
    >
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" label="团长姓名:">
          <el-input v-model="formQuery.name" placeholder="请输入团长姓名" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="formQuery.mobile" placeholder="请输入团长手机号" />
        </SpFilterFormItem>
      </SpFilterForm>
      <div class="action-container">
        <el-button type="primary" plain icon="el-plus-circle" @click="chiefupload">
          团长导入
        </el-button>
        <el-button type="primary" plain icon="el-plus-circle" @click="handleApprove">
          团长审批
        </el-button>
      </div>
      <!-- <el-tabs v-model="formQuery.approve_status" type="card" @tab-click="onSearch">
        <el-tab-pane v-for="item in stateList" :key="item.value" :label="item.title" :name="item.value" /> -->

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
      <!-- </el-tabs> -->

      <SpDialog
        ref="resloveDialogRef"
        v-model="resloveDialog"
        :title="`审批`"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
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
          onChange: (e) => {
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
    chiefupload() {
      if (this.login_type == 'distributor') {
        this.$router.push({ path: `/shopadmin/member/member/chiefupload` })
      } else {
        this.$router.push({ path: `/applications/community/chiefupload` })
      }
    }
  },

  computed: {
    ...mapGetters(['wheight', 'isMicorMall', 'login_type'])
  }
}
</script>
