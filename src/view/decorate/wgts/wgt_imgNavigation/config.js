/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrNavItem from './attr-imagepanel'

const config = {
  name: 'navigation',
  setting: [
    { label: i18n.t('ab472626.4707ba'), key: 'padded', component: 'switch', value: true },
    {
      label: i18n.t('ab472626.1289f8'),
      key: 'navigation',
      component: 'switch',
      value: false,
      isShow: function () {
        return this.$store.getters.login_type == 'admin'
      }
    },
    {
      label: i18n.t('ab472626.ae5ff3'),
      key: 'data',
      component: function (h, { key }) {
        return <AttrNavItem v-model={this.value[key]} isBusinessShow={this.value.navigation} />
      },
      value: [
        { content: 'ab472626.4ed345', seletedTags: [], imgUrl: '' },
        { content: 'ab472626.beee14', seletedTags: [], imgUrl: '' },
        { content: 'ab472626.e80060', seletedTags: [], imgUrl: '' },
        { content: 'ab472626.19b8ef', seletedTags: [], imgUrl: '' },
        { content: 'ab472626.357b5f', seletedTags: [], imgUrl: '' }
      ]
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
          padded: 'padded',
          navigation: 'navigation'
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
