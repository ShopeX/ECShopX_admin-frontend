import { createSetting } from '@shopex/finder'
import { Divider, Message, MessageBox } from 'element-ui'
export default (vm) => {
  const formatDate = (timestamp) => {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var YY = date.getFullYear() + '-'
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return YY + MM + DD + ' ' + hh + mm + ss
  }

  const formatTemplate_type = (status) => {
    switch (status) {
      case '0':
        return `验证码`
      case '1':
        return `短信通知`
      case '2':
        return `推广短信`
    }
  }
  return createSetting({
    search: [
      { key: 'status', name: '审核状态', type: 'select', options: vm.search_options },
      { key: 'template_name', name: '模板名称' }
    ],
    columns: [
      { name: '模板名称', key: 'template_name' },
      { name: '模板CODE', key: 'template_code' },
      { name: '模板内容', key: 'template_content' },
      { name: '短信类型', key: 'template_type',formatter:formatTemplate_type },
      { name: '短信场景', key: 'scene_name' },
      { name: '创建时间', key: 'created',formatter:formatDate },
      {
        name: '审核状态',
        key: 'status',
        width: '100px',
        render: (h, { row }) =>
          h(
            'div',
            {
              class: 'yahh'
            },
            [
              h('div', {
                class: `status-icon ${row.status == '1' && 'success'} ${
                  row.status == '2' && 'fail'
                }`
              }),
              h(
                'span',
                {},
                (row.status == '0' && '审核中') ||
                  (row.status == '1' && '审核通过') ||
                  (row.status == '2' && '审核失败 ')
              ),
              row.status == 2 && row.reason  &&
              h(
                'el-tooltip',
                {
                  class:'tips',
                  props: {
                    effect: 'dark',
                    content: row.reason,
                    placement:'top'
                  }
                },
                [h('i',{class:'el-icon-warning-outline'},'')]
              )
            ]
        )
      }
    ],
    actions: [
      {
        name: '详情',
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchHidePage('edit'),
              query: { type: 'detail', id: val[0].id }
            })
          }
        }
      },
      {
        name: '编辑',
        key: 'editor',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.$router.push({
              path: vm.matchHidePage('edit'),
              query: { type: 'edit', id: val[0].id }
            })
          }
        },
        visible: (val) => {
          return val.status == '2'
        }
      },
      {
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.deleteTemplateHandle(val[0].id)
          }
        },
        visible: (val) => {
          return val.status != '0'
        }
      }
    ]
  })
}
