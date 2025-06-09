<style scoped lang="scss">
.main {
  min-width: 1200px;
  //   overflow: auto;
}
.unbind-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 285px;
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
}

.section-card {
  padding: 30px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  &.realtime-statics {
    height: 285px;
  }
  &.chart-statics {
    height: 318px;
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
}

.company {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 285px;
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
    padding-bottom: 50px;
  }
  .validity-period {
    display: flex;
    font-size: 12px;
    color: #999;
    .iconfont {
      margin-right: 10px;
      font-size: 12px;
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
</style>

<template>
  <div v-if="bool" class="main">
    <!-- v-if="activateInfo.due_reminder" -->
    <div v-if="activateInfo.due_reminder" class="to-become">
      <div class="text-icon">
        <i class="el-icon-warning icon-wr" /><span
          >店铺使用期限即将到期，如需继续使用请点击购买订购产品</span
        >
      </div>
      <!-- <div class="btn">
        <el-button @click="handleBuy" size="mini" type="danger"
          >立即购买</el-button
        >
      </div> -->
    </div>
    <el-row :gutter="20">
      <el-col :span="20">
        <el-row :gutter="20">
          <el-col :span="24">
            <section v-loading="userloading" class="section-card realtime-statics">
              <div class="section-card-header">
                <div class="section-card-title">实时概况</div>
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
                <el-row class="analysis" :gutter="20">
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">实付金额(元)</div>
                        <div v-if="staticsData" class="real-data">
                          {{ (staticsData.today_data.real_payed_fee / 100) | keepTwoDecimalFull }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          昨日：{{
                            (staticsData.yesterday_data.real_payed_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">支付订单数</div>
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
                        <div class="label">实付会员数</div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_payed_members }}
                        </div>
                        <div class="history-data">
                          昨日：{{ staticsData && staticsData.yesterday_data.real_payed_members }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">客单价(元)</div>
                        <div v-if="staticsData" class="real-data">
                          {{ (staticsData.today_data.real_atv / 100) | keepTwoDecimalFull }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          昨日：{{
                            (staticsData.yesterday_data.real_atv / 100) | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row class="analysis" :gutter="20">
                  <el-col :span="12">
                    <div class="view-flex">
                      <div class="view-flex-item">
                        <div class="label">退款金额(元)</div>
                        <div v-if="staticsData" class="real-data">
                          {{
                            (staticsData.today_data.real_refunded_fee / 100) | keepTwoDecimalFull
                          }}
                        </div>
                        <div v-if="staticsData" class="history-data">
                          昨日：{{
                            (staticsData.yesterday_data.real_refunded_fee / 100)
                              | keepTwoDecimalFull
                          }}
                        </div>
                      </div>
                      <div class="view-flex-item">
                        <div class="label">售后订单数</div>
                        <div class="real-data">
                          {{ staticsData && staticsData.today_data.real_aftersale_count }}
                        </div>
                        <div class="history-data">
                          昨日：{{ staticsData && staticsData.yesterday_data.real_aftersale_count }}
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
            <section v-loading="userloading" class="section-card">
              <div class="section-card-header">
                <div class="section-card-title">重要提醒</div>
              </div>
              <div class="notices">
                <div class="notices-group">
                  <div class="subtitle">订单相关</div>
                  <el-row>
                    <el-col class="notice-item" :span="12">
                      <router-link to="/merchant/order/tradenormalorders?tab=notship">
                        待发货订单：{{ staticsData && staticsData.notice_data.wait_delivery_count }}
                      </router-link>
                    </el-col>
                    <el-col class="notice-item" :span="12">
                      <router-link to="/merchant/order/aftersaleslist">
                        待处理退款：{{ staticsData && staticsData.notice_data.aftersales_count }}
                      </router-link>
                    </el-col>
                    <el-col class="notice-item" :span="12">
                      <router-link to="/merchant/order/aftersalesrefundlist">
                        退款失败待处理：{{
                          staticsData && staticsData.notice_data.refund_errorlogs_count
                        }}
                      </router-link>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </section>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <section v-show="activateInfo.source != 'demo'" class="section-card fn-b-20 card-right">
          <div class="phone-card">
            <img class="phone-icon" :src="img.phone" alt="客服电话">
            <span class="phone-text">客服电话 </span>
          </div>
          <h4 class="phone-num">400-921-3522 转 3</h4>
          <div class="phone-btn">
            <img class="phone-icon" :src="img.qq" alt="在线客服">
            <span
              ><a
                href="https://wpa.b.qq.com/cgi/wpa.php?ln=1&key=XzgwMDA1ODI4Ml80OTM4NjNfODAwMDU4MjgyXw"
                target="_blank"
                >在线客服</a
              ></span
            >
          </div>
        </section>
        <!-- <section class="section-card fn-b-20"><a href="http://wpa.qq.com/msgrd?v=3&uin=714165655&site=qq&menu=yes" target="_blank">QQ客服</a></section> -->
        <section
          v-show="activateInfo.source == 'demo'"
          class="section-card fn-b-20 sl-img"
          :style="'background:  url(' + img.bcg_2 + ')'"
        >
          <div class="sl-img-hd"><i class="el-icon-user-solid" />售前客户经理</div>
          <img :src="img.customerService" alt="" class="img-demo">
        </section>
      </el-col>
    </el-row>
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
      <h3>云店新零售</h3>
      <span>选择服务提交申请</span>
    </div>
    <div class="buy">
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_s" :style="'background:  url(' + img.try_1 + ')'">
          <h3>试用版</h3>
          <span>免费试用15天</span>
        </div>
        <div class="buy-item-ft">
          <div class="buy-item-ft-text">
            <img :src="img.suo" alt="" class="suo">
            <p>当前版本为免费试用版本</p>
            <p>升级解锁享受更多服务</p>
          </div>
          <div class="buy-item-btn">
            <el-button size="medium" disabled>
              {{ activateInfo.source == 'demo' ? '使用中' : '已体验' }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_b" :style="'background:  url(' + img.biaozun + ')'">
          <h3>商城</h3>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>适用于搭建线上社交零售商城的商家,快速开店</p>
            <p><img :src="img.check" alt="" class="check-icon">小程序、公众号、PC一体化商城</p>
            <p><img :src="img.check" alt="" class="check-icon">种草粉丝内容点赞、分享传播</p>
            <p><img :src="img.check" alt="" class="check-icon">粉丝、员工、网红分销卖货</p>
            <p><img :src="img.check" alt="" class="check-icon">拼团/砍价/秒杀丰富的营销玩法</p>
            <p><img :src="img.check" alt="" class="check-icon">直播预约、点赞、分享、互动</p>
          </div>
          <div>
            <el-button size="medium" type="danger" @click="dingHandel('商城')">
              立即订购
            </el-button>
          </div>
        </div>
      </div>
      <div class="buy-item section-card">
        <div class="buy-item-hd buy-item-hd_l" :style="'background:  url(' + img.liansuo + ')'">
          <div>
            <h3>连锁</h3>
          </div>
        </div>
        <div class="buy-item-ft">
          <div>
            <p>适用于有门店的商家构建私域流量中心，打造门店&云店运营闭环，赋能实体门店业务</p>
            <p>
              <img :src="img.check" alt="" class="check-icon">
              千店千面，门店运营线上化
            </p>
            <p><img :src="img.check" alt="" class="check-icon">实现门店差异化促销及服务</p>
            <p><img :src="img.check" alt="" class="check-icon">门店导购拉新、服务、激励数字化</p>
            <p><img :src="img.check" alt="" class="check-icon">建立门店触达私域用户渠道与方式</p>
            <p><img :src="img.check" alt="" class="check-icon">多维度进行全链路经营数据跟踪</p>
          </div>
          <div>
            <el-button size="medium" type="danger" @click="dingHandel('连锁')">
              立即订购
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="" :visible.sync="dialogVisible" width="580px">
      <div slot="title" class="title">申请订购版本</div>
      <p class="title-span">
        您所提交的信息仅用于您的专属顾问与您沟通，不会透露给任何第三方机构或个人
      </p>
      <div>
        <el-form ref="dingInfo" :model="dingInfo" label-width="100px" class="demo-dingInfo">
          <el-form-item label="订购版本" prop="goods_name">
            <span style="font-weight: bold">{{ dingInfo.goods_name }}</span>
          </el-form-item>
          <el-form-item label="姓名" prop="call_name">
            <el-input v-model="dingInfo.call_name" placeholder="请输入姓名" />
          </el-form-item>

          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="dingInfo.sex">
              <el-radio label="男" />
              <el-radio label="女" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dingInfo.mobile" placeholder="请输入电话号码" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="btn-ft" @click="dialogVisible = false"> 取 消 </el-button>
        <el-button class="btn-ft" type="danger" @click="submit"> 确 定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isInSalesCenter } from '@/utils'
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
  ydleadsInfo
} from '../../api/company'

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
        biaozun
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
        }
        // {
        //   link: "/entity/service_goods/servicegoods/editor",
        //   icon: "user-clock",
        //   color: "#b992f8",
        //   text: "新增服务商品",
        // },
        // {
        //   link: "/marketing/groupsindex/editor",
        //   icon: "comments-dollar",
        //   color: "#fa9678",
        //   text: "新增拼团活动",
        // },
        // {
        //   link: "/marketing/coupon/membermarketing",
        //   icon: "ticket-alt",
        //   color: "#fa8084",
        //   text: "新增优惠券",
        // },
        // {
        //   link: "/marketing/marketingseckill/editor",
        //   icon: "stopwatch",
        //   color: "#f9ca6b",
        //   text: "新增秒杀活动",
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
        // {
        //   link: "/order/entitytrade/tradenormalorders",
        //   icon: "clipboard-list",
        //   color: "#7cc0f4",
        //   text: "实体订单处理",
        // },
        // {
        //   link: "/order/entitytrade/aftersaleslist",
        //   icon: "user-tie",
        //   color: "#fa8084",
        //   text: "售后处理",
        // },
        // {
        //   link: "/marketing/popularize/popularizewithdraw",
        //   icon: "donate",
        //   color: "#fa9679",
        //   text: "提现处理",
        // },
      ]
    }
  },
  methods: {
    ...mapMutations(['SET_PRODUCTION_CODE']),
    dingHandel(type) {
      this.dialogVisible = true
      this.dingInfo.goods_name = type
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

        this.activateInfo.vue_ecshopx_verion = process.env.VUE_APP_PRODUCT_MODEL
      })
      //   this.getUrl();
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
          //   this.chartInit();
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
    this.mountedFunc()
  }
}
</script>
