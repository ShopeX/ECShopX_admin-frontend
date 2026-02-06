import { pickBy } from '@/utils'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'hotranking',
  setting: [
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
      key: 'hotrankingTitleType',
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
      key: 'hotrankingTitleImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.hotrankingTitleType === 'image'
      }
    },
    {
      group: '组件标题',
      label: '标题文字',
      key: 'hotrankingTitleText',
      component: 'input',
      value: '标题',
      isShow: function () {
        return this.value.hotrankingTitleType === 'text'
      }
    },
    {
      group: '组件标题',
      label: '标题颜色',
      key: 'hotrankingTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.hotrankingTitleType === 'text'
      }
    },
    {
      group: '更多按钮',
      label: '展示类型',
      key: 'hotrankingShowMoreBtn',
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
      key: 'hotrankingMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.hotrankingShowMoreBtn
      }
    },
    {
      group: '更多按钮',
      label: '',
      key: 'hotrankingMoreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' />
      },
      isShow: function () {
        return this.value.hotrankingShowMoreBtn
      },
      value: {}
    }
  ],
  transformIn: (v) => {
    const { base, ...rest } = v
    // 使用公共函数处理 base 中的样式数据转换
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    const { titleText, titleColor, moreBtn, moreLink, goodsLayout, ...baseRest } =
      transformedBase || {}

    // 处理 titleText：可能是对象格式 {type, text, image} 或单独的字段
    let hotrankingTitleType = 'text'
    let hotrankingTitleImage = ''
    let hotrankingTitleText = '标题'

    if (titleText) {
      if (typeof titleText === 'object' && titleText.type) {
        hotrankingTitleType = titleText.type || 'text'
        hotrankingTitleText = titleText.text
        hotrankingTitleImage = titleText.image || ''
      } else {
        // 兼容旧格式：单独的字段
        hotrankingTitleText = titleText
      }
    }

    return {
      name: v.name,
      ...baseRest,
      // 数据数量：支持从顶层或 base 回显，预览/iframe 更新后能正确显示
      dataCount: v.dataCount ?? v.base?.dataCount ?? baseRest?.dataCount ?? 4,
      // 映射标题相关字段
      hotrankingTitleType,
      hotrankingTitleImage,
      hotrankingTitleText,
      hotrankingTitleColor: titleColor || '#000000',
      // 映射更多按钮相关字段
      hotrankingShowMoreBtn:
        moreBtn?.show !== undefined ? moreBtn.show : moreBtn !== undefined ? moreBtn : true,
      hotrankingMoreBtnColor: moreBtn?.color || '#000000',
      hotrankingMoreLink: moreLink || {},
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
        // 使用公共函数处理 base 中的样式数据转换
        const baseData = createTransformOutBase(
          ['outerMargin', 'innerPadding', 'outerBackground', 'innerBackground'],
          ['outerMargin', 'innerPadding']
        )(v)

        // 添加其他字段
        const otherBaseData = pickBy(v, {
          wgtCustName: 'wgtCustName',
          track: 'track',
          dataCount: 'dataCount',
          goodsLayout: 'goodsLayout',
          // 映射标题相关字段 - 转换为对象格式
          titleText: (v) => {
            return {
              type: v.hotrankingTitleType || 'text',
              text: v.hotrankingTitleText,
              image: v.hotrankingTitleImage || ''
            }
          },
          titleColor: 'hotrankingTitleColor',
          // 映射更多按钮相关字段 - 转换为对象格式
          moreBtn: (v) => {
            return {
              show: v.hotrankingShowMoreBtn !== undefined ? v.hotrankingShowMoreBtn : true,
              color: v.hotrankingMoreBtnColor || '#000000'
            }
          },
          moreLink: 'hotrankingMoreLink'
        })

        return {
          ...baseData,
          ...otherBaseData
        }
      },
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
