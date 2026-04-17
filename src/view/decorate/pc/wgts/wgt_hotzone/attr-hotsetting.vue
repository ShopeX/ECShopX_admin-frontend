<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" scoped>
.hot-content {
  margin-top: 10px;
}
.zone-item {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <!-- <el-button plain size="small" @click="onSetHotZone">
      {{ `热区设置 (${value.data.length})` }}
    </el-button> -->

    <CompButton
      :placeholder="$t('78c456ff.3d0b48')"
      :format="$t('78c456ff.74e431')"
      :value="value.data.length"
      :view-btn="false"
      @click="onSetHotZone"
      @remove="onRemoveHotZone"
    />

    <el-dialog
      :visible="dialog"
      class="sp-dialog"
      append-to-body
      destroy-on-close
      :title="$t('78c456ff.c90f57')"
      width="800px"
      @close="onCancel"
    >
      <div v-if="dialog" class="">
        <div>
          <el-button type="primary" size="small" plain @click="onSelectImage">
            {{ $t('78c456ff.ba9fc4') }}
          </el-button>
          <span style="font-size: 12px; color: #888; margin-left: 4px">{{
            $t('78c456ff.818403')
          }}</span>
        </div>

        <div class="hot-content">
          <el-row :gutter="20">
            <el-col :span="12">
              <hotzone
                class="hotzone"
                :image="value.imgUrl"
                :zones-init="value.data"
                @change="handleChange"
                @remove="handleRemove"
              />
            </el-col>
            <el-col :span="12">
              <div
                v-for="(item, index) in value.data"
                :key="`zone-item__${index}`"
                class="zone-item"
              >
                <CompPickerLink :value="item" @change="(e) => onChangeLink(e, index)" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">{{ $t('78c456ff.c08ab9') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ $t('78c456ff.aa7527') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import hotzone from 'vue-hotzone'
import { cloneDeep } from 'lodash'
import CompPickerLink from '@/view/decorate/comps/comp-pickerLink'
import CompButton from '@/view/decorate/comps/comp-button'
export default {
  name: 'AttrHotSetting',
  components: {
    CompPickerLink,
    CompButton,
    hotzone
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      localValue: {
        imgUrl: '',
        data: []
      },
      dialog: false
    }
  },
  watch: {
    localValue: {
      deep: true,
      handler: function (nVal, oVal) {
        this.$emit('input', nVal)
      }
    }
  },
  created() {
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    onSetHotZone() {
      this.dialog = true
    },
    onRemoveHotZone() {
      this.localValue.data = []
    },
    async onSelectImage() {
      const {
        data: { url }
      } = await this.$picker.image({
        data: { url: this.value.imgUrl }
      })
      this.localValue.imgUrl = url
    },
    handleChange(zone) {
      console.log('handle change, ', zone)
      zone.forEach(({ heightPer, widthPer, leftPer, topPer }, index) => {
        const v = cloneDeep(this.localValue.data[index])
        const obj = {
          // linkType: 0,
          // linkUrl: '',
          heightPer,
          leftPer,
          topPer,
          widthPer
        }
        Vue.set(this.localValue.data, index, {
          ...v,
          ...obj
        })
      })
    },
    handleRemove(index) {
      this.localValue.data.splice(index, 1)
    },
    onChangeLink(e, index) {
      const v = cloneDeep(this.localValue.data[index])
      Vue.set(this.localValue.data, index, {
        ...v,
        ...e
      })
    },
    onCancel() {
      this.dialog = false
    },
    onConfirm() {
      this.dialog = false
    }
  }
}
</script>
