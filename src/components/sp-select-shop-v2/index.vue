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
    <el-input readonly :value="selectValue" :placeholder="placeholder" :disabled="disabled">
      <template slot="suffix">
        <i
          v-if="clearBtnVisible && !disabled"
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
  name: 'SpSelectShopV2',
  props: {
    value: {
      type: [Number, String, Array],
      default: () => []
    },
    placeholder: String,
    clearable: Boolean,
    keyName: String,
    names: [String],
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => ({})
    }
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
  mounted() {
    this.selectValue = this?.names
  },
  methods: {
    async onSelectShop() {
      if (this.disabled) {
        return
      }
      const query = this.value
        ? !Array.isArray(this.value)
          ? this.value.split(',')
          : this.value || []
        : []
      const { data } = await this.$picker.shopV2({
        data: query,
        multiple: this.multiple,
        params: this.params
      })
      if (data) {
        if (this.multiple && data.length > 1) {
          this.onChange({
            name: `已选择${data.length}个店铺`,
            value: data.map((item) => (this?.keyName ? item[this.keyName] : item.distributor_id))
          })
        } else {
          const [{ distributor_id, name }] = data
          this.onChange({
            name: name,
            value: this?.keyName ? data[0][this.keyName] : distributor_id
          })
        }
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
