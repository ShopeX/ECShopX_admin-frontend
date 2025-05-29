<template>
  <div class="inner-tag-input" @click="focusInput">
    <!-- 输入框容器 -->
    <div class="input-container" :class="{ 'is-focus': isFocus }">
      <!-- 标签展示 -->
      <div class="tags-wrapper">
        <el-tag
          v-for="(tag, index) in value"
          :key="index"
          closable
          size="small"
          @close="removeTag(index)"
          class="input-tag"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 隐藏的实际输入框 -->
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="inner-input"
        :placeholder="value.length === 0 ? placeholder : ''"
        @keyup.enter="addTag"
        @focus="isFocus = true"
        @blur="
          () => {
            isFocus = false
            if (inputValue) {
              addTag()
            }
          }
        "
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InnerTagInput',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '输入后按回车添加'
    }
  },
  data() {
    return {
      inputValue: '',
      isFocus: false
    }
  },
  methods: {
    addTag() {
      const _value = this.inputValue.trim()
      if (!_value) return

      this.$emit('input', [...this.value, _value])

      this.inputValue = ''
      this.$nextTick(() => {
        this.$refs.inputRef.focus()
      })
    },
    removeTag(index) {
      const newTags = [...this.value]
      newTags.splice(index, 1)
      this.$emit('input', newTags)
    },
    focusInput() {
      this.$refs.inputRef.focus()
    }
  }
}
</script>

<style scoped>
.inner-tag-input {
  position: relative;
  font-size: 14px;
}

.input-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 40px;
  padding: 2px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: border-color 0.2s;
  cursor: text;
}

.input-container.is-focus {
  border-color: #409eff;
}

.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px 0;
}

.input-tag {
  margin: 2px 0;
}

.inner-input {
  flex: 1;
  min-width: 120px;
  height: 32px;
  border: none;
  outline: none;
  padding: 0 4px;
  font-size: 14px;
}

.inner-input::placeholder {
  color: #c0c4cc;
}

/* 覆盖ElementUI默认样式 */
.el-tag {
  margin: 2px 4px 2px 0;
}
</style>
