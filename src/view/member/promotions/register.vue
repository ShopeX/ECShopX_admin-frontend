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
              !VERSION_B2C ? '用于门店小程序注册引导入口标题' : '用于小程序注册引导入口标题'
            "
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="注册引导图片：">
          <div class="frm-tips">
只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）
</div>
          <div class="frm-tips">
引导用户授权手机号注册，类似新用户专享广告图片
</div>
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
        <el-form-item label="注册引导跳转路径">
          <div class="uploader-setting">
            <div class="goods-select">
              <div
                v-if="
                  JSON.stringify(form.register_jump_path) != '{}' &&
                  JSON.stringify(form.register_jump_path) != '[]'
                "
                class="link-content"
              >
                <span @click="handleGoodsChange()">
                  <template v-if="form.register_jump_path.linkPage === 'goods'">商品：</template>
                  <template v-if="form.register_jump_path.linkPage === 'category'">分类：</template>
                  <template v-if="form.register_jump_path.linkPage === 'article'">文章：</template>
                  <template v-if="form.register_jump_path.linkPage === 'planting'">软文：</template>
                  <!--template v-if="form.register_jump_path.linkPage === 'planting'">种草：</template-->
                  <template v-if="form.register_jump_path.linkPage === 'link'">页面：</template>
                  <template v-if="form.register_jump_path.linkPage === 'marketing'"
                    >营销：</template
                  >
                  <template v-if="form.register_jump_path.linkPage === 'custom_page'"
                    >自定义页：</template
                  >
                  {{ form.register_jump_path.title }}
                </span>
                <span style="margin-left: 10px">
                  <i
                    v-if="
                      JSON.stringify(form.register_jump_path) != '{}' &&
                      JSON.stringify(form.register_jump_path) != '[]'
                    "
                    style="color: #f56c6c"
                    class="el-icon-delete"
                    @click="clear_pic_url"
                  />
                </span>
              </div>
              <div v-else class="content-center" @click="handleGoodsChange()">
                <i class="iconfont icon-link" />设置路径
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="注册送权益：">
          <el-transfer
            v-model="form.promotions_value.items"
            :titles="['服务类商品', '已选中']"
            :button-texts="['移除赠送', '添加赠送']"
            :data="goodsList"
          >
            <div
              slot="left-footer"
              class="transfer-footer"
            >
              <el-pagination
                v-if="total_count > params.pageSize"
                small
                layout="prev, pager, next"
                :total="total_count"
                :page-size="params.pageSize"
                @current-change="handlePagesChange"
              />
            </div>
            <div
              slot="right-footer"
              class="transfer-footer"
            />
          </el-transfer>
        </el-form-item> -->
        <el-form-item label="注册送优惠券：">
          <el-row>
            <el-col :span="12">
              <div class="promotion-card">
                <div class="promotion-card-header">
                  优惠券
                  <a class="promotion-card-btn" href="#" @click="showModal">新增</a>
                </div>
                <div class="promotion-card-body">
                  <ul class="promotion-card-list">
                    <li v-for="(item, index) in coupons.checked" :key="index">
                      <div class="promotion-name">
                        {{ item.title }}
                      </div>
                      <el-input-number
                        v-model="item.count"
                        size="mini"
                        controls-position="right"
                        :min="1"
                        :max="10"
                        label="描述文字"
                      />
                      <i class="remove-btn el-icon-delete" @click="removeChecked(index)" />
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="员工激活礼： 员工注册后，手机号与导入的员工手机号相同，即会触发送礼">
          <el-row>
            <el-col :span="12">
              <div class="promotion-card">
                <div class="promotion-card-header">
                  员工优惠券
                  <a class="promotion-card-btn" href="#" @click="showStaffModal">新增</a>
                </div>
                <div class="promotion-card-body">
                  <ul class="promotion-card-list">
                    <li v-for="(item, index) in staffCoupons.checked" :key="index">
                      <div class="promotion-name">
                        {{ item.title }}
                      </div>
                      <el-input-number
                        v-model="item.count"
                        size="mini"
                        controls-position="right"
                        :min="1"
                        :max="10"
                        label="描述文字"
                      />
                      <i class="remove-btn el-icon-delete" @click="removeStaffChecked(index)" />
                    </li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save">
保 存
</el-button>
      </div>
    </el-form>
    <el-dialog
      title="选择优惠券"
      :visible.sync="coupons.dialog"
      width="30%"
      @open="onshowModal"
      @close="oncloseModal"
    >
      <el-radio-group v-model="card_type" @change="cardTypeChange(false)">
        <el-radio-button label="all" value="all">
全部
</el-radio-button>
        <el-radio-button label="cash" value="cash">
满减券
</el-radio-button>
        <el-radio-button label="discount" value="discount">
折扣券
</el-radio-button>
        <el-radio-button v-if="VERSION_STANDARD" label="new_gift" value="new_gift">
          兑换券
        </el-radio-button>
      </el-radio-group>
      <ul v-loading="coupons.loading" class="dialog-list clearfix">
        <template v-for="(item, index) in coupons.list">
          <li :key="index" :class="item.checked ? 'checked' : ''" @click="selectItems(item)">
            <i v-if="item.checked" class="el-icon-check" /> {{ item.title }}
          </li>
        </template>
      </ul>
      <div class="content-padded">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="coupons.page.currentPage"
          :page-size="coupons.page.pageSize"
          :total="coupons.page.total"
          @current-change="changeCouponsPage"
        />
      </div>
      <div style="display: none">
        <template v-for="(item, index) in coupons.temp">
          <li :key="`coupon-item__${index}`">
            {{ item.title }}
          </li>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelected">取 消</el-button>
        <el-button type="primary" @click="submitSelected(false)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择优惠券"
      :visible.sync="staffCoupons.dialog"
      width="30%"
      @open="onshowStaffModal"
      @close="oncloseModal"
    >
      <el-radio-group v-model="card_type" @change="cardTypeChange(true)">
        <el-radio-button label="all" value="all">
全部
</el-radio-button>
        <el-radio-button label="cash" value="cash">
满减券
</el-radio-button>
        <el-radio-button label="discount" value="discount">
折扣券
</el-radio-button>
        <!-- <el-radio-button
          label="gift"
          value="gift"
        >
          兑换券
        </el-radio-button> -->
      </el-radio-group>
      <ul v-loading="staffCoupons.loading" class="dialog-list clearfix">
        <template v-for="item in staffCoupons.list">
          <li :key="item" :class="item.checked ? 'checked' : ''" @click="selectStaffItems(item)">
            <i v-if="item.checked" class="el-icon-check" /> {{ item.title }}
          </li>
        </template>
      </ul>
      <div class="content-padded">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="staffCoupons.page.currentPage"
          :page-size="staffCoupons.page.pageSize"
          :total="staffCoupons.page.total"
          @current-change="changeStaffCouponsPage"
        />
      </div>
      <div style="display: none">
        <template v-for="(item, index) in staffCoupons.temp">
          <li :key="index">
            {{ item.title }}
          </li>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelected">取 消</el-button>
        <el-button type="primary" @click="submitSelected(true)">确 定</el-button>
      </span>
    </el-dialog>
    <linkSetter
      :links="linksArr"
      :visible="linksVisible"
      :show_article="false"
      :show_planting="false"
      :show_page="false"
      :show_marketing="false"
      :show_store="false"
      @setLink="setLink"
      @closeDialog="closeDialog"
    />
  </div>
</template>
<script>
import imgPicker from '@/components/imageselect'
import { getItemsList } from '@/api/goods'
import { getCardList, getEffectiveCardList } from '@/api/cardticket'
import { saveRegisterPromotions, getRegisterPromotions } from '@/api/promotions'
import linkSetter from '@/components/template_links' // 添加导航连接
export default {
  components: {
    imgPicker,
    linkSetter
  },
  data () {
    return {
      isGetImage: false,
      imgDialog: false,
      activeName: 'first',
      total_count: 0,
      goodsList: [],
      params: {
        page: 1,
        pageSize: 20
      },
      form: {
        id: '',
        is_open: 'false',
        ad_title: '',
        ad_pic: '',
        promotions_value: {
          items: [],
          itemsList: [],
          coupons: []
        },
        register_jump_path: {}
      },
      coupons: {
        dialog: false,
        temp: [],
        list: [],
        checked: [],
        page: {
          currentPage: 1,
          pageSize: 20,
          total: 0
        }
      },
      staffCoupons: {
        dialog: false,
        temp: [],
        list: [],
        checked: [],
        page: {
          currentPage: 1,
          pageSize: 20,
          total: 0
        }
      },
      card_type: 'all',
      linksVisible: false, // 路径设置组件
      linksArr: []
    }
  },
  watch: {
    getStatus (newVal, oldVal) {
      if (newVal) {
        this.getRegisterData()
        this.getGoodsList()
      }
    }
  },
  mounted () {
    this.getRegisterData()
    this.getGoodsList()
  },
  methods: {
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.ad_pic = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    //选择商品分页
    handlePagesChange (val) {
      this.params.page = val
      this.form.promotions_value.itemsList = []
      this.goodsList.forEach((row) => {
        //如果选中
        let index = this.form.promotions_value.items.indexOf(row.key)
        if (index != -1) {
          this.form.promotions_value.itemsList.push(row)
        }
      })
      this.getGoodsList()
    },
    getGoodsList () {
      getItemsList(this.params).then((response) => {
        let list = []
        response.data.data.list.forEach((row) => {
          let index = -1
          if (this.form.promotions_value && this.form.promotions_value.items) {
            index = this.form.promotions_value.items.indexOf(row.itemId)
          }
          //如果未选中
          if (index === -1) {
            list.push({
              key: row.itemId,
              label: row.itemName
            })
          }
        })
        if (this.form.promotions_value.itemsList) {
          this.goodsList = list.concat(this.form.promotions_value.itemsList)
        } else {
          this.goodsList = list
        }
        this.total_count = response.data.data.total_count
      })
    },
    showModal () {
      this.coupons.dialog = true
    },
    showStaffModal () {
      this.staffCoupons.dialog = true
    },
    onshowModal () {
      this.coupons.loading = true
      for (var i = 0; i < this.coupons.checked.length; i++) {
        this.coupons.temp.push(this.coupons.checked[i])
      }
      this.getCoupons(this.coupons.page.currentPage, false)
    },
    changeCouponsPage (currentPage) {
      this.coupons.page.currentPage = currentPage
      this.getCoupons(currentPage, false)
    },
    onshowStaffModal () {
      this.staffCoupons.loading = true
      for (var i = 0; i < this.staffCoupons.checked.length; i++) {
        this.staffCoupons.temp.push(this.staffCoupons.checked[i])
      }
      this.getCoupons(this.staffCoupons.page.currentPage, true)
    },
    changeStaffCouponsPage (currentPage) {
      this.staffCoupons.page.currentPage = currentPage
      this.getCoupons(currentPage, true)
    },
    oncloseModal () {
      this.coupons.temp = []
      this.staffCoupons.temp = []
    },
    selectItems (item) {
      if (item.checked) {
        for (var i = 0; i < this.coupons.temp.length; i++) {
          if (this.coupons.temp[i].card_id === item.card_id) {
            this.coupons.temp.splice(i, 1)
          }
        }
        for (var i = 0; i < this.coupons.list.length; i++) {
          if (this.coupons.list[i].card_id === item.card_id) {
            this.coupons.list[i].checked = false
          }
        }
      } else {
        for (var i = 0; i < this.coupons.list.length; i++) {
          if (this.coupons.list[i].card_id === item.card_id) {
            this.coupons.list[i].checked = true
          }
        }
        this.coupons.temp.push(item)
      }
    },
    selectStaffItems (item) {
      if (item.checked) {
        for (var i = 0; i < this.staffCoupons.temp.length; i++) {
          if (this.staffCoupons.temp[i].card_id === item.card_id) {
            this.staffCoupons.temp.splice(i, 1)
          }
        }
        for (var i = 0; i < this.staffCoupons.list.length; i++) {
          if (this.staffCoupons.list[i].card_id === item.card_id) {
            this.staffCoupons.list[i].checked = false
          }
        }
      } else {
        for (var i = 0; i < this.staffCoupons.list.length; i++) {
          if (this.staffCoupons.list[i].card_id === item.card_id) {
            this.staffCoupons.list[i].checked = true
          }
        }
        this.staffCoupons.temp.push(item)
      }
    },
    cardTypeChange (isStaff) {
      if (isStaff) {
        this.getCoupons(1, true)
      } else {
        this.getCoupons(1, false)
      }
    },
    submitSelected (isStaff) {
      if (isStaff) {
        this.staffCoupons.dialog = false
        this.staffCoupons.checked = this.staffCoupons.temp
        for (var i = 0; i < this.staffCoupons.checked.length; i++) {
          this.staffCoupons.checked[i].count = 1
        }
        this.staffCoupons.temp = []
      } else {
        this.coupons.dialog = false
        this.coupons.checked = this.coupons.temp
        for (var i = 0; i < this.coupons.checked.length; i++) {
          this.coupons.checked[i].count = 1
        }
        this.coupons.temp = []
      }
      this.card_type = 'all'
    },
    cancelSelected () {
      this.coupons.dialog = false
      this.coupons.temp = []
      this.card_type = 'all'
      this.staffCoupons.dialog = false
      this.staffCoupons.temp = []
    },
    removeChecked (index) {
      this.coupons.checked.splice(index, 1)
    },
    removeStaffChecked (index) {
      this.staffCoupons.checked.splice(index, 1)
    },
    getCoupons (current, isStaff) {
      getEffectiveCardList({
        page_no: current,
        page_size: this.coupons.page.pageSize,
        card_type: this.card_type
      }).then((res) => {
        var data = res.data.data.list
        if (isStaff) {
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.staffCoupons.checked.length; j++) {
              if (data[i].card_id === this.staffCoupons.checked[j].card_id) {
                data[i].checked = true
              }
            }
          }
          this.staffCoupons.list = data
          this.staffCoupons.page.total = res.data.data.total_count
          this.staffCoupons.loading = false
        } else {
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.coupons.checked.length; j++) {
              if (data[i].card_id === this.coupons.checked[j].card_id) {
                data[i].checked = true
              }
            }
          }
          this.coupons.list = data
          this.coupons.page.total = res.data.data.total_count
          this.coupons.loading = false
        }
      })
    },
    save () {
      this.form.promotions_value.itemsList = []
      //处理优惠券
      let couponArr = []
      for (var i = 0; i < this.coupons.checked.length; i++) {
        let couponObj = {}
        couponObj.card_id = this.coupons.checked[i].card_id
        couponObj.count = this.coupons.checked[i].count
        couponObj.title = this.coupons.checked[i].title
        couponArr.push(couponObj)
      }
      this.form.promotions_value.coupons = couponArr

      //处理员工优惠券
      let staffCouponArr = []
      for (var i = 0; i < this.staffCoupons.checked.length; i++) {
        let couponObj = {}
        couponObj.card_id = this.staffCoupons.checked[i].card_id
        couponObj.count = this.staffCoupons.checked[i].count
        couponObj.title = this.staffCoupons.checked[i].title
        staffCouponArr.push(couponObj)
      }
      this.form.promotions_value.staff_coupons = staffCouponArr

      this.goodsList.forEach((row) => {
        let index = this.form.promotions_value.items.indexOf(row.key)
        //如果选中
        if (index !== -1) {
          this.form.promotions_value.itemsList.push(row)
        }
      })
      saveRegisterPromotions(this.form).then((res) => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    getRegisterData () {
      var params = { register_type: 'general' }
      getRegisterPromotions(params).then((response) => {
        this.form.ad_pic = response.data.data.ad_pic
        this.form.id = response.data.data.id
        this.form.is_open = response.data.data.is_open
        this.form.ad_title = response.data.data.ad_title
        this.form.register_jump_path = response.data.data.register_jump_path || {}
        if (response.data.data.promotions_value) {
          if (response.data.data.promotions_value.items) {
            this.form.promotions_value.items = response.data.data.promotions_value.items
            this.form.promotions_value.itemsList = response.data.data.promotions_value.itemsList
          }
          this.form.promotions_value.coupons = this.coupons.checked = response.data.data
            .promotions_value.coupons
            ? response.data.data.promotions_value.coupons
            : []
          this.form.promotions_value.staff_coupons = this.staffCoupons.checked = response.data.data
            .promotions_value.staff_coupons
            ? response.data.data.promotions_value.staff_coupons
            : []
        }
      })
    },
    handleGoodsChange () {
      this.linksVisible = true
    },
    closeDialog () {
      this.linksVisible = false
    },
    clear_pic_url () {
      this.form.register_jump_path = {}
    },
    setLink (data, type) {
      let obj = Object.assign(data, { 'linkPage': type })
      this.form.register_jump_path = obj
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
.uploader-setting {
  width: 70%;
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
