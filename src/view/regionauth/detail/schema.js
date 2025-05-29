import { bindThisForFormSchema } from '@/utils/schemaHelper'

const formBaseList = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: vm?.edit ? '编辑区域' : '新增区域',
        type: 'group'
      },
      {
        label: '区域名称',
        key: 'regionauth_name',
        placeholder: '请输入',
        defaultValue: '',
        type: 'input',

        required: true,
        disabled: false,
        message: '区域名称不能为空'
      },
      {
        label: '区域编码',
        key: 'regionauth_code',
        placeholder: '请输入',
        defaultValue: '',
        type: 'input',

        required: false,
        disabled: false,
        validator: async function (rule, value, callback) {
          if (!value) {
            callback('区域编码不能为空')
          } else {
            callback()
          }
        }
      },
      {
        label: '区域地址',
        key: 'regions',
        placeholder: '请选择',
        defaultValue: [],
        required: true,
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-cascader
                v-model={vm.formBase.regions}
                options={vm.district}
                onChange={(val) => vm.handleRegionSearch(val)}
              />
            </div>
          )
        },
        validator: async function (rule, value, callback) {
          console.log(value)
          if (!value || !value?.length) {
            callback('区域地址不能为空')
          } else {
            callback()
          }
        }
      },
      {
        label: '',
        key: 'regionauth_address',
        defaultValue: '',
        required: true,
        component() {
          return (
            <div class='refund-address'>
              <el-input
                type='textarea'
                rows={2}
                placeholder='请输入详细地址（不包含省市区）'
                v-model={vm.formBase.regionauth_address}
              />
            </div>
          )
        }
      },
      {
        label: '客服电话',
        key: 'regionauth_tel',
        placeholder: '请输入',
        defaultValue: '',
        required: true,
        disabled: false,
        component({ key }, value) {
          return <el-input v-model={value['regionauth_tel']} show-word-limit />
        }
      },
      {
        label: 'store_100_api_key',
        key: "store_100_api_key",
        type: "input",
        defaultValue: ""
      },
      {
        label: 'store_100_api_secret',
        key: "store_100_api_secret",
        type: "input",
        defaultValue: ""
      },
      {
        label: '状态',
        key: 'state',
        defaultValue: true,
        component() {
          return (
            <div>
              <span>{vm.formBase?.state == 'true' || vm.formBase?.state ? '启用' : '未启用'}</span>
              <el-switch active-color='#13ce66' v-model={vm.formBase.state} active-value='true' inactive-value='false' />
            </div>
          )
        }
      },
    ],
    vm
  )

export default {
  formBaseList
}
