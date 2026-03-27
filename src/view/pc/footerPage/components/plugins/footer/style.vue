<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card :header="$t('9495eced.e366cc')" class="footer-style-wrap">
    <el-form label-width="80px">
      <div v-for="(item, index) in t_data" class="view-flex">
        <el-form-item :label="$t('9495eced.edb5ac')" style="flex: 2">
          <el-input
            v-model="item.content"
            :placeholder="$t('9495eced.edb5ac')"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('9495eced.1e1fc1')" style="flex: 2">
          <el-input v-model="item.url" :placeholder="$t('9495eced.1e1fc1')" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="$t('9495eced.fc55af')" style="flex: 1">
          <el-select v-model="item.fontsize" :placeholder="$t('9495eced.fc55af')">
            <el-option
              v-for="(option, index) in fontSizes"
              :key="index"
              :label="$t(option.label)"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('9495eced.d4d2a6')" style="flex: 1">
          <el-select v-model="item.position" :placeholder="$t('9495eced.d4d2a6')">
            <el-option
              v-for="(option, index) in position"
              :key="index"
              :label="$t(option.label)"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('9495eced.7ec907')" style="flex: 1">
          <el-color-picker v-model="item.color" />
        </el-form-item>
        <div class="el-icon-close" @click="handleRemove(index)" />
      </div>
      <el-button type="primary" plain icon="el-icon-circle-plus" @click="handleClick">
        {{ $t('9495eced.a7511a') }}
      </el-button>
    </el-form>
  </el-card>
</template>
<script>
import imgPicker from '@/components/imageselect'
export default {
  components: {
    imgPicker
  },
  props: ['info'],
  data() {
    return {
      t_data: this.info,
      fontSizes: [
        {
          label: '9495eced.185abb',
          value: '12'
        },
        {
          label: '9495eced.a3c3fc',
          value: '14'
        },
        {
          label: '9495eced.0e4221',
          value: '16'
        }
      ],
      position: [
        {
          label: '9495eced.316a63',
          value: 'left'
        },
        {
          label: '9495eced.0bbc2e',
          value: 'center'
        },
        {
          label: '9495eced.e2aaec',
          value: 'right'
        }
      ]
    }
  },
  watch: {
    // t_data: {
    //   handler (newVal, oldVal) {
    //     console.log('inner watch', newVal)
    //     this.$emit('update:info', newVal)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  methods: {
    handleClick() {
      this.t_data.push({
        content: '',
        url: '',
        fontsize: '',
        position: '',
        color: ''
      })
    },
    handleRemove(n) {
      this.t_data.splice(n, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-style-wrap {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-input {
    width: 80%;
  }
  .iconfont {
    margin-left: 20px;
    font-size: 28px;
    line-height: 1.5;
    color: #999;
    cursor: pointer;
  }
}
</style>
