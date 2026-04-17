<template>
  <div class="crowd-select">
    <el-radio-group
      v-model="selectedCrowds.type"
      size="mini"
      style="margin-bottom: 10px"
      @change="handleTypeChange"
    >
      <el-radio-button v-for="item in options" :key="item.id" :label="item.id" :value="item.id">
        {{ item.name }}
      </el-radio-button>
    </el-radio-group>
    <div class="crowd-select-header">
      <el-button
        type="primary"
        size="mini"
        class="crowd-select-header-add"
        :disabled="disabled"
        @click="handleSelect"
      >
        {{ $t('26b7f367.db64f9') }}
      </el-button>
      <slot />
    </div>
    <div
      v-if="
        selectedCrowds.type == '1' &&
        selectedCrowds.no_meber_tags &&
        selectedCrowds.no_meber_tags.length > 0
      "
      class="selected-crowds"
    >
      <el-tag
        v-for="(item, index) in selectedCrowds.no_meber_tags"
        :key="index"
        type="danger"
        :closable="!disabled"
        @close="handleDelete(index)"
      >
        {{ item.tag_name }}
      </el-tag>
    </div>
    <div
      v-if="
        selectedCrowds.type == '2' &&
        selectedCrowds.meber_tags &&
        selectedCrowds.meber_tags.length > 0
      "
      class="selected-crowds"
    >
      <el-tag
        v-for="(item, index) in selectedCrowds.meber_tags"
        :key="index"
        type="danger"
        :closable="!disabled"
        @close="handleDelete(index)"
      >
        {{ item.tag_name }}
      </el-tag>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/i18n'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        type: '2',
        meber_tags: [],
        no_meber_tags: []
      })
    },
    disabled: {
      type: Boolean,
      default: false
    },
    areaId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      optionsValue: [{ id: '2' }],
      optionNameKey: i18n.t('26b7f367.188e1b')
    }
  },
  computed: {
    options() {
      return this.optionsValue.map((item) => ({
        ...item,
        name: this.optionNameKey
      }))
    },
    selectedCrowds: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    handleDelete(index) {
      if (this.selectedCrowds.type == '1') {
        this.selectedCrowds.no_meber_tags.splice(index, 1)
      } else {
        this.selectedCrowds.meber_tags.splice(index, 1)
      }
    },
    async handleSelect() {
      const { data } = await this.$picker.crowds({
        data:
          this.selectedCrowds.type == '1'
            ? this.selectedCrowds.no_meber_tags
            : this.selectedCrowds.meber_tags,
        params: { regionauth_id: this.areaId }
      })
      if (data) {
        if (this.selectedCrowds.type == '1') {
          this.selectedCrowds.no_meber_tags = data
        } else {
          this.selectedCrowds.meber_tags = data
        }
      }
    },
    handleTypeChange(val) {
      this.selectedCrowds.meber_tags = []
      this.selectedCrowds.no_meber_tags = []
    }
  }
}
</script>

<style lang="scss" scoped>
.crowd-select {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .selected-crowds {
    margin-top: 10px;
    margin-left: -70px;
    .el-tag {
      margin-right: 10px;
      margin-bottom: 5px;
      border: none !important;
    }
  }
  &-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
