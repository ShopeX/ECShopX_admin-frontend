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
.sp-select-shop {
  display: inline-block;
  width: 100%;
  .el-icon-arrow-down {
    &.is-reverse {
      transition: transform 0.3s;
      font-size: 14px;
      transform: rotateZ(180deg);
    }
  }
}
</style>

<template>
  <div
    ref="reference"
    v-clickoutside="clickOutSide"
    class="sp-select-shop"
    @mouseenter="inputHover = true"
    @mouseleave="inputHover = false"
    @click="toggleDropDownVisible(true)"
  >
    <el-input readonly :value="selectValue ? selectValue.name : ''" :placeholder="placeholder">
      <template slot="suffix">
        <i
          v-if="clearBtnVisible"
          key="clear"
          class="el-input__icon el-icon-circle-close"
          @click.stop="handleClear"
        />
        <i
          v-else
          key="arrow-down"
          :class="['el-input__icon', 'el-icon-arrow-down', dropDownVisible && 'is-reverse']"
        />
      </template>
    </el-input>
    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div v-show="dropDownVisible" ref="popper" :class="['el-popper', 'el-cascader__dropdown']">
        <SpSelectShopPanel
          ref="panel"
          @visible-change="visibleChange"
          @expand-change="expandChange"
          @change="onChange"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Popper from 'element-ui/src/utils/vue-popper'
import Clickoutside from 'element-ui/src/utils/clickoutside'

const PopperMixin = {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    appendToBody: Popper.props.appendToBody,
    visibleArrow: {
      type: Boolean,
      default: true
    },
    arrowOffset: Popper.props.arrowOffset,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    popperOptions: Popper.props.popperOptions
  },
  methods: Popper.methods,
  data: Popper.data,
  beforeDestroy: Popper.beforeDestroy
}

export default {
  name: 'SpSelectShop',
  directives: { Clickoutside },
  mixins: [PopperMixin],
  props: {
    value: [Number, String],
    placeholder: String,
    clearable: Boolean
  },
  provide() {
    return {
      selectShop: this
    }
  },
  data() {
    return {
      dropDownVisible: false,
      cascaderPanelVisible: false,
      cascaderPanelVisibleDelay: true,
      selectValue: null,
      inputHover: false,
      initialValue: this.value
    }
  },
  computed: {
    clearBtnVisible() {
      if (!this.clearable || !this.inputHover || !this.selectValue) {
        return false
      }
      return true
    }
  },
  watch: {
    value(newVal, oldVal) {
      // 重置
      if (newVal == this.initialValue) {
        this.selectValue = null
        this.$emit('input', this.initialValue)
      }
    }
  },
  created() {},
  methods: {
    toggleDropDownVisible(visible) {
      const { dropDownVisible } = this
      // const { input } = this.$refs;
      // visible = isDef(visible) ? visible : !dropDownVisible;
      if (visible !== dropDownVisible) {
        this.dropDownVisible = visible
        if (visible) {
          this.$nextTick(() => {
            console.log('updatePopper...')
            setTimeout(() => {
              this.updatePopper()
            }, 20)
            // this.panel.scrollIntoView();
          })
        }
        // input.$refs.input.setAttribute('aria-expanded', visible);
        // this.$emit('visible-change', visible);
      }
    },
    expandChange() {
      this.$nextTick(this.updatePopper.bind(this))
    },
    handleDropdownLeave() {
      console.log('handleDropdownLeave...')
    },
    clickOutSide() {
      // console.log('clickOutSide：', this.cascaderPanelVisible)
      if (!this.cascaderPanelVisible && this.cascaderPanelVisibleDelay) {
        this.toggleDropDownVisible(false)
      }
    },
    visibleChange(visible) {
      console.log('visibleChange', visible)
      this.cascaderPanelVisible = visible
      if (!visible) {
        setTimeout(() => {
          this.cascaderPanelVisibleDelay = true
        }, 20)
      } else {
        this.cascaderPanelVisibleDelay = false
      }
    },
    onChange(obj) {
      this.selectValue = obj
      this.toggleDropDownVisible(false)
      this.$emit('input', obj ? obj.value : '')
    },
    handleClear() {
      this.onChange(null)
    },
    setVal(val) {
      this.$refs.panel.setVal(val)
    }
  }
}
</script>
