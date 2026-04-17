<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
  <SpPage>
    <div class="app-detail">
      <div class="container-lf">
        <el-image class="app-logo" :src="require(`@/assets/img/ectapp/${id}.png`)" />
      </div>
      <div class="container-rg">
        <div class="app-name">{{ $t(appName) }}</div>
        <div class="app-desc">{{ $t(appDesc) }}</div>
        <div class="app-action">
          <el-button type="primary" plain @click="onClickItem">
            {{ $t('c161091b.710d33') }}
          </el-button>
        </div>
        <div v-if="!['miaosha', 'supplier'].includes(id)" class="app-image">
          <el-image class="desc-image" :src="require(`@/assets/img/ectapp/${id}_detail.png`)" />
        </div>
      </div>

      <el-dialog
        custom-class="dialog-app"
        :title="$t(appName)"
        :visible.sync="dialogVisible"
        width="500px"
      >
        <div class="dialog-app-content">
          <div class="connect-icon">
            <el-image :src="require(`@/assets/img/ectapp/${id}_code.png`)" />
          </div>
          <div class="connect-desc">
            <div class="txt-m">{{ $t('c161091b.a1a4c9') }}</div>
            <div class="txt-s">{{ $t('c161091b.d9be85') }}</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('c161091b.c08ab9') }}</el-button>
          <el-button type="primary" @click="dialogVisible = true">
            {{ $t('c161091b.38cf16') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </SpPage>
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
