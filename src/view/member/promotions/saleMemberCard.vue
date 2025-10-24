<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="180px">
      <div class="section-body">
        <el-form-item label="是否开启：" prop="ad_title">
          <el-switch
            v-model="form.is_open"
            :width="60"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            active-text="开启"
            inactive-text="关闭"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item label="注册引导广告标题：" prop="ad_title">
          <el-input
            v-model="form.ad_title"
            :placeholder="
              !VERSION_B2C() ? '用于门店小程序注册引导入口标题' : '用于小程序注册引导入口标题'
            "
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="注册引导图片：">
          <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）</div>
          <div class="frm-tips">引导用户授权手机号注册，类似新用户专享广告图片</div>
          <div>
            <div class="upload-box" @click="handleImgChange">
              <img v-if="form.ad_pic" :src="wximageurl + form.ad_pic" class="avatar" width="200">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>
        <el-form-item label="请选择赠送会员卡类型：">
          <el-radio-group v-model="membercards.index_value" @change="vipGradeChange">
            <el-radio
              v-for="(item, index) in vipGrade"
              :key="index"
              :label="index"
              @click="vipGradeClick(index, item)"
            >
              {{ item.grade_name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="priceList.length > 0" label="请选择赠送会员卡：">
          <!-- {{ membercards }}
          {{ priceList }} -->
          <el-radio-group v-model="membercards.card_type">
            <el-radio v-for="(item, index) in priceList" :key="index" :label="item.name">
              {{ item.desc }}({{ item.price }}元)
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import imgPicker from '../../../components/imageselect'
import { saveRegisterPromotions } from '../../../api/promotions'
export default {
  components: {
    imgPicker
  },
  props: ['getStatus', 'activeName'],
  data() {
    return {
      isGetImage: false,
      imgDialog: false,
      total_count: 0,
      vipGrade: [],
      priceList: [],
      form: {
        id: '',
        is_open: 'false',
        register_type: 'membercard',
        ad_title: '',
        ad_pic: '',
        promotions_value: {
          membercard: {
            vip_grade_id: '',
            card_type: '',
            index_value: 0
          }
        }
      },
      membercards: {
        vip_grade_id: '',
        card_type: '',
        index_value: 0
      }
    }
  },
  watch: {
    activeName(newVal, oldVal) {
      if (newVal != oldVal) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.getMemberVipGrade()
      await this.getRegisterData()
    },
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.ad_pic = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    save() {
      this.form.promotions_value.membercard = this.membercards
      saveRegisterPromotions(this.form).then(res => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    async getMemberVipGrade() {
      var params = { is_disabled: 'false' }
      this.vipGrade = await this.$api.cardticket.listVipGrade(params)
      if (this.vipGrade.length > 0) {
        var item = this.vipGrade[this.membercards.index_value]
        this.membercards.vip_grade_id = item.vip_grade_id
        this.priceList = item.price_list
        this.membercards.card_type = this.priceList[0].name
      }
    },
    vipGradeChange(index) {
      var item = this.vipGrade[index]
      this.membercards.vip_grade_id = item.vip_grade_id
      this.priceList = item.price_list
      this.membercards.card_type = this.priceList[0].name
    },
    async getRegisterData() {
      var params = { register_type: 'membercard' }
      const { ad_pic, id, is_open, ad_title, promotions_value } =
        await this.$api.promotions.getRegisterPromotions(params)
      this.form.ad_pic = ad_pic
      this.form.id = id
      this.form.is_open = is_open
      this.form.ad_title = ad_title
      if (promotions_value && promotions_value.membercard) {
        this.membercards = promotions_value.membercard
        this.membercards.index_value = parseInt(this.membercards.index_value)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  display: inline-block;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}
.promotion-card {
  border: 1px solid #dcdfe6;
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 4px;
  &-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    margin: 0;
    padding-left: 15px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 16px;
    color: #303133;
    font-weight: 400;
  }
  &-list {
    margin: 0;
    padding: 6px 0;
    list-style: none;
    height: 246px;
    overflow: auto;
    box-sizing: border-box;
    li {
      display: flex;
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding-left: 20px;
      padding-right: 36px;
      line-height: 30px;
      .promotion-name {
        flex: 1;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-input-number--mini {
        width: 80px;
        height: 28px;
      }
      .remove-btn {
        display: none;
        position: absolute;
        top: 8px;
        right: 10px;
        cursor: pointer;
      }
      &:hover {
        background-color: #f8f8f8;
        .remove-btn {
          display: block;
        }
      }
    }
  }
  &-btn {
    position: absolute;
    right: 15px;
    font-size: 14px;
  }
}
.dialog-list li {
  width: 50%;
  float: left;
  padding-left: 30px;
  padding-right: 20px;
  line-height: 30px;
  cursor: pointer;
  &.checked {
    color: #ff5000;
  }
  &:hover {
    background: #f8f8f8;
  }
}
</style>
<style type="text/css" lang="scss">
.register-promotion {
  .el-transfer-panel {
    width: 270px;
  }
  .el-transfer-panel__body.is-with-footer {
    box-sizing: content-box;
  }
}
</style>
