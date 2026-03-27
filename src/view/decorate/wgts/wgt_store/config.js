/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrStore from './attr-store'
import AttrGoods from './attr-goods'
import AttrLabel from './attr-label'

const config = {
  name: 'store',
  setting: [
    { label: i18n.t('4762f515.4707ba'), key: 'padded', component: 'switch', value: true },
    {
      label: i18n.t('4762f515.2f97db'),
      key: 'backgroundColor',
      component: 'color',
      value: '#fff'
    },
    {
      label: i18n.t('4762f515.691d9d'),
      key: 'imgUrl',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      tip: '4762f515.818403'
    },
    {
      label: i18n.t('4762f515.089a3d'),
      key: 'distributor',
      component: function (h, { key }) {
        return (
          <AttrStore
            v-model={this.value[key]}
            on-change={() => {
              if (this.value[key].id === '') {
                this.value['items'] = []
                this.value['tags'] = []
              }
            }}
          />
        )
      },
      value: {
        id: '',
        logo: '',
        name: ''
      }
    },
    {
      label: i18n.t('4762f515.54d6cd'),
      key: 'items',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} distributor={this.value['distributor']} />
      },
      value: [
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        },
        {
          goodsId: '',
          title: '商品名称',
          imgUrl: '',
          price: 88
        }
      ]
    },
    {
      label: i18n.t('4762f515.0f394b'),
      key: 'tags',
      component: function (h, { key }) {
        return <AttrLabel v-model={this.value[key]} distributor={this.value['distributor']} />
      },
      value: []
    }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      seletedTags = [],
      data: [{ id, items, logo, name: distributor_name }],
      track,
      tagsType,
      meber_tags,
      no_meber_tags
    } = v
    return {
      id: v?.id,
      name,
      ...base,
      tags: seletedTags,
      distributor: {
        id,
        logo,
        name: distributor_name
      },
      items,
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
          backgroundColor: 'backgroundColor',
          imgUrl: 'imgUrl'
        })
      },
      seletedTags: 'tags',
      data: ({ distributor: { id, logo, name }, items }) => {
        return [
          {
            id,
            items,
            logo,
            name
          }
        ]
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
