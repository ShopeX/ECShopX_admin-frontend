// +----------------------------------------------------------------------
// | ECShopX open source E-commerce
// | ECShopX 开源商城系统 
// +----------------------------------------------------------------------
// | Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
// +----------------------------------------------------------------------
// | Corporate Website:  https://www.shopex.cn 
// +----------------------------------------------------------------------
// | Licensed under the Apache License, Version 2.0
// | http://www.apache.org/licenses/LICENSE-2.0
// +----------------------------------------------------------------------
// | The removal of shopeX copyright information without authorization is prohibited.
// | 未经授权不可去除shopeX商派相关版权
// +----------------------------------------------------------------------
// | Author: shopeX Team <mkt@shopex.cn>
// | Contact: 400-821-3106
// +----------------------------------------------------------------------

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
