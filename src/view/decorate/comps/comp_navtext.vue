<template>
  <div class="comp-inner">
    <div v-if="showtype" class="background-type">
      <el-radio-button v-model="localShowType" :label="'default'" @change="handleShowTypeChange">
        <span class="type-label">默认</span>
      </el-radio-button>
      <el-radio-button v-model="localShowType" :label="'custom'" @change="handleShowTypeChange">
        <span class="type-label">自定义</span>
      </el-radio-button>
    </div>
    <div v-if="localShowType !== 'default'" class="background-type">
      <el-radio-button v-model="localType" :label="'text'" @change="handleTypeChange">
        <span class="type-label">文字</span>
      </el-radio-button>
      <el-radio-button v-model="localType" :label="'image'" @change="handleTypeChange">
        <span class="type-label">图片</span>
      </el-radio-button>
    </div>
    <div v-if="localShowType !== 'default'" class="color-pickers">
      <template v-if="localType === 'text'">
        <div class="color-item">
          <el-input v-model="localValue.text" size="small" :maxlength="maxlength" @change="handleChange" />
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
        type: 'text',
        text: '',
        image: ''
      })
    },
    showtype: {
      type: Boolean,
      default: false
    },
    showImage: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 10
    },
    defaultImage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localType: this.value.type || 'text',
      localShowType: this.value.showtype || 'custom',
      localValue: {
        type: this.value.type || 'text',
        text: this.value.text || '',
        image: this.value.image || ''
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.localType = val.type || 'text'
        this.localValue = {
          type: val.type || 'text',
          text: val.text || '',
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
    },
    handleShowTypeChange(type) {
      this.localShowType = type
      this.localValue.showtype = type
      if(type=='default'){
          this.localValue.text = ''
          this.localValue.image = this.defaultImage
          this.localValue.type = 'image'
      }
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
      font-size: 10px;
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