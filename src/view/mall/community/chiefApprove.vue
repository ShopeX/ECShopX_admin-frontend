<style lang="scss" scoped>
.sp-filter-form {
  margin-bottom: 16px;
  padding-bottom: 0;
}
</style>
<template>
  <div>
    <div v-if="$route.path.indexOf('detail') === -1">
      <SpFilterForm :model="formQuery" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="name" label="团长姓名:">
          <el-input v-model="formQuery.name" placeholder="请输入团长姓名" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="mobile" label="手机号:">
          <el-input v-model="formQuery.mobile" placeholder="请输入团长手机号" />
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
        :title="`审批`"
        :form="resloveForm"
        :form-list="resloveFormList"
        @onSubmit="onResloveSubmit"
      />
    </div>
  </div>
</template>

<script>
import { createSetting } from '@shopex/finder'
import moment from 'moment'
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
        { title: '全部', value: '-1' },
        { title: '待审批', value: '0' }
      ],
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
                console.log()
                this.$router.push({
                  path: `${path.split('/approve')[0]}/detail/${row.apply_id}`
                })
              }
            }
          },
          {
            name: '审批',
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
          { name: '团长', key: 'chief_name' },
          { name: '手机号', key: 'chief_mobile' },
          {
            name: '审批状态',
            key: 'approve_status',
            render: (h, { row }) => h('span', {}, this.getApproveStatus(row.approve_status))
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
          label: '审批:',
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
          label: '拒绝原因:',
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
    getApproveStatus(status) {
      if (status == '0') {
        return '未审核'
      } else if (status == '1') {
        return '已审核'
      } else if (status == '2') {
        return '已拒绝'
      }
    }
  }
}
</script>
