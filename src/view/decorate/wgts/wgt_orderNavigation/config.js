/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import AttrNavItem from './attr-imagepanel'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'orderNavigation',
  setting: [
    { label: '组件间距', group: '组件样式', key: 'padded', component: 'switch', value: true },
    { label: '标题', group: '基础设置', key: 'title', component: 'input', value: '' },
    { label: '标题颜色', group: '组件样式', key: 'titleColor', component: 'color', value: '#000' },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <AttrNavItem v-model={this.value[key]} isBusinessShow={this.value.navigation} />
      },
      value: [
        {
          content: '待付款',
          imgUrl: ''
        },
        {
          content: '待收货',
          imgUrl: ''
        },
        {
          content: '待评价',
          imgUrl: ''
        },
        {
          content: '售后',
          imgUrl: ''
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, config: cfg, data, track, tagsType, meber_tags, no_meber_tags } = v
    const transformedBase = transformInBase(base, ['outerMargin'])
    return {
      id: v?.id,
      name,
      ...transformedBase,
      ...(cfg || {}),
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
      base: createTransformOutBase(
        ['outerMargin', 'title', 'padded', 'titleColor', 'backgroundColor'],
        ['outerMargin']
      ),
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
