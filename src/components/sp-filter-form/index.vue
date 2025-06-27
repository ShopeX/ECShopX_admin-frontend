<style lang="scss" scope>
.sp-filter-form {
  background-color: #f6f7f9;
  padding: 16px 0 0;
  margin-bottom: 16px;
  display: flex;
  box-sizing: content-box;
  transition: all 0.8s ease-in-out;
  // max-height: 1000px; // 设置一个足够大的初始高度
  overflow: hidden;
  &.shouqi {
    max-height: 110px;
    overflow: hidden;
  }
  &.small {
    .sp-filter-form-item {
      margin-bottom: 8px;
    }
    &.shouqi {
      max-height: 80px;
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
      margin-top: 16px;
      padding-left: 15px;
      text-align: right;
    }
    .extend-icon {
      &.extend-active {
        transform: rotate(180deg);
      }
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
        <el-button type="primary" @click="onSearch">
          <div class="flex items-center">
            <SpIcon name="search" :size="14" />
            <span class="ml-1">查询</span>
          </div>
        </el-button>
        <el-button type="primary" plain @click="onReset">
          <div class="flex items-center">
            <SpIcon name="refresh" :size="14" />
            <span class="ml-1">重置</span>
          </div>
        </el-button>
      </div>
      <div v-if="showExtend" class="extend-wrap">
        <el-button type="text" @click="toggleExtend">
          <div class="flex items-center">
            <span>{{ `${extend ? '收起' : '展开'}` }}</span>
            <SpIcon
              :class="{ 'extend-icon': true, 'extend-active': extend }"
              name="chevrons-down"
            />
          </div>
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
        shouqi: !this.extend,
        normal: size == 'normal',
        small: size == 'small'
      }
    }
  },
  created() {
    this.$on('sp.filterForm.addField', field => {
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
      this.fields.forEach(field => {
        field.resetField()
      })
      this.$emit('onReset')
    }
  }
}
</script>
