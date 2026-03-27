<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-dialog
      :title="title || $t('ee0ad640.4f1e39')"
      :visible.sync="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :append-to-body="true"
      :z-index="3001"
      @close="handleClose"
    >
      <div class="max-h-[500px] overflow-y-auto pr-2.5">
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
            :readonly="IS_DISTRIBUTOR()"
            tag-size="small"
            :no-background="true"
            @add-tag="(val) => handleAddTags(category, val)"
            @tag-select="(tag, index) => handleTagSelect(category, tag, index)"
          />
        </div>
      </div>

      <div
        slot="footer"
        :class="{
          'flex justify-between items-center': !IS_DISTRIBUTOR(),
          'flex justify-end items-center': IS_DISTRIBUTOR()
        }"
      >
        <el-button
          type="text"
          @click="showAddTagDialog"
          class="text-[#409EFF]"
          v-if="!IS_DISTRIBUTOR()"
        >
          {{ $t('ee0ad640.19214e') }}
        </el-button>
        <div>
          <el-button @click="handleClose">{{ $t('ee0ad640.c08ab9') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ $t('ee0ad640.aa7527') }}</el-button>
        </div>
      </div>
    </el-dialog>
    <CompAddTag
      :visible.sync="addTagDialogVisible"
      :form="addTagForm"
      @submit="handleAddTagGroup"
      @close="addTagDialogVisible = false"
    />
  </div>
</template>

<script>
import { getTagCategoryList, createTagCategory } from '@/api/member'
import CompAddTag from './CompAddTag'
import CompTagList from './CompTagList'

export default {
  name: 'CompTagsMore',
  components: {
    CompAddTag,
    CompTagList
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    selectedTags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      tagCategories: [],
      selectedTagMap: {}, // { group_id: [tag1, tag2, ...] }
      addTagDialogVisible: false,
      addTagForm: {
        group_id: '',
        group_name: '',
        tags: []
      }
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.loadTagCategories()
        this.initSelectedTags()
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    selectedTags: {
      handler(newVal) {
        this.initSelectedTags()
      },
      deep: true
    }
  },
  methods: {
    async loadTagCategories() {
      try {
        const { list = [] } = await this.$api.member.getTagGroupList({
          page: 1,
          page_size: 100
        })
        this.tagCategories = list
      } catch (error) {
        console.log(error)
      }
    },
    initSelectedTags() {
      // 初始化已选标签
      this.selectedTagMap = {}
      if (this.selectedTags && this.selectedTags.length > 0) {
        this.selectedTags.forEach((tag) => {
          const groupId = tag.group_id
          if (!this.selectedTagMap[groupId]) {
            this.$set(this.selectedTagMap, groupId, [])
          }
          this.selectedTagMap[groupId].push(tag)
        })
      }
    },
    getFormattedTags(category) {
      const tags = category.tags || []
      const groupId = category.group_id

      return tags.map((tag) => {
        let tagObj = {
          selected: this.selectedTagMap[groupId]?.some(
            (selectedTag) => selectedTag.tag_id == tag.tag_id
          ),
          group_id: groupId,
          ...tag
        }
        return tagObj
      })
    },
    handleTagSelect(category, tag, index) {
      // 处理标签选择
      const groupId = category.group_id
      if (!this.selectedTagMap[groupId]) {
        this.$set(this.selectedTagMap, groupId, [])
      }

      const existingIndex = this.selectedTagMap[groupId]?.findIndex(
        (selectedTag) => tag.tag_id == selectedTag.tag_id
      )
      console.log('existingIndex', existingIndex)
      if (tag.selected && existingIndex == -1) {
        // 选中
        this.selectedTagMap[groupId].push(tag)
      } else if (!tag.selected && existingIndex > -1) {
        // 取消选中
        this.selectedTagMap[groupId].splice(existingIndex, 1)
      }
    },
    showAddTagDialog() {
      this.addTagForm = {
        group_id: '',
        group_name: '',
        tags: [{ tag_name: '', tag_color: '', font_color: '' }]
      }
      this.addTagDialogVisible = true
    },
    async handleAddTagGroup(submitData) {
      try {
        await this.$api.member.createTagGroup(submitData)
        this.$message({
          type: 'success',
          message: this.$t('ee0ad640.04a691')
        })
        this.addTagDialogVisible = false
        await this.loadTagCategories()
      } catch (error) {
        console.log(error)
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    handleConfirm() {
      // 收集所有选中的标签
      const allSelectedTags = []
      Object.keys(this.selectedTagMap).forEach((groupId) => {
        this.selectedTagMap[groupId].forEach((tag) => {
          allSelectedTags.push({
            group_id: groupId,
            tag_id: tag.tag_id,
            tag_name: tag.tag_name,
            tag_color: tag.tag_color,
            font_color: tag.font_color
          })
        })
      })
      this.$emit('confirm', allSelectedTags)
      this.handleClose()
    },
    async handleAddTags(row, value) {
      try {
        const params = {
          group_id: row.group_id,
          tag_name: value,
          tag_color: '#ff1939',
          font_color: '#ffffff'
        }
        await this.$api.member.saveTag(params)
        await this.loadTagCategories()
        this.$message({
          type: 'success',
          message: this.$t('ee0ad640.78ec37')
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
