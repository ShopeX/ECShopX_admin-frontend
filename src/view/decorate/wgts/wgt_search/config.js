/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
const config = {
  name: 'search',
  setting: [
    { label: i18n.t('043bd5c4.816458'), key: 'fixTop', component: 'switch', value: false },
    { label: i18n.t('043bd5c4.4707ba'), key: 'padded', component: 'switch', value: true },
    { label: i18n.t('043bd5c4.8ce1cd'), key: 'placeholder', component: 'input', value: '043bd5c4.758b99' }
  ],
  transformIn: (v) => {
    const { name, base, config, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        return pickBy(v, {
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          fixTop: 'fixTop',
          placeholder: 'placeholder'
        })
      },
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

// 自动处理 compStyle 配置（初始化全局处理函数）
import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
