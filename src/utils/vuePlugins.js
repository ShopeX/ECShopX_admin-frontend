/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */
import Vue from 'vue'
import ElementUI from 'element-ui'
Vue.use(ElementUI)
import 'element-ui/lib/theme-chalk/index.css'

import 'es6-promise/auto'

import Directives from '../directives'
Vue.use(Directives)

// import Mock from '../mock'
// Mock.bootstrap()

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
Vue.use(VueVideoPlayer)

import VueHtml5Editor from 'vue-html5-editor'
import { i18n } from '@/i18n'

const getEditorLocale = () => ({
  align: i18n.t('d8872c7d.d5bc35'),
  image: i18n.t('d8872c7d.20def7'),
  list: i18n.t('d8872c7d.371297'),
  link: i18n.t('d8872c7d.bfe68d'),
  unlink: i18n.t('d8872c7d.ef67b1'),
  table: i18n.t('d8872c7d.b339aa'),
  font: i18n.t('d8872c7d.ca746b'),
  'full screen': i18n.t('d8872c7d.185926'),
  text: i18n.t('d8872c7d.3e2aea'),
  eraser: i18n.t('d8872c7d.a468ce'),
  info: i18n.t('d8872c7d.81d9f5'),
  color: i18n.t('d8872c7d.6b36c6'),
  'please enter a url': i18n.t('d8872c7d.6107b3'),
  'create link': i18n.t('d8872c7d.44dfd2'),
  bold: i18n.t('d8872c7d.3b8a43'),
  italic: i18n.t('d8872c7d.33731e'),
  underline: i18n.t('d8872c7d.f6f8ea'),
  'strike through': i18n.t('d8872c7d.a120a8'),
  subscript: i18n.t('d8872c7d.aa6cda'),
  superscript: i18n.t('d8872c7d.dc4c91'),
  heading: i18n.t('d8872c7d.32c65d'),
  'font name': i18n.t('d8872c7d.8456bc'),
  'font size': i18n.t('d8872c7d.93ab99'),
  'left justify': i18n.t('d8872c7d.413f48'),
  'center justify': i18n.t('d8872c7d.0bbc2e'),
  'right justify': i18n.t('d8872c7d.fd8e95'),
  'ordered list': i18n.t('d8872c7d.f4c650'),
  'unordered list': i18n.t('d8872c7d.a9f2ad'),
  'fore color': i18n.t('d8872c7d.ebf245'),
  'background color': i18n.t('d8872c7d.2f97db'),
  'row count': i18n.t('d8872c7d.656800'),
  'column count': i18n.t('d8872c7d.eb22d4'),
  save: i18n.t('d8872c7d.38cf16'),
  upload: i18n.t('d8872c7d.d5a73b'),
  progress: i18n.t('d8872c7d.c7bff7'),
  unknown: i18n.t('d8872c7d.1622dc'),
  'please wait': i18n.t('d8872c7d.a9d25d'),
  error: i18n.t('d8872c7d.7030ff'),
  abort: i18n.t('d8872c7d.d8d7ca'),
  reset: i18n.t('d8872c7d.4b9c32')
})

const options = {
  // 全局组件名称，使用new VueHtml5Editor(options)时该选项无效
  // global component name
  name: 'vue-html5-editor',
  // 是否显示模块名称，开启的话会在工具栏的图标后台直接显示名称
  // if set true,will append module name to toolbar after icon
  showModuleName: false,
  // 自定义各个图标的class，默认使用的是font-awesome提供的图标
  // custom icon class of built-in modules,default using font-awesome
  icons: {
    text: 'iconfont icon-pen',
    color: 'iconfont icon-paint-brush',
    font: 'iconfont icon-font',
    align: 'iconfont icon-align-justify',
    list: 'iconfont icon-list',
    // link: 'iconfont icon-chain',
    // unlink: 'iconfont icon-chain-broken',
    tabulation: 'iconfont icon-table',
    image: 'iconfont icon-file-image-o',
    hr: 'iconfont icon-minus',
    eraser: 'iconfont icon-eraser',
    undo: 'iconfont icon-undo',
    'full-screen': 'iconfont icon-arrows-alt'
    // info: 'iconfont icon-info'
  },
  // 配置图片模块
  // config image module
  image: {
    // 文件最大体积，单位字节  max file size
    sizeLimit: 512 * 1024,
    // 上传参数,默认把图片转为base64而不上传
    // upload config,default null and convert image to base64
    upload: {
      url: null,
      headers: {},
      params: {},
      fieldName: {}
    },
    // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
    // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
    // set null to disable compression
    compress: {
      width: 1600,
      height: 1600,
      quality: 80
    },
    // 响应数据处理,最终返回图片链接
    // handle response data，return image url
    uploadHandler(responseText) {
      // default accept json data like  {ok:false,msg:'unexpected'} or {ok:true,data:'image url'}
      var json = JSON.parse(responseText)
      if (!json.ok) {
        alert(json.msg)
      } else {
        return json.data
      }
    }
  },
  // 语言，跟随项目当前语言
  language: i18n.locale === 'zh-CN' ? 'zh-cn' : i18n.locale === 'ar' ? 'ar' : 'en',
  // 自定义语言（使用项目 i18n）
  i18n: {
    'zh-cn': getEditorLocale(),
    'en': getEditorLocale(),
    'ar': getEditorLocale()
  },
  // 隐藏不想要显示出来的模块
  // the modules you don't want
  hiddenModules: [],
  // 自定义要显示的模块，并控制顺序
  // keep only the modules you want and customize the order.
  // can be used with hiddenModules together
  visibleModules: [
    'text',
    'color',
    'font',
    'align',
    'list',
    // 'image',
    // 'link',
    // 'unlink',
    'tabulation',
    'hr',
    'eraser',
    'undo',
    'full-screen'
    // 'info'
  ],
  // 扩展模块，具体可以参考examples或查看源码
  // extended modules
  modules: {
    // omit,reference to source code of build-in modules
  }
}

// Vue.use(VueHtml5Editor, options)
/* eslint-disable no-new */

import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
