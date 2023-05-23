<style lang="scss">
.comp-button {
  padding: 0px !important;
  position: relative;
  :hover {
    .ecx-icon {
      display: block;
    }
  }
  .icon-qingchuFilled {
    position: absolute;
    top: -16px;
    right: 2px;
    cursor: default;
    background-color: #fff;
    display: none;
  }
  .icon-sousuo {
    position: absolute;
    top: -16px;
    right: 18px;
    cursor: default;
    background-color: #fff;
    display: none;
  }
  .el-button-group {
    .el-button:first-child {
      &:focus,
      &:hover {
        border: 1px solid #dcdfe6;
      }
    }
    .el-dropdown__caret-button {
      &:focus,
      &:hover {
        border-top: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
      }
    }
  }
}
</style>
<template>
  <!-- <el-button class="comp-button" :disabled="disabled" size="small" plain @click="handleClick">

    <i v-if="value > 0" class="ecx-icon icon-sousuo" @click.stop="handleRemove" />
    <i v-if="value > 0" class="ecx-icon icon-qingchuFilled" @click.stop="handleRemove" />
  </el-button> -->

  <el-dropdown
    class="comp-button"
    size="small"
    split-button
    plain
    :disabled="disabled"
    @click="handleClick"
    @command="handleCommand"
  >
    {{ value > 0 ? getFormatValue() : placeholder }}
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="clear" :disabled="value == 0">清除</el-dropdown-item>
      <el-dropdown-item v-if="viewBtn" command="view" :disabled="value == 0">查看</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
export default {
  name: 'CompButton',
  props: {
    value: {
      type: Number,
      default: 0
    },
    format: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    viewBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    handleCommand(command) {
      if (command == 'clear') {
        this.$emit('remove')
      } else if (command == 'view') {
        this.$emit('view')
      }
    },
    getFormatValue() {
      return this.format.replace(/\{0\}/, this.value)
    }
  }
}
</script>
