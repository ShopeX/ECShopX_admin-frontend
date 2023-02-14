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
  <div ref="reference" class="sp-select-shop" @click="onSelectShop(true)">
    <el-input readonly :value="selectValue" :placeholder="placeholder">
      <template slot="suffix">
        <i
          v-if="clearBtnVisible"
          key="clear"
          class="el-input__icon el-icon-circle-close"
          @click.stop="handleClear"
        />
        <i v-else key="arrow-down" :class="['el-input__icon', 'el-icon-arrow-down']" />
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'SpSelectShop',
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
      selectValue: '',
      initialValue: this.value
    }
  },
  computed: {
    clearBtnVisible() {
      if (!this.clearable || !this.selectValue) {
        return false
      }
      return true
    }
  },
  watch: {
    value(newVal, oldVal) {
      // 重置
      if (newVal == this.initialValue) {
        this.selectValue = ''
      }
    }
  },
  created() {},
  methods: {
    async onSelectShop() {
      const { data } = await this.$picker.shop({
        data: this.value ? [this.value] : [],
        multiple: false
      })
      if (data) {
        const [{ distributor_id, name }] = data
        this.onChange({
          name: name,
          value: distributor_id
        })
      } else {
        this.onChange({
          name: '',
          value: ''
        })
      }
    },
    onChange({ name, value }) {
      this.selectValue = name
      this.$emit('input', value)
      this.$emit('change')
    },
    handleClear() {
      this.onChange({
        name: '',
        value: ''
      })
    }
  }
}
</script>
