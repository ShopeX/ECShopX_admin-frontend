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

import Vue from 'vue'
import Config from '@/config'

function useTheme() {
  const colorMappings = {
    successColor: '--success',
    primaryColor: '--primary',
    destructiveColor: '--destructive',
    warningColor: '--warning'
  }

  const updateThemeColor = () => {
    // 统一处理颜色变量的更新
    Object.entries(colorMappings).forEach(([sourceVar, targetVar]) => {
      const colorValue = Config.themeConfig[sourceVar]
      if (colorValue) {
        document.documentElement.style.setProperty(targetVar, colorValue)
      }
    })
  }

  return {
    updateThemeColor
  }
}

export { useTheme }
