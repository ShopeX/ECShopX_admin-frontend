<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.sp-rich-text {
  .vue-html5-editor {
    width: 100%;

    .content {
      min-height: initial;
      max-height: 500px;
    }
  }
  .ecx-icon {
    font-size: 18px;
    color: #666;
  }
}
</style>
<template>
  <div class="sp-rich-text">
    <component v-if="Editor" :is="Editor" :content="value" @change="updateData" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueHtml5Editor from 'vue-html5-editor'

function getOptions(t) {
  return {
    name: 'vue-html5-editor',
    showModuleName: false,
    icons: {
      text: 'ecx-icon icon-paiban',
      color: 'ecx-icon icon-yanse',
      font: 'ecx-icon icon-ziti',
      align: 'ecx-icon icon-duiqifangshi',
      list: 'ecx-icon icon-xuliebiao',
      tabulation: 'ecx-icon icon-biaoge',
      hr: 'ecx-icon icon-fengexian',
      eraser: 'ecx-icon icon-eraser',
      undo: 'ecx-icon icon-chehui1'
    },
    image: {
      sizeLimit: 512 * 1024,
      upload: {
        url: null,
        headers: {},
        params: {},
        fieldName: {}
      },
      compress: {
        width: 1600,
        height: 1600,
        quality: 80
      },
      uploadHandler(responseText) {
        var json = JSON.parse(responseText)
        if (!json.ok) {
          alert(json.msg)
        } else {
          return json.data
        }
      }
    },
    language: 'zh-cn',
    i18n: {
      'zh-cn': {
        align: t('d6124b35.d5bc35'),
        image: t('d6124b35.20def7'),
        list: t('d6124b35.371297'),
        link: t('d6124b35.bfe68d'),
        unlink: t('d6124b35.ef67b1'),
        table: t('d6124b35.b339aa'),
        font: t('d6124b35.ca746b'),
        'full screen': t('d6124b35.185926'),
        text: t('d6124b35.3e2aea'),
        eraser: t('d6124b35.a468ce'),
        info: t('d6124b35.81d9f5'),
        color: t('d6124b35.6b36c6'),
        'please enter a url': t('d6124b35.6107b3'),
        'create link': t('d6124b35.44dfd2'),
        bold: t('d6124b35.3b8a43'),
        italic: t('d6124b35.33731e'),
        underline: t('d6124b35.f6f8ea'),
        'strike through': t('d6124b35.a120a8'),
        subscript: t('d6124b35.aa6cda'),
        superscript: t('d6124b35.dc4c91'),
        heading: t('d6124b35.32c65d'),
        'font name': t('d6124b35.8456bc'),
        'font size': t('d6124b35.93ab99'),
        'left justify': t('d6124b35.413f48'),
        'center justify': t('d6124b35.0bbc2e'),
        'right justify': t('d6124b35.fd8e95'),
        'ordered list': t('d6124b35.f4c650'),
        'unordered list': t('d6124b35.a9f2ad'),
        'fore color': t('d6124b35.ebf245'),
        'background color': t('d6124b35.2f97db'),
        'row count': t('d6124b35.656800'),
        'column count': t('d6124b35.eb22d4'),
        save: t('d6124b35.38cf16'),
        upload: t('d6124b35.d5a73b'),
        progress: t('d6124b35.c7bff7'),
        unknown: t('d6124b35.1622dc'),
        'please wait': t('d6124b35.a9d25d'),
        error: t('d6124b35.7030ff'),
        abort: t('d6124b35.d8d7ca'),
        reset: t('d6124b35.4b9c32')
      }
    },
    hiddenModules: [],
    visibleModules: [
      'text',
      'color',
      'font',
      'align',
      'list',
      'tabulation',
      'hr',
      'undo',
      'uploader'
    ],
    modules: [
      {
        icon: 'ecx-icon icon-tupian',
        name: 'uploader',
        dashboard: {
          template:
            '<div><el-button @click="onUpload">' + t('d6124b35.6bfb9b') + '</el-button></div>',
          data: function () {
            return {
              imgUrl: ''
            }
          },
          methods: {
            async onUpload() {
              // 必须从当前实例的 $root 取 $picker，避免 Vue.prototype.$picker 导致 parent 非组件实例引发 initLifecycle 报错
              const { data } = await this.$root.$picker.image({
                multiple: true
              })
              let imgHtml = ''
              data.forEach(({ url }) => {
                imgHtml += `<img src="${url}" style='display: block;'/>`
              })
              this.$parent.execCommand('insertHTML', imgHtml)
            }
          }
        }
      }
    ]
  }
}

export default {
  name: 'SpRichText',
  components: {},
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Editor: null
    }
  },
  created() {
    const t = this.$t.bind(this)
    this.Editor = new VueHtml5Editor(getOptions(t))
  },
  methods: {
    updateData(e) {
      this.$emit('input', e)
      this.$emit('change', e)
    }
  }
}
</script>
