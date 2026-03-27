/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrGoods from './attr-goods'
import CompPickerLink from '../../comps/comp-pickerLink'

const config = {
  name: 'goodsGrid',
  setting: [
    { label: i18n.t('e3c7978b.4707ba'), key: 'padded', component: 'switch', value: true },
    { label: i18n.t('bfabc536.319337'), key: 'addCart', component: 'switch', value: false },
    {
      label: i18n.t('bfabc536.390037'),
      key: 'style',
      component: 'radiobutton',
      options: [
        { name: i18n.t('bfabc536.412d79'), label: 'grid' },
        { name: i18n.t('bfabc536.41061c'), label: 'grids' }
      ],
      value: 'grid'
    },
    { label: i18n.t('bfabc536.ba302e'), key: 'showPrice', component: 'switch', value: false },
    { label: i18n.t('bfabc536.02af2a'), key: 'brand', component: 'switch', value: true },
    {
      label: i18n.t('bfabc536.2af133'),
      key: 'goodsSetting',
      component: function (h, { key }) {
        return <AttrGoods v-model={this.value[key]} type={this.value[key].type} />
      },
      value: {
        data: [
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0
          }
        ],
        pointGoods: [
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          },
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: 'bfabc536.1fd1d5',
            id: '',
            price: 0,
            market_price: 0,
            point: 0
          }
        ],
        type: 'normal'
      }
    },
    {
      label: i18n.t('bfabc536.90ef7c'),
      key: 'moreLink',
      component: function (h, { key }) {
        return <CompPickerLink v-model={this.value[key]} style='margin-top: 7px;' />
      }
    }
  ],
  transformIn: (v) => {
    const { name, base, config, data, distributor_id, track, tagsType, meber_tags, no_meber_tags } =
      v
    const { type = 'normal' } = config
    let list = []
    let pointGoods = []
    if (type == 'normal') {
      list = data
    } else if (type == 'point') {
      pointGoods = data
    }
    return {
      id: v?.id,
      name,
      ...base,
      ...config,
      data,
      list,
      distributor_id,
      track,
      tags: {
        type: tagsType || '2',
        meber_tags: meber_tags || [],
        no_meber_tags: no_meber_tags || []
      },
      goodsSetting: {
        type: type,
        data: list,
        pointGoods
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
          brand: 'brand',
          showPrice: 'showPrice',
          style: 'style',
          moreLink: 'moreLink',
          addCart: 'addCart',
          type: 'goodsSetting.type'
        })
      },
      data: ({ goodsSetting: { type, data, pointGoods } }) => {
        if (type == 'point') {
          return pointGoods
        } else {
          return data
        }
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
