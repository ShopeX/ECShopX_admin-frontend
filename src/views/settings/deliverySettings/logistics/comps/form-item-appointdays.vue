<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.fi-connect-appointdays {
  .appoint-item {
    .el-radio {
      margin-right: 10px;
      &.is-checked {
        .el-radio__label {
          color: inherit;
        }
      }
    }
    .el-select {
      margin-right: 10px;
      width: 100px;
    }
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
  <div class="fi-connect-appointdays">
    <div class="appoint-item">
      <el-radio v-model="data.value" label="current" @change="onChange">
        {{ $t('97d0899b.2982d7') }}
      </el-radio>
    </div>
    <div class="appoint-item">
      <el-radio v-model="data.value" label="days" @change="onChange">
        {{ $t('97d0899b.e10228') }}
      </el-radio>
      <el-select v-model="data.days" clearable @change="onChange">
        <el-option label="1" value="1" />
        <el-option label="2" value="2" />
        <el-option label="3" value="3" />
        <el-option label="4" value="4" />
        <el-option label="5" value="5" />
        <el-option label="6" value="6" />
        <el-option label="7" value="7" />
        <el-option label="8" value="8" />
        <el-option label="9" value="9" />
        <el-option label="10" value="10" />
      </el-select>
      <span>{{ $t('97d0899b.26b346') }}</span>
    </div>
  </div>
</template>

<script>
import { camelToShortline } from '@/utils'
export default {
  name: 'FormItemAppointDays',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      data: {
        value: 'current', // current, days
        days: 1
      },
      isErrorKey: ''
    }
  },
  watch: {
    value: function (val) {
      this.data = val
    }
  },
  created() {
    this.data = this.value
  },
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
        throw new Error(this.$t('97d0899b.b75945'))
      } else if (!phone) {
        this.isErrorKey = 'phone'
        throw new Error(this.$t('97d0899b.7b540b'))
      }
    }
  }
}
</script>
