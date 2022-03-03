<template>
  <el-card
    header="设置"
    class="footer-style-wrap"
  >
    <el-form label-width="80px">
      <div
        v-for="(item, index) in t_data"
        class="view-flex"
      >
        <el-form-item
          label="文字内容"
          style="flex: 2"
        >
          <el-input
            v-model="item.content"
            placeholder="文字内容"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="文字链接"
          style="flex: 2"
        >
          <el-input
            v-model="item.url"
            placeholder="文字链接"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item
          label="字号"
          style="flex: 1"
        >
          <el-select
            v-model="item.fontsize"
            placeholder="字号"
          >
            <el-option
              v-for="(option, index) in fontSizes"
              :key="index"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="位置"
          style="flex: 1"
        >
          <el-select
            v-model="item.position"
            placeholder="位置"
          >
            <el-option
              v-for="(option, index) in position"
              :key="index"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="文字颜色"
          style="flex: 1"
        >
          <el-color-picker v-model="item.color" />
        </el-form-item>
        <div
          class="iconfont icon-times"
          @click="handleRemove(index)"
        />
      </div>
      <el-button
        type="primary"
        plain
        icon="el-icon-circle-plus"
        @click="handleClick"
      >
        添加内容项
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
  data () {
    return {
      t_data: this.info,
      fontSizes: [
        {
          label: '12号',
          value: '12'
        },
        {
          label: '14号',
          value: '14'
        },
        {
          label: '16号',
          value: '16'
        }
      ],
      position: [
        {
          label: '居左',
          value: 'left'
        },
        {
          label: '居中',
          value: 'center'
        },
        {
          label: '居右',
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
    handleClick () {
      this.t_data.push({
        content: '',
        url: '',
        fontsize: '',
        position: '',
        color: ''
      })
    },
    handleRemove (n) {
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
