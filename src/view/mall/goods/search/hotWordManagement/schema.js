import { bindThisForFormSchema } from '@/utils/schemaHelper'

import { createSetting } from '@shopex/finder'
import moment from 'moment'

export const createTableSchema = (vm) =>
  createSetting({
    search: [
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas || [] },
      { key: 'keyword', name: '热词' },
      {
        key: 'start_time',
        name: '展示开始时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
      },
      {
        key: 'end_time',
        name: '展示结束时间',
        type: 'date-range',
        defaultTime: [],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'yyyy-MM-dd HH:mm:ss'
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
        name: '热词',
        key: 'keyword'
      },
      {
        name: '排序优先级',
        key: 'sort'
      },
      {
        name: '区域',
        key: 'regionauth_id',
        render(h, { row }) {
          const item = vm?.areas?.find((el) => el.value == row.regionauth_id)
          return <span>{item?.label}</span>
        }
      },
      {
        name: '展示开始时间',
        key: 'show_time',
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
        options: vm?.areas || []
      },
      {
        label: '热词',
        type: 'input',
        key: 'keyword',
        defaultValue: '',
        required: true,
        placeholder: '请输入',
        message: '热搜词不能为空'
      },
      {
        label: '类型',
        key: 'keyword_type',
        type: 'radio',
        options: [
          {
            label: 'text',
            name: '文案'
          },
          {
            label: 'image',
            name: '图片'
          }
        ],
        required: true,
        defaultValue: 'text'
      },
      {
        label: '文案颜色',
        key: 'textColor',
        required: true,
        defaultValue: '0',
        isShow() {
          return vm.activityRule.keyword_type == 'text'
        },
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-radio-group v-model={vm.activityRule['textColor']} onInput={(val) => vm.changeTextColor(val)}>
                <el-radio label='0'>默认</el-radio>
                <el-radio label='1'>
                  指定颜色
                  <el-color-picker v-model={value['color']} style='opacity: 0;z-index:1;' />
                  <i
                    class='el-icon-caret-bottom'
                    style={'position:relative;left:10px;z-index:0px;'}
                  ></i>
                </el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        label: '背景颜色',
        key: 'backColor',
        required: true,
        defaultValue: '0',
        isShow() {
          return vm.activityRule.keyword_type == 'text'
        },
        component({ key }, value) {
          return (
            <div class='refund-address'>
              <el-radio-group v-model={vm.activityRule['backColor']} onInput={(val) => vm.changeBackColor(val)}>
                <el-radio label='0'>默认</el-radio>
                <el-radio label='1'>
                  指定颜色
                  <el-color-picker v-model={value['background']} style='opacity: 0;z-index:1;' />
                  <i
                    class='el-icon-caret-bottom'
                    style={'position:relative;left:10px;z-index:0px;'}
                  ></i>
                </el-radio>
              </el-radio-group>
            </div>
          )
        }
      },
      {
        label: '图片',
        key: 'icon',
        defaultValue: '',
        component() {
          return (
            <div class='activity-pic-field'>
              <SpImagePicker v-model={vm.activityRule.icon} />
            </div>
          )
        },
        isShow() {
          return vm.activityRule.keyword_type !== 'text'
        }
      },
      {
        label: '图标',
        key: 'icon',
        defaultValue: '',
        component() {
          return (
            <div class='activity-pic-field'>
              <SpImagePicker v-model={vm.activityRule.icon} />
            </div>
          )
        },
        isShow() {
          return vm.activityRule.keyword_type == 'text'
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
