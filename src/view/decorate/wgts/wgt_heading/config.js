/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'

const config = {
  name: 'heading',
  setting: [
    { label: i18n.t('f08d652e.32c65d'), key: 'title', component: 'textarea', rows: 6, value: '标题' },
    {
      label: i18n.t('f08d652e.d1b490'),
      key: 'align',
      component: 'radiobutton',
      options: [
        { name: i18n.t('f08d652e.316a63'), label: 'left' },
        { name: i18n.t('f08d652e.0bbc2e'), label: 'center' }
      ],
      value: 'center'
    },
    {
      label: i18n.t('f08d652e.3b8a43'),
      key: 'weight',
      component: 'switch',
      value: false
    },
    {
      label: i18n.t('f08d652e.81d6da'),
      key: 'italic',
      component: 'switch',
      value: false
    },
    {
      label: i18n.t('f08d652e.fc55af'),
      key: 'fontSize',
      component: 'select',
      options: [
        { label: 'h1', value: '32' },
        { label: 'h2', value: '24' },
        { label: 'h3', value: '18' },
        { label: 'h4', value: '16' },
        { label: 'h5', value: '14' },
        { label: 'h6', value: '12' }
      ],
      value: '16'
    },
    {
      label: i18n.t('f08d652e.6b36c6'),
      key: 'color',
      component: 'color',
      value: '#333'
    },
    {
      label: i18n.t('f08d652e.17169f'),
      key: 'lineHeight',
      component: 'select',
      options: [
        { label: '1.5', value: '1.5' },
        { label: '1.75', value: '1.75' },
        { label: '2', value: '2' },
        { label: '2.25', value: '2.25' },
        { label: '2.5', value: '2.5' },
        { label: '2.75', value: '2.75' },
        { label: '3', value: '3' }
      ],
      value: '1.5'
    }
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
          title: 'title',
          subtitle: 'subtitle',
          padded: 'padded'
        })
      },
      config: (v) => {
        return pickBy(v, {
          align: 'align',
          weight: 'weight',
          italic: 'italic',
          fontSize: 'fontSize',
          color: 'color',
          lineHeight: 'lineHeight'
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
