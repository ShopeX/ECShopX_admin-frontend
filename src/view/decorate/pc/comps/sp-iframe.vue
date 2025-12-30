<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <iframe
    ref="iframe_template"
    class="website-iframe"
    width="100%"
    height="100%"
    style="border: none; overflow: auto"
    :src="iframeSrc"
    @load="handleIframeLoaded"
  />
</template>

<script>
import PostMessage from '../postmessage'
export default {
  props: {
    mode: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      baseUrl: '',
      proxyPath: '/website/decorate'
      // proxyPath:'',
      // pathQuery: { type: 'edit' }
    }
  },
  computed: {
    iframeSrc: function () {
      return this.baseUrl + this.proxyPath + `?type=edit.${this.mode}`
    }
  },
  destroyed() {
    this.postmessage.removeMessage()
  },
  mounted() {
    this.postmessage = new PostMessage('*')
    this.postmessage.onMessage(event => {
      this.$emit('message', event.data)
    })
    // 设置窗口大小改变时的事件监听
    window.onresize = () => {
      this.setIframeSize()
    }
  },
  methods: {
    // 设置初始大小
    setIframeSize() {
      const wind = this.$refs.iframe_template
      wind.style.width = '80%'
      wind.style.position = 'absolute'
      wind.style.transform = 'translateX(-50%)'
      wind.style.left = '50%'
      wind.style.top = '0'
      wind.style.height = '100%'
    },

    post({ action, payload }) {
      this.postmessage.post({ action, payload })
    },
    handleIframeLoaded() {
      const wind = this.$refs.iframe_template.contentWindow
      this.postmessage.setPostWind(wind)
      this.setIframeSize()
      this.$emit('ready', wind)
    }
  }
}
</script>

<style lang="scss" scoped>
.website-iframe {
  .page-template {
    padding: 20px 50px;
    background-color: #f6f7f9;
  }
}
</style>
