<!--
  Web 端商城 — 导航菜单列表（ThemeBundle /web-menus）
  新增 → /decoration/web-menu/create；编辑 → /decoration/web-menu/:id；删除：Finder api
-->
<template>
  <SpPage>
    <SpFormPlus
      ref="searchForm"
      v-model="searchParams"
      :form-items="searchFormItems"
      form-type="searchForm"
      @submit="onSearch"
    />

    <div class="action-container mt-4">
      <el-button type="primary" @click="goCreate">{{ $t('738edee2.2f39c3') }}</el-button>
    </div>

    <SpFinder
      ref="finder"
      url="/web-menus"
      fixed-row-action
      row-actions-width="180px"
      no-selection
      row-key="id"
      :setting="finderSetting"
      :hooks="{ beforeSearch: beforeSearch }"
    />
  </SpPage>
</template>

<script>
import { createSetting } from '@shopex-ui/finder'
import SpFormPlus from '@/components/sp-form-plus'

export default {
  name: 'WebMenuIndex',
  components: { SpFormPlus },
  data() {
    return {
      searchParams: { name: '' }
    }
  },
  computed: {
    searchFormItems() {
      return [
        {
          fieldName: 'name',
          label: this.$t('738edee2.8ee9f2'),
          component: 'input',
          componentProps: {
            placeholder: this.$t('738edee2.4cd562'),
            clearable: true
          }
        }
      ]
    },
    finderSetting() {
      return createSetting({
        columns: [
          { name: 'ID', key: 'id', width: 80 },
          { name: this.$t('738edee2.ff36f6'), key: 'name' },
          {
            name: this.$t('738edee2.7419d6'),
            key: 'top_level_item_names',
            minWidth: 200,
            render: (h, scope) => {
              const raw = scope.row.top_level_item_names
              const text = raw != null && String(raw).trim() !== '' ? String(raw).trim() : '—'
              return h(
                'span',
                {
                  style: {
                    color: text === '—' ? '#909399' : '#606266',
                    whiteSpace: 'normal',
                    wordBreak: 'break-all'
                  },
                  attrs: text !== '—' ? { title: text } : {}
                },
                text
              )
            }
          }
        ],
        actions: [
          {
            name: this.$t('738edee2.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => row && this.$router.push(`/decoration/web-menu/${row.id}`)
            }
          },
          {
            name: this.$t('738edee2.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'api',
              path: '/web-menus/{id}',
              method: 'delete',
              confirm: true,
              confirmTip: (rows) => {
                const row = Array.isArray(rows) ? rows[0] : rows
                return row ? this.$t('738edee2.1a06dc', { name: row.name }) : ''
              }
            }
          }
        ]
      })
    }
  },
  methods: {
    goCreate() {
      this.$router.push('/decoration/web-menu/create')
    },
    onSearch() {
      this.$refs.finder.refresh(true)
    },
    beforeSearch(query) {
      const q = { ...query, ...this.searchParams }
      if (q.page_size == null && q.pageSize != null) {
        q.page_size = q.pageSize
      }
      return q
    }
  }
}
</script>
