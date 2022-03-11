<template>
  <div>
    <!-- <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="销售中心开发设置" name="first"> -->
    <el-card>
      <div slot="header">
        <span>销售中心开发设置</span>
      </div>
      <div class="content-padded message-autograph">
        <span class="width_100">KEY</span>
        <el-input
          v-model="shopForm.app_key"
          placeholder="请输入内容"
          :disabled="true"
        />
        <!-- <el-button @click="generateKey">随机生成</el-button> -->
      </div>
      <div class="content-padded message-autograph">
        <span class="width_100">SECRET</span>
        <el-input
          v-model="shopForm.app_secret"
          placeholder="请输入SECRET"
          :disabled="true"
        />
        <!-- <el-button @click="generateSecret">随机生成</el-button> -->
      </div>
      <!-- <div class="content-padded message-autograph">
        <span class="width_100"></span>
        <el-button type="primary" @click="saveShop">保存</el-button>
      </div> -->
    </el-card>
    <!-- </el-tab-pane> -->
    <!-- <el-tab-pane label="营销中心开发设置" name="secord"> -->
    <el-card>
      <div slot="header">
        <span>营销中心开发设置</span>
      </div>
      <div class="content-padded message-autograph">
        <span class="width_100">BASE_URL</span>
        <el-input
          v-model="shopForm.external_base_uri"
          placeholder="请输入内容"
          :disabled="true"
        />
      </div>
      <div class="content-padded message-autograph">
        <span class="width_100">KEY</span>
        <el-input
          v-model="shopForm.external_app_key"
          placeholder="请输入内容"
          :disabled="true"
        />
      </div>
      <div class="content-padded message-autograph">
        <span class="width_100">SECRET</span>
        <el-input
          v-model="shopForm.external_app_secret"
          placeholder="请输入SECRET"
          :disabled="true"
        />
      </div>
      <!-- <div class="content-padded message-autograph">
        <span class="width_100"></span>
        <el-button type="primary" @click="saveSales">保存</el-button>
      </div> -->
    </el-card>
    <!-- </el-tab-pane> -->
    <!-- </el-tabs> -->
  </div>
</template>
<script>
import { getShopSetting, saveShopSetting, saveSalesSetting, getSalesSetting } from '@/api/openapi'
import { getRandwords } from '@/utils/index'
export default {
  data () {
    return {
      detailDialog: false,
      activeName: 'first',
      messageCount: 0,
      smsTemlateList: [],
      messageAutograph: '',
      sms_buy_url: '',
      currentTemplate: {
        is_open: false,
        content: '',
        send_time_desc: {
          title: ''
        }
      },
      shopForm: {
        app_key: '',
        app_secret: ''
      },
      salesForm: {
        app_key: '',
        app_secret: '',
        base_uri: ''
      }
    }
  },
  mounted () {
    getShopSetting().then((response) => {
      this.shopForm = response.data.data
    })
    // getSalesSetting().then((response) => {
    //   this.salesForm = response.data.data;
    // });
  },
  methods: {
    generateKey () {
      this.shopForm = {
        ...this.shopForm,
        app_key: getRandwords()
      }
    },
    generateSecret () {
      this.shopForm = {
        ...this.shopForm,
        app_secret: getRandwords(32)
      }
    },
    closeDialog () {
      this.detailDialog = false
    },
    toDetail (params) {
      this.detailDialog = true
      this.currentTemplate = params
    },
    saveShop () {
      saveShopSetting(this.shopForm).then((_) => {
        this.$message({
          type: 'success',
          message: '保存销售中心开发设置成功'
        })
      })
    },
    saveSales () {
      saveSalesSetting(this.salesForm).then((_) => {
        this.$message({
          type: 'success',
          message: '保存营销中心开发设置成功'
        })
      })
    }
  }
}
</script>
<style scoped type="text/css" lang="scss">
.width_100 {
  width: 100px;
  text-align: left;
  display: inline-block;
}
.el-tab-pane {
  min-height: 700px;
}
.message-content {
  button {
    margin-left: 20px;
  }
}
.message-count {
  margin: 0 5px 0 20px;
  font-size: 24px;
  color: #ff5000;
}
.message-template {
  .item {
    display: inline-block;
    width: 210px;
    margin: 0 10px;
    border: 1px solid #dfdfdf;
    &-title {
      padding: 10px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      i {
        float: right;
        margin-top: 4px;
      }
    }
    &-content {
      height: 140px;
      padding: 20px 10px;
      color: #333;
      font-size: 12px;
    }
    &-footer {
      // border-top: 1px solid #dfdfdf;
      padding: 10px 0;
      text-align: center;
      button {
        width: 50%;
        &:hover {
          border: 1px solid #c4c4c4;
          color: #1f2d3d;
        }
      }
    }
    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
    &.not-open-sms {
      .item-title {
        background-color: #ff4949;
      }
    }
    &.succ-open-sms {
      .item-title {
        background-color: #13ce66;
      }
    }
  }
}
.message-autograph {
  .el-input {
    width: 280px;
    margin-right: 10px;
  }
  span {
    margin: 0 10px;
  }
  // button {
  //   width: 80px;
  // }
}
.message-prompt {
  margin-top: 30px;
  padding-left: 20px;
  .prompt {
    &-title {
      margin-bottom: 10px;
      font-size: 18px;
      color: #333;
      span {
        border-left: 3px solid #20a0ff;
        padding-left: 10px;
      }
    }
    &-content {
      padding-left: 8px;
      line-height: 1.6;
      color: #666;
      .item-title {
        margin-bottom: 5px;
      }
      .item-content {
        padding-left: 14px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
