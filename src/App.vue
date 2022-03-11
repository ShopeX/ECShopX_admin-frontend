<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      throttleTimer: null
    }
  },
  computed: {
    ...mapGetters(['isInFrame'])
  },
  methods: {}
}
</script>

<style lang="scss"></style>
