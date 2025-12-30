/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
export const loadMap = () => {
  return new Promise((resolve, reject) => {
    window.init = () => {
      resolve()
    }
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//map.qq.com/api/js?v=2.exp&key=${process.env.VUE_APP_MAP_KEY}&callback=init`
    document.body.appendChild(script)
  })
}

export default {}
