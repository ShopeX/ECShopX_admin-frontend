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
      <el-radio :label="0"> {{ i18n.t('744cc9e0.e3cf91') }} </el-radio>
      <el-radio v-if="isShowH5Link" :label="1">{{ i18n.t('744cc9e0.4e99fd') }} </el-radio>
    </el-radio-group>
    <template v-if="localValue.linkType == 0">
      <div class="btn-linkpath" @click="onPickerPath">
        {{ getLabelName() }}
      </div>
      <div v-if="needsOfficialRawId" style="margin-top: 8px">
        <div style="font-size: 12px; color: #333; margin-bottom: 4px">
          {{ i18n.t('cc5110aa.d10654') }}
        </div>
        <el-input
          v-model="localValue.officialAccountRawId"
          size="small"
          :placeholder="i18n.t('cc5110aa.e20765')"
          @input="onOfficialRawIdInput"
        />
      </div>
      <div v-if="needsOfficialArticleLink" style="margin-top: 8px">
        <div style="font-size: 12px; color: #333; margin-bottom: 4px">
          {{ i18n.t('cc5110aa.f30876') }}
        </div>
        <el-input
          v-model="localValue.officialArticleLink"
          size="small"
          :placeholder="i18n.t('cc5110aa.g40987')"
          @input="onOfficialArticleLinkInput"
        />
      </div>
    </template>
    <el-input
      v-else
      v-model="localValue.linkUrl"
      class="h5-link"
      size="small"
      type="text"
      :placeholder="i18n.t('744cc9e0.11b162')"
      @change="onChangeLinkUrl"
    />
  </div>
</template>

<script>
import { i18n } from '@/i18n'
import { cloneDeep } from 'lodash'
import { isObject } from '@/utils'
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
      i18n,
      localValue: {
        linkType: 0,
        linkUrl: '',
        linkPage: '',
        id: '',
        title: '',
        officialAccountRawId: '',
        officialArticleLink: ''
      }
    }
  },
  computed: {
    ...mapGetters(['lang']),
    needsOfficialRawId() {
      const { linkPage, id } = this.localValue
      return linkPage === 'customer_service' && (id === 'officialProfile' || id === 'officialChat')
    },
    needsOfficialArticleLink() {
      const { linkPage, id } = this.localValue
      return linkPage === 'customer_service' && id === 'official'
    }
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
      } else if (lastPath === 'decorate') {
        isPCorMobile = 'mobile'
      }
      const { linkPage, id, isShowPils, title } = this.localValue
      const params = {
        data: id,
        tab: linkPage,
        name: title,
        multiple: false,
        lang: this.lang,
        isPCorMobile
      }
      // if(linkPage == 'goods'){
      //   params.linkGoods = `#${id}#`
      // }
      if (linkPage == 'sale_category') {
        params.isShowPils = isShowPils
      }
      const res = await this.$picker.path(params)
      const next = {
        ...this.localValue,
        ...res,
        linkType: this.localValue.linkType
      }
      const needRaw =
        res?.linkPage === 'customer_service' &&
        (res?.id === 'officialProfile' || res?.id === 'officialChat')
      const needArticle = res?.linkPage === 'customer_service' && res?.id === 'official'
      if (needRaw) {
        next.officialAccountRawId = this.localValue.officialAccountRawId || ''
        next.officialArticleLink = ''
      } else if (needArticle) {
        next.officialArticleLink = this.localValue.officialArticleLink || ''
        next.officialAccountRawId = ''
      } else {
        next.officialAccountRawId = ''
        next.officialArticleLink = ''
      }
      this.localValue = next
      this.$emit('input', next)
      this.$emit('change', next)
    },
    onOfficialRawIdInput() {
      this.$emit('input', { ...this.localValue })
      this.$emit('change', { ...this.localValue })
    },
    onOfficialArticleLinkInput() {
      this.$emit('input', { ...this.localValue })
      this.$emit('change', { ...this.localValue })
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
        return i18n.t('744cc9e0.e3cf91')
      }
    }
  }
}
</script>
