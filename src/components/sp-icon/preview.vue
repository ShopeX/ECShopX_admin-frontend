<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="icon-preview">
    <div v-for="icon in icons" :key="icon" class="icon-item" @click="copyIconName(icon)">
      <sp-icon :name="icon" :size="24" />
      <span class="icon-name">{{ icon }}</span>
    </div>
  </div>
</template>

<script>
import SpIcon from './index.vue'

export default {
  name: 'IconPreview',
  components: {
    SpIcon
  },
  data() {
    return {
      icons: []
    }
  },
  created() {
    // 获取所有 SVG 文件
    const svgFiles = require.context('@/assets/svgs', false, /\.svg$/)
    this.icons = svgFiles.keys().map(key => {
      return key.replace(/^\.\/(.*?)\.svg$/, '$1')
    })
  },
  methods: {
    copyIconName(name) {
      navigator.clipboard.writeText(name)
      this.$message.success(`Copied: ${name}`)
    }
  }
}
</script>

<style scoped>
.icon-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  padding: 16px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-item:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
}

.icon-name {
  font-size: 12px;
  color: #666;
}
</style>
