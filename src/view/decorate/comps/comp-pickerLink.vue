<style lang="scss" scoped>
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

.link-type-radio {
  .link-type-radio-label {
    font-size: 12px;
    color: #606266;
    margin-right: 10px;
  }
}
</style>
<template>
  <div class="comp-picker-link">
    <!-- {{ localValue }} -->
    <el-radio-group v-model="localValue.linkType" class="linktype-radio" @change="onChangeLinkType">
      <el-radio :label="0"> 选择路径 </el-radio>
      <el-radio v-if="isShowH5Link" :label="1"> H5链接 </el-radio>
    </el-radio-group>
    <div v-if="localValue.linkPage == 'other_wxapp'" class="link-type-radio">
      <span class="link-type-radio-label">跳转类型</span>
      <el-radio-group v-model="localValue.extra.linkType" class="linktype-radio" size="small"
        @change="onChangeLinkType">
        <el-radio-button label="full_screen">跳转</el-radio-button>
        <el-radio-button label="half_screen">半屏拉起</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="localValue.linkType == 0" class="link-type-radio">
      <div class="btn-linkpath" @click="onPickerPath">
        {{ getLabelName() }}
      </div>
    </div>
    <div v-if="localValue.linkPage == 'other_wxapp'" class="link-type-radio" style="margin-top: 10px;">
      <span class="link-type-radio-label">小程序跳转页面</span>
      <el-select v-model="localValue.extra.path" size="small" placeholder="请选择">
        <el-option v-for="item in wxLinkList" :key="item.wx_external_routes_id" :value="item.route_info">
         【{{ item.route_name }}】{{ item.route_info }}
       </el-option>
      </el-select>
    </div>
    <el-input v-if="localValue.linkType == 1" v-model="localValue.linkUrl" class="h5-link" size="small" type="text"
      placeholder="请填写自定义链接" @change="onChangeLinkUrl" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { LINK_PATH } from '@/consts'
export default {
  name: 'CompPickerLink',
  props: {
    value: {
      type: [Object, Array],
      default: () => { }
    },
    isShowH5Link: {
      // 不展示自定义链接label true：展示
      type: Boolean,
      default: true
    },
    regionauthid: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      localValue: {
        linkType: 0,
        linkUrl: '',
        linkPage: '',
        id: '',
        title: '',
      },
      wxLinkList: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(nVal) {
        console.log(nVal, 'nVal')
        this.localValue = {
          ...this.localValue,
          ...nVal
        }
        if (nVal.linkPage == 'other_wxapp') {
          this.getWxLinkList()
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
    async getWxLinkList() {
      const res = await this.$api.wxa.getWxLinkList({
        page: 1,
        pageSize: 1000,
        wx_external_config_id: this.localValue.id
      })
      this.wxLinkList = res.list
    },
    async onPickerPath() {
      const { linkPage, id } = this.localValue
      console.log('this.regionauth_id111', this.regionauthid)
      const res = await this.$picker.path({
        data: id,
        tab: linkPage,
        multiple: false,
        params: {
          regionauth_id: this.regionauthid
        }
      })
      this.$emit('input', res)
      this.$emit('change', res)
      if (res.linkPage == 'other_wxapp') {
        this.getWxLinkList()
      }
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
      if (linkPage) {
        return `${LINK_PATH[linkPage]}：${title}`
      } else {
        return '选择路径'
      }
    }
  }
}
</script>
