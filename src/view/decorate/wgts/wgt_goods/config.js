import { pickBy } from '@/utils'
import { i18n } from '@/i18n'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'goods',
  setting: [
    {
      group: i18n.t('62d2fa27.e7af71'),
      label: i18n.t('62d2fa27.185f7b'),
      key: 'dataType',
      component: 'select',
      placeholder: i18n.t('62d2fa27.86ec5f'),
      options: [
        { label: i18n.t('62d2fa27.5488d8'), value: 'price' },
        { label: i18n.t('62d2fa27.728225'), value: 'items' },
        { label: i18n.t('46e04a5c.fe0ea1'), value: 'pointsmall_items' },
        { label: i18n.t('62d2fa27.64423b'), value: 'main_category' },
        { label: i18n.t('62d2fa27.2fcd53'), value: 'category' },
        { label: i18n.t('62d2fa27.edf51a'), value: 'history' }
      ],
      value: 'main_category',
      onchange: function (v, self) {
        self.$set(self.value, 'data', {
          id: v == 'price' ? '0,0' : '',
          info: null
        })
        // 浏览记录最大数量为 10，切换时若当前值大于 10 则限制为 10
        if (v === 'history' && (self.value.dataCount == null || self.value.dataCount > 10)) {
          self.$set(self.value, 'dataCount', 10)
        }
      }
    },
    {
      group: i18n.t('62d2fa27.e7af71'),
      label: i18n.t('62d2fa27.e7af71'),
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
      },
      isShow: function () {
        const dataType = this.value && this.value.dataType
        return !['price', 'history'].includes(dataType)
      }
    },
    {
      group: i18n.t('62d2fa27.e7af71'),
      label: i18n.t('62d2fa27.8d8376'),
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
        id: '0,0',
        info: null
      },
      isShow: function () {
        const dataType = this.value && this.value.dataType
        return dataType === 'price'
      }
    },
    {
      group: i18n.t('62d2fa27.e7af71'),
      label: i18n.t('62d2fa27.87dfd7'),
      key: 'dataCount',
      component: function (h, { key }) {
        const maxCount = this.value.dataType === 'history' ? 10 : 99
        return <el-input-number v-model={this.value[key]} size='small' min={1} max={maxCount} />
      },
      value: 4
    },
    {
      group: i18n.t('62d2fa27.6f3360'),
      label: i18n.t('62d2fa27.c20c83'),
      key: 'goodsTitleType',
      component: 'radiobutton',
      options: [
        { name: i18n.t('62d2fa27.ca746b'), label: 'text' },
        { name: i18n.t('62d2fa27.20def7'), label: 'image' }
      ],
      value: 'text'
    },
    {
      group: i18n.t('62d2fa27.6f3360'),
      label: i18n.t('62d2fa27.264fe1'),
      key: 'goodsTitleImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.goodsTitleType === 'image'
      }
    },
    {
      group: i18n.t('62d2fa27.6f3360'),
      label: i18n.t('62d2fa27.eded9e'),
      key: 'goodsTitleText',
      component: 'input',
      value: '',
      isShow: function () {
        return this.value.goodsTitleType === 'text'
      }
    },
    {
      group: i18n.t('62d2fa27.6f3360'),
      label: i18n.t('62d2fa27.94e391'),
      key: 'goodsTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.goodsTitleType === 'text'
      }
    },
    {
      group: i18n.t('62d2fa27.90507a'),
      label: i18n.t('62d2fa27.1711a8'),
      key: 'goodsShowMoreBtn',
      component: 'radiobutton',
      options: [
        { name: i18n.t('62d2fa27.4d775d'), label: true },
        { name: i18n.t('62d2fa27.dce537'), label: false }
      ],
      value: true
    },
    {
      group: i18n.t('62d2fa27.90507a'),
      label: i18n.t('62d2fa27.351201'),
      key: 'goodsMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.goodsShowMoreBtn
      }
    },
    {
      group: i18n.t('62d2fa27.90507a'),
      label: '',
      key: 'goodsMoreLink',
      component: function (h, { key }) {
        return <CompPickerLinkVue v-model={this.value[key]} style='margin-top: 7px;' />
      },
      isShow: function () {
        return this.value.goodsShowMoreBtn
      },
      value: {}
    }
  ],
  transformIn: (v) => {
    const base = v.base || {}
    const transformedBase = transformInBase(base, ['outerMargin', 'innerPadding'])
    const { titleText, titleColor, moreBtn, moreLink, goodsLayout, ...rest } = transformedBase || {}
    // 处理 titleText：可能是对象格式 {type, text, image} 或单独的字段
    let goodsTitleType = 'text'
    let goodsTitleImage = ''
    let goodsTitleText = ''

    if (titleText) {
      if (typeof titleText === 'object' && titleText.type) {
        goodsTitleType = titleText.type || 'text'
        goodsTitleText = titleText.text || ''
        goodsTitleImage = titleText.image || ''
      } else {
        // 兼容旧格式：单独的字段
        goodsTitleText = titleText || ''
      }
    }

    return {
      id: v?.id,
      name: v.name,
      ...rest,
      // 数据设置：保存后回显必须带回 data、dataType、dataCount（data 在顶层，dataType/dataCount 可能在 base 内）
      dataType: v.dataType ?? rest.dataType,
      dataCount: v.dataCount ?? rest.dataCount,
      data: v.data != null ? v.data : { id: '', info: null },
      // 映射标题相关字段
      goodsTitleType,
      goodsTitleImage,
      goodsTitleText,
      goodsTitleColor: titleColor || '#000000',
      // 映射更多按钮相关字段
      goodsShowMoreBtn:
        moreBtn?.show !== undefined ? moreBtn.show : moreBtn !== undefined ? moreBtn : true,
      goodsMoreBtnColor: moreBtn?.color || '#000000',
      goodsMoreLink: moreLink || {},
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
          dataType: 'dataType',
          dataCount: 'dataCount',
          goodsLayout: 'goodsLayout',
          // 映射标题相关字段 - 转换为对象格式
          titleText: (v) => {
            return {
              type: v.goodsTitleType || 'text',
              text: v.goodsTitleText || '',
              image: v.goodsTitleImage || ''
            }
          },
          titleColor: 'goodsTitleColor',
          // 映射更多按钮相关字段 - 转换为对象格式
          moreBtn: (v) => {
            return {
              show: v.goodsShowMoreBtn !== undefined ? v.goodsShowMoreBtn : true,
              color: v.goodsMoreBtnColor || '#000000'
            }
          },
          moreLink: 'goodsMoreLink'
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
