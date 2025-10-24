<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<style lang="scss">
.comp-todolist {
  .todo-list {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .item-bd {
    flex: 1;
  }

  .item-fd {
    margin-left: 10px;
    width: 58px;
  }

  .icon-shoudongpaixu,
  .icon-paiban {
    margin-right: 6px;
  }
  .icon-guanbi {
    font-size: 13px;
  }
}
</style>
<template>
  <div class="comp-todolist">
    <draggable :list="localValue" :options="dragOptions" style="width: 100%" handle=".mover">
      <div v-for="(item, index) in localValue" :key="`todo-item__${index}`" class="todo-list">
        <div class="item-bd">
          <slot name="body" :data="item" :index="index" />
        </div>
        <div class="item-fd">
          <i v-if="isEdit" class="ecx-icon icon-paiban" @click="onEdit(item, index)" />
          <i class="ecx-icon icon-shoudongpaixu mover" />
          <i
            v-if="index > min - 1 && isShowDel"
            class="ecx-icon icon-guanbi"
            @click="onRemoveItem(index)"
          />
        </div>
      </div>
      <el-button slot="footer" type="text" @click="handleAddItem">{{ btnText }}</el-button>
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
    }
  }
}
</script>
