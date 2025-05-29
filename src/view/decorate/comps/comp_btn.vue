<template>
    <div class="comp-btn">
        <div class="comp-btn-color">
            <div class="comp-btn-color-item">
                <span>按钮颜色</span>
                <el-color-picker v-model="localValue.color" />
            </div>
            <div class="comp-btn-color-item">
                <span>文字颜色</span>
                <el-color-picker v-model="localValue.textColor" />
            </div>
        </div>
        <div class="comp-btn-style" v-if="showImage">
            <div class="comp-btn-style-item">
                <span>按钮图</span>
                <sp-image-picker v-model="localValue.image" size="small" />
            </div>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
    name: 'CompBtn',
    props: {
        value: {
            type: Object,
            default: () => ({})
        },
        showImage:{
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            localValue: cloneDeep(this.value)
        }
    },
    watch: {
    localValue: {
      handler(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      deep: true
    }
  },
}
</script>

<style lang="scss" scoped>
.comp-btn {
    width: 100%;
    height: 100%;
    &-color {
        display: flex;
        gap: 10px;
        &-item {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }
    
}
</style>