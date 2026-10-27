<template>
  <div class="space-y-4 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('94f92572.61e5e3') }}</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker :value="settings.pc_image" @input="updateField('pc_image', $event)" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('94f92572.a761f4') }}</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <SpImagePicker :value="settings.mobile_image" @input="updateField('mobile_image', $event)" />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">跳转路径</div>
      <div class="rounded-xl border border-border bg-card p-3">
        <CompPickerLink
          :value="settings.link || {}"
          platform="web"
          :show-tracking-params="false"
          @change="updateLink"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import SpImagePicker from '@/components/sp-image-picker/index.vue'
import CompPickerLink from '@/view/decorate/comps/comp-pickerLink.vue'
import { normalizeTypedBlockSettings } from '../utils/panelState.js'

function normalizeLink(link = {}) {
  const next = cloneDeep(link)
  delete next.trackingParams
  return next
}

export default {
  name: 'ImageBlockPanel',
  components: {
    SpImagePicker,
    CompPickerLink
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    settings() {
      return normalizeTypedBlockSettings('image', this.value)
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    },
    updateLink(value) {
      this.updateField('link', normalizeLink(value))
    }
  }
}
</script>
