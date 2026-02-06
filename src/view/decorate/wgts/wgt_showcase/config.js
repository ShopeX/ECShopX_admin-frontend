/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import AttrItem from './attr-item'

const config = {
  name: 'showcase',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    // { label: '图片描述', key: 'content', component: 'switch', value: true },
    {
      label: '展示图',
      key: 'data',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: [
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' },
        { imgUrl: '', linkPage: '', content: '', title: '', id: '' }
      ],
      tip: `建议尺寸:</br>大图（175px * 310px）小图（175px * 150px）`
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
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
      config: () => {
        return {
          style: 1
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
