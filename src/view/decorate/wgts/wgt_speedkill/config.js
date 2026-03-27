import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

const config = {
  name: 'speedkill',
  setting: [
    {
      group: i18n.t('e05e61da.e7af71'),
      label: i18n.t('e05e61da.185f7b'),
      key: 'dataType',
      component: 'radiobutton',
      options: [
        { name: i18n.t('e05e61da.35242c'), label: 'seckill' },
        { name: i18n.t('e05e61da.84bf84'), label: 'promotion' }
      ],
      value: 'seckill'
    },
    {
      group: i18n.t('e05e61da.e7af71'),
      label: i18n.t('e05e61da.e7af71'),
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrDataVue
            v-model={this.value[key]}
            type={this.value.dataType}
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
      group: i18n.t('e05e61da.e7af71'),
      label: i18n.t('e05e61da.87dfd7'),
      key: 'dataCount',
      component: 'number',
      value: 4,
      min: 1,
      max: 99
    },
    {
      group: i18n.t('e05e61da.6f3360'),
      label: i18n.t('e05e61da.c20c83'),
      key: 'speedkillTitleType',
      component: 'radiobutton',
      options: [
        { name: i18n.t('e05e61da.ca746b'), label: 'text' },
        { name: i18n.t('e05e61da.20def7'), label: 'image' }
      ],
      value: 'text'
    },
    {
      group: i18n.t('e05e61da.6f3360'),
      label: i18n.t('e05e61da.264fe1'),
      key: 'speedkillTitleImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.speedkillTitleType === 'image'
      }
    },
    {
      group: i18n.t('e05e61da.6f3360'),
      label: i18n.t('e05e61da.eded9e'),
      key: 'speedkillTitleText',
      component: 'input',
      value: '标题',
      isShow: function () {
        return this.value.speedkillTitleType === 'text'
      }
    },
    {
      group: i18n.t('e05e61da.6f3360'),
      label: i18n.t('e05e61da.94e391'),
      key: 'speedkillTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.speedkillTitleType === 'text'
      }
    },
    {
      group: i18n.t('e05e61da.90507a'),
      label: i18n.t('e05e61da.1711a8'),
      key: 'speedkillShowMoreBtn',
      component: 'radiobutton',
      options: [
        { name: i18n.t('e05e61da.4d775d'), label: true },
        { name: i18n.t('e05e61da.dce537'), label: false }
      ],
      value: true
    },
    {
      group: i18n.t('e05e61da.90507a'),
      label: i18n.t('e05e61da.351201'),
      key: 'speedkillMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.speedkillShowMoreBtn
      }
    },
    {
      group: '更多按钮',
      label: '',
      key: 'speedkillMoreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' />
      },
      isShow: function () {
        return this.value.speedkillShowMoreBtn
      },
      value: {}
    }
  ],
  transformIn: (v) => {
    const {
      titleType,
      titleImage,
      titleText,
      titleColor,
      showMoreBtn,
      moreBtnColor,
      moreLink,
      goodsLayout,
      ...rest
    } = v.base || {}
    return {
      id: v?.id,
      name: v.name,
      ...rest,
      data: v.data,
      // 映射标题相关字段
      speedkillTitleType: titleType || 'text',
      speedkillTitleImage: titleImage || '',
      speedkillTitleText: titleText,
      speedkillTitleColor: titleColor || '#000000',
      // 映射更多按钮相关字段
      speedkillShowMoreBtn: showMoreBtn !== undefined ? showMoreBtn : true,
      speedkillMoreBtnColor: moreBtnColor || '#000000',
      speedkillMoreLink: moreLink || {},
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
          dataType: 'dataType',
          dataCount: 'dataCount',
          outerMargin: 'outerMargin',
          innerPadding: 'innerPadding',
          goodsLayout: 'goodsLayout',
          // 映射标题相关字段
          titleType: 'speedkillTitleType',
          titleImage: 'speedkillTitleImage',
          titleText: 'speedkillTitleText',
          titleColor: 'speedkillTitleColor',
          // 映射更多按钮相关字段
          showMoreBtn: 'speedkillShowMoreBtn',
          moreBtnColor: 'speedkillMoreBtnColor',
          moreLink: 'speedkillMoreLink'
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
