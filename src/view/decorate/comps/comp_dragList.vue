<style lang="scss">
.comp-draglist {
  .drag-list {
    margin-bottom: 14px;

    .item-hd {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 6px;

      &-left {
        font-size: 24px;
      }
    }

    .comp-button {
      .el-button {
        padding-right: 8px !important;
      }

      .bc {
        i {
          float: right;
        }
      }
    }
  }

  .el-button--text {
    padding: 0px !important;
  }

  .el-divider--horizontal {
    margin: 10px 0;
  }

  .item-bd {
    flex: 1;
  }

  .item-fd {
    margin-left: 10px;
    max-width: 54px;
  }

  .icon-pen {
    font-size: 14px;
    margin-right: 6px;
  }

  .icon-bars {
    margin-right: 6px;
  }

  .icon-trash-alt1 {
    font-size: 15px;
  }
}
</style>
<template>
  <div class="comp-draglist">
    <draggable :list="localValue" :options="dragOptions" style="width: 100%" handle=".mover" @end="onMove">
      <div v-for="(item, index) in localValue" :key="`drag-item__${index}`" class="drag-list">
        <div class="item-hd">
          <div class="iten-hd-left">
            <span v-if="isMove" class="iconfont icon-bars mover" />
            <span v-if="showTitle">{{ title }}{{ index + 1 }}</span>
            <slot name="title" :data="item" :index="index" />
          </div>
          <div class="iten-hd-right">
            <i v-if="isEdit" class="iconfont icon-pen" @click="onEdit(item, index)" />
            <i v-if="isDelete" class="iconfont icon-trash-alt1" @click="onRemoveItem(index)" />
          </div>
        </div>
        <div class="item-bd">
          <slot name="body" :data="item" :index="index" />
        </div>
      </div>
      <el-button v-if="isShow && btnType == 'btn'" slot="footer" :type="type" size="small" class="btn-todo"
        @click="handleAddItem">
        {{
          btnText
        }}
      </el-button>
      <el-dropdown v-if="isShow && btnType == 'drop'" class="comp-button" @command="handleCommand">
        <el-button type="primary" size="small">
          <p class="bc">
            <span class="line">添加</span><i class="el-icon-arrow-down el-icon--right" />
          </p>
        </el-button>
        <!-- <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="horizontal">长热区</el-dropdown-item>
          <el-dropdown-item command="hotzone">热区</el-dropdown-item>
        </el-dropdown-menu> -->
      </el-dropdown>
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
    showTitle: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isMove: {
      type: Boolean,
      default: true
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    btnType: {
      type: String,
      default: 'btn'
    },
    type: {
      type: String,
      default: 'primary'
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
    onMove() {
      this.$emit('move')
    },
    onRemoveItem(index) {
      this.localValue.splice(index, 1)
      this.$emit('onDelete', index)
    },
    handleCommand(command) {
      this.$emit('onAddItem', command)
    },
  }
}
</script>
