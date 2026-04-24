/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrGoods from './attr-goods'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'goodsCard',
  setting: [
    {
      label: i18n.t('8f58e7cb.43d1e2'),
      key: 'data',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} />
      },
      value: []
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
    const transformedBase = transformInBase(base || {}, ['outerMargin', 'innerPadding'])
    return {
      id: v?.id,
      name,
      ...transformedBase,
      data,
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
        const styleBase = createTransformOutBase(
          ['outerMargin', 'innerPadding', 'outerBackground', 'innerBackground'],
          ['outerMargin', 'innerPadding']
        )(v)
        const contentBase = pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded',
          proportion: 'proportion'
        })
        return {
          ...styleBase,
          ...contentBase
        }
      },
      data: 'data',
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
