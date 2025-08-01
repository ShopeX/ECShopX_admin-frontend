<template>
  <div class="unbind-box section-white content-padded">
    <div class="content-center">
      <p>您尚未绑定认证服务号，无法使用该功能。</p>
      <el-button type="primary" @click="toBind"> 去绑定 </el-button>
    </div>
  </div>
</template>
<script>
import { getWechatPreAuthUrl } from '../../../api/wechat'
export default {
  data() {
    return {
      url: ''
    }
  },
  mounted() {
    let params = {
      callback_url: this.wxAuthCallbackUrl + 'auth/woa'
    }
    getWechatPreAuthUrl(params).then(response => {
      this.url = response.data.data.url
    })
  },
  methods: {
    toBind() {
      for (var i = 0; i < metadata.length; i++) {
        if (metadata[i]['name'] == 'referrer') {
          metadata[i]['content'] = 'default'
        }
      }
      window.open(this.url, '_blank')
    }
  }
}
</script>
<style scoped lang="scss">
.unbind-box {
  height: 600px;
  > div {
    margin-top: 220px;
    > p {
      margin-bottom: 10px;
    }
  }
}
</style>
