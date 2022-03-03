<style lang="scss" scope>
.sp-filter-form {
  background-color: #f6f7f9;
  padding: 16px 0 0 0;
  display: flex;
  &.shouqi {
    max-height: 120px;
    overflow: hidden;
  }
}
.filter-form {
  &__bd {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
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
  <div
    class="sp-filter-form"
    :class="{ 'shouqi': !extend }"
  >
    <div
      ref="fiterFormBd"
      class="filter-form__bd"
    >
      <slot />
    </div>
    <div class="filter-form__ft">
      <div class="btns-wrap">
        <el-button
          type="primary"
          icon="iconfont icon-sousuo"
          @click="onSearch"
        >
          查询
        </el-button>
        <el-button
          type="primary"
          plain
          icon="iconfont icon-chexiao"
          @click="onReset"
        >
          重置
        </el-button>
      </div>
      <div
        v-if="showExtend"
        class="extend-wrap"
      >
        <el-button
          type="text"
          @click="toggleExtend"
        >
          <i
            class="iconfont"
            :class="extend ? 'icon-z045' : 'icon-zhankai'"
          />{{ `${extend ? '收起' : '展开'}` }}
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
    model: Object
  },
  provide () {
    return {
      filterForm: this
    }
  },
  data () {
    return {
      fields: [],
      showExtend: false,
      rows: 0,
      extend: false
    }
  },
  created () {
    this.$on('sp.filterForm.addField', (field) => {
      if (field) {
        this.fields.push(field)
      }
    })
    const _this = this
    window.onresize = () => {
      console.log('onresize')
      _this.calcRows()
    }
  },
  mounted () {
    this.calcRows()
  },
  destroyed () {
    window.onresize = null
  },
  methods: {
    toggleExtend () {
      this.extend = !this.extend
    },
    calcRows () {
      // console.log('xxx:', this.$refs.fiterFormBd.clientWidth)
      const cols = Math.floor(this.$refs.fiterFormBd.clientWidth / 305)
      const rows = Math.ceil(this.fields.length / cols)
      if (rows > 2) {
        this.showExtend = true
      } else {
        this.showExtend = false
      }
      this.rows = rows
    },
    onSearch () {
      this.$emit('onSearch')
    },
    onReset () {
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
