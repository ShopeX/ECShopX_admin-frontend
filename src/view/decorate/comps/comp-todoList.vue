<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-todolist {
  width: 100%;
  .todo-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 10px;
    background-color: #fafafa;
  }

  .item-bd {
    flex: 1;
    width: 100%;
  }

  .item-fd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .item-fd-left {
    display: flex;
    align-items: center;
  }
  
  .item-fd-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon-shoudongpaixu,
  .icon-paiban {
    margin-right: 6px;
  }
  .icon-guanbi {
    font-size: 13px;
  }
  .add-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
<template>
  <div class="comp-todolist">
    <draggable :list="localValue" :options="dragOptions" style="width: 100%" handle=".mover" @end="onDragEnd">
      <div v-for="(item, index) in localValue" :key="`todo-item__${index}`" class="todo-list">
        <div class="item-fd">
          <div class="item-fd-left">
            <i class="ecx-icon icon-shoudongpaixu mover" />
            <slot name="header" :data="item" :index="index" />
          </div>
          <div class="item-fd-right">
            <i v-if="isEdit" class="ecx-icon icon-paiban" @click="onEdit(item, index)" />
            <i
              v-if="index > min - 1 && isShowDel"
              class="el-icon-delete"
              @click="onRemoveItem(index)"
            />
          </div>
        </div>
        <div class="item-bd">
          <slot name="body" :data="item" :index="index" />
        </div>
      </div>
      <el-button slot="footer" type="primary" @click="handleAddItem" class="add-btn">{{ btnText }}</el-button>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'CompTodoList',
  components: {
    draggable
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    },
    btnText: {
      type: String,
      default: '添加'
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isShowDel: {
      type: Boolean,
      default: true
    }
  },
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
  watch: {
    value: {
      handler(nVal) {
        this.localValue = this.value
      },
      deep: true,
      immediate: true
    },
    localValue: {
      handler() {
        // 当 localValue 变化时（如拖拽、删除），emit 给父组件
        this.$emit('input', this.localValue)
      },
      deep: true
    }
  },
  methods: {
    handleAddItem() {
      if (this.localValue.length >= this.max) {
        this.$message.error(`最多添加${this.max}条`)
        return
      }
      this.$emit('onAddItem')
    },
    onEdit(item, index) {
      this.$emit('edit', { item, index })
    },
    onRemoveItem(index) {
      this.localValue.splice(index, 1)
      // 删除后会自动触发 localValue 的 watch，emit 'input' 事件
    },
    onDragEnd() {
      // 拖拽结束后，localValue 已经更新，watch 会自动 emit
    }
  }
}
</script>
