<template>
  <div>
    <template v-for="(item, index) in levelData">
      <div :key="index" class="level-item">
        <div class="section-header with-border clearfix">
          <h3 class="f_l">
            <span v-if="index == 0">第一等级（最低等级）</span
            ><span v-else>第{{ index | numberToCharacter }}等级</span>
          </h3>
          <span
            v-if="!item.default_grade && item.member_count == 0 && levelData.length - 1 == index"
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

            <div>
              <div class="upload-box" @click="handleImgChange(item, index)">
                <HoverDelete v-if="item.background_pic_url" @delete="handleImgDelete(index)">
                  <img :src="wximageurl + item.background_pic_url" class="avatar">
                </HoverDelete>
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
            <p class="content-center">卡封面（建议尺寸：600px * 375px）</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">等级名称</span
              ><el-input
                v-model="item.grade_name"
                :maxlength="9"
                placeholder="最多填写9个汉字"
                :name="index + ''"
                @blur="nameblur"
              />&nbsp;<span class="frm-tips">{{ item.grade_name.length }}/9</span>
            </div>
            <div class="clearfix">
              <span class="txt f_l">升级条件</span>
              <span v-if="item.default_grade" class="txt-none">无</span>
              <template v-else>
                <div class="f_l">
                  <template>
                    <div style="margin-bottom: 5px">
                      累积消费金额&nbsp;<el-input
                        v-model="item.promotion_condition.total_consumption"
                        style="width: 80px"
                        :name="index + ''"
                        @blur="promotionConditionsBlur"
                      />&nbsp;元
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="clearfix">
              <span class="txt f_l">会员折扣</span>
              <div class="f_l">
                <template>
                  <div style="margin-bottom: 5px">
                    <!-- <el-checkbox v-model="item.discount_checked">会员折扣</el-checkbox>&nbsp;  --><el-input
                      v-model="item.privileges.discount"
                      style="width: 80px"
                      :name="index + ''"
                      @blur="discountBlur"
                    />&nbsp;折
                  </div>
                </template>
                <SpPlatformTip h5 app alipay />
              </div>
            </div>
            <div class="clearfix">
              <span class="txt f_l">等级说明</span>
              <div class="f_l">
                <template>
                  <div style="margin-bottom: 5px">
                    <el-input
                      v-model="item.description"
                      type="textarea"
                      style="width: 400px"
                      :rows="3"
                      placeholder="请输入等级说明"
                    />
                  </div>
                </template>
              </div>
            </div>
            <!-- ----------------------------------------------卷包功能-------------------------------------------- -->
            <div class="clearfix">
              <div class="f_l">
                <template>
                  <el-tooltip placement="top" width="350">
                    <div slot="content" class="tips">
                      <p>客户开通会员后，系统将自动发送优惠券包</p>
                    </div>
                    <el-button
                      style="border: none; font-size: 14px; width: 100px"
                      class="btn"
                      icon="el-icon-warning-outline"
                    >
                      优惠劵包
                    </el-button>
                  </el-tooltip>
                  <el-button @click="pickHanle(index)"> 选择优惠券包 </el-button>
                  <template
                    v-if="item.voucher_package !== undefined && item.voucher_package.length > 0"
                  >
                    <span style="margin-left: 30px"
                      >已选 {{ item.voucher_package.length }} 个劵包</span
                    >
                  </template>
                </template>
              </div>
            </div>
            <!-- ----------------------------------------------卷包功能-------------------------------------------- -->

            <div v-if="item.crm_open == 'true'" class="clearfix">
              <span class="txt f_l">等级ID</span>
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
    <div class="section-footer content-center">
      <el-button @click="addGrade"> 添加等级卡 </el-button>
      <el-button type="primary" @click="saveGrade"> 保存 </el-button>
    </div>
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
      }
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
          this.$message.success('保存成功')
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
        this.$message({ message: '请输入等级名称', type: 'error' })
        return
      }
    },

    promotionConditionsBlur(e) {
      let value = e.target.value
      let index = Number(e.target.name)
      var reg = /(^[1-9]\d*$)/
      if (index > 0) {
        if (value == '') {
          this.$message({ message: '请输入升级条件', type: 'error' })
          return
        }
        if (!reg.test(value)) {
          this.$message({ message: '累积消费金额为大于0的正整数', type: 'error' })
          return
        }
        if (
          Number(value) <= Number(this.levelData[index - 1].promotion_condition.total_consumption)
        ) {
          this.$message({ message: '累积消费金额不能小于等于上一级消费金额', type: 'error' })
          return
        }
      }
    },
    discountBlur(e) {
      let value = e.target.value
      let index = Number(e.target.name)
      var reg = /(^[1-9]((\.)[0-9])?$)|(^[0]((\.)[0-9])$)|(^10$)/
      if (this.levelData[index].discount_checked) {
        if (value == '') {
          this.$message({ message: '请输入会员折扣', type: 'error' })
          return
        }
        if (!reg.test(value)) {
          this.$message({
            message: '会员折扣为大于0小于等于10的数字，精确到小数点后1位',
            type: 'error'
          })
          return
        }
        if (index > 0 && Number(value) >= Number(this.levelData[index - 1].privileges.discount)) {
          this.$message({ message: '会员折扣不能大于等于上一级折扣', type: 'error' })
          return
        }
      }
    },
    addGrade() {
      if (this.levelData.length >= 5) {
        this.$message({ message: '最多添加5个等级', type: 'error' })
        return
      }
      let crmopen = this.levelData[0].crm_open
      this.levelData.push({
        grade_id: '',
        grade_name: '',
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
          this.$message({ message: '请输入等级名称', type: 'error' })
          break
        }
        if (i > 0) {
          if (this.levelData[i].promotion_condition.total_consumption == '') {
            isflag = true
            this.$message({ message: '请输入升级条件', type: 'error' })
            break
          } else if (!conditionReg.test(this.levelData[i].promotion_condition.total_consumption)) {
            isflag = true
            this.$message({ message: '累积消费金额为大于0的正整数', type: 'error' })
            break
          } else if (
            Number(this.levelData[i].promotion_condition.total_consumption) <=
            Number(this.levelData[i - 1].promotion_condition.total_consumption)
          ) {
            isflag = true
            this.$message({ message: '累积消费金额不能小于等于上一级消费金额', type: 'error' })
            break
          }
        }
        if (this.levelData[i].discount_checked) {
          if (this.levelData[i].privileges.discount == '') {
            isflag = true
            this.$message({ message: '请输入会员折扣', type: 'error' })
            break
          } else if (!discountReg.test(this.levelData[i].privileges.discount)) {
            isflag = true
            this.$message({
              message: '会员折扣为大于0小于等于10的数字，精确到小数点后1位',
              type: 'error'
            })
            break
          } else if (
            i > 0 &&
            Number(this.levelData[i].privileges.discount) >=
              Number(this.levelData[i - 1].privileges.discount)
          ) {
            isflag = true
            this.$message({ message: '会员折扣不能大于等于上一级折扣', type: 'error' })
            break
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
</style>
