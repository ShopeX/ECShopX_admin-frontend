<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white">
    <el-form ref="form" :model="form" label-position="left" label-width="180px">
      <div class="section-body">
        <el-form-item :label="$t('8804b0ee.9f0f3f')" prop="ad_title">
          <el-switch
            v-model="form.is_open"
            :width="60"
            active-value="true"
            inactive-value="false"
            inactive-color="#ccc"
            :active-text="$t('8804b0ee.cc42dd')"
            :inactive-text="$t('8804b0ee.b15d91')"
            active-color="#13ce66"
          />
        </el-form-item>
        <el-form-item :label="$t('8804b0ee.6ed28f')" prop="ad_title">
          <el-input
            v-model="form.ad_title"
            :placeholder="registerAdTitlePlaceholder"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item :label="$t('8804b0ee.60079e')">
          <div class="frm-tips">{{ $t('8804b0ee.6113fc') }}</div>
          <div class="frm-tips">{{ $t('8804b0ee.3b1660') }}</div>
          <div>
            <div class="upload-box" @click="handleImgChange">
              <img v-if="form.ad_pic" :src="wximageurl + form.ad_pic" class="avatar" width="200">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('8804b0ee.01976e')">
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
        <el-form-item v-if="priceList.length > 0" :label="$t('8804b0ee.e04052')">
          <!-- {{ membercards }}
          {{ priceList }} -->
          <el-radio-group v-model="membercards.card_type">
            <el-radio v-for="(item, index) in priceList" :key="index" :label="item.name">
              {{ item.desc }}({{ item.price }}{{ $t('8804b0ee.c16655') }})
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> {{ $t('8804b0ee.56df61') }} </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { saveRegisterPromotions } from '../../../api/promotions'
export default {
  components: {},
  props: ['getStatus', 'activeName'],
  data() {
    return {
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
  computed: {
    registerAdTitlePlaceholder() {
      return !this.VERSION_B2C() ? this.$t('8804b0ee.194ebe') : this.$t('8804b0ee.29ec5d')
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
    async handleImgChange() {
      try {
        const { data } = await this.$picker.image({
          data: this.form.ad_pic ? { url: this.form.ad_pic } : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          // form.ad_pic 存储的是相对路径（显示时使用 wximageurl + form.ad_pic）
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            this.form.ad_pic = imgUrl.replace(this.wximageurl, '')
          } else {
            this.form.ad_pic = imgUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    save() {
      this.form.promotions_value.membercard = this.membercards
      saveRegisterPromotions(this.form).then((res) => {
        this.$message({
          message: this.$t('8804b0ee.3b1083'),
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
