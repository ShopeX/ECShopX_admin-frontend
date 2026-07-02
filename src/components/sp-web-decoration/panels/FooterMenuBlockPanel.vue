<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">标题</div>
      <SpRichTextEditor
        :value="settings.title"
        placeholder="请输入标题"
        @input="updateField('title', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">菜单</div>
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
          更改
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">规格</div>
      <el-select
        :value="settings.size"
        size="small"
        class="w-full"
        @change="updateField('size', $event)"
      >
        <el-option value="xsmall" label="特小" />
        <el-option value="small" label="小" />
        <el-option value="medium" label="中" />
        <el-option value="large" label="大" />
        <el-option value="xlarge" label="特大" />
      </el-select>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">对齐方式</div>
      <el-radio-group
        :value="settings.alignment"
        size="small"
        @input="updateField('alignment', $event)"
      >
        <el-radio-button label="left">左</el-radio-button>
        <el-radio-button label="center">中</el-radio-button>
        <el-radio-button label="right">右</el-radio-button>
      </el-radio-group>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">占列宽度</div>
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
      return this.currentMenu?.name || this.menuNameCache || '未选择菜单'
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
        title: '选择导航菜单',
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
