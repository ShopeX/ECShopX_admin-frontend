<template>
  <div class="image-hotspot-editor">
    <div class="mb-3 flex items-center justify-between gap-3">
      <el-radio-group v-model="activeDevice" size="small">
        <el-radio-button label="pc">{{ $t('de39c0e5.07a426') }}</el-radio-button>
        <el-radio-button label="mobile">{{ $t('de39c0e5.c95e74') }}</el-radio-button>
      </el-radio-group>
      <div class="text-xs text-muted-foreground">
        {{ $t('de39c0e5.b18955') }} {{ activeHotspots.length }} {{ $t('de39c0e5.c9ac7e') }}
      </div>
    </div>

    <div class="grid grid-cols-[minmax(0,1fr)_320px] gap-4">
      <div class="min-h-[420px] rounded-xl border border-border bg-background-deep p-3">
        <div v-if="activeImage" class="image-hotspot-editor__canvas">
          <hotzone
            :key="`${activeDevice}-${hotzoneKey}`"
            class="hotzone"
            :image="activeImage"
            :zones-init="hotzoneZones"
            @change="handleChangeHotspots"
          />
        </div>
        <div
          v-else
          class="flex h-[420px] items-center justify-center rounded-lg border border-dashed border-border bg-card text-sm text-muted-foreground"
        >
          {{ $t('de39c0e5.ce5e19') }}{{ activeDeviceImageLabel }}
        </div>
      </div>

      <div class="min-h-[420px] rounded-xl border border-border bg-card p-3">
        <div class="mb-3 text-[13px] font-semibold text-foreground">
          {{ $t('de39c0e5.6e52f6') }}
        </div>
        <div v-if="activeHotspots.length" class="space-y-3">
          <div
            v-for="(hotspot, index) in activeHotspots"
            :key="hotspot.id || index"
            class="rounded-lg border border-border bg-background p-3"
          >
            <div class="mb-2 flex items-center justify-between gap-2">
              <span class="text-xs font-medium text-foreground">
                {{ $t('de39c0e5.50da72') }} {{ index + 1 }}
              </span>
              <el-button type="text" class="!p-0 !text-xs" @click="removeHotspot(index)">
                {{ $t('de39c0e5.2f4aad') }}
              </el-button>
            </div>
            <CompPickerLink
              :value="hotspot.link || {}"
              :show-tracking-params="false"
              @change="(value) => updateHotspotLink(index, value)"
            />
          </div>
        </div>
        <div
          v-else
          class="flex h-[360px] items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground"
        >
          {{ $t('de39c0e5.1bfed3') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hotzone from 'vue-hotzone'
import { cloneDeep } from 'lodash'
import CompPickerLink from '@/view/decorate/comps/comp-pickerLink.vue'

function createHotspot() {
  return {
    id: `hotspot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    rect: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    },
    link: {
      linkType: 0,
      linkUrl: '',
      linkPage: '',
      id: '',
      title: ''
    }
  }
}

function toHotzoneRatio(value) {
  const numberValue = Number(value) || 0
  return numberValue > 1 ? numberValue / 100 : numberValue
}

function normalizeRect(rect = {}) {
  return {
    x: toHotzoneRatio(rect.x !== undefined ? rect.x : rect.leftPer),
    y: toHotzoneRatio(rect.y !== undefined ? rect.y : rect.topPer),
    width: toHotzoneRatio(rect.width !== undefined ? rect.width : rect.widthPer),
    height: toHotzoneRatio(rect.height !== undefined ? rect.height : rect.heightPer)
  }
}

function normalizeLink(link = {}) {
  const next = cloneDeep(link)
  delete next.trackingParams
  return next
}

function normalizeHotspots(value) {
  return Array.isArray(value)
    ? value.map((item) => ({
        ...createHotspot(),
        ...cloneDeep(item),
        rect: normalizeRect(item?.rect || item),
        link: normalizeLink(
          item?.link || {
            linkType: item?.linkType !== undefined ? item.linkType : 0,
            linkUrl: item?.linkUrl || '',
            linkPage: item?.linkPage || '',
            id: item?.id || '',
            title: item?.title || ''
          }
        )
      }))
    : []
}

export default {
  name: 'ImageHotspotEditorDialog',
  components: {
    hotzone,
    CompPickerLink
  },
  props: {
    settings: {
      type: Object,
      default: () => ({})
    },
    initialDevice: {
      type: String,
      default: 'pc'
    }
  },
  data() {
    return {
      activeDevice: this.initialDevice === 'mobile' ? 'mobile' : 'pc',
      hotzoneKey: 0,
      localSettings: {
        ...cloneDeep(this.settings),
        pc_hotspots: normalizeHotspots(this.settings.pc_hotspots),
        mobile_hotspots: normalizeHotspots(this.settings.mobile_hotspots)
      }
    }
  },
  computed: {
    activeImage() {
      return this.activeDevice === 'pc'
        ? this.localSettings.pc_image
        : this.localSettings.mobile_image
    },
    activeHotspotKey() {
      return this.activeDevice === 'pc' ? 'pc_hotspots' : 'mobile_hotspots'
    },
    activeHotspots() {
      return this.localSettings[this.activeHotspotKey] || []
    },
    activeDeviceImageLabel() {
      return this.activeDevice === 'pc'
        ? this.$t('de39c0e5.61e5e3')
        : this.$t('de39c0e5.a761f4')
    },
    hotzoneZones() {
      return this.activeHotspots.map((item) => ({
        leftPer: toHotzoneRatio(item.rect?.x),
        topPer: toHotzoneRatio(item.rect?.y),
        widthPer: toHotzoneRatio(item.rect?.width),
        heightPer: toHotzoneRatio(item.rect?.height)
      }))
    }
  },
  watch: {
    activeDevice() {
      this.hotzoneKey++
    }
  },
  methods: {
    setActiveHotspots(value) {
      this.$set(this.localSettings, this.activeHotspotKey, value)
    },
    handleChangeHotspots(zones) {
      if (!Array.isArray(zones)) return
      const next = this.activeHotspots.slice()
      zones.forEach((zone, index) => {
        if (!next[index]) {
          next[index] = createHotspot()
        }
        next[index] = {
          ...next[index],
          rect: normalizeRect({
            x: zone.leftPer,
            y: zone.topPer,
            width: zone.widthPer,
            height: zone.heightPer
          })
        }
      })
      this.setActiveHotspots(next.slice(0, zones.length))
    },
    removeHotspot(index) {
      const next = this.activeHotspots.slice()
      next.splice(index, 1)
      this.setActiveHotspots(next)
      this.hotzoneKey++
    },
    updateHotspotLink(index, value) {
      const next = this.activeHotspots.slice()
      if (!next[index]) return
      next[index] = {
        ...next[index],
        link: normalizeLink(value)
      }
      this.setActiveHotspots(next)
    },
    submit() {
      this.$emit('close', {
        pc_hotspots: cloneDeep(this.localSettings.pc_hotspots || []),
        mobile_hotspots: cloneDeep(this.localSettings.mobile_hotspots || [])
      })
    }
  }
}
</script>

<style scoped lang="scss">
.image-hotspot-editor {
  min-height: 480px;
}

.image-hotspot-editor__canvas {
  min-height: 420px;

  ::v-deep .hotzone,
  ::v-deep .vue-hotzone {
    max-width: 100%;
  }
}
</style>
