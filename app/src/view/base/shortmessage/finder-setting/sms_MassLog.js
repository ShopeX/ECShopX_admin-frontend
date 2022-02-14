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
      {
        key: 'time_start',
        name: '发送时间',
        type: 'date-range',
        defaultTime: ['00:00:00', '23:59:59'],
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      },
      { key: 'status	', name: '任务状态', type: 'select', options: vm.search_options },
      { key: 'task_name', name: '任务名称' },
      { key: 'template_name', name: '短信模板' }
    ],
    columns: [
      { name: '任务名称', key: 'task_name', width: '140px' },
      { name: '创建时间', key: 'created', formatter: formatDate, width: '170px' },
      { name: '定时发送', key: 'send_at', formatter: formatDate, width: '170px' },
      { name: '短信模板', key: 'template_name' },
      {
        name: '任务状态',
        key: 'status',
        width: '100px',
        render: (h, { row }) =>
          h(
            'div',
            {
              class: 'yahh'
            },
            [
              //   h('div', {
              //     class: `status-icon ${row.status == '1' && 'success'} ${
              //       row.status == '2' && 'fail'
              //     }`
              //   }),
              h(
                'span',
                {},
                (row.status == '1' && '等待中') ||
                  (row.status == '2' && '群发成功') ||
                  (row.status == '3' && '群发失败 ') ||
                  (row.status == '4' && '已撤销 ')
              ),
              row.status == 2 &&
                row.reason &&
                h(
                  'el-tooltip',
                  {
                    class: 'tips',
                    props: {
                      effect: 'dark',
                      content: row.reason,
                      placement: 'top'
                    }
                  },
                  [h('i', { class: 'el-icon-warning-outline' }, '')]
                )
            ]
          )
      },
      {
        name: '号码数量',
        key: 'total_num',
        render: (h, { row }) =>
          h(
            'span',
            {
              type: 'text',
              class:'e-button--text',
              style:{color: '#409EFF',cursor:'pointer'},  
              on:{
                click:()=>{
                  vm.$router.push({
                    path:'/setting/datamessage/ali_sms/sms_sendLog',
                    query:{
                      task_name:row.task_name
                    }
                  })

                }
              }
            },
            row.total_num
          )
      },
      { name: '失败号码数量', key: 'failed_num' }
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
            vm.visible = true;
            vm.info = {
              type:'detail',
              id:val[0].id
            }
          }
        },
        visible:(val)=>{
          return val.status != '4'
        }
      },
      {
        name: '撤销',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.deleteSMS(val[0].id)
          }
        },
        visible:(val)=>{
          return val.status == '1'
        }
      },
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            vm.visible = true;
            vm.info = {
              type:'edit',
              id:val[0].id
            }
          }
        },
        visible:(val)=>{
          return val.status == '4'
        }
      },
    ]
  })
}
