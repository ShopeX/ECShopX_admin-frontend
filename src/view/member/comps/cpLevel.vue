<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <template v-for="(item, index) in levelData">
      <div :key="index" class="level-item">
        <div class="section-header with-border clearfix">
          <h3 class="f_l">
            <span v-if="index == 0">{{ $t('11dd4b4a.de985e') }}</span
            ><span v-else>{{ getLevelLabel(index) }}</span>
          </h3>
          <span
            v-if="
              !shuyunOpenPlatformEnabled &&
              !item.default_grade &&
              item.member_count == 0 &&
              levelData.length - 1 == index
            "
            class="el-icon-close f_r"
            @click="remove(index)"
          />
        </div>
        <div class="item-box clearfix">
          <div class="preview-box f_l">
            <!-- <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-change="previewImgChange"
              :auto-upload="false"
              :class="{'disabled': item.member_count > 0, noborder: item.background_pic_url != ''}">
              <img v-if="item.background_pic_url" :src="wximageurl + item.background_pic_url" class="avatar">
              <i v-else class="iconfont icon-upload avatar-uploader-icon"></i>
            </el-upload> -->

            <!-- <div>
              <div class="upload-box" @click="handleImgChange(item, index)">
                <HoverDelete v-if="item.background_pic_url" @delete="handleImgDelete(index)">
                  <img :src="wximageurl + item.background_pic_url" class="avatar">
                </HoverDelete>
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div> -->
            <!-- <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            /> -->
            <SpImagePicker v-model="item.background_pic_url" size="big" />

            <p class="content-center">{{ $t('11dd4b4a.76d1bc') }}</p>
          </div>
          <div class="item-content f_l">
            <div
              class="grade-name-row"
              style="display: flex; align-items: center"
              :class="{ 'grade-name-row--readonly': gradeNameDisabled }"
            >
              <span class="txt">{{ $t('11dd4b4a.9d05c7') }}</span
              ><el-input
                v-model="item.grade_name"
                :maxlength="32"
                :placeholder="$t('11dd4b4a.cdc01b')"
                :name="index + ''"
                :disabled="gradeNameDisabled"
                @blur="nameblur"
              />&nbsp;<span class="frm-tips">{{ item.grade_name.length }}/32</span>
            </div>
            <!-- TODO:数云是否需要等级背景 -->
            <div style="display: flex">
              <span class="txt">{{ $t('11dd4b4a.3334e5') }}</span>
              <SpImagePicker v-model="item.grade_background" />
            </div>
            <div>
              <span class="txt">{{ $t('11dd4b4a.43559d') }}</span
              ><el-input v-model="item.dm_grade_code" :placeholder="$t('11dd4b4a.a11cc7')" />
            </div>
            <div v-if="showUpgradeCondition" class="clearfix">
              <span class="txt f_l">{{ $t('11dd4b4a.f41256') }}</span>
              <span v-if="item.default_grade" class="txt-none">{{ $t('11dd4b4a.d81bb2') }}</span>
              <template v-else>
                <div class="f_l">
                  <template>
                    <div style="margin-bottom: 5px">
                      {{ $t('11dd4b4a.33202f') }}&nbsp;<el-input
                        v-model="item.promotion_condition.total_consumption"
                        style="width: 80px"
                        :name="index + ''"
                        @blur="promotionConditionsBlur"
                      />&nbsp;{{ $t('11dd4b4a.c16655') }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="clearfix">
              <span class="txt f_l">{{ $t('11dd4b4a.eababe') }}</span>
              <div class="f_l">
                <template>
                  <div style="margin-bottom: 5px">
                    <!-- <el-checkbox v-model="item.discount_checked">会员折扣</el-checkbox>&nbsp;  --><el-input
                      v-model="item.privileges.discount"
                      style="width: 80px"
                      :name="index + ''"
                      @blur="discountBlur"
                    />&nbsp;{{ $t('11dd4b4a.96c015') }}
                  </div>
                </template>
                <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
              </div>
            </div>
            <div class="clearfix">
              <span class="txt f_l">{{ $t('11dd4b4a.d57830') }}</span>
              <div class="f_l">
                <template>
                  <div style="margin-bottom: 5px">
                    <SpRichText v-model="item.description" />
                  </div>
                </template>
                &nbsp;<span class="frm-tips">{{ $t('11dd4b4a.7a807c') }}</span>
              </div>
            </div>
            <!-- ----------------------------------------------卷包功能-------------------------------------------- -->
            <div class="clearfix">
              <div class="f_l">
                <template>
                  <el-tooltip placement="top" width="350">
                    <div slot="content" class="tips">
                      <p>{{ $t('11dd4b4a.bc76d3') }}</p>
                    </div>
                    <el-button
                      style="border: none; font-size: 14px; width: 100px"
                      class="btn"
                      icon="el-icon-warning-outline"
                    >
                      {{ $t('11dd4b4a.9ea8d6') }}
                    </el-button>
                  </el-tooltip>
                  <el-button @click="pickHanle(index)">{{ $t('11dd4b4a.df19a7') }}</el-button>
                  <template
                    v-if="item.voucher_package !== undefined && item.voucher_package.length > 0"
                  >
                    <span style="margin-left: 30px"
                      >{{ $t('11dd4b4a.7bf54e') }} {{ item.voucher_package.length }}
                      {{ $t('11dd4b4a.6dd3e5') }}</span
                    >
                  </template>
                </template>
              </div>
            </div>
            <!-- ----------------------------------------------卷包功能-------------------------------------------- -->

            <div v-if="item.crm_open == 'true'" class="clearfix">
              <span class="txt f_l">{{ $t('11dd4b4a.7d603f') }}</span>
              <div class="f_l">
                <template>
                  <div style="margin-bottom: 5px">
                    <el-input v-model="item.third_data" style="width: 150px" :name="index + ''" />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="visible">
      <coupon-select
        :package-id="packageId"
        :seleted-coupon-package="levelData"
        :visible="visible"
        :is-model="true"
        :type="'grade'"
        @openHandle="pickHanle"
        @closeHandle="closeHandle"
        @seletedDataHandle="seletedDataHandle"
        @oldDataHandle="getGradeList"
      />
    </template>
  </div>
</template>
<script>
import { pushNewsImage } from '../../../api/wechat'
import { getGradeList, updateGrade } from '@/api/membercard'
import imgPicker from '../../../components/imageselect'
import couponSelect from '@/components/couponPackageSelect'
// import model from './cpn/model.vue'
export default {
  components: {
    imgPicker,
    couponSelect
  },
  props: {
    shuyunOpenPlatformEnabled: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    numberToCharacter(val) {
      switch (val) {
        case 1:
          return '二'
        case 2:
          return '三'
        case 3:
          return '四'
        case 4:
          return '五'
        case 5:
          return '六'
        case 6:
          return '七'
        case 7:
          return '八'
        case 8:
          return '九'
        case 9:
          return '十'
        case 10:
          return '十一'
      }
    }
  },
  computed: {
    gradeNameDisabled() {
      return this.VERSION_SHUYUN() || this.shuyunOpenPlatformEnabled
    },
    showUpgradeCondition() {
      return !this.VERSION_SHUYUN() && !this.shuyunOpenPlatformEnabled
    }
  },
  data() {
    return {
      gradeId: 1,
      params: {},
      visible: false,
      packageId: '',
      curIndex: -1,
      levelData: [
        {
          grade_id: '',
          grade_name: '',
          grade_background: '',
          background_pic_url: '',
          promotion_condition: {
            total_consumption: 0
          },
          privileges: {
            discount: ''
          },
          default_grade: true,
          discount_checked: true,
          member_count: 0,
          third_data: '',
          voucher_package: [], // 劵包信息
          description: 'test'
        }
      ],
      imgDialog: false,
      isGetImage: false
    }
  },

  mounted() {
    this.getGradeList()
  },
  methods: {
    getLevelLabel(index) {
      if (index === 0) return this.$t('11dd4b4a.de985e')
      const ordinalKeys = [
        '11dd4b4a.2d8be2',
        '11dd4b4a.e662ff',
        '11dd4b4a.21716c',
        '11dd4b4a.1fcc29',
        '11dd4b4a.61b453',
        '11dd4b4a.aad691',
        '11dd4b4a.edf1ac',
        '11dd4b4a.9b4851',
        '11dd4b4a.181245',
        '11dd4b4a.6863d8'
      ]
      const ordinal = index <= 10 ? this.$t(ordinalKeys[index - 1]) : index + 1
      return this.$t('11dd4b4a.6911fb', [ordinal])
    },
    pickHanle(packageId) {
      this.packageId = packageId
      this.visible = true
    },
    closeHandle() {
      this.visible = false
    },
    seletedDataHandle(seletedCoupon, packageId) {
      this.levelData[packageId].voucher_package = seletedCoupon

      console.log('seletedCoupon', seletedCoupon)
    },
    saveGrade() {
      var result = this.isEmptyChecked()
      if (result) {
        return
      }
      console.log(this.levelData)
      this.params.grade_info = JSON.stringify(this.levelData)

      updateGrade(this.params).then((res) => {
        if (res.data.data.status) {
          this.$message.success(this.$t('11dd4b4a.3b1083'))
        }
      })
    },
    // previewImgChange(file, fileList) {
    //   this.levelData[this.curIndex].background_pic_url = URL.createObjectURL(file.raw)
    //   const isJPG = file.raw.type === 'image/jpeg'
    //   const isPNG = file.raw.type === 'image/png'
    //   const isLt2M = file.raw.size / 1024 / 1024 <= 5
    //   if (!isJPG && !isPNG) {
    //     this.$message.error('上传头像图片只能是 JPG、PNG 格式!')
    //     return
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 5MB!')
    //     return
    //   }
    //   let params = {isUploadFile: true, file: file.raw}
    //   pushNewsImage(params).then(res => {
    //     this.levelData[this.curIndex].background_pic_url = res.data.data.url
    //   })
    // },
    nameblur(e) {
      if (e.target.value == '') {
        this.$message({ message: this.$t('11dd4b4a.775081'), type: 'error' })
        return
      }
    },

    promotionConditionsBlur(e) {
      let value = e.target.value
      let index = Number(e.target.name)
      var reg = /(^[1-9]\d*$)/
      if (index > 0) {
        if (value == '') {
          this.$message({ message: this.$t('11dd4b4a.ed17f5'), type: 'error' })
          return
        }
        if (!reg.test(value)) {
          this.$message({ message: this.$t('11dd4b4a.ed7313'), type: 'error' })
          return
        }
        if (
          Number(value) <= Number(this.levelData[index - 1].promotion_condition.total_consumption)
        ) {
          this.$message({ message: this.$t('11dd4b4a.50b3a6'), type: 'error' })
          return
        }
      }
    },
    discountBlur(e) {
      let value = e.target.value
      let index = Number(e.target.name)
      var reg = /(^[1-9]((\.)[0-9])?$)|(^[0]((\.)[0-9])$)|(^10$)/
      if (this.levelData[index].discount_checked) {
        if (value == '' && this.VERSION_SHUYUN()) {
          this.$message({ message: this.$t('11dd4b4a.47ef84'), type: 'error' })
          return
        }
        // if (!reg.test(value) && this.VERSION_SHUYUN()) {
        //   this.$message({
        //     message: '会员折扣为大于0小于等于10的数字，精确到小数点后1位',
        //     type: 'error'
        //   })
        //   return
        // }
        // if (index > 0 && Number(value) >= Number(this.levelData[index - 1].privileges.discount)) {
        //   this.$message({ message: '会员折扣不能大于等于上一级折扣', type: 'error' })
        //   return
        // }
      }
    },
    addGrade() {
      if (this.levelData.length >= 10) {
        this.$message({ message: this.$t('11dd4b4a.852f97'), type: 'error' })
        return
      }
      let crmopen = this.levelData[0].crm_open
      this.levelData.push({
        grade_id: '',
        grade_name: '',
        grade_background: '',
        background_pic_url: '',
        promotion_condition: { total_consumption: 0 },
        privileges: { discount: '' },
        default_grade: false,
        member_count: 0,
        discount_checked: true,
        crm_open: crmopen,
        third_data: '',
        voucher_package: [] // 劵包信息
      })
    },
    remove(index) {
      this.levelData.splice(index, 1)
    },
    numberVerification(val) {
      var reg = /^[0-9]+$/
      if (!reg.test(val)) {
        return false
      }
      return true
    },
    isEmptyChecked() {
      var isflag = false
      var conditionReg = /(^[1-9]\d*$)/
      var discountReg = /(^[1-9]((\.)[0-9])?$)|(^[0]((\.)[0-9])$)|(^10$)/
      for (var i = 0; i < this.levelData.length; i++) {
        if (this.levelData[i].grade_name == '') {
          isflag = true
          this.$message({ message: this.$t('11dd4b4a.775081'), type: 'error' })
          break
        }
        if (i > 0 && this.showUpgradeCondition) {
          if (this.levelData[i].promotion_condition.total_consumption == '') {
            isflag = true
            this.$message({ message: this.$t('11dd4b4a.ed17f5'), type: 'error' })
            break
          } else if (!conditionReg.test(this.levelData[i].promotion_condition.total_consumption)) {
            isflag = true
            this.$message({ message: this.$t('11dd4b4a.ed7313'), type: 'error' })
            break
          } else if (
            Number(this.levelData[i].promotion_condition.total_consumption) <=
            Number(this.levelData[i - 1].promotion_condition.total_consumption)
          ) {
            isflag = true
            this.$message({ message: this.$t('11dd4b4a.50b3a6'), type: 'error' })
            break
          }
        }
        if (this.levelData[i].discount_checked) {
          if (this.levelData[i].privileges.discount == '' && this.VERSION_SHUYUN()) {
            isflag = true
            this.$message({ message: this.$t('11dd4b4a.47ef84'), type: 'error' })
            break
          } else if (
            !discountReg.test(this.levelData[i].privileges.discount) &&
            this.VERSION_SHUYUN()
          ) {
            // isflag = true
            // this.$message({
            //   message: '会员折扣为大于0小于等于10的数字，精确到小数点后1位',
            //   type: 'error'
            // })
            // break
          }
        }
      }
      return isflag
    },
    //上传卡封面
    handleImgChange(item, index) {
      this.imgDialog = true
      this.isGetImage = true
      this.curIndex = index
    },
    handleImgDelete(index) {
      this.levelData[index].background_pic_url = ''
    },
    pickImg(data) {
      this.levelData[this.curIndex].background_pic_url = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    getGradeList() {
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          var result = response.data.data
          if (result) {
            for (var i = 0; i < result.length; i++) {
              if (
                !result[i].promotion_condition &&
                !result[i].promotion_condition.total_consumption
              ) {
                result[i].promotion_condition = {
                  total_consumption: ''
                }
              }
              if (!result[i].privileges && !result[i].privileges.discount) {
                result[i].privileges = {
                  discount: ''
                }
              } else {
                result[i].privileges.discount = result[i].privileges.discount_desc
              }
              if (!result[i].privileges.discount && !result[i].privileges.discount_desc) {
                result[i]['privileges'].discount = 10
              }
              result[i].grade_background = result[i].grade_background || ''
              result[i].discount_checked = true
            }
            this.levelData = result
            console.log(this.levelData)
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.section-box {
  padding: 15px;
}
.avatar-uploader {
  margin-bottom: 15px;
  width: 200px;
  height: 125px;
  &.disabled {
    border-color: #999;
    .avatar-uploader-icon {
      color: #999;
      cursor: not-allowed;
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #ff5000;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #ff5000;
}
.avatar-uploader-icon {
  display: block;
  font-size: 28px;
  width: 200px;
  height: 125px;
  line-height: 125px;
  font-size: 38px;
  color: #ccc;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 125px;
  display: block;
}
.item-box {
  padding-top: 10px;
  /* display: flex; */
}
.clearfix {
  *zoom: 1;
}

.clearfix:after,
.clearfix:before {
  content: '';
  display: table;
  line-height: 0;
}

.clearfix:after {
  clear: both;
}

.f_l {
  float: left;
}
.level-item {
  margin-bottom: 20px;
  .el-icon-close {
    cursor: pointer;
  }
}
.preview-box {
  width: 200px;
  margin-top: 15px;
  margin: 15px 20px 0 0;
  text-align: center;
}
.item-content {
  // width: 500px;
  .txt {
    width: 80px;
    display: inline-block;
    text-align: right;
    margin-right: 10px;
    line-height: 36px;
  }
  .txt-none {
    line-height: 36px;
  }
  > div {
    margin-top: 10px;
  }
}
.section-footer {
  margin-top: 80px;
  margin-bottom: 30px;
}
.noborder {
  border: 0;
}
.item-content .el-input {
  width: 65%;
}
.item-content .el-checkbox {
  color: inherit;
}
.grade-name-row--readonly .txt {
  color: #c0c4cc;
}
.grade-name-row--readonly .frm-tips {
  color: #c0c4cc;
}
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  width: 200px;
  height: 125px;
  .avatar {
    max-width: 100%;
    max-height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    line-height: 125px;
  }
  .avatar-uploader-icon {
    font-size: 38px;
  }
}
.content-center {
  font-size: 12px;
}
</style>
