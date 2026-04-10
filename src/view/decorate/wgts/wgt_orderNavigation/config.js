/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrNavItem from './attr-imagepanel'
import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'orderNavigation',
  setting: [
    {
      label: i18n.t('cff31093.4707ba'),
      group: i18n.t('cff31093.32789d'),
      key: 'padded',
      component: 'switch',
      value: true
    },
    {
      label: i18n.t('cff31093.32c65d'),
      group: i18n.t('cff31093.0aeca0'),
      key: 'title',
      component: 'input',
      value: ''
    },
    {
      label: i18n.t('cff31093.94e391'),
      group: i18n.t('cff31093.32789d'),
      key: 'titleColor',
      component: 'color',
      value: '#000'
    },
    {
      label: '',
      key: 'data',
      component: function (h, { key }) {
        return <AttrNavItem v-model={this.value[key]} isBusinessShow={this.value.navigation} />
      },
      value: [
        {
          content: i18n.t('cff31093.818d78'),
          imgUrl: ''
        },
        {
          content: i18n.t('cff31093.4933ca'),
          imgUrl: ''
        },
        {
          content: i18n.t('cff31093.a48b28'),
          imgUrl: ''
        },
        {
          content: i18n.t('cff31093.59bd68'),
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
      data: Array.isArray(data) ? data : [],
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
