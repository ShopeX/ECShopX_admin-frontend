<template>
  <el-form ref="form" :model="form" class="box-set page-limitedtimesale" label-width="120px">
    <!-- <el-card header="绑定店铺" shadow="naver" v-if="!is_distributor">
      <div :span="23">
        <el-button type="primary" @click="relStoresClick">选择店铺</el-button>
        <el-table v-if="relStores.length > 0" :data="relStores" style="line-height: normal">
          <el-table-column label="ID" prop="distributor_id" width="60"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <i
                class="iconfont icon-trash-alt"
                @click="deleteStoreRow(scope.$index, form.items)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card> -->
    <el-card header="基础信息" shadow="naver">
      <el-form-item label="活动封面">
        <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：400px * 450px）</div>
        <div>
          <imgBox :img-url="wximageurl + form.ad_pic" inline @click="handleImgChange" />
        </div>
        <imgPicker
          :dialog-visible="imgDialog"
          :sc-status="isGetImage"
          @chooseImg="pickImg"
          @closeImgDialog="closeImgDialog"
        />
      </el-form-item>
      <el-form-item
        label="活动名称"
        prop="activity_name"
        :rules="{ required: true, message: '活动名称必填', trigger: 'blur' }"
      >
        <el-col :span="20">
          <el-input v-model="form.activity_name" :maxlength="30" placeholder="活动名称" />
        </el-col>
      </el-form-item>
      <el-form-item label="活动时间">
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
      <el-form-item label="活动描述">
        <el-col :span="20">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="" />
        </el-col>
      </el-form-item>
      <el-form-item label="每人累计限额" prop="limit_total_money" :rules="rules.limit_total_money">
        <el-col :span="20">
          <el-input v-model="form.limit_total_money" :maxlength="30" placeholder="每人累计限额" />
        </el-col>
      </el-form-item>
      <el-form-item label="单笔最少限额" prop="limit_money" :rules="rules.limit_money">
        <el-col :span="20">
          <el-input v-model="form.limit_money" :maxlength="30" placeholder="每人单笔最少购买金额" />
        </el-col>
      </el-form-item>
      <!--el-form-item label="是否包邮">
              <el-col :span="20">
                <el-radio v-model="form.is_free_shipping" label="true">包邮</el-radio>
                <el-radio v-model="form.is_free_shipping" label="false">商品自身运费模板</el-radio>
              </el-col>
            </el-form-item-->
      <!--el-form-item label="订单取消" prop="validity_period">
              <el-row :gutter="10">
                <el-col :span="4">
                  <el-input v-model="form.validity_period" placeholder="15" width="10">
                    <template type="text" slot="prepend">下单</template>
                  </el-input>
                </el-col>
                <div class="sub-title">分钟后未支付的订单，将自动取消</div>
              </el-row>
            </el-form-item-->
    </el-card>
    <el-card header="绑定商品" shadow="naver">
      <el-form-item label="适用商品">
        <el-radio-group v-model="form.use_bound" @change="itemTypeChange">
          <el-radio label="goods"> 指定商品适用 </el-radio>
          <!-- <el-radio label="category">指定分类适用</el-radio>
                    <el-radio label="tag">指定商品标签适用</el-radio>
                    <el-radio label="brand">指定品牌适用</el-radio> -->
        </el-radio-group>
      </el-form-item>
      <div v-if="!zdItemHidden" style="position: relative">
        <SkuSelector :data="relItems" @change="getItems" />
        <div style="position: absolute; bottom: 0px; left: 112px">
          <el-upload
            style="display: inline-block; height: 0"
            action=""
            :on-change="uploadHandleChange"
            :auto-upload="false"
            :show-file-list="false"
          >
            <el-button type="primary"> 批量上传 </el-button>
          </el-upload>
          <el-button style="margin-left: 10px" type="primary" @click="uploadHandleTemplate()">
            下载模板
          </el-button>
        </div>
      </div>
      <el-col :xs="12" :sm="12" :md="12">
        <div v-if="!categoryHidden" style="height: 350px">
          <treeselect
            v-model="form.item_category"
            :options="categoryList"
            :show-count="true"
            :multiple="true"
            :disable-branch-nodes="true"
            :clearable="false"
            @select="categorySelect"
            @deselect="categoryDeselect"
          />
        </div>
      </el-col>
      <template v-if="!tagHidden">
        <div class="selected-tags view-flex">
          <div class="label">已选中标签：</div>
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
          <div class="label">已选中品牌：</div>
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
    </el-card>
    <el-card header="设置商品" shadow="naver">
      <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
        <el-table-column label="ID" prop="item_id" width="60" />
        <el-table-column label="名称" prop="item_title" />
        <el-table-column label="规格" prop="item_spec_desc" />
        <el-table-column label="活动价" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.activity_price"
              min="0.01"
              size="mini"
              onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
            >
              <i slot="prefix" class="el-input__icon">{{ cursymbol }}</i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="每人限购" width="80">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.limit_num"
              size="mini"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" width="80">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.sort"
              size="mini"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <i class="iconfont icon-trash-alt" @click="deleteItemRow(scope.$index, form.items)"></i>
                  </template>
                </el-table-column> -->
      </el-table>
    </el-card>
    <!-- <el-card
      header="无效商品（已参加其他活动）"
      shadow="naver"
    >
      <el-table
        v-if="invalidItemsList.length > 0"
        :data="invalidItemsList"
        style="line-height: normal"
      >
        <el-table-column
          label="ID"
          prop="item_id"
          width="60"
        />
        <el-table-column
          label="名称"
          prop="itemName"
        />
        <el-table-column
          label="规格"
          prop="item_spec_desc"
        />
        <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <i class="iconfont icon-trash-alt" @click="deleteItemRow(scope.$index, form.items)"></i>
                  </template>
                </el-table-column>
      </el-table>
    </el-card> -->
    <StoreSelect
      :store-visible="storeVisible"
      :is-valid="true"
      :rel-data-ids="relStores"
      :get-status="setStatus"
      @chooseStore="chooseStoreAction"
      @closeStoreDialog="closeStoreDialogAction"
    />
    <div class="content-center">
      <el-button @click.native="handleCancel"> 返回 </el-button>
      <el-button
        v-if="form.status !== 'it_has_ended'"
        type="primary"
        @click="submitActivityAction()"
      >
        保存
      </el-button>
    </div>
  </el-form>
</template>
<script>
import Treeselect from '@riophae/vue-treeselect'
import {
  seckillActivityCreate,
  seckillActivityGetInfo,
  seckillActivityUpdate,
  seckillActivityGetItemsList
} from '../../../../api/promotions'
import { getDefaultCurrency } from '../../../../api/company'
import SkuSelector from '@/components/function/skuSelector'
import StoreSelect from '@/components/function/distributorSelect'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'
import store from '@/store'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../../api/common'

export default {
  inject: ['refresh'],
  components: {
    StoreSelect,
    SkuSelector,
    imgPicker,
    imgBox,
    Treeselect
  },
  data() {
    return {
      is_distributor: false,
      cursymbol: '￥',
      goodsVisible: false,
      community: '1',
      communityList: [],
      communitycount: 0,
      goods: [],
      relItems: [],
      addedItems: [],
      communityParams: {
        page: 1,
        pageSize: 10,
        status: 'open'
      },
      form: {
        seckill_id: '',
        activity_name: '',
        description: '',
        activity_start_time: '',
        activity_end_time: '',
        activity_release_time: '',
        validity_period: 15,
        is_free_shipping: 'false',
        is_activity_rebate: 'false',
        distributor_id: [],
        items: [],
        ad_pic: '',
        seckill_type: 'limited_time_sale',
        item_type: 'normal',
        limit_total_money: '',
        limit_money: '',
        use_bound: 'goods',
        item_category: [],
        tag_ids: [],
        brand_ids: []
      },
      activity_date: '',
      relItemsIds: [],
      selectItemType: 'normal',
      itemVisible: false,
      setItemStatus: false,
      imgDialog: false,
      isGetImage: false,
      storeVisible: false,
      setStatus: false,
      relStores: [],
      rules: {
        limit_total_money: [
          { pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入一个正确格式的金额' }
        ],
        limit_money: [{ pattern: /^[0-9]+(.[0-9]{1,2})?$/, message: '请输入一个正确格式的金额' }]
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
        is_gift: 'all',
        type: 0,
        is_sku: 'true',
        item_id: ''
      }
    }
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    if (this.$route.params.seckill_id) {
      this.getActivityDetail(this.$route.params.seckill_id)
    }
    this.fetchMainCate()
    this.getAllTagLists()
    this.getBrandList('', true)
  },
  methods: {
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      this.form.shop_ids = []
      if (data === null || data.length <= 0) return
      this.relStores = data
    },
    deleteStoreRow(index) {
      this.setStatus = false
      this.relStores.splice(index, 1)
    },
    relStoresClick() {
      this.storeVisible = true
      this.setStatus = true
    },
    getItems(data) {
      let arr = []
      data.forEach((item, index) => {
        let newData = ''
        let isInArr = this.addedItems.findIndex(n => n.item_id == item.itemId)
        if (isInArr == -1) {
          newData = {
            item_id: item.itemId,
            item_title: item.itemName,
            activity_store: item.store,
            activity_price: item.price / 100,
            item_spec_desc: item.item_spec_desc,
            sort: item.sort,
            limit_num: item.limit_num || 0,
            item_type: item.item_type
          }
        } else {
          newData = this.addedItems[isInArr]
        }
        if (newData) {
          arr.push(newData)
        }
      })
      this.form.items = arr
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
    communityChange(val) {
      if (val == 1) {
        this.form.community = []
      }
    },
    deleteItemRow: function (index, rows) {
      rows.splice(index, 1)
      this.form.items = rows
      this.setItemStatus = false
      this.relItemsIds.splice(index, 1)
    },
    submitActivityAction() {
      const that = this
      if (this.form.limit_total_money) {
        this.form.limit_total_money = this.form.limit_total_money
      }
      if (this.form.limit_money) {
        this.form.limit_money = this.form.limit_money
      }
      if (this.activity_date.length > 0) {
        this.form.activity_release_time = this.form.activity_start_time = this.activity_date[0]
        this.form.activity_end_time = this.activity_date[1]
      }
      if (this.relStores) {
        this.form.distributor_id = []
        this.relStores.forEach(item => {
          this.form.distributor_id.push(item.distributor_id)
        })
      }
      let params = JSON.stringify(this.form)
      params = JSON.parse(params)
      params.items = JSON.stringify(params.items)
      params.item_category = JSON.stringify(params.item_category)
      if (this.form.seckill_id) {
        seckillActivityUpdate(params).then(res => {
          if (res.data.data.seckill_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose() {
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
        seckillActivityCreate(params).then(res => {
          if (res.data.data.seckill_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose() {
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
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getActivityDetail(id) {
      seckillActivityGetInfo({ seckill_id: id }).then(res => {
        let response = res.data.data
        let data = {
          seckill_id: response.seckill_id,
          activity_name: response.activity_name,
          limit_money: response.limit_money / 100,
          limit_total_money: response.limit_total_money / 100,
          description: response.description,
          activity_start_time: response.activity_start_time,
          activity_end_time: response.activity_end_time,
          validity_period: response.validity_period,
          is_free_shipping: response.is_free_shipping,
          is_activity_rebate: response.is_activity_rebate,
          seckill_type: response.seckill_type,
          distributor_id: response.distributor_id,
          status: response.status,
          items: '',
          ad_pic: response.ad_pic,
          item_type: response.item_type,
          use_bound: response.use_bound,
          item_category: response.item_category,
          tag_ids: response.tag_ids,
          tag_list: response.tag_list,
          brand_ids: response.brand_ids,
          brand_list: response.brand_list,
          rel_brand_ids: response.rel_brand_ids,
          rel_category_ids: response.rel_category_ids,
          rel_tag_ids: response.rel_tag_ids
        }
        if (response.distributor_info) {
          this.relStores = response.distributor_info
        }
        Object.assign(this.form, data)
        response.items.forEach(item => {
          item.itemId = item.item_id
        })
        this.addedItems = response.items
        this.activity_date = [response.activity_start_date, response.activity_end_date]
        this.relItems = response.itemTreeLists || []
        this.zdItemHidden = true
        this.categoryHidden = true
        this.tagHidden = true
        this.brandHidden = true
        if (this.form.use_bound == 1) {
          this.form.use_bound = 'goods'
          this.zdItemHidden = false
        }
        if (this.form.use_bound == 2) {
          this.form.use_bound = 'category'
          this.categoryHidden = false
          this.generateSku()
        }
        if (this.form.use_bound == 3) {
          this.form.use_bound = 'tag'
          this.tagHidden = false
          this.tag.currentTags = res.data.data.tag_list || []
          this.showTags()
          this.generateSku()
        }
        if (this.form.use_bound == 4) {
          this.form.use_bound = 'brand'
          this.brandHidden = false
          this.brand.currentBrands = res.data.data.brand_list || []
          this.showBrands()
          this.generateSku()
        }
      })
    },
    handleCancel: function () {
      this.$router.go(-1)
    },
    itemTypeChange(val) {
      this.params.main_cat_id = ''
      this.params.tag_id = ''
      this.params.brand_id = ''
      this.zdItemHidden = true
      this.categoryHidden = true
      this.tagHidden = true
      this.brandHidden = true
      this.form.items = []
      this.invalidItemsList = []
      this.form.rel_item_ids = []
      this.form.itemTreeLists = []
      this.form.item_category = []
      this.form.item_category = []
      this.tag.currentTags = []
      if (val === 'goods') {
        this.zdItemHidden = false
      } else if (val === 'category') {
        this.form.rel_item_ids = []
        this.form.itemTreeLists = []
        this.categoryHidden = false
        this.form.item_category = []
      } else if (val === 'tag') {
        this.tagHidden = false
        this.tag.currentTags = []
        this.showTags()
      } else if (val === 'brand') {
        this.brandHidden = false
        this.brand.currentBrands = []
        this.showBrands()
      }
    },
    fetchMainCate() {
      getCategory({ is_main_category: true }).then(response => {
        this.categoryList = response.data.data
      })
    },
    addItemTag() {
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
    showTags() {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex(n => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
    },
    tagRemove(index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      let tagItems = []
      let tagInvalidItems = []
      this.tag.currentTags.forEach(item => {
        this.form.tag_ids.push(item.tag_id)
        let items = []
        this.ItemsList.forEach(i => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) items.push(i)
        })
        tagItems = items
        let invalidItems = []
        this.invalidItemsList.forEach(i => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) invalidItems.push(i)
        })
        tagInvalidItems = invalidItems
      })
      this.ItemsList = tagItems
      this.invalidItemsList = tagInvalidItems
      this.getItems(this.ItemsList)
    },
    tagAdd(item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.tag.currentTags.findIndex(n => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach(item => {
        this.form.tag_ids.push(item.tag_id)
      })
      this.params.tag_id = item.tag_id
      this.getGoodsList()
    },
    getAllTagLists() {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then(response => {
        this.tag.list = response.data.data.list
      })
    },
    // 获取品牌列表
    getBrandList(searchVal = '', isInit = false) {
      const list = []
      getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal,
        attribute_ids: isInit ? this.form.brand_id : ''
      }).then(res => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brand.list = list
      })
    },
    showBrands() {
      this.brand.brands = [...this.brand.list]
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex(n => n.attribute_id == item.attribute_id)
        if (isInArr != -1) this.brand.brands.splice(index, 1)
      })
    },
    brandAdd(item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.brand.currentBrands.findIndex(n => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
      this.form.brand_ids = []
      this.brand.currentBrands.forEach(item => {
        this.form.brand_ids.push(item.attribute_id)
      })
      this.params.brand_id = item.attribute_id
      this.getGoodsList()
    },
    brandRemove(index) {
      let items = []
      this.ItemsList.forEach(item => {
        if (this.brand.currentBrands[index].attribute_id != item.brand_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach(i => {
        if (this.brand.currentBrands[index].attribute_id != i.brand_id) invalidItems.push(i)
      })
      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)
      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
      this.form.brand_ids = []
      this.brand.currentBrands.forEach(item => {
        this.form.brand_ids.push(item.attribute_id)
      })
    },
    getGoodsList() {
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.$route.params.seckill_id) {
        params.activity_id = this.$route.params.seckill_id
      }
      params.seckill_type = this.form.seckill_type
      params.activity_release_time = params.activity_start_time = this.activity_date[0]
      params.activity_end_time = this.activity_date[1]
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      seckillActivityGetItemsList(params).then(response => {
        let itemList = response.data.data.list.validItems.concat(this.ItemsList)
        let invalidItemList = response.data.data.list.invalidItems.concat(this.invalidItemsList)
        let newItemList = []
        let invalidItems = []
        let obj = {}
        let obj1 = {}
        itemList.forEach(item => {
          let tag_ids = []
          item.tagList.forEach(tag => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj[item.item_id]) {
            newItemList.push(item)
            obj[item.item_id] = true
          }
        })
        invalidItemList.forEach(item => {
          let tag_ids = []
          item.tagList.forEach(tag => {
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
    categorySelect(node, instanceId) {
      this.params.main_cat_id = node.category_id
      this.getGoodsList()
    },
    categoryDeselect(node, instanceId) {
      let items = []
      this.ItemsList.forEach((item, index) => {
        if (node.category_id != item.item_main_cat_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach(i => {
        if (node.category_id != i.item_main_cat_id) invalidItems.push(i)
      })
      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)
    },
    generateSku() {
      let noSkuItem = []
      let response = []
      let goodsList = JSON.parse(JSON.stringify(this.relItems))
      goodsList.forEach(item => {
        if (!item.nospec && item.spec_items.length === 0) {
          noSkuItem.push(item.default_item_id)
        }
      })
      if (noSkuItem.length > 0) {
        let param = this.params
        param.item_id = noSkuItem
        getItemsList(this.params).then(res => {
          goodsList.forEach(item => {
            if (!item.nospec) {
              res.data.data.list.forEach(sku => {
                if (item.item_id === sku.default_item_id) {
                  item.spec_items.push(sku)
                }
              })
            }
          })
          goodsList.forEach(item => {
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
        goodsList.forEach(item => {
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
    uploadHandleTemplate() {
      let params = { file_type: 'marketing_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then(response => {
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
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then(response => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
        let { data } = response.data
        if (data.fail.length > 0) {
          let str = data.fail.map(item => {
            return item.item_bn
          })
          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `以下商品编号不存在：${str}`,
              type: 'error',
              duration: 5000
            })
          }, 1500)
        }
        if (data.succ.length <= 0) return
        this.relItems = data.succ
        let list = []
        data.succ.forEach(item => {
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
<style lang="scss" scoped>
.page-limitedtimesale ::v-deep .el-card {
  margin-bottom: 20px;
}
</style>
