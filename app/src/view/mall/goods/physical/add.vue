<style lang="scss" scoped>
.section-page {
  padding-bottom: 100px;
}
.mode-text {
  margin-bottom: 20px;
}
.component-block {
  margin-top: 20px;
}
.ricktext-con {
  width: calc(100% - 100px);
  display: inline-block;
}
.tpl-btn {
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 15px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 3px;
  float: right;
}
.section-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 208px;
  background: #fff;
  text-align: center;
  border-top: 1px solid #efefef;
  z-index: 1000;
}
</style>

<template>
  <div class="section-page">
    <template v-if="!isEditor">
      <el-card shadow="never" header="选择主类目" v-loading="mainCateLoader">
        <el-cascader
          v-model="selectedMainCategory"
          :options="mainCategory"
          @change="handleCategoryChange"
          style="width: 360px"
        >
        </el-cascader>
      </el-card>
    </template>
    <template v-else>
      <div class="form-block-head clearfix">
        <div class="block-head-hd">商品主类目</div>
      </div>
      <div class="form-block-body">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="inline">
          <el-breadcrumb-item v-for="(item, index) in categoryNames" :key="index">{{
            item
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </template>
    <template v-if="isEditor || selectedMainCategory.length > 0">
      <!-- 基础信息 -->
      <CmBaseForm v-model="baseData" :isCross="isCross" />

      <!-- 商品参数 -->
      <CmGoodsParams
        v-if="paramsData.length > 0"
        v-model="paramsData"
        :pointAccess="baseData.point_access"
      />

      <!-- 商品规格 -->
      <CmSkuForm
        v-model="skuData"
        :isEditor="isEditor"
        :isPackageItems="baseData.isPackageItems"
        :pointAccess="baseData.point_acces"
        @specOnChange="specOnChange"
      />

      <div class="comp-tdk">
        <div class="form-block-head clearfix">
          <div class="block-head-hd">PC关键词搜索引擎</div>
        </div>
        <div class="form-block-body">
          <el-form label-position="right" label-width="80px">
            <el-form-item label="页面标题" style="margin-bottom: 20px; width: 600px">
              <el-input type="text" v-model="tdk_info.title"></el-input>
            </el-form-item>
            <el-form-item label="页面描述" style="margin-bottom: 20px; width: 600px">
              <el-input type="textarea" v-model="tdk_info.mate_description"></el-input>
            </el-form-item>
            <el-form-item label="关键词" style="width: 600px">
              <el-input type="textarea" v-model="tdk_info.mate_keywords"></el-input>
              <span class="tip">关键词之间请用半角”,”分隔</span>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="comp-desc">
        <div class="form-block-head clearfix">
          <div class="block-head-hd">图文详情</div>
        </div>
        <div class="form-block-body">
          <el-radio-group class="mode-text" v-model="mode">
            <el-radio :label="'richText'">富文本</el-radio>
            <el-radio :label="'component'">组件式</el-radio>
          </el-radio-group>
          <div class="richText-block" v-if="mode === 'richText'">
            <div class="ricktext-con">
              <vue-html5-editor
                :modules="modules"
                :content="intro.toString()"
                ref="editor"
                @change="
                  (e) => {
                    this.intro = e
                  }
                "
                :height="360"
                style="width: 100%"
              ></vue-html5-editor>
            </div>
            <!-- <span class="tpl-btn" @click="addImgPreview" style="">
              <i class="iconfont icon-image"></i>图片
            </span> -->
          </div>
          <div class="component-block" v-else>
            <richTextEditor
              :data="content"
              :control="['film', 'slider', 'heading', 'writing']"
              @change="
                (data) => {
                  content = data
                }
              "
            />
          </div>
          <imgPicker
            :dialog-visible="thumbDialog"
            :sc-status="isGetThumb"
            :isMost="true"
            @chooseImg="pickThumb"
            @closeImgDialog="closeThumbDialog"
          ></imgPicker>
        </div>
      </div>

      <div class="section-footer">
        <el-button @click.native="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="submitLoading">{{
          submitLoading ? '提交中' : '保存'
        }}</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import store from '@/store'
import { getItemsDetail, createItems, updateItems, getCategory, getCategoryInfo } from '@/api/goods'
import richTextEditor from '@/components/function/richTextEditor'
import imgBox from '@/components/element/imgBox'
import imgPicker from '@/components/imageselect'
import CmBaseForm from './comps/CmBaseForm'
import CmGoodsParams from './comps/CmGoodsParams'
import CmSkuForm from './comps/CmSkuForm'
import { getOrigincountry, getTaxstrategyList } from '../../../../api/crossborder'
import { getPointRule } from '../../../../api/promotions'

export default {
  beforeRouteLeave(to, from, next) {
    if (!this.isLeave) {
      this.$confirm('确定要离开当前页面，您将丢失已编辑的数据？！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then((res) => {
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      next()
    }
  },
  inject: ['refresh'],
  components: {
    richTextEditor,
    imgBox,
    imgPicker,
    CmBaseForm,
    CmGoodsParams,
    CmSkuForm
  },
  data() {
    return {
      itemVideo: {},
      select_regions_value: [],

      categoryNames: [],
      mainCateLoader: false,

      submitLoading: false,
      isEditor: false,
      isLeave: false,
      imgDialog: false,
      isGetVideo: false,

      thumbDialog: false,
      isGetThumb: false,

      cacheCreateDetail: {},
      mainCategory: [],
      selectedMainCategory: [],
      loading: true,
      isCross: false,
      origincountry: [], // 产地国
      taxstrategy: [], // 税费策略
      baseData: {
        item_type: 'normal',
        special_type: 'normal',
        item_source: 'mall',
        item_id: '',
        itemName: '',
        brief: '',
        templatesId: '',
        brandId: '',
        itemUnit: '',
        sort: 1,
        regionsId: [],
        taxRate: 0,
        isProfit: true,
        isPackageItems: false,
        isGift: false,
        itemCategory: [],
        pics: [],
        pics_create_qrcode: [],
        itemVideo: {
          media_id: '',
          url: ''
        },
        point_access: 'order'
      },
      modules: [
        {
          icon: 'iconfont icon-image',
          name: 'uploader'
        }
      ],
      paramsData: [],
      skuData: {
        // 单规格
        nospec: true,
        // 是否显示图片规格
        isShowSpecimg: false,
        // 单规格数据
        specData: {
          approve_status: 'onsale',
          store: 1,
          item_bn: '',
          weight: '',
          volume: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: 0
        },
        skus: [],
        specImages: [],
        specItems: [],
        itemSpecList: []
      },
      tdk_info: {
        title: '',
        mate_description: '',
        mate_keywords: ''
      },
      mode: 'richText',
      content: [],
      intro: ''
    }
  },
  computed: {
    // isAllCheck ({ form }) {
    //   const { pics_create_qrcode } = form
    //   const isNotAll = pics_create_qrcode.some(item => !item)
    //   return !isNotAll
    // }
  },
  created() {
    const { itemId } = this.$route.params
    this.isEditor = !!itemId
    this.fetch()

    if (this.$route.path.split('/')[2] === 'godsphysicalkj') {
      // 跨境
      this.isCross = true
      this.fetchOriginData()
    } else {
      this.isCross = false
    }
    if (itemId) {
      this.fetchDetail()
    } else {
      this.getMainCategory()
    }
  },
  mounted: function () {
    this.addUploaderEventListener();
  },
  watch:{
    selectedMainCategory:{
      handler:function(val){
        console.log("===selectedMainCategory===>",val)
        if(val.length>0){
          this.addUploaderEventListener()
        }
      },
      immediate:true
    }
  },
  methods: {
    async fetch() {
      const resPointRule = await getPointRule()
      this.baseData.point_access = resPointRule.data.data.access
    },
    addUploaderEventListener() {
      const self = this 
      setTimeout(()=>{
        const uploaderDom = document.getElementsByClassName('icon iconfont icon-image')[0]
        uploaderDom && uploaderDom.addEventListener('click', () => {
          self.addImgPreview()
        })
      },0) 
    },
    async fetchOriginData() {
      // 获取产地国
      const resCountry = await getOrigincountry({
        page: 1,
        pageSize: 99999
      })
      this.origincountry = resCountry.data.data.list
      // 获取税费策略
      const resTax = await getTaxstrategyList({
        page: 1,
        pageSize: 99999
      })
      this.taxstrategy = [
        ...resTax.data.data.list,
        {
          id: '0',
          taxstrategy_name: '不使用策略',
          created: '0',
          updated: '0'
        }
      ]
    },
    async fetchDetail() {
      const { itemId } = this.$route.params
      const { is_new } = this.$route.query
      const res = await getItemsDetail(itemId)
      const goodsDetail = res.data.data
      // this.select_regions_value = goodsDetail.regions_id
      // this.form = {
      //   ...this.form,
      //   ...goodsDetail
      // }
      this.baseData = {
        item_type: goodsDetail.item_type,
        special_type: goodsDetail.special_type,
        item_source: goodsDetail.item_source,
        item_id: goodsDetail.item_id,
        itemName: goodsDetail.item_name,
        brief: goodsDetail.brief,
        templatesId: goodsDetail.templates_id.toString(),
        brandId: goodsDetail.brand_id,
        itemUnit: goodsDetail.item_unit,
        sort: goodsDetail.sort,
        regionsId: goodsDetail.regions_id,
        taxRate: goodsDetail.tax_rate,
        isProfit: goodsDetail.is_profit,
        isPackageItems: goodsDetail.is_package_items,
        isGift: goodsDetail.is_gift,
        itemCategory: goodsDetail.item_category,
        pics: goodsDetail.pics,
        pics_create_qrcode: goodsDetail.pics_create_qrcode,
        item_main_cat_id: goodsDetail.item_main_cat_id,
        itemVideo: {
          media_id: goodsDetail.videos,
          url: goodsDetail.videos_url || goodsDetail.videos
        }
      }

      this.deepMainCategory(goodsDetail.item_category_main[0], this.categoryNames)

      this.skuData = {
        ...this.skuData,
        nospec: goodsDetail.nospec,
        specImages: goodsDetail.spec_images,
        specItems: goodsDetail.spec_items,
        itemSpecDesc: goodsDetail.item_spec_desc,
        itemSpecList: goodsDetail.item_spec_list
      }

      this.getGoodsParams(goodsDetail.item_params_list, goodsDetail.item_params)

      if (!goodsDetail.nospec) {
        goodsDetail.spec_items.forEach((item) => {
          item.price = item.price / 100
          item.cost_price = item.cost_price / 100
          item.market_price = item.market_price / 100
        })
        this.getGoodsSkus(goodsDetail.item_spec_list, goodsDetail.spec_items)
        this.getSkuItems()
      } else {
        this.skuData.specData = {
          approve_status: goodsDetail.approve_status,
          store: goodsDetail.store,
          item_bn: is_new ? '' : goodsDetail.item_bn,
          weight: goodsDetail.weight,
          volume: goodsDetail.volume,
          price: goodsDetail.price / 100,
          cost_price: goodsDetail.cost_price / 100,
          market_price: goodsDetail.market_price / 100,
          barcode: goodsDetail.barcode,
          point_num: goodsDetail.point_num
        }
      }
      if (goodsDetail.tdk_content) {
        this.tdk_info = JSON.parse(goodsDetail.tdk_content)
      }
      if (typeof goodsDetail.intro === 'object') {
        this.mode = 'component'
        this.content = goodsDetail.intro
      } else {
        this.intro = goodsDetail.intro
      }
      this.loading = false
    },
    // 递归主类目
    deepMainCategory(item, cateNames) {
      cateNames.push(item.category_name)
      if (item.children) {
        this.deepMainCategory(item.children[0], cateNames)
      }
    },
    // 商品参数
    getGoodsParams(list, value) {
      list.forEach((item) => {
        const temp = {
          value: item.attribute_id,
          label: item.attribute_name,
          attribute_value_id: '',
          attribute_value_name: '',
          children: []
        }
        item.attribute_values.list.forEach(({ attribute_value_id, attribute_value }) => {
          temp.children.push({
            value: attribute_value_id,
            label: attribute_value
          })
        })
        const fd = value.find((sitem) => sitem.attribute_id == item.attribute_id)
        if (fd) {
          temp.attribute_value_id = fd.attribute_value_id
          temp.attribute_value_name = fd.attribute_value_name
        }
        this.paramsData.push(temp)
      })
    },
    // 商品skus
    getGoodsSkus(list, value) {
      this.skuData.skus = []

      if (list) {
        list.forEach((item) => {
          const specs = []
          item.attribute_values.list.forEach((attr) => {
            specs.push({
              image_url: attr.image_url ? attr.image_url : '',
              attribute_value_id: attr.attribute_value_id,
              custom_attribute_value: attr.custom_attribute_value || attr.attribute_value,
              attribute_value: attr.attribute_value
            })
          })
          const checked_sku = []
          value.forEach((spec) => {
            spec.item_spec.forEach((sitem) => {
              if (item.attribute_id == sitem.spec_id) {
                if (checked_sku.indexOf(sitem.spec_value_id) < 0) {
                  checked_sku.push(sitem.spec_value_id)
                }
              }
            })
          })
          this.skuData.skus.push({
            sku_id: item.attribute_id,
            sku_name: item.attribute_name,
            is_image: item.is_image,
            sku_value: specs,
            checked_sku
          })
        })
      }
    },
    // 生成skuItems
    getSkuItems() {
      const { is_new } = this.$route.query
      const skuMartix = []
      this.skuData.skus.forEach((sku) => {
        skuMartix.push(sku.checked_sku)
      })
      const _specItmes = this.cartesianProductOf(...skuMartix)
      const cacheItems = {}
      console.log('specItems:', this.skuData.specItems)
      this.skuData.specItems.forEach((sitem) => {
        const itemSpecs = sitem.item_spec.map((k) => {
          return k.spec_value_id
        })
        cacheItems[itemSpecs.join('_')] = sitem
      })
      console.log('cacheItems:', cacheItems)
      this.skuData.specItems = _specItmes.map((item) => {
        // console.log('item:', item)
        const key = item.join('_')
        const temp = {
          sku_id: key,
          spec_name: this.getSpecName(item),
          is_default: cacheItems[key] ? cacheItems[key].is_default : false,
          approve_status: cacheItems[key] ? cacheItems[key].approve_status : '',
          store: cacheItems[key] ? cacheItems[key].store : '',
          item_bn: is_new ? '' : cacheItems[key] ? cacheItems[key].item_bn : '',
          weight: cacheItems[key] ? cacheItems[key].weight : '',
          volume: cacheItems[key] ? cacheItems[key].volume : '',
          price: cacheItems[key] ? cacheItems[key].price : '',
          cost_price: cacheItems[key] ? cacheItems[key].cost_price : '',
          market_price: cacheItems[key] ? cacheItems[key].market_price : '',
          barcode: cacheItems[key] ? cacheItems[key].barcode : '',
          point_num: cacheItems[key] ? cacheItems[key].point_num : '',
          item_spec: cacheItems[key]
            ? cacheItems[key].item_spec
            : item.map((m, n) => {
                const { sku_id, sku_value } = this.skuData.skus[n]
                const fd = sku_value.find((sv) => sv.attribute_value_id == m)
                return {
                  spec_id: sku_id,
                  spec_value_id: m,
                  spec_value_name: fd.attribute_value,
                  spec_custom_value_name: fd.custom_attribute_value
                }
              })
        }
        if (this.isEditor) {
          temp['item_id'] = cacheItems[key] ? cacheItems[key].item_id : ''
        }
        // console.log('temp:', temp)
        return temp
      })
      console.log('specItems:', this.skuData.specItems)
      // 查找规格图片, 取最后一行
      const skus = JSON.parse(JSON.stringify(this.skuData.skus))
      const imgSkus = skus.reverse().find((item) => item.is_image == 'true')
      if (imgSkus) {
        const checkedImgSkus = imgSkus.sku_value.filter(
          (item) => imgSkus.checked_sku.indexOf(item.attribute_value_id) > -1
        )
        this.skuData.specImages = checkedImgSkus.map((skuItem) => {
          const fd = this.skuData.specImages.find(
            (item) => item.spec_value_id == skuItem.attribute_value_id
          )
          return {
            spec_value_id: skuItem.attribute_value_id,
            spec_custom_value_name: skuItem.custom_attribute_value,
            spec_value_name: skuItem.attribute_value,
            item_image_url: fd ? fd.item_image_url : skuItem.image_url ? [skuItem.image_url] : []
          }
        })
      }
      console.log(this.skuData.specImages)
    },
    cartesianProductOf() {
      return Array.prototype.reduce.call(
        arguments,
        function (a, b) {
          var ret = []
          a.forEach(function (a) {
            b.forEach(function (b) {
              ret.push(a.concat([b]))
            })
          })
          return ret
        },
        [[]]
      )
    },
    //
    getSpecName(keys) {
      const specNames = []
      keys.forEach((key, index) => {
        const fd = this.skuData.itemSpecList[index].attribute_values.list.find(
          (item) => item.attribute_value_id == key
        )
        if (fd) {
          specNames.push(fd.custom_attribute_value || fd.attribute_value)
        }
      })
      return specNames.join(' ')
    },
    // 获取主类目
    async getMainCategory() {
      const res = await getCategory({ is_main_category: true })
      const category = res.data.data
      function deepMainCategory(cate, temp) {
        cate.forEach((item) => {
          const _temp = {
            label: item.category_name,
            value: item.category_id
          }
          if (item.children) {
            _temp['children'] = []
            deepMainCategory(item.children, _temp.children)
          }
          temp.push(_temp)
        })
      }
      deepMainCategory(category, this.mainCategory)
      this.mainCateLoader = false
    },
    // 选择主类目
    async handleCategoryChange(val) {
      const res = await getCategoryInfo(val[val.length - 1])
      const detail = res.data.data
      this.cacheCreateDetail = detail
      this.getGoodsParams(detail.goods_params, [])
      this.skuData.itemSpecList = detail.goods_spec
      if (!this.skuData.nospec) {
        this.getGoodsSkus(detail.goods_spec, [])
      }
      // const goodsSpec = JSON.parse(JSON.stringify(detail.goods_spec))
      // const imgSpec = goodsSpec.reverse().find(item => item.is_image == 'true')
      // if(imgSpec) {
      //   this.skuData.specImages = imgSpec.attribute_values.list.map(item => {
      //     return {
      //       spec_custom_value_name: item.attribute_value,
      //       // spec_image_url: item.image_url,
      //       spec_value_id: item.attribute_value_id,
      //       spec_value_name: item.attribute_value,
      //       item_image_url: [ item.image_url]
      //     }
      //   })
      // }
      this.skuData.specImages = []
      this.loading = false
    },
    specOnChange() {
      this.getGoodsSkus(this.cacheCreateDetail.goods_spec, [])
    },
    clearSku(index) {
      this.$confirm('确定清除当前规格的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(this.specItems)
        this.$set(this.specItems, index, {
          ...this.specItems[index],
          approve_status: '',
          store: '',
          item_bn: '',
          weight: '',
          volume: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: ''
        })
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    async handleSave() {
      this.submitLoading = true
      const {
        item_id,
        itemName,
        itemCategory,
        sort,
        taxRate,
        brief,
        templatesId,
        brandId,
        itemUnit,
        regionsId,
        isProfit,
        isPackageItems,
        isGift,
        pics,
        pics_create_qrcode,
        itemVideo,
        item_type,
        special_type,
        item_source,
        item_main_cat_id
      } = this.baseData
      const { nospec, isShowSpecimg } = this.skuData
      const { is_new } = this.$route.query
      let params = {
        item_type: item_type,
        special_type: special_type,
        item_source: item_source,
        item_category: itemCategory,
        item_name: itemName,
        sort,
        tax_rate: taxRate,
        brief,
        templates_id: templatesId,
        brand_id: brandId,
        item_unit: itemUnit,
        regions_id: regionsId,
        is_profit: isProfit,
        is_package_items: isPackageItems,
        is_gift: isGift,
        pics: pics,
        pics_create_qrcode: pics_create_qrcode,
        videos: itemVideo.media_id,
        videos_url: itemVideo.url,
        nospec,
        is_show_specimg: isShowSpecimg,
        item_params: this.paramsData.map((item) => {
          return {
            attribute_id: item.value,
            attribute_value_id: item.attribute_value_id,
            attribute_value_name: item.attribute_value_name
          }
        }),
        tdk_content: JSON.stringify(this.tdk_info),
        item_main_cat_id: item_id
          ? item_main_cat_id
          : this.selectedMainCategory[this.selectedMainCategory.length - 1]
      }

      // 多规格
      if (!nospec) {
        const specImages = this.skuData.specImages.map((item) => {
          return {
            spec_value_id: item.spec_value_id,
            item_spec: item.spec_custom_value_name || item.spec_value_name,
            item_image_url: item.item_image_url
          }
        })
        // debugger
        params = {
          ...params,
          spec_images: JSON.stringify(specImages)
        }
        // 编辑
        if (item_id) {
          params['spec_items'] = JSON.stringify(
            this.skuData.specItems.filter((item) => !!item.approve_status)
          )
        } else {
          const specItems = this.skuData.specItems.map((item, index) => {
            const skuIds = item.sku_id.split('_')
            const itemSpec = []
            this.skuData.skus.forEach((m, n) => {
              const t = m.sku_value.find((k) => k.attribute_value_id == skuIds[n])
              itemSpec.push({
                spec_id: m.sku_id,
                spec_value_id: skuIds[n],
                spec_value_name: t.attribute_value,
                spec_custom_value_name: t.custom_attribute_value
              })
            })
            return {
              is_default: index == 0,
              sku_id: item.sku_id,
              item_spec: itemSpec,
              approve_status: item.approve_status,
              store: item.store,
              item_bn: item.item_bn,
              weight: item.weight,
              volume: item.volume,
              price: item.price,
              cost_price: item.cost_price,
              market_price: item.market_price,
              barcode: item.barcode,
              point_num: item.point_num
            }
          })
          params['spec_items'] = JSON.stringify(specItems)
        }
      } else {
        params = {
          ...params,
          approve_status: this.skuData.specData.approve_status,
          store: this.skuData.specData.store,
          item_bn: this.skuData.specData.item_bn,
          weight: this.skuData.specData.weight,
          volume: this.skuData.specData.volume,
          price: this.skuData.specData.price,
          cost_price: this.skuData.specData.cost_price,
          market_price: this.skuData.specData.market_price,
          barcode: this.skuData.specData.barcode,
          point_num: this.skuData.specData.point_num
        }
      }

      if (this.mode === 'component') {
        params['intro'] = JSON.stringify(this.content)
      } else {
        params['intro'] = this.intro
      }
      if (item_id && !is_new) {
        try {
          params = {
            ...params,
            item_id: item_id
          }
          await updateItems(item_id, params)
          this.$message({
            message: '更新成功',
            type: 'success',
            duration: 2 * 1000,
            onClose: () => {
              this.submitLoading = false
              this.refresh()
              this.isLeave = true
              this.$router.go(-1)
            }
          })
        } catch (e) {
          this.submitLoading = false
        }
      } else {
        try {
          await createItems(params)
          this.$message({
            message: '添加成功',
            type: 'success',
            duration: 2 * 1000,
            onClose: () => {
              this.submitLoading = false
              this.refresh()
              this.isLeave = true
              this.$router.go(-1)
            }
          })
        } catch (e) {
          this.submitLoading = false
        }
      }
    },
    // 详情中的上传图片
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    pickThumb: function (arr) {
      if (arr.length != 0) {
        arr.forEach((data) => {
          if (data && data.url !== '') {
            this.thumbDialog = false
            var index = this.$refs.editor.$el.id
            var loc = this.$refs.editor
            var img = new Image()
            img.src = this.wximageurl + data.url
            if (loc.range) {
              loc.range.insertNode(img)
              var referenceNode = loc.range.endContainer
              if (referenceNode.className !== 'content') {
                loc.range.setStartAfter(referenceNode)
              } else {
                loc.range.setStart(loc.range.endContainer, loc.range.endOffset)
              }
            } else {
              loc.$refs.content.appendChild(img)
              loc.focus()
              loc.restoreSelection()
            }
            this.intro = loc.$refs.content.innerHTML
          }
        })
      }
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    }
  }
}
</script>

