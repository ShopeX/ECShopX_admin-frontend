<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-picker-link-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  flex: 1;

  .linktype-radio {
    width: 100%;

    .el-radio__label {
      padding-left: 2px;
      font-size: 13px;
    }
  }

  .btn-linkpath {
    color: var(--primary);
    border: 1px solid #dcdfe6;
    background-color: #fff;
    box-sizing: border-box;
    padding: 0 8px;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
    @include text-overflow();
    width: 100%;
  }

  input::-webkit-input-placeholder {
    font-size: 12px;
  }

  .el-input__inner {
    padding: 0 8px;
  }

  .tracking-params-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;

    .tracking-params-label {
      display: block;
      font-size: 12px;
      width: 80px;
      color: #333;
    }

    .tracking-params-input {
      width: 100%;
    }
  }
}
</style>
<template>
  <div class="comp-picker-link-wrapper">
    <!-- {{ localValue }} -->
    <div class="tracking-params-wrapper" v-if="isShowH5Link">
      <label class="tracking-params-label">{{ $t('4a0a5782.f0789e') }}</label>
      <el-radio-group
        v-model="localValue.linkType"
        class="linktype-radio"
        @change="onChangeLinkType"
        size="small"
      >
        <el-radio-button :label="0">{{ $t('4a0a5782.e3cf91') }}</el-radio-button>
        <el-radio-button :label="1">
          {{ $t('4a0a5782.4e99fd') }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <template v-if="localValue.linkType == 0">
      <div class="tracking-params-wrapper" @click="onPickerPath">
        <label class="tracking-params-label">{{ $t('4a0a5782.4f35e8') }}</label>
        <div class="btn-linkpath">{{ getLabelName() }}</div>
      </div>
      <div v-if="needsOfficialRawId" class="tracking-params-wrapper">
        <label class="tracking-params-label">{{ $t('cc5110aa.d10654') }}</label>
        <el-input
          v-model="localValue.officialAccountRawId"
          class="tracking-params-input"
          size="small"
          type="text"
          :placeholder="$t('cc5110aa.e20765')"
          @input="onOfficialRawIdInput"
        />
      </div>
      <div v-if="needsOfficialArticleLink" class="tracking-params-wrapper">
        <label class="tracking-params-label">{{ $t('cc5110aa.f30876') }}</label>
        <el-input
          v-model="localValue.officialArticleLink"
          class="tracking-params-input"
          size="small"
          type="text"
          :placeholder="$t('cc5110aa.g40987')"
          @input="onOfficialArticleLinkInput"
        />
      </div>
    </template>
    <div v-else class="tracking-params-wrapper">
      <label class="tracking-params-label">{{ $t('4a0a5782.4e99fd') }}</label>
      <el-input
        v-model="localValue.linkUrl"
        class="h5-link"
        size="small"
        type="text"
        :placeholder="$t('4a0a5782.11b162')"
        @change="onChangeLinkUrl"
      />
    </div>
    <div v-if="showTrackingParams" class="tracking-params-wrapper">
      <label class="tracking-params-label">{{ $t('4a0a5782.965470') }}</label>
      <el-input
        v-model="localValue.trackingParams"
        class="tracking-params-input"
        size="small"
        type="text"
        :placeholder="$t('4a0a5782.7bb892')"
        @change="onChangeTrackingParams"
      />
    </div>
  </div>
</template>

<script>
import { LINK_PATH } from '@/consts'
import { i18n } from '@/i18n'
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
    },
    showTrackingParams: {
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
        title: '',
        trackingParams: '',
        officialAccountRawId: '',
        officialArticleLink: ''
      }
    }
  },
  computed: {
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
      const { linkPage, id } = this.localValue
      const pathLink = ['/salespersonshelfindex', 'guide-assistant/home-template']
      const res = await this.$picker.path({
        data: id,
        tab: linkPage,
        multiple: false,
        guide:
          this.$route.path.indexOf(pathLink[0]) > -1 || this.$route.path.indexOf(pathLink[1]) > -1
            ? true
            : false // 为了兼容导购装修模板
      })
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
    onChangeTrackingParams() {
      this.$emit('input', this.localValue)
      this.$emit('change', this.localValue)
    },
    getLabelName() {
      const { linkPage, title } = this.localValue
      if (linkPage) {
        return `${LINK_PATH[linkPage]}：${title}`
      } else {
        return this.$t('4a0a5782.e3cf91')
      }
    }
  }
}
</script>
