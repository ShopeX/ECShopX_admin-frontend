<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('513d370a.32c65d') }}</div>
      <SpRichTextEditor
        :value="settings.title"
        :placeholder="$t('513d370a.96641a')"
        @input="updateField('title', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('513d370a.4ccbdc') }}</div>
      <div class="rounded-lg border border-border bg-background p-3">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
          >
            <MenuIcon :size="16" :stroke-width="1.8" />
          </div>
          <div class="min-w-0 flex-1 truncate text-sm text-foreground">
            {{ currentMenuLabel }}
          </div>
          <button
            v-if="hasSelectedMenu"
            type="button"
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-destructive"
            @click="clearMenu"
          >
            <Trash2 :size="14" :stroke-width="1.8" />
          </button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-8 flex-1 rounded-lg border-0 bg-muted px-3 text-sm font-medium text-foreground hover:bg-muted/80"
          @click="openMenuPicker"
        >
          {{ $t('513d370a.fe3cd2') }}
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('513d370a.ea887b') }}</div>
      <el-select
        :value="settings.size"
        size="small"
        class="w-full"
        @change="updateField('size', $event)"
      >
        <el-option value="xsmall" :label="$t('513d370a.f72ce9')" />
        <el-option value="small" :label="$t('513d370a.391b8f')" />
        <el-option value="medium" :label="$t('513d370a.aed1df')" />
        <el-option value="large" :label="$t('513d370a.ab18e3')" />
        <el-option value="xlarge" :label="$t('513d370a.3386da')" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('513d370a.d5bc35') }}</div>
      <el-radio-group
        :value="settings.alignment"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">{{ $t('513d370a.d2aff1') }}</el-radio-button>
        <el-radio-button label="center">{{ $t('513d370a.aed1df') }}</el-radio-button>
        <el-radio-button label="right">{{ $t('513d370a.4d9c32') }}</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">{{ $t('513d370a.3f7bf6') }}</div>
      <div class="flex items-center gap-3">
        <el-input-number
          :value="settings.column_span"
          :min="1"
          :max="12"
          size="small"
          controls-position="right"
          class="!w-[88px]"
          @change="updateField('column_span', $event)"
        />
        <el-slider
          :value="settings.column_span"
          :min="1"
          :max="12"
          :step="1"
          :show-tooltip="false"
          class="min-w-0 flex-1 pl-1"
          @input="updateField('column_span', $event)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { Menu as MenuIcon, Trash2 } from 'lucide-vue'
import WebNavPicker from '@/components/sp-picker-plus/WebNavPicker.vue'
import SpRichTextEditor from '@/components/sp-rich-text-editor/index.vue'
import { normalizeSelectedMenu, pickMenuValue } from '../utils/menuSelection.js'
import { normalizeTypedBlockSettings } from '../utils/panelState.js'

export default {
  name: 'FooterMenuBlockPanel',
  components: {
    MenuIcon,
    Trash2,
    SpRichTextEditor
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      menuNameCache: ''
    }
  },
  computed: {
    settings() {
      return normalizeTypedBlockSettings('footer-menu', this.value)
    },
    currentMenu() {
      return normalizeSelectedMenu(pickMenuValue(this.settings))
    },
    currentMenuLabel() {
      return this.currentMenu?.name || this.menuNameCache || this.$t('513d370a.013608')
    },
    hasSelectedMenu() {
      return Boolean(this.currentMenu || this.menuNameCache)
    }
  },
  watch: {
    currentMenu: {
      immediate: true,
      handler(menu) {
        if (menu?.name) {
          this.menuNameCache = menu.name
          return
        }
        this.resolveMenuName(menu)
      }
    }
  },
  methods: {
    updateField(field, fieldValue) {
      this.$emit('change', {
        [field]: fieldValue
      })
    },
    clearMenu() {
      this.menuNameCache = ''
      this.updateField('menu', '')
    },
    async resolveMenuName(menu) {
      const menuId = String(menu?.id || menu?.key || '').trim()
      if (!menuId) {
        this.menuNameCache = ''
        return
      }
      try {
        const detail = await this.$api.decoration.getMenuDetail(menuId)
        this.menuNameCache = detail?.name || ''
      } catch (error) {
        this.menuNameCache = ''
      }
    },
    async openMenuPicker() {
      const selected = await this.$dialog.open(WebNavPicker, {
        title: this.$t('513d370a.ccf820'),
        props: {
          initialSelected: this.currentMenu
        }
      })
      if (!selected) return
      this.menuNameCache = selected?.name || ''
      this.updateField('menu', selected)
    }
  }
}
</script>
