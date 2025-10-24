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
  <!-- <transition
    name="fade"
    mode="out-in"
  > -->
  <div>
    <SpPlatformTip v-if="!VERSION_SHUYUN" h5 app alipay />
    <!-- <storeDefault v-if="template_name === 'yykmembership'"></storeDefault>
    <storeSport v-if="template_name === 'yykmendian'"></storeSport>
    <storeUniversal v-if="template_name === 'yykuniversal'"></storeUniversal> -->
    <mallDefault />
  </div>
  <!-- <appleBaDefault v-if="template_name === 'appleweishop'"></appleBaDefault>
    <marketingCard v-if="template_name === 'marketingCard'"></marketingCard>
    <marketingGroup v-if="template_name === 'yykcutdown'"></marketingGroup>
    <mallCommunity v-if="template_name === 'yykcommunity'"></mallCommunity>
    <communityManagement v-if="template_name === 'yykcommunitypms'"></communityManagement> -->
  <!-- </transition> -->
</template>

<script>
import { mapGetters } from 'vuex'
import { getWxaAuthList } from '../../api/wxa'
// store
import storeDefault from '@/view/wxapp/template/store/default'
import storeSport from '@/view/wxapp/template/store/sport'
import storeUniversal from '@/view/wxapp/template/store/universal'

// mall
import mallDefault from '@/view/wxapp/template/mall/default'
import mallCommunity from '@/view/wxapp/template/mall/community'
import communityManagement from '@/view/wxapp/template/mall/community_management'

//apple
import appleBaDefault from '@/view/wxapp/template/apple/default'

// marketing
import marketingCard from '@/view/wxapp/template/marketing/card'
import marketingGroup from '@/view/wxapp/template/marketing/group'

export default {
  components: {
    storeDefault: storeDefault,
    storeSport: storeSport,
    storeUniversal: storeUniversal,
    mallDefault: mallDefault,
    mallCommunity: mallCommunity,
    communityManagement: communityManagement,
    marketingCard: marketingCard,
    marketingGroup: marketingGroup,
    appleBaDefault: appleBaDefault
  },
  data() {
    return {
      activeIndex: '',
      currentCode: '',
      wxapps: []
    }
  },
  computed: {
    ...mapGetters(['wxapp_id', 'template_name'])
  },
  methods: {
    chooseTemp() {
      this.$router.push({ path: this.matchInternalRoute('wxapp_templ') })
    },
    mounted() {
      if (this.active) {
        this.activeIndex = this.active
      }
      if (this.$route.query.wxappid !== undefined) {
        this.$store.dispatch('setWxappId', this.$route.query.wxappid)
      }
      if (this.$route.query.templatename) {
        this.$store.dispatch('setTemplateName', this.$route.query.templatename)
      }
    }
  }
}
</script>
