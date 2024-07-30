<template>
  <div class="section section-white">
    <SpPlatformTip />
    <el-form ref="form" :model="form" label-position="left" label-width="120px">
      <div class="section-body">
        <el-form-item label="推广员计划">
          <el-switch
            v-model="form.isOpenPopularize"
            :width="50"
            active-value="true"
            inactive-value="false"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
          />
          <el-alert
            title="商家可邀请员工、合作伙伴、朋友等作为推广员一起推广您的店铺或商品, 成功推广后给予推广员奖励，以此给店铺带来更多的曝光和销售提升"
            type="info"
            close-text=" "
            class="alert-text"
          />
        </el-form-item>
        <el-form-item label="分销商品">
          <el-radio-group v-model="form.goods">
            <el-radio label="all"> 全部商品 </el-radio>
            <el-radio label="select"> 指定分销商品 </el-radio>
          </el-radio-group>
          <div class="frm-tips">
            <p>
              全部商品，表示所有的商品推广进行返佣。指定分销商品后，只有设置指定的商品可以进行推广返佣
            </p>
            <p>
              注意：将指定分销商品模式切换到全部商品模式，不会清空以前的选择，重新再切回指定商品模式，保留以前的选择商品
            </p>
          </div>
        </el-form-item>
        <template v-if="form.isOpenPopularize == 'true'">
          <el-form-item label="提现限制">
            单笔金额不低于
            <el-input
              v-model="form.limit_rebate"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 100px"
            />元
          </el-form-item>
          <el-form-item label="结算限制">
            订单完成
            <el-input
              v-model="form.limit_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            天后结算
          </el-form-item>
          <el-form-item label="成为推广员门槛">
            <div class="line">
              <el-select v-model="form.change_promoter.type">
                <el-option
                  v-for="item in promoterType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <div v-show="form.change_promoter.type == 'vip_grade'" class="gap-text">
                选择付费等级
                <el-select v-model="form.change_promoter.filter.vip_grade" placeholder="请选择">
                  <el-option
                    v-for="item in vipGradeList"
                    :key="item.lv_type"
                    :label="item.grade_name"
                    :value="item.lv_type"
                  />
                </el-select>
              </div>
              <div v-show="form.change_promoter.type == 'consume_money'" class="gap-text">
                达到
                <el-input
                  v-model="form.change_promoter.filter.consume_money"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                  style="width: 100px"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                />
                元
              </div>
              <div v-show="form.change_promoter.type == 'order_num'" class="gap-text">
                完成
                <el-input
                  v-model="form.change_promoter.filter.order_num"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                  style="width: 100px"
                />
                笔
              </div>
            </div>
          </el-form-item>
          <el-form-item label="返佣模式">
            <el-radio-group
              v-model="form.popularize_ratio.type"
              @change="changePopularizeRatioType"
            >
              <el-radio label="profit"> 按利润分佣 </el-radio>
              <el-radio label="order_money"> 按订单金额分佣 </el-radio>
            </el-radio-group>
            <div class="frm-tips">
              如果商品未指定，返佣计算类型，那么则使用当前设置的通用方式，如果在商品中指定了返佣模式，那么指定商品则使用自己的返佣方式
            </div>
          </el-form-item>
          <el-form-item label="推广员奖金设置">
            <div v-show="form.popularize_ratio.type == 'profit'">
              <el-row v-for="(item, key) in form.popularize_ratio.profit" :key="key">
                <el-col :span="2"> {{ item.name }}： </el-col>
                <el-col :span="4">
                  <el-input
                    v-model="form.popularize_ratio.profit[key].ratio"
                    type="number"
                    required
                    min="0"
                    maxlength="3"
                    placeholder=""
                  >
                    <template slot="append"> % </template>
                  </el-input>
                </el-col>
              </el-row>
              <el-alert
                title="商品利润 ×  百分比，其中商品利润为【支付金额-运费-商品成本价】"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </div>
            <div v-show="form.popularize_ratio.type == 'order_money'">
              <el-row v-for="(item, key) in form.popularize_ratio.order_money" :key="key">
                <el-col :span="2"> {{ item.name }}： </el-col>
                <el-col :span="4">
                  <el-input
                    v-model="form.popularize_ratio.order_money[key].ratio"
                    type="number"
                    required
                    min="0"
                    maxlength="3"
                    placeholder=""
                  >
                    <template slot="append"> % </template>
                  </el-input>
                </el-col>
              </el-row>
              <el-alert
                title="订单金额 × 百分比，其中订单金额为【支付金额-运费】"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </div>
          </el-form-item>
          <el-form-item label="奖励方式">
            <el-radio-group v-model="form.commission_type" @change="changeCommission_type">
              <el-radio label="money"> 奖励现金 </el-radio>
              <!-- <el-radio label="point">奖励积分</el-radio> -->
            </el-radio-group>
            <!-- <div class="frm-tips">
              变更奖励方式后，已经下单的订单奖励按原奖励方式不变，最新订单按变更的奖励方式进行<br />
              注意：奖励积分若积分与现金抵扣比例过于低，积分奖励向上取整（例：0.1积分取1积分）
            </div> -->
          </el-form-item>
          <el-form-item label="推广二维码背景">
            <div>
              <div class="upload-qr-box" @click="handleImgChange('qrcode_bg_img')">
                <img
                  v-if="form.qrcode_bg_img"
                  :src="wximageurl + form.qrcode_bg_img"
                  class="avatar"
                >
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <div class="frm-tips">建议尺寸 650px * 1157px；作用于推广员二维码背景图配置</div>
          </el-form-item>
          <el-form-item label="推广员小店">
            <el-switch
              v-model="form.isOpenShop"
              :width="50"
              active-value="true"
              inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              active-color="#13ce66"
            />
          </el-form-item>
          <template v-if="form.isOpenShop == 'true'">
            <el-form-item label="小店图片">
              <div>
                <div class="upload-box" @click="handleImgChange">
                  <img v-if="form.banner_img" :src="wximageurl + form.banner_img" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
              <div class="frm-tips">建议尺寸750px*400px；配置后显示在小店首页顶部</div>
            </el-form-item>
            <el-form-item label="推广员信息">
              <el-switch
                v-model="form.isOpenPromoterInformation"
                :width="50"
                active-value="true"
                inactive-value="false"
                active-text="开启"
                inactive-text="关闭"
                active-color="#13ce66"
              />
              <el-alert
                title="若开启，小店图片将不会生效；由每个推广员在移动端配置。"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </el-form-item>
            <el-form-item label="分享标题">
              <el-input
                v-model="form.share_title"
                style="width: 500px"
                type="text"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="分享描述">
              <el-input
                v-model="form.share_des"
                style="width: 500px"
                type="textarea"
                maxlength="30"
                resize="none"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="分享图片">
              <el-row type="flex" style="width: 500px">
                <el-col>
                  <div class="center">
                    <div class="upload-box wxapp" @click="handleImgChange('wxapp')">
                      <img
                        v-if="form.applets_share_img"
                        :src="wximageurl + form.applets_share_img"
                        class="avatar"
                      >
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </div>
                    <div class="frm-tips upload-box inline">建议尺寸5:4</div>
                  </div>
                </el-col>
                <el-col>
                  <div class="center">
                    <div class="upload-box h5" @click="handleImgChange('web')">
                      <img
                        v-if="form.h5_share_img"
                        :src="wximageurl + form.h5_share_img"
                        class="avatar"
                      >
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </div>
                    <div class="frm-tips upload-box inline">建议尺寸1:1</div>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </template>
          <!-- <el-form-item label="充值返佣">
            <el-switch
              v-model="form.isOpenRecharge"
              :width="50"
              active-value="true"
              inactive-value="false"
              active-text="开启"
              inactive-text="关闭"
              active-color="#13ce66"
            ></el-switch>
            <div class="frm-tips">充值返佣，只支持积分返佣</div>
          </el-form-item> -->
          <!-- <el-form-item label="充值返佣设置" v-if="form.isOpenRecharge == 'true'">
            <div>
              <el-row v-for="(item, key) in form.recharge.profit" :key="key">
                <el-col :span="2"> {{ item.name }}： </el-col>
                <el-col :span="4">
                  <el-input
                    type="number"
                    required
                    min="0"
                    v-model="form.recharge.profit[key].ratio"
                    maxlength="3"
                    placeholder=""
                    ><template slot="append">%</template></el-input
                  >
                </el-col>
              </el-row>
            </div>
          </el-form-item> -->
          <!--
          <el-form-item label="推广引导页面">
              <el-switch v-model="form.isOpenGuide" :width="50" active-value="true" inactive-value="false" active-text="开启" inactive-text="关闭" active-color="#13ce66"></el-switch>
              <div v-show="form.isOpenGuide == 'true'">
                <div @click="handleImgChange" class="upload-box">
                  <img v-if="form.guideImg" :src="wximageurl + form.guideImg" class="pic"/>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <imgPicker :dialog-visible="imgDialog" :sc-status="isGetImage" @chooseImg="pickImg" @closeImgDialog="closeImgDialog"></imgPicker>
              </div>
          </el-form-item>
          -->
        </template>
      </div>
      <imgPicker
        :dialog-visible="imgDialog"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeImgDialog"
      />
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getPopularizeSetting, setPopularizeSetting } from '../../api/promotions'
import { listVipGrade } from '../../api/cardticket'
import { getCustomPageList } from '@/api/wxa'
import imgPicker from '../../components/imageselect'
import { getWeappId } from '../../api/template'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      params: {
        page: 1,
        pageSize: 10
      },
      form: {
        goods: 'all',
        commission_type: 'money',

        isOpenPopularize: false,
        change_promoter: {
          type: 'no_threshold',
          filter: {
            no_threshold: 0,
            vip_grade: 'vip',
            consume_money: 0,
            order_num: 0
          }
        },
        popularize_ratio: {
          order_money: [],
          profit: {
            first_level: {
              name: '上级',
              ratio: 0
            },
            second_level: {
              name: '上上级',
              ratio: 0
            }
          },
          type: 'profit'
        },
        isOpenShop: false,
        isOpenGuide: false,
        isOpenRecharge: false,
        recharge: {
          profit: {
            first_level: {
              name: '上级',
              ratio: 0
            },
            second_level: {
              name: '上上级',
              ratio: 0
            }
          }
        },
        // 推广员信息
        isOpenPromoterInformation: false,
        // 分享信息

        share_title: '',
        share_des: '',
        applets_share_img: '',
        h5_share_img: '',

        // guideImg: '',
        banner_img: ''
      },
      // 推广员门槛
      promoterType: [
        {
          value: 'no_threshold',
          label: '无门槛成为推广员'
        },
        {
          value: 'internal',
          label: '仅内部可推广'
        },
        {
          value: 'vip_grade',
          label: '成为指定付费等级会员'
        },
        {
          value: 'consume_money',
          label: '会员消费达到指定金额'
        },
        {
          value: 'order_num',
          label: '会员已完成订单数'
        }
      ],
      // 要设置的图片
      setImg: '',
      vipGradeList: {},
      imgDialog: false,
      isGetImage: false,
      custompage_template_id: 0,
      FormworkVisible: false,
      FormworkList: []
    }
  },
  mounted() {
    // this.getFormworkList()
    getPopularizeSetting().then((res) => {
      this.form = { ...this.form, ...res.data.data }
      this.form.goods = this.form.goods ? this.form.goods : 'all'
      this.form.share_title = this.form.share_title ? this.form.share_title : '这家小店不一般！'
      this.form.share_des = this.form.share_des ? this.form.share_des : '这家店有好货，一起瞧瞧吧！'
      console.log(this.form)
      if (typeof this.form.recharge == 'undefined') {
        this.form.recharge = {
          profit: {
            first_level: {
              name: '上级',
              ratio: 0
            },
            second_level: {
              name: '上上级',
              ratio: 0
            }
          }
        }
      }
    }),
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGradeList = response.data.data
        }
      })

    // console.log(this.vipGradeList.is_open_point);
    // getWeappId().then(response => {
    //     var res = response.data.weappid
    //     this.weappid = res
    // })
  },
  methods: {
    changeCommission_type(val) {
      const popularize_ratioType = this.form.popularize_ratio.type
      if (!this.form.is_open_point) {
        this.$confirm('未开启积分设置，请进入 「会员」-「 积分规则 」开启积分。', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
          .then(() => {
            this.form.commission_type = 'money'
          })
          .catch(() => {
            this.form.commission_type = 'money'
          })
      } else if (popularize_ratioType == 'profit' && this.form.commission_type == 'money') {
        this.$confirm(
          '修改奖励方式后，商品佣金算法：商品利润 × 百分比，其中商品利润为【支付金额-运费-商品成本价】',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else if (popularize_ratioType == 'order_money' && this.form.commission_type == 'money') {
        this.$confirm(
          '修改奖励方式后，商品佣金算法：订单金额×百分比，其中订单金额为【支付金额-运费】',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else if (popularize_ratioType == 'profit' && this.form.commission_type == 'point') {
        this.$confirm(
          '修改奖励方式后，商品佣金算法：商品利润 × 百分比×积分与现金的抵扣比例，其中商品利润为【支付金额-运费-商品成本价】',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        if (popularize_ratioType && popularize_ratioType == 'profit') {
          if (val == 'point') {
          }
        }
      } else if (popularize_ratioType == 'order_money' && this.form.commission_type == 'point') {
        this.$confirm(
          '修改奖励方式后，商品佣金算法：订单金额×百分比×积分与现金的抵扣比例，其中订单金额为【支付金额-运费】',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    linkTo() {
      let link = ''
      getWeappId().then((res) => {
        var data = res.data.data.weappid
        var tempName = res.data.data.tempName
        if (data) {
          link = this.matchInternalRoute('custompage')
          this.$store.dispatch('setWxappId', data)
          this.$store.dispatch('setTemplateName', tempName)
        }
        this.$router.push({
          path: link
        })
      })
    },
    changePopularizeRatioType(type) {
      console.log(type)
      this.$confirm(
        '切换返佣计算类型，将清空单品比例返佣设置（固定金额不影响），之前配置过的单品返佣比例需要重新配置',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {})
        .catch(() => {
          if (type == 'order_money') {
            this.form.popularize_ratio.type = 'profit'
          } else {
            this.form.popularize_ratio.type = 'order_money'
          }
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleImgChange(data = 'banner') {
      this.imgDialog = true
      this.isGetImage = true
      this.setImg = data
    },
    pickImg(data) {
      // this.form.guideImg = data.url
      switch (this.setImg) {
        case 'web':
          this.form.h5_share_img = data.url
          break
        case 'wxapp':
          this.form.applets_share_img = data.url
          break
        case 'qrcode_bg_img':
          this.form.qrcode_bg_img = data.url
          break
        default:
          this.form.banner_img = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    save() {
      let plusReg = /^[1-9](\d+)?$/
      let countReg = /^\d+$/
      console.log(this.params.limit_rebate)
      if (this.form.limit_rebate < 1) {
        this.$message({ message: '提现限制需不低于1元', type: 'error' })
        return
      }
      if (this.form.isOpenPopularize) {
        if (this.form.change_promoter.type == 'vip_grade') {
          if (
            this.form.change_promoter.filter.vip_grade == '' ||
            this.form.change_promoter.filter.vip_grade == '请选择'
          ) {
            this.$message({ message: '请选择成为指定付费等级会员', type: 'error' })
            return
          }
        }
        //
        // if (this.form.isOpenGuide && this.form.guideImg == '') {
        //   //this.$message({message: '请选择图片', type: 'error'})
        //   //return
        // }
      }

      setPopularizeSetting(this.form).then((res) => {
        this.$message({ message: '保存成功', type: 'success' })
      })
    },
    // 自定义页面模板列表
    getFormworkList() {
      this.loading = true
      getCustomPageList(this.params).then((response) => {
        this.FormworkList = response.data.data.list
        this.total_count = response.data.data.total_count
        this.loading = false
      })
    },
    handleCurrentChange: function (val) {
      this.params.page = val
      this.getFormworkList()
    },
    // 拉取自定义列表数据
    batchChooseFormwork() {
      this.FormworkVisible = true
      this.params.page = 1
      this.getFormworkList()
    },
    onSubmitFormwork(item) {
      this.FormworkVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 150px;
  height: 150px;
  img {
    width: 100%;
  }
}
.upload-qr-box {
  max-width: 150px;
  max-width: 150px;
  img {
    width: 100%;
  }
}

.alert-text {
  padding: 0 20px;
  margin-bottom: 20px;
}
.gap-text {
  margin-left: 30px;
}
.radioItem {
  display: block;
  margin: 10px 0;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
.frm-tips {
  background: #f4f4f5;
  color: #909399;
  padding: 10px 20px;
  margin: 10px 0;
  &.inline {
    display: inline-block;
    text-align: center;
    height: auto;
    border: none;
  }
}
.line {
  display: flex;
  align-items: center;
}
.wxapp,
.h5 {
  position: relative;
  &::after {
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    text-align: center;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
  }
}
.wxapp::after {
  content: '小程序';
}
.h5::after {
  content: 'H5/APP/海报';
}
</style>
