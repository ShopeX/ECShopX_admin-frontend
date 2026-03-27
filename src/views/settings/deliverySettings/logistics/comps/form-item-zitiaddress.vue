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
.fi-ziti-address {
  .region {
    margin-right: 10px;
  }
  .address {
    width: 400px;
    max-width: initial;
  }
}
</style>
<template>
  <div class="fi-ziti-address">
    <!-- data.region: {{data.region}} -->
    <el-cascader
      ref="region"
      v-model="data.region"
      filterable
      clearable
      :placeholder="$t('750dd84b.01543b')"
      :class="keyClass('region')"
      :options="district"
      @change="onChange"
    />
    <el-input
      v-model="data.address"
      class=""
      clearable
      type="text"
      :placeholder="$t('750dd84b.2de66c')"
      :class="keyClass('address')"
      @change="onChange"
    />
  </div>
</template>

<script>
import district from '@/common/district.json'
export default {
  name: 'FormItemZitiAddress',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      district,
      data: {
        region: [],
        address: ''
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
        key,
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
      const { region, address } = this.data
      this.isErrorKey = ''
      if (region.length == 0) {
        this.isErrorKey = 'region'
        throw new Error(this.$t('750dd84b.075488'))
      } else if (!address) {
        this.isErrorKey = 'address'
        throw new Error(this.$t('750dd84b.faeec8'))
      }
    }
  }
}
</script>
