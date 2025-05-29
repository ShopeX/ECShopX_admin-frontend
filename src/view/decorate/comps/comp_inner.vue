<template>
  <div class="comp-inner">
    <div class="background-type">
      <el-radio v-model="localType" :label="'solid'" @change="handleTypeChange">
        <span class="type-label">单色</span>
      </el-radio>
      <el-radio v-model="localType" :label="'gradient'" @change="handleTypeChange">
        <span class="type-label">上下渐变色</span>
      </el-radio>
      <el-radio v-if="showImage" v-model="localType" :label="'image'" @change="handleTypeChange">
        <span class="type-label">图片</span>
      </el-radio>
    </div>
    <div class="color-pickers">
      <template v-if="localType === 'solid'">
        <div class="color-item">
          <el-color-picker v-model="localValue.color" size="small" @change="handleChange" />
        </div>
      </template>
      <template v-else-if="localType === 'gradient'">
        <div class="color-item">
          <el-color-picker v-model="localValue.startColor" size="small" @change="handleChange" />
        </div>
        <div class="color-item">
          <el-color-picker v-model="localValue.endColor" size="small" @change="handleChange" />
        </div>
      </template>
      <template v-else-if="localType === 'image'">
        <div class="color-item">
          <sp-image-picker v-model="localValue.image" size="small" @onChange="handleChange" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttrInner',
  props: {
    value: {
      type: Object,
      default: () => ({
        type: 'solid',
        color: '#ffffff',
        startColor: '#ffffff',
        endColor: '#ffffff',
        image: ''
      })
    },
    showImage: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localType: this.value.type || 'solid',
      localValue: {
        type: this.value.type || 'solid',
        color: this.value.color || '#ffffff',
        startColor: this.value.startColor || '#ffffff',
        endColor: this.value.endColor || '#ffffff',
        image: this.value.image || ''
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.localType = val.type || 'solid'
        this.localValue = {
          type: val.type || 'solid',
          color: val.color || '#ffffff',
          startColor: val.startColor || '#ffffff',
          endColor: val.endColor || '#ffffff',
          image: val.image || ''
        }
      },
      deep: true
    }
  },
  methods: {
    handleTypeChange(type) {
      this.localValue.type = type
      this.handleChange()
    },
    handleChange(e) {
      console.log('handleChange', e)
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-inner {
  margin-bottom: 15px;

  .background-type {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    .type-label {
      font-size: 14px;
      color: #606266;
      margin-right: 5px;
    }
    
    .el-radio {
      margin-right: 15px;
    }
  }
  
  .color-pickers {
    display: flex;
    
    .color-item {
      margin-right: 10px;
    }
  }
}
</style>