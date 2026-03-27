import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

const config = {
  name: 'ranking',
  setting: [
    {
      group: i18n.t('5f12aa3b.e7af71'),
      label: i18n.t('5f12aa3b.e7af71'),
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrDataVue
            v-model={this.value[key]}
            type='category_ranking'
            dataCount={this.value.dataCount}
          />
        )
      },
      value: {
        id: '',
        info: null
      }
    },
    {
      group: i18n.t('5f12aa3b.e7af71'),
      label: i18n.t('5f12aa3b.87dfd7'),
      key: 'dataCount',
      component: 'number',
      value: 4,
      min: 1,
      max: 99
    },
    {
      group: i18n.t('5f12aa3b.6f3360'),
      label: i18n.t('5f12aa3b.c20c83'),
      key: 'rankingTitleType',
      component: 'radiobutton',
      options: [
        { name: i18n.t('5f12aa3b.ca746b'), label: 'text' },
        { name: i18n.t('5f12aa3b.20def7'), label: 'image' }
      ],
      value: 'text'
    },
    {
      group: i18n.t('5f12aa3b.6f3360'),
      label: i18n.t('5f12aa3b.264fe1'),
      key: 'rankingTitleImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.rankingTitleType === 'image'
      }
    },
    {
      group: i18n.t('5f12aa3b.6f3360'),
      label: i18n.t('5f12aa3b.eded9e'),
      key: 'rankingTitleText',
      component: 'input',
      value: '5f12aa3b.32c65d',
      isShow: function () {
        return this.value.rankingTitleType === 'text'
      }
    },
    {
      group: i18n.t('5f12aa3b.6f3360'),
      label: i18n.t('5f12aa3b.94e391'),
      key: 'rankingTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.rankingTitleType === 'text'
      }
    },
    {
      group: i18n.t('5f12aa3b.90507a'),
      label: i18n.t('5f12aa3b.1711a8'),
      key: 'rankingShowMoreBtn',
      component: 'radiobutton',
      options: [
        { name: i18n.t('5f12aa3b.4d775d'), label: true },
        { name: i18n.t('5f12aa3b.dce537'), label: false }
      ],
      value: true
    },
    {
      group: i18n.t('5f12aa3b.90507a'),
      label: i18n.t('5f12aa3b.351201'),
      key: 'rankingMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.rankingShowMoreBtn
      }
    },
    {
      group: '更多按钮',
      label: '',
      key: 'rankingMoreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' />
      },
      isShow: function () {
        return this.value.rankingShowMoreBtn
      },
      value: {}
    }
  ],
  transformIn: (v) => {
    const { titleText, titleColor, moreBtn, moreLink, goodsLayout, ...rest } = v.base || {}
    // 处理 titleText：可能是对象格式 {type, text, image} 或单独的字段
    let rankingTitleType = 'text'
    let rankingTitleImage = ''
    let rankingTitleText = '5f12aa3b.32c65d'

    if (titleText) {
      if (typeof titleText === 'object' && titleText.type) {
        rankingTitleType = titleText.type || 'text'
        rankingTitleText = titleText.text
        rankingTitleImage = titleText.image || ''
      } else {
        // 兼容旧格式：单独的字段
        rankingTitleText = titleText
      }
    }

    return {
      id: v?.id,
      name: v.name,
      ...rest,
      data: v.data,
      // 映射标题相关字段
      rankingTitleType,
      rankingTitleImage,
      rankingTitleText,
      rankingTitleColor: titleColor || '#000000',
      // 映射更多按钮相关字段
      rankingShowMoreBtn:
        moreBtn?.show !== undefined ? moreBtn.show : moreBtn !== undefined ? moreBtn : true,
      rankingMoreBtnColor: moreBtn?.color || '#000000',
      rankingMoreLink: moreLink || {},
      goodsLayout: goodsLayout,
      tags: {
        type: v.tagsType || '2',
        meber_tags: v.meber_tags || [],
        no_meber_tags: v.no_meber_tags || []
      }
    }
  },
  transformOut: (v, wgtList, regionauth_id) => {
    return pickBy(v, {
      id: 'id',
      name: 'name',
      base: (v) => {
        const baseData = pickBy(v, {
          wgtCustName: 'wgtCustName',
          track: 'track',
          dataCount: 'dataCount',
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          goodsLayout: 'goodsLayout',
          // 映射标题相关字段 - 转换为对象格式
          titleText: (v) => {
            return {
              type: v.rankingTitleType || 'text',
              text: v.rankingTitleText,
              image: v.rankingTitleImage || ''
            }
          },
          titleColor: 'rankingTitleColor',
          // 映射更多按钮相关字段 - 转换为对象格式
          moreBtn: (v) => {
            return {
              show: v.rankingShowMoreBtn !== undefined ? v.rankingShowMoreBtn : true,
              color: v.rankingMoreBtnColor || '#000000'
            }
          },
          moreLink: 'rankingMoreLink'
        })
        return baseData
      },
      data: 'data',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags',
      tagsType: 'tags.type'
    })
  }
}

import '../../comps/configsetting'
export default typeof globalThis !== 'undefined' && globalThis.__processConfig__
  ? globalThis.__processConfig__(config)
  : config
