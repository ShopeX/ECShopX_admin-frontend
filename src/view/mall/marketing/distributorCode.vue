<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
            {{ $t('c4465f73.f26ef9') }}<i class="el-icon-download el-icon--right" />
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
    getWxaDristributorCodeStream(params).then((response) => {
      this.wxaCodeImage = response.data.data.base64Image
      this.name = this.$t('c4465f73.d1ca1e')
    })
  },
  methods: {
    downDistributorCode() {
      var a = document.createElement('a')
      var temp = this.$t('c4465f73.d1ca1e')
      a.href = this.wxaCodeImage
      a.download = temp + '.png'
      a.click()
    }
  }
}
</script>
