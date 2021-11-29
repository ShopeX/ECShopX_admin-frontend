<template>
  <transition name="fade" mode="out-in">
    <storeDefault v-if="template_name === 'yykweishop'"></storeDefault>
    <marketingGroup v-if="template_name !== 'yykweishop'"></marketingGroup>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import storeDefault from '@/view/wxapp/cartremind'
import marketingGroup from '@/view/wxapp/template/marketing/group'

export default {
  data() {
    return {
      activeIndex: '',
      currentCode: '',
      wxapps: []
    }
  },
  components: {
    storeDefault: storeDefault,
    marketingGroup: marketingGroup
  },
  computed: {
    ...mapGetters(['template_name'])
  }
}
</script>
