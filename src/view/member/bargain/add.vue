<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section-white content-padded bargain-box">
    <el-form ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item :label="$t('82e97e47.39834b')" prop="title">
        <el-input v-model="form.title" :maxlength="20" style="width: 280px" />&nbsp;<span
          class="frm-tips"
          >{{ form.title.length }}/20</span
        >
      </el-form-item>
      <el-form-item :label="$t('82e97e47.98fbb0')" prop="ad_pic">
        <p class="frm-tips">{{ $t('82e97e47.c2c43a') }}</p>
        <div class="activity-poster">
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
      <el-form-item :label="$t('82e97e47.c799f5')" prop="bargains_datetime">
        <el-date-picker
          v-model="form.bargains_datetime_begin"
          type="datetime"
          :placeholder="$t('82e97e47.e19a25')"
        />
        ~
        <el-date-picker
          v-model="form.bargains_datetime_end"
          type="datetime"
          :placeholder="$t('82e97e47.90630e')"
        />
      </el-form-item>
      <el-form-item :label="$t('82e97e47.02a217')" prop="bargain_rules">
        <el-col :span="12">
          <el-input v-model="form.bargain_rules" type="textarea" />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('82e97e47.63a4eb')" prop="bargain_pics">
        <p class="frm-tips">{{ $t('82e97e47.e599ff') }}</p>
        <div class="pics-box">
          <div class="pics-list">
            <template v-for="(item, index) in form.help_pics">
              <div class="pics-item">
                <img :src="wximageurl + item">
                <div class="bg-mask">
                  <i class="icon el-icon-edit-outline" @click="picsEdit(index)" />
                  <i class="icon el-icon-delete" @click="picsDelete(index)" />
                </div>
              </div>
            </template>
            <div class="upload-box" @click="handlePicsChange">
              <i class="el-icon-plus avatar-uploader-icon" />
            </div>
          </div>
        </div>
        <imgPicker
          :dialog-visible="picsDialog"
          :sc-status="isGetPics"
          @chooseImg="pickPics"
          @closeImgDialog="closePicsDialog"
        />
      </el-form-item>

      <el-form-item :label="$t('82e97e47.4bf3a9')">
        <el-row :gutter="20">
          <el-col :span="20" style="padding-left: 0px">
            <p class="frm-tips" />
            <div class="logo-box">
              <div class="bran-img">
                <div v-if="goods.pics" class="groups-addgoods">
                  <img :src="wximageurl + goods.pics[0]" class="groups-goodspic">
                  <div class="gooups-goodsmsg">
                    <div>{{ goods.itemName }}</div>
                    <div>{{ $t('82e97e47.80193b') }}￥{{ goods.price }}</div>
                    <div v-if="goods.item_type == 'normal' || goods.store > 0">
                      {{ $t('82e97e47.b008bd') }}{{ goods.store }}
                    </div>
                  </div>
                </div>
                <div v-else tabindex="0" class="upload-box" @click="changeItem">
                  <i class="el-icon-plus avatar-uploader-icon" />
                </div>
              </div>
              <el-button size="small" type="primary" @click="changeItem">
                {{ $t('82e97e47.43d1e2') }}
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <!--<el-form-item label="产品名称" prop="item_name">
        <el-input v-model="form.item_name" :maxlength='20' style="width: 280px;"></el-input>&nbsp;<span class="frm-tips">{{form.item_name.length}}/20</span>
      </el-form-item>
      <el-form-item label="产品图片" prop="item_pics">
        <p class="frm-tips">建议图片尺寸618px * 610px，点击图片可更换，图片大小不能超过 2MB</p>
        <div>
          <div @click="handleProductPicChange" class="upload-box">
            <img v-if="form.item_pics" :src="wximageurl + form.item_pics" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
        <imgPicker :dialog-visible="productPicDialog" :sc-status="isGetProductPic" @chooseImg="productPic" @closeImgDialog="closeProductPicDialog"></imgPicker>
      </el-form-item>
      <el-form-item label="产品原价" prop="mkt_price">
        <el-input v-model="form.mkt_price" style="width: 120px;"></el-input>&nbsp;元，最多保留两位小数,原价至少要比底价大￥1
      </el-form-item>-->

      <el-form-item :label="$t('82e97e47.70d74a')" prop="price">
        <el-input v-model="form.price" style="width: 120px" />&nbsp;{{ $t('82e97e47.e33542') }}
      </el-form-item>
      <!--       <el-form-item label="助力区间" prop="price_range">
      <p class="frm-tips">助力金额最小为0，最大不能超过原价和底价之差，请合理设置</p>
        <el-input v-model="form.price_min" placeholder="最低可砍多少元" style="width: 80px;"></el-input> ~ <el-input v-model="form.price_max" placeholder="最高可砍多少元" style="width: 80px;"></el-input>&nbsp;元，最多保留两位小数
      </el-form-item> -->
      <el-form-item :label="$t('82e97e47.bfea22')" prop="people_range">
        <el-input
          v-model="form.people_min"
          type="number"
          min="1"
          :placeholder="$t('82e97e47.e95b5a')"
          style="width: 80px"
        />
        ~
        <el-input
          v-model="form.people_max"
          type="number"
          min="2"
          :placeholder="$t('82e97e47.1f2329')"
          style="width: 80px"
        />
      </el-form-item>
      <!--  <el-form-item label="最少助力金额" prop="min_price">
        <el-input v-model="form.min_price" style="width: 120px;"></el-input>&nbsp;元，最多保留两位小数，可以为负数
      </el-form-item> -->
      <!-- <el-form-item label="产品数量" prop="limit_num">
        <el-input v-model.number="form.limit_num" type="number" min=1 style="width: 120px;"></el-input>
      </el-form-item>-->
      <!--<el-form-item label="产品详情" prop="item_intro">
        <span class="tpl_item img" @click="addImgPreview" style="">
          <i class="el-icon-picture"></i>图片
        </span>
        <imgPicker :dialog-visible="thumbDialog" :sc-status="isGetThumb" @chooseImg="pickThumb" @closeImgDialog="closeThumbDialog"></imgPicker>
      </el-form-item>-->
      <el-form-item :label="$t('82e97e47.1d1ff8')" prop="share_msg">
        <el-input v-model="form.share_msg" style="width: 280px" />
      </el-form-item>
      <el-form-item class="content-center">
        <el-button @click="cancel"> {{ $t('82e97e47.5f4112') }} </el-button>
        <el-button type="primary" @click="save"> {{ $t('82e97e47.be5fbb') }} </el-button>
      </el-form-item>
    </el-form>

    <el-dialog :title="$t('82e97e47.43d1e2')" :visible.sync="goodsDialogVisible" center>
      <el-button-group class="tab-group">
        <!--        <el-button class="tab-btn" @click="changeGoods('every')" :class="goodsTypeTitle==='服务类商品' ? 'on' : ''">服务类商品</el-button>-->
        <!--        <el-button class="tab-btn" @click="changeGoods('normal')" :class="goodsTypeTitle==='实体类商品' ? 'on' : ''" >实体类商品</el-button>-->
      </el-button-group>
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="12">
          <el-input v-model="itemsParams.keywords" :placeholder="$t('82e97e47.1fd1d5')">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch" />
          </el-input>
        </el-col>
      </el-row>
      <el-table v-loading="itemsLoading" :data="itemsList" style="width: 100%" border height="500">
        <el-table-column prop="itemName" :label="$t('82e97e47.1fd1d5')" />
        <el-table-column :label="$t('82e97e47.0f088d')">
          <template slot-scope="scope">
            <img width="20" :src="wximageurl + scope.row.pics[0]">
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('82e97e47.e29575')" :formatter="priceformatter" />
        <el-table-column prop="itemName" :label="$t('82e97e47.3fea7c')">
          <template slot-scope="scope">
            <el-button
              v-if="form.item_id != scope.row.itemId"
              type="text"
              @click="chooseItem(scope.row)"
            >
              {{ $t('82e97e47.153fa6') }}
            </el-button>
            <span v-else>{{ $t('82e97e47.f08afd') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="itemsTotalCount > itemsParams.pageSize" class="content-center content-top-padded">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="itemsParams.page"
          :total="itemsTotalCount"
          :page-size="itemsParams.pageSize"
          @current-change="goodsHandleCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('82e97e47.9d2578') }}</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">{{
          $t('82e97e47.aa7527')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import imgPicker from '../../../components/imageselect'
import { addBargins, getBargainsDetail, updateBargains } from '../../../api/promotions'
import util from '../../../common/js/util'
import { getItemsList } from '../../../api/goods'
export default {
  inject: ['refresh'],
  components: {
    imgPicker
  },
  data() {
    var datetimeChecked = (rule, value, callback) => {
      if (this.form.bargains_datetime_begin == '' && this.form.bargains_datetime_end == '') {
        return callback(new Error(this.$t('82e97e47.e6df0e')))
      } else if (this.form.bargains_datetime_begin == '') {
        return callback(new Error(this.$t('82e97e47.af1f65')))
      } else if (this.form.bargains_datetime_end == '') {
        return callback(new Error(this.$t('82e97e47.a1453a')))
      } else {
        callback()
      }
    }
    var priceRangeChecked = (rule, value, callback) => {
      if (this.form.price_min == '' && this.form.price_max == '') {
        return callback(new Error(this.$t('82e97e47.bcecc3')))
      } else if (this.form.price_min == '') {
        return callback(new Error(this.$t('82e97e47.db6ada')))
      } else if (this.form.price_max == '') {
        return callback(new Error(this.$t('82e97e47.2855ad')))
      } else if (this.form.price_max <= this.form.price_min + 1) {
        return callback(new Error(this.$t('82e97e47.530189')))
      } else {
        callback()
      }
    }
    var peopleRangeChecked = (rule, value, callback) => {
      var reg = /[^\d]/
      if (!/^\+?[1-9][0-9]*$/.test(this.form.people_min)) {
        return callback(new Error(this.$t('82e97e47.8c8730')))
      } else if (!/^\+?[1-9][0-9]*$/.test(this.form.people_max)) {
        return callback(new Error(this.$t('82e97e47.efb831')))
      } else if (this.form.people_min < 1) {
        return callback(new Error(this.$t('82e97e47.2cb4a9')))
      } else if (+this.form.people_max <= +this.form.people_min) {
        return callback(new Error(this.$t('82e97e47.1cc35b')))
      } else {
        callback()
      }
    }
    var mktPriceChecked = (rule, value, callback) => {
      var reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/
      if (this.form.mkt_price == '') {
        return callback(new Error(this.$t('82e97e47.2c38c9')))
      } else if (!reg.test(this.form.mkt_price)) {
        callback(new Error(this.$t('82e97e47.319275')))
      } else if (+this.form.mkt_price < +this.form.price) {
        return callback(new Error(this.$t('82e97e47.f686fe')))
      } else {
        callback()
      }
    }
    var priceChecked = (rule, value, callback) => {
      var reg = /^(([1-9]\d*)|0)(\.\d{1,2})?$/
      if (this.form.price == '') {
        return callback(new Error(this.$t('82e97e47.556782')))
      } else if (!reg.test(this.form.price)) {
        callback(new Error(this.$t('82e97e47.e7784c')))
      } else if (+this.form.price > +this.form.mkt_price) {
        return callback(new Error(this.$t('82e97e47.31ac44')))
      } else {
        callback()
      }
    }
    return {
      cursymbol: '￥',
      itemsTotalCount: 0,
      goodsDialogVisible: false,
      goods: {},
      itemsList: [],
      itemsParams: {
        page: 1,
        pageSize: 20,
        item_type: 'normal',
        nospec: true,
        keywords: ''
      },
      itemsLoading: false,
      goodsTypeTitle: '',

      imgDialog: false,
      isGetImage: false,
      picsDialog: false,
      isGetPics: false,
      isPicsAdd: true,
      picsEditIndex: 0,
      productPicDialog: false,
      isGetProductPic: false,
      thumbDialog: false,
      isGetThumb: false,
      form: {
        item_id: '',
        bargain_id: '',
        title: '',
        ad_pic: '',
        help_pics: [],
        bargains_datetime_begin: '',
        bargains_datetime_end: '',
        bargain_rules: '',
        item_name: '',
        item_pics: '',
        mkt_price: '',
        price: '',
        price_min: 0,
        price_max: 0,
        people_min: 0,
        people_max: 0,
        min_price: '',
        limit_num: '',
        item_intro: '',
        share_msg: ''
      },
      rules: {
        title: [{ required: true, message: () => this.$t('82e97e47.7528b3'), trigger: 'blur' }],
        ad_pic: [{ required: true, message: () => this.$t('82e97e47.d3872a'), trigger: 'change' }],
        bargains_datetime: [{ required: true, validator: datetimeChecked, trigger: 'blur' }],
        bargain_rules: [
          { required: true, message: () => this.$t('82e97e47.d0eebd'), trigger: 'blur' }
        ],
        item_name: [{ required: true, message: () => this.$t('82e97e47.448ab9'), trigger: 'blur' }],
        item_pics: [{ required: true, message: () => this.$t('82e97e47.180e73'), trigger: 'blur' }],
        mkt_price: [{ required: true, validator: mktPriceChecked, trigger: 'blur' }],
        price: [{ required: true, validator: priceChecked, trigger: 'blur' }],
        price_range: [{ required: true, validator: priceRangeChecked, trigger: 'blur' }],
        people_range: [{ required: true, validator: peopleRangeChecked, trigger: 'blur' }],
        min_price: [{ required: true, message: () => this.$t('82e97e47.cb30c0'), trigger: 'blur' }],
        limit_num: [
          {
            required: true,
            type: 'number',
            message: () => this.$t('82e97e47.03abcd'),
            trigger: 'blur'
          }
        ],
        item_intro: [
          { required: true, message: () => this.$t('82e97e47.495d38'), trigger: 'blur' }
        ],
        share_msg: [{ required: true, message: () => this.$t('82e97e47.7b4bd5'), trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.goodsTypeTitle = this.$t('82e97e47.ddf672')
    // 编辑助力活动
    if (this.$route.params.bargain_id) {
      // 初始化助力活动详情数据
      getBargainsDetail(this.$route.params.bargain_id)
        .then((response) => {
          let bargainsDetailData = response.data.data
          bargainsDetailData.price = bargainsDetailData.price / 100
          bargainsDetailData.limit_num = +bargainsDetailData.limit_num
          bargainsDetailData.mkt_price = bargainsDetailData.mkt_price / 100
          bargainsDetailData.price_min = bargainsDetailData.bargain_range.min / 100
          bargainsDetailData.price_max = bargainsDetailData.bargain_range.max / 100
          bargainsDetailData.people_min = bargainsDetailData.people_range.min
          bargainsDetailData.people_max = bargainsDetailData.people_range.max
          bargainsDetailData.min_price = bargainsDetailData.min_price / 100
          bargainsDetailData.bargains_datetime_begin = new Date(
            parseInt(bargainsDetailData.begin_time) * 1000
          )
          bargainsDetailData.bargains_datetime_end = new Date(
            parseInt(bargainsDetailData.end_time) * 1000
          )
          this.form = bargainsDetailData
          this.goodsShow(this.form)
        })
        .catch((error) => {
          this.$router.go(-1)
        })
    }
  },
  methods: {
    // 选择商品
    changeItem() {
      this.goodsDialogVisible = true
      this.getGoodsList()
    },
    // 获取商品列表
    goodsHandleCurrentChange(val) {
      this.itemsParams.page = val
      this.getGoodsList()
    },
    goodsSearch() {
      this.getGoodsList()
    },
    getGoodsList() {
      this.itemsLoading = true

      let where = this.itemsParams
      // where.approve_status = ['onsale', 'offline_sale']
      where.approve_status = ['onsale']
      where.is_gift = false
      getItemsList(where)
        .then((response) => {
          this.itemsLoading = false
          this.itemsList = response.data.data.list
          this.itemsTotalCount = response.data.data.total_count
        })
        .catch((error) => {
          this.itemsLoading = false
          this.$message({
            type: 'error',
            message: this.$t('82e97e47.325305')
          })
        })
    },
    changeGoods(type) {
      switch (type) {
        case 'every':
          this.$set(this.itemsParams, 'consume_type', 'every')
          this.$delete(this.itemsParams, 'item_type')
          this.goodsTypeTitle = this.$t('82e97e47.fcd4d7')
          break
        case 'normal':
          this.$set(this.itemsParams, 'item_type', 'normal')
          this.$delete(this.itemsParams, 'consume_type')
          this.goodsTypeTitle = this.$t('82e97e47.ddf672')
          break
      }
      this.getGoodsList()
    },
    // 销售价格
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    // 选择确定商品
    chooseItem(row) {
      console.log('选择的商品', row)
      this.goodsDialogVisible = false
      this.goods = row
      this.goods.price = this.goods.price / 100

      this.form.item_id = row.itemId
      this.form.item_name = row.itemName
      this.form.item_pics = row.pics[0]
      this.form.mkt_price = this.goods.price
      this.form.limit_num = this.goods.store
    },
    // 详情显示选中的商品
    goodsShow(data) {
      let goods = {
        pics: [data.item_pics],
        itemName: data.item_name,
        price: data.mkt_price,
        store: data.limit_num
      }
      this.goodsDialogVisible = false
      this.goods = goods
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
    handlePicsChange() {
      this.picsDialog = true
      this.isGetPics = true
      this.isPicsAdd = true
    },
    pickPics(data) {
      if (this.isPicsAdd) {
        this.form.help_pics.push(data.url)
      } else {
        this.form.help_pics[this.picsEditIndex] = data.url
      }

      this.picsDialog = false
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    handleProductPicChange() {
      this.productPicDialog = true
      this.isGetProductPic = true
    },
    productPic(data) {
      this.form.item_pics = data.url
      this.productPicDialog = false
    },
    closeProductPicDialog() {
      this.productPicDialog = false
    },
    cancel() {
      this.$router.go(-1)
    },
    updateBargainsRule(data) {
      this.form.bargain_rules = data
    },
    updateProductDetail(data) {
      this.form.item_intro = data
    },
    save() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var bargainRange = {
            min: this.form.price_min,
            max: this.form.price_max
          }
          var peopleRange = {
            min: this.form.people_min,
            max: this.form.people_max
          }

          if (this.form.item_id === '') {
            this.$message.error(this.$t('82e97e47.56012f'))
          }

          var params = {
            title: this.form.title,
            ad_pic: this.form.ad_pic,
            item_name: this.form.item_name,
            item_pics: this.form.item_pics,
            item_intro: this.form.item_intro,
            price: this.form.price,
            mkt_price: this.form.mkt_price,
            limit_num: this.form.limit_num,
            bargain_rules: this.form.bargain_rules,
            bargain_range: bargainRange,
            people_range: peopleRange,
            min_price: this.form.min_price,
            begin_time: util.formatDate.format(this.form.bargains_datetime_begin, 'y-M-d h:m:s'),
            end_time: util.formatDate.format(this.form.bargains_datetime_end, 'y-M-d h:m:s'),
            share_msg: this.form.share_msg,
            help_pics: this.form.help_pics,
            item_id: this.form.item_id
          }

          // console.log('请求参数', params)
          // console.log('请求参数1', params.item_id)
          if (this.form.bargain_id) {
            params.bargain_id = this.form.bargain_id
            updateBargains(this.form.bargain_id, params).then((response) => {
              if (response.data.data.bargain_id) {
                this.$message({
                  message: this.$t('82e97e47.55aa63'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              } else {
                this.$message.error(this.$t('82e97e47.edf9fe'))
                return false
              }
            })
          } else {
            addBargins(params).then((response) => {
              if (response.data.data.bargain_id) {
                this.$message({
                  message: this.$t('82e97e47.3fdaea'),
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              } else {
                this.$message.error(this.$t('82e97e47.006ead'))
                return false
              }
            })
          }
        }
      })
    },
    picsEdit(index) {
      this.isPicsAdd = false
      this.picsEditIndex = index
      this.picsDialog = true
      this.isGetPics = true
    },
    picsDelete(index) {
      this.form.help_pics.splice(index, 1)
    },
    addImgPreview() {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb(data) {
      if (data && data.url !== '') {
        this.thumbDialog = false
        var index = this.$refs.editor.$el.id
        var loc = this.$refs.editor
        var img = new Image()
        img.src = this.wximageurl + data.url
        if (loc.range) {
          loc.range.insertNode(img)
        } else {
          loc.$refs.content.appendChild(img)
          loc.focus()
          loc.restoreSelection()
        }
        this.form.item_intro = loc.$refs.content.innerHTML
      }
    },
    closeThumbDialog() {
      this.thumbDialog = false
    }
  }
}
</script>
<style scoped lang="scss">
.groups-addgoods {
  display: flex;
  .groups-goodspic {
    float: left;
    width: 120px;
    height: 120px;
    border: 1px solid #ddd;
  }
  .gooups-goodsmsg {
    float: left;
    max-width: 670px;
    margin-left: 10px;
    margin-top: 15px;
    overflow: hidden;
  }
}
.tab-group {
  margin-bottom: 20px;
  .tab-btn {
    &.on {
      border-color: #e6a23c;
      background-color: #e6a23c;
      color: #fff;
    }
  }
}
.activity-poster {
  .upload-box {
    width: 150px;
    height: 150px;
    img {
      width: 100%;
    }
  }
}
.avatar-uploader-icon {
  font-size: 48px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.pics-list {
  display: inline-block;
  .pics-item {
    position: relative;
    overflow: hidden;
    display: inline-block;
    border-radius: 5px;
    margin-right: 10px;
    .bg-mask {
      position: absolute;
      bottom: -140px;
      width: 140px;
      height: 140px;
      line-height: 140px;
      text-align: center;
      transition: 0.4s;
      background: rgba(0, 0, 0, 0.7);
    }
    .icon {
      color: #999;
      font-size: 26px;
      cursor: pointer;
      margin: 0 3px;
    }
    .icon:hover {
      color: #fff;
    }
    &:hover {
      .bg-mask {
        bottom: 0;
      }
    }
  }
  img {
    width: 140px;
    height: 140px;
    vertical-align: middle;
  }
}
.upload-box {
  display: inline-block;
  width: 150px;
  height: 150px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}
.activity-poster {
  img {
    width: 100%;
  }
}
.tpl_item {
  display: inline-block;
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 5px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 5px;
}
.tpl_item .fa {
  width: 12px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}
.vue-html5-editor {
  vertical-align: top;
  display: inline-block;
}
</style>
<style type="text/css" lang="scss">
.bargain-box {
  .vue-html5-editor {
    width: 50%;
  }
}
</style>
