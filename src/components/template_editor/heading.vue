<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'heading'" class="section">
    <div class="section-header with-border">{{ $t('ae28a221.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('ae28a221.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('ae28a221.3b8a43')">
          <el-switch v-model="config.bold" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('ae28a221.6b36c6')">
          <el-color-picker v-model="config.color" />
        </el-form-item>
        <el-form-item :label="$t('ae28a221.5aefca')">
          <el-radio-group v-model="config.align">
            <el-radio label="left">{{ $t('ae28a221.316a63') }}</el-radio>
            <el-radio label="center">{{ $t('ae28a221.0bbc2e') }}</el-radio>
            <el-radio label="right">{{ $t('ae28a221.e2aaec') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('ae28a221.fc55af')">
          <el-select v-model="config.size" :placeholder="$t('ae28a221.708c9d')">
            <el-option
              v-for="item in options"
              :key="item"
              :label="item + $t('ae28a221.f7b320')"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ae28a221.81d6da')">
          <el-switch v-model="config.italic" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('ae28a221.32c65d')">
          <el-input v-model="data[0].content" type="text" :placeholder="$t('ae28a221.a11cc7')" />
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    res: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      options: ['24', '18', '16', '14']
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    }
  }
}
</script>

<style scoped lang="scss"></style>
