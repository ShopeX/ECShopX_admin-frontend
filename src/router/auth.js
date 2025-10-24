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

import Home from '@/view/home'
import authloading from '@/view/authloading'

const pathPrefix = process.env.PREFIXES

let auth = {
  path: pathPrefix ? `/${pathPrefix}/auth` : '/auth',
  component: Home,
  name: '',
  hidden: true,
  children: [
    {
      path: pathPrefix ? `/${pathPrefix}/auth/:auth_type` : '/auth/:auth_type',
      component: authloading,
      name: '绑定'
    }
  ]
}

export default auth
