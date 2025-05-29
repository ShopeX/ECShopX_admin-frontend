import { createSetting } from '@shopex/finder'
import { bindThisForFormSchema } from '@/utils/schemaHelper'
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
      { key: 'type', name: '类型', type: 'select', options: vm?.word || [] }
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
        name: '区域',
        key: 'regionauth_id',
        render(h, { row }) {
          const item = vm?.areas?.find((el) => el.value == row.regionauth_id)
          return <span>{item?.label}</span>
        }
      },
      {
        name: '类型',
        key: 'type',
        render(_, { row }) {
          const _item = vm?.word?.find((el) => el.value == row.type)
          return <span>{_item?.label}</span>
        }
      },
      {
        name: '关键词',
        key: 'keywords',
        render(_, { row }) {
          return <span>{row.keywords}</span>
        }
      },
      {
        name: '图片',
        key: 'ad_pic',
        with: '200',
        render(_, { row }) {
          return (
            <el-image
              src={row.ad_pic}
              style={{
                width: '100px',
                height: '100px'
              }}
            />
          )
        }
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
        options: vm?.areas || []
      },
      {
        label: '类型',
        key: 'type',
        type: 'radio',
        options: [
          {
            label: 'default',
            name: '默认营销位'
          },
          {
            label: 'keyword',
            name: '关键词营销'
          }
        ],
        required: true,
        defaultValue: 'default'
      },
      {
        label: '关键词',
        placeholder: '请输入关键词，多个关键词中间英文逗号隔开',
        defaultValue: [],
        key: 'keywords',
        component() {
          return (
            <InnerTagInput
              v-model={vm.activityRule.keywords}
              placeholder='请输入关键词，多个关键词中间英文逗号隔开'
            />
          )
        },
        isShow() {
          return vm.activityRule.type == 'keyword'
        }
      },
      {
        label: '图片',
        key: 'ad_pic',
        defaultValue: '',
        component() {
          return (
            <div class='activity-pic-field'>
              <SpImagePicker v-model={vm.activityRule.ad_pic} />
            </div>
          )
        },
        validator(rule, value, callback) {
          if (!vm.activityRule.ad_pic) {
            callback(new Error('请选择图片'))
          } else {
            callback()
          }
        }
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
        label: '跳转链接',
        key: 'link_path',
        component({ disabled }, value) {
          return <CompPickerLink
            value={value['link_path']}
            params={{ regionauth_id: vm?.activityRule?.regionauth_id }}
            multiple={false}
            disabled={!vm?.activityRule?.regionauth_id}
            onChange={(e) => vm.onChangeLink(e)}
          />
        },
      }
    ],
    vm
  )
