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
      placeholder="选择省市区"
      :class="keyClass('region')"
      :options="district"
      @change="onChange"
    />
    <el-input
      v-model="data.address"
      class=""
      clearable
      type="text"
      placeholder="请填写自提点的具体地址"
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
        throw new Error('请选择省市区')
      } else if (!address) {
        this.isErrorKey = 'address'
        throw new Error('自提地址不能为空')
      }
    }
  }
}
</script>
