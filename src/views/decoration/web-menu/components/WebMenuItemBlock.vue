<!--
  单个菜单项节点：一行卡片 + 子级 draggable（递归，最大深度由 maxDepth 控制）
-->
<template>
  <div class="flex flex-col gap-3">
    <div class="group flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div
        class="drag-handle flex shrink-0 cursor-move select-none items-center self-stretch border-r border-gray-200 bg-gray-50 px-3 text-[#909399]"
      >
        ⠿
      </div>
      <div class="flex min-h-[40px] min-w-0 flex-1 items-center gap-2.5 px-3 sm:px-4">
        <span
          v-if="node.children && node.children.length"
          class="w-5 shrink-0 cursor-pointer text-gray-600"
          @click="node._expanded = !node._expanded"
        >
          <SpIcon class="menu-icon" :name="node._expanded ? 'down' : 'right'" :size="18" />
        </span>
        <span v-else class="w-5 shrink-0" />
        <span class="min-w-0 flex-1 font-medium text-gray-800">{{ node.name }}</span>
        <span class="min-w-0 flex-1 truncate text-gray-400" :title="itemLinkLabel(node)">{{
          itemLinkLabel(node)
        }}</span>
        <div
          class="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity duration-150 ease-in-out pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100"
        >
          <SpIcon
            v-if="depth < maxDepth"
            button
            name="add-one"
            :size="16"
            class="!p-1.5 text-base text-gray-600 hover:text-gray-800"
            :title="$t('e45f0be0.d87298')"
            @click="openItemDialog(null, node.id)"
          />
          <SpIcon
            button
            name="write"
            :size="16"
            class="!p-1.5 text-base text-gray-600 hover:text-gray-800"
            :title="$t('e45f0be0.95b351')"
            @click="openItemDialog(node, 0)"
          />
          <SpIcon
            button
            name="delete"
            :size="16"
            class="!p-1.5 text-base text-[#f56c6c] hover:text-[#f78989]"
            :title="$t('e45f0be0.2f4aad')"
            @click="handleDeleteItem(node)"
          />
        </div>
      </div>
    </div>

    <draggable
      v-if="depth < maxDepth && node._expanded && node.children && node.children.length"
      v-model="node.children"
      handle=".drag-handle"
      :animation="200"
      tag="div"
      class="ml-1 flex flex-col gap-3 border-l-2 border-gray-100 pl-5 sm:ml-2 sm:pl-6"
      @end="onChildSortEnd(node)"
    >
      <div v-for="child in node.children" :key="child.id" class="flex flex-col gap-3">
        <WebMenuItemBlock
          :node="child"
          :depth="depth + 1"
          :max-depth="maxDepth"
          :open-item-dialog="openItemDialog"
          :handle-delete-item="handleDeleteItem"
          :on-child-sort-end="onChildSortEnd"
          :item-link-label="itemLinkLabel"
        />
      </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'WebMenuItemBlock',
  components: {
    Draggable,
    WebMenuItemBlock: () => import('./WebMenuItemBlock.vue')
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    /** 当前节点所在层级，顶级为 1 */
    depth: {
      type: Number,
      default: 1
    },
    /** 最大层级（例如 3 表示支持三级菜单项） */
    maxDepth: {
      type: Number,
      default: 3
    },
    openItemDialog: {
      type: Function,
      required: true
    },
    handleDeleteItem: {
      type: Function,
      required: true
    },
    onChildSortEnd: {
      type: Function,
      required: true
    },
    itemLinkLabel: {
      type: Function,
      required: true
    }
  }
}
</script>
