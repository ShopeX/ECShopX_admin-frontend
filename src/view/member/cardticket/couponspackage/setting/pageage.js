import { createSetting } from '@shopex/finder'

import moment from 'moment'

export default (vm) => {
  return createSetting({
    search: [
      { key: 'title', name: '券包标题' },
      { key: 'regionauth_id', name: '区域', type: 'select', options: vm?.areas }
    ],
    columns: [
      { name: '券包标题	', key: 'title' },
      { name: '描述', key: 'package_describe', width: 130 },
      { name: '领取量', key: 'get_num' },
      { name: '区域', key: 'regionauth_name' },
      {
        name: '创建时间', key: 'created',
        render(_, { row }) {
          return moment(row.created * 1000).format('yyyy-MM-DD HH:mm:ss')
        }
      }
    ],
    actions: [
      {
        name: '查看',
        key: 'detail',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: (val) => {
            vm.$router.push({
              path: `${vm.$route.path}/detail`,
              query: {
                type: 'detail',
                package_id: val[0].package_id
              }
            })
          }
        }
      },
      {
        name: '编辑',
        key: 'edit',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: (val) => {
            vm.$router.push({
              path: `${vm.$route.path}/editor`,
              query: {
                type: 'edit',
                package_id: val[0].package_id
              }
            })
          }
        }
      },
      {
        name: '投放',
        key: 'push',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: (val) => {
            vm.pushCouponHandle(val)
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
          handler: async (val) => {
            await vm.$confirm(`删除券包？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
            const { status } = await vm.$api.coupons_package.deleteCoupon({
              package_id: val[0].package_id
            })
            if (status) {
              vm.$message.success('删除成功')
              vm.$refs.finder.refresh()
            } else {
              vm.$message.success('失败')
            }
          }
        }
      }
    ]
  })
}
