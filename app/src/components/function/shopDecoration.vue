<template>
  <div class="content-wrap">
    <section class="section section-white view-warp">
      <draggable
        v-model="initData"
        :options="dragIssuesOptions"
        @start="onStart"
        @end="onEnd"
        class="components-view"
      >
        <div v-for="(item, index) in initData" class="component-control" :key="index">
           <template
            v-if="item.name === 'nearbyShop' && pagetype == 'cuspage'"
          >
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-scroll"></use>
            </svg>
            附近商家
          </template>
          <template v-if="item.name === 'coupon'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-tag"></use>
            </svg>
            优惠券
          </template>
          <template v-if="item.name === 'goodsGrid'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-grid"></use>
            </svg>
            商品栅格
          </template>
          <template v-if="item.name === 'goodsScroll'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-scroll"></use>
            </svg>
            商品滚动
          </template>
          <template v-if="item.name === 'imgHotzone'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-hotzone"></use>
            </svg>
            热区图
          </template>
          <!-- <template v-if="item.name === 'marquees'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-marquees"></use>
            </svg>
            文字轮播
          </template> -->
          <template v-if="item.name === 'navigation'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-navigation"></use>
            </svg>
            图片导航
          </template>
          <template v-if="item.name === 'search'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-search"></use>
            </svg>
            搜索
          </template>
          <template v-if="item.name === 'showcase'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-showcase"></use>
            </svg>
            橱窗
          </template>
          <template v-if="item.name === 'slider'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            轮播
          </template>
          <template v-if="item.name === 'store' && pagetype == 'cuspage'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-store"></use>
            </svg>
            推荐店铺
          </template>
        </div>
      </draggable>
      <div class="template-view">
        <div class="template">
          <div class="template-header">
            <div
              class="template-title"
              :style="
                'background: #fff url(' +
                headerBg +
                ') no-repeat bottom; background-size: 100% auto;'
              "
            >
              <span>标题</span>
            </div>
          </div>
          <div class="components-container">
            <draggable
              v-model="components"
              :options="dragViewOptions"
              @start="onStart"
              @end="onEnd"
              class="components-wrap"
            >
              <div
                class="component-item"
                v-for="(item, index) in components"
                @click="setCurrent(index)"
                :key="index"
              >
                <transition name="el-fade-in-linear">
                  <div
                    v-if="editorIndex === index"
                    class="iconfont icon-trash-alt"
                    @click="removeCurrent"
                  ></div>
                </transition>
                <nearbyShop
                  v-if="item.name === 'nearbyShop'"
                  :res="item"
                  :active="index == editorIndex"
                >
                </nearbyShop>
                <coupon
                  v-if="item.name === 'coupon'"
                  :res="item"
                  :active="index == editorIndex"
                ></coupon>
                <goodsGrid
                  v-if="item.name === 'goodsGrid'"
                  :res="item"
                  :active="index == editorIndex"
                ></goodsGrid>
                <goodsScroll
                  v-if="item.name === 'goodsScroll'"
                  :res="item"
                  :active="index == editorIndex"
                ></goodsScroll>
                <imgHotzone
                  v-if="item.name === 'imgHotzone'"
                  :res="item"
                  :active="index == editorIndex"
                ></imgHotzone>
                <marquees
                  v-if="item.name === 'marquees'"
                  :res="item"
                  :active="index == editorIndex"
                ></marquees>
                <navigation
                  v-if="item.name === 'navigation'"
                  :res="item"
                  :active="index == editorIndex"
                ></navigation>
                <search
                  v-if="item.name === 'search'"
                  :res="item"
                  :active="index == editorIndex"
                ></search>
                <showcase
                  v-if="item.name === 'showcase'"
                  :res="item"
                  :active="index == editorIndex"
                ></showcase>
                <slider
                  v-if="item.name === 'slider'"
                  :res="item"
                  :active="index == editorIndex"
                ></slider>
                <store
                  v-if="item.name === 'store'"
                  :res="item"
                  :active="index == editorIndex"
                ></store>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <div class="setting-view">
        <div class="view-placeholder" v-if="editorIndex === null">
          <i class="iconfont icon-shapes"></i>
          请拖选左侧挂件
        </div>
        <nearbyShopEditor :res="editorData" @tagSelectVisibleHandle="tagSelectVisibleHandle" />
        <couponEditor
          :res="editorData"
          @bindCoupons="showCoupons"
          @bindImgs="showImgs"
        ></couponEditor>
        <goodsGridEditor :res="editorData" @bindGoods="showGoods"></goodsGridEditor>
        <goodsScrollEditor :res="editorData" @bindGoods="showGoods"></goodsScrollEditor>
        <imgHotzoneEditor
          :res="editorData"
          @bindImgs="showImgs"
          @bindLinks="showLinks"
        ></imgHotzoneEditor>
        <marqueesEditor :res="editorData" @change="updataArticle"></marqueesEditor>
        <navigationEditor
          :res="editorData"
          @bindImgs="showImgs"
          @bindLinks="showLinks"
        ></navigationEditor>
        <searchEditor :res="editorData" pageType="salesindex"></searchEditor>
        <showcaseEditor
          :res="editorData"
          @bindImgs="showImgs"
          @bindLinks="showLinks"
        ></showcaseEditor>
        <sliderEditor :res="editorData" @bindImgs="showImgs" @bindLinks="showLinks"></sliderEditor>
        <storeEditor
          :res="editorData"
          @bindGoods="showGoods"
          @bindImgs="showImgs"
          @tagSelectVisibleHandle="tagSelectVisibleHandle"
        ></storeEditor>
      </div>
    </section>
    <section slot="footer" class="content-center">
      <el-button class="btn-save" type="primary" @click="saveConfig">保存</el-button>
    </section>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeimgsVisible"
    ></imgPicker>
    <linkSetter
      :visible="linksVisible"
      @setLink="setLink"
      @closeDialog="closeDialog"
      :template_name="template_name"
    ></linkSetter>
    <goodsSelect
      :items-visible="goodsVisible"
      :get-status="setItemStatus"
      :rel-store="curStore"
      :rel-items-ids="relItemsIds"
      :lock-store="relStore.id == '0' ? false : true"
      @chooseStore="pickGoods"
      @closeStoreDialog="closeDialog"
      :isChangeStore="true"
    ></goodsSelect>
    <couponPicker
      :visible="couponsVisible"
      @pickCoupon="pickCoupon"
      @closeDialog="closeDialog"
    ></couponPicker>
    <template v-if="tagSelectVisible">
      <TagSelect
        :visible="tagSelectVisible"
        :type="tagType"
        :seletedTags="editorData.seletedTags"
        :storeID="storeID"
        @visibleHandle="tagSelectVisibleHandle"
        @seletedTagsHandle="seletedTagsHandle"
      >
      </TagSelect>
    </template>
  </div>
</template>

<script>
const img = require('@/assets/img/demo-img.jpg')
const header = require('@/assets/img/topbar.png')
// 组件
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links_guide'

import goodsSelect from '@/components/goodsSelect'
import couponPicker from '@/components/coupon_picker'
import TagSelect from '@/components/new_tagselect'
// 店铺装修组件
// view层组件
import coupon from '@/components/template/coupon'
import goodsGrid from '@/components/template/goods_grid'
import goodsScroll from '@/components/template/goods_scroll'
import imgHotzone from '@/components/template/img_hotzone'
import marquees from '@/components/template/marquees'
import navigation from '@/components/template/navigation'
import search from '@/components/template/search'
import showcase from '@/components/template/showcase'
import slider from '@/components/template/slider'
import nearbyShop from '@/components/template/nearby_shop'
import store from '@/components/template/store' //推荐商铺
// control层组件
import couponEditor from '@/components/template_editor/coupon'
import goodsGridEditor from '@/components/template_editor/goods_grid'
import goodsScrollEditor from '@/components/template_editor/goods_scroll'
import imgHotzoneEditor from '@/components/template_editor/img_hotzone'
import marqueesEditor from '@/components/template_editor/marquees'
import navigationEditor from '@/components/template_editor/navigation'
import searchEditor from '@/components/template_editor/search'
import showcaseEditor from '@/components/template_editor/showcase'
import sliderEditor from '@/components/template_editor/slider'
import nearbyShopEditor from '@/components/template_editor/nearby_shop'
import storeEditor from '@/components/template_editor/store'

// 第三方组件
import draggable from 'vuedraggable'

// api
import { savePageParams, getParamByTempName } from '@/api/wxa'
import { getItemsList } from '@/api/goods'

export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    control: {
      type: Array,
      default: () => {
        return []
      }
    },
    usage: {
      type: String,
      default: 'template' // usage=='page'为页面编辑
    },
    pagetype: { // pagetype：cuspage为自定义页面
      type: String
    },
    template_name: {
      type: String
    },
    relStore: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    nearbyShop,
    coupon,
    goodsGrid,
    goodsScroll,
    imgHotzone,
    marquees,
    navigation,
    search,
    showcase,
    slider,
    store,
    couponEditor,
    goodsGridEditor,
    goodsScrollEditor,
    imgHotzoneEditor,
    marqueesEditor,
    navigationEditor,
    searchEditor,
    showcaseEditor,
    sliderEditor,
    storeEditor,
    nearbyShopEditor,
    // 其他组件
    imgPicker,
    linkSetter,
    goodsSelect,
    couponPicker,
    TagSelect,
    // 第三方组件
    draggable
  },
  data() {
    return {
      componentHeight: '',
      tagSelectVisible: false,
      storeID: null,
      tagType: '', // nearby_shop || store
      editorIndex: null,
      editorData: {},
      editorDataIndex: null,
      dragIssuesOptions: {
        group: {
          name: 'easyview',
          put: false
        },
        sort: false,
        fallbackClass: 'fallback-class',
        chosenClass: 'chosen-class',
        forceFallback: false
      },
      dragViewOptions: {
        group: {
          name: 'easyview'
        },
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      saveInit: '',
      initData: [
        {
          name: 'nearbyShop',
          base: {
            title: '附近商家',
            padded: true,
            show_coupon: true
          },
          seletedTags: []
        },
        {
          name: 'coupon',
          base: {
            title: '到店优惠',
            subtitle: '游客专享福利',
            padded: true
          },
          data: []
        },
        {
          name: 'goodsGrid',
          base: {
            title: '爆品直邮',
            subtitle: '宅家买遍全法',
            padded: true
          },
          config: {
            brand: true,
            showPrice: false,
            style: 'grid'
          },
          data: [
            {
              imgUrl: '',
              title: '',
              brand: '',
              goodsId: ''
            }
          ]
        },
        {
          name: 'goodsScroll',
          base: {
            title: '当地必买',
            subtitle: '看看大家都在买什么',
            padded: true
          },
          config: {
            seckillId: '',
            leaderboard: true,
            showPrice: false,
            type: 'goods'
          },
          data: [
            {
              imgUrl: '',
              title: '',
              brand: '',
              goodsId: ''
            }
          ]
        },
        {
          name: 'imgHotzone',
          base: {
            title: '热区图',
            subtitle: '图上随意画块块',
            padded: true
          },
          config: {
            imgUrl: ''
          },
          data: []
        },
        {
          name: 'navigation',
          base: {
            padded: true
          },
          data: [
            {
              imgUrl: '../../images/jichuhufu.png',
              linkPage: '',
              content: '基础护肤',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/caizhuangxiangshui.png',
              linkPage: '',
              content: '彩妆香水',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/yingyangbaojian.png',
              linkPage: '',
              content: '营养保健',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/manjianyouhui.png',
              linkPage: '',
              content: '满减优惠',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/fenxiangpindan.png',
              linkPage: '',
              content: '分享拼单',
              title: '',
              id: ''
            }
          ]
        },
        {
          name: 'search',
          base: {
            padded: false
          },
          config: {
            fixTop: false,
            scanCode: true
          }
        },
        {
          name: 'showcase',
          base: {
            title: '旅游资讯',
            subtitle: '',
            padded: true
          },
          config: {
            style: 1
          },
          data: [
            {
              imgUrl: '../../images/demo01.jpg',
              linkPage: '',
              content: '',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/demo02.jpg',
              linkPage: '',
              content: '',
              title: '',
              id: ''
            },
            {
              imgUrl: '../../images/demo03.jpg',
              linkPage: '',
              content: '',
              title: '',
              id: ''
            }
          ]
        },
        {
          name: 'slider',
          base: {
            title: '分享拼单',
            subtitle: '分享有好礼，拼单更便宜',
            padded: true
          },
          config: {
            current: 0,
            interval: 3000,
            spacing: 0,
            dot: 'true', // 是否显示导航
            dotLocation: 'right', // 导航位置
            dotColor: 'dark', // 导航颜色
            shape: 'circle', // 导航形状 circle rectangle dot-size-switch
            numNavShape: 'rect', // 'circle' 'rectangle' 数字导航的形状
            dotCover: true, // 导航是否覆盖轮播
            rounded: false, // 轮播是否有圆角
            padded: false, // 轮播的内间距
            content: true
          },
          data: []
        },
        // {
        //   name: 'marquees',
        //   base: {
        //     title: '',
        //     subtitle: '',
        //     padded: true
        //   },
        //   config: {
        //     direction: 'vertical',
        //     bgcolor: '',
        //     fontcolor: ''
        //   },
        //   data: []
        // },
        {
          name: 'store',
          base: {
            title: '推荐商铺',
            subtitle: '热门商铺，官方推荐',
            padded: true,
            backgroundColor: '#FFF',
            borderColor: '#FF6700',
            imgUrl: ''
          },
          data: [
            {
              id: '',
              name: '',
              logo: '',
              items: []
            }
          ],
          seletedTags: []
        }
      ],
      faverite: {
        name: 'faverite_type',
        base: {
          title: '猜你喜欢',
          subtitle: '',
          padded: true
        },
        config: {
          brand: false,
          showPrice: false,
          style: 'grid'
        },
        data: [
          {
            imgUrl: '',
            title: '',
            brand: '',
            goodsId: ''
          }
        ]
      },
      components: [],
      currentTab: 0,
      tabIcon: '',
      tabs: {
        name: 'tabs',
        config: {
          color: '#333333',
          selectedColor: '#1f82e0',
          backgroundColor: '#ffffff'
        },
        data: [
          {
            pagePath: '/pages/index',
            text: '首页',
            name: 'home',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/category/index',
            text: '分类',
            name: 'category',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/cart/espier-index',
            text: '购物车',
            name: 'cart',
            iconPath: '',
            selectedIconPath: ''
          },
          {
            pagePath: '/pages/member/index',
            text: '我的',
            name: 'member',
            iconPath: '',
            selectedIconPath: ''
          }
        ]
      },
      headerBg: header,
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      // 商品选择器
      goodsVisible: false,
      setItemStatus: false,
      relItemsIds: [],
      // 优惠券选择器
      couponsVisible: false,
      // 路径设置组件
      linksVisible: false,
      // 图标选择器
      iconsVisible: false,
      // 开启小程序定位
      isOpenLocation: true,
      // 开启猜你喜欢
      isOpenFaverite: true,
      // 开启扫码功能
      isOpenScancode: true,
      curStore: {},
    }
  },
  mounted() {
    if (this.system_mode === 'platform') {
      let index = this.initData.findIndex((n) => n.name == 'search')
      this.initData.splice(index, 1)
    }
  },
  computed: {
    page_template() {
      return this.usage === 'page'
    }
  },
  watch: {
    id: {
      handler(newName, oldName) {
        let filter = {
          template_name: 'yykweishop',
          version: `shop_${newName}`,
          page_name: 'shop_home'
        }
        this.page_template &&
          Object.assign(filter, {
            version: 'v1.0.1',
            page_name: `custom_${newName}`,
            template_name: this.template_name
          })
        getParamByTempName(filter).then((res) => {
          this.components = res.data.data.config
        })
      },
      immediate: true
    }
  },
  methods: {
    tagSelectVisibleHandle(type) {
      if (type == 'store') {
        this.storeID = this.components[this.editorIndex].data[0].id
      }

      this.tagSelectVisible = !this.tagSelectVisible
      if (this.tagSelectVisible) {
        this.tagType = type
      } else {
        this.tagType = ''
      }
    },
    seletedTagsHandle(seletedTags) {
      this.editorData.seletedTags = seletedTags // editor
      this.components[this.editorIndex].seletedTags = seletedTags // view

      // this.tagSelectVisibleHandle();
    },
    // 拖拽绑定事件
    onStart(evt) {
      if (evt.target.className === 'components-view') {
        this.saveInit = JSON.stringify(this.initData[evt.oldIndex])
      } else {
        this.setCurrent(evt.oldIndex)
      }
    },
    onEnd(evt) {
      this.setCurrent(evt.newIndex)
      if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
        this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      }
    },
    // 设置当前编辑的组件
    setCurrent(val) {
      this.editorIndex = val
      if (val === 'tabs') {
        this.editorData = { ...this.tabs }
      } else {
        this.editorData = { ...this.components[val] }
      }
    },
    // 删除当前组件
    removeCurrent() {
      this.$confirm('确认删除当前组件？')
        .then((_) => {
          this.editorData = {}
          this.components.splice(this.editorIndex, 1)
          this.editorIndex = null
          this.editorDataIndex = null
        })
        .catch((_) => {})
    },
    // 图片选择器绑定事件
    showImgs(index, tabIcon) {
      console.log('showImgs')
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        this.editorDataIndex = index
      }
      if (tabIcon) {
        this.tabIcon = tabIcon
      }
    },
    pickImg(data) {
      if (this.editorIndex === 'tabs') {
        if (this.tabIcon === 'default') {
          this.editorData.data[this.editorDataIndex].iconPath = data.url
          this.tabs.data[this.editorDataIndex].iconPath = data.url
        } else {
          this.editorData.data[this.editorDataIndex].selectedIconPath = data.url
          this.tabs.data[this.editorDataIndex].selectedIconPath = data.url
        }
      } else {
        if (this.components[this.editorIndex].name === 'imgHotzone') {
          this.components[this.editorIndex].config.imgUrl = data.url
        } else {
          this.components[this.editorIndex].data[this.editorDataIndex].imgUrl = data.url
        }
      }
      this.imgsVisible = false
    },
    closeimgsVisible() {
      this.imgsVisible = false
    },
    // 商品选择器绑定事件
    showGoods(index) {
      let ids = []
      let items = []
      if (index !== undefined) {
        this.editorDataIndex = index
        items = this.editorData.data[index].items
      } else {
        let s = this.components[this.editorIndex].base.listIndex
        if (this.editorData.name == 'goodsGridTab') {
          items = this.editorData.list[s].goodsList
        } else {
          items = this.editorData.data
        }
      }
      if (items && items.length > 0 && items[0].goodsId) {
        items.forEach((item) => {
          ids.push(item.key || item.goodsId)
        })
        let itemParams = {
          item_id: ids,
          page: 1,
          pageSize: 100,
          item_type: 'normal',
          audit_status: 'approved'
        }
        if (index !== undefined) {
          Object(itemParams, { distributor_id: this.relStore.id })
        }
        getItemsList(itemParams).then((res) => {
          this.relItemsIds = res.data.data.list
          setTimeout(() => {
            this.setItemStatus = true
            this.goodsVisible = true
          }, 500)
        })
      } else {
        this.relItemsIds = [{ goodsId: 0 }]
        setTimeout(() => {
          this.setItemStatus = true
          this.goodsVisible = true
        }, 500)
      }
    },
    pickGoods(data, store) {
      if (
        this.editorData.name === 'store' &&
        this.system_mode === 'platform' &&
        Number(store.id) == 0
      ) {
        this.$message({
          message: '推荐店铺不能为总店',
          type: 'error'
        })
        return false
      }

      if (this.editorDataIndex !== null) {
        console.log('store.id====', store.id)

        if (!store.id) {
          this.relItemsIds.splice(0)
          this.$message({
            message: '请选择店铺',
            type: 'error'
          })
          return
        }
      }

      /* 店铺标签逻辑 */
      if (this.components[this.editorIndex].name == 'store') {
        const oldStoreID = this.components[this.editorIndex].data[0].id
        console.log(store.id)
        if (oldStoreID != store.id) {
          this.editorData.seletedTags = [] // template
          this.components[this.editorIndex].seletedTags = [] //view
        }
        this.storeID = store.id
      }
       /* 店铺标签逻辑结束 */

      this.relItemsIds = data
      this.curStore = store
      let values = []

      if (data.length > 0) {
        data.forEach((item) => {
          let obj = {
            imgUrl: item.pics[0],
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price,
            distributor_id: item.distributor_id,
            itemEnName: item.item_en_name,
            promotionActivity: item.promotion_activity
          }
          values.push(obj)
        })
      }
      if (!this.editorDataIndex && this.editorDataIndex !== 0) {
        if (this.editorData.name == 'goodsGridTab') {
          // goodsGrid数据结构变化，数据另存到list里面
          let s = this.components[this.editorIndex].base.listIndex
          console.log(this.editorData.list[s].goodsList) // 源数据
          // if (values.length>=this.editorData.list[s].goodsList.length) {
          if (values.length>=1) {
            for (let i = 0; i < this.editorData.list[s].goodsList.length; i++) {
              for (let j = 0; j < values.length; j++) {
                if (this.editorData.list[s].goodsList[i].goodsId == values[j].goodsId) {
                  values.splice(j, 1)
                }
              }
            }
            values = [...this.editorData.list[s].goodsList, ...values]
          }
          console.log(values)
          // values = [...this.editorData.list[s].goodsList, ...values]
          this.editorData.list[s].goodsList = values
          this.components[this.editorIndex].list[s].goodsList = values
        } else {
          console.log(values) // 新数据
          console.log(this.editorData.data) // 源数据
          if (values.length>=1) {
            for (let i = 0; i < this.editorData.data.length; i++) {
              for (let j = 0; j < values.length; j++) {
                if (this.editorData.data[i].goodsId == values[j].goodsId) {
                  values.splice(j, 1)
                }
              }
            }
            values = [...this.editorData.data, ...values]
          }

          this.editorData.data = values
          this.components[this.editorIndex].data = values
        }
      } else {
        this.editorData.data[this.editorDataIndex].id = store.id
        this.editorData.data[this.editorDataIndex].name = store.name
        this.editorData.data[this.editorDataIndex].logo = store.logo
        this.editorData.data[this.editorDataIndex].items = values
        this.components[this.editorIndex].data[this.editorDataIndex].id = store.id
        this.components[this.editorIndex].data[this.editorDataIndex].name = store.name
        this.components[this.editorIndex].data[this.editorDataIndex].logo = store.logo
        this.components[this.editorIndex].data[this.editorDataIndex].items = values
      }
      this.goodsVisible = false
    },
    // 更新跑马灯数据
    updataArticle(data) {},
    // 优惠券选择器绑定事件
    showCoupons() {
      this.couponsVisible = true
    },
    pickCoupon(data) {
      this.editorData.data = data
      this.components[this.editorIndex].data = data
      this.couponsVisible = false
    },
    showLinks(index) {
      console.log('showLinks')
      this.linksVisible = true
      this.editorDataIndex = index
    },
    // 链接选择器绑定事件
    setLink(data, type) {
      this.editorData.data[this.editorDataIndex].id = data.id
      this.editorData.data[this.editorDataIndex].title = data.title
      this.editorData.data[this.editorDataIndex].linkPage = type
      this.components[this.editorIndex].data[this.editorDataIndex].id = data.id
      this.components[this.editorIndex].data[this.editorDataIndex].title = data.title
      this.components[this.editorIndex].data[this.editorDataIndex].linkPage = type
      this.linksVisible = false
    },
    // 选择器公用关闭事件
    closeDialog(key) {
      switch (key) {
        case 'coupon':
          this.couponsVisible = false
          break
        case 'link':
          this.linksVisible = false
          break
        case 'icon':
          this.iconsVisible = false
          break
        default:
          this.goodsVisible = false
      }
    },
    // 保存配置
    saveConfig() {
      let filter = {
        template_name: 'yykweishop',
        version: `shop_${this.id}`,
        config: JSON.stringify(this.components),
        page_name: 'shop_home'
      }
      this.page_template &&
        Object.assign(filter, {
          version: 'v1.0.1',
          page_name: `custom_${this.id}`,
          template_name: this.template_name
        })
      savePageParams(filter).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success',
            onClose: () => {
              this.$emit('saved', false)
            }
          })
        }
      })
    }
  }
}
</script>

<style  lang="scss">
.content-wrap {
  position: relative;
  height: 100%;
}
.content-view {
  height: 100%;
  overflow-y: overlay;
  .content {
    width: 320px;
    margin: 0 auto;
    .component-padded {
      padding: 10px 0;
    }
    .edit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 50%;
      width: 340px;
      bottom: 0;
      transform: translateX(-50%);
      transition: all 0.3s ease;
      button {
        width: 200px;
      }
    }
    &.is-edit {
      .edit-btn {
        background: rgba(31, 130, 224, 0.3);
        z-index: 999;
        opacity: 0;
      }
      &:hover {
        .edit-btn {
          opacity: 1;
        }
      }
    }
  }
}
.fallback-class {
  width: 50px;
  height: 50px;
}
.chosen-class {
  position: relative;
  height: 50px;
  text-align: center;
  .svg-icon {
    width: 26px;
    height: 26px;
  }
  &::after {
    position: absolute;
    top: 0;
    left: 50px;
    right: 50px;
    bottom: 0;
    background: #ffb28b;
    box-shadow: inset 0 0 0 2px #ff5000;
    content: '';
  }
}
.view-warp {
  position: relative;
}
.components-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 70px;
  .component-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    text-align: center;
    background: #fff;
    font-size: 12px;
    color: #999;
    .svg-icon {
      width: 26px;
      height: 26px;
      margin-bottom: 5px;
    }
  }
}
.template-view {
  width: 460px;
  margin-left:80px;
  overflow-y: overlay;
  background: #efefef;
  .template {
    position: relative;
    .template-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding-top: 20px;
      z-index: 99;
      background: #efefef;
      .template-title {
        width: 320px;
        height: 60px;
        margin: 0 auto;
        text-align: center;
        span {
          display: inline-block;
          padding-top: 30px;
        }
      }
    }
    .components-wrap {
      // height: calc(100vh - 170px);
      padding-top: 0px;
    }
    .section {
      margin-bottom: 10px;
    }
  }
}
.setting-view {
  position: absolute;
  left: 540px;
  top: 0;
  right: 0;
  height: 100%;
  .section {
    position: relative;
    height: 100%;
    .section-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: #f8f8f8;
      z-index: 20;
    }
    .section-body {
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 60px;
      height: 100%;
    }
  }
  .uploader-setting {
    flex: 1;
    padding-left: 10px;
    &:last-child {
      padding-right: 30px;
    }
  }
  [class^='el-'] + .goods-select {
    margin-top: 10px;
  }
  .goods-select {
    display: flex;
    justify-content: center;
    color: #8c939d;
    cursor: pointer;
    border: 1px dashed #ddd;
    padding: 0 10px;
    .link-content {
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      line-clamp: 2;
      box-orient: vertical;
    }
    i {
      font-size: 14px;
      margin-right: 5px;
      color: #999;
    }
    .thumb {
      display: inline-block;
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }

  .item-selected {
    .thumbnail {
      display: block;
      width: 60px;
      height: 60px;
      line-height: 55px;
      margin-right: 10px;
    }
  }
  .setting-item {
    display: flex;
    position: relative;
    margin-bottom: 10px;
    .setting-remove {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      // color: #ff5000;
    }
    .banner-uploader:last-child {
      margin-bottom: 0;
    }
  }
  .view-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #dadadd;
    font-size: 14px;
    .iconfont {
      font-size: 42px;
    }
  }
}
.global-setting {
  display: flex;
  align-items: center;
}
.btn-save {
  width: 200px;
  border-radius: 60px;
}
</style>

<style lang="scss">
// .components-container {
//   position: relative;
//   padding-top: 80px;
//   padding-bottom: 69px;
//   overflow-y: overlay;
//   height: calc(100vh - 170px);
//   .components-wrap {
//     height: 100%;
//   }
//   &.componentFixed {
//     padding-top: 58.5px;
//   }
//   &.is-distributor {
//     padding-top: 40px;
//   }
//   &.componentFixed.is-distributor {
//     padding-top: 98.5px;
//   }

//   .component-item {
//     position: relative;
//     .icon-trash-alt {
//       position: absolute;
//       right: 20px;
//       color: #ff5000;
//       cursor: pointer;
//     }
//   }
//   .component-wrap {
//     position: relative;
//     width: 320px;
//     margin: 0 auto;
//     cursor: pointer;
//     background: #fff;
//     &.component-padded {
//       padding: 10px 0;
//     }
//     .current-active {
//       position: absolute;
//       left: -3px;
//       top: -3px;
//       right: -3px;
//       bottom: -3px;
//       border: 3px solid #ff5000;
//       z-index: -1;
//       opacity: 0;
//       box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
//       background: rgba(255, 80, 0, 0.2);
//       transition: all 0.3s ease;
//     }
//     &.active .current-active {
//       opacity: 1;
//       z-index: 999;
//     }
//     .component-header {
//       display: flex;
//       align-items: center;
//       padding: 0 10px 5px 10px;
//       .component-title {
//         display: flex;
//         align-items: flex-end;
//         flex: 1;
//         font-size: 16px;
//         &.middle {
//           align-items: center;
//         }
//         .subtitle {
//           padding-left: 5px;
//           font-size: 12px;
//           color: #999;
//         }
//       }
//       .component-more {
//         display: flex;
//         justify-content: center;
//         width: 25px;
//         .three-dot {
//           position: relative;
//           width: 4px;
//           height: 4px;
//           background: #333;
//           border-radius: 50%;
//           &::before,
//           &::after {
//             position: absolute;
//             width: 4px;
//             height: 4px;
//             background: #333;
//             border-radius: 50%;
//             content: '';
//           }
//           &::before {
//             transform: translateX(-160%);
//           }
//           &::after {
//             transform: translateX(160%);
//           }
//         }
//       }
//     }
//     .component-body {
//       &.with-padding {
//         padding: 0 10px;
//       }
//     }
//   }
// }
.components-container {
  position: relative;
  padding-top: 80px;
  padding-bottom: 69px;
  // overflow-y: overlay;
  height: calc(100vh - 170px);
  .components-wrap {
    height: 100%;

    &.edit{
      padding-top: 0px;
      padding-bottom:69px;
    }
  }
  &.componentFixed {
    padding-top: 58.5px;
  }
  &.is-distributor {
    padding-top: 40px;
  }
  &.componentFixed.is-distributor {
    padding-top: 98.5px;
  }
  .component-item {
    position: relative;
    .icon-trash-alt {
      position: absolute;
      right: 20px;
      color: #ff5000;
      cursor: pointer;
    }
  }
  .component-wrap {
    position: relative;
    width: 320px;
    margin: 0 auto;
    cursor: pointer;
    background: #fff;
    &.component-padded {
      padding: 10px 0;
    }
    .current-active {
      position: absolute;
      left: -3px;
      top: -3px;
      right: -3px;
      bottom: -3px;
      border: 3px solid #ff5000;
      z-index: -1;
      opacity: 0;
      box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
      background: rgba(255, 80, 0, 0.2);
      transition: all 0.3s ease;
    }
    &.active .current-active {
      opacity: 1;
      z-index: 999;
    }
    .component-header {
      display: flex;
      align-items: center;
      padding: 0 10px 5px 10px;
      .component-title {
        display: flex;
        align-items: flex-end;
        flex: 1;
        font-size: 16px;
        &.middle {
          align-items: center;
        }
        .subtitle {
          padding-left: 5px;
          font-size: 12px;
          color: #999;
        }
      }
      .component-more {
        display: flex;
        justify-content: center;
        width: 25px;
        .three-dot {
          position: relative;
          width: 4px;
          height: 4px;
          background: #333;
          border-radius: 50%;
          &::before,
          &::after {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #333;
            border-radius: 50%;
            content: '';
          }
          &::before {
            transform: translateX(-160%);
          }
          &::after {
            transform: translateX(160%);
          }
        }
      }
    }
    .component-body {
      &.with-padding {
        padding: 0 10px;
      }
    }
  }
}
.icon-setter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  border: 1px dashed #ddd;
  .svg-icon {
    width: 30px;
    height: 30px;
  }
}
.banner-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  line-height: 1.3;
  color: #dadadd;
  border: 1px dashed #ddd;
  cursor: pointer;
  &.square {
    width: 90px;
    height: 90px;
  }
  i {
    font-size: 30px;
  }
}
.uploader-setting {
  flex: 1;
  padding-left: 10px;
  &:last-child {
    padding-right: 30px;
  }
}
.goods-select {
  display: flex;
  justify-content: center;
  color: #8c939d;
  cursor: pointer;
  border: 1px dashed #ddd;
  padding: 0 10px;
  .link-content {
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-clamp: 2;
    box-orient: vertical;
  }
  i {
    font-size: 14px;
    margin-right: 5px;
    color: #999;
  }
  .thumb {
    display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-right: 10px;
  }
}
[class^='el-'] + .goods-select {
  margin-top: 10px;
}
.setting-view {
  .section {
    position: relative;
    height: 100%;
    .section-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: #f8f8f8;
      z-index: 20;
    }
    .section-body {
      overflow-y: auto;
      overflow-x: hidden;
      padding-top: 60px;
      height: 100%;
    }
  }
}
.content-bottom-padded{
  margin: 10px 0;
  border: 1px solid #ddd;
  padding: 20px 10px 10px 10px;
}
.setting-item {
  display: flex;
  position: relative;
  margin-bottom: 10px;
  .settingRemove {
    position: absolute;
    top: -10px;
    right: 10px;
    cursor: pointer;
    color: #ddd;
    display: none;
  }
  .active{
    display: block;
  }
  .banner-uploader:last-child {
    margin-bottom: 0;
  }
  .title{
    flex: 1;
    height: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-height: 20px;
    padding-top: 10px;
    padding-right: 10px;

    font-size: 13px;
    -webkit-box-orient: vertical;
  }
}
.el-form-item__content .setting-item:last-child {
  margin-bottom: 0;
}
.item-selected {
  .thumbnail {
    display: block;
    width: 60px;
    height: 60px;
    line-height: 55px;
    margin-right: 10px;
    border-radius: 4px;
  }
}
</style>


