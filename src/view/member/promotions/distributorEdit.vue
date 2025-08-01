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
            placeholder="用于门店小程序注册引导入口标题"
            style="width: 340px"
          />
        </el-form-item>
        <el-form-item label="注册引导图片：">
          <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）</div>
          <div class="frm-tips">引导用户授权手机号注册，类似新用户专享广告图片</div>
          <div>
            <div class="upload-box" @click="handleImgChange">
              <img v-if="form.ad_pic" :src="wximageurl + form.ad_pic" class="avatar">
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
        <el-form-item label="请选择分销商：">
          <el-transfer
            v-model="form.distributor_id"
            :titles="['分销商列表', '已选中']"
            :button-texts="['移除', '添加']"
            :data="distributorList"
          >
            <div slot="left-footer" class="transfer-footer">
              <el-pagination
                v-if="dis_total_count > dis_params.pageSize"
                small
                layout="prev, pager, next"
                :total="dis_total_count"
                :page-size="dis_params.pageSize"
                @current-change="handleGoodsChange"
              />
            </div>
            <div slot="right-footer" class="transfer-footer" />
          </el-transfer>
        </el-form-item>
        <!-- <el-form-item label="注册送商品：">
          <el-transfer
            v-model="form.promotions_value.items"
            :titles="['商品列表', '已选中']"
            :button-texts="['移除赠送', '添加赠送']"
            :data="goodsList">
            <div class="transfer-footer" slot="left-footer">
              <el-pagination  v-if="goods_total_count > goods_params.pageSize"
                small
                layout="prev, pager, next"
                @current-change="handleGoodsChange"
                :total="goods_total_count"
                :page-size="goods_params.pageSize" >
              </el-pagination>
            </div>
            <div class="transfer-footer" slot="right-footer"></div>
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
      </div>
      <div class="section-footer with-border content-center">
        <el-button type="primary" @click="save"> 保 存 </el-button>
      </div>
    </el-form>
    <el-dialog
      title="选择优惠券"
      :visible.sync="coupons.dialog"
      width="30%"
      @open="onshowModal"
      @close="oncloseModal"
    >
      <ul v-loading="coupons.loading" class="dialog-list clearfix">
        <template v-for="item in coupons.list">
          <li :class="item.checked ? 'checked' : ''" @click="selectItems(item)">
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
          <li>{{ item.title }}</li>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSelected">取 消</el-button>
        <el-button type="primary" @click="submitSelected">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import imgPicker from '../../../components/imageselect'
import { getItemsList } from '../../../api/goods'
import { getCardList } from '../../../api/cardticket'
import { getDistributorList, createRegister, getRegisterInfo } from '../../../api/promotions'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      isGetImage: false,
      imgDialog: false,
      activeName: 'register',
      goods_total_count: 0,
      dis_total_count: 0,
      goodsList: [],
      distributorList: [],
      goods_params: {
        page: 1,
        pageSize: 20
      },
      dis_params: {
        page: 1,
        pageSize: 500,
        id: 0
      },
      form: {
        is_open: 'false',
        ad_title: '',
        ad_pic: '',
        promotions_value: {
          items: [],
          itemsList: [],
          coupons: []
        },
        distributor_id: [],
        register_type: 'distributor',
        id: ''
      },
      checkedDistributorIds: [],
      coupons: {
        dialog: false,
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
      options: []
    }
  },
  mounted() {
    var id = this.$route.params.id
    if (id) {
      getRegisterInfo(id).then(response => {
        this.form.id = response.data.data.id
        this.form.ad_pic = response.data.data.ad_pic
        this.form.is_open = response.data.data.is_open
        this.form.ad_title = response.data.data.ad_title
        this.form.distributor_id = response.data.data.distributor_id
        this.form.register_type = response.data.data.register_type
        if (response.data.data.promotions_value) {
          // if(response.data.data.promotions_value.items) {
          //   this.form.promotions_value.items = response.data.data.promotions_value.items
          //   this.form.promotions_value.itemsList = response.data.data.promotions_value.itemsList
          // }
          this.form.promotions_value.coupons = this.coupons.checked = response.data.data
            .promotions_value.coupons
            ? response.data.data.promotions_value.coupons
            : []
        }
        if (response.data.data.distributor_id.ids) {
          this.form.distributor_id = response.data.data.distributor_id.ids
          this.checkedDistributorIds = response.data.data.distributor_id.list
        }
      })
      this.dis_params.id = id
    }
    this.getDustributorData()
    //this.getGoodsList()
  },
  methods: {
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
    //选择商品分页
    // handleGoodsChange (val) {
    //   this.goods_params.page = val
    //   this.form.promotions_value.itemsList = []
    //   this.goodsList.forEach(row => {
    //     //如果选中
    //     let index = this.form.promotions_value.items.indexOf(row.key)
    //     if(index != -1) {
    //       this.form.promotions_value.itemsList.push(row)
    //     }
    //   })
    //   this.getGoodsList()
    // },
    // getGoodsList () {
    //   getItemsList(this.goods_params).then(response => {
    //     let list = []
    //     response.data.data.list.forEach(row =>{
    //       let index = -1
    //       if(this.form.promotions_value && this.form.promotions_value.items ) {
    //         index = this.form.promotions_value.items.indexOf(row.itemId)
    //       }
    //       //如果未选中
    //       if(index === -1) {
    //         list.push({
    //           key: row.itemId,
    //           label: row.itemName,
    //         })
    //       }
    //     })
    //     if(this.form.promotions_value.itemsList) {
    //       this.goodsList = list.concat(this.form.promotions_value.itemsList)
    //     } else {
    //       this.goodsList = list
    //     }
    //     this.goods_total_count = response.data.data.total_count
    //   })
    // },
    showModal() {
      this.coupons.dialog = true
    },
    onshowModal() {
      this.coupons.loading = true
      for (var i = 0; i < this.coupons.checked.length; i++) {
        this.coupons.temp.push(this.coupons.checked[i])
      }
      this.getCoupons(this.coupons.page.currentPage)
    },
    changeCouponsPage(currentPage) {
      this.coupons.page.currentPage = currentPage
      this.getCoupons(currentPage)
    },
    oncloseModal() {
      this.coupons.temp = []
    },
    selectItems(item) {
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
    submitSelected() {
      this.coupons.dialog = false
      this.coupons.checked = this.coupons.temp
      for (var i = 0; i < this.coupons.checked.length; i++) {
        this.coupons.checked[i].count = 1
      }
      this.coupons.temp = []
    },
    cancelSelected() {
      this.coupons.dialog = false
      this.coupons.temp = []
    },
    removeChecked(type, index) {
      this.coupons.checked.splice(index, 1)
    },
    getCoupons(current) {
      getCardList({
        page_no: current,
        page_size: this.coupons.page.pageSize
      }).then(res => {
        var data = res.data.data.list
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < this.coupons.checked.length; j++) {
            if (data[i].card_id === this.coupons.checked[j].card_id) {
              data[i].checked = true
            }
          }
        }
        this.coupons.list = data
        this.coupons.page.total = res.data.data.pagers.total
        this.coupons.loading = false
      })
    },
    save() {
      const that = this
      let couponArr = []
      for (var i = 0; i < this.coupons.checked.length; i++) {
        let couponObj = {}
        couponObj.card_id = this.coupons.checked[i].card_id
        couponObj.count = this.coupons.checked[i].count
        couponObj.title = this.coupons.checked[i].title
        couponArr.push(couponObj)
      }
      this.form.promotions_value.coupons = couponArr

      // this.form.promotions_value.itemsList = []
      // this.goodsList.forEach(row => {
      //   let index = this.form.promotions_value.items.indexOf(row.key)
      //   //如果选中
      //   if(index !== -1) {
      //     this.form.promotions_value.itemsList.push(row)
      //   }
      // })
      createRegister(this.form).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            that.$router.go(-1)
          }
        })
      })
    },
    //选择商品分页
    handleDistributorChange(val) {
      this.dis_params.page = val
      this.checkedDistributorIds = []
      this.distributorList.forEach(row => {
        //如果选中
        let index = this.form.distributor_id.indexOf(row.key)
        if (index != -1) {
          this.checkedDistributorIds.push(row)
        }
      })
      this.getDustributorData()
    },
    getDustributorData() {
      getDistributorList(this.dis_params).then(response => {
        let list = []
        response.data.data.list.forEach(row => {
          let index = -1
          if (this.form.distributor_id) {
            index = this.form.distributor_id.indexOf(row.distributor_id)
          }
          //如果未选中
          if (index === -1) {
            list.push({
              key: row.distributor_id,
              label: row.name
            })
          }
        })
        if (this.checkedDistributorIds) {
          this.distributorList = list.concat(this.checkedDistributorIds)
        } else {
          this.distributorList = list
        }
        this.dis_total_count = response.data.data.total_count
      })
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
