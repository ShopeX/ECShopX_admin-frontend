<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <section v-loading="loading" class="section section-white content-padded-b">
      <div v-if="ali_appid && detail">
        <div class="content-center">
          <div class="page-top">
            <img class="app-img" src="@/assets/img/onexshop_logo.png" height="60" />
            <div class="page-right">
              <div class="app-name">
                <span v-if="!detail.app_id">
                  {{ $t('29eb91bc.d34f1f') }}：{{ detail.app_id }}
                </span>
              </div>
              <div class="app-name">
                <span v-if="detail.app_id"> {{ $t('29eb91bc.d70fe9') }}：{{ detail.app_id }} </span>
              </div>
              <div class="app-name">
                <span v-if="!detail.app_id">
                  {{ $t('29eb91bc.050442') }}：{{ detail.app_id }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="page-middle">
          <div class="page-middle-left">
            <div class="middle-title">{{ $t('29eb91bc.59cf15') }}</div>
            <div>{{ $t('29eb91bc.a5d1c5') }}：{{ detail.template_name }}</div>
            <div>{{ $t('29eb91bc.d2d367') }}：{{ detail.template_version }}</div>
            <div>
              {{ $t('29eb91bc.f1f98f') }}：{{
                detail.template_updated | formatDataTime('YYYY-MM-DD hh:mm:ss')
              }}
            </div>
          </div>
          <div class="page-middle-right">
            <div class="middle-title">{{ $t('29eb91bc.42d922') }}</div>
            <div class="label-f">
              <span class="s-width"
                >{{ $t('29eb91bc.c31cb2') }}：{{
                  detail.release_ver != 0 ? detail.release_ver : '/'
                }}</span
              >
              <span v-if="detail.release_time != null"
                >{{ $t('29eb91bc.e2c409') }}：{{
                  detail.release_time | formatDataTime('YYYY-MM-DD hh:mm:ss')
                }}</span
              >
              <span v-else>{{ $t('29eb91bc.e2c409') }}：{{ '/' }}</span>
            </div>
            <div class="label-f">
              <span class="s-width">{{ $t('29eb91bc.e6f940') }}：{{ detail.cur_ver }}</span>
              <span>{{ $t('29eb91bc.3fea7c') }}：{{ $t(curStatus[detail.status]) }}</span>
            </div>
            <div>
              {{ $t('29eb91bc.38e300') }}：{{
                detail.updated_at | formatDataTime('YYYY-MM-DD hh:mm:ss')
              }}
            </div>
          </div>
        </div>
        <div class="content-center">
          <el-button
            v-if="
              detail.status === 0 ||
              ((detail.status === 1 || detail.status === 5 || detail.status === 6) &&
                detail.template_version > detail.cur_ver)
            "
            type="success"
            @click="handleAddALiAction"
          >
            {{ $t('29eb91bc.9725db') }}
          </el-button>
          <el-button v-if="detail.status === 1" type="primary" @click="downloadTextALiCode">
            {{ $t('29eb91bc.17693d') }}
          </el-button>
          <el-button
            v-if="detail.status === 1"
            type="primary"
            @click="handleAddWxaActionSubmitReview"
          >
            {{ $t('29eb91bc.646db0') }}
          </el-button>
          <el-button v-if="detail.status === 2" type="primary" @click="handleUndocodeaudit">
            {{ $t('29eb91bc.17e982') }}
          </el-button>
          <el-button v-if="detail.status === 3" type="primary" @click="handleOnLine">
            {{ $t('29eb91bc.4a5098') }}
          </el-button>
          <el-button v-if="detail.status === 5" type="primary" @click="handleOffLine">
            {{ $t('29eb91bc.d2379a') }}
          </el-button>
          <el-button
            v-if="detail.status === 3 || detail.status === 4"
            type="primary"
            @click="handleBackDev"
          >
            {{ $t('29eb91bc.6f1414') }}
          </el-button>
          <el-button
            v-if="detail.can_rollback && detail.status === 5"
            type="warning"
            @click="handleRollBack"
          >
            {{ $t('29eb91bc.8e3b19') }}
          </el-button>
          <el-button v-if="detail.status !== 6" type="primary" @click="handleBind(true)">
            {{ $t('29eb91bc.af3ef9') }}
          </el-button>
        </div>
      </div>
      <div v-else class="content-center no-bind">
        <div>
          <i class="iconfont icon-info-circle" style="font-size: 70px" />
        </div>
        <div class="content-padded">{{ $t('29eb91bc.6a7b6f') }}</div>
        <el-button type="primary" @click="handleBind()"> {{ $t('29eb91bc.d7a8d8') }} </el-button>
      </div>
      <div v-if="detail.status === 4" class="page-bottom">
        <div>{{ $t('29eb91bc.764d0d') }}：</div>
        <div class="content" v-html="detail.reason" />
      </div>
    </section>
    <el-dialog :title="$t('29eb91bc.b85b43')" :visible.sync="aLiCodeVisible">
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
  getALiCreatQrcode
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
        0: '29eb91bc.dd4e55',
        1: '29eb91bc.29dd65',
        2: '29eb91bc.b720a6',
        3: '29eb91bc.871a30',
        4: '29eb91bc.a77aa8',
        5: '29eb91bc.4a5098',
        6: '29eb91bc.d2379a'
      }
    }
  },
  computed: {
    ...mapGetters(['ali_appid', 'ali_template_name'])
  },
  mounted() {
    if (this.ali_appid) {
      this.loading = true
      getALi(this.ali_appid).then((response) => {
        this.detail = response.data.data
        this.loading = false
      })
    }
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
        template_name: !bound ? this.$route.query.templatename : this.detail.template_name
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
          message: this.$t('29eb91bc.8e05b0'),
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
          message: this.$t('29eb91bc.e241a8'),
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
          message: this.$t('29eb91bc.ca9084'),
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
          message: this.$t('29eb91bc.21981e'),
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
          message: this.$t('29eb91bc.b384e3'),
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
          message: this.$t('29eb91bc.23b62e'),
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
          message: this.$t('29eb91bc.a7699b'),
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
            message: this.$t('29eb91bc.f00eda'),
            type: 'warning',
            duration: 5 * 1000
          })
        } else {
          this.aLiCodeImage = response.data.data.exp_qr_code_url
          this.aLiCodeVisible = true
        }
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
