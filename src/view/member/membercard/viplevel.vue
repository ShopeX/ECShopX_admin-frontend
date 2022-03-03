<template>
  <div>
    <template v-for="(item, index) in levelData">
      <div class="level-item" :key="index">
        <div class="section-header with-border clearfix">
          <h3 class="f_l"><span v-if="item.lv_type == 'vip'">VIP</span><span v-else>SVIP</span></h3>
          <span
            class="el-icon-close f_r"
            v-if="index != 0 && levelData.length - 1 == index"
            @click="remove(index)"
          ></span>
        </div>
        <div class="item-box clearfix">
          <div class="preview-box f_l" @click="getIndex(index)">
            <div>
              <div @click="handleImgChange(item, index)" class="upload-box">
                <HoverDelete v-if="item.background_pic_url" @delete="handleImgDelete(index)">
                  <img :src="wximageurl + item.background_pic_url" class="avatar" />
                </HoverDelete>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            ></imgPicker>
            <p class="content-center">卡封面（建议尺寸：400px * 250px）</p>
          </div>
          <div class="item-content f_l">
            <div>
              <span class="txt">等级名称</span>
              <el-input
                style="width: 380px"
                :maxlength="9"
                placeholder="最多填写9个汉字"
                v-model="item.grade_name"
                :name="index + ''"
                @blur="nameblur"
              ></el-input
              >&nbsp;<span class="frm-tips">{{ item.grade_name.length }}/9</span>
              <el-input type="hidden" v-model="item.lv_type" :name="index + ''"></el-input>
            </div>
            <div class="clearfix">
              <span class="txt f_l">购买金额</span>
              <template>
                <div class="f_l">
                  <template>
                    <div style="margin-bottom: 5px" v-for="(list, i) in item.price_list" :key="i">
                      {{ list.desc }}&nbsp;<el-input
                        style="width: 80px"
                        :name="index + ''"
                        v-model="list.price"
                      ></el-input
                      >&nbsp;元
                    </div>
                  </template>
                </div>
              </template>
            </div>
            <div class="clearfix">
              <span class="txt f_l">会员折扣</span>
              <div class="f_l">
                <template>
                  <div>
                    <el-input
                      v-model="item.privileges.discount"
                      :name="index + ''"
                      @blur="discountBlur"
                    ></el-input
                    >&nbsp;折
                  </div>
                </template>
              </div>
            </div>
            <!------------------------------------- 卷包功能 -------------------------------------->
            <!-- <div class="clearfix">
              <div class="f_l">
                <template>
                  <el-tooltip placement="top" width="350">
                    <div class="tips" slot="content">
                      <p>客户开通会员后，系统将自动发送优惠券包</p>
                    </div>
                    <el-button
                      style="border: none; font-size: 14px; width: 100px"
                      class="btn"
                      icon="el-icon-warning-outline"
                      >优惠劵包</el-button
                    >
                  </el-tooltip>
                  <el-button @click="pickHanle(index)">选择优惠券包</el-button>
                  <template
                    v-if="item.voucher_package !== undefined && item.voucher_package.length > 0"
                  >
                    <span style="margin-left: 30px"
                      >已选 {{ item.voucher_package.length }} 个劵包</span
                    >
                  </template>
                </template>
              </div>
            </div> -->
            <!------------------------------------- 卷包功能 -------------------------------------->

            <div class="clearfix">
              <span class="txt f_l">购买引导文本</span>
              <div class="f_l">
                <el-input
                  style="width: 380px"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入内容"
                  v-model="item.guide_title"
                  :name="index + ''"
                ></el-input
                >&nbsp;<span class="frm-tips">30</span>
              </div>
            </div>
            <div class="clearfix">
              <span class="txt f_l">详细说明</span>
              <div class="f_l">
                <el-input
                  style="width: 380px"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入内容"
                  v-model="item.description"
                  :name="index + ''"
                ></el-input>
              </div>
            </div>
            <div class="clearfix">
              <span class="txt f_l">默认展示</span>
              <div class="f_l">
                <el-radio
                  style="width: 380px"
                  @change="radioChange"
                  v-model="IsDefault"
                  :label="item.lv_type"
                >
                  {{ item.grade_name }}
                </el-radio>
              </div>
            </div>
            <div class="clearfix">
              <span class="txt f_l">是否禁用</span>
              <div class="f_l">
                <el-switch v-model="item.is_disabled"></el-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="section-footer content-center">
      <el-button @click="addGrade">添加等级卡</el-button>
      <el-button type="primary" @click="saveGrade">保存</el-button>
    </div>
    <template v-if="visible">
      <coupon-select
        :packageId="packageId"
        :seletedCouponPackage="levelData"
        @oldDataHandle="getListVipGrade"
        :visible="visible"
        @openHandle="pickHanle"
        @closeHandle="closeHandle"
        @seletedDataHandle="seletedDataHandle"
        :isModel="true"
        :type="'vip_grade'"
      ></coupon-select>
    </template>
  </div>
</template>
<script>
import { pushNewsImage } from '../../../api/wechat'
import { saveVipGrade, listVipGrade } from '../../../api/cardticket'
import imgPicker from '../../../components/imageselect'
import couponSelect from '@/components/couponPackageSelect'
// import model from './cpn/model.vue'
export default {
  components: {
    imgPicker,
    couponSelect
  },
  data() {
    return {
      visible: false,
      packageId: '',
      gradeId: 1,
      params: {},
      modelInfo: '',
      modelVisible: false,
      curIndex: -1,
      levelData: [
        {
          vip_grade_id: '',
          is_default: false,
          guide_title: '',
          grade_name: '',
          background_pic_url: '',
          price_list: [
            { name: 'monthly', price: 0, day: 30, desc: '30天' },
            { name: 'quarter', price: 0, day: 90, desc: '90天' },
            { name: 'year', price: 0, day: 365, desc: '365天' }
          ],
          privileges: { discount: '' },
          lv_type: 'vip',
          description: '',
          is_disabled: false
        }
      ],
      IsDefault: 'svip',
      imgDialog: false,
      isGetImage: false
    }
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
      // debugger
      this.levelData[packageId].voucher_package = seletedCoupon
      // console.log(this.levelData[packageId].voucher_package);
      console.log('seletedCoupon', seletedCoupon)
    },

    isInArray(arr, value) {
      for (var i = 0; i < arr.length; i++) {
        if (value === arr[i].is_disabled) {
          return true
        }
      }
      return false
    },
    closeModel() {
      this.modelVisible = false
    },
    radioChange(val) {
      if (val) {
        this.IsDefault = val
      }
    },
    saveGrade() {
      console.log(this.levelData)
      var result = this.isEmptyChecked()
      if (result) {
        return
      }
      var check = this.isInArray(this.levelData, true)
      let canSaveResult = true
      this.levelData.forEach((item) => {
        // if (check === true) {
        if (item.lv_type == this.IsDefault) {
          if (!item.guide_title) {
            this.$message({ message: '购买引导必填', type: 'error' })
            canSaveResult = false
            return
          }
          if (item.is_disabled) {
            this.$message({ message: '设为默认的等级，不能禁用', type: 'error' })
            canSaveResult = false
            return
          }
          item.is_default = true
        } else {
          item.is_default = false
        }
        if(item.background_pic_url===''){
          item.background_pic_url=false
        }
        // } else {
        //   item.is_default = false
        // }
      })
      this.params.grade_info = this.levelData
      if (!canSaveResult) {
        return
      }
      saveVipGrade(this.params).then(
        (res) => {
          if (res.data.data.status) {
            this.$message.success('保存成功')
          }
        },
        () => {
          this.getListVipGrade()
        }
      )
    },
    nameblur(e) {
      if (e.target.value == '') {
        this.$message({ message: '请输入等级名称', type: 'error' })
        return
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
    // getIndex (index) {
    //   this.curIndex = index
    // },
    addGrade() {
      if (this.levelData.length >= 2) {
        this.$message({ message: '最多添加2个等级', type: 'error' })
        return
      }
      var arr = {
        vip_grade_id: '',
        grade_name: '',
        is_default: false,
        guide_title: '',
        background_pic_url: '',
        price_list: [
          { name: 'monthly', price: 0, day: 30, desc: '30天' },
          { name: 'quarter', price: 0, day: 90, desc: '90天' },
          { name: 'year', price: 0, day: 365, desc: '365天' }
        ],
        privileges: { discount: '' },
        lv_type: 'svip',
        description: '',
        is_disabled: false
      }
      this.levelData.push(arr)
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
          Number(this.levelData[i].privileges.discount) >
            Number(this.levelData[i - 1].privileges.discount)
        ) {
          isflag = true
          this.$message({ message: '会员折扣不能大于等于上一级折扣', type: 'error' })
          break
        }

        var priceList = this.levelData[i].price_list
        var count = priceList.length
        var isAllNot = true

        for (var j = 0; j < count; j++) {
          if (priceList[j].price) {
            isAllNot = false
          }
        }

        if (isAllNot) {
          isflag = true
          this.$message({
            message: '购买金额：30天 、90天 、 365天 请至少填写一项金额',
            type: 'error'
          })
          break
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
    getListVipGrade() {
      listVipGrade().then((response) => {
        // this.IsDefault = 'svip'
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          var result = response.data.data
          if (result) {
            for (var i = 0; i < result.length; i++) {
              if (result[i].is_default) {
                this.IsDefault = result[i].lv_type
              }
              var priceList = result[i].price_list
              var count = priceList.length
              var isAllNot = true

              for (var j = 0; j < count; j++) {
                if (!priceList[j].price) {
                  result[i].price_list[j].price = 0
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
  },
  mounted() {
    this.getListVipGrade()
  },
  filters: {
    numberToCharacter(val) {
      switch (val) {
        case 1:
          return '二'
        case 2:
          return '三'
        // case 3:
        //   return '四'
        // case 4:
        //   return '五'
        // case 5:
        //   return '六'
        // case 6:
        //   return '七'
        // case 7:
        //   return '八'
      }
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
  width: 500px;
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
  margin-top: 20px;
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
    width: 100%;
    max-height: 100%;
  }
  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    line-height: 125px;
    font-size: 38px;
  }
}
</style>
<style></style>
