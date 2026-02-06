<template>
  <div class="layout-selector">
    <el-tooltip
      v-for="(option, index) in options"
      :key="index"
      :content="option.label"
      placement="top"
      effect="dark"
    >
      <div
        class="layout-option"
        :class="{ active: value === option.value }"
        @click="handleSelect(option.value)"
      >
        <div class="layout-icon">
          <!-- 一行N个（可滑动） -->
          <svg
            v-if="option.value === 'default'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="1" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="1" y1="18" x2="7" y2="18" stroke="currentColor" stroke-width="1.5" />
            <rect x="9" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" stroke-width="1.5" />
            <rect x="17" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="17" y1="18" x2="23" y2="18" stroke="currentColor" stroke-width="1.5" />
            <!-- 右侧箭头表示可滑动 -->
            <path
              d="M22 12 L20 10 M22 12 L20 14"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <!-- 一行一个 -->
          <svg
            v-else-if="option.value === 'one'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="2" y="4" width="20" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <!-- 一行两个 -->
          <svg
            v-else-if="option.value === 'two'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="2" y="4" width="9" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="2" y1="18" x2="11" y2="18" stroke="currentColor" stroke-width="1.5" />
            <rect x="13" y="4" width="9" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="13" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <!-- 一行三个 -->
          <svg
            v-else-if="option.value === 'three'"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="1" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="1" y1="18" x2="7" y2="18" stroke="currentColor" stroke-width="1.5" />
            <rect x="9" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="9" y1="18" x2="15" y2="18" stroke="currentColor" stroke-width="1.5" />
            <rect x="17" y="4" width="6" height="12" rx="2" fill="currentColor" opacity="0.3" />
            <line x1="17" y1="18" x2="23" y2="18" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'CompLayoutSelector',
  props: {
    value: {
      type: String,
      default: 'two'
    },
    options: {
      type: Array,
      default: () => [
        { label: '一行一个', value: 'one' },
        { label: '一行两个', value: 'two' },
        { label: '一行三个', value: 'three' },
        { label: '可滑动', value: 'default' }
      ]
    }
  },
  methods: {
    handleSelect(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-selector {
  display: flex;
  flex-wrap: wrap;
  padding: 12px 0;
}

.layout-option {
  flex: 1;
  height: 40px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.active {
    border-color: var(--el-color-primary);
    background: #ecf5ff;

    .layout-icon {
      color: var(--el-color-primary);
    }
  }

  .layout-icon {
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
