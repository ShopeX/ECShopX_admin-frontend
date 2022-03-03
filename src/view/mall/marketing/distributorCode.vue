<template>
  <div>
    <div class="content-center" v-if="wxaCodeImage">
      <el-row>
        <el-col>
          <img :src="wxaCodeImage" />
        </el-col>
        <el-col>
          <el-button type="primary" @click="downDistributorCode"
            >下载<i class="el-icon-download el-icon--right"></i
          ></el-button>
        </el-col>
      </el-row>
    </div>
  </div>
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
  methods: {
    downDistributorCode() {
      var a = document.createElement('a')
      var temp = '微商城'
      a.href = this.wxaCodeImage
      a.download = temp + '.png'
      a.click()
    }
  },
  mounted() {
    let params = { template_name: 'yykweishop', codetype: 'store' }
    getWxaDristributorCodeStream(params).then((response) => {
      this.wxaCodeImage = response.data.data.base64Image
      this.name = '微商城'
    })
  }
}
</script>
