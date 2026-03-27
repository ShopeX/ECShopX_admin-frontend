<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'writing'" class="section">
    <div class="section-header with-border">{{ $t('a00b166a.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('a00b166a.32c65d')">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item :label="$t('a00b166a.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('a00b166a.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('a00b166a.5aefca')">
          <el-radio-group v-model="config.align">
            <el-radio label="left">{{ $t('a00b166a.316a63') }}</el-radio>
            <el-radio label="center">{{ $t('a00b166a.0bbc2e') }}</el-radio>
            <el-radio label="right">{{ $t('a00b166a.e2aaec') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('a00b166a.cbc608')">
          <el-input
            v-model="data[0].content"
            type="textarea"
            :rows="8"
            :placeholder="$t('a00b166a.a11cc7')"
          />
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
      data: []
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
