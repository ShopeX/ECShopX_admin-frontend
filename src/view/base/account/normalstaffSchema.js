import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'login_name', name: '登录账号', placeholder: '请输入账号名' },
      { key: 'mobile', name: '手机号', placeholder: '请输入手机号' },
      { key: 'username', name: '姓名', placeholder: '请输入姓名' },
      {
        key: 'regionauth_id',
        name: '区域',
        type: 'select',
        options: vm?.areas,
        placeholder: '请选择'
      },
      {
        key: 'role_id',
        name: '角色',
        type: 'select',
        options: vm?.rolesListData,
        placeholder: '请选择'
      },
      { key: 'shop', name: '店铺', placeholder: '请选择店铺', slot: 'shop' }
    ],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.editAction(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '登录账号',
        key: 'login_name'
      },
      {
        name: '手机号',
        key: 'mobile'
      },
      {
        name: '姓名',
        key: 'username'
      },
      {
        name: '角色',
        key: 'roles',
        render(h, { row }) {
          return row?.role_data?.map((item) => {
            return (
              <el-tag key={item.role_id} size='mini' type='warning'>
                {item.role_name}
              </el-tag>
            )
          })
        }
      },
      {
        name: '关联区域',
        key: 'regionauth_ids',
        render(h, { row }) {
          return row?.regionauth_ids?.map((item) => {
            return <span key={item.role_id}>{item.regionauth_name}</span>
          })
        }
      },
      {
        name: '关联店铺',
        key: 'distributor_ids',
        render(h, { row }) {
          return row?.distributor_ids?.map((item) => {
            return <span key={item.role_id}>{item.name}</span>
          })
        }
      },
      {
        name: '禁用',
        key: 'is_disable',
        render(h, { row }) {
          return (
            <el-switch
              value={row.is_disable === true || row.is_disable ? '1' : '0'}
              active-value={'1'}
              inactive-value={'0'}
              active-color={'#ff4949'}
              inactive-color={'#ccc'}
              onChange={(val) => {
                vm.acitonDisabled(val, row)
              }}
            />
          )
        }
      }
    ]
  })

export const createFormSchema = (vm) => bindThisForFormSchema([
  {
    label: '登录账号',
    key: 'login_name',
    placeholder: '请输入员工登录账号',
    defaultValue: '',
    required: false,
    component(_, value) {
      return (
        <div>
          <el-input
            v-model={value['login_name']}
            minlength='4'
            maxlength='16'
            placeholder='请输入员工登录账号'
            disabled={!!vm.isEdit}
          />
          <p class='frm-tips'>账号名称4-16位，名称使用字母开头，字符有有字母，数字，下划线</p>
        </div>
      )
    }
  },
  {
    label: '手机号',
    key: 'mobile',
    placeholder: '请输入11位手机号',
    defaultValue: '',
    required: false,
    component(_, value) {
      return (
        <el-input
          v-model={value['mobile']}
          maxlength={11}
          disabled={!!vm.isEdit}
          placeholder='请输入11位手机号'
        />
      )
    }
  },
  {
    label: '姓名',
    key: 'username',
    placeholder: '请填写姓名',
    defaultValue: '',
    required: false,
    type: 'input'
  },
  {
    label: '登录密码',
    key: 'password',
    defaultValue: '',
    type: 'input',
    maxlength: 255,
    required: false
  },
  {
    label: '区域',
    key: 'regionauth_ids',
    placeholder: '请选择',
    defaultValue: '',
    required: false,
    component({ key }, value) {
      return (
        <div class='refund-address'>
          <el-select v-model={value['regionauth_ids']} placeholder='请选择' multiple on-change={(val) => {
            vm.handleRegionauthChange(val)
          }}>
            {(vm.areas || [])?.map((el, index) => {
              return <el-option key={index} label={el.label} value={el.value} />
            })}
          </el-select>
        </div>
      )
    }
  },
  {
    label: '所属店铺',
    key: 'distributor_ids',
    defaultValue: [],
    component() {
      return (
        <div>
          {vm.relDistributors?.map((item, index) => {
            return (
              <el-tag
                key={index}
                className='new-tag'
                closable
                disable-transitions={false}
                onClose={() => {
                  vm.handleClose(item, index)
                }}
              >
                {item.name}
              </el-tag>
            )
          })}
          <el-button
            size='medium'
            className='button-new-tag'
            onClick={() => vm.addDistributoreAction()}
          >
            + 点击搜索店铺
          </el-button>
        </div>
      )
    }
  },
  {
    label: '角色',
    key: 'role_id',
    placeholder: '',
    defaultValue: [],
    required: true,
    component(_, value) {
      return (
        <div>
          <el-checkbox-group v-model={value['role_id']}>
            {vm.rolesListData?.map((role) => {
              return (
                <el-checkbox key={role.value} label={role.value} value={role.value}>
                  {role.label}
                </el-checkbox>
              )
            })}
          </el-checkbox-group>
        </div>
      )
    }
  }
], vm)
