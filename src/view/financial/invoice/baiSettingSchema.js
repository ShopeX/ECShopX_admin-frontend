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
        label: '百望云发票'
      },
      {
        label: '用户名',
        key: 'username',
        type: 'input',
        required: true
      },
      {
        label: '密码',
        key: 'password',
        type: 'input',
        required: true
      },
      {
        label: 'appKey',
        key: 'appKey',
        type: 'input',
        required: true
      },
      {
        label: 'appSecret',
        key: 'appSecret',
        type: 'input',
        required: true
      },
      {
        label: '用户盐值',
        key: 'orgAuthCode',
        type: 'input',
        required: true
      },
      {
        label: '机构税号',
        key: 'taxNo',
        type: 'input',
        required: true
      }
    ],
    vm
  )
