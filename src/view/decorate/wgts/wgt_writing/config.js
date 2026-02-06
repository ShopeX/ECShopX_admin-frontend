/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { isArray, pickBy } from '@/utils'

const config = {
  name: 'writing',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '文本内容',
      key: 'data',
      component: 'textarea',
      rows: 20,
      value: ''
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    let _content = ''
    if (isArray(data)) {
      _content = data?.[0].content
    } else {
      _content = data
    }
    return {
      id: v?.id,
      name,
      ...base,
      data: _content,
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
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
      data: ({ data }) => {
        return [
          {
            content: data
          }
        ]
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
