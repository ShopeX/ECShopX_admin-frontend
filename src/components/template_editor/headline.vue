<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'headline' || name === 'banner'" class="section">
    <div class="section-header with-border">{{ $t('6679a06d.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <template v-if="type == 'wxapp'">
          <el-form-item :label="$t('6679a06d.32c65d')">
            <el-input v-model="base.title" />
          </el-form-item>
          <el-form-item :label="$t('6679a06d.d1b490')">
            <el-radio-group v-model="base.float">
              <el-radio label="center">{{ $t('6679a06d.0bbc2e') }}</el-radio>
              <el-radio label="left">{{ $t('6679a06d.316a63') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
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
    },
    type: {
      type: String, // pc 传'pc'即可
      default: 'wxapp'
    }
  },
  data() {
    return {
      name: '',
      base: {}
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
    }
  }
}
</script>
