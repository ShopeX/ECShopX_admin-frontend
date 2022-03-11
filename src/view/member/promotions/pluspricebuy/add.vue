<template>
  <div class="section section-white pluspricebuyAdd">
    <el-form
      ref="form"
      :model="form"
      class="box-set"
      label-width="120px"
    >
      <div class="section-header with-border">
        <div>添加/编辑加价购促销</div>
      </div>
      <div class="form-wrapper clearfix">
        <el-form-item
          label="名称"
          style="margin-top: 20px"
          prop="marketing_name"
          :rules="{ required: true, message: '活动名称必填', trigger: 'blur' }"
        >
          <el-col :span="20">
            <el-input
              v-model="form.marketing_name"
              :maxlength="30"
              placeholder="最多30个字"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="有效期">
          <el-col :span="20">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="生效时间"
              end-placeholder="过期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="绑定商品">
          <el-radio-group
            v-model="form.use_bound"
            @change="itemTypeChange"
          >
            <!-- el-radio label="0">全场可用</el-radio> -->
            <el-radio label="1">
              指定商品可用
            </el-radio>
            <el-radio label="2">
              指定分类适用
            </el-radio>
            <el-radio label="3">
              指定商品标签适用
            </el-radio>
            <el-radio label="4">
              指定品牌适用
            </el-radio>
          </el-radio-group>
          <el-col
            v-if="!zdItemHidden"
            :span="23"
          >
            <!--<el-button type="primary" class="el-icon-plus" @click="relItemsClick" size="mini" round>选商品</el-button>-->
            <SkuSelector
              :data="relItems"
              @change="getItems"
            />
            <div style="position: absolute; bottom: 0px; left: 112px">
              <el-upload
                style="display: inline-block; height: 0"
                action=""
                :on-change="uploadHandleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <el-button type="primary">
                  批量上传
                </el-button>
              </el-upload>
              <el-button
                style="margin-left: 10px"
                type="primary"
                @click="uploadHandleTemplate()"
              >
                下载模板
              </el-button>
            </div>
          </el-col>
          <el-col
            :xs="12"
            :sm="12"
            :md="24"
          >
            <div v-if="!categoryHidden">
              <treeselect
                v-model="form.item_category"
                style="width: 500px"
                :options="categoryList"
                :show-count="true"
                :multiple="true"
                :disable-branch-nodes="true"
                :clearable="false"
                @open="categoryOpen"
                @select="categorySelect"
                @deselect="categoryDeselect"
              />
            </div>
          </el-col>
          <template v-if="!tagHidden">
            <div class="selected-tags view-flex">
              <div class="label">
                已选中标签：
              </div>
              <div class="view-flex-item">
                <el-tag
                  v-for="(tag, index) in tag.currentTags"
                  :key="index"
                  closable
                  size="small"
                  :disable-transitions="false"
                  @close="tagRemove(index)"
                >
                  {{ tag.tag_name }}
                </el-tag>
              </div>
            </div>
            <div>
              <el-tag
                v-for="(tag, index) in tag.tags"
                :key="index"
                class="tag-item"
                size="medium"
                color="#ffffff"
                :disable-transitions="false"
                @click.native="tagAdd(tag, index)"
              >
                {{ tag.tag_name }}
              </el-tag>
            </div>
          </template>
          <template v-if="!brandHidden">
            <div class="selected-tags view-flex">
              <div class="label">
                已选中品牌：
              </div>
              <div class="view-flex-item">
                <el-tag
                  v-for="(brand, index) in brand.currentBrands"
                  :key="index"
                  closable
                  size="small"
                  :disable-transitions="false"
                  @close="brandRemove(index)"
                >
                  {{ brand.attribute_name }}
                </el-tag>
              </div>
            </div>
            <div>
              <el-tag
                v-for="(brand, index) in brand.brands"
                :key="index"
                class="tag-item"
                size="medium"
                color="#ffffff"
                :disable-transitions="false"
                @click.native="brandAdd(brand, index)"
              >
                {{ brand.attribute_name }}
              </el-tag>
            </div>
          </template>
          <!--<el-col :span="23" v-if="form.use_bound == 1">-->
          <!--<el-table v-if="relItems.length>0" :data="relItems" style="line-height: normal">-->
          <!--<el-table-column label="ID" prop="item_id" width="60"></el-table-column>-->
          <!--<el-table-column label="名称" prop="item_name"></el-table-column>-->
          <!--<el-table-column label="价格" prop="price" width="100">-->
          <!--<template slot-scope="scope">-->
          <!--{{scope.row.price/100}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="库存" prop="store" width="90"></el-table-column>-->
          <!--<el-table-column label="操作" width="50">-->
          <!--<template slot-scope="scope">-->
          <!--<i class="iconfont icon-trash-alt" @click="deleteItemRow(scope.$index, form.items)"></i>-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--</el-table>-->
          <!--</el-col>-->
        </el-form-item>
        <el-form-item label="指定店铺">
          <el-radio
            v-model="form.use_shop"
            :label="0"
          >
            全场可用
          </el-radio>
          <el-radio
            v-model="form.use_shop"
            :label="1"
          >
            指定店铺可用
          </el-radio>
          <el-col
            v-if="form.use_shop == 1"
            :span="23"
          >
            <el-button
              type="primary"
              class="el-icon-plus"
              size="mini"
              round
              @click="relStoresClick"
            >
              选店铺
            </el-button>
            <el-table
              v-if="relStores.length > 0"
              :data="relStores"
              style="line-height: normal"
            >
              <el-table-column
                label="ID"
                prop="distributor_id"
                width="60"
              />
              <el-table-column
                label="名称"
                prop="name"
              />
              <el-table-column
                prop="address"
                label="地址"
                show-overflow-tooltip
              />
              <el-table-column
                label="操作"
                width="50"
              >
                <template slot-scope="scope">
                  <i
                    class="iconfont icon-trash-alt"
                    @click="deleteStoreRow(scope.$index, form.items)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-form-item>
        <el-form-item label="促销规则">
          <el-row :gutter="1">
            <el-col :span="7">
              <el-radio
                v-model="form.condition_type"
                label="quantity"
              >
                按订单总件数
              </el-radio>
              <el-radio
                v-model="form.condition_type"
                label="totalfee"
              >
                按订单总金额
              </el-radio>
            </el-col>
            <el-col :span="6">
              <span
                v-for="(item, key) in conditionValue"
                v-if="form.condition_type == 'totalfee'"
                :key="key"
              >消费满
                <el-input
                  v-model="item.full"
                  type="input"
                  placeholder="0.00"
                  style="width: 100px"
                  size="mini"
                />
                元，加价购</span>
              <span
                v-for="(item, key) in conditionValue"
                v-if="form.condition_type == 'quantity'"
                :key="key"
              >消费满
                <el-input
                  v-model="item.full"
                  type="input"
                  placeholder="0"
                  style="width: 100px"
                  size="mini"
                />
                件，加价购</span>
            </el-col>
          </el-row>
          <div>
            <!-- <el-button type="primary" @click="addRules()" size="mini">新增加价区间</el-button> -->
            <div
              v-for="(item, key) in purchaseRules"
              :key="key"
            >
              <el-row>
                <el-col :span="5">
                  加价购金额：<el-input
                    v-model="item.price"
                    style="width: 100px"
                    size="mini"
                  />
                </el-col>
                <el-col :span="15">
                  <el-button
                    type="primary"
                    class="el-icon-plus"
                    size="mini"
                    round
                    @click="relGiftsClick(key, item.gift_item)"
                  >
                    选商品
                  </el-button>
                  <el-table
                    :data="item.gift_item"
                    style="line-height: normal"
                    width="20%"
                  >
                    <el-table-column
                      label="ID"
                      prop="item_id"
                      width="60"
                    />
                    <el-table-column
                      label="名称"
                      prop="item_name"
                    />
                    <!-- <el-table-column label="赠品数量" width="100">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.gift_num" width="90" size="mini"></el-input>
                        </template>
                      </el-table-column> -->
                    <el-table-column
                      label="操作"
                      width="100"
                    >
                      <template slot-scope="scope">
                        <i
                          class="iconfont icon-trash-alt"
                          @click="deleteGiftRow(key, scope.$index)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-if="key > 0"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="delRules(key)"
                  />
                </el-col>
              </el-row>
              <div />
            </div>
          </div>
        </el-form-item>

        <el-form-item
          label="导航栏颜色"
          style="flex: 2"
        >
          <el-color-picker v-model="form.navbar_color" />
        </el-form-item>

        <el-form-item
          label="倒计时背景色"
          style="flex: 2"
        >
          <el-color-picker v-model="form.timeBackgroundColor" />
        </el-form-item>

        <el-form-item
          label="活动背景图"
          prop="activity_background"
        >
          <p class="frm-tips">
            点击图片可更换，图片大小不能超过 2MB
          </p>
          <div>
            <div
              class="upload-box"
              @click="handleImgChange"
            >
              <img
                v-if="form.activity_background"
                :src="wximageurl + form.activity_background"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </div>
          </div>
          <imgPicker
            :dialog-visible="imgDialog"
            :sc-status="isGetImage"
            @chooseImg="pickImg"
            @closeImgDialog="closeImgDialog"
          />
        </el-form-item>

        <el-form-item label="规则描述">
          <el-col :span="20">
            <el-input
              v-model="form.marketing_desc"
              type="textarea"
              :rows="3"
              placeholder="规则描述"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="可参与次数">
          <el-col :span="20">
            <el-input
              v-model="form.join_limit"
              type="input"
              placeholder="整数数字"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="适用会员">
          <el-checkbox-group v-model="validGrade">
            <el-checkbox
              v-for="grade in memberGrade"
              :key="grade.grade_id"
              :label="grade.grade_id"
            >
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.vip_grade_id"
              :label="vipdata.lv_type"
            >
              付费{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="适用平台">
            <el-radio-group v-model="form.used_platform">
              <el-radio :label="0">全场可用</el-radio>
              <el-radio :label="1">只用于pc端</el-radio>
              <el-radio :label="2">只用于小程序端</el-radio>
              <el-radio :label="3">只用于h5端</el-radio>
            </el-radio-group>
          </el-form-item> -->
        <el-form-item label=" ">
          <el-button
            type="primary"
            @click="submitActivityAction()"
          >
            保存
          </el-button>
          <el-button @click.native="handleCancel">
            返回
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <!--<GoodsSelect :items-visible="itemVisible" :get-status="setItemStatus" :rel-items-ids="relItems" :item-type="form.item_type" @chooseStore="chooseItemsAction" @closeStoreDialog="closeItemDialogAction"></GoodsSelect>-->
    <GoodsSelect
      :items-visible="giftVisible"
      :get-status="setGiftStatus"
      :get-params="getParams"
      :rel-items-ids="relGiftIds"
      is-spec
      :item-type="form.item_type"
      @chooseStore="chooseGiftsAction"
      @closeStoreDialog="closeGiftsDialogAction"
    />
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-shop-ids="relStores"
      :get-status="setStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import imgPicker from '../../../../components/imageselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  addMarketingActivity,
  updateMarketingActivity,
  getMarketingActivityInfo,
  seckillActivityGetItemsList
} from '../../../../api/promotions'
import { getGradeList } from '../../../../api/membercard'
import { listVipGrade } from '../../../../api/cardticket'
import { getDefaultCurrency } from '../../../../api/company'
import StoreSelect from '@/components/storeListSelect'
import GoodsSelect from '@/components/goodsSelect'
import SkuSelector from '@/components/function/skuSelector'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../../api/common'
export default {
  inject: ['refresh'],
  components: {
    GoodsSelect,
    StoreSelect,
    SkuSelector,
    imgPicker,
    Treeselect
  },
  data () {
    return {
      cursymbol: '￥',
      storeVisible: false,
      relItems: [],
      relStores: [],
      setStatus: false,
      form: {
        marketing_id: '',
        marketing_type: 'plus_price_buy',
        marketing_name: '',
        marketing_desc: '',
        start_time: '',
        end_time: '',
        used_platform: 0,
        use_bound: '1',
        use_shop: 0,
        shop_ids: [],
        item_ids: [],
        item_type: 'normal',
        valid_grade: [],
        condition_type: 'totalfee',
        condition_value: [],
        join_limit: 0,
        promotion_tag: '加价购',
        canjoin_repeat: false,
        item_category: [],
        tag_ids: [],
        brand_ids: [],
        activity_background: '',
        navbar_color: '',
        timeBackgroundColor: ''
      },
      vipGrade: [],
      memberGrade: [],
      validGrade: [],
      activity_date: '',
      selectItemType: 'normal',
      itemVisible: false,
      setItemStatus: false,
      imgDialog: false,
      isGetImage: false,
      isIndeterminate: true,
      checkAll: false,
      relGifts: [],
      relGiftIds: [],
      giftVisible: false,
      purchaseRules: [{ price: '', gift_item: [] }],
      conditionValue: [{ full: '' }],
      setGiftStatus: false,
      ruleKey: 0,
      getParams: {
        price: 0
      },
      zdItemHidden: false,
      categoryHidden: true,
      categoryList: [],
      tagHidden: true,
      tag: {
        list: [],
        form: {
          tag_ids: []
        },
        currentTags: [],
        tags: []
      },
      brandHidden: true,
      brand: {
        list: [],
        form: {
          brand_ids: []
        },
        currentBrands: [],
        brands: []
      },
      ItemsList: [],
      invalidItemsList: [],
      params: {
        page: 1,
        pageSize: -1,
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        category: 0,
        is_warning: false,
        tag_id: '',
        is_gift: 'false',
        type: 0,
        is_sku: 'true',
        item_id: ''
      }
    }
  },
  watch: {
    relItems (val) {
      //this.form.use_shop = val.length > 0 ? 1 : 0
    },
    relStores (val) {
      //this.form.use_bound = val.length > 0 ? 1 : 0
    }
  },
  mounted () {
    this.fetchMainCate()
    this.getAllTagLists()
    this.getBrandList('', true)

    if (this.$route.params.marketing_id) {
      this.getActivityDetail(this.$route.params.marketing_id)
    }

    listVipGrade().then((response) => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        this.vipGrade = response.data.data
      }
    })

    getGradeList().then((response) => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        var result = response.data.data
        if (result) {
          this.memberGrade = result
        }
      }
    })
  },
  methods: {
    addRules () {
      var rule = { price: '', gift_item: [] }
      this.purchaseRules.push(rule)
    },
    delRules (index) {
      this.purchaseRules.splice(index, 1)
    },
    relItemsClick () {
      this.itemVisible = true
      this.setItemStatus = true
    },
    getItems (data) {
      let ids = []
      data.forEach((item) => {
        ids.push(item.itemId)
      })
      this.form.item_ids = ids
    },
    closeItemDialogAction () {
      this.itemVisible = false
    },
    deleteItemRow: function (index) {
      this.setItemStatus = false
      this.relItems.splice(index, 1)
    },
    relStoresClick () {
      this.storeVisible = true
      this.setStatus = true
    },
    chooseStoreAction (data) {
      this.storeVisible = false
      this.form.shop_ids = []
      if (data === null || data.length <= 0) return
      this.relStores = data
    },
    closeStoreDialogAction () {
      this.storeVisible = false
    },
    deleteStoreRow (index) {
      this.setStatus = false
      this.relStores.splice(index, 1)
    },
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.activity_background = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    submitActivityAction () {
      const that = this
      if (this.activity_date.length > 0) {
        this.form.start_time = this.activity_date[0]
        this.form.end_time = this.activity_date[1]
      }

      if (this.conditionValue.length > 0) {
        this.conditionValue.forEach((rule) => {
          if (rule.full == 0 || !rule.full) {
            this.$message.error('加价购条件必填!')
            return
          }
        })
        // this.form.condition_value = JSON.stringify(this.conditionValue)
      }
      if (this.validGrade.length > 0) {
        this.form.valid_grade = this.validGrade
      }

      this.form.shop_ids = []
      if (this.relStores && this.relStores.length > 0) {
        this.relStores.forEach((item) => {
          this.form.shop_ids.push(item.distributor_id)
        })
      }

      if (this.form.item_ids && this.form.item_ids.length <= 0) {
        this.$message.error('参加活动的商品必填!')
        return false
      }

      if (this.purchaseRules.length > 0) {
        let giftData = []
        let itemdata = {}
        let conditionValue = []
        this.purchaseRules.forEach((rule) => {
          if (rule.price > 0 && rule.gift_item.length == 0) {
            this.$message.error('加价购商品至少选一件!')
            return
          }
          rule.gift_item.forEach((item) => {
            itemdata = {
              item_id: item.itemId,
              item_name: item.itemName,
              item_type: item.item_type,
              price: rule.price,
              gift_num: item.gift_num,
              pics: item.pics,
              filter_ful: this.conditionValue[0].full
            }
            giftData.push(itemdata)
          })
          conditionValue.push({ full: this.conditionValue[0].full, price: rule.price })
        })
        this.form.gifts = JSON.stringify(giftData)
        this.form.condition_value = JSON.stringify(conditionValue)
      }
      if (this.form.marketing_id) {
        updateMarketingActivity(this.form).then((res) => {
          if (res.data.data.marketing_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      } else {
        addMarketingActivity(this.form).then((res) => {
          if (res.data.data.marketing_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      }
    },
    getActivityDetail (id) {
      getMarketingActivityInfo({ marketing_id: id }).then((res) => {
        let response = res.data.data
        let data = {
          marketing_type: 'plus_price_buy',
          promotion_tag: '加价购',
          marketing_id: response.marketing_id,
          marketing_name: response.marketing_name,
          marketing_desc: response.marketing_desc,
          activity_background: response.activity_background,
          timeBackgroundColor: response.timeBackgroundColor,
          navbar_color: response.navbar_color,
          start_time: response.start_time,
          end_time: response.end_time,
          used_platform: response.used_platform,
          use_bound: response.use_bound.toString(),
          use_shop: response.use_shop,
          valid_grade: response.valid_grade,
          condition_type: response.condition_type,
          join_limit: response.join_limit,
          item_type: response.item_type,
          canjoin_repeat: response.canjoin_repeat,
          item_category: response.item_category,
          tag_ids: response.tag_ids,
          tag_list: response.tag_list,
          brand_ids: response.brand_ids,
          brand_list: response.brand_list,
          rel_brand_ids: response.rel_brand_ids,
          rel_category_ids: response.rel_category_ids,
          rel_tag_ids: response.rel_tag_ids
        }
        Object.assign(this.form, data)
        this.conditionValue = response.condition_value
        this.validGrade = response.valid_grade
        this.activity_date = [response.start_time, response.end_time]
        this.relItems = response.itemTreeLists ? response.itemTreeLists : []
        this.relStores = response.storeLists ? response.storeLists : []
        this.purchaseRules = response.giftsItemLists ? response.giftsItemLists : []
        this.zdItemHidden = true
        this.categoryHidden = true
        this.tagHidden = true
        this.brandHidden = true
        if (response.use_bound == 1) {
          this.zdItemHidden = false
        }

        if (response.use_bound == 2) {
          this.categoryHidden = false
          this.generateSku()
        }

        if (response.use_bound == 3) {
          this.tagHidden = false
          this.tag.currentTags = response.tag_list || []
          this.showTags()
          this.generateSku()
        }

        if (response.use_bound == 4) {
          this.brandHidden = false
          this.brand.currentBrands = response.brand_list || []
          this.showBrands()
          this.generateSku()
        }
      })
    },
    handleCancel: function () {
      this.$router.back(-1)
    },
    relGiftsClick (index, itemArr) {
      if (!this.purchaseRules[index].price) {
        this.$message.error('加价金额必填!')
        return false
      }
      this.getParams.price = this.purchaseRules[index].price
      this.ruleKey = index
      this.relGiftIds = itemArr
      this.giftVisible = true
      this.setGiftStatus = true
    },
    chooseGiftsAction (data) {
      this.giftVisible = false
      if (data === null || data.length <= 0) return

      let arr = []
      data.forEach((item, index) => {
        item.gift_num = 1
      })
      let key = this.ruleKey
      this.purchaseRules[key].gift_item = data
    },
    closeGiftsDialogAction () {
      this.giftVisible = false
    },
    deleteGiftRow: function (key, index) {
      this.setGiftStatus = false
      this.purchaseRules[key].gift_item.splice(index, 1)
    },
    itemTypeChange: function (val) {
      this.relItems = []
      this.params.main_cat_id = ''
      this.params.tag_id = ''
      this.params.brand_id = ''
      this.zdItemHidden = true
      this.categoryHidden = true
      this.tagHidden = true
      this.brandHidden = true
      this.form.items = []
      this.invalidItemsList = []
      this.form.item_ids = []
      this.form.itemTreeLists = []
      this.form.item_category = []
      this.form.item_category = []
      this.form.tag_ids = []
      this.form.brand_ids = []
      this.tag.currentTags = []
      if (val === '0') {
        this.form.item_ids = []
        this.form.itemTreeLists = []
        this.form.item_category = []
      } else if (val === '1') {
        this.zdItemHidden = false
      } else if (val === '2') {
        this.form.item_ids = []
        this.form.itemTreeLists = []
        this.categoryHidden = false
        this.form.item_category = []
      } else if (val === '3') {
        this.tagHidden = false
        this.tag.currentTags = []
        this.showTags()
      } else if (val === '4') {
        this.brandHidden = false
        this.brand.currentBrands = []
        this.showBrands()
      }
    },
    fetchMainCate: function () {
      getCategory({ is_main_category: true, ignore_none: true }).then((response) => {
        this.categoryList = response.data.data
      })
    },
    addItemTag: function () {
      this.tag.currentTags = []
      if (this.item_id.length) {
        this.showTags()
        this.tag.form.item_ids = this.item_id
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品!'
        })
      }
    },
    showTags: function () {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
    },
    tagRemove: function (index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      let tagItems = []
      let tagInvalidItems = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
        let items = []

        this.ItemsList.forEach((i) => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) items.push(i)
        })
        tagItems = items

        let invalidItems = []
        this.invalidItemsList.forEach((i) => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) invalidItems.push(i)
        })
        tagInvalidItems = invalidItems
      })
      this.ItemsList = tagItems
      this.invalidItemsList = tagInvalidItems
      this.getItems(this.ItemsList)
    },
    tagAdd: function (item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
      })
      this.params.tag_id = item.tag_id
      this.getGoodsList()
    },
    getAllTagLists: function () {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
    },
    // 获取品牌列表
    getBrandList: function (searchVal = '', isInit = false) {
      const list = []
      getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal,
        attribute_ids: isInit ? this.form.brand_id : ''
      }).then((res) => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brand.list = list
      })
    },
    showBrands: function () {
      this.brand.brands = [...this.brand.list]
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
        if (isInArr != -1) this.brand.brands.splice(index, 1)
      })
    },
    brandAdd: function (item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
      this.params.brand_id = item.attribute_id
      this.getGoodsList()
    },
    brandRemove: function (index) {
      let items = []
      this.ItemsList.forEach((item) => {
        if (this.brand.currentBrands[index].attribute_id != item.brand_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach((i) => {
        if (this.brand.currentBrands[index].attribute_id != i.brand_id) invalidItems.push(i)
      })

      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)

      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
    },
    getGoodsList: function () {
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.$route.params.marketing_id) {
        params.activity_id = this.$route.params.marketing_id
      }
      params.marketing_type = this.form.marketing_type
      params.activity_release_time = params.activity_start_time = this.activity_date[0]
      params.activity_end_time = this.activity_date[1]
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      seckillActivityGetItemsList(params).then((response) => {
        let itemList = response.data.data.list.validItems.concat(this.ItemsList)
        let invalidItemList = response.data.data.list.invalidItems.concat(this.invalidItemsList)
        let newItemList = []
        let invalidItems = []
        let obj = {}
        let obj1 = {}
        itemList.forEach((item) => {
          let tag_ids = []
          item.tagList.forEach((tag) => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj[item.item_id]) {
            newItemList.push(item)
            obj[item.item_id] = true
          }
        })
        invalidItemList.forEach((item) => {
          let tag_ids = []
          item.tagList.forEach((tag) => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj1[item.item_id]) {
            invalidItems.push(item)
            obj1[item.item_id] = true
          }
        })

        this.ItemsList = newItemList
        this.invalidItemsList = invalidItems
        this.getItems(this.ItemsList)
      })
    },
    categoryOpen () {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return
      }
    },
    categorySelect: function (node, instanceId) {
      this.params.main_cat_id = node.category_id
      this.getGoodsList()
    },
    categoryDeselect: function (node, instanceId) {
      let items
      items = []
      this.ItemsList.forEach((item, index) => {
        if (node.category_id != item.item_main_cat_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach((i) => {
        if (node.category_id != i.item_main_cat_id) invalidItems.push(i)
      })

      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)
    },
    generateSku () {
      let noSkuItem
      noSkuItem = []
      let response = []
      let goodsList = JSON.parse(JSON.stringify(this.relItems))
      goodsList.forEach((item) => {
        if (!item.nospec && item.spec_items.length === 0) {
          noSkuItem.push(item.default_item_id)
        }
      })
      if (noSkuItem.length > 0) {
        let param = this.params
        param.item_id = noSkuItem
        getItemsList(this.params).then((res) => {
          goodsList.forEach((item) => {
            if (!item.nospec) {
              res.data.data.list.forEach((sku) => {
                if (item.item_id === sku.default_item_id) {
                  item.spec_items.push(sku)
                }
              })
            }
          })
          goodsList.forEach((item) => {
            if (!item.nospec) {
              response = [...response, ...item.spec_items]
            } else {
              response = [...response, item]
            }
          })
          this.ItemsList = response
          this.getItems(response)
        })
      } else {
        goodsList.forEach((item) => {
          if (!item.nospec) {
            response = [...response, ...item.spec_items]
          } else {
            response = [...response, item]
          }
        })
        this.ItemsList = response
        this.getItems(response)
      }
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate () {
      let params = { file_type: 'marketing_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    /**
     * 上传模板
     * */
    uploadHandleChange (file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `以下商品编号不存在：${str}`,
              type: 'error',
              duration: 100000
            })
          }, 1500)
        }
        if (data.succ.length <= 0) return
        this.relItems = data.succ
        let list = []
        data.succ.forEach((item) => {
          if (!item.nospec) {
            list.push(Object.assign(item, { spec_items: [] }))
          } else {
            list.push(item)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss">
.pluspricebuyAdd {
  .upload-box {
    width: 300px;
    .avatar {
      // width: 300px;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
