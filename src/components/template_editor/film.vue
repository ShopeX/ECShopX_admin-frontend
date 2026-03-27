<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'film'" class="section">
    <div class="section-header with-border">{{ $t('7e76487d.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item :label="$t('7e76487d.32c65d')">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item :label="$t('7e76487d.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('7e76487d.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item :label="$t('7e76487d.543018')">
          <Videoselect :data="data[0]" @change="handleVideoChange" />
        </el-form-item>
        <el-form-item>
          <div slot="label" class="label">{{ $t('7e76487d.df0134') }}</div>
          <div slot="label" class="label">{{ $t('7e76487d.d44616') }}</div>
          <el-radio-group v-model="base.proportion" @change="radioChange">
            <template v-for="item in proportions">
              <el-radio :key="item.label" :label="item.label">
                {{ item.name }}
              </el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import Videoselect from '@/components/videoselect/index'

export default {
  components: {
    Videoselect
  },
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
      data: [],
      proportions: [
        {
          label: 0,
          name: '16 : 9'
        },
        {
          label: 1,
          name: '9 : 16'
        },
        {
          label: 2,
          name: '4 : 3'
        },
        {
          label: 3,
          name: '3 : 4'
        },
        {
          label: 4,
          name: '1 : 1'
        }
      ]
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
      this.data = val.data
    },
    radioChange(val) {
      this.$emit('radioChange', val)
    },
    handleVideoChange(data) {
      this.$emit('change', data)
    }
  }
}
</script>

<style scoped lang="scss">
.label {
  line-height: 1.5;
}
</style>
