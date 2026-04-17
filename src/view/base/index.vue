<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.main {
  min-width: 1200px;
  //   overflow: auto;
}
.unbind-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 285px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-bottom: 15px;
  .content-center {
    padding: 30px 30px 15px 30px;
  }
  .iconfont {
    display: block;
    margin-bottom: 20px;
    font-size: 70px;
    line-height: 1;
    color: #eaeaea;
  }
  p {
    margin-bottom: 20px;
  }
  .bot-tips {
    font-size: 12px;
    padding-top: 5px;
    // display: flex;
    // align-items: center;
    padding: 0px 10px;
    text-align: center;
    cursor: default;
    a {
      cursor: pointer;
      font-size: 12px;
      margin-left: 5px;
      color: #5ea7ec;
    }
    :last-child {
      font-size: 12px;
      margin-left: 10px;
      color: #459ae9;
    }
  }
}

.section-card {
  padding: 30px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &.realtime-statics {
    height: 285px;
  }
  &.purchase-chart-statics {
    height: 288px;
  }
  &.chart-statics {
    height: 368px;
  }
  .section-card-header {
    display: flex;
    align-items: flex-end;
    padding-bottom: 20px;
    .section-card-title {
      margin-right: 20px;
      font-size: 16px;
      font-weight: 600;
    }
    .header-small {
      flex: 1;
      font-size: 12px;
      color: #ccc;
    }
    .header-filters {
      display: flex;
      .filter-item {
        position: relative;
        padding: 0 15px;
        color: #999;
        font-size: 12px;
        &::after {
          position: absolute;
          left: 0;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: #efefef;
          content: '';
        }
        &:first-child::after {
          content: none;
        }
      }
    }
  }
  &.company {
  }
}

.company {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 285px;
  width: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 30px 0px 20px;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }
  .name {
    margin-bottom: 10px;
    font-size: 14px;
  }
  .operate {
    // padding-bottom: 50px;
    margin-bottom: 10px;
  }
  .validity-period {
    display: flex;
    font-size: 12px;
    color: #999;
    width: 100%;
    margin-left: 120px;
    text-align: left;
    .iconfont {
      margin-right: 10px;
      font-size: 12px;
    }
  }
  .bot-tips {
    font-size: 12px;
    padding-top: 5px;
    // display: flex;
    // align-items: center;
    padding: 0px 10px;
    text-align: center;
    a {
      cursor: pointer;
      font-size: 12px;
      margin-left: 5px;
      color: #5ea7ec;
    }
  }
}

.analysis {
  padding-left: 20px;
  padding-top: 10px;
  .label {
    font-size: 12px;
    color: #999;
  }
  .real-data {
    font-size: 20px;
    font-family: 'Helvetica Neue';
    font-weight: 500;
  }
  .history-data {
    font-size: 12px;
    color: #ccc;
  }
}

.notices {
  padding-left: 20px;
  .notices-group {
    padding: 10px 0;
  }
  .subtitle {
    padding-bottom: 10px;
    font-size: 14px;
    color: #666;
  }
  .notice-item {
    font-size: 12px;
    color: #999;
    cursor: pointer;
  }
}

.quick-link {
  padding-left: 20px;
  .link-item {
    float: left;
    width: 230px;
    margin: 10px 0;
    color: #666;
    cursor: pointer;
    .iconfont {
      display: inline-block;
      margin-right: 10px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      border-radius: 5px;
      color: #fff;
      font-size: 12px;
    }
  }
}
.fn-b-20 {
  margin-bottom: 20px;
}
.to-become {
  // float: left;
  // position: relative;
  // top:-30px;
  background-color: #fef4f3;
  border: 1px solid #f25d4c;
  //   min-width: 1200px;
  width: 75%;
  position: fixed;
  top: 4px;
  display: flex;
  justify-content: space-between;
  //   justify-content: space-between;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  z-index: 999;
  .text-icon {
    line-height: 38px;
    height: 40px;
    display: flex;
    // text-align: center;
  }
  .icon-wr {
    line-height: 38px;
    font-size: 20px;
    color: #f05e51;
  }
  .btn {
    padding-left: 40px;
    line-height: 38px;
    padding-bottom: 6px;
  }
}
.buy {
  display: flex;
  justify-content: space-between;
  padding: 10px 50px;
  .buy-item {
    width: 320px;
    padding: 0;
    .buy-item-hd {
      padding: 10px;
      height: 120px;
      text-align: center;
      color: white;
      h3 {
        margin: 10px;
        font-size: 24px;
        color: white;
      }
      &_s {
      }
      &_b {
        color: white;
        h3 {
          color: white;
        }
      }
      &_l {
        h3 {
          color: white;
        }
      }
    }
    .buy-item-ft {
      min-height: 450px;
      padding: 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      .buy-item-btn {
        width: 100px;
      }
      .buy-item-ft-text {
        text-align: center;
        .suo {
          margin-top: 100px;
          margin-bottom: 30px;
          width: 40px;
          // height:150px;
        }
      }

      p {
        padding: 8px;
      }
      .check-icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.buy-hd {
  text-align: center;
  margin-bottom: 40px;
  h3 {
    font-size: 24px;
    color: #333333;
    font-weight: bold;
  }
}
.card-right {
  width: 85%;
  background-color: #fafafa;
  text-align: center;
  .phone-card {
    width: 150px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .phone-icon {
    width: 16px;
    height: 17px;
    margin-right: 10px;
  }
  .phone-num {
    color: #333333;
    font-size: 14px;
    font-weight: bold;
    // // height: 25px;
    // word-wrap: break-word;
    // word-break: normal;
    margin-bottom: 10px;
  }
  .phone-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 110px;
    height: 30px;
    margin: 0 auto;
    border: 1px solid #5ea7ec;
    text-align: center;
    border-radius: 3px;
    padding: 0 10px;
    span {
      color: #5ea7ec;
    }
  }
}
.demo-img {
  width: 100%;
  text-align: center;
  // padding: 40px 0;
  .sl-img-hd {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20px;
  }
  .img-demo {
    width: 70%;
    margin: 0 auto;
  }
}
.sound-img {
  width: 100%;
  padding: 0px;
  box-shadow: 0px 0px 2px 0px #dfe7f3;
  border-radius: 2px;
  position: relative;
  .img-demo {
    width: 100%;
    margin: 0 auto;
    display: block;
  }
  .sound-btn {
    width: 30%;
    height: 25%;
    position: absolute;
    bottom: 12%;
    left: 4%;
    cursor: pointer;
  }
}
.sl-img {
  // padding: 0;
  width: 100%;
  text-align: center;
  // padding: 40px 0;
  .sl-img-hd {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
    i {
      margin-right: 10px;
    }
  }
  .img-demo {
    width: 70%;
    margin: 0 auto;
  }
}
.title {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.title-span {
  text-align: center;
  margin-top: -30px;
}
.dialog-footer {
  text-align: center;

  .btn-ft {
    margin: 0 20px;
    width: 140px;
  }
}
.produce-dynamic,
.produce-manual {
  padding: 0px;
  .produce-hd {
    height: 50px;
    line-height: 50px;
    border-radius: 2px;
    background: rgba(203, 6, 15, 0.03);
    padding: 0px 15px;
  }
  .title {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
  .more {
    text-align: right;
    span {
      color: #999;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
.produce-dynamic {
  .icon-dongtai-01 {
    padding: 2px;
    font-size: 14px;
    color: #fff;
    background: var(--primary);
    border-radius: 2px;
    font-weight: normal;
    margin-right: 5px;
  }
  .news {
    display: inline-block;
    width: 30px;
    text-align: center;
    color: #f8841f;
    font-size: 12px;
    border-radius: 2px;
    margin-right: 5px;
    font-weight: bold;
  }
  .margins {
    margin-left: 35px;
  }
  .overflows {
    color: #999;
    @include text-overflow();
    span {
      font-size: 12px;
      cursor: pointer;
    }
  }
  .row-link {
    padding: 0px 15px 10px 15px;
    margin-bottom: 0px !important;
  }
}
.produce-manual {
  .icon-caozuoshouce {
    padding: 2px;
    font-size: 14px;
    color: #fff;
    background: var(--primary);
    border-radius: 2px;
    font-weight: normal;
    margin-right: 5px;
  }
  .el-row {
    margin-bottom: 0px !important;
  }
}
.dialog-version {
  .el-dialog__body {
    padding: 20px;
    border: 1px solid #f5f5f5;
  }
  .update-tip {
    color: #333;
    margin-bottom: 20px;
  }
  .install-desc {
    font-size: 13px;
  }
  a {
    cursor: default;
  }
}
.license-txt {
  background-color: #fef4f3;
  border: 1px solid #f25d4c;
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  .icon-wr {
    font-size: 18px;
    color: #f05e51;
    margin-right: 2px;
  }
}
</style>
<template>
  <div v-if="bool" class="main">
    <!-- v-if="activateInfo.due_reminder" -->
    <div v-if="activateInfo.due_reminder" class="to-become">
      <div class="text-icon">
        <i class="el-icon-warning icon-wr" /><span>{{ $t('d7e708c9.c74d61') }}</span>
      </div>
      <!-- <div class="btn">
        <el-button @click="handleBuy" size="mini" type="danger"
          >立即购买</el-button
        >
      </div> -->
    </div>
    <el-row :gutter="20">
      <el-col :span="VERSION_PLATFORM() && VUE_APP_FREE ? 19 : 20">
        <el-row
          v-if="activateInfo && activateInfo.license && activateInfo.license.show_expier_tip == 1"
          :gutter="20"
        >
          <el-col>
            <div class="license-txt">
              <i class="el-icon-warning icon-wr" />{{
                $t('d7e708c9.b6d343', [activateInfo.license.left_time])
              }}
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col v-if="!VERSION_SHUYUN()" :span="7">
            <template v-if="!isBind">
              <div class="unbind-box">
                <div class="content-center">
                  <div v-if="activateInfo && !VUE_APP_FREE" class="validity-period">
                    {{ activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss') }}
                    {{ $t('d7e708c9.851824') }}
                  </div>
                  <i class="iconfont icon-exclamation-triangle" />
                  <p>{{ $t('d7e708c9.c9287c') }}</p>
                  <el-button type="primary" @click="handleBind">
                    {{ $t('d7e708c9.d4594e') }}
                  </el-button>
                </div>
                <div v-if="VERSION_PLATFORM() && VUE_APP_FREE" class="bot-tips">
                  <div>{{ $t('d7e708c9.5fbac9') }}{{ versionObj.dep_product_name }}</div>
                  <div v-if="versionObj.upgrade_status" @click="dialogChange">
                    {{ $t('d7e708c9.0d6101') }}
                  </div>
                  <div v-else>{{ $t('d7e708c9.b520fb') }}</div>
                </div>
              </div>
            </template>
            <template v-if="isBind">
              <section class="company">
                <img
                  v-if="authorizerData"
                  class="logo"
                  :src="
                    authorizerData.head_img ||
                    'https://fakeimg.pl/70x70/EFEFEF/CCC/?text=brand&font=lobster'
                  "
                />
                <div class="name">
                  {{ authorizerData.principal_name }}
                </div>
                <div class="operate">
                  <el-button v-if="isBind" type="default" size="mini" @click="handleBind">
                    {{ $t('d7e708c9.af3ef9') }}
                  </el-button>
                  <el-button v-else type="default" size="mini" @click="handleBind">
                    {{ $t('d7e708c9.4a1c90') }}
                  </el-button>
                  <el-button type="primary" size="mini" @click="accountactivate">
                    {{ $t('d7e708c9.f680dd') }}
                  </el-button>
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />{{ $t('d7e708c9.e5d649') }}
                  {{ activateInfo.version }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />COMPANYID:
                  {{ activateInfo.company_id }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />{{ $t('d7e708c9.869bed') }}
                  {{ activateInfo.php_ecshopx_version }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />{{ $t('d7e708c9.0388d1') }}
                  {{ activateInfo.vue_ecshopx_verion }}
                </div>
                <div v-if="activateInfo && !VUE_APP_FREE" class="validity-period">
                  <i class="iconfont icon-clock" />{{
                    activateInfo.expired_at == '9999999999'
                      ? $t('d7e708c9.1324e4')
                      : activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss')
                  }}
                  {{ $t('d7e708c9.851824') }}
                </div>
                <div v-if="VERSION_PLATFORM() && VUE_APP_FREE" class="bot-tips">
                  <div>{{ $t('d7e708c9.5fbac9') }}{{ versionObj.dep_product_name }}</div>
                  <div v-if="versionObj.upgrade_status" @click="dialogChange">
                    {{ $t('d7e708c9.0d6101') }}
                  </div>
                  <div v-else>{{ $t('d7e708c9.b520fb') }}</div>
                </div>
              </section>
            </template>
          </el-col>
          <el-col :span="VERSION_SHUYUN() ? 24 : 17">
            <section v-loading="userloading" class="section-card realtime-statics">
              <div class="section-card-header">
                <div class="section-card-title">{{ $t('d7e708c9.2ce929') }}</div>
                <div class="header-small">
                  {{ $t('d7e708c9.780fb9')
                  }}{{ (Date.now() / 1000) | datetime('YYYY-MM-DD HH:mm:ss') }}
                </div>
                <!-- <ul class="header-filters">
										<li class="filter-item">全店</li>
										<li class="filter-item">网店</li>
										<li class="filter-item">所有门店</li>
									</ul> -->
              </div>
              <div>
                <el-row class="analysis" :gutter="20">
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.b80fee') }}</div>
                        <div v-if="staticsData" class="real-data">
                          {{ (staticsData.today_data.real_payed_fee / 100) | keepTwoDecimalFull }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{
                            (staticsData.yesterday_data.real_payed_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.f24e34') }}</div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_payed_orders }}
                        </div>
                        <div class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{ staticsData && staticsData.yesterday_data.real_payed_orders }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.87491a') }}</div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_payed_members }}
                        </div>
                        <div class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{ staticsData && staticsData.yesterday_data.real_payed_members }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.6dda26') }}</div>
                        <div v-if="staticsData" class="real-data">
                          {{ (staticsData.today_data.real_atv / 100) | keepTwoDecimalFull }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{ (staticsData.yesterday_data.real_atv / 100) | keepTwoDecimalFull }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="analysis" :gutter="20">
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.7525ce') }}</div>
                        <div v-if="staticsData" class="real-data">
                          {{
                            (staticsData.today_data.real_refunded_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{
                            (staticsData.yesterday_data.real_refunded_fee / 100)
                              | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">{{ $t('d7e708c9.1ecebf') }}</div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_aftersale_count }}
                        </div>
                        <div class="history-data">
                          {{ $t('d7e708c9.38a533')
                          }}{{ staticsData && staticsData.yesterday_data.real_aftersale_count }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <!-- <el-col
                    v-if="!VERSION_IN_PURCHASE()"
                    :span="12"
                  >
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">
                          实新增储值金额(元)
                        </div>
                        <div
                          v-if="staticsData"
                          class="real-data"
                        >
                          {{ (staticsData.today_data.real_deposit / 100) | keepTwoDecimalFull }}
                        </div>
                        <div
                          v-if="staticsData"
                          class="history-data"
                        >
                          昨日：{{
                            (staticsData.yesterday_data.real_deposit / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                    </div>
                  </el-col> -->
                </el-row>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <section v-loading="userloading" class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">{{ $t('d7e708c9.d4c72d') }}</div>
              </div>
              <div class="notices">
                <div class="notices-group">
                  <div class="subtitle">{{ $t('d7e708c9.7ecdf0') }}</div>
                  <el-row>
                    <el-col class="notice-item" :span="12">
                      <router-link to="/order/entitytrade/tradenormalorders?tab=notship">
                        {{ $t('d7e708c9.c8604e')
                        }}{{ staticsData && staticsData.notice_data.wait_delivery_count }}
                      </router-link>
                    </el-col>
                    <el-col class="notice-item" :span="12">
                      <router-link to="order/aftersales/aftersaleslist?aftersales_status=0">
                        {{ $t('d7e708c9.43e4e0')
                        }}{{ staticsData && staticsData.notice_data.aftersales_count }}
                      </router-link>
                    </el-col>
                    <!-- <el-col class="notice-item" :span="12">
                      <router-link to="/order/Refunderrorlogs">
                        退款失败待处理：{{
                          staticsData && staticsData.notice_data.refund_errorlogs_count
                        }}
                      </router-link>
                    </el-col> -->
                  </el-row>
                </div>
                <div class="notices-group">
                  <div class="subtitle">{{ $t('d7e708c9.7e4c38') }}</div>
                  <el-row>
                    <el-col class="notice-item" :span="12">
                      <router-link to="/entity/goods/goodsphysical?tab=second">
                        {{ $t('d7e708c9.74f192')
                        }}{{ staticsData && staticsData.notice_data.warning_goods_count }}
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="!VERSION_IN_PURCHASE()" class="notices-group">
                  <div class="subtitle">{{ $t('d7e708c9.cf9587') }}</div>
                  <el-row>
                    <!-- <el-col class="notice-item" :span="12">
                      <router-link to="/marketing/marketingseckill?status=in_sale">
                        {{ $t('d7e708c9.200456') }}{{
                          staticsData && staticsData.notice_data.started_seckill_count
                        }}
                      </router-link>
                    </el-col> -->
                    <el-col class="notice-item" :span="12">
                      <router-link to="/marketing/fissionmarketing/groupsindex?activeName=third">
                        {{ $t('d7e708c9.3e49ca')
                        }}{{ staticsData && staticsData.notice_data.started_gtoups_count }}
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </section>
          </el-col>
          <el-col :span="14">
            <section
              v-loading="userloading"
              :class="
                VERSION_IN_PURCHASE()
                  ? 'section-card purchase-chart-statics'
                  : 'section-card chart-statics'
              "
            >
              <canvas id="canvas" height="120" />
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <section class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">{{ $t('d7e708c9.55fb04') }}</div>
              </div>
              <div class="quick-link clearfix">
                <router-link
                  v-for="(item, index) in links"
                  :key="index"
                  class="link-item"
                  :to="item.link"
                >
                  <i
                    class="iconfont"
                    :class="'icon-' + item.icon"
                    :style="'background:' + item.color"
                  />{{ $t(item.textKey) }}
                </router-link>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row v-if="!VERSION_SHUYUN() && system_is_saas == 'false'" :gutter="20">
          <el-col :span="24">
            <section class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">{{ $t('d7e708c9.b7ea5e') }}</div>
              </div>
              <el-descriptions :column="3" border size="mini">
                <el-descriptions-item>
                  <template slot="label"> company_id </template>
                  <el-tag>{{ activateInfo.company_id }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.22e888') }} </template>
                  <el-tag>{{ activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss') }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.ec58b1') }} </template>
                  <el-tag>{{ activateInfo.vue_ecshopx_verion }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.21a55d') }} </template>
                  <el-tag>{{ activateInfo.version }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.b5441a') }} </template>
                  {{ activateInfo.php_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.358523') }} </template>
                  {{ activateInfo.lumen_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> OS </template>
                  {{ activateInfo.os }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.db055e') }} </template>
                  {{ activateInfo.web_server }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.3dbe51') }} </template>
                  {{ activateInfo.db_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.5da695') }} </template>
                  {{ activateInfo.redis_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.c9362f') }} </template>
                  {{ activateInfo.app_url }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label"> {{ $t('d7e708c9.dc935e') }} </template>
                  {{ activateInfo.disk_driver }}
                </el-descriptions-item>
              </el-descriptions>
            </section>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="VERSION_PLATFORM() && VUE_APP_FREE ? 5 : 4">
        <!-- <section
          v-show="activateInfo.source != 'demo'"
          class="section-card fn-b-20 card-right"
        >
          <div class="phone-card">
            <img
              class="phone-icon"
              :src="img.phone"
              :alt="$t('d7e708c9.e84643')"
            >
            <span class="phone-text">{{ $t('d7e708c9.e84643') }} </span>
          </div>
          <h4 class="phone-num">
            400-921-3522 转 3
          </h4>
          <div class="phone-btn">
            <img
              class="phone-icon"
              :src="img.qq"
              :alt="$t('d7e708c9.7f72e8')"
            >
            <span>
              <a
                href="https://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA1ODI4Ml80OTM4NjNfODAwMDU4MjgyXw"
                target="_blank"
              >{{ $t('d7e708c9.7f72e8') }}</a>
            </span>
          </div>
        </section> -->
        <!-- <section class="section-card fn-b-20"><a href="http://wpa.qq.com/msgrd?v=3&uin=714165655&site=qq&menu=yes" target="_blank">QQ客服</a></section> -->
        <!-- <section
          class="section-card fn-b-20 demo-img"
          v-show="activateInfo.source == 'demo'"
          :style="'background:  url(' + img.bcg_1 + ')'"
        >
          <div class="sl-img-hd">{{ $t('d7e708c9.3a3588') }}</div>
          <img :src="img.demo" alt="" class="img-demo" />
        </section> -->
        <section v-if="VERSION_PLATFORM() && VUE_APP_FREE" class="section-card fn-b-20 sound-img">
          <div class="sound-btn" @click="openUrl('https://support.qq.com/product/386118')" />
          <img :src="img.sound" alt="" class="img-demo" />
        </section>
        <section
          v-if="VERSION_PLATFORM() && VUE_APP_FREE"
          class="section-card fn-b-20 produce-dynamic"
        >
          <el-row type="flex" justify="space-around" class="produce-hd">
            <el-col class="title">
              <i class="iconfont icon-dongtai-01" />{{ $t('d7e708c9.603dbd') }}
            </el-col>
            <el-col class="more">
              <span @click="openUrl(linkList.version_url)">{{ $t('d7e708c9.0ec9ea') }}</span>
            </el-col>
          </el-row>
          <el-row
            v-for="(item, index) in linkList.versions"
            :key="index"
            type="flex"
            align="middle"
            class="row-link"
          >
            <el-col v-if="index == 0" :span="4" class="news"> NEW </el-col>
            <el-col :span="20" :class="index == 0 ? 'overflows' : 'margins overflows'">
              <span @click="openUrl(item.url)">{{ item.title }}</span>
            </el-col>
          </el-row>
        </section>
        <section
          v-if="VERSION_PLATFORM() && VUE_APP_FREE"
          class="section-card fn-b-20 produce-manual"
        >
          <el-row type="flex" justify="space-around" class="produce-hd">
            <el-col class="title">
              <i class="iconfont icon-caozuoshouce" />{{ $t('d7e708c9.ee4f30') }}
            </el-col>
            <el-col class="more">
              <span @click="openUrl(linkList.question_url)">{{ $t('d7e708c9.607e7a') }}</span>
            </el-col>
          </el-row>
        </section>
        <section
          v-if="activateInfo.source == 'demo' && !VUE_APP_FREE && !VERSION_SHUYUN()"
          class="section-card fn-b-20 sl-img"
          :style="'background:  url(' + img.bcg_2 + ')'"
        >
          <div class="sl-img-hd"><i class="el-icon-user-solid" />{{ $t('d7e708c9.e21f5a') }}</div>
          <img :src="img.customerService" alt="" class="img-demo" />
        </section>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-version"
      width="550px"
      :visible.sync="dialogIsShow"
      :show-close="false"
    >
      <div slot="title">{{ $t('d7e708c9.8193c6') }} {{ versionObj.version }}</div>
      <div class="version-content">
        <div class="update-tip">
          {{ dialogContent
          }}<a @click="openUrl(linkList.version_url)">{{ $t('d7e708c9.9edf3c') }}</a>
        </div>
        <div class="install-desc">
          <p>{{ $t('d7e708c9.e8df54') }}</p>
          <p>{{ $t('d7e708c9.00b6d8') }}</p>
          <p>{{ $t('d7e708c9.fe4098') }}</p>
          <p>{{ $t('d7e708c9.215f39') }}</p>
          <p>{{ $t('d7e708c9.f6a575') }}</p>
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" :disabled="updateDisabled" @click="dialogConfirmChange">
          {{ $t('d7e708c9.ed5547') }}
        </el-button>
        <el-button plain :disabled="cancelDisabled" @click="dialogCancelChange">
          {{ $t('d7e708c9.c08ab9') }}
        </el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog class="industry-dialog" title="提示" :visible="waitingDialog" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
      <span>请在微信端窗口进行微信公众号授权</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doneBind">完成授权</el-button>
        <el-button @click="bindWebChatagain">重  试</el-button>
      </span>
    </el-dialog> -->
  </div>
  <div v-else class="main">
    <!-- <div>
      <el-button size="medium" @click="bool = true">暂不订购</el-button>
    </div> -->
    <div class="buy-hd">
      <h3>{{ $t('d7e708c9.3d9f81') }}</h3>
      <span>{{ $t('d7e708c9.93356a') }}</span>
    </div>
    <div class="buy">
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_s" :style="'background:  url(' + img.try_1 + ')'">
          <h3>{{ $t('d7e708c9.f0c1fa') }}</h3>
          <span>{{ $t('d7e708c9.276026') }}</span>
        </div>
        <div class="buy-item-ft">
          <div class="buy-item-ft-text">
            <img :src="img.suo" alt="" class="suo" />
            <p>{{ $t('d7e708c9.b449e5') }}</p>
            <p>{{ $t('d7e708c9.0518b4') }}</p>
          </div>
          <div class="buy-item-btn">
            <el-button size="medium" disabled>
              {{ activateInfo.source == 'demo' ? $t('d7e708c9.4d419c') : $t('d7e708c9.a7bca2') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_b" :style="'background:  url(' + img.biaozun + ')'">
          <h3>{{ $t('d7e708c9.2c7b38') }}</h3>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>{{ $t('d7e708c9.c295e2') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.9b09a5') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.84e826') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.750080') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.eec9b5') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.91a39f') }}</p>
          </div>
          <div>
            <el-button size="medium" type="danger" @click="dingHandel('商城')">
              {{ $t('d7e708c9.710d33') }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_l" :style="'background:  url(' + img.liansuo + ')'">
          <div>
            <h3>{{ $t('d7e708c9.66048e') }}</h3>
          </div>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>{{ $t('d7e708c9.15e72c') }}</p>
            <p>
              <img :src="img.check" alt="" class="check-icon" />
              {{ $t('d7e708c9.d21dc6') }}
            </p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.55ce58') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.a96b28') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.8d61a3') }}</p>
            <p><img :src="img.check" alt="" class="check-icon" />{{ $t('d7e708c9.3f4d02') }}</p>
          </div>
          <div>
            <el-button size="medium" type="danger" @click="dingHandel('连锁')">
              {{ $t('d7e708c9.710d33') }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="" :visible.sync="dialogVisible" width="580px">
      <div slot="title" class="title">{{ $t('d7e708c9.cecb98') }}</div>
      <p class="title-span">
        {{ $t('d7e708c9.59f590') }}
      </p>
      <div>
        <el-form ref="dingInfo" :model="dingInfo" label-width="100px" class="demo-dingInfo">
          <el-form-item :label="$t('d7e708c9.b1613c')" prop="goods_name">
            <span style="font-weight: bold">{{ dingInfo.goods_name }}</span>
          </el-form-item>
          <el-form-item :label="$t('d7e708c9.60d045')" prop="call_name">
            <el-input v-model="dingInfo.call_name" :placeholder="$t('d7e708c9.8093e3')" />
          </el-form-item>

          <el-form-item :label="$t('d7e708c9.787b56')" prop="sex">
            <el-radio-group v-model="dingInfo.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('d7e708c9.92448a')" prop="mobile">
            <el-input v-model="dingInfo.mobile" :placeholder="$t('d7e708c9.28b882')" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-ft" @click="dialogVisible = false">
          {{ $t('d7e708c9.c08ab9') }}
        </el-button>
        <el-button class="btn-ft" type="danger" @click="submit">
          {{ $t('d7e708c9.aa7527') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isInSalesCenter, VERSION_STANDARD } from '@/utils'
import Chart from 'chart.js'
import { mapMutations, mapGetters } from 'vuex'
import store from '../../store'
import {
  getWechatPreAuthUrl,
  getWechatBind,
  getAuthorizerInfo,
  getUserWeekSummary
} from '../../api/wechat'
import {
  getActivateInfo,
  updateCompanyInfo,
  getResourceList,
  getCompanyStatistics,
  ydleadsInfo,
  systemChangelog,
  systemUpgrade,
  detectVersion
} from '../../api/company'
import config from '../../../package.json'

const phone = require('@/assets/img/saas/phone.png')
const qq = require('@/assets/img/saas/qq.png')
const check = require('@/assets/img/saas/check.png')
const customerService = require('@/assets/img/saas/customerService.jpg')
const suo = require('@/assets/img/saas/suo.png')
const bcg_2 = require('@/assets/img/saas/bcg_2.png')
const try_1 = require('@/assets/img/saas/try.png')
const liansuo = require('@/assets/img/saas/liansuo.png')
const bcg_1 = require('@/assets/img/saas/bcg_1.png')
const demo = require('@/assets/img/saas/demo.png')
const biaozun = require('@/assets/img/saas/biaozun.png')
const sound = require('@/assets/img/saas/sound.jpg')

export default {
  data() {
    return {
      img: {
        phone,
        qq,
        check,
        customerService,
        suo,
        bcg_2,
        try_1,
        liansuo,
        bcg_1,
        demo,
        biaozun,
        sound
      },
      bool: true,
      userloading: true,
      dialogVisible: false,
      dingInfo: {
        goods_name: '标准版',
        call_name: '',
        sex: '男',
        mobile: ''
      },
      authorizerData: {
        principal_name: ''
      },
      activateInfo: {},
      url: '',
      isBind: false,
      isBindFail: false,
      state: 1,
      industryVisible: false,
      guideHidden: true,
      storeHidden: false,
      webchatHidden: false,
      waitingDialog: false,
      checkedGuide: {},
      checkedStore: {},
      staticsData: '',
      userTimeArr: [],
      userData: [],
      vipData: [],
      svipData: [],
      i: -1,
      guideList: [
        {
          id: '1',
          icon: 'icon-marketing',
          name: '超市便利',
          desc: '大型商超，超市，便利店，小卖部等'
        },
        {
          id: '2',
          icon: 'icon-baking',
          name: '烘培奶茶',
          desc: '蛋糕店，奶茶店，甜品店，面包房等'
        },
        {
          id: '3',
          icon: 'icon-play',
          name: '娱乐休闲',
          desc: 'KTV，桌球，桑拿汗蒸，按摩足浴等'
        },
        {
          id: '4',
          icon: 'icon-fresh',
          name: '水果生鲜',
          desc: '水果摊，生鲜菜场等'
        },
        {
          id: '5',
          icon: 'icon-housekeeping',
          name: '生活服务',
          desc: '保洁，保姆，钟点工，月嫂等'
        },
        {
          id: '6',
          icon: 'icon-beauty',
          name: '美容健身',
          desc: '健身房，美容店，美发店，美甲店等'
        },
        {
          id: '7',
          icon: 'icon-coffee',
          name: '咖啡桌游',
          desc: '咖啡馆，桌游室，棋牌室，轰趴馆等'
        },
        {
          id: '8',
          icon: 'icon-food',
          name: '餐饮',
          desc: '小吃店，菜馆，自助餐，快餐店等'
        }
      ],
      storeList: [
        { id: 1, icon: 'icon-store', text: '1家门店', bgOther: false },
        { id: 2, icon: 'icon-stores', text: '2-4家门店', bgOther: true },
        { id: 3, icon: 'icon-stores', text: '5-30家门店', bgOther: true },
        { id: 4, icon: 'icon-stores', text: '31-100家门店', bgOther: true },
        { id: 3, icon: 'icon-stores', text: '100家以上', bgOther: true }
      ],
      currGuide: {},
      links: [
        {
          link: '/entity/goods/goodsphysical/editor',
          icon: 'box',
          color: '#fa888b',
          textKey: 'd7e708c9.27fabd'
        },
        // {
        //   link: "/entity/service_goods/servicegoods/editor",
        //   icon: "user-clock",
        //   color: "#b992f8",
        //   text: "新增服务商品",
        // },
        // {
        //   link: "/marketing/community/marketingcommunityactivity/editor",
        //   icon: "door-open",
        //   color: "#65d7f3",
        //   text: "新增社区活动",
        // },
        // {
        //   link: "/marketing/community/marketingdeliveryorder",
        //   icon: "dolly-flatbed",
        //   color: "#fb9f5a",
        //   text: "配送单处理",
        // },
        {
          link: '/order/entitytrade/tradenormalorders',
          icon: 'clipboard-list',
          color: '#7cc0f4',
          textKey: 'd7e708c9.afbe0f'
        }
      ],
      linkList: {},
      dialogIsShow: false,
      dialogContent: '',
      updateDisabled: false,
      cancelDisabled: false,
      versionObj: {}
    }
  },
  computed: {
    ...mapGetters(['readLicense'])
  },
  methods: {
    ...mapMutations(['SET_PRODUCTION_CODE', 'SET_READ_LICENSE']),
    dingHandel(type) {
      this.dialogVisible = true
      this.dingInfo.goods_name = type
    },
    openUrl(url) {
      if (url) {
        window.open(url, '_blank')
      } else {
        this.$message({
          type: 'error',
          message: '暂无可跳转路径'
        })
      }
    },
    dialogChange() {
      this.dialogIsShow = true
      this.dialogContent =
        '本次更新包含小程序端更新，如您已对小程序进行开发可能会覆盖已经开发内容，请确认后更新！'
    },
    dialogCancelChange() {
      this.dialogIsShow = false
      this.updateDisabled = false
      this.cancelDisabled = false
      this.detectVersion()
    },
    dialogConfirmChange() {
      this.dialogContent = '更新中'
      this.updateDisabled = true
      this.cancelDisabled = true
      systemUpgrade()
        .then((res) => {
          this.dialogContent = '更新成功'
          this.cancelDisabled = false
        })
        .catch((error) => {
          // console.log(error)
          // this.dialogContent = error
          this.dialogContent = '更新失败'
          this.cancelDisabled = false
        })
    },
    systemChangelog() {
      systemChangelog().then((res) => {
        let data = res.data.data
        this.linkList = data
      })
    },
    detectVersion() {
      detectVersion().then((res) => {
        let data = res.data.data
        this.versionObj = data
      })
    },
    submit() {
      let obj = JSON.parse(JSON.stringify(this.dingInfo))
      ydleadsInfo(obj).then((res) => {
        this.$message({
          message: '订购提交成功',
          type: 'success'
        })
        this.bool = true
        this.dialogVisible = false
        this.dingInfo = {}
      })
    },
    toLink(link) {
      this.$router.push({ path: this.matchInternalRoute(link) })
    },
    handleBuy() {
      this.bool = false
    },
    handleBind() {
      if (this.url) {
        var metadata = document.getElementsByTagName('meta')
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.url, '_blank')
      } else {
        this.$message({
          message: '请确认已经配置好第三方开放平台',
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    accountactivate() {
      this.$router.push({
        path: this.matchInternalRoute('assetaccountactivation')
      })
    },
    // 获取用户列表
    getUrl: function () {
      // NProgress.start()
      let params = {
        callback_url: this.wxAuthCallbackUrl + 'auth/woa'
      }
      getWechatPreAuthUrl(params).then((response) => {
        this.url = response.data.data.url
      })
    },
    guideChoose: function (item, index) {
      this.currGuide = item
      this.i = index
      this.guideHidden = false
      this.storeHidden = true
      this.state = 2
      this.checkedGuide = item
      let params = {
        industry: item.name
      }
      updateCompanyInfo(params).then((res) => {})
    },
    storeChoose: function (item, index) {
      this.state = 3
      this.storeHidden = false
      this.webchatHidden = true
      this.checkedStore = item
    },
    bindWebChat: function () {
      this.webchatHidden = false
      this.waitingDialog = true
      this.industryVisible = false
      if (this.url) {
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.url, '_blank')
      }
    },
    doneBind: function () {
      if (!this.isBind) {
        this.industryVisible = true
        this.webchatHidden = true
      }
      this.waitingDialog = false
    },
    bindWebChatagain: function () {
      if (this.url) {
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.url, '_blank')
      }
    },
    unBind() {
      this.industryVisible = false
      this.waitingDialog = false
    },
    chartInit() {
      window.chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
      }
      var config = {
        type: 'line',
        data: {
          labels: this.userTimeArr,
          datasets: [
            {
              label: '新增人数',
              backgroundColor: window.chartColors.red,
              borderColor: window.chartColors.red,
              data: this.userData,
              fill: false
            },
            {
              label: '新增vip',
              backgroundColor: window.chartColors.orange,
              borderColor: window.chartColors.orange,
              data: this.vipData,
              fill: false
            },
            {
              label: '新增svip',
              backgroundColor: window.chartColors.yellow,
              borderColor: window.chartColors.yellow,
              data: this.svipData,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: '近7天用户趋势'
          },
          tooltips: {
            mode: 'index',
            intersect: true
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: ''
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: false
                }
              }
            ]
          }
        }
      }
      if (this.VERSION_IN_PURCHASE()) {
        config = {
          type: 'line',
          data: {
            labels: this.userTimeArr,
            datasets: [
              {
                label: '新增人数',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: this.userData,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            title: {
              display: true,
              text: '近7天用户趋势'
            },
            tooltips: {
              mode: 'index',
              intersect: true
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: ''
                  }
                }
              ],
              yAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: false
                  }
                }
              ]
            }
          }
        }
      }
      var ctx = document.getElementById('canvas').getContext('2d')
      window.myLine = new Chart(ctx, config)
    },
    isSassAndInCenter() {
      const isInSaleCenter = isInSalesCenter()
      const isSass = this.system_is_saas
      return isInSaleCenter && isSass
    },
    mountedFunc() {
      getActivateInfo().then((res) => {
        this.activateInfo = res.data.data
        if (!res.data.data.is_valid) {
          this.$router.push({
            path: this.matchInternalRoute('assetaccountactivation')
          })
        }
        // this.activateInfo.source = 'demo'
        this.SET_PRODUCTION_CODE({ productionCode: res.data.data.product_code })
        this.activateInfo.vue_ecshopx_verion = `${process.env.VUE_APP_PRODUCT_MODEL}-${config.version}`
        if (this.readLicense == 0 && this.activateInfo.license.show_expier_tip == 1) {
          this.$alert(
            `您的授权文件将于${this.activateInfo.license.left_time}天后到期，到期后系统将不可使用，为避免影响业务正常开展，请尽快联系客服处理。`,
            '授权文件即将到期',
            {
              confirmButtonText: '我知道了',
              showClose: false,
              callback: (action) => {
                this.SET_READ_LICENSE(1)
              }
            }
          )
        }
      })
      this.getUrl()
      getCompanyStatistics().then((res) => {
        this.staticsData = res.data.data
        let memberData = res.data.data.member_data
        for (var key in memberData) {
          this.userTimeArr.push(key)
          this.userData.push(memberData[key].newAddMember)
          this.vipData.push(memberData[key].vipMember)
          this.svipData.push(memberData[key].svipMember)
        }
        this.$nextTick(() => {
          this.chartInit()
          this.userloading = false
        })
      })
      if (this.$route.query) {
        this.isBindFail = this.$route.query.isBindFail
      }
      if (this.isBindFail) {
        this.waitingDialog = true
        return
      }
      if (store.getters.is_authorizer || this.isSassAndInCenter()) {
        this.isBind = true
        getAuthorizerInfo().then((response) => {
          this.authorizerData = response.data.data
        })
      } else {
        this.industryVisible = true
      }
    }
  },
  mounted() {
    if (!this.VERSION_IN_PURCHASE()) {
      this.links.push(
        {
          link: '/marketing/fissionmarketing/groupsindex/editor',
          icon: 'comments-dollar',
          color: '#fa9678',
          text: '新增拼团活动'
        },
        {
          link: '/marketing/coupon/membermarketing',
          icon: 'ticket-alt',
          color: '#fa8084',
          text: '新增优惠券'
        },
        // {
        //   link: '/marketing/marketingseckill/editor',
        //   icon: 'stopwatch',
        //   color: '#f9ca6b',
        //   text: '新增秒杀活动'
        // },
        {
          link: '/order/aftersales/aftersaleslist',
          icon: 'user-tie',
          color: '#fa8084',
          text: '售后处理'
        },
        {
          link: '/marketing/popularize/popularizewithdraw',
          icon: 'donate',
          color: '#fa9679',
          text: '提现处理'
        }
      )
    }
    this.mountedFunc()
    if (this.VERSION_PLATFORM() && this.VUE_APP_FREE) {
      this.systemChangelog()
      this.detectVersion()
    }
  }
}
</script>
