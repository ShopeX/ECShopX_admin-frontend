<template>
  <div>
    <section class="section section-white content-padded-b" v-loading="loading">
      <div v-if="ali_appid && detail">
        <div class="content-center">
          <div class="page-top">
            <img class="app-img" src='@/assets/img/onexshop_logo.png' height="60" />
            <div class="page-right">
              <div class="app-name">
                <span v-if="!detail.app_id">
                  小程序名称：{{ detail.app_id }}
                </span>
              </div>
              <div class="app-name">
                <span v-if="detail.app_id">
                  小程序APPID：{{ detail.app_id }}
                </span>
              </div>
              <div class="app-name">
                <span v-if="!detail.app_id">
                  商家名称：{{ detail.app_id }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="page-middle">
          <div class="page-middle-left">
            <div class="middle-title">模板</div>
            <div>模板名称：{{detail.template_name}}</div>
            <div>模板版本号：{{detail.template_version}}</div>
            <div>发布时间：{{detail.template_updated | formatDataTime("YYYY-MM-DD hh:mm:ss")}}</div>
          </div>
          <div class="page-middle-right">
            <div class="middle-title">支付宝小程序</div>
            <div class="label-f">
              <span class="s-width">已上架版本：{{detail.release_ver != 0 ? detail.release_ver : '/'}}</span>
              <span v-if="detail.release_time != null">上架时间：{{detail.release_time | formatDataTime("YYYY-MM-DD hh:mm:ss")}}</span>
              <span v-else>上架时间：{{'/'}}</span>
            </div>
            <div class="label-f">
              <span class="s-width">当前操作版本：{{detail.cur_ver}}</span>
              <span>状态：{{curStatus[detail.status]}}</span>
            </div>
            <div>当前版本操作时间：{{detail.updated_at | formatDataTime("YYYY-MM-DD hh:mm:ss")}}</div>
          </div>
        </div>
        <div class="content-center">
          <el-button
            type="success"
            @click="handleAddALiAction"
            v-if="detail.status === 0 || 
              ((detail.status === 1 || detail.status === 5 || detail.status === 6) && detail.template_version > detail.cur_ver)"
            >上传代码</el-button>
          <el-button
            type="primary"
            @click="downloadTextALiCode"
            v-if="detail.status === 1"
            >体验版二维码</el-button>
          <el-button
            type="primary"
            @click="handleAddWxaActionSubmitReview"
            v-if="detail.status === 1"
            >提交审核</el-button>
          <el-button
            type="primary"
            @click="handleUndocodeaudit"
            v-if="detail.status === 2"
            >撤销审核</el-button>
          <el-button
            type="primary"
            @click="handleOnLine"
            v-if="detail.status === 3"
            >上架</el-button>
            <el-button
            type="primary"
            @click="handleOffLine"
            v-if="detail.status === 5"
            >下架</el-button>
          <el-button
            type="primary"
            @click="handleBackDev"
            v-if="detail.status === 3 || detail.status === 4"
            >退回开发</el-button>
          <el-button
            type="warning"
            @click="handleRollBack"
            v-if="detail.can_rollback && detail.status === 5"
            >回退版本</el-button>
          <el-button
            type="primary"
            @click="handleBind(true)"
            v-if="detail.status !== 6"
            >更新授权</el-button>
        </div>
      </div>
      <div class="content-center no-bind" v-else>
        <div><i class="iconfont icon-info-circle" style="font-size: 70px;"></i></div>
        <div class="content-padded">未绑定小程序</div>
        <el-button type="primary" @click="handleBind()">授权小程序</el-button>
      </div>
      <div class="page-bottom" v-if="detail.status === 4">
        <div>审核驳回原因：</div>
        <div class="content" v-html="detail.reason"></div>
      </div>
    </section>
    <el-dialog title="小程序码" :visible.sync="aLiCodeVisible">
      <div class="content-center">
        <!-- <img src="http://wx.qlogo.cn/mmopen/FXXXHOj2xs8temGVQEFLnFNBwY6ticka7ed0qF8ZNemAXOAFbap0AjgovibyJhQiaXCj71V3ic51BKuBPlxSL3RcdJiaorbFUpPFn/0" /> -->
        <img :src="aLiCodeImage" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getALi,
  submitALi,
  cancelAudit,
  onLine,
  offLine,
  backDev,
  rollBack,
  submitCheck,
  getALiTestQrcode, 
  getALiPreAuthUrl,
  getALiCreatQrcode,
} from '@/api/ali'
export default {
  data() {
    return {
      aLiCodeVisible: false,
      loading: false,
      authorizerUrl: '',
      aLiCodeImage: '',
      submitALiForm: {
        authorizer_appid: '',
        template_name: ''
      },
      detail: {},
      curStatus: {
         0: "未开始",
         1: "开发中",
         2: "审核中",
         3: "审核通过",
         4: "审核驳回",
         5: "上架",
         6: "下架"
      }
    }
  },
  computed: {
    ...mapGetters(['ali_appid', 'ali_template_name'])
  },
  methods: {
    // 获取数据
    getALi() {
      this.loading = true
      getALi(this.ali_appid).then((response) => {
        this.detail = response.data.data
        this.loading = false
      })
    },
    // 创建二维码
    async createQRcode(isRequst) {
      let { is_create_exp, app_id, template_name } = this.detail
      if (isRequst || !is_create_exp) {
        let params = { authorizer_appid: app_id, template_name }
        try {
          await getALiCreatQrcode(params)
          this.getALi()
        } catch (e) {
          this.getALi()
          console.log('体验版二维码创建失败')
        }
      }
    },
    // 授权
    handleBind(bound) {
      let params = {
        template_name: !bound ? this.$route.query.templatename :
          this.detail.template_name
      }
      getALiPreAuthUrl(params).then((response) => {
        this.authorizerUrl = response.data.data.url
        // var metadata = document.getElementsByTagName('meta')
        // for (var i = 0; i < metadata.length; i++) {
        //   if (metadata[i]['name'] == 'referrer') {
        //     metadata[i]['content'] = 'default'
        //   }
        // }
        window.open(this.authorizerUrl)
      })
    },
    // 撤销审核
    handleUndocodeaudit() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      cancelAudit(this.submitALiForm).then((response) => {
        this.$message({
          message: '撤销成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.getALi()
      })
    },
    // 上架
    handleOnLine() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      onLine(this.submitALiForm).then((response) => {
        this.$message({
          message: '上架成功',
          type: 'success',
          duration: 2 * 1000
        })
        this.getALi()
      })
    },
    // 下架
    handleOffLine() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      offLine(this.submitALiForm).then((response) => {
        this.$message({
          message: '已下架',
          type: 'success',
          duration: 2 * 1000
        })
        this.getALi()
      })
    },
    // 退回开发
    handleBackDev() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      backDev(this.submitALiForm).then((response) => {
        this.$message({
          message: '已退回开发',
          type: 'success',
          duration: 2 * 1000
        })
        this.getALi()
      })
    },
    // 回退版本
    handleRollBack() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      rollBack(this.submitALiForm).then((response) => {
        this.$message({
          message: '版本已回退',
          type: 'success',
          duration: 2 * 1000
        })
        this.getALi()
      })
    },
    // 提交代码
    handleAddWxaActionSubmitReview() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      submitCheck(this.submitALiForm).then((response) => {
        this.$message({
          message: '提交成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.getALi()
      })
    },
    // 上传代码
    handleAddALiAction() {
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      submitALi(this.submitALiForm).then((response) => {
        this.$message({
          message: '上传成功',
          type: 'success',
          duration: 5 * 1000
        })
        this.createQRcode(true)
      })
    },
    // 查看二维码
    downloadTextALiCode() {
      if (!this.detail.is_create_exp) {
        this.createQRcode()
        return
      }
      this.submitALiForm.authorizer_appid = this.detail.app_id
      this.submitALiForm.template_name = this.detail.template_name
      getALiTestQrcode(this.submitALiForm).then((response) => {
        if (response.data.data.status != 'expVersionPackged') {
          this.$message({
            message: '体验版二维码创建中，请稍后重试！',
            type: 'warning',
            duration: 5 * 1000
          })
        } else {
          this.aLiCodeImage = response.data.data.exp_qr_code_url
          this.aLiCodeVisible = true
        }
      })
    }
  },
  mounted() {
    if (this.ali_appid) {
      this.loading = true
      getALi(this.ali_appid).then((response) => {
        this.detail = response.data.data
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-top {
  display: flex;
  margin-bottom: 50px;
}
.page-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.app-img {
  width: 90px;
  height: auto;
  margin: 10px 40px 10px 10px;
}
.app-name {
  font-size: 16px;
  display: flex;
  align-content: center;
}
.page-middle {
  width: 100%;
  display: flex;
  margin-bottom: 50px;
}
.page-middle-left {
  width: 48%;
  margin-right: 2%;
  height: 200px;
  box-shadow: 0 0 5px #999999;
  border-radius: 10px;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.page-middle-right {
  width: 48%;
  margin-left: 2%;
  height: 200px;
  box-shadow: 0 0 5px #999999;
  border-radius: 10px;
  padding: 10px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.middle-title {
  font-size: 20px;
  font-weight: 500;
}
.label-f {
  display: flex;
}
.s-width {
  display: block;
  width: 60%;
}
.page-bottom {
  width: 100%;
  height: auto;
  background: #f4f4f4;
  padding: 20px 30px;
  font-size: 20px;
  margin-top: 50px;
  border-radius: 10px;
  .content {
    margin: 15px 0 0 40px;
    font-size: 16px;
  }
}



.info-list {
  padding: 30px 0;
  .info-item {
    font-size: 14px;
    .label {
      width: 100px;
      height: 50px;
      line-height: 50px;
      float: left;
      color: #ccc;
    }
    .content {
      display: flex;
      align-items: center;
      height: 50px;
      margin-left: 120px;
      border-bottom: 1px solid #efefef;
      .content-item {
        flex: 1;
      }
    }
  }
}
.demo {
  padding: 30px;
}
.demo-qrcode {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin: 0 auto;
  transition: all 0.3s ease;
  transform: scale(1);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
  img {
    display: block;
    width: 70%;
    height: 70%;
  }
}
.no-bind {
  color: #ccc;
}
</style>
