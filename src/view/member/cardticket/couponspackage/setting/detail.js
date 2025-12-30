/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { createSetting } from '@shopex-ui/finder'
export default (vm) => {
  return createSetting({
    columns: [
      { name: '用户名	', key: 'username' },
      { name: '手机号码', key: 'mobile' },
      { name: '领取时间', key: 'receive_time' },
      { name: '来源类型', key: 'receive_type' }
    ]
  })
}
