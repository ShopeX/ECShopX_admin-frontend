<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="unbind-box section-white content-padded">
    <div class="content-center">
      <p>{{ $t('70d7a0e0.a997a9') }}</p>
      <el-button type="primary" @click="toBind"> {{ $t('70d7a0e0.d4594e') }} </el-button>
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
    getWechatPreAuthUrl(params).then((response) => {
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
