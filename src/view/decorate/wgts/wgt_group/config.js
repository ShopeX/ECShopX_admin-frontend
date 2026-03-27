import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'group',
  setting: [
    {
      group: i18n.t('55fecc70.e7af71'),
      label: i18n.t('55fecc70.e7af71'),
      key: 'data',
      component: function (h, { key }) {
        return (
          <AttrDataVue v-model={this.value[key]} type='group' dataCount={this.value.dataCount} />
        )
      },
      value: {
        id: '',
        info: null
      }
    },
    {
      group: i18n.t('55fecc70.e7af71'),
      label: i18n.t('55fecc70.87dfd7'),
      key: 'dataCount',
      component: 'number',
      value: 4,
      min: 1,
      max: 99
    },
    {
      group: i18n.t('55fecc70.6f3360'),
      label: i18n.t('55fecc70.c20c83'),
      key: 'groupTitleType',
      component: 'radiobutton',
      options: [
        { name: i18n.t('55fecc70.ca746b'), label: 'text' },
        { name: i18n.t('55fecc70.20def7'), label: 'image' }
      ],
      value: 'text'
    },
    {
      group: i18n.t('55fecc70.6f3360'),
      label: i18n.t('55fecc70.264fe1'),
      key: 'groupTitleImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.groupTitleType === 'image'
      }
    },
    {
      group: i18n.t('55fecc70.6f3360'),
      label: i18n.t('55fecc70.eded9e'),
      key: 'groupTitleText',
      component: 'input',
      value: '标题',
      isShow: function () {
        return this.value.groupTitleType === 'text'
      }
    },
    {
      group: i18n.t('55fecc70.6f3360'),
      label: i18n.t('55fecc70.94e391'),
      key: 'groupTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.groupTitleType === 'text'
      }
    },
    {
      group: i18n.t('55fecc70.90507a'),
      label: i18n.t('55fecc70.1711a8'),
      key: 'groupShowMoreBtn',
      component: 'radiobutton',
      options: [
        { name: i18n.t('55fecc70.4d775d'), label: true },
        { name: i18n.t('55fecc70.dce537'), label: false }
      ],
      value: true
    },
    {
      group: i18n.t('55fecc70.90507a'),
      label: i18n.t('55fecc70.351201'),
      key: 'groupMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.groupShowMoreBtn
      }
    },
    {
      group: i18n.t('55fecc70.90507a'),
      label: '',
      key: 'groupMoreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' />
      },
      isShow: function () {
        return this.value.groupShowMoreBtn
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
    let groupTitleType = 'text'
    let groupTitleImage = ''
    let groupTitleText = '标题'

    if (titleText) {
      if (typeof titleText === 'object' && titleText.type) {
        groupTitleType = titleText.type || 'text'
        groupTitleText = titleText.text
        groupTitleImage = titleText.image || ''
      } else {
        // 兼容旧格式：单独的字段
        groupTitleText = titleText
      }
    }

    return {
      id: v?.id,
      name: v.name,
      ...baseRest,
      data: v.data,
      // 映射标题相关字段
      groupTitleType,
      groupTitleImage,
      groupTitleText,
      groupTitleColor: titleColor || '#000000',
      // 映射更多按钮相关字段
      groupShowMoreBtn:
        moreBtn?.show !== undefined ? moreBtn.show : moreBtn !== undefined ? moreBtn : true,
      groupMoreBtnColor: moreBtn?.color || '#000000',
      groupMoreLink: moreLink || {},
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
              type: v.groupTitleType || 'text',
              text: v.groupTitleText,
              image: v.groupTitleImage || ''
            }
          },
          titleColor: 'groupTitleColor',
          // 映射更多按钮相关字段 - 转换为对象格式
          moreBtn: (v) => {
            return {
              show: v.groupShowMoreBtn !== undefined ? v.groupShowMoreBtn : true,
              color: v.groupMoreBtnColor || '#000000'
            }
          },
          moreLink: 'groupMoreLink'
        })

        return {
          ...baseData,
          ...otherBaseData
        }
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
