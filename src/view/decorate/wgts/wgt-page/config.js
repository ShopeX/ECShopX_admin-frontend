/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import { pickBy, isObject } from '@/utils'
import AttrItem from './attr-item'
import AttrFunctionArea from './attr-function-area'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const scene = urlParams.get('scene') || '1001'

const config = {
  name: 'page',
  setting: [
    {
      group: '风格设置',
      label: '沉浸式页头',
      key: 'isImmersive',
      component: 'switch',
      value: false
    },
    {
      group: '页头设置',
      label: '页头背景',
      key: 'newNavigateStyle',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#fff',
        image: ''
      }
    },
    {
      group: '风格设置',
      label: '页头标题区',
      key: 'titleStyle',
      component: 'radiobutton',
      options: [
        { name: '不展示', label: '0' },
        { name: '搜索', label: '3' },
        { name: '页面名称', label: '1' },
        { name: '图片', label: '2' }
      ],
      value: '1'
    },
    {
      group: '标题设置',
      label: '标题颜色',
      key: 'titleColor',
      component: 'color',
      value: '#000',
      isShow: function () {
        return this.value.titleStyle == '1' // 只在"页面名称"时显示
      },
      tip: '页面标题文字请在管理后台装修-商城信息中填写。'
    },
    {
      group: '标题设置',
      label: '',
      key: 'titleBackgroundImage',
      component: function (h, { key }) {
        return <SpImagePicker v-model={this.value[key]} size='small' />
      },
      value: '',
      isShow: function () {
        return this.value.titleStyle == '2'
      },
      tip: '建议尺寸：340 * 70 像素'
    },
    {
      group: '标题设置',
      label: '展示搜索按钮',
      key: 'showSearchButton',
      component: 'switch',
      value: true,
      isShow: function () {
        return this.value.titleStyle == '3' // 只在"搜索"时显示
      }
    },
    {
      group: '标题设置',
      label: '按钮颜色',
      key: 'searchButtonColor',
      component: function (h, { key }) {
        const vm = this
        // 确保 searchButtonColor 对象存在
        if (!vm.value[key]) {
          vm.$set(vm.value, key, { bgColor: '#000000', textColor: '#FFFFFF' })
        }
        const bgColor = vm.value[key].bgColor
        const textColor = vm.value[key].textColor

        return (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
            >
              <span style={{ fontSize: '12px', color: '#999' }}>底色</span>
              <el-color-picker
                value={bgColor}
                size='small'
                onChange={(color) => {
                  if (!vm.value[key]) {
                    vm.$set(vm.value, key, {})
                  }
                  vm.$set(vm.value[key], 'bgColor', color)
                }}
              />
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}
            >
              <span style={{ fontSize: '12px', color: '#999' }}>文字</span>
              <el-color-picker
                value={textColor}
                size='small'
                onChange={(color) => {
                  if (!vm.value[key]) {
                    vm.$set(vm.value, key, {})
                  }
                  vm.$set(vm.value[key], 'textColor', color)
                }}
              />
            </div>
          </div>
        )
      },
      value: {
        bgColor: '#FF6B35',
        textColor: '#FFFFFF'
      },
      isShow: function () {
        return this.value.titleStyle == '3' && this.value.showSearchButton // 只在"搜索"且"展示搜索按钮"开启时显示
      }
    },
    {
      group: '风格设置',
      label: '页头功能区',
      key: 'pTitleHotSetting',
      component: function (h, { key }) {
        return <AttrFunctionArea v-model={this.value[key]} />
      },
      isShow: function () {
        return this.value.titleStyle != '0'
      },
      value: {
        type: 'hotzone',
        hotzone: { imgUrl: '', data: [] }
      },
      tip: scene != '1001' ? '建议尺寸：138 * 65 像素' : '建议尺寸：174 * 64 像素'
    },
    {
      group: '风格设置',
      label: '页面背景',
      key: 'newPageBackgroundStyle',
      component: function (h, { key }) {
        return <AttrItem v-model={this.value[key]} />
      },
      value: {
        color: '#f5f5f5',
        image: ''
      },
      tip: '背景图宽度为100%，高度自适应'
    }
    // {
    //   label: '',
    //   key: 'pageBackgroundColor',
    //   component: 'color',
    //   value: '#f5f5f5',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '1'
    //   }
    // },
    // {
    //   label: '',
    //   key: 'pageBackgroundImage',
    //   component: function (h, { key }) {
    //     return <SpImagePicker v-model={this.value[key]} size='small' />
    //   },
    //   value: '',
    //   isShow: function () {
    //     return this.value.pageBackgroundStyle == '2'
    //   }
    // },
  ],
  transformIn: (v) => {
    const { name, base, track, tagsType, meber_tags, no_meber_tags } = v
    let {
      navigateStyle,
      navigateBackgroundColor,
      navigateBackgroundImage,
      titleStyle,
      titleColor,
      titleBackgroundImage,
      titlePosition,
      pageBackgroundStyle,
      pageBackgroundColor,
      pageBackgroundImage,
      pTitleHotSetting = { imgUrl: '', data: [] },
      isImmersive,
      showSearchButton,
      searchButtonColor
    } = base || {}

    // 兼容旧数据格式：如果 pTitleHotSetting 直接是热区图对象，转换为新格式
    if (pTitleHotSetting && pTitleHotSetting.imgUrl !== undefined && !pTitleHotSetting.type) {
      pTitleHotSetting = {
        type: 'hotzone',
        hotzone: pTitleHotSetting
      }
    } else if (!pTitleHotSetting || !pTitleHotSetting.type) {
      pTitleHotSetting = {
        type: 'hotzone',
        hotzone: { imgUrl: '', data: [] }
      }
    }
    if (isObject(navigateBackgroundImage)) {
      const { url } = newNavigateStyle?.image
      navigateBackgroundImage = url
    }
    if (isObject(titleBackgroundImage)) {
      const { url } = titleBackgroundImage
      titleBackgroundImage = url
    }

    if (isObject(pageBackgroundImage)) {
      const { url } = newPageBackgroundStyle?.image
      pageBackgroundImage = url
    }

    const newNavigateStyle = {
      color: navigateBackgroundColor,
      image: navigateBackgroundImage
    }
    const newPageBackgroundStyle = {
      color: pageBackgroundColor,
      image: pageBackgroundImage
    }
    return {
      id: v?.id,
      name,
      ...base,
      navigateStyle, // 兼容旧版本
      titleStyle,
      titleColor,
      titleBackgroundImage,
      titlePosition, // 兼容旧版本
      pageBackgroundStyle, // 兼容旧版本
      pageBackgroundImage,
      newNavigateStyle,
      newPageBackgroundStyle,
      pTitleHotSetting,
      isImmersive,
      showSearchButton: showSearchButton !== undefined ? showSearchButton : true,
      searchButtonColor,
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
          navigateStyle: 'navigateStyle',
          navigateBackgroundColor: 'newNavigateStyle.color',
          navigateBackgroundImage: 'newNavigateStyle.image',
          titleStyle: 'titleStyle',
          titleColor: 'titleColor',
          titleBackgroundImage: 'titleBackgroundImage',
          titlePosition: 'titlePosition',
          showSearchButton: 'showSearchButton',
          searchButtonColor: 'searchButtonColor',
          pageBackgroundStyle: 'pageBackgroundStyle',
          pageBackgroundColor: 'newPageBackgroundStyle.color',
          pageBackgroundImage: 'newPageBackgroundStyle.image',
          isImmersive: 'isImmersive',
          pTitleHotSetting: 'pTitleHotSetting'
        })
      },
      track: 'track',
      tags: 'tags',
      tagsType: 'tags.type',
      meber_tags: 'tags.meber_tags',
      no_meber_tags: 'tags.no_meber_tags'
    })
  }
}

export default config
