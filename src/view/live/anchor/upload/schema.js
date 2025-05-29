import { createSetting } from '@shopex/finder'

const tableSchema = (vm) =>
  createSetting({
    columns: [
      {
        name: '上传文件',
        key: 'file_name'
      },
      {
        name: '上传时间',
        key: 'created_date'
      },
      {
        name: '文件大小',
        key: 'file_size_format'
      },
      {
        name: '处理状态',
        key: 'handle_status',
        render(h, { row }) {
          const map = {
            'wait': '等待处理',
            'processing': '处理中',
            'finish': '处理完成'
          }
          return <span>{map[row.handle_status]}</span>
        }
      },
      {
        name: '处理完成时间',
        key: 'finish_date'
      },
      {
        name: '处理成功',
        key: 'successLine',
        render(_, { row }) {
          return <span>{row?.handle_message?.successLine}行</span>
        }
      },
      {
        name: '处理失败',
        key: 'errorLine',
        render(_, { row }) {
          return (
            <div>
              <span>{row?.handle_message?.errorLine}行</span>
              {row?.handle_message?.errorLine > 0 && (
                <a type='primary' onClick={() => vm.exportErrorFile(row.id, row.file_type)}>
                  下载错误详情
                </a>
              )}
            </div>
          )
        }
      }
    ]
  })

export default {
  tableSchema
}
