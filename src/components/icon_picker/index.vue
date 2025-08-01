<template>
  <el-dialog title="选择图标" :visible="iconsVisible" width="732px" @close="closeDialog">
    <el-row class="icons-list" :gutter="10">
      <el-col v-for="item in icons" :key="item.index" :span="2">
        <div
          class="tab-icon"
          :class="{ active: selectedClassName === item }"
          @click="setCurrent(item)"
        >
          <div class="current-active" />
          <svg class="svg-icon" aria-hidden="true">
            <use :xlink:href="`#icon-${item}`" />
          </svg>
        </div>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="iconComfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      iconsVisible: false,
      loading: false,
      selectedClassName: '',
      icons: [
        'home_01',
        'cart_01',
        'category_01',
        'member_01',
        'coupon_01',
        'home_02',
        'cart_02',
        'category_02',
        'member_02',
        'coupon_02'
      ]
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.iconsVisible = val
      }
    }
  },
  methods: {
    setCurrent(name) {
      this.selectedClassName = name
    },
    iconComfirm() {
      this.iconsVisible = false
      this.$emit('pickIcon', this.selectedClassName)
      this.selectedClassName = ''
    },
    closeDialog() {
      this.iconsVisible = false
      this.$emit('closeDialog', 'icon')
    }
  }
}
</script>

<style scoped lang="scss">
.icons-list {
  background: #f8f8f8;
  border-radius: 5px;
}
.tab-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  &::after {
    display: flex;
    padding-top: 100%;
    content: '';
  }
  .current-active {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border: 3px solid #ff5000;
    z-index: -1;
    opacity: 0;
    box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
    background: rgba(255, 80, 0, 0.2);
    transition: all 0.3s ease;
  }
  &.active .current-active {
    opacity: 1;
    z-index: 999;
  }
}
.svg-icon {
  width: 26px;
  height: 26px;
  color: #666;
}
</style>
