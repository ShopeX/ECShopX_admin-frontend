<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="section section-white">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />
    <el-form ref="form" :model="form" label-position="left" label-width="120px">
      <div class="section-body">
        <el-form-item :label="$t('f7e8bd69.90410f')">
          <el-switch
            v-model="form.isOpenPopularize"
            :width="50"
            active-value="true"
            inactive-value="false"
            :active-text="$t('f7e8bd69.cc42dd')"
            :inactive-text="$t('f7e8bd69.b15d91')"
            active-color="#13ce66"
          />
          <el-alert :title="$t('f7e8bd69.5bb3dd')" type="info" close-text=" " class="alert-text" />
        </el-form-item>
        <el-form-item :label="$t('f7e8bd69.ad8d69')">
          <el-radio-group v-model="form.goods">
            <el-radio label="all"> {{ $t('f7e8bd69.794a4e') }} </el-radio>
            <el-radio label="select"> {{ $t('f7e8bd69.5e477d') }} </el-radio>
          </el-radio-group>
          <div class="frm-tips">
            <p>
              {{ $t('f7e8bd69.3dcdcf') }}
            </p>
            <p>
              {{ $t('f7e8bd69.91ebb4') }}
            </p>
          </div>
        </el-form-item>
        <template v-if="form.isOpenPopularize == 'true'">
          <el-form-item :label="$t('f7e8bd69.ee25bb')">
            {{ $t('f7e8bd69.24c667') }}
            <el-input
              v-model="form.limit_rebate"
              type="number"
              required
              min="1"
              placeholder=""
              style="width: 100px"
            />{{ $t('f7e8bd69.c16655') }}
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.c6ef82')">
            {{ $t('f7e8bd69.c1a80c') }}
            <el-input
              v-model="form.limit_time"
              type="number"
              required
              min="0"
              placeholder=""
              style="width: 100px"
            />
            {{ $t('f7e8bd69.49f897') }}
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.a5da9e')">
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
                {{ $t('f7e8bd69.a7ffe1') }}
                <el-select
                  v-model="form.change_promoter.filter.vip_grade"
                  :placeholder="$t('f7e8bd69.708c9d')"
                >
                  <el-option
                    v-for="item in vipGradeList"
                    :key="item.lv_type"
                    :label="item.grade_name"
                    :value="item.lv_type"
                  />
                </el-select>
              </div>
              <div v-show="form.change_promoter.type == 'consume_money'" class="gap-text">
                {{ $t('f7e8bd69.4ca6c9') }}
                <el-input
                  v-model="form.change_promoter.filter.consume_money"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                  style="width: 100px"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                />
                {{ $t('f7e8bd69.c16655') }}
              </div>
              <div v-show="form.change_promoter.type == 'order_num'" class="gap-text">
                {{ $t('f7e8bd69.769d88') }}
                <el-input
                  v-model="form.change_promoter.filter.order_num"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                  style="width: 100px"
                />
                {{ $t('f7e8bd69.9fb4da') }}
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.788591')">
            <el-radio-group
              v-model="form.popularize_ratio.type"
              @change="changePopularizeRatioType"
            >
              <el-radio label="profit"> {{ $t('f7e8bd69.6acf80') }} </el-radio>
              <el-radio label="order_money"> {{ $t('f7e8bd69.7adf86') }} </el-radio>
            </el-radio-group>
            <div class="frm-tips">
              {{ $t('f7e8bd69.34e359') }}
            </div>
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.e253f7')">
            <div v-show="form.popularize_ratio.type == 'profit'">
              <el-row v-for="(item, key) in form.popularize_ratio.profit" :key="key">
                <el-col :span="2">
                  {{ $t(key === 'first_level' ? 'f7e8bd69.6336b4' : 'f7e8bd69.bbaa79') }}：
                </el-col>
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
                :title="$t('f7e8bd69.af106c')"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </div>
            <div v-show="form.popularize_ratio.type == 'order_money'">
              <el-row v-for="(item, key) in form.popularize_ratio.order_money" :key="key">
                <el-col :span="2">
                  {{ $t(key === 'first_level' ? 'f7e8bd69.6336b4' : 'f7e8bd69.bbaa79') }}：
                </el-col>
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
                :title="$t('f7e8bd69.e5e544')"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </div>
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.41ad62')">
            <el-radio-group v-model="form.commission_type" @change="changeCommission_type">
              <el-radio label="money"> {{ $t('f7e8bd69.fa5958') }} </el-radio>
              <!-- <el-radio label="point">奖励积分</el-radio> -->
            </el-radio-group>
            <!-- <div class="frm-tips">
              变更奖励方式后，已经下单的订单奖励按原奖励方式不变，最新订单按变更的奖励方式进行<br />
              注意：奖励积分若积分与现金抵扣比例过于低，积分奖励向上取整（例：0.1积分取1积分）
            </div> -->
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.6e61d0')">
            <div>
              <div class="upload-qr-box" @click="handleImgChange('qrcode_bg_img')">
                <img
                  v-if="form.qrcode_bg_img"
                  :src="wximageurl + form.qrcode_bg_img"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <div class="frm-tips">{{ $t('f7e8bd69.5e95f9') }}</div>
          </el-form-item>
          <el-form-item :label="$t('f7e8bd69.ea9024')">
            <el-switch
              v-model="form.isOpenShop"
              :width="50"
              active-value="true"
              inactive-value="false"
              :active-text="$t('f7e8bd69.cc42dd')"
              :inactive-text="$t('f7e8bd69.b15d91')"
              active-color="#13ce66"
            />
          </el-form-item>
          <template v-if="form.isOpenShop == 'true'">
            <el-form-item :label="$t('f7e8bd69.b8202e')">
              <div>
                <div class="upload-box" @click="handleImgChange">
                  <img v-if="form.banner_img" :src="wximageurl + form.banner_img" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
              <div class="frm-tips">{{ $t('f7e8bd69.34e85a') }}</div>
            </el-form-item>
            <el-form-item :label="$t('f7e8bd69.1f6a09')">
              <el-switch
                v-model="form.isOpenPromoterInformation"
                :width="50"
                active-value="true"
                inactive-value="false"
                :active-text="$t('f7e8bd69.cc42dd')"
                :inactive-text="$t('f7e8bd69.b15d91')"
                active-color="#13ce66"
              />
              <el-alert
                :title="$t('f7e8bd69.5ab04d')"
                type="info"
                close-text=" "
                class="alert-text"
              />
            </el-form-item>
            <el-form-item :label="$t('f7e8bd69.382e6f')">
              <el-input
                v-model="form.share_title"
                style="width: 500px"
                type="text"
                maxlength="15"
                show-word-limit
              />
            </el-form-item>
            <el-form-item :label="$t('f7e8bd69.8fcba7')">
              <el-input
                v-model="form.share_des"
                style="width: 500px"
                type="textarea"
                maxlength="30"
                resize="none"
                show-word-limit
              />
            </el-form-item>
            <el-form-item :label="$t('f7e8bd69.106d52')">
              <el-row type="flex" style="width: 500px">
                <el-col>
                  <div class="center">
                    <div class="upload-box wxapp" @click="handleImgChange('wxapp')">
                      <img
                        v-if="form.applets_share_img"
                        :src="wximageurl + form.applets_share_img"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </div>
                    <div class="frm-tips upload-box inline">{{ $t('f7e8bd69.db1b92') }}</div>
                  </div>
                </el-col>
                <el-col>
                  <div class="center">
                    <div class="upload-box h5" @click="handleImgChange('web')">
                      <img
                        v-if="form.h5_share_img"
                        :src="wximageurl + form.h5_share_img"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon" />
                    </div>
                    <div class="frm-tips upload-box inline">{{ $t('f7e8bd69.51b729') }}</div>
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
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('f7e8bd69.56df61') }} </el-button>
      </div>
    </el-form>
  </SpPage>
</template>
<script>
import { getPopularizeSetting, setPopularizeSetting } from '../../api/promotions'
import { listVipGrade } from '../../api/cardticket'
import { getCustomPageList } from '@/api/wxa'
import { getWeappId } from '../../api/template'
export default {
  components: {},
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
      vipGradeList: {},
      custompage_template_id: 0,
      FormworkVisible: false,
      FormworkList: []
    }
  },
  computed: {
    promoterType() {
      return [
        { value: 'no_threshold', label: this.$t('f7e8bd69.9a2e5f') },
        { value: 'internal', label: this.$t('f7e8bd69.bdc510') },
        { value: 'vip_grade', label: this.$t('f7e8bd69.52eec0') },
        { value: 'consume_money', label: this.$t('f7e8bd69.e17039') },
        { value: 'order_num', label: this.$t('f7e8bd69.d3a2e9') }
      ]
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
        this.$confirm(this.$t('f7e8bd69.b3b9d9'), this.$t('f7e8bd69.02d981'), {
          confirmButtonText: this.$t('a8b7ec6e.38cf16'),
          type: 'warning'
        })
          .then(() => {
            this.form.commission_type = 'money'
          })
          .catch(() => {
            this.form.commission_type = 'money'
          })
      } else if (popularize_ratioType == 'profit' && this.form.commission_type == 'money') {
        this.$confirm(this.$t('f7e8bd69.298fbf'), this.$t('f7e8bd69.02d981'), {
          confirmButtonText: this.$t('a8b7ec6e.38cf16'),
          cancelButtonText: this.$t('a8b7ec6e.625fb2'),
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: this.$t('f7e8bd69.2111cc')
            })
          })
      } else if (popularize_ratioType == 'order_money' && this.form.commission_type == 'money') {
        this.$confirm(this.$t('f7e8bd69.3b50da'), this.$t('f7e8bd69.02d981'), {
          confirmButtonText: this.$t('a8b7ec6e.38cf16'),
          cancelButtonText: this.$t('a8b7ec6e.625fb2'),
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: this.$t('f7e8bd69.2111cc')
            })
          })
      } else if (popularize_ratioType == 'profit' && this.form.commission_type == 'point') {
        this.$confirm(this.$t('f7e8bd69.25d3f9'), this.$t('f7e8bd69.02d981'), {
          confirmButtonText: this.$t('a8b7ec6e.38cf16'),
          cancelButtonText: this.$t('a8b7ec6e.625fb2'),
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: this.$t('f7e8bd69.2111cc')
            })
          })
        if (popularize_ratioType && popularize_ratioType == 'profit') {
          if (val == 'point') {
          }
        }
      } else if (popularize_ratioType == 'order_money' && this.form.commission_type == 'point') {
        this.$confirm(this.$t('f7e8bd69.699bb7'), this.$t('f7e8bd69.02d981'), {
          confirmButtonText: this.$t('a8b7ec6e.38cf16'),
          cancelButtonText: this.$t('a8b7ec6e.625fb2'),
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {
            if (val == 'money') {
              this.form.commission_type = 'point'
            } else {
              this.form.commission_type = 'money'
            }
            this.$message({
              type: 'info',
              message: this.$t('f7e8bd69.2111cc')
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
      this.$confirm(this.$t('f7e8bd69.f85db2'), this.$t('f7e8bd69.02d981'), {
        confirmButtonText: this.$t('a8b7ec6e.38cf16'),
        cancelButtonText: this.$t('a8b7ec6e.625fb2'),
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {
          if (type == 'order_money') {
            this.form.popularize_ratio.type = 'profit'
          } else {
            this.form.popularize_ratio.type = 'order_money'
          }
          this.$message({
            type: 'info',
            message: this.$t('f7e8bd69.2111cc')
          })
        })
    },
    async handleImgChange(data = 'banner') {
      try {
        // 根据不同的图片类型获取当前图片URL
        let currentImgUrl = ''
        switch (data) {
          case 'web':
            currentImgUrl = this.form.h5_share_img || ''
            break
          case 'wxapp':
            currentImgUrl = this.form.applets_share_img || ''
            break
          case 'qrcode_bg_img':
            currentImgUrl = this.form.qrcode_bg_img || ''
            break
          default:
            currentImgUrl = this.form.banner_img || ''
        }

        const { data: result } = await this.$picker.image({
          data: currentImgUrl ? { url: currentImgUrl } : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (result && result.url) || result || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          let finalUrl = imgUrl
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            finalUrl = imgUrl.replace(this.wximageurl, '')
          }

          // 根据不同的图片类型设置对应的字段
          switch (data) {
            case 'web':
              this.form.h5_share_img = finalUrl
              break
            case 'wxapp':
              this.form.applets_share_img = finalUrl
              break
            case 'qrcode_bg_img':
              this.form.qrcode_bg_img = finalUrl
              break
            default:
              this.form.banner_img = finalUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    save() {
      let plusReg = /^[1-9](\d+)?$/
      let countReg = /^\d+$/
      console.log(this.params.limit_rebate)
      if (this.form.limit_rebate < 1) {
        this.$message({ message: this.$t('f7e8bd69.06aa4b'), type: 'error' })
        return
      }
      if (this.form.isOpenPopularize) {
        if (this.form.change_promoter.type == 'vip_grade') {
          if (
            this.form.change_promoter.filter.vip_grade == '' ||
            this.form.change_promoter.filter.vip_grade == '请选择'
          ) {
            this.$message({ message: this.$t('f7e8bd69.b7dbb1'), type: 'error' })
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
        this.$message({ message: this.$t('f7e8bd69.3b1083'), type: 'success' })
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
