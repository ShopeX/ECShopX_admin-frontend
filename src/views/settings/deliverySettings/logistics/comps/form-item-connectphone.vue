<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
      :placeholder="$t('0a30d23d.9a0e44')"
      :class="keyClass('areaNo')"
      @change="onChange"
    />
    <el-input
      v-model="data.phone"
      clearable
      type="text"
      :placeholder="$t('0a30d23d.92193c')"
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
        throw new Error(this.$t('0a30d23d.b75945'))
      } else if (!phone) {
        this.isErrorKey = 'phone'
        throw new Error(this.$t('0a30d23d.7b540b'))
      }
    }
  }
}
</script>
