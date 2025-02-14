<template>
  <div>
    <div class="action-container">
      <el-button type="primary" @click="addDeliveryman">添加收款账户</el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/espier/offline/backaccount/lists"
      no-selection
      :setting="setting"
      :hooks="{
        beforeSearch: beforeSearch
      }"
    />

    <SpDialog
      ref="addDialogRef"
      v-model="deliveryman"
      :confirm-status="addLoading"
      :title="editTitle"
      :form="addForm"
      :form-list="addFormList"
      @onSubmit="onAddSubmit"
    />
  </div>
</template>
<script>
export default {
  name: '',
  mixins: [],
  props: {},
  data() {
    return {
      deliveryman: false,
      addLoading: false,
      editTitle: '添加收款账户',
      params: {},
      options: [
        {
          value: 'order',
          label: '按单笔订单'
        },
        {
          value: 'amount',
          label: '按订单金额比例'
        }
      ],
      setting: {
        columns: [
          { name: '收款人户名', key: 'bank_account_name' },
          { name: '银行账号', key: 'bank_account_no' },
          { name: '开户银行', key: 'bank_name' },
          { name: '银联号', key: 'china_ums_no' },
          {
            name: '是否默认',
            width: 100,
            key: 'staff_attribute',
            render: (h, { row }) => {
              return <span>{row.is_default === 'true' ? '是' : '否'}</span>
            }
          }
        ],
        actions: [
          {
            name: '编辑',
            key: 'detail',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: ([row]) => {
                this.editTitle = '编辑收款账户'
                this.deliveryman = true

                this.addForm = {
                  ...row
                }
              }
            }
          },
          {
            name: '删除',
            key: 'apply',
            type: 'button',
            buttonType: 'text',
            action: {
              handler: async ([row]) => {
                await this.$confirm(`确认删除？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                await this.$api.offline.deleteOfflineAccount(row.id)
                this.$refs['finder'].refresh()
              }
            }
          }
        ]
      },

      addForm: {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        china_ums_no: '',
        is_default: null
      },
      addFormList: [
        {
          label: '收款人户名',
          key: 'bank_account_name',
          placeholder: '请输入收款人户名',
          type: 'input',
          required: true,
          message: '收款人户名不能为空'
        },
        {
          label: '银行账号',
          key: 'bank_account_no',
          placeholder: '请输入银行账号',
          type: 'input',
          required: true,
          message: '银行账号不能为空'
        },
        {
          label: '开户银行',
          key: 'bank_name',
          placeholder: '请输入开户银行',
          type: 'input',
          required: true,
          message: '开户银行不能为空'
        },
        {
          label: '银联号',
          key: 'china_ums_no',
          placeholder: '请输入银联号',
          type: 'input',
          required: true,
          message: '银联号不能为空'
        },
        {
          label: '是否默认',
          key: 'is_default',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'true',
              name: '是'
            },
            {
              label: 'false',
              name: '否'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    onSearch() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      const _params = {
        ...params,
        ...this.params
      }
      return _params
    },
    addDeliveryman() {
      this.deliveryman = true
      this.editTitle = '添加收款账户'
      this.addForm = {
        bank_account_name: '',
        bank_account_no: '',
        bank_name: '',
        china_ums_no: '',
        is_default: null
      }
    },
    async onAddSubmit() {
      this.addLoading = true
      let params = {
        ...this.addForm
      }

      if (params.id) {
        await this.$api.offline.updateOfflineAccount(params)
        this.$message.success('编辑成功')
        this.deliveryman = false
        this.onSearch()
      } else {
        await this.$api.offline.createOfflineAccount(this.addForm)
        this.$message.success('保存成功')
        this.deliveryman = false
        this.onSearch()
      }
      this.addLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.flex-box {
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
}
</style>
