<style lang="scss" scoped>
.app-detail {
  display: flex;
}
.app-logo {
  width: 160px;
  height: 160px;
}
.container-rg {
  margin-left: 20px;
}
.app-name {
  font-size: 15px;
  color: #333;
  margin-top: 20px;
}

.app-desc {
  font-size: 13px;
  color: #777;
  height: 80px;
}
.dialog-app-content {
  display: flex;
  .connect-icon {
    width: 120px;
    height: 120px;
  }
  .connect-desc {
    margin-left: 10px;
  }
  .txt-s {
    margin-top: 36px;
  }
}
.app-image {
  margin-top: 20px;
}
</style>
<style lang="scss">
.dialog-app {
  .el-dialog__body {
    padding: 10px 20px 0;
  }
}
</style>
<template>
  <div class="app-detail">
    <div class="container-lf">
      <el-image class="app-logo" :src="require(`@/assets/img/ectapp/${id}.png`)" />
    </div>
    <div class="container-rg">
      <div class="app-name">{{ appName }}</div>
      <div class="app-desc">{{ appDesc }}</div>
      <div class="app-action">
        <el-button type="primary" plain @click="onClickItem">立即订购</el-button>
      </div>
      <div v-if="id != 'miaosha'" class="app-image">
        <el-image class="desc-image" :src="require(`@/assets/img/ectapp/${id}_detail.png`)" />
      </div>
    </div>

    <el-dialog
      custom-class="dialog-app"
      :title="appName"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="dialog-app-content">
        <div class="connect-icon">
          <el-image :src="require(`@/assets/img/ectapp/${id}_code.png`)" />
        </div>
        <div class="connect-desc">
          <div class="txt-m">扫描左侧二维码联系工作人员订购应用，订购成功前无法使用。</div>
          <div class="txt-s">如已订购，请联系客服处理。</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = true">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { APPLICATION_LIST } from './consts'
export default {
  name: '',
  data() {
    return {
      id: '',
      appName: '',
      appDesc: '',
      selectKey: 'adapay',
      dialogVisible: false
    }
  },
  created() {
    const { id } = this.$route.params
    this.id = id
    const { title, desc } = APPLICATION_LIST.find((item) => item.key == id)
    this.appName = title
    this.appDesc = desc
  },
  methods: {
    onClickItem() {
      this.dialogVisible = true
    }
  }
}
</script>
