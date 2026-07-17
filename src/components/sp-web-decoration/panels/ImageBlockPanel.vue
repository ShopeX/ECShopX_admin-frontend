<template>
  <div class="space-y-4 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('94f92572.61e5e3') }}</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker v-model="localValue.pc_image" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('94f92572.a761f4') }}</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker v-model="localValue.mobile_image" />
      </div>
    </section>
  </div>
</template>

<script>
import SpImagePicker from '@/components/sp-image-picker/index.vue'

export default {
  name: 'ImageBlockPanel',
  components: {
    SpImagePicker
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
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    }
  }
}
</script>
