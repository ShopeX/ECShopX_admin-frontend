<template>
  <div class="space-y-5 text-foreground">
    <section class="space-y-2">
      <div class="text-sm font-semibold text-foreground">产品系列</div>
      <div class="rounded-lg border border-border bg-background p-3">
        <draggable
          v-if="selectedProductItems.length"
          :value="selectedProductItems"
          class="space-y-2"
          handle="[data-product-drag-handle]"
          ghost-class="opacity-60"
          @input="updateProducts"
        >
          <div
            v-for="product in selectedProductItems"
            :key="product.item_id"
            class="flex items-center gap-3 rounded-md bg-muted/40 px-2 py-2"
          >
            <button
              type="button"
              data-product-drag-handle
              class="flex h-7 w-4 shrink-0 cursor-grab items-center justify-center border-0 bg-transparent text-muted-foreground active:cursor-grabbing"
            >
              <GripVertical :size="14" :stroke-width="1.8" />
            </button>
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted text-muted-foreground"
            >
              <img
                v-if="getProductImage(product)"
                :src="getProductImage(product)"
                class="h-full w-full object-cover"
                alt=""
              />
              <ImageIcon v-else :size="16" :stroke-width="1.8" />
            </div>
            <div class="min-w-0 flex-1 truncate text-sm text-foreground">
              {{ product.item_name || product.item_id }}
            </div>
            <button
              type="button"
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground hover:bg-muted hover:text-destructive"
              @click="removeProduct(product.item_id)"
            >
              <Trash2 :size="14" :stroke-width="1.8" />
            </button>
          </div>
        </draggable>
        <div v-else class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
          >
            <ImageIcon :size="16" :stroke-width="1.8" />
          </div>
          <div class="min-w-0 flex-1 truncate text-sm text-foreground">全部产品</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-8 flex-1 rounded-lg border-0 bg-muted px-3 text-sm font-medium text-foreground hover:bg-muted/80"
          @click="openProductPicker"
        >
          {{ selectedProductItems.length ? '继续添加' : '添加商品' }}
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">最大产品数</div>
      <div class="flex items-center gap-3">
        <el-input-number
          :value="settings.limit"
          :min="2"
          :max="24"
          size="small"
          controls-position="right"
          class="!w-[88px]"
          @change="updateField('limit', $event)"
        />
        <el-slider
          :value="settings.limit"
          :min="2"
          :max="24"
          :step="1"
          :show-tooltip="false"
          class="min-w-0 flex-1 pl-1"
          @input="updateField('limit', $event)"
        />
      </div>
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">标题</div>
      <SpRichTextEditor
        :value="settings.tab_label"
        placeholder="请输入标题"
        @input="updateField('tab_label', $event)"
      />
    </section>

    <section class="space-y-2">
      <div class="text-sm text-muted-foreground">规格</div>
      <el-select
        :value="settings.size || sectionSize"
        size="small"
        class="w-full"
        @change="updateSize"
      >
        <el-option value="xsmall" label="特小" />
        <el-option value="small" label="小" />
        <el-option value="medium" label="中" />
        <el-option value="large" label="大" />
        <el-option value="xlarge" label="特大" />
      </el-select>
    </section>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { GripVertical, Image as ImageIcon, Trash2 } from 'lucide-vue'
import { GoodsPicker } from '@/components/sp-picker-plus'
import { normalizeProductTabBlockSettings } from '../utils/panelState.js'

function normalizeProductSnapshot(product = {}) {
  return {
    item_id: product.item_id,
    item_name: product.item_name || '',
    pics: product.pics || [],
    price: product.price
  }
}

export default {
  name: 'ProductTabBlockPanel',
  components: { draggable, GripVertical, ImageIcon, Trash2 },
  props: {
    section: { type: Object, default: null },
    block: { type: Object, default: null },
    value: { type: Object, default: () => ({}) }
  },
  computed: {
    settings() {
      return normalizeProductTabBlockSettings(this.value)
    },
    selectedProducts() {
      return Array.isArray(this.settings.product_ids) ? this.settings.product_ids : []
    },
    selectedProductItems() {
      const snapshotMap = new Map(
        (this.settings.product_snapshots || []).map((product) => [product.item_id, product])
      )
      return this.selectedProducts.map(
        (id) => snapshotMap.get(id) || { item_id: id, item_name: id }
      )
    },
    sectionSize() {
      const value = this.section?.settings?.size
      return ['xsmall', 'small', 'medium', 'large', 'xlarge'].includes(value) ? value : 'medium'
    }
  },
  methods: {
    updateField(field, value) {
      this.$emit('change', { [field]: value })
    },
    updateProducts(products) {
      const snapshots = products
        .map((product) => normalizeProductSnapshot(product))
        .filter((product) => product.item_id)
      this.$emit('change', {
        product_ids: snapshots.map((product) => product.item_id),
        product_snapshots: snapshots
      })
    },
    updateSize(value) {
      this.$emit('change', { size: value, size_override: true })
    },
    clearProducts() {
      this.$emit('change', { product_ids: [], product_snapshots: [] })
    },
    removeProduct(productId) {
      const next = this.selectedProductItems.filter((product) => product.item_id !== productId)
      this.updateProducts(next)
    },
    getProductImage(product) {
      if (Array.isArray(product.pics)) return product.pics[0] || ''
      return product.pics || ''
    },
    async openProductPicker() {
      const result = await this.$dialog.open(GoodsPicker, {
        parent: this,
        title: '选择商品',
        props: {
          multiple: true,
          initialSelected: this.selectedProductItems
        }
      })
      if (!result) return
      this.updateProducts(result)
    }
  }
}
</script>
