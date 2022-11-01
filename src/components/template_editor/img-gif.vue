<template>
  <section
    v-if="name === 'img-gif' || name === 'banner'"
    class="section"
  >
    <div class="section-header with-border">
      设置
    </div>
    <div class="section-body">
      <el-form label-width="100px">
        <el-form-item label="组件间距">
          <el-switch
            v-model="base.padded"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <el-form-item :label="item.name + '图片'">
            <img
              v-if="item.imgUrl"
              :src="item.imgUrl"
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
            <div
              v-else
              class="banner-uploader"
              @click="handleImgChange(index)"
            >
              <i class="iconfont icon-camera" />
              上传图片
            </div>
          </el-form-item>
        </div>
        <el-form-item label="">
          <div class="frm-tips">
            只能上传gif/png文件（建议尺寸：375px * 575px）
          </div>
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
    },
    type: {
      type: String, // pc 传'pc'即可
      default: 'wxapp'
    }
  },
  data () {
    return {
      name: '',
      base: {},
      data: []
    }
  },
  watch: {
    res: {
      deep: true,
      handler (value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted () {
    this.setData(this.res)
  },
  methods: {
    setData (val) {
      this.name = val.name
      this.base = val.base
      this.data = val.data
    },
    handleImgChange (index) {
      this.$emit('bindImgs', index)
    }
  }
}
</script>
