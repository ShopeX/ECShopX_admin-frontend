<style lang="scss">
.fi-connect-appointziti {
  .el-date-editor {
    width: 140px;
    margin-right: 10px;
  }
  .form-sub-item {
    &.is-error {
      .el-input__inner {
        border-color: #f56c6c;
      }
    }
    .el-input__inner {
      border-color: #d9d9d9;
    }
  }
}
</style>
<template>
  <div class="fi-connect-appointziti">
    <el-time-select
      v-model="data"
      placeholder="预约时间"
      :picker-options="{
        start: '00:00',
        step: '00:30',
        end: '24:00'
      }"
      @change="onChange"
    />
    <span>前下单，可预约当天自提</span>
  </div>
</template>

<script>
import { camelToShortline } from '@/utils'
export default {
  name: 'FormItemAppointZiti',
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      data: null,
      isErrorKey: ''
    }
  },
  watch: {
    value(val) {
      this.data = val
    }
  },
  created() {},
  methods: {
    keyClass(key) {
      return [
        camelToShortline(key),
        'form-sub-item',
        {
          'is-error': this.isErrorKey == key
        }
      ]
    },
    onChange() {
      this.$emit('input', this.data)
    },
    validator() {
      const { areaNo, phone } = this.data
      this.isErrorKey = ''
      if (areaNo && !phone) {
        this.isErrorKey = 'phone'
        throw new Error('请输入固定电话')
      } else if (!phone) {
        this.isErrorKey = 'phone'
        throw new Error('请输入联系电话')
      }
    }
  }
}
</script>
