<style lang="scss" scope>
.sp-filter-form {
  background-color: #f6f7f9;
  padding: 16px 0 0;
  display: flex;
  box-sizing: content-box;
  &.shouqi {
    max-height: 104px;
    overflow: hidden;
  }
  &.small {
    .sp-filter-form-item {
      margin-bottom: 8px;
    }
    &.shouqi {
      // max-height: 80px;
    }
  }
}
.filter-form {
  &__bd {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
  }
  &__ft {
    width: 200px;
    padding-right: 16px;
    .btns-wrap {
      text-align: right;
    }
    .extend-wrap {
      margin-top: 24px;
      padding-left: 15px;
    }
  }
}
</style>
<template>
  <div class="sp-filter-form" :class="formClass">
    <div ref="fiterFormBd" class="filter-form__bd">
      <slot />
    </div>
    <div class="filter-form__ft">
      <div class="btns-wrap">
        <el-button type="primary" icon="iconfont icon-sousuo" @click="onSearch"> 查询 </el-button>
        <el-button type="primary" plain icon="iconfont icon-chexiao" @click="onReset">
          重置
        </el-button>
      </div>
      <div v-if="showExtend" class="extend-wrap">
        <el-button type="text" @click="toggleExtend">
          <i class="iconfont" :class="extend ? 'icon-z045' : 'icon-zhankai'" />{{
            `${extend ? '收起' : '展开'}`
          }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '@/utils/emitter'
export default {
  name: 'SpFilterForm',
  mixins: [emitter],
  props: {
    model: Object,
    size: {
      type: String,
      default: 'normal'
    }
  },
  provide() {
    return {
      filterForm: this
    }
  },
  data() {
    return {
      fields: [],
      showExtend: false,
      rows: 0,
      extend: false
    }
  },
  computed: {
    formClass() {
      const size = this.size
      return {
        'shouqi': !this.extend,
        'normal': size == 'normal',
        'small': size == 'small'
      }
    }
  },
  created() {
    this.$on('sp.filterForm.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })
    const _this = this
    window.onresize = () => {
      console.log('onresize')
      setTimeout(() => {
        _this.calcRows()
      }, 50)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.calcRows()
    })
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    toggleExtend() {
      this.extend = !this.extend
    },
    calcRows() {
      // const cols = Math.floor(this.$refs.fiterFormBd.clientWidth / 305)
      let rows = 1
      const fieldsWidth = this.fields.reduce((previous, current) => {
        const curWidth = previous + current.$el.clientWidth

        if (curWidth > this.$refs.fiterFormBd.clientWidth) {
          rows = rows + 1
          previous = 0
        }
        // console.log(`curWidth:`, curWidth, rows)
        return previous + current.$el.clientWidth
      }, 0)
      // const rows = Math.ceil(this.fields.length / cols)
      // const rows = fieldsWidth > this.$refs.fiterFormBd.clientWidth * 2
      // console.log('xxx:', fieldsWidth, this.$refs.fiterFormBd.clientWidth, rows)
      if (rows > 2) {
        this.showExtend = true
      } else {
        this.showExtend = false
      }
      this.rows = rows
    },
    onSearch() {
      this.$emit('onSearch')
    },
    onReset() {
      if (!this.model) {
        console.warn('[Sp Warn][sp-filter-form]model is required for resetFields to work.')
        return
      }
      this.fields.forEach((field) => {
        field.resetField()
      })
      this.$emit('onReset')
    }
  }
}
</script>
