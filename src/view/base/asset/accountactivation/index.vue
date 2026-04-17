<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <div class="section-white">
      <div class="section-box view-flex view-flex-vertical view-flex-center view-flex-middle">
        <div class="slogn">
          <div class="logo-box">
            <img :src="logoIcon" alt="" />
          </div>
          <div v-if="companyBrand == '超新星'">
            <h3>{{ $t('72ab3c4c.43aa70') }}</h3>
          </div>
        </div>
        <div v-if="loginType != 'distributor'" class="content-center">
          <el-input
            v-model="active_code"
            :placeholder="$t('72ab3c4c.a4e70f')"
            style="width: 300px"
          />
          <p class="desc">{{ $t('72ab3c4c.bdc807') }}</p>
        </div>
        <div v-if="loginType == 'distributor'" class="content-center">
          <p class="desc">{{ $t('72ab3c4c.cce46e') }}</p>
        </div>
        <div class="active-opr">
          <el-button v-if="loginType != 'distributor'" type="primary" @click="activetionAction">
            {{ $t('72ab3c4c.83a991') }}
          </el-button>
          <el-button type="default" @click="closeDialog">{{ $t('72ab3c4c.977deb') }}</el-button>
        </div>
      </div>
      <el-dialog
        :title="$t('72ab3c4c.02d981')"
        :visible="dialogVisible"
        :close-on-click-modal="false"
        :before-close="closeDialog"
      >
        <div class="brand">
          <div class="logo-box">
            <img :src="logoIcon" alt="" />
          </div>
          <span>{{ resultTxt }}</span>
        </div>
        <p class="frm-tips content-center" style="margin-top: 20px">
          {{ $t('72ab3c4c.814dc2') }}&nbsp;
          <span>{{ expired_at | datetime('YYYY-MM-DD HH:mm:ss') }}</span>
        </p>
        <div slot="footer" class="dialog-footer content-center active-opr">
          <el-button type="primary" @click="closeDialog">
            {{ btnTxt }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </SpPage>
</template>
<script>
import { activate, getActivateInfo } from '@/api/company'
import { VERSION_STANDARD } from '@/utils'
const login_bg_yundian = require(`@/assets/imgs/active_standard.png`)
const login_bg_b2c = require(`@/assets/imgs/active_b2c.png`)
const login_bg_inpurchase = require(`@/assets/imgs/active_inpurchase.png`)
const login_bg_ecshopx = require(`@/assets/imgs/active_platform.png`)
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activateInfo: {},
      logoIcon: '',
      active_code: '',
      expired_at: '',
      dialogVisible: false,
      resultTxt: this.$t('72ab3c4c.95dc16'),
      btnTxt: this.$t('72ab3c4c.aa7527'),
      loginType: 'default'
    }
  },
  computed: {
    ...mapGetters(['versionMode'])
  },
  mounted() {
    this.loginType = this.$store.getters.login_type
    switch (this.versionMode) {
      case 'standard':
        this.logoIcon = login_bg_yundian
        break
      case 'in_purchase':
        this.logoIcon = login_bg_inpurchase
        break
      case 'b2c':
        this.logoIcon = login_bg_b2c
        break
      default:
        this.logoIcon = login_bg_ecshopx
        break
    }
  },
  methods: {
    activetionAction() {
      if (this.active_code == '') {
        this.$message({ message: this.$t('72ab3c4c.a4e70f'), type: 'error' })
        return
      }
      let params = {
        active_code: this.active_code
      }
      activate(params).then((res) => {
        if (res.data.data) {
          this.$store.dispatch('setLicenseValid', true)
          this.expired_at = res.data.data.expired_at
          this.dialogVisible = true
        }
      })
    },
    closeDialog() {
      const loginPath = this.path_prefixes ? `/${this.path_prefixes}/login` : '/login'
      this.dialogVisible = false
      this.$store.dispatch('unsetToken').then(() => {
        this.$router.push({ path: loginPath })
      })
    },
    getActivateInfo() {
      getActivateInfo().then((res) => {
        this.activateInfo = res.data.data
        if (res.data.data.is_valid) {
          this.activateInfo = res.data.data
        } else {
          this.$router.push({ path: this.matchInternalRoute('assetaccountactivation') })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.section-box {
  height: 600px;
  text-align: center;
  > div {
    margin-bottom: 20px;
  }
}
.slogn {
  text-align: center;
  font-size: 0;
  .logo-box {
    margin: 10px auto;
    width: 200px;
    margin-bottom: 20px;
  }
  img {
    width: 100%;
  }
  h3,
  span {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
    font-size: 22px;
  }
}
.desc {
  margin-top: 10px;
  color: #999;
}
</style>
<style type="text/css">
.active-opr .el-button span {
  padding: 0 20px;
}
</style>
