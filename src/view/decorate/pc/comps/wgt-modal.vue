<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss" src="./wgt-modal.scss"></style>

<template>
  <div v-if="visible">
    <el-dialog title="选择挂件" :visible.sync="visible" :before-close="handleClose">
      <el-radio-group style="width: 100%" v-model="selected" size="small">
        <div class="wgts">
          <div
            v-for="(wgt, index) in wgtlist"
            :key="`wgt-item__${index}`"
            class="wgt-item"
            :data-name="wgt.name"
          >
            <el-radio class="wgt-item--content" :label="wgt.name">
              <div :class="['wgt-icon', wgt.wgtIcon]" />
              <div class="wgt-name">
                {{ wgt.wgtName }}
              </div>
            </el-radio>
          </div>
        </div>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleComfirm"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    wgtlist: {
      default: () => [],
      type: Array
    }
  },
  watch: {
    wgtlist(val) {
      console.log('wgtlist', val)
    }
  },
  data() {
    return {
      selected: ''
    }
  },
  methods: {
    handleComfirm() {
      if (this.selected) {
        this.$emit('comfirm', this.selected)
        this.$emit('close')
      }
    },
    handleClose() {
      this.selected = ''
      this.$emit('close')
    }
  }
}
</script>
