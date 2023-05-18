<style lang="scss"></style>
<template>
  <el-dialog
    :visible="dialog"
    class="sp-draggable"
    append-to-body
    destroy-on-close
    width="800px"
    :title="title"
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
            <div v-for="(item, index) in value.data" :key="`zone-item__${index}`" class="zone-item">
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
</template>

<script>
export default {
  name: 'SpDraggable',
  props: {
    title: {
      type: String,
      default: '查看'
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
