<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <!-- <storeDefault v-if="ali_template_name === 'yykmembership'"></storeDefault>
    <storeSport v-if="ali_template_name === 'yykmendian'"></storeSport>
    <storeUniversal v-if="ali_template_name === 'yykuniversal'"></storeUniversal> -->
    <mallDefault v-if="ali_template_name === 'onexshop'" />
    <!-- <appleBaDefault v-if="ali_template_name === 'appleweishop'"></appleBaDefault>
    <marketingCard v-if="ali_template_name === 'marketingCard'"></marketingCard>
    <marketingGroup v-if="ali_template_name === 'yykcutdown'"></marketingGroup>
    <mallCommunity v-if="ali_template_name === 'yykcommunity'"></mallCommunity>
    <communityManagement v-if="ali_template_name === 'yykcommunitypms'"></communityManagement> -->
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWxaAuthList } from '../../../api/wxa'
// store
import storeDefault from '@/view/wxapp/aliapp/template/store/default'
import storeSport from '@/view/wxapp/aliapp/template/store/sport'
import storeUniversal from '@/view/wxapp/aliapp/template/store/universal'

// mall
import mallDefault from '@/view/wxapp/aliapp/template/mall/default'
import mallCommunity from '@/view/wxapp/aliapp/template/mall/community'
import communityManagement from '@/view/wxapp/aliapp/template/mall/community_management'

//apple
import appleBaDefault from '@/view/wxapp/aliapp/template/apple/default'

// marketing
import marketingCard from '@/view/wxapp/aliapp/template/marketing/card'
import marketingGroup from '@/view/wxapp/aliapp/template/marketing/group'

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
  data () {
    return {
      activeIndex: '',
      currentCode: '',
      wxapps: [],
      template_name: ''
    }
  },
  computed: {
    ...mapGetters(['ali_appid', 'ali_template_name'])
  },
  methods: {
    // this.template_name = ali_template_name
    chooseTemp () {
      console.log('🚀   this.active', this.active)

      this.$router.push({ path: this.matchInternalRoute('wxapp_templ') })
    },
    mounted () {
      console.log('🚀   this.active', this.active)
      if (this.active) {
        this.activeIndex = this.active
      }
      if (this.$route.query.aliappid !== undefined) {
        console.log('🚀   this.$route.query.aliappid', this.$route.query.aliappid)
        this.$store.dispatch('setALiAppid', this.$route.query.aliappid)
      }
      if (this.$route.query.templatename) {
        console.log('🚀   this.$route.query.templatename', this.$route.query.templatename)
        this.$store.dispatch('setALiTemplateName', this.$route.query.templatename)
      }
    }
  }
}
</script>
