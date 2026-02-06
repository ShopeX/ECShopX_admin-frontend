import { pickBy } from '@/utils'
import AttrDataVue from '../../comps/goods-attr/attr-data.vue'
import CompPickerLinkVue from '../../comps/comp-pickerLink.vue'
import SpImagePicker from '@/components/sp-image-picker/index.vue'

import { transformInBase, createTransformOutBase } from '../../comps/transform-utils'

const config = {
  name: 'goods',
  setting: [
    {
      group: '数据设置',
      label: '数据类型',
      key: 'dataType',
      component: 'select',
      placeholder: '请选择数据类型',
      options: [
        { label: '按价格区间', value: 'price' },
        { label: '按指定商品', value: 'items' },
        { label: '按管理分类', value: 'main_category' },
        { label: '按销售分类', value: 'category' },
        { label: '按浏览记录', value: 'history' }
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
      },
      isShow: function () {
        return !['price', 'history'].includes(this.value.dataType)
      }
    },
    {
      group: '数据设置',
      label: '价格区间',
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
        return ['price'].includes(this.value.dataType)
      }
    },
    {
      group: '数据设置',
      label: '数据数量',
      key: 'dataCount',
      component: function (h, { key }) {
        const maxCount = this.value.dataType === 'history' ? 10 : 99
        return <el-input-number v-model={this.value[key]} size='small' min={1} max={maxCount} />
      },
      value: 4
    },
    {
      group: '组件标题',
      label: '标题类型',
      key: 'goodsTitleType',
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
      group: '组件标题',
      label: '标题文字',
      key: 'goodsTitleText',
      component: 'input',
      value: '',
      isShow: function () {
        return this.value.goodsTitleType === 'text'
      }
    },
    {
      group: '组件标题',
      label: '标题颜色',
      key: 'goodsTitleColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.goodsTitleType === 'text'
      }
    },
    {
      group: '更多按钮',
      label: '展示类型',
      key: 'goodsShowMoreBtn',
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
      key: 'goodsMoreBtnColor',
      component: 'color',
      value: '#000000',
      isShow: function () {
        return this.value.goodsShowMoreBtn
      }
    },
    {
      group: '更多按钮',
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
