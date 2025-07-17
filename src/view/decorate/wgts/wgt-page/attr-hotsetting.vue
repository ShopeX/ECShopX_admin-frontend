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
    <CompButton
      placeholder="设置热区"
      format="{0}个热区"
      :value="value.data?.length"
      :view-btn="false"
      @click="onSetHotZone"
      @remove="onRemoveHotZone"
    />

    <el-dialog
      :visible="dialog"
      class="sp-dialog"
      append-to-body
      destroy-on-close
      title="热区设置"
      width="800px"
      @close="onCancel"
    >
      <div v-if="dialog" class="">
        <div>
          <el-button type="primary" size="small" plain @click="onSelectImage"> 选择图片 </el-button>
          <span style="font-size: 12px; color: #888; margin-left: 4px"
            >建议尺寸:（宽度640px，高度自适应）</span
          >
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
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onConfirm"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import hotzone from 'vue-hotzone'
import { cloneDeep } from 'lodash'
import CompPickerLink from '../../comps/comp-pickerLink'
import CompButton from '../../comps/comp-button'
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
    },
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
    console.log('created hotsetting, ', this.value)
    this.localValue = cloneDeep(this.value)
  },
  methods: {
    onSetHotZone() {
      this.dialog = true
    },
    onRemoveHotZone() {
      this.localValue.data = []
      this.localValue.imgUrl = ''
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
