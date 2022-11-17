<style lang="scss">
.sp-input {
  .el-input {
    margin: 0 8px;
  }
}
</style>
<template>
  <div class="sp-input">
    <span class="prefix">{{ prefix }}</span>
    <el-input v-model="val" :style="styleName" type="text" @change="onChangeInput" />
    <span class="suffix">{{ suffix }}</span>
  </div>
</template>

<script>
export default {
  name: 'SpInput',
  props: {
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    width: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      val: ''
    }
  },
  computed: {
    styleName() {
      return {
        width: this.width
      }
    }
  },
  watch: {
    value: function (val) {
      this.val = val
    }
  },
  created() {
    this.val = this.value
  },

  methods: {
    onChangeInput() {
      this.$emit('input', this.val)
    }
  }
}
</script>
