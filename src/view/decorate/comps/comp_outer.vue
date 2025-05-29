<template>
  <div class="comp-outer">
    <div class="background-options">
      <div class="option-item">
        <span class="option-label">背景色</span>
        <div class="color-picker">
          <el-color-picker v-model="localValue.color" size="small" />
        </div>
      </div>
      <div class="option-item">
        <span class="option-label">背景图</span>
        <div class="image-picker">
          <sp-image-picker v-model="localValue.image" size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttrOuter',
  props: {
    value: {
      type: Object,
      default: () => ({
        color: '#f8f8f8',
        image: ''
      })
    },
    uuid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: {
        color: this.value.color || '#f8f8f8',
        image: this.value.image || ''
      }
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
  mounted() {
    this.localValue = {
      color: this.value.color || '#f8f8f8',
      image: this.value.image || ''
    }
  },
}
</script>

<style lang="scss" scoped>
.comp-outer {
  margin-bottom: 15px;

  .background-options {
    display: flex;

    .option-item {
      margin-right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .option-label {
        font-size: 10px;
        color: #606266;
        margin-bottom: 10px;
      }

      .color-picker {}

    }
  }
}
</style>
<style lang="scss">
.comp-outer {
  .sp-image-picker {
    .image-item {
      margin: 0px !important;
    }
  }
}
</style>