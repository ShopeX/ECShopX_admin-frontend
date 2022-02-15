import { createSetting } from '@shopex/finder'
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

      { key: 'status', name: '短信类型', type: 'select', options: vm.smeType_options },
      { key: 'template_type', name: '发送状态', type: 'select', options: vm.search_options },
      { key: 'template_code', name: '模板CODE' },
      { key: 'mobile', name: '手机号' },
      { key: 'sms_content', name: '短信内容' },
      { key: 'task_name', name: '任务名称', slot: 'task_name' }

    ],
    columns: [
      { name: '接受短信的手机号', key: 'mobile',width:'140px' },
      { name: '模板CODE', key: 'template_code',width:'120px' },
      { name: '短信内容', key: 'sms_content' },
      { name: '短信类型', key: 'template_type', formatter: formatTemplate_type,width:'100px' },
      { name: '短信场景', key: 'scene_name' },
      { name: '发送时间', key: 'created', formatter: formatDate,width:'170px' },
      {
        name: '发送状态',
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
                (row.status == '1' && '发送中') ||
                  (row.status == '3' && '发送成功') ||
                  (row.status == '2' && '发送失败 ')
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
      }
    ]
  })
}
