<style lang="scss">
.el-form-item {
  &.is-error {
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
}
.fi-connect-phone {
  .area-no {
    margin-right: 10px;
    width: 100px;
  }
  .phone {
    width: 500px;
    max-width: initial;
  }
}
</style>
<template>
  <div class="fi-connect-phone">
    <el-input
      v-model="data.areaNo"
      clearable
      type="text"
      placeholder="区号"
      :class="keyClass('areaNo')"
      @change="onChange"
    />
    <el-input
      v-model="data.phone"
      clearable
      type="text"
      placeholder="请填写准确的联系电话，便于买家联系（手机号时区号可留空）"
      :class="keyClass('phone')"
      @change="onChange"
    />
  </div>
</template>

<script>
import { camelToShortline } from '@/utils'
export default {
  name: 'FormItemConnectPhone',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      data: {
        areaNo: '',
        phone: ''
      },
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
