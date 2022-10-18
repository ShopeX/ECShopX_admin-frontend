<style lang="scss">
.sp-image-picker {
  width: 80px;
  height: 80px;
  border: 1px solid #d9d9d9;
  position: relative;
  .placeholder {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icon-plus {
    font-size: 18px;
    color: #d9d9d9;
  }
  .img-content {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }
  &:hover {
    .image-meta {
      display: block;
    }
  }
  .image-meta {
    height: 20px;
    width: 100%;
    line-height: 20px;
    text-align: center;
    color: white;
    background-color: rgba(0, 0, 0, 0.4);
    display: none;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    cursor: default;
  }
}
</style>
<template>
  <div class="sp-image-picker">
    <img v-if="value && value.url" class="img-content" :src="value.url">
    <div v-else class="placeholder" @click="handleSelectImage">
      <i class="iconfont icon-plus" />
      <p>添加图片</p>
    </div>
    <span v-if="value && value.url" class="image-meta" @click="handleSelectImage">更换图片</span>
  </div>
</template>

<script>
export default {
  name: 'SpImagePicker',
  props: ['info', 'value'],
  created() {},
  methods: {
    async handleSelectImage() {
      const { data } = await this.$picker.image({
        data: this.value
      })
      this.$emit('input', data)
      this.$emit('onChange', data)
    }
  }
}
</script>
