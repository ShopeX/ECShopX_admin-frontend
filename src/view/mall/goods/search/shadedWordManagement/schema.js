import { bindThisForFormSchema } from '@/utils/schemaHelper'
import { createSetting } from '@shopex/finder'
import moment from 'moment'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas || [] },
      { key: 'text', name: '底纹词' },
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
      }
    ],
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
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
          handler: ([row]) => {
            vm.deleteHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '底纹词',
        key: 'text'
      },
      {
        name: '区域',
        key: 'area',
        render(h, { row }) {
          const item = vm?.areas?.find((el) => el.value == row.regionauth_id)
          return <span>{item?.label}</span>
        }
      },
      {
        name: '适用人群',
        key: 'rel_tags',
        render(h, { row }) {
          return (
            <div>
              {' '}
              {row.rel_tags?.map((el) => {
                return <el-tag effect='light'>{el.tag_name}</el-tag>
              })}
            </div>
          )
        }
      },
      {
        name: '排序优先级',
        key: 'sort'
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
      },
      {
        name: '状态',
        key: 'status',
        render(h, { row }) {
          const str = ['未开始', '展示中', '已过期']
          const clasStr = ['warning', 'danger', 'info']
          return <el-tag type={clasStr[row.status]}>{str[row.status]} </el-tag>
        }
      }
    ]
  })

export const createFormSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        label: '所属区域',
        key: 'regionauth_id',
        placeholder: '请选择',
        defaultValue: '',
        required: true,
        type: 'select',
        options: vm.areas
      },
      {
        label: '底纹词',
        type: 'input',
        key: 'text',
        defaultValue: '',
        required: true,
        placeholder: '请输入',
        message: '底纹词不能为空'
      },
      {
        label: '展示时间',
        key: 'show_time',
        defaultValue: [],
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
                format='yyyy-MM-DD HH:mm:ss'
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
        label: '适用人群',
        key: 'user',
        multiple: true,
        defaultValue: [],
        component({ disabled }, value) {
          return (
            <div class='preheat-time'>
              <el-select v-model={value['user']} placeholder='请选择' multiple clearable>
                {vm.options?.map((el) => {
                  return <el-option key={el.value} label={el.label} value={el.value} />
                })}
              </el-select>
            </div>
          )
        }
      },
      {
        label: '排序优先级',
        key: 'sort',
        defaultValue: 0,
        component({ disabled }, value) {
          return (
            <div class='preheat-time'>
              <el-input v-model={value['sort']} type='number' />
              <div>排序数字越大，展示越靠前</div>
            </div>
          )
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
        },
      }
    ],
    vm
  )
