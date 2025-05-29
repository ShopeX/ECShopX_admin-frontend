<style lang="scss">
.comp-picker-link {
  .linktype-radio {
    margin-bottom: 6px;
    .el-radio {
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
    }
    .el-radio__label {
      padding-left: 2px;
      font-size: 13px;
    }
  }
  .btn-linkpath {
    padding: 0 8px;
    color: var(--themeColor);
    border: 1px solid var(--themeColor);
    background-color: #fff;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    max-width: 160px;
    @include text-overflow();
  }
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  .el-input__inner {
    padding: 0 8px;
  }
}
</style>
<template>
  <div class="comp-picker-link">
    <!-- {{ localValue }} -->
    <el-radio-group v-model="localValue.linkType" class="linktype-radio" @change="onChangeLinkType">
      <el-radio :label="0"> {{ '选择路径' }} </el-radio>
      <el-radio v-if="isShowH5Link" :label="1"
        >{{ 'H5链接' }}
      </el-radio>
    </el-radio-group>
    <div v-if="localValue.linkType == 0" class="btn-linkpath" @click="onPickerPath">
      {{ getLabelName() }}
    </div>
    <el-input
      v-else
      v-model="localValue.linkUrl"
      class="h5-link"
      size="small"
      type="text"
      :placeholder="'请填写自定义链接'"
      @change="onChangeLinkUrl"
    />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { isObject} from '@/utils'
import { LINK_PATH } from '@/consts'
import { mapGetters } from 'vuex'
export default {
  name: 'CompPickerLink',
  props: {
    value: {
      type: [Object, Array],
      default: () => {}
    },
    isShowH5Link: {
      // 不展示自定义链接label true：展示
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      localValue: {
        linkType: 0,
        linkUrl: '',
        linkPage: '',
        id: '',
        title: ''
      },
    }
  },
  computed: {
    ...mapGetters(['lang'])
  },
  watch: {
    value: {
      immediate: true,
      handler(nVal) {
        this.localValue = {
          ...this.localValue,
          ...nVal
        }
      }
    }
    // localValue: (nVal, oVal) => {
    //   this.$emit('input', nVal)
    // }
  },
  // created() {
  //   this.localValue = this.value
  // },
  methods: {
    async onPickerPath() {
      const lastPath = this.$route.path.split('/')[this.$route.path.split('/').length - 1]
      // 判断是pc还是mobile
      let isPCorMobile = ''
      if (lastPath === 'decorate_pc') {
        isPCorMobile = 'pc'
      } else if(lastPath === 'decorate') {
        isPCorMobile = 'mobile'
      }
      const { linkPage, id,isShowPils } = this.localValue
      const params = {
        data: id,
        tab: linkPage,
        multiple: false,
        lang: this.lang,
        isPCorMobile
      }
      // if(linkPage == 'goods'){
      //   params.linkGoods = `#${id}#`
      // }
      if(linkPage == 'sale_category'){
        params.isShowPils = isShowPils
      }
      const res = await this.$picker.path(params)
      console.log('localValue---', res)
      this.$emit('input', res)
      this.$emit('change', res)
    },
    onChangeLinkType() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    },
    onChangeLinkUrl() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    },
    getLabelName() {
      const { linkPage, title } = this.localValue
      let t = `${isObject(title) ? '' : `${title}`}`
      if (linkPage) {
        return `${LINK_PATH[linkPage]}: ${t}`
      } else {
        return '选择路径'
      }
    }
  }
}
</script>
