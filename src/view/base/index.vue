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
        // background: url('@/assets/img/saas/try_1.png');
      }
      &_b {
        // background: url('@/assets/img/saas/biaozun.png');
        color: white;
        h3 {
          color: white;
        }
      }
      &_l {
        // background: url('@/assets/img/saas/liansuo.png');

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
  // background: url('@/assets/img/saas/bcg_1.png');
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
  // background: url('@/assets/img/saas/bcg_2.png');
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
    background: var(--themeColor);
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
    background: var(--themeColor);
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
</style>
<template>
  <div
    v-if="bool"
    class="main"
  >
    <!-- v-if="activateInfo.due_reminder" -->
    <div
      v-if="activateInfo.due_reminder"
      class="to-become"
    >
      <div class="text-icon">
        <i class="el-icon-warning icon-wr" /><span>店铺使用期限即将到期，如需继续使用请点击购买订购产品</span>
      </div>
      <!-- <div class="btn">
        <el-button @click="handleBuy" size="mini" type="danger"
          >立即购买</el-button
        >
      </div> -->
    </div>
    <el-row :gutter="20">
      <el-col :span="VERSION_PLATFORM && VUE_APP_FREE ? 19 : 20">
        <el-row :gutter="20">
          <el-col :span="7">
            <template v-if="!isBind">
              <div class="unbind-box">
                <div class="content-center">
                  <div
                    v-if="activateInfo && !VUE_APP_FREE"
                    class="validity-period"
                  >
                    {{ activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss') }}
                    到期
                  </div>
                  <i class="iconfont icon-exclamation-triangle" />
                  <p>您尚未绑定认证服务号，请先绑定!</p>
                  <el-button
                    type="primary"
                    @click="handleBind"
                  >
                    去绑定
                  </el-button>
                </div>
                <div
                  v-if="VERSION_PLATFORM && VUE_APP_FREE"
                  class="bot-tips"
                >
                  <div>当前版本：{{ versionObj.dep_product_name }}</div>
                  <div
                    v-if="versionObj.upgrade_status"
                    @click="dialogChange"
                  >
                    有新版本待更新
                  </div>
                  <div v-else>
                    已是最新版本
                  </div>
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
                >
                <div class="name">
                  {{ authorizerData.principal_name }}
                </div>
                <div class="operate">
                  <el-button
                    v-if="isBind"
                    type="default"
                    size="mini"
                    @click="handleBind"
                  >
                    更新授权
                  </el-button>
                  <el-button
                    v-else
                    type="default"
                    size="mini"
                    @click="handleBind"
                  >
                    去授权
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="accountactivate"
                  >
                    账号续费
                  </el-button>
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />代码版本:
                  {{ activateInfo.version }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />COMPANYID:
                  {{ activateInfo.company_id }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />后台版本:
                  {{ activateInfo.php_ecshopx_version }}
                </div>
                <div class="validity-period">
                  <i class="iconfont icon-bell" />VUE版本:
                  {{ activateInfo.vue_ecshopx_verion }}
                </div>
                <div
                  v-if="activateInfo && !VUE_APP_FREE"
                  class="validity-period"
                >
                  <i class="iconfont icon-clock" />{{
                    activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss')
                  }}
                  到期
                </div>
                <div
                  v-if="VERSION_PLATFORM && VUE_APP_FREE"
                  class="bot-tips"
                >
                  <div>当前版本：{{ versionObj.dep_product_name }}</div>
                  <div
                    v-if="versionObj.upgrade_status"
                    @click="dialogChange"
                  >
                    有新版本待更新
                  </div>
                  <div v-else>
                    已是最新版本
                  </div>
                </div>
              </section>
            </template>
          </el-col>
          <el-col :span="17">
            <section
              v-loading="userloading"
              class="section-card realtime-statics"
            >
              <div class="section-card-header">
                <div class="section-card-title">
                  实时概况
                </div>
                <div class="header-small">
                  更新时间：{{ (Date.now() / 1000) | datetime('YYYY-MM-DD HH:mm:ss') }}
                </div>
                <!-- <ul class="header-filters">
										<li class="filter-item">全店</li>
										<li class="filter-item">网店</li>
										<li class="filter-item">所有门店</li>
									</ul> -->
              </div>
              <div>
                <el-row
                  class="analysis"
                  :gutter="20"
                >
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">
                          实付金额(元)
                        </div>
                        <div
                          v-if="staticsData"
                          class="real-data"
                        >
                          {{ (staticsData.today_data.real_payed_fee / 100) | keepTwoDecimalFull }}
                        </div>
                        <div
                          v-if="staticsData"
                          class="history-data"
                        >
                          昨日：{{
                            (staticsData.yesterday_data.real_payed_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">
                          支付订单数
                        </div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_payed_orders }}
                        </div>
                        <div class="history-data">
                          昨日：{{ staticsData && staticsData.yesterday_data.real_payed_orders }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">
                          实付会员数
                        </div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_payed_members }}
                        </div>
                        <div class="history-data">
                          昨日：{{ staticsData && staticsData.yesterday_data.real_payed_members }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">
                          客单价(元)
                        </div>
                        <div
                          v-if="staticsData"
                          class="real-data"
                        >
                          {{ (staticsData.today_data.real_atv / 100) | keepTwoDecimalFull }}
                        </div>
                        <div
                          v-if="staticsData"
                          class="history-data"
                        >
                          昨日：{{
                            (staticsData.yesterday_data.real_atv / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row
                  class="analysis"
                  :gutter="20"
                >
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">
                          退款金额(元)
                        </div>
                        <div
                          v-if="staticsData"
                          class="real-data"
                        >
                          {{
                            (staticsData.today_data.real_refunded_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                        <div
                          v-if="staticsData"
                          class="history-data"
                        >
                          昨日：{{
                            (staticsData.yesterday_data.real_refunded_fee / 100)
                              | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">
                          售后订单数
                        </div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_aftersale_count }}
                        </div>
                        <div class="history-data">
                          昨日：{{ staticsData && staticsData.yesterday_data.real_aftersale_count }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col
                    v-if="!VERSION_IN_PURCHASE"
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
                  </el-col>
                </el-row>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <section
              v-loading="userloading"
              class="section-card"
            >
              <div class="section-card-header">
                <div class="section-card-title">
                  重要提醒
                </div>
              </div>
              <div class="notices">
                <div class="notices-group">
                  <div class="subtitle">
                    订单相关
                  </div>
                  <el-row>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="/order/entitytrade/tradenormalorders?tab=notship">
                        待发货订单：{{ staticsData && staticsData.notice_data.wait_delivery_count }}
                      </router-link>
                    </el-col>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="order/entitytrade/aftersaleslist?aftersales_status=0">
                        待处理退款：{{ staticsData && staticsData.notice_data.aftersales_count }}
                      </router-link>
                    </el-col>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="/order/Refunderrorlogs">
                        退款失败待处理：{{
                          staticsData && staticsData.notice_data.refund_errorlogs_count
                        }}
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
                <div class="notices-group">
                  <div class="subtitle">
                    商品相关
                  </div>
                  <el-row>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="/entity/goods/goodsphysical?tab=second">
                        库存预警商品：{{
                          staticsData && staticsData.notice_data.warning_goods_count
                        }}
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
                <div
                  v-if="!VERSION_IN_PURCHASE"
                  class="notices-group"
                >
                  <div class="subtitle">
                    营销相关
                  </div>
                  <el-row>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="/marketing/marketingseckill?status=in_sale">
                        进行中的秒杀：{{
                          staticsData && staticsData.notice_data.started_seckill_count
                        }}
                      </router-link>
                    </el-col>
                    <el-col
                      class="notice-item"
                      :span="12"
                    >
                      <router-link to="/marketing/groupsindex?activeName=third">
                        进行中的拼团：{{
                          staticsData && staticsData.notice_data.started_gtoups_count
                        }}
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
                VERSION_IN_PURCHASE
                  ? 'section-card purchase-chart-statics'
                  : 'section-card chart-statics'
              "
            >
              <canvas
                id="canvas"
                height="120"
              />
            </section>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <section class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">
                  常用功能
                </div>
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
                  />{{ item.text }}
                </router-link>
              </div>
            </section>
          </el-col>
        </el-row>
        <el-row
          v-if="system_is_saas == false"
          :gutter="20"
        >
          <el-col :span="24">
            <section class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">
                  系统信息
                </div>
              </div>
              <el-descriptions
                :column="3"
                border
                size="mini"
              >
                <el-descriptions-item>
                  <template slot="label">
                    company_id
                  </template>
                  <el-tag>{{ activateInfo.company_id }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    到期时间
                  </template>
                  <el-tag>{{ activateInfo.expired_at | datetime('YYYY-MM-DD HH:mm:ss') }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    管理后台
                  </template>
                  <el-tag>{{ activateInfo.vue_ecshopx_verion }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    API端
                  </template>
                  <el-tag>{{ activateInfo.version }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    Element-UI组件库
                  </template>
                  {{ activateInfo.elementui_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    PHP版本
                  </template>
                  {{ activateInfo.php_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    Lumen框架
                  </template>
                  {{ activateInfo.lumen_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    OS
                  </template>
                  {{ activateInfo.os }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    web服务器
                  </template>
                  {{ activateInfo.web_server }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    数据库版本
                  </template>
                  {{ activateInfo.db_version }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    REDIS版本
                  </template>
                  {{ activateInfo.redis_version }}
                </el-descriptions-item>
              </el-descriptions>
            </section>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="VERSION_PLATFORM && VUE_APP_FREE ? 5 : 4">
        <!-- <section
          v-show="activateInfo.source != 'demo'"
          class="section-card fn-b-20 card-right"
        >
          <div class="phone-card">
            <img
              class="phone-icon"
              :src="img.phone"
              alt="客服电话"
            >
            <span class="phone-text">客服电话 </span>
          </div>
          <h4 class="phone-num">
            400-921-3522 转 3
          </h4>
          <div class="phone-btn">
            <img
              class="phone-icon"
              :src="img.qq"
              alt="在线客服"
            >
            <span>
              <a
                href="https://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA1ODI4Ml80OTM4NjNfODAwMDU4MjgyXw"
                target="_blank"
              >在线客服</a>
            </span>
          </div>
        </section> -->
        <!-- <section class="section-card fn-b-20"><a href="http://wpa.qq.com/msgrd?v=3&uin=714165655&site=qq&menu=yes" target="_blank">QQ客服</a></section> -->
        <!-- <section
          class="section-card fn-b-20 demo-img"
          v-show="activateInfo.source == 'demo'"
          :style="'background:  url(' + img.bcg_1 + ')'"
        >
          <div class="sl-img-hd">扫码体验DEMO</div>
          <img :src="img.demo" alt="" class="img-demo" />
        </section> -->
        <section
          v-if="VERSION_PLATFORM && VUE_APP_FREE"
          class="section-card fn-b-20 sound-img"
        >
          <div
            class="sound-btn"
            @click="openUrl('https://support.qq.com/product/386118')"
          />
          <img
            :src="img.sound"
            alt=""
            class="img-demo"
          >
        </section>
        <section
          v-if="VERSION_PLATFORM && VUE_APP_FREE"
          class="section-card fn-b-20 produce-dynamic"
        >
          <el-row
            type="flex"
            justify="space-around"
            class="produce-hd"
          >
            <el-col class="title">
              <i class="iconfont icon-dongtai-01" />产品动态
            </el-col>
            <el-col class="more">
              <span @click="openUrl(linkList.version_url)">更多</span>
            </el-col>
          </el-row>
          <el-row
            v-for="(item, index) in linkList.versions"
            :key="index"
            type="flex"
            align="middle"
            class="row-link"
          >
            <el-col
              v-if="index == 0"
              :span="4"
              class="news"
            >
              NEW
            </el-col>
            <el-col
              :span="20"
              :class="index == 0 ? 'overflows' : 'margins overflows'"
            >
              <span @click="openUrl(item.url)">{{ item.title }}</span>
            </el-col>
          </el-row>
        </section>
        <section
          v-if="VERSION_PLATFORM && VUE_APP_FREE"
          class="section-card fn-b-20 produce-manual"
        >
          <el-row
            type="flex"
            justify="space-around"
            class="produce-hd"
          >
            <el-col class="title">
              <i class="iconfont icon-caozuoshouce" />产品手册
            </el-col>
            <el-col class="more">
              <span @click="openUrl(linkList.question_url)">查看</span>
            </el-col>
          </el-row>
        </section>
        <section
          v-if="activateInfo.source == 'demo' && !VUE_APP_FREE"
          class="section-card fn-b-20 sl-img"
          :style="'background:  url(' + img.bcg_2 + ')'"
        >
          <div class="sl-img-hd">
            <i class="el-icon-user-solid" />售前客户经理
          </div>
          <img
            :src="img.customerService"
            alt=""
            class="img-demo"
          >
        </section>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-version"
      width="550px"
      :visible.sync="dialogIsShow"
      :show-close="false"
    >
      <div slot="title">
        版本更新 {{ versionObj.version }}
      </div>
      <div class="version-content">
        <div class="update-tip">
          {{ dialogContent }}<a @click="openUrl(linkList.version_url)">具体升级内容，请查看</a>
        </div>
        <div class="install-desc">
          <p>更新说明：更新成功后您还需要做如下操作(如果对应目录代码无更新可忽略操作)</p>
          <p>1、在ecshopx-api目录下执行php的数据库更新命令，具体命令参照安装文档</p>
          <p>2、在ecshopx-admin目录下执行npm run build，重新编译</p>
          <p>3、在ecshopx-vshop目录下执行npm run build，重新编译</p>
          <p>4、小程序需要将代码下载到本地，重新编译，在微信开发者工具提交审核</p>
        </div>
      </div>
      <div slot="footer">
        <el-button
          type="primary"
          :disabled="updateDisabled"
          @click="dialogConfirmChange"
        >
          更 新
        </el-button>
        <el-button
          plain
          :disabled="cancelDisabled"
          @click="dialogCancelChange"
        >
          取 消
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
  <div
    v-else
    class="main"
  >
    <!-- <div>
      <el-button size="medium" @click="bool = true">暂不订购</el-button>
    </div> -->
    <div class="buy-hd">
      <h3>云店新零售</h3>
      <span>选择服务提交申请</span>
    </div>
    <div class="buy">
      <div class="buy-item section-card">
        <div
          class="buy-item-hd buy-item-hd_s"
          :style="'background:  url(' + img.try_1 + ')'"
        >
          <h3>试用版</h3>
          <span>免费试用15天</span>
        </div>
        <div class="buy-item-ft">
          <div class="buy-item-ft-text">
            <img
              :src="img.suo"
              alt=""
              class="suo"
            >
            <p>当前版本为免费试用版本</p>
            <p>升级解锁享受更多服务</p>
          </div>
          <div class="buy-item-btn">
            <el-button
              size="medium"
              disabled
            >
              {{ activateInfo.source == 'demo' ? '使用中' : '已体验' }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div
          class="buy-item-hd buy-item-hd_b"
          :style="'background:  url(' + img.biaozun + ')'"
        >
          <h3>商城</h3>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>适用于搭建线上社交零售商城的商家,快速开店</p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >小程序、公众号、PC一体化商城
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >种草粉丝内容点赞、分享传播
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >粉丝、员工、网红分销卖货
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >拼团/砍价/秒杀丰富的营销玩法
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >直播预约、点赞、分享、互动
            </p>
          </div>
          <div>
            <el-button
              size="medium"
              type="danger"
              @click="dingHandel('商城')"
            >
              立即订购
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div
          class="buy-item-hd buy-item-hd_l"
          :style="'background:  url(' + img.liansuo + ')'"
        >
          <div>
            <h3>连锁</h3>
          </div>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>适用于有门店的商家构建私域流量中心，打造门店&云店运营闭环，赋能实体门店业务</p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >
              千店千面，门店运营线上化
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >实现门店差异化促销及服务
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >门店导购拉新、服务、激励数字化
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >建立门店触达私域用户渠道与方式
            </p>
            <p>
              <img
                :src="img.check"
                alt=""
                class="check-icon"
              >多维度进行全链路经营数据跟踪
            </p>
          </div>
          <div>
            <el-button
              size="medium"
              type="danger"
              @click="dingHandel('连锁')"
            >
              立即订购
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="580px"
    >
      <div
        slot="title"
        class="title"
      >
        申请订购版本
      </div>
      <p class="title-span">
        您所提交的信息仅用于您的专属顾问与您沟通，不会透露给任何第三方机构或个人
      </p>
      <div>
        <el-form
          ref="dingInfo"
          :model="dingInfo"
          label-width="100px"
          class="demo-dingInfo"
        >
          <el-form-item
            label="订购版本"
            prop="goods_name"
          >
            <span style="font-weight: bold">{{ dingInfo.goods_name }}</span>
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="call_name"
          >
            <el-input
              v-model="dingInfo.call_name"
              placeholder="请输入姓名"
            />
          </el-form-item>

          <el-form-item
            label="性别"
            prop="sex"
          >
            <el-radio-group v-model="dingInfo.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="手机号码"
            prop="mobile"
          >
            <el-input
              v-model="dingInfo.mobile"
              placeholder="请输入电话号码"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="btn-ft"
          @click="dialogVisible = false"
        >
          取 消
        </el-button>
        <el-button
          class="btn-ft"
          type="danger"
          @click="submit"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isInSalesCenter, VERSION_STANDARD } from '@/utils'
import Chart from 'chart.js'
import { mapMutations } from 'vuex'
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
  data () {
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
          text: '新增商品'
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
          text: '订单处理'
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
  methods: {
    ...mapMutations(['SET_PRODUCTION_CODE']),
    dingHandel (type) {
      this.dialogVisible = true
      this.dingInfo.goods_name = type
    },
    openUrl (url) {
      if (url) {
        window.open(url, '_blank')
      } else {
        this.$message({
          type: 'error',
          message: '暂无可跳转路径'
        })
      }
    },
    dialogChange () {
      this.dialogIsShow = true
      this.dialogContent =
        '本次更新包含小程序端更新，如您已对小程序进行开发可能会覆盖已经开发内容，请确认后更新！'
    },
    dialogCancelChange () {
      this.dialogIsShow = false
      this.updateDisabled = false
      this.cancelDisabled = false
      this.detectVersion()
    },
    dialogConfirmChange () {
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
    systemChangelog () {
      systemChangelog().then((res) => {
        let data = res.data.data
        this.linkList = data
      })
    },
    detectVersion () {
      detectVersion().then((res) => {
        let data = res.data.data
        this.versionObj = data
      })
    },
    submit () {
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
    toLink (link) {
      this.$router.push({ path: this.matchInternalRoute(link) })
    },
    handleBuy () {
      this.bool = false
    },
    handleBind () {
      if (this.url) {
        var metadata = document.getElementsByTagName('meta')
        for (var i = 0; i < metadata.length; i++) {
          if (metadata[i]['name'] == 'referrer') {
            metadata[i]['content'] = 'default'
          }
        }
        window.open(this.url, '_blank')
      }
    },
    accountactivate () {
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
    unBind () {
      this.industryVisible = false
      this.waitingDialog = false
    },
    chartInit () {
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
      if (this.VERSION_IN_PURCHASE) {
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
    isSassAndInCenter () {
      const isInSaleCenter = isInSalesCenter()
      const isSass = this.system_is_saas
      return isInSaleCenter && isSass
    },
    mountedFunc () {
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
        this.activateInfo.elementui_version = `${config.elementui_version}`
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
  mounted () {
    if (!this.VERSION_IN_PURCHASE) {
      this.links.push(
        {
          link: '/marketing/groupsindex/editor',
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
        {
          link: '/marketing/marketingseckill/editor',
          icon: 'stopwatch',
          color: '#f9ca6b',
          text: '新增秒杀活动'
        },
        {
          link: '/order/entitytrade/aftersaleslist',
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
    if (this.VERSION_PLATFORM && this.VUE_APP_FREE) {
      this.systemChangelog()
      this.detectVersion()
    }
  }
}
</script>
