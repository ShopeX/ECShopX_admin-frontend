/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

export const proportions = [
  {
    label: 0,
    name: '16:9'
  },
  {
    label: 1,
    name: '9:16'
  },
  {
    label: 2,
    name: '4:3'
  },
  {
    label: 3,
    name: '3:4'
  },
  {
    label: 4,
    name: '1:1'
  }
]

const config = {
  name: 'film',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    {
      label: '选择视频',
      key: 'data',
      component: function (h, { key }) {
        return <SpVideoPicker v-model={this.value[key]} size='small' />
      },
      value: {}
    },
    {
      label: '视频比例',
      key: 'proportion',
      component: 'radiobutton',
      options: proportions,
      value: 0
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])
    let _data = data.flat()[0] || {}
    return {
      id: v?.id,
      name,
      ...transformedBase,
      data: _data,
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
        // 使用公共函数处理 outerMargin 转换，同时保留其他字段
        const baseData = createTransformOutBase(['proportion', 'outerMargin'], ['outerMargin'])(v)
        return baseData
      },
      data: ({ data }) => {
        if (!data) return []
        return [
          pickBy(data, {
            image_id: 'image_id',
            media_id: 'image_id', // 兼容后端字段名
            url: 'url'
          })
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
