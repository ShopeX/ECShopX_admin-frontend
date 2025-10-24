<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <SpPage>
    <div v-if="wxaCodeImage" class="content-center">
      <el-row>
        <el-col>
          <img :src="wxaCodeImage">
        </el-col>
        <el-col>
          <el-button type="primary" @click="downDistributorCode">
            下载<i class="el-icon-download el-icon--right" />
          </el-button>
        </el-col>
      </el-row>
    </div>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getWxaDristributorCodeStream } from '@/api/marketing'
export default {
  data() {
    return {
      wxaCodeImage: '',
      name: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    let params = { template_name: 'yykweishop', codetype: 'store' }
    getWxaDristributorCodeStream(params).then(response => {
      this.wxaCodeImage = response.data.data.base64Image
      this.name = '微商城'
    })
  },
  methods: {
    downDistributorCode() {
      var a = document.createElement('a')
      var temp = '微商城'
      a.href = this.wxaCodeImage
      a.download = temp + '.png'
      a.click()
    }
  }
}
</script>
