import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'
import moment from 'moment'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas || [] },
      {
        key: 'start_time',
        name: '展示开始时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        // format: "yyyy-MM-dd HH:mm:ss",
      },
      {
        key: 'end_time',
        name: '展示结束时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
        // format: "yyyy-MM-dd HH:mm:ss",
      },
      { key: 'name', name: '榜单名称' }
    ],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: ([row]) => {
            vm.editConfigHandle(row)
          }
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '区域',
        key: 'regionauth_id',
        render(h, { row }) {
          const item = vm?.areas?.find((el) => el.value == row.regionauth_id)
          return <span>{item?.label}</span>
        }
      },
      {
        name: '榜单名称',
        key: 'name'
      },
      {
        name: '榜单描述',
        key: 'intro'
      },
      {
        name: '展示开始时间',
        key: 'start_time',
        render(h, { row }) {
          return <span> {moment(row.start_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      },
      {
        name: '展示结束时间',
        key: 'end_time',
        render(h, { row }) {
          return <span> {moment(row.end_time * 1000).format('yyyy-MM-DD HH:mm:ss')} </span>
        }
      }
    ]
  })

export const createFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '所属区域',
        placeholder: '请选择',
        defaultValue: '',
        required: true,
        key: 'regionauth_id',
        type: 'select',
        options: vm.areas || []
      },
      {
        label: '榜单名称',
        type: 'input',
        key: 'name',
        defaultValue: '',
        placeholder: '请输入',
        required: true,
        message: '榜单不能为空'
      },
      {
        label: '榜单描述',
        type: 'input',
        key: 'intro',
        defaultValue: '',
        placeholder: '请输入',
        message: '榜单描述不能为空'
      },
      {
        label: '展示时间',
        dataIndex: 'show_time',
        defaultValue: '',
        component({ disabled }) {
          return (
            <div class='preheat-time'>
              <el-date-picker
                v-model={vm.activityRule.show_time}
                disabled={disabled}
                type='datetimerange'
                placeholder='选择日期范围'
                startPlaceholder='开始时间'
                angePlaceholder=''
                format='yyyy-MM-dd HH:mm:ss'
                endPlaceholder='结束结束'
              />
            </div>
          )
        },
        disabled: false,
        validator(rule, value, callback) {
          if (vm.activityRule.show_time.length == 0) {
            callback(new Error('请选择展示时间'))
          } else {
            callback()
          }
        }
      },
      {
        label: '跳转链接',
        key: 'link_path',
        component({ disabled }, value) {
          return <CompPickerLink
            value={value['link_path']}
            multiple={false}
            disabled={!vm?.activityRule?.regionauth_id}
            params={{ regionauth_id: vm?.activityRule?.regionauth_id }}
            onChange={(e) => vm.onChangeLink(e)}
          />
        }
      },
      {
        label: '排序规则',
        key: 'rank_by',
        type: 'radio',
        options: [
          {
            label: 'sales',
            name: '按销量从高到低排序'
          }
        ],
        required: true,
        defaultValue: 'sales'
      },
      {
        label: '展示排名',
        key: 'num',
        defaultValue: 10,
        component({ disabled }, value) {
          return (
            <div class='preheat-time'>
              前
              <el-input v-model={value['num']} type='number' style='width:100px;' />
            </div>
          )
        }
      },
      {
        label: '商品范围',
        key: 'apply_scope',
        type: 'radio',
        options: [
          {
            label: 'main_category',
            name: '指定商品管理分类'
          }
        ],
        required: true,
        defaultValue: 'main_category'
      },
      {
        key: 'scope_id',
        label: '',
        defaultValue: [],
        component({ key }, value) {
          return (
            <el-cascader
              v-model={value['scope_id']}
              options={vm.district1}
              clearable
              show-all-levels={false}
              attrs={{
                props: { value: 'category_id', label: 'category_name', checkStrictly: true }
              }}
            />
          )
        },
        validator(rule, value, callback) {
          if (vm.activityRule.apply_scope == 'main_category') {
            if (value.length == 0) {
              callback(new Error('请选择商品管理分类'))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    ],
    vm
  )
