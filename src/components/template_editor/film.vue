<template>
  <section v-if="name === 'film'" class="section">
    <div class="section-header with-border">设置</div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item label="选择视频">
          <Videoselect :data="data[0]" @change="handleVideoChange" />
        </el-form-item>
        <el-form-item>
          <div slot="label" class="label">视频比例</div>
          <div slot="label" class="label">宽：高</div>
          <el-radio-group v-model="base.proportion" @change="radioChange">
            <template v-for="item in proportions">
              <el-radio :label="item.label">
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
