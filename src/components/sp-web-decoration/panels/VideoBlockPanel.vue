<template>
  <div class="space-y-4 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">视频</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <VideoPicker v-model="localValue.videoUrl" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">视频封面</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker v-model="localValue.posterUrl" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">移动视频</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <VideoPicker v-model="localValue.mobileVideoUrl" />
      </div>
    </section>
  </div>
</template>

<script>
import SpImagePicker from '@/components/sp-image-picker/index.vue'
import VideoPicker from '@/components/sp-picker-plus/VideoPicker.vue'

export default {
  name: 'VideoBlockPanel',
  components: {
    SpImagePicker,
    VideoPicker
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    localValue() {
      return this.value
    }
  }
}
</script>
