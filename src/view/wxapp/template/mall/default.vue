<template>
  <div>
    <MallList v-if="store" :rel-store="store" />
  </div>
</template>

<script>
import MallList from '@/components/function/mallList'
import { mapGetters } from 'vuex'
import { getParamByTempName } from '@/api/wxa'
export default {
  components: {
    MallList
  },
  computed: {
    ...mapGetters(['template_name'])
  },
  data() {
    return {
      store: null
    }
  },
  mounted() {
    this.store = { id: '0' }
    let params = { template_name: this.template_name, version: 'v1.0.1', page_name: 'color_style' }
    getParamByTempName(params).then((res) => {
      console.log(res, '-----')
      if (res.data.data.list.length !== 0) {
        this.$store.dispatch('setThemeColor', res.data.data.list[0].params.data[0])
      }
    })
  }
}
</script>
