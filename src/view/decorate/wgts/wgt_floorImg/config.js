/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import AttrImgList from './attr-imgList.vue'
import { i18n } from '@/i18n'
import { pickBy, isObject } from '@/utils'

const config = {
  name: 'floorImg',
  setting: [
    { label: i18n.t('e3c7978b.4707ba'), key: 'padded', component: 'switch', value: true },
    { label: i18n.t('e3c7978b.b7e88c'), key: 'openBackImg', component: 'switch', value: false },
    {
      label: i18n.t('e3c7978b.d74849'),
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.openBackImg
      }
    },
    { label: i18n.t('e3c7978b.690660'), key: 'WordColor', component: 'color', value: '#222' },
    {
      label: i18n.t('e3c7978b.d98b3f'),
      key: 'data',
      component: function (h, { key }) {
        return <AttrImgList v-model={this.value[key]} />
      },
      value: [
        {
          ImgTitle: '',
          imgUrl: ''
        },
        {
          ImgTitle: '',
          imgUrl: ''
        },
        {
          ImgTitle: '',
          imgUrl: ''
        }
      ]
    }
  ],
  transformIn: (v) => {
    const { name, base, data, track, tagsType, meber_tags, no_meber_tags } = v
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
          padded: 'padded',
          WordColor: 'WordColor',
          openBackImg: 'openBackImg',
          backgroundImg: 'backgroundImg'
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
