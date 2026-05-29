<template>
  <div class="h-full flex min-h-0 flex-col border-r border-[#e6e9ef] bg-white">
    <div
      class="flex min-h-12 items-center justify-between gap-2.5 border-b border-[#e6e9ef] px-[14px] py-[10px]"
    >
      <div class="text-sm font-semibold text-[#18222f]">
        {{ $t('54e3d97e.768f6f') }}
      </div>
    </div>

    <div class="h-full min-h-0 overflow-hidden px-3 pb-4 pt-2.5">
      <div class="sp-structure-scroll h-full overflow-y-auto overflow-x-visible pr-1">
        <div>
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.917f14') }}</span>
          </div>
          <div class="space-y-1">
            <draggable
              v-model="localHeaderZoneOrder"
              handle="[data-drag-handle='header-zone-section']"
              class="flex flex-col gap-0"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleHeaderZoneOrderChange"
            >
              <div
                v-for="(sectionId, sIdx) in localHeaderZoneOrder"
                :key="sectionId"
                class="flex flex-col gap-0"
              >
                <div class="relative z-[3] py-0">
                  <div
                    class="sp-structure-insert-gap"
                    @click.stop="toggleInsertMenu('section', 'header', sIdx, $event)"
                  >
                    <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                    <button type="button" class="sp-structure-insert-gap__btn">
                      <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.2e2d33') }}</span>
                    </button>
                  </div>
                  <div
                    v-if="isInsertMenuOpen('section', 'header', sIdx)"
                    class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                    :style="insertMenuDockStyle"
                  >
                    <button
                      v-for="item in sectionPickerItemsFor('header')"
                      :key="'h-gap-' + item.key + '-' + sIdx"
                      type="button"
                      class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                      @click="selectSectionType(item.type)"
                    >
                      <component
                        :is="sectionInsertIcon(item.type)"
                        :size="14"
                        class="shrink-0 text-[#475467]"
                        :stroke-width="2"
                      />
                      <span>{{ item.label }}</span>
                    </button>
                  </div>
                </div>
                <div class="space-y-0.5">
                  <div
                    :class="[
                      'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                      {
                        'sp-structure-row-selected': sectionId === selectedSectionId
                      }
                    ]"
                    @click="$emit('select-section', sectionId)"
                  >
                    <button
                      type="button"
                      class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                      @click.stop="$emit('toggle-section', sectionId)"
                    >
                      <ChevronDown v-if="isExpanded(sectionId)" :size="14" :stroke-width="2" />
                      <ChevronRight v-else :size="14" :stroke-width="2" />
                    </button>
                    <div class="min-w-0 flex-1 flex items-center">
                      <div
                        class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                      >
                        <span
                          class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                        >
                          <GalleryVertical
                            :size="16"
                            class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                            :stroke-width="2"
                          />
                          <span
                            data-drag-handle="header-zone-section"
                            class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                            aria-hidden="true"
                          >
                            <GripVertical :size="14" :stroke-width="2" />
                          </span>
                        </span>
                        {{ getSectionDisplayLabel(sectionId) }}
                      </div>
                    </div>
                    <div
                      v-if="isHeaderZoneFixedSection(sectionId)"
                      class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                    >
                      <button
                        type="button"
                        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                        :title="$t('54e3d97e.b11041')"
                        @click.stop="$emit('toggle-section-disabled', sectionId)"
                      >
                        <EyeOff v-if="isSectionDisabled(sectionId)" :size="18" :stroke-width="2" />
                        <Eye v-else :size="18" :stroke-width="2" />
                      </button>
                    </div>
                    <div
                      v-else-if="canDeleteHeaderZoneSection(sectionId)"
                      class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                    >
                      <button
                        type="button"
                        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
                        :title="$t('54e3d97e.8e22a6')"
                        @click.stop="$emit('remove-section', sectionId)"
                      >
                        <Trash2 :size="16" :stroke-width="2" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                        :title="$t('54e3d97e.b11041')"
                        @click.stop="$emit('toggle-section-disabled', sectionId)"
                      >
                        <EyeOff v-if="isSectionDisabled(sectionId)" :size="18" :stroke-width="2" />
                        <Eye v-else :size="18" :stroke-width="2" />
                      </button>
                    </div>
                  </div>

                  <draggable
                    v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                    v-model="localBlockOrders[sectionId]"
                    handle="[data-drag-handle='block']"
                    :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                    @change="handleBlockOrderChange(sectionId)"
                  >
                    <div
                      v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                      :key="blockId"
                      class="flex flex-col gap-0"
                    >
                      <div class="relative z-[2] py-0 pl-[50px]">
                        <div
                          class="sp-structure-insert-gap sp-structure-insert-gap--block"
                          @click.stop="toggleInsertMenu('block', sectionId, bIdx, $event)"
                        >
                          <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                          <button
                            type="button"
                            class="sp-structure-insert-gap__btn sp-structure-insert-gap__btn--block"
                          >
                            <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                            <span>{{ $t('54e3d97e.fc318c') }}</span>
                          </button>
                        </div>
                        <div
                          v-if="isInsertMenuOpen('block', sectionId, bIdx)"
                          class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                          :style="insertMenuDockStyle"
                        >
                          <button
                            v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                            :key="'hb-gap-' + item.key + '-' + sectionId + '-' + bIdx"
                            type="button"
                            class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                            @click="selectBlockType(sectionId, item.type)"
                          >
                            {{ item.label }}
                          </button>
                        </div>
                      </div>
                      <div
                        :class="[
                          'group mt-0 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                          {
                            'sp-structure-row-selected':
                              sectionId === selectedSectionId && selectedBlockId === blockId
                          }
                        ]"
                        @click="$emit('select-block', { sectionId, blockId })"
                      >
                        <div class="min-w-0 flex-1 flex items-center">
                          <div
                            class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                          >
                            <span
                              class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                            >
                              <Diamond
                                :size="16"
                                class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                                :stroke-width="2"
                              />
                              <span
                                data-drag-handle="block"
                                class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                              >
                                <GripVertical :size="14" :stroke-width="2" />
                              </span>
                            </span>
                            {{ getBlockLabel(getSection(sectionId), blockId) }}
                          </div>
                        </div>
                        <div
                          class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                        >
                          <button
                            v-if="canDeleteBlock(sectionId)"
                            type="button"
                            class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
                            :title="$t('54e3d97e.8e22a6')"
                            @click.stop="$emit('remove-block', { sectionId, blockId })"
                          >
                            <Trash2 :size="16" :stroke-width="2" />
                          </button>
                          <button
                            type="button"
                            class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                            :title="$t('54e3d97e.b11041')"
                            @click.stop="$emit('toggle-block-disabled', { sectionId, blockId })"
                          >
                            <EyeOff
                              v-if="isBlockDisabled(sectionId, blockId)"
                              :size="18"
                              :stroke-width="2"
                            />
                            <Eye v-else :size="18" :stroke-width="2" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </draggable>

                  <div v-if="isExpanded(sectionId)">
                    <div class="relative pl-[52px]">
                      <button
                        v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                        type="button"
                        class="mt-0.5 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-0 pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                        @click="
                          toggleInsertMenu(
                            'block',
                            sectionId,
                            getBlockOrder(sectionId).length,
                            $event
                          )
                        "
                      >
                        <CirclePlus
                          :size="14"
                          class="shrink-0 text-[#2563eb]"
                          :stroke-width="2.5"
                        />
                        <span>{{ $t('54e3d97e.fc318c') }}</span>
                      </button>

                      <div
                        v-if="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                        class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                        :style="insertMenuDockStyle"
                      >
                        <button
                          v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                          :key="item.key + '-' + sectionId"
                          type="button"
                          class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                          @click="selectBlockType(sectionId, item.type)"
                        >
                          {{ item.label }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>

            <div class="relative z-[3] py-0">
              <div
                class="sp-structure-insert-gap"
                @click.stop="
                  toggleInsertMenu('section', 'header', localHeaderZoneOrder.length, $event)
                "
              >
                <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                <button type="button" class="sp-structure-insert-gap__btn">
                  <Plus :size="13" class="shrink-0 text-white" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>
              </div>
              <div
                v-if="isInsertMenuOpen('section', 'header', localHeaderZoneOrder.length)"
                class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                :style="insertMenuDockStyle"
              >
                <button
                  v-for="item in sectionPickerItemsFor('header')"
                  :key="'header-hover-end-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>

            <div class="relative mt-1 px-2 pb-0.5 pl-[34px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'header', localHeaderZoneOrder.length, $event)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'header', localHeaderZoneOrder.length)"
                class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                :style="insertMenuDockStyle"
              >
                <button
                  v-for="item in sectionPickerItemsFor('header')"
                  :key="item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.cdb7d0') }}</span>
          </div>

          <draggable
            v-model="localOrder"
            handle="[data-drag-handle='section']"
            class="flex flex-col gap-0"
            :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
            @change="handleOrderChange"
          >
            <div
              v-for="(sectionId, sIdx) in localOrder"
              :key="sectionId"
              class="flex flex-col gap-0"
            >
              <div class="relative z-[3] py-0">
                <div
                  class="sp-structure-insert-gap"
                  @click.stop="toggleInsertMenu('section', 'template', sIdx, $event)"
                >
                  <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                  <button type="button" class="sp-structure-insert-gap__btn">
                    <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                    <span>{{ $t('54e3d97e.2e2d33') }}</span>
                  </button>
                </div>
                <div
                  v-if="isInsertMenuOpen('section', 'template', sIdx)"
                  class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                  :style="insertMenuDockStyle"
                >
                  <button
                    v-for="item in sectionPickerItemsFor('template')"
                    :key="'tpl-gap-' + item.key + '-' + sIdx"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                    @click="selectSectionType(item.type)"
                  >
                    <component
                      :is="sectionInsertIcon(item.type)"
                      :size="14"
                      class="shrink-0 text-[#475467]"
                      :stroke-width="2"
                    />
                    <span>{{ item.label }}</span>
                  </button>
                </div>
              </div>
              <div class="space-y-1">
                <div
                  :class="[
                    'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'sp-structure-row-selected': sectionId === selectedSectionId
                    }
                  ]"
                  @click="$emit('select-section', sectionId)"
                >
                  <button
                    type="button"
                    class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                    @click.stop="$emit('toggle-section', sectionId)"
                  >
                    <ChevronDown v-if="isExpanded(sectionId)" :size="14" :stroke-width="2" />
                    <ChevronRight v-else :size="14" :stroke-width="2" />
                  </button>
                  <div class="min-w-0 flex-1 flex items-center">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <span
                        class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                      >
                        <GalleryVertical
                          :size="16"
                          class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                          :stroke-width="2"
                        />
                        <span
                          data-drag-handle="section"
                          class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                        >
                          <GripVertical :size="14" :stroke-width="2" />
                        </span>
                      </span>
                      {{ getSectionLabel(sectionId) }}
                    </div>
                  </div>
                  <div
                    class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    <button
                      type="button"
                      class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
                      :title="$t('54e3d97e.8e22a6')"
                      @click.stop="$emit('remove-section', sectionId)"
                    >
                      <Trash2 :size="16" :stroke-width="2" />
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                      :title="$t('54e3d97e.b11041')"
                      @click.stop="$emit('toggle-section-disabled', sectionId)"
                    >
                      <EyeOff v-if="isSectionDisabled(sectionId)" :size="18" :stroke-width="2" />
                      <Eye v-else :size="18" :stroke-width="2" />
                    </button>
                  </div>
                </div>

                <draggable
                  v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                  v-model="localBlockOrders[sectionId]"
                  handle="[data-drag-handle='block']"
                  :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                  @change="handleBlockOrderChange(sectionId)"
                >
                  <div
                    v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                    :key="blockId"
                    class="flex flex-col gap-0"
                  >
                    <div class="relative z-[2] py-0 pl-[50px]">
                      <div
                        class="sp-structure-insert-gap sp-structure-insert-gap--block"
                        @click.stop="toggleInsertMenu('block', sectionId, bIdx, $event)"
                      >
                        <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                        <button
                          type="button"
                          class="sp-structure-insert-gap__btn sp-structure-insert-gap__btn--block"
                        >
                          <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                          <span>{{ $t('54e3d97e.fc318c') }}</span>
                        </button>
                      </div>
                      <div
                        v-if="isInsertMenuOpen('block', sectionId, bIdx)"
                        class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                        :style="insertMenuDockStyle"
                      >
                        <button
                          v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                          :key="'tb-gap-' + item.key + '-' + sectionId + '-' + bIdx"
                          type="button"
                          class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                          @click="selectBlockType(sectionId, item.type)"
                        >
                          {{ item.label }}
                        </button>
                      </div>
                    </div>
                    <div
                      :class="[
                        'group mt-0 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                        {
                          'sp-structure-row-selected':
                            sectionId === selectedSectionId && selectedBlockId === blockId
                        }
                      ]"
                      @click="$emit('select-block', { sectionId, blockId })"
                    >
                      <div class="min-w-0 flex-1 flex items-center">
                        <div
                          class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                        >
                          <span
                            class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                          >
                            <Diamond
                              :size="16"
                              class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                              :stroke-width="2"
                            />
                            <span
                              data-drag-handle="block"
                              class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                            >
                              <GripVertical :size="14" :stroke-width="2" />
                            </span>
                          </span>
                          {{ getBlockLabel(dsl.sections[sectionId], blockId) }}
                        </div>
                      </div>
                      <div
                        class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                      >
                        <button
                          v-if="canDeleteBlock(sectionId)"
                          type="button"
                          class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
                          :title="$t('54e3d97e.8e22a6')"
                          @click.stop="$emit('remove-block', { sectionId, blockId })"
                        >
                          <Trash2 :size="16" :stroke-width="2" />
                        </button>
                        <button
                          type="button"
                          class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                          :title="$t('54e3d97e.b11041')"
                          @click.stop="$emit('toggle-block-disabled', { sectionId, blockId })"
                        >
                          <EyeOff
                            v-if="isBlockDisabled(sectionId, blockId)"
                            :size="18"
                            :stroke-width="2"
                          />
                          <Eye v-else :size="18" :stroke-width="2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <div class="relative pl-[52px]">
                    <button
                      v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                      type="button"
                      class="mt-0.5 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-0 pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                      @click="
                        toggleInsertMenu(
                          'block',
                          sectionId,
                          getBlockOrder(sectionId).length,
                          $event
                        )
                      "
                    >
                      <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.fc318c') }}</span>
                    </button>

                    <div
                      v-if="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                      class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                      :style="insertMenuDockStyle"
                    >
                      <button
                        v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                        :key="item.key"
                        type="button"
                        class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                        @click="selectBlockType(sectionId, item.type)"
                      >
                        {{ item.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </draggable>

          <div v-if="localOrder.length" class="relative z-[3] py-0">
            <div
              class="sp-structure-insert-gap"
              @click.stop="toggleInsertMenu('section', 'template', localOrder.length, $event)"
            >
              <div class="sp-structure-insert-gap__line" aria-hidden="true" />
              <button type="button" class="sp-structure-insert-gap__btn">
                <Plus :size="13" class="shrink-0 text-white" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
            </div>
            <div
              v-if="isInsertMenuOpen('section', 'template', localOrder.length)"
              class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              :style="insertMenuDockStyle"
            >
              <button
                v-for="item in sectionPickerItemsFor('template')"
                :key="'tpl-hover-end-' + item.key"
                type="button"
                class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                @click="selectSectionType(item.type)"
              >
                <component
                  :is="sectionInsertIcon(item.type)"
                  :size="14"
                  class="shrink-0 text-[#475467]"
                  :stroke-width="2"
                />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </div>

          <div v-if="localOrder.length" class="relative mt-1 px-2 pb-0.5 pl-[34px]">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
              @click="toggleInsertMenu('section', 'template', localOrder.length, $event)"
            >
              <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
              <span>{{ $t('54e3d97e.2e2d33') }}</span>
            </button>
            <div
              v-if="isInsertMenuOpen('section', 'template', localOrder.length)"
              class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
              :style="insertMenuDockStyle"
            >
              <button
                v-for="item in sectionPickerItemsFor('template')"
                :key="'tpl-end-' + item.key"
                type="button"
                class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-xs text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                @click="selectSectionType(item.type)"
              >
                <component
                  :is="sectionInsertIcon(item.type)"
                  :size="14"
                  class="shrink-0 text-[#475467]"
                  :stroke-width="2"
                />
                <span>{{ item.label }}</span>
              </button>
            </div>
          </div>

          <div
            v-if="!localOrder.length"
            class="flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-[#d7dde7] bg-[#fbfbfc] p-6 text-center text-[#6b7785]"
          >
            <span>{{ $t('54e3d97e.bdf5be') }}</span>
            <div class="relative w-full max-w-[240px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-0 bg-transparent py-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'template-empty', 0, $event)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'template-empty', 0)"
                class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                :style="insertMenuDockStyle"
              >
                <button
                  v-for="item in sectionPickerItemsFor('template-empty')"
                  :key="'tpl-empty-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3.5 border-t border-[#eef1f5] pt-3.5">
          <div
            class="mb-2 px-2 text-[11px] font-semibold leading-4 tracking-[0.06em] text-[#7c8798]"
          >
            <span>{{ $t('54e3d97e.4eb88f') }}</span>
          </div>
          <div class="space-y-1">
            <div class="relative mt-1 px-2 pb-0.5 pl-[34px]">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                @click="toggleInsertMenu('section', 'footer', localFooterZoneOrder.length, $event)"
              >
                <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                <span>{{ $t('54e3d97e.2e2d33') }}</span>
              </button>
              <div
                v-if="isInsertMenuOpen('section', 'footer', localFooterZoneOrder.length)"
                class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                :style="insertMenuDockStyle"
              >
                <button
                  v-for="item in sectionPickerItemsFor('footer')"
                  :key="'footer-add-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>

            <draggable
              v-if="localFooterZoneOrder.length"
              v-model="localFooterZoneOrder"
              handle="[data-drag-handle='footer-zone-section']"
              class="flex flex-col gap-0"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleFooterZoneOrderChange"
            >
              <div
                v-for="(sectionId, sIdx) in localFooterZoneOrder"
                :key="sectionId"
                class="flex flex-col gap-0"
              >
                <div class="relative z-[3] py-0">
                  <div
                    class="sp-structure-insert-gap"
                    @click.stop="toggleInsertMenu('section', 'footer', sIdx, $event)"
                  >
                    <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                    <button type="button" class="sp-structure-insert-gap__btn">
                      <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.2e2d33') }}</span>
                    </button>
                  </div>
                  <div
                    v-if="isInsertMenuOpen('section', 'footer', sIdx)"
                    class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                    :style="insertMenuDockStyle"
                  >
                    <button
                      v-for="item in sectionPickerItemsFor('footer')"
                      :key="'footer-gap-' + item.key + '-' + sIdx"
                      type="button"
                      class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                      @click="selectSectionType(item.type)"
                    >
                      <component
                        :is="sectionInsertIcon(item.type)"
                        :size="14"
                        class="shrink-0 text-[#475467]"
                        :stroke-width="2"
                      />
                      <span>{{ item.label }}</span>
                    </button>
                  </div>
                </div>

                <div
                  :class="[
                    'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    { 'sp-structure-row-selected': selectedSectionId === sectionId }
                  ]"
                  @click="$emit('select-section', sectionId)"
                >
                  <button
                    type="button"
                    class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                    @click.stop="$emit('toggle-section', sectionId)"
                  >
                    <ChevronDown v-if="isExpanded(sectionId)" :size="14" :stroke-width="2" />
                    <ChevronRight v-else :size="14" :stroke-width="2" />
                  </button>
                  <span
                    data-drag-handle="footer-zone-section"
                    class="inline-flex h-[18px] w-[18px] shrink-0 cursor-move items-center justify-center text-[#6b7785]"
                  >
                    <GripVertical :size="14" :stroke-width="2" />
                  </span>
                  <div class="min-w-0 flex-1 flex items-center">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <GalleryVertical
                        :size="16"
                        class="shrink-0 text-[#475467]"
                        :stroke-width="2"
                      />
                      {{ getSectionDisplayLabel(sectionId) }}
                    </div>
                  </div>
                </div>

                <draggable
                  v-if="isExpanded(sectionId) && getBlockOrder(sectionId).length"
                  v-model="localBlockOrders[sectionId]"
                  handle="[data-drag-handle='block']"
                  :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
                  @change="handleBlockOrderChange(sectionId)"
                >
                  <div
                    v-for="(blockId, bIdx) in getBlockOrder(sectionId)"
                    :key="blockId"
                    class="flex flex-col gap-0"
                  >
                    <div class="relative z-[2] py-0 pl-[50px]">
                      <div
                        class="sp-structure-insert-gap sp-structure-insert-gap--block"
                        @click.stop="toggleInsertMenu('block', sectionId, bIdx, $event)"
                      >
                        <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                        <button
                          type="button"
                          class="sp-structure-insert-gap__btn sp-structure-insert-gap__btn--block"
                        >
                          <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                          <span>{{ $t('54e3d97e.fc318c') }}</span>
                        </button>
                      </div>
                      <div
                        v-if="isInsertMenuOpen('block', sectionId, bIdx)"
                        class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                        :style="insertMenuDockStyle"
                      >
                        <button
                          v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                          :key="'footer-zone-block-gap-' + item.key + '-' + bIdx"
                          type="button"
                          class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                          @click="selectBlockType(sectionId, item.type)"
                        >
                          {{ item.label }}
                        </button>
                      </div>
                    </div>
                    <div
                      :class="[
                        'group mt-0 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                        {
                          'sp-structure-row-selected':
                            selectedSectionId === sectionId && selectedBlockId === blockId
                        }
                      ]"
                      @click="$emit('select-block', { sectionId, blockId })"
                    >
                      <span
                        data-drag-handle="block"
                        class="inline-flex h-[18px] w-[18px] shrink-0 cursor-move items-center justify-center text-[#6b7785]"
                      >
                        <Diamond :size="16" :stroke-width="2" />
                      </span>
                      <div class="min-w-0 flex-1 flex items-center">
                        <div
                          class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                        >
                          {{ getBlockLabel(getSection(sectionId), blockId) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </draggable>

                <div v-if="isExpanded(sectionId)">
                  <div class="relative pl-[52px]">
                    <button
                      v-if="getBlockPickerItems(getSectionType(sectionId)).length"
                      type="button"
                      class="mt-0.5 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                      @click="
                        toggleInsertMenu(
                          'block',
                          sectionId,
                          getBlockOrder(sectionId).length,
                          $event
                        )
                      "
                    >
                      <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.fc318c') }}</span>
                    </button>

                    <div
                      v-if="isInsertMenuOpen('block', sectionId, getBlockOrder(sectionId).length)"
                      class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                      :style="insertMenuDockStyle"
                    >
                      <button
                        v-for="item in getBlockPickerItems(getSectionType(sectionId))"
                        :key="'footer-zone-block-' + item.key + '-' + sectionId"
                        type="button"
                        class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                        @click="selectBlockType(sectionId, item.type)"
                      >
                        {{ item.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </draggable>

            <div class="relative z-[3] py-0">
              <div
                class="sp-structure-insert-gap"
                @click.stop="
                  toggleInsertMenu('section', 'footer', localFooterZoneOrder.length, $event)
                "
              >
                <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                <button type="button" class="sp-structure-insert-gap__btn">
                  <Plus :size="13" class="shrink-0 text-white" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.2e2d33') }}</span>
                </button>
              </div>
              <div
                v-if="isInsertMenuOpen('section', 'footer', localFooterZoneOrder.length)"
                class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                :style="insertMenuDockStyle"
              >
                <button
                  v-for="item in sectionPickerItemsFor('footer')"
                  :key="'footer-before-fixed-' + item.key"
                  type="button"
                  class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                  @click="selectSectionType(item.type)"
                >
                  <component
                    :is="sectionInsertIcon(item.type)"
                    :size="14"
                    class="shrink-0 text-[#475467]"
                    :stroke-width="2"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>

            <div
              :class="[
                'group flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2 py-[7px] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                { 'sp-structure-row-selected': selectedSectionId === 'footer' }
              ]"
              @click="$emit('select-section', 'footer')"
            >
              <button
                type="button"
                class="flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#6b7785]"
                @click.stop="$emit('toggle-section', 'footer')"
              >
                <ChevronDown v-if="isExpanded('footer')" :size="14" :stroke-width="2" />
                <ChevronRight v-else :size="14" :stroke-width="2" />
              </button>
              <div class="min-w-0 flex-1 flex items-center">
                <div
                  class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                >
                  <span
                    class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                  >
                    <GalleryVertical
                      :size="16"
                      class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                      :stroke-width="2"
                    />
                    <span
                      class="pointer-events-none absolute inset-0 inline-flex items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <GripVertical :size="14" :stroke-width="2" />
                    </span>
                  </span>
                  {{ $t('54e3d97e.4eb88f') }}
                </div>
              </div>
              <div
                class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <button
                  type="button"
                  class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                  :title="$t('54e3d97e.b11041')"
                  @click.stop="$emit('toggle-section-disabled', 'footer')"
                >
                  <EyeOff v-if="isSectionDisabled('footer')" :size="18" :stroke-width="2" />
                  <Eye v-else :size="18" :stroke-width="2" />
                </button>
              </div>
            </div>

            <draggable
              v-if="isExpanded('footer') && footerBlockOrder.length"
              v-model="localBlockOrders.footer"
              handle="[data-drag-handle='block']"
              :options="{ filter: '.sp-structure-insert-gap', preventOnFilter: false }"
              @change="handleBlockOrderChange('footer')"
            >
              <div
                v-for="(blockId, bIdx) in footerBlockOrder"
                :key="blockId"
                class="flex flex-col gap-0"
              >
                <div class="relative z-[2] py-0 pl-[50px]">
                  <div
                    class="sp-structure-insert-gap sp-structure-insert-gap--block"
                    @click.stop="toggleInsertMenu('block', 'footer', bIdx, $event)"
                  >
                    <div class="sp-structure-insert-gap__line" aria-hidden="true" />
                    <button
                      type="button"
                      class="sp-structure-insert-gap__btn sp-structure-insert-gap__btn--block"
                    >
                      <Plus :size="12" class="shrink-0 text-white" :stroke-width="2.5" />
                      <span>{{ $t('54e3d97e.fc318c') }}</span>
                    </button>
                  </div>
                  <div
                    v-if="isInsertMenuOpen('block', 'footer', bIdx)"
                    class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                    :style="insertMenuDockStyle"
                  >
                    <button
                      v-for="item in footerBlockPickerItems"
                      :key="'fb-gap-' + item.key + '-' + bIdx"
                      type="button"
                      class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                      @click="selectBlockType('footer', item.type)"
                    >
                      {{ item.label }}
                    </button>
                  </div>
                </div>
                <div
                  :class="[
                    'group mt-0 flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent py-[7px] pl-[50px] pr-2 text-[#6b7785] transition-colors duration-150 hover:bg-[rgba(24,34,47,0.04)]',
                    {
                      'sp-structure-row-selected':
                        selectedSectionId === 'footer' && selectedBlockId === blockId
                    }
                  ]"
                  @click="$emit('select-block', { sectionId: 'footer', blockId })"
                >
                  <div class="min-w-0 flex-1 flex items-center">
                    <div
                      class="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-[#18222f]"
                    >
                      <span
                        class="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center"
                      >
                        <Diamond
                          :size="16"
                          class="shrink-0 text-[#475467] opacity-100 transition-opacity duration-150 group-hover:pointer-events-none group-hover:opacity-0"
                          :stroke-width="2"
                        />
                        <span
                          data-drag-handle="block"
                          class="pointer-events-none absolute inset-0 inline-flex cursor-move items-center justify-center text-[#6b7785] opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                        >
                          <GripVertical :size="14" :stroke-width="2" />
                        </span>
                      </span>
                      {{ getBlockLabel(footerSection, blockId) }}
                    </div>
                  </div>
                  <div
                    class="flex shrink-0 items-center gap-0.5 opacity-0 pointer-events-none transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100"
                  >
                    <button
                      v-if="canDeleteBlock('footer')"
                      type="button"
                      class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#98a2b3] transition-colors duration-150 hover:bg-[#e8eef6]"
                      :title="$t('54e3d97e.8e22a6')"
                      @click.stop="$emit('remove-block', { sectionId: 'footer', blockId })"
                    >
                      <Trash2 :size="16" :stroke-width="2" />
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-[#6b7785] transition-colors duration-150 hover:bg-[#e8eef6]"
                      :title="$t('54e3d97e.b11041')"
                      @click.stop="$emit('toggle-block-disabled', { sectionId: 'footer', blockId })"
                    >
                      <EyeOff
                        v-if="isBlockDisabled('footer', blockId)"
                        :size="18"
                        :stroke-width="2"
                      />
                      <Eye v-else :size="18" :stroke-width="2" />
                    </button>
                  </div>
                </div>
              </div>
            </draggable>

            <div v-if="isExpanded('footer')">
              <div class="relative pl-[52px]">
                <button
                  v-if="footerBlockPickerItems.length"
                  type="button"
                  class="mt-0.5 flex w-full cursor-pointer items-center justify-start gap-2 rounded-lg border-0 bg-transparent py-[7px] pr-2 text-sm font-semibold text-[#2563eb] transition-colors duration-150"
                  @click="toggleInsertMenu('block', 'footer', footerBlockOrder.length, $event)"
                >
                  <CirclePlus :size="14" class="shrink-0 text-[#2563eb]" :stroke-width="2.5" />
                  <span>{{ $t('54e3d97e.fc318c') }}</span>
                </button>

                <div
                  v-if="isInsertMenuOpen('block', 'footer', footerBlockOrder.length)"
                  class="sp-structure-insert-menu fixed z-[4000] min-w-[200px] max-h-[min(420px,calc(100vh-32px))] overflow-y-auto rounded-xl border border-[rgba(17,24,39,0.08)] bg-white p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.14)]"
                  :style="insertMenuDockStyle"
                >
                  <button
                    v-for="item in footerBlockPickerItems"
                    :key="item.key"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent px-2.5 py-2 text-left text-[12px] text-[#18222f] hover:bg-[#e9f0ff] hover:text-[#2563eb]"
                    @click="selectBlockType('footer', item.type)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import { getTypedBlockDefinition as getBlockDefinition } from '../definitions/registry.js'
import {
  createSectionPickerItems,
  createSectionPickerItemsForTypes,
  createBlockPickerItems
} from '../utils/insertPicker.js'
import { getSectionInsertIconComponent as resolveSectionInsertIcon } from '../utils/decorationLucide.js'
import { getAreaSectionInsertPolicy } from '../definitions/areas.js'

export default {
  name: 'StructurePanel',
  components: {
    draggable
  },
  props: {
    dsl: {
      type: Object,
      required: true
    },
    globalDsl: {
      type: Object,
      default: () => ({})
    },
    headerDsl: {
      type: Object,
      default: () => ({})
    },
    footerDsl: {
      type: Object,
      default: () => ({})
    },
    sectionDefinitions: {
      type: Array,
      default: () => []
    },
    expandedSectionIds: {
      type: Array,
      default: () => []
    },
    selectedSectionId: {
      type: String,
      default: ''
    },
    selectedBlockId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localOrder: [],
      /** 全局标头区顺序，与 headerDsl.order 同步，可拖拽 */
      localHeaderZoneOrder: [],
      /** 全局页脚区附加分区顺序，不含固定 footer */
      localFooterZoneOrder: [],
      localBlockOrders: {
        header: [],
        footer: []
      },
      openInsertMenu: {
        kind: '',
        sectionId: '',
        insertIndex: null
      },
      /** 插入菜单：fixed 定位（结构树右侧），由锚点 getBoundingClientRect 计算 */
      insertMenuAnchorEl: null,
      insertMenuDockStyle: {}
    }
  },
  computed: {
    footerSection() {
      return this.footerDsl.sections?.footer || this.globalDsl.sections?.footer || null
    },
    footerBlockOrder() {
      return this.localBlockOrders.footer || []
    },
    footerBlockPickerItems() {
      return createBlockPickerItems('footer')
    }
  },
  watch: {
    'dsl.order': {
      immediate: true,
      deep: true,
      handler(value) {
        this.localOrder = Array.isArray(value) ? value.slice() : []
      }
    },
    dsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncBlockOrders()
      }
    },
    globalDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncBlockOrders()
      }
    },
    headerDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncHeaderZoneOrderFromHeader()
      }
    },
    footerDsl: {
      immediate: true,
      deep: true,
      handler() {
        this.syncFooterZoneOrderFromFooter()
      }
    }
  },
  beforeDestroy() {
    this.clearInsertMenuAnchor()
  },
  methods: {
    syncHeaderZoneOrderFromHeader() {
      const order = this.headerDsl?.order
      if (!Array.isArray(order) || !order.length) {
        this.localHeaderZoneOrder = ['header']
        return
      }
      this.localHeaderZoneOrder = order.filter((id) => id !== 'footer').slice()
    },
    syncFooterZoneOrderFromFooter() {
      const order = this.footerDsl?.order
      this.localFooterZoneOrder = Array.isArray(order)
        ? order.filter((id) => id !== 'footer').slice()
        : []
    },
    emitGlobalZoneOrder() {
      this.$emit('reorder-global-sections', [
        ...this.localHeaderZoneOrder.slice(),
        ...this.localFooterZoneOrder.slice(),
        'footer'
      ])
    },
    handleHeaderZoneOrderChange() {
      this.emitGlobalZoneOrder()
    },
    handleFooterZoneOrderChange() {
      this.emitGlobalZoneOrder()
    },
    isHeaderZoneFixedSection(sectionId) {
      return sectionId === 'header'
    },
    canDeleteHeaderZoneSection(sectionId) {
      if (sectionId === 'header' || sectionId === 'footer') return false
      return this.getSectionType(sectionId) === 'announcement-bar'
    },
    sectionPickerItemsFor(anchor) {
      const cfg = getAreaSectionInsertPolicy(anchor)
      if (cfg.types == null) {
        return createSectionPickerItems(this.sectionDefinitions)
      }
      return createSectionPickerItemsForTypes(cfg.types)
    },
    syncBlockOrders() {
      const nextBlockOrders = {}
      Object.keys(this.globalDsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.globalDsl.sections?.[sectionId]?.blockOrder?.slice() || []
      })
      Object.keys(this.dsl.sections || {}).forEach((sectionId) => {
        nextBlockOrders[sectionId] = this.dsl.sections[sectionId].blockOrder?.slice() || []
      })
      this.localBlockOrders = nextBlockOrders
    },
    isExpanded(sectionId) {
      return this.expandedSectionIds.includes(sectionId)
    },
    isInsertMenuOpen(kind, sectionId = '', insertIndex = null) {
      if (this.openInsertMenu.kind !== kind) return false
      if (kind === 'block') {
        return (
          this.openInsertMenu.sectionId === sectionId &&
          this.openInsertMenu.insertIndex === insertIndex
        )
      }
      if (kind === 'section') {
        return (
          this.openInsertMenu.sectionId === sectionId &&
          this.openInsertMenu.insertIndex === insertIndex
        )
      }
      return false
    },
    toggleInsertMenu(kind, sectionId = '', insertIndexArg = undefined, event) {
      if (kind === 'block') {
        const idx =
          typeof insertIndexArg === 'number' && !Number.isNaN(insertIndexArg)
            ? insertIndexArg
            : null
        if (this.isInsertMenuOpen('block', sectionId, idx)) {
          this.closeInsertMenu()
          return
        }
        this.openInsertMenu = { kind: 'block', sectionId, insertIndex: idx }
        this.setInsertMenuAnchor(event)
        return
      }
      if (kind === 'section') {
        const anchor = sectionId || 'header'
        let idx
        if (typeof insertIndexArg === 'number' && !Number.isNaN(insertIndexArg)) {
          idx = insertIndexArg
        } else if (anchor === 'header') {
          idx = this.localHeaderZoneOrder.length
        } else if (anchor === 'template-empty') {
          idx = 0
        } else {
          idx = this.localOrder.length
        }
        if (this.isInsertMenuOpen('section', anchor, idx)) {
          this.closeInsertMenu()
          return
        }
        this.openInsertMenu = { kind: 'section', sectionId: anchor, insertIndex: idx }
        this.setInsertMenuAnchor(event)
      }
    },
    setInsertMenuAnchor(event) {
      const el = event && event.currentTarget
      this.insertMenuAnchorEl = el && el.nodeType === 1 ? el : null
      this.bindInsertMenuPositionListeners()
      this.bindInsertMenuClickOutside()
      this.$nextTick(() => this.updateInsertMenuPosition())
    },
    updateInsertMenuPosition() {
      const el = this.insertMenuAnchorEl
      if (!el || typeof el.getBoundingClientRect !== 'function') {
        this.insertMenuDockStyle = {}
        return
      }
      const r = el.getBoundingClientRect()
      const root = this.$el
      const rootRect =
        root && typeof root.getBoundingClientRect === 'function' ? root.getBoundingClientRect() : r
      const gap = 8
      const menuW = 208
      // 图2：面板左缘与结构侧栏右边界（分割线）对齐，整体落在预览区一侧
      let left = rootRect.right + gap
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800
      if (left + menuW > vw - gap) {
        left = Math.max(gap, vw - menuW - gap)
      }
      const pad = 8
      const minBottomReserve = 120
      let topPx = r.top
      topPx = Math.max(pad, Math.min(vh - pad - minBottomReserve, topPx))
      this.insertMenuDockStyle = {
        position: 'fixed',
        top: `${Math.round(topPx)}px`,
        left: `${Math.round(left)}px`,
        zIndex: 4000
      }
    },
    bindInsertMenuPositionListeners() {
      if (this._insertMenuListenersBound) return
      this._onInsertMenuViewport = () => {
        if (!this.openInsertMenu.kind) return
        this.updateInsertMenuPosition()
      }
      window.addEventListener('resize', this._onInsertMenuViewport)
      window.addEventListener('scroll', this._onInsertMenuViewport, true)
      this._insertMenuScrollEl = this.$el && this.$el.querySelector('.sp-structure-scroll')
      if (this._insertMenuScrollEl) {
        this._insertMenuScrollEl.addEventListener('scroll', this._onInsertMenuViewport, true)
      }
      this._insertMenuListenersBound = true
    },
    unbindInsertMenuPositionListeners() {
      if (!this._insertMenuListenersBound || !this._onInsertMenuViewport) return
      window.removeEventListener('resize', this._onInsertMenuViewport)
      window.removeEventListener('scroll', this._onInsertMenuViewport, true)
      if (this._insertMenuScrollEl) {
        this._insertMenuScrollEl.removeEventListener('scroll', this._onInsertMenuViewport, true)
        this._insertMenuScrollEl = null
      }
      this._onInsertMenuViewport = null
      this._insertMenuListenersBound = false
    },
    clearInsertMenuAnchor() {
      this.insertMenuAnchorEl = null
      this.insertMenuDockStyle = {}
      this.unbindInsertMenuPositionListeners()
      this.unbindInsertMenuClickOutside()
    },
    bindInsertMenuClickOutside() {
      if (this._insertMenuClickOutsideBound) return
      this._onInsertMenuClickOutside = (e) => {
        if (!this.openInsertMenu.kind) return
        const t = e.target
        const root = this.$el
        const panel = root && root.querySelector && root.querySelector('.sp-structure-insert-menu')
        if (panel && panel.contains(t)) return
        if (this.insertMenuAnchorEl && this.insertMenuAnchorEl.contains(t)) return
        this.closeInsertMenu()
      }
      document.addEventListener('click', this._onInsertMenuClickOutside, false)
      this._insertMenuClickOutsideBound = true
    },
    unbindInsertMenuClickOutside() {
      if (!this._insertMenuClickOutsideBound || !this._onInsertMenuClickOutside) return
      document.removeEventListener('click', this._onInsertMenuClickOutside, false)
      this._onInsertMenuClickOutside = null
      this._insertMenuClickOutsideBound = false
    },
    closeInsertMenu() {
      this.clearInsertMenuAnchor()
      this.openInsertMenu = { kind: '', sectionId: '', insertIndex: null }
    },
    sectionInsertIcon(type) {
      return resolveSectionInsertIcon(type)
    },
    selectSectionType(type) {
      const anchor = this.openInsertMenu.sectionId
      const idx = this.openInsertMenu.insertIndex
      const cfg = getAreaSectionInsertPolicy(anchor)
      if (cfg.mutation === 'global' || cfg.mutation === 'footer') {
        this.$emit('add-global-section', {
          type,
          area: cfg.mutation,
          index: typeof idx === 'number' ? idx : undefined
        })
      } else {
        this.$emit('add-section', {
          type,
          index: typeof idx === 'number' ? idx : undefined
        })
      }
      this.closeInsertMenu()
    },
    selectBlockType(sectionId, blockType) {
      const idx = this.openInsertMenu.insertIndex
      this.$emit('add-block', {
        sectionId,
        blockType,
        index: typeof idx === 'number' && !Number.isNaN(idx) ? idx : undefined
      })
      this.closeInsertMenu()
    },
    getSectionLabel(sectionId) {
      return this.getSectionDisplayLabel(sectionId)
    },
    getSectionType(sectionId) {
      return this.getSection(sectionId)?.type || ''
    },
    isSectionDisabled(sectionId) {
      return Boolean(this.getSection(sectionId)?.disabled)
    },
    isBlockDisabled(sectionId, blockId) {
      const section = this.getSection(sectionId)
      return Boolean(section?.blocks?.[blockId]?.disabled)
    },
    canDeleteBlock(sectionId) {
      return (this.getBlockOrder(sectionId) || []).length > 1
    },
    getSection(sectionId) {
      return (
        this.headerDsl.sections?.[sectionId] ||
        this.footerDsl.sections?.[sectionId] ||
        this.globalDsl.sections?.[sectionId] ||
        this.dsl.sections?.[sectionId] ||
        null
      )
    },
    getSectionDisplayLabel(sectionId) {
      const section = this.getSection(sectionId)
      if (!section) return ''
      return section.title || ''
    },
    getBlockPickerItems(sectionType) {
      return createBlockPickerItems(sectionType)
    },
    getBlockOrder(sectionId) {
      return this.localBlockOrders[sectionId] || []
    },
    getBlockLabel(section, blockId) {
      const block = section?.blocks?.[blockId]
      if (!block) return ''
      // const definition = getBlockDefinition(section.type, block.type)
      return block.title || ''
    },
    handleOrderChange() {
      this.$emit('reorder-sections', this.localOrder.slice())
    },
    handleBlockOrderChange(sectionId) {
      this.$emit('reorder-blocks', {
        sectionId,
        blockOrder: this.getBlockOrder(sectionId).slice()
      })
    }
  }
}
</script>

<style scoped>
/* 结构树选中行：主题辅色（--secondary）半透明填充，圆角继承自 rounded-lg */
.sp-structure-row-selected {
  background-color: color-mix(in srgb, hsl(var(--secondary)) 16%, transparent);
}

.sp-structure-row-selected:hover {
  background-color: color-mix(in srgb, hsl(var(--secondary)) 22%, transparent);
}

/* 分区 / 块之间：hover 出现虚线与「添加」胶囊（与 vuedraggable filter 配合避免误拖） */
.sp-structure-insert-gap {
  position: relative;
  display: flex;
  height: 6px;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.sp-structure-insert-gap__line {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 50%;
  margin-top: -1px;
  border-top: 1px dashed #2563eb;
  opacity: 0;
  transition: opacity 0.12s ease;
  pointer-events: none;
}

.sp-structure-insert-gap:hover .sp-structure-insert-gap__line {
  opacity: 1;
}

.sp-structure-insert-gap__btn {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  padding: 4px 12px;
  border: 0;
  border-radius: 9999px;
  background: #2563eb;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.25;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.12s ease;
}

.sp-structure-insert-gap:hover .sp-structure-insert-gap__btn {
  opacity: 1;
  pointer-events: auto;
}

.sp-structure-insert-gap__btn--block {
  font-size: 12px;
  padding: 4px 12px;
}
</style>
