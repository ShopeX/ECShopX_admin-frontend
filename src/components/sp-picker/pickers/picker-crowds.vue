<template>
  <div class="picker-crowds">
    <div class="max-h-[500px] overflow-y-auto pr-2.5 pl-2.5">
      <div
        v-for="category in tagCategories"
        :key="category.group_id"
        class="mb-6 pb-4 border-b border-[#e4e7ed] last:border-b-0"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="font-medium text-sm text-[#303133]">{{ category.group_name }}</span>
        </div>
        <CompTagList
          :list="getFormattedTags(category)"
          :tags-id="category.group_id"
          :selection-babel="true"
          :readonly="false"
          tag-size="small"
          :no-background="true"
          @add-tag="(val) => handleAddTags(category, val)"
          @tag-select="(tag, index) => handleTagSelect(category, tag, index)"
        />
      </div>
      <div v-if="!loading && tagCategories.length === 0" class="text-gray-400 text-sm py-4">
        {{ emptyText }}
      </div>
      <div v-if="loading" class="text-gray-400 text-sm py-4">{{ loadingText }}</div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { i18n } from '@/i18n'
import BasePicker from './base'
import CompTagList from '@/views/members/components/CompTagList'

export default {
  name: 'PickerCrowds',
  extends: BasePicker,
  components: {
    CompTagList
  },
  config: {
    title: ''
  },
  props: ['value'],
  computed: {
    emptyText() {
      return i18n.t('394573fc.f44b57')
    },
    loadingText() {
      return i18n.t('394573fc.26b5bd')
    },
    crowdsSetting() {
      return {
        columns: [
          { name: 'ID', key: 'tag_id', width: 80 },
          { name: i18n.t('394573fc.341fe8'), key: 'tag_name' }
        ]
      }
    }
  },
  data() {
    return {
      tagCategories: [],
      selectedTagMap: {}, // { group_id: [tag1, tag2, ...] }
      loading: false
    }
  },
  created() {
    this.$options.config.title = i18n.t('394573fc.d2a769')
    this.initSelectedFromValue()
  },
  mounted() {
    this.loadTagCategories()
  },
  methods: {
    initSelectedFromValue() {
      this.selectedTagMap = {}
      const data = this.value && this.value.data ? cloneDeep(this.value.data) : []
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((tag) => {
          const groupId = tag.group_id
          if (!this.selectedTagMap[groupId]) {
            this.$set(this.selectedTagMap, groupId, [])
          }
          this.selectedTagMap[groupId].push(tag)
        })
      }
    },
    async loadTagCategories() {
      this.loading = true
      try {
        const { list = [] } = await this.$api.member.getTagGroupList({
          page: 1,
          page_size: 100,
          country_code: 'zh-CN'
        })
        this.tagCategories = list
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    getFormattedTags(category) {
      let tags = category.tags || []
      const groupId = category.group_id
      if (typeof tags === 'string') {
        try {
          tags = JSON.parse(tags)
        } catch (e) {
          return []
        }
      }
      return (Array.isArray(tags) ? tags : []).map((tag) => {
        const selected = (this.selectedTagMap[groupId] || []).some(
          (t) => String(t.tag_id) === String(tag.tag_id)
        )
        return {
          selected,
          group_id: groupId,
          ...tag
        }
      })
    },
    /** 与 CompTagsMore 一致：点击「+ 添加」输入标签名后，调用 saveTag 创建新标签并刷新列表 */
    async handleAddTags(category, value) {
      try {
        await this.$api.member.saveTag({
          group_id: category.group_id,
          tag_name: value,
          tag_color: '#ff1939',
          font_color: '#ffffff'
        })
        await this.loadTagCategories()
        this.$message.success(i18n.t('394573fc.78ec37'))
      } catch (error) {
        console.error(error)
      }
    },
    handleTagSelect(category, tag, index) {
      const groupId = category.group_id
      if (!this.selectedTagMap[groupId]) {
        this.$set(this.selectedTagMap, groupId, [])
      }
      const list = this.selectedTagMap[groupId]
      const idx = list.findIndex((t) => String(t.tag_id) === String(tag.tag_id))
      if (tag.selected && idx === -1) {
        list.push({
          group_id: groupId,
          tag_id: tag.tag_id,
          tag_name: tag.tag_name,
          tag_color: tag.tag_color,
          font_color: tag.font_color
        })
      } else if (!tag.selected && idx > -1) {
        list.splice(idx, 1)
      }
      this.flushSelection()
    },
    flushSelection() {
      const all = []
      Object.keys(this.selectedTagMap).forEach((groupId) => {
        ;(this.selectedTagMap[groupId] || []).forEach((tag) => {
          all.push({ ...tag, group_id: groupId })
        })
      })
      this.updateVal(all)
    }
  }
}
</script>
