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
    class="sp-select-shop"
    v-clickoutside="clickOutSide"
    @click="toggleDropDownVisible(true)"
  >
    <el-input
      readonly
      :placeholder="placeholder"
      :suffix-icon="`el-icon-arrow-down, ${dropDownVisible ? 'is-reverse' : ''}`"
    ></el-input>
    <transition name="el-zoom-in-top" @after-leave="handleDropdownLeave">
      <div v-show="dropDownVisible" ref="popper" :class="['el-popper', 'el-cascader__dropdown']">
        <SpSelectShopPanel
          ref="panel"
          @visible-change="visibleChange"
          @change="onChange"
        ></SpSelectShopPanel>
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
    value: Number || String || Object,
    placeholder: String
  },
  data() {
    return {
      dropDownVisible: false,
      cascaderPanelVisible: false,
      cascaderPanelVisibleDelay: true
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
            this.updatePopper()
            // this.panel.scrollIntoView();
          })
        }
        // input.$refs.input.setAttribute('aria-expanded', visible);
        // this.$emit('visible-change', visible);
      }
    },
    handleDropdownLeave() {
      console.log('handleDropdownLeave...')
    },
    clickOutSide() {
      console.log('clickOutSide：', this.cascaderPanelVisible)
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
      this.$emit('input', obj)
    }
  }
}
</script>
