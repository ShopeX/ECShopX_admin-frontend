<template>
  <transition name="fade" mode="out-in">
    <storeDefault v-if="template_name === 'yykweishop'" />
    <marketingGroup v-if="template_name !== 'yykweishop'" />
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import storeDefault from '@/view/wxapp/cartremind'
import marketingGroup from '@/view/wxapp/template/marketing/group'

export default {
  components: {
    storeDefault: storeDefault,
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
    ...mapGetters(['template_name'])
  }
}
</script>
