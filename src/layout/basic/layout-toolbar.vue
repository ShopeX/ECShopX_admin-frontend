<template>
  <div class="flex w-full border-b transition-all h-full px-2">
    <SpIcon name="store" :size="20" />
    <SpIcon name="briefcase-business" :size="20" />

    <el-avatar :size="36" :src="accountAvatar" />
  </div>
</template>

<script>
export default {
  name: 'LayoutToolbar',
  computed: {
    accountAvatar() {
      return this.$store.state.user?.accountInfo?.head_portrait
    }
  }
}
</script>

<!-- <script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed } from 'vue'
// import { preferences } from '../../preferences'

const style = computed((): CSSProperties => {
  return {
    height: `${preferences.tabbar.height}px`
  }
})
</script> -->

<style scoped></style>
