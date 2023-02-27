<style lang="scss">
.picker-edit-board {
  padding: 18px 10px 10px 10px;
  display: flex;
  flex-wrap: wrap;
  .drag-container {
    display: flex;
    flex-wrap: wrap;
  }
  .board-item {
    margin: 0 10px 10px 0;
    position: relative;
    &:nth-child(7n + 7) {
      margin-right: 0;
    }
    .icon-quanping {
      position: absolute;
      top: 0;
      left: 2px;
    }
  }
  .btn-add {
    width: 120px;
    height: 120px;
    border: 1px dashed #cdcdcd;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
<template>
  <div class="picker-edit-board">
    <draggable
      class="drag-container"
      :list="localValue"
      :options="dragOptions"
      style="width: 100%"
      handle=".icon-quanping"
    >
      <div v-for="(item, index) in localValue" :key="`item__${index}`" class="board-item">
        <SpImage :src="item.imgUrl" width="120" height="120" />
        <i class="ecx-icon icon-quanping" />
      </div>
      <div class="btn-add">
        <i class="ecx-icon icon-jia" />
        <p>添加商品</p>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import BasePicker from './base'
export default {
  name: 'PickerEditBoard',
  components: {
    draggable
  },
  extends: BasePicker,
  config: {
    title: '查看商品'
  },
  props: ['value'],
  data() {
    return {
      localValue: [],
      dragOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      }
    }
  },
  created() {
    this.localValue = this.value.data
  },
  methods: {}
}
</script>
