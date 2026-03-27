<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card v-if="isOpen">
    <div slot="header">
      <div>{{ $t('146ac763.98818a') }}</div>
    </div>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="$t('146ac763.9b712b')">
          <el-switch v-model="form.is_open" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="$t('146ac763.0b9237')">
          <el-input v-model="form.rate" />
        </el-form-item>
      </el-col>
      <el-col :span="16" class="flex">
        <div>{{ $t('146ac763.f00f97') }}</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getSetting } from '@/api/fenzhang'
export default {
  props: ['externalForm'],
  data() {
    return {
      form: {
        rate: '0.00',
        is_open: false
      },
      isOpen: false
    }
  },
  watch: {
    externalForm: {
      handler(val) {
        if (val.is_open) {
          this.form.is_open = val.is_open == 'true' ? true : false
        }
        if (val.rate) {
          this.form.rate = val.rate
        }
      },
      deep: true
    }
  },
  mounted() {
    getSetting().then((res) => {
      let data = res.data.data
      this.isOpen = data.is_open == 'true'
    })
  }
}
</script>

<style scoped lang="scss">
.flex {
  div {
    display: flex;
    align-items: center;
    height: 40px;
    margin-left: 10px;
  }
}
</style>
