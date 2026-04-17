/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrCategory from './attr-category'
import ProductLabel from './product-label'

const config = {
  name: 'nearbyShop',
  setting: [
    { label: i18n.t('9b7fb994.4707ba'), key: 'padded', component: 'switch', value: false },
    { label: i18n.t('9b7fb994.319337'), key: 'addCart', component: 'switch', value: false },
    {
      label: i18n.t('9b7fb994.0f09a8'),
      key: 'seletedTags',
      component: function (h, { key }) {
        return <AttrCategory v-model={this.value[key]} />
      },
      value: []
    },
    {
      label: i18n.t('9b7fb994.0f394b'),
      key: 'productLabel',
      component: function (h, { key }) {
        return <ProductLabel v-model={this.value[key]} />
      },
      value: []
    },
    {
      label: i18n.t('9b7fb994.8752e9'),
      key: 'navigation_display',
      component: 'radiobutton',
      options: [
        { name: i18n.t('9b7fb994.a8b0c2'), label: 'all' },
        { name: i18n.t('9b7fb994.0f09a8'), label: 'business' },
        { name: i18n.t('9b7fb994.0f394b'), label: 'productLabels' }
      ],
      value: 'all'
    },
    { label: i18n.t('9b7fb994.5ea469'), key: 'show_coupon', component: 'switch', value: false },
    {
      label: i18n.t('9b7fb994.f417a5'),
      key: 'show_nearby_merchants',
      component: 'switch',
      value: false
    },
    {
      label: i18n.t('9b7fb994.35f408'),
      key: 'merchantsNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    },
    {
      label: i18n.t('9b7fb994.81756c'),
      key: 'quantityNumber',
      component: 'number',
      value: 4,
      min: 1,
      max: 100
    }
    // {
    //   label: '商家排序',
    //   key: 'shopSort',
    //   component: function (h, { key }) {
    //     return <div>{this.value[key]}</div>
    //   },
    //   value: 'LBS定位'
    // }
  ],
  transformIn: (v) => {
    const {
      name,
      base,
      seletedTags = [],
      productLabel = [],
      track,
      tagsType,
      meber_tags,
      no_meber_tags
    } = v
    return {
      id: v?.id,
      name,
      ...base,
      seletedTags,
      productLabel,
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
          show_coupon: 'show_coupon',
          navigation_display: 'navigation_display',
          addCart: 'addCart',
          show_nearby_merchants: 'show_nearby_merchants',
          merchantsNumber: 'merchantsNumber',
          quantityNumber: 'quantityNumber'
        })
      },
      seletedTags: 'seletedTags',
      productLabel: 'productLabel',
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
