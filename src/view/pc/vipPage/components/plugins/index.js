/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import poster from './poster/index'
import posterStyle from './poster/style'
export default {
  [poster.name]: { widget: poster, style: 'posterStyle' },
  [posterStyle.name]: { widget: posterStyle }
}
