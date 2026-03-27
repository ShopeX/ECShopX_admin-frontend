/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import AttrHorizontal from './attr_horizontal'
import { i18n } from '@/i18n'
import AttrVertical from './attr_vertical'
import { pickBy } from '@/utils'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'marquees',
  setting: [
    {
      label: i18n.t('8fc92d38.2d711b'),
      group: i18n.t('8fc92d38.c6b063'),
      key: 'direction',
      component: 'radiobutton',
      options: [
        { name: i18n.t('8fc92d38.e8f87a'), label: 'vertical' },
        { name: i18n.t('8fc92d38.97d076'), label: 'horizontal' }
      ],
      value: 'vertical'
    },
    {
      label: i18n.t('8fc92d38.4573a7'),
      key: 'bgcolor',
      component: 'color',
      value: '#ffffff',
      group: i18n.t('8fc92d38.c6b063')
    },
    {
      label: i18n.t('8fc92d38.690660'),
      key: 'fontcolor',
      component: 'color',
      value: '#000000',
      group: i18n.t('8fc92d38.c6b063')
    },
    {
      group: '',
      label: '',
      key: 'dataText',
      isShow: function () {
        return this.value.direction == 'horizontal'
      },
      component: function (h, { key }) {
        return <AttrHorizontal v-model={this.value[key]} />
      },
      value: [{ title: '8fc92d38.cbc608' }]
    },
    {
      label: '',
      key: 'dataContent',
      isShow: function () {
        return this.value.direction == 'vertical'
      },
      component: function (h, { key }) {
        return <AttrVertical v-model={this.value[key]} />
      },
      value: [{ title: i18n.t('8fc92d38.64cebd'), id: '' }]
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, track, tagsType, meber_tags, no_meber_tags } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin'])
    let res = {
      id: v?.id,
      name,
      ...transformedBase,
      ...config,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      }
    }
    if (config.direction == 'horizontal') {
      res = {
        ...res,
        dataText: data
      }
    } else {
      res = {
        ...res,
        dataContent: data
      }
    }
    return res

    // dataText: config.direction == 'horizontal' ? data : [{ title: '文本内容' }],
    //   dataContent: config.direction == 'vertical' ? data : [{ title: '软文标题', id: '' }]
  },
  transformOut: (v) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        // 使用公共函数处理 outerMargin 转换，同时保留其他字段
        const baseData = createTransformOutBase(
          ['title', 'subtitle', 'padded', 'outerMargin'],
          ['outerMargin']
        )(v)
        return baseData
      },
      config: (v) => {
        return pickBy(v, {
          bgcolor: 'bgcolor',
          direction: 'direction',
          fontcolor: 'fontcolor'
        })
      },
      data: v.direction == 'horizontal' ? v.dataText : v.dataContent,
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
