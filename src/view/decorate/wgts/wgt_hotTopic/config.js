/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrItem from './attr-item'

const config = {
  name: 'hotTopic',
  setting: [
    { label: i18n.t('5a51588d.4707ba'), key: 'padded', component: 'switch', value: true },
    {
      label: i18n.t('5a51588d.b00a65'),
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        {
          id: '',
          topic: '5a51588d.b00a65'
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      id: v?.id,
      name,
      ...base,
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
        return pickBy(v, {
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
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
