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

import { SpPickerPlugin } from '@/components/sp-picker'
import { SpDialogPlusPlugin } from '@/components/sp-dialog-plus'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

function install(Vue) {
  const plugins = {
    SpPickerPlugin,
    SpDialogPlusPlugin,
    VueVideoPlayer
  }

  const baseContext = require.context('./../components', true, /index(\.vue|\.js)$/)
  const components = {}
  function resloveModule(mod) {
    Object.keys(mod).forEach((key) => {
      mod[key].name && (components[mod[key].name] = mod[key])
    })
  }

  baseContext.keys().forEach((key) => {
    const mod = baseContext(key)
    resloveModule(mod)
  })

  console.log('components:', components, plugins)
  Object.keys(components).forEach((key) => {
    const comp = components[key]
    Vue.component(comp.name, comp)
  })

  Object.keys(plugins).forEach((name) => {
    const plugin = plugins[name]
    Vue.use(plugin)
  })
}

export { install }
