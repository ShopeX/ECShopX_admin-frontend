/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import AttrImgList from './attr-imgList.vue'
import { pickBy, isObject } from '@/utils'

const config = {
  name: 'floorImg',
  setting: [
    { label: '组件间距', key: 'padded', component: 'switch', value: true },
    { label: '显示背景图', key: 'openBackImg', component: 'switch', value: false },
    {
      label: '背景图片',
      key: 'backgroundImg',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.openBackImg
      }
    },
    { label: '字体颜色', key: 'WordColor', component: 'color', value: '#222' },
    {
      label: '图片列表',
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
