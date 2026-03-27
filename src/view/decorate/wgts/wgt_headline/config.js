/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'

const config = {
  name: 'headline',
  setting: [
    { label: i18n.t('f8a1a2cd.32c65d'), key: 'title', component: 'input', value: '标题' },
    {
      label: i18n.t('f8a1a2cd.d1b490'),
      key: 'float',
      component: 'radiobutton',
      options: [
        { name: i18n.t('f8a1a2cd.316a63'), label: 'left' },
        { name: i18n.t('f8a1a2cd.0bbc2e'), label: 'center' }
      ],
      value: 'center'
    }
  ],
  transformIn: (v) => {
    const { name, base, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      id: v?.id,
      name,
      ...base,
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
          title: 'title',
          float: 'float'
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
