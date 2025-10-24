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

import { bindThisForFormSchema } from '@/utils/schemaHelper'

export const formSchema = (vm) =>
  bindThisForFormSchema(
    [
      {
        type: 'group',
        label: '专票确认书'
      },
      {
        label: '企业专用发票确认书',
        key: 'special_invoice_confirm_open',
        type: 'switch'
      },
      {
        label: '注册协议标题',
        key: 'title',
        type: 'input',
        maxlength: 15
      },
      {
        label: '注册协议',
        key: 'content',
        type: 'richText'
      }
    ],
    vm
  )
