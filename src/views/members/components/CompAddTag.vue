<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-dialog
    :title="isEdit ? '编辑标签组' : '新建标签组'"
    :visible.sync="dialogVisible"
    width="700px"
    :close-on-click-modal="false"
    :append-to-body="true"
    :z-index="3002"
    @close="handleClose"
  >
    <el-form ref="tagForm" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="标签组名称" prop="group_name">
        <el-input
          v-model="formData.group_name"
          placeholder="请输入标签组名称"
          maxlength="15"
          show-word-limit
          class="w-[300px]"
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags" required>
        <div
          v-for="(tagItem, index) in formData.tags"
          :key="index"
          class="mb-2.5 flex items-center"
        >
          <el-input
            v-model="tagItem.tag_name"
            placeholder="请输入内容"
            maxlength="10"
            show-word-limit
            class="flex-1 mr-2.5"
          />
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="removeTag(index,tagItem)"
            :disabled="formData.tags.length <= 1"
            class="text-[#F56C6C] text-base"
          />
          <span class="text-sm ml-2">标签颜色：</span>
          <el-color-picker
            v-model="tagItem.tag_color"
            size="small"
          />
          <span class="text-sm ml-2">字体颜色：</span>
          <el-color-picker
            v-model="tagItem.font_color"
            size="small"
          />
        </div>
        <el-button
          type="text"
          icon="el-icon-plus"
          @click="addTag"
          class="text-[#409EFF] pl-0"
        >
          添加标签
        </el-button>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'CompAddTag',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      formData: {
        group_id: '',
        group_name: '',
        tags: []
      },
      deleteTagList: [],
      formRules: {
        group_name: [
          { required: true, message: '请输入标签组名称', trigger: 'blur' },
          { max: 15, message: '标签组名称不能超过15个字符', trigger: 'blur' }
        ],
        tags: [
          {
            validator: (rule, value, callback) => {
              const tags = value.filter(tag => tag?.tag_name !== '')
              callback(tags.length === 0 ? new Error('至少需要一个标签') : undefined)
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible(newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.initFormData()
      }
    },
    dialogVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    initFormData() {
      // 初始化表单数据
      this.formData = JSON.parse(JSON.stringify(this.form))
    },
    addTag() {
      this.formData.tags.push({
        tag_name: '',
        tag_color: '',
        font_color: ''
      })
    },
    removeTag(index, tagItem) {
      this.deleteTagList.push(tagItem.tag_id)
      this.formData.tags.splice(index, 1)
    },
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    handleSubmit() {
      this.$refs.tagForm.validate((valid) => {
        if (!valid) return false
        const submitData = {
          group_id: this.isEdit ? this.formData.group_id : undefined,
          group_name: this.formData.group_name,
          tags: this.formData.tags.map(tag => ({
            tag_name: tag.tag_name,
            tag_color: tag.tag_color || '',
            font_color: tag.font_color || '',
            tag_id: tag.tag_id || 0
          })),
          deleteids: this.isEdit ? this.deleteTagList : undefined
        }
        this.$emit('submit', submitData)
      })
    }
  }
}
</script>


