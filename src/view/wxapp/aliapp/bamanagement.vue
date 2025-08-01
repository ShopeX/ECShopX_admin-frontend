<template>
  <transition name="fade" mode="out-in">
    <storeDefault v-if="template_name === 'yykmembership'" />
    <storeSport v-if="template_name === 'yykmendian'" />
    <storeUniversal v-if="template_name === 'yykuniversal'" />
    <mallBaDefault v-if="template_name === 'yykweishop'" />
    <appleBaDefault v-if="template_name === 'appleweishop'" />
    <marketingCard v-if="template_name === 'marketingCard'" />
    <marketingGroup v-if="template_name === 'yykcutdown'" />
    <mallCommunity v-if="template_name === 'yykcommunity'" />
    <communityManagement v-if="template_name === 'yykcommunitypms'" />
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWxaAuthList } from '../../../api/wxa'
// store
import storeDefault from '@/view/wxapp/template/store/default'
import storeSport from '@/view/wxapp/template/store/sport'
import storeUniversal from '@/view/wxapp/template/store/universal'

// mall
import mallDefault from '@/view/wxapp/template/mall/default'
import mallCommunity from '@/view/wxapp/template/mall/community'
import communityManagement from '@/view/wxapp/template/mall/community_management'
import mallBaDefault from '@/view/wxapp/template/mall/baDefault'

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
    mallBaDefault: mallBaDefault,
    communityManagement: communityManagement,
    marketingCard: marketingCard,
    marketingGroup: marketingGroup
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
  },
  methods: {
    chooseTemp() {
      this.$router.push({ path: this.matchInternalRoute('wxapp_templ') })
    }
  }
}
</script>
