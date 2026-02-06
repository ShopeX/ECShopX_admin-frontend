import { pickBy } from '@/utils'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

const config = {
  name: 'speedkill',
  setting: [
    {
      group: '数据设置',
      label: '数据类型',
      key: 'dataType',
      component: 'radiobutton',
      options: [
        { name: '普通', label: 'seckill' },
        { name: '集合页', label: 'promotion' }
      ],
      value: 'seckill'
    },
    {
      group: '数据设置',
      label: '数据设置',
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
      group: '数据设置',
      label: '数据数量',
      key: 'dataCount',
      component: 'number',
      value: 4,
      min: 1,
      max: 99
    },
    {
      group: '组件标题',
      label: '标题类型',
      key: 'speedkillTitleType',
      component: 'radiobutton',
      options: [
        { name: '文字', label: 'text' },
        { name: '图片', label: 'image' }
      ],
      value: 'text'
    },
    {
      group: '组件标题',
      label: '标题图片',
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
      group: '组件标题',
      label: '标题文字',
      key: 'speedkillTitleText',
      component: 'input',
      value: '标题',
      isShow: function () {
        return this.value.speedkillTitleType === 'text'
      }
    },
    {
      group: '组件标题',
      label: '标题颜色',
      key: 'speedkillTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.speedkillTitleType === 'text'
      }
    },
    {
      group: '更多按钮',
      label: '展示类型',
      key: 'speedkillShowMoreBtn',
      component: 'radiobutton',
      options: [
        { name: '显示', label: true },
        { name: '隐藏', label: false }
      ],
      value: true
    },
    {
      group: '更多按钮',
      label: '按钮颜色',
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
