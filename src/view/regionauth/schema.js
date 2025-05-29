import { createSetting } from '@shopex/finder'
import { getCascaderObj } from '@/utils'
import district from '@/common/district.json'

export const createTableSchema = (vm) =>
  createSetting({
    actions: [
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.editRowDataHandle(row)
          }
        }
      },
      // {
      //   name: '删除',
      //   key: 'delete',
      //   type: 'button',
      //   buttonType: 'text',
      //   action: {
      //     handler: ([row]) => {
      //       vm.deleteRowDataHandle(row)
      //     }
      //   }
      // },
      {
        name: '微信支付配置',
        key: 'wechatPayConfig',
        type: 'button',
        buttonType: 'text',
        action: {
          handler: ([row]) => {
            vm.wechatPayConfigHandle(row)
          }
        }
      }
    ],
    columns: [
      {
        name: '区域编码',
        key: 'regionauth_code'
      },
      {
        name: '区域名称',
        key: 'regionauth_name'
      },
      {
        name: '地址区域',
        key: 'area',
        render(h, { row }) {
          const arr = getCascaderObj(
            [
              row?.regionauth_province || '',
              row?.regionauth_city || '',
              row?.regionauth_area || ''
            ],
            district
          )
          const str =
            arr?.reduce((pre, now) => (pre += now?.label || ''), '') +
            (row.regionauth_address || '')
          return <div style='align-content: center;'>{str}</div>
        }
      },
      {
        name: '客服电话',
        key: 'regionauth_tel'
      },
      {
        name: '状态',
        key: 'state',
        render(h, scope) {
          return (
            <div style='align-content: center;'>
              <span style='margin-right:10px;'>{scope.row.state === 'true' ? '启用' : '禁用'}</span>
              <el-switch
                active-value={'true'}
                inactive-value={'false'}
                active-color='#13ce66'
                onChange={() => vm.changeStateHanlde(scope.row)}
                value={scope.row.state}
              />
            </div>
          )
        }
      }
    ]
  })
