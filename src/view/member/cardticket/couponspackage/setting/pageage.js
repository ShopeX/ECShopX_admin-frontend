import { createSetting } from '@shopex/finder'
export default (vm) => {
  return createSetting({
    columns: [
      { name: '券包标题	', key: 'title' },
      { name: '描述', key: 'package_describe', width: 130 },
      { name: '领取量', key: 'get_num' }
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
        name: '删除',
        key: 'delete',
        type: 'button',
        buttonType: 'text',
        action: {
          type: 'link',
          handler: async (val) => {
            const result = await vm.$api.coupons_package.deleteCoupon({
              package_id: val[0].package_id
            })
            if (result.data.data.status) {
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
