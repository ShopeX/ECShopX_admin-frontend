<style lang="scss">
.comp-todolist {
  .todo-list {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  // .item-bd {
  //   flex: 1;
  // }
  .item-fd {
    margin-left: 10px;
  }

  .icon-th-list {
    margin-right: 8px;
  }
}
</style>
<template>
  <div class="comp-todolist">
    <draggable :list="localValue" :options="dragOptions" style="width:100%" handle=".mover">
      <div v-for="(item, index) in localValue" :key="`todo-item__${index}`" class="todo-list">
        <div class="item-bd">
          <slot name="myslot" :data="item" :index="index" />
        </div>
        <div class="item-fd">
          <i class="iconfont icon-th-list mover" />
          <i v-if="index > 0" class="iconfont el-icon-close" @click="onRemoveItem(index)" />
        </div>
      </div>
      <el-button slot="footer" type="text" @click="handleAddItem">添加</el-button>
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
    max: {
      type: Number,
      default: 5
    }
  },
  data() {
    return {
      localValue: [],
      dragOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
    }
  },
  created() {
    this.localValue = this.value
  },
  methods: {
    handleAddItem() {
      if(this.localValue.length>=this.max){
        this.$message.warning(`最多添加${this.max}条`)
        return
      }
      this.$emit('onAddItem')
    },
    onRemoveItem(index) {
      this.localValue.splice(index, 1)
    }
  }
}
</script>
