<template>
  <div id="app">
    <!-- SVG Sprite 容器 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="position: absolute; width: 0; height: 0"
    >
      <defs />
    </svg>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { useTheme } from '@/composables'
import Config from '@/config'
export default {
  data() {
    return {
      throttleTimer: null
    }
  },
  computed: {
    ...mapGetters(['isInFrame'])
  },
  mounted() {
    const { updateThemeColor } = useTheme()
    updateThemeColor()

    document.title = Config.systemTitle
  },
  methods: {}
}
</script>

<style lang="scss"></style>
