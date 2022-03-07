<template>
  <div>
    <section class="section-white view-flex view-flex-middle">
      <draggable
        v-model="initData"
        :options="dragIssuesOptions"
        class="components-view"
        @start="onStart"
        @end="onEnd"
      >
        <div
          v-for="(item, index) in initData"
          class="component-control"
        >
          <template v-if="item.name === 'coupon'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-tag" />
            </svg>
            优惠券
          </template>
          <template v-if="item.name === 'film'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-video" />
            </svg>
            视频
          </template>
          <template v-if="item.name === 'goodsGrid'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-grid" />
            </svg>
            商品栅格
          </template>
          <template v-if="item.name === 'goodsScroll'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-scroll" />
            </svg>
            商品滚动
          </template>
          <template v-if="item.name === 'imgHotzone'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-hotzone" />
            </svg>
            热区图
          </template>
          <template v-if="item.name === 'marquees'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-marquees" />
            </svg>
            文字轮播
          </template>
          <template v-if="item.name === 'navigation'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-navigation" />
            </svg>
            图片导航
          </template>
          <template v-if="item.name === 'search'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-search" />
            </svg>
            搜索
          </template>
          <template v-if="item.name === 'showcase'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-showcase" />
            </svg>
            橱窗
          </template>
          <template v-if="item.name === 'slider'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-slider" />
            </svg>
            轮播
          </template>
          <template v-if="item.name === 'store' && VERSION_PLATFORM">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-store" />
            </svg>
            推荐店铺
          </template>
        </div>
      </draggable>
      <el-button
        type="text"
        @click="handleShowConfig"
      >
        <i class="iconfont icon-cog" /> 小程序设置
      </el-button>
    </section>
    <section class="section section-white view-warp">
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
          <draggable
            v-model="components"
            :options="dragViewOptions"
            class="components-wrap"
            :style="'height: ' + (wheight - 240) + 'px;'"
            @start="onStart"
            @end="onEnd"
          >
            <div
              v-for="(item, index) in components"
              :key="index"
              class="component-item"
              @click="setCurrent(index)"
            >
              <transition name="el-fade-in-linear">
                <div
                  v-if="editorIndex === index"
                  class="iconfont icon-trash-alt"
                  @click="removeCurrent"
                />
              </transition>
              <coupon
                v-if="item.name === 'coupon'"
                :res="item"
                :active="index == editorIndex"
              />
              <film
                v-if="item.name === 'film'"
                :res="item"
                :active="index == editorIndex"
              />
              <goodsGrid
                v-if="item.name === 'goodsGrid'"
                :res="item"
                :active="index == editorIndex"
              />
              <goodsScroll
                v-if="item.name === 'goodsScroll'"
                :res="item"
                :active="index == editorIndex"
              />
              <imgHotzone
                v-if="item.name === 'imgHotzone'"
                :res="item"
                :active="index == editorIndex"
              />
              <marquees
                v-if="item.name === 'marquees'"
                :res="item"
                :active="index == editorIndex"
              />
              <navigation
                v-if="item.name === 'navigation'"
                :res="item"
                :active="index == editorIndex"
              />
              <search
                v-if="item.name === 'search'"
                :res="item"
                :active="index == editorIndex"
              />
              <showcase
                v-if="item.name === 'showcase'"
                :res="item"
                :active="index == editorIndex"
              />
              <slider
                v-if="item.name === 'slider'"
                :res="item"
                :active="index == editorIndex"
              />
              <store
                v-if="item.name === 'store' && VERSION_PLATFORM"
                :res="item"
                :active="index == editorIndex"
              />
            </div>
            <goodsGrid
              v-if="isOpenFaverite && faverite.length"
              :res="faverite"
            />
          </draggable>
          <div class="template-footer">
            <div
              class="template-tabs"
              :class="{ 'active': editorIndex === 'tabs' }"
              :style="{ background: tabs.config.backgroundColor, color: tabs.config.color }"
              @click="setCurrent('tabs')"
            >
              <div class="current-active" />
              <div
                v-for="(item, index) in tabs.data"
                :key="index"
                class="tab"
                :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''"
              >
                <svg
                  v-if="!item.iconPath"
                  class="svg-icon"
                  aria-hidden="true"
                  :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''"
                >
                  <use :xlink:href="`#icon-${item.name}`" />
                </svg>
                <template v-else>
                  <img
                    v-if="index === currentTab"
                    class="svg-icon"
                    :src="
                      item.selectedIconPath ||
                        'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icofont=lobster'
                    "
                  >
                  <img
                    v-else
                    class="svg-icon"
                    :src="
                      item.iconPath || 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icon&font=lobster'
                    "
                  >
                </template>
                <div class="tab-text">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-view">
        <div
          v-if="editorIndex === null"
          class="view-placeholder"
        >
          <i class="iconfont icon-shapes" />
          请选择左侧挂件
        </div>
        <template v-else>
          <couponEditor
            :res="editorData"
            @bindCoupons="showCoupons"
            @bindImgs="showImgs"
          />
          <filmEditor
            :res="editorData"
            @change="getVideo"
          />
          <goodsGridEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindLinks="showLinks"
          />
          <goodsScrollEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindLinks="showLinks"
          />
          <imgHotzoneEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          />
          <marqueesEditor
            :res="editorData"
            @change="updataArticle"
          />
          <navigationEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          />
          <searchEditor :res="editorData" />
          <showcaseEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          />
          <sliderEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          />
          <storeEditor
            :res="editorData"
            @bindGoods="showGoods"
          />
          <tabsEditor
            :res="editorData"
            @bindImgs="showImgs"
          />
        </template>
      </div>
    </section>
    <section class="content-padded-s section-white content-center">
      <el-button
        class="btn-save"
        type="primary"
        @click="saveConfig"
      >
        保存
      </el-button>
    </section>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeimgsVisible"
    />
    <linkSetter
      :visible="linksVisible"
      :template_name="template_name"
      @setLink="setLink"
      @closeDialog="closeDialog"
    />
    <goodsSelect
      :items-visible="goodsVisible"
      :get-status="setItemStatus"
      :rel-store="relStore"
      :rel-items-ids="relItemsIds"
      @chooseStore="pickGoods"
      @closeStoreDialog="closeDialog"
    />
    <couponPicker
      :visible="couponsVisible"
      @pickCoupon="pickCoupon"
      @closeDialog="closeDialog"
    />
    <sideBar
      :visible.sync="show_sideBar"
      :title="'小程序设置'"
      width="20"
    >
      <el-form label-width="120px">
        <el-form-item label="开启猜你喜欢">
          <el-switch
            v-model="isOpenFaverite"
            :active-value="true"
            :inactive-value="false"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
        <el-form-item label="开启小程序定位">
          <el-switch
            v-model="isOpenLocation"
            :active-value="true"
            :inactive-value="false"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
        <el-form-item label="开启扫码功能">
          <el-switch
            v-model="isOpenScancode"
            :active-value="true"
            :inactive-value="false"
            active-color="#27cc6a"
            inactive-color="#efefef"
          />
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>

<script>
const img = require('@/assets/img/demo-img.jpg')
const header = require('@/assets/img/topbar.png')
import { mapGetters } from 'vuex'
// 组件
import sideBar from '@/components/element/sideBar'
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'
import goodsSelect from '@/components/goodsSelect'
import couponPicker from '@/components/coupon_picker'
// 店铺装修组件
// view层组件
import coupon from '@/components/template/coupon'
import film from '@/components/template/film'
import goodsGrid from '@/components/template/goods_grid'
import goodsScroll from '@/components/template/goods_scroll'
import imgHotzone from '@/components/template/img_hotzone'
import marquees from '@/components/template/marquees'
import navigation from '@/components/template/navigation'
import search from '@/components/template/search'
import showcase from '@/components/template/showcase'
import slider from '@/components/template/slider'
import store from '@/components/template/store'

// control层组件
import couponEditor from '@/components/template_editor/coupon'
import filmEditor from '@/components/template_editor/film'
import goodsGridEditor from '@/components/template_editor/goods_grid'
import goodsScrollEditor from '@/components/template_editor/goods_scroll'
import imgHotzoneEditor from '@/components/template_editor/img_hotzone'
import marqueesEditor from '@/components/template_editor/marquees'
import navigationEditor from '@/components/template_editor/navigation'
import searchEditor from '@/components/template_editor/search'
import showcaseEditor from '@/components/template_editor/showcase'
import sliderEditor from '@/components/template_editor/slider'
import storeEditor from '@/components/template_editor/store'
import tabsEditor from '@/components/template_editor/tab_bar'

// 第三方组件
import draggable from 'vuedraggable'

// api
import { savePageParams, getParamByTempName } from '@/api/wxa'
import { getRecommendLikeItemList } from '@/api/promotions'
import { getItemsList } from '@/api/goods'

export default {
  components: {
    coupon,
    film,
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
    filmEditor,
    goodsGridEditor,
    goodsScrollEditor,
    imgHotzoneEditor,
    marqueesEditor,
    navigationEditor,
    searchEditor,
    showcaseEditor,
    sliderEditor,
    storeEditor,
    tabsEditor,
    // 其他组件
    imgPicker,
    linkSetter,
    goodsSelect,
    couponPicker,
    sideBar,
    // 第三方组件
    draggable
  },
  data () {
    return {
      show_sideBar: false,
      componentHeight: '',
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
          name: 'coupon',
          base: {
            title: '到店优惠',
            subtitle: '游客专享福利',
            padded: true
          },
          data: [
            {
              type: 'cash',
              id: '',
              amount: '50',
              imgUrl: '../../images/coupon_brand_demo.jpg',
              title: '巴黎欧莱雅',
              desc: '全场商品满900减50'
            },
            {
              type: 'discount',
              id: '',
              amount: '8',
              imgUrl: '../../images/coupon_brand_demo.jpg',
              title: '巴黎欧莱雅',
              desc: '全场商品满900减50'
            },
            {
              type: 'cash',
              id: '',
              amount: '100',
              imgUrl: '../../images/coupon_brand_demo.jpg',
              title: '巴黎欧莱雅',
              desc: '全场商品满900减50'
            }
          ]
        },
        {
          name: 'film',
          base: {
            title: '',
            subtitle: '',
            padded: true
          },
          data: [
            {
              media_id: '',
              name: '',
              update_time: '',
              url: ''
            }
          ]
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
            style: 'grid',
            moreLink: {
              id: '',
              title: '',
              linkPage: ''
            }
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
            type: 'goods',
            moreLink: {
              id: '',
              title: '',
              linkPage: ''
            }
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
        {
          name: 'marquees',
          base: {
            title: '',
            subtitle: '',
            padded: true
          },
          config: {
            direction: 'vertical',
            bgcolor: '',
            fontcolor: '',
            label: '',
            labelcolor: ''
          },
          data: []
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
      relStore: {},
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
      isOpenScancode: true
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  async mounted () {
    if (this.VERSION_PLATFORM) {
      this.initData = [
        ...this.initData,
        {
          name: 'store',
          base: {
            title: '推荐商铺',
            subtitle: '热门商铺，官方推荐',
            padded: true
          },
          data: [
            {
              id: '',
              name: '',
              logo: '',
              items: []
            }
          ]
        }
      ]
    }
    const faverite = await getRecommendLikeItemList()
    let data = []
    faverite.data.data.list.forEach((item) => {
      data.push({
        imgUrl: item.pics[0],
        title: item.itemName,
        goodsId: item.itemId
      })
    })
    this.faverite.data = data

    const templateParam = {
      template_name: this.template_name,
      version: 'v1.0.1',
      page_name: 'index'
    }
    const template = await getParamByTempName(templateParam)
    if (template.data.data.config.length !== 0) {
      this.components = template.data.data.config
    } else {
      this.components = [...this.initData]
    }
    this.components.forEach((item) => {
      if (item.name === 'setting') {
        this.isOpenLocation = item.config.location
        this.isOpenFaverite = item.config.faverite
        this.isOpenScancode = item.config.scancode
      }
    })
    const tabBarParam = {
      template_name: this.template_name,
      version: 'v1.0.1',
      page_name: 'tabs'
    }
    const tabBar = await getParamByTempName(tabBarParam)
    Object.assign(this.tabs, tabBar.data.data.list[0].params)
  },
  methods: {
    handleShowConfig () {
      this.show_sideBar = true
    },
    // 拖拽绑定事件
    onStart (evt) {
      if (evt.target.className === 'components-view') {
        this.saveInit = JSON.stringify(this.initData[evt.oldIndex])
      } else {
        this.setCurrent(evt.oldIndex)
      }
    },
    onEnd (evt) {
      this.setCurrent(evt.newIndex)
      if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
        this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      }
    },
    // 设置当前编辑的组件
    setCurrent (val) {
      this.editorIndex = val
      if (val === 'tabs') {
        this.editorData = { ...this.tabs }
      } else {
        this.editorData = { ...this.components[val] }
      }
    },
    // 删除当前组件
    removeCurrent () {
      this.$confirm('确认删除当前组件？')
        .then((_) => {
          this.editorData = {}
          this.components.splice(this.editorIndex, 1)
          this.editorIndex = null
          this.editorDataIndex = null
        })
        .catch((_) => {})
    },
    // 视频选择器绑定事件
    getVideo (data) {
      Object.assign(this.editorData.data[0], data)
      Object.assign(this.components[this.editorIndex].data[0], data)
    },
    // 图片选择器绑定事件
    showImgs (index, tabIcon) {
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        this.editorDataIndex = index
      }
      if (tabIcon) {
        this.tabIcon = tabIcon
      }
    },
    pickImg (data) {
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
    closeimgsVisible () {
      this.imgsVisible = false
    },
    // 商品选择器绑定事件
    showGoods (index) {
      let ids = []
      let items = []
      if (index !== undefined) {
        this.editorDataIndex = index
        items = this.editorData.data[index].items
      } else {
        items = this.editorData.data
      }
      if (items.length > 0 && items[0].goodsId) {
        items.forEach((item) => {
          ids.push(item.key || item.goodsId)
        })
        let itemParams = {
          item_id: ids,
          page: 1,
          pageSize: 100,
          item_type: 'normal'
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
    pickGoods (data, store) {
      console.log(this.editorDataIndex)
      if (this.editorDataIndex !== null) {
        if (!store.id) {
          this.relItemsIds.splice(0)
          this.$message({
            message: '请选择店铺',
            type: 'error'
          })
          return
        }
      }
      this.relItemsIds = data
      this.relStore = store
      let values = []
      if (data.length > 0) {
        data.forEach((item) => {
          let obj = {
            imgUrl: item.pics[0],
            title: item.itemName,
            goodsId: item.itemId,
            brand: item.brand_logo,
            price: item.price
          }
          values.push(obj)
        })
      }
      if (!this.editorDataIndex && this.editorDataIndex !== 0) {
        this.editorData.data = values
        this.components[this.editorIndex].data = values
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
    updataArticle (data) {},
    // 优惠券选择器绑定事件
    showCoupons () {
      this.couponsVisible = true
    },
    pickCoupon (data) {
      this.editorData.data = data
      this.components[this.editorIndex].data = data
      this.couponsVisible = false
    },
    showLinks (index) {
      this.linksVisible = true
      if (index !== undefined) {
        this.editorDataIndex = index
      }
    },
    // 链接选择器绑定事件
    setLink (data, type) {
      if (this.editorDataIndex !== null) {
        this.editorData.data[this.editorDataIndex].id = data.id
        this.editorData.data[this.editorDataIndex].title = data.title
        this.editorData.data[this.editorDataIndex].linkPage = type
        this.components[this.editorIndex].data[this.editorDataIndex].id = data.id
        this.components[this.editorIndex].data[this.editorDataIndex].title = data.title
        this.components[this.editorIndex].data[this.editorDataIndex].linkPage = type
        this.linksVisible = false
      } else {
        this.editorData.config.moreLink.id = data.id
        this.editorData.config.moreLink.title = data.title
        this.editorData.config.moreLink.linkPage = type
        this.components[this.editorIndex].config.moreLink.id = data.id
        this.components[this.editorIndex].config.moreLink.title = data.title
        this.components[this.editorIndex].config.moreLink.linkPage = type
      }
      // 处理完 恢复
      this.editorDataIndex = null
    },
    // 选择器公用关闭事件
    closeDialog (key) {
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
    async saveConfig () {
      let hasLocation = this.components.findIndex((item) => item.name === 'setting')

      if (hasLocation == -1) {
        this.components.push({
          name: 'setting',
          base: {},
          config: {
            location: this.isOpenLocation,
            faverite: this.isOpenFaverite,
            scancode: this.isOpenScancode
          }
        })
      } else {
        this.components.forEach((item) => {
          if (item.name === 'setting') {
            item.config = {
              location: this.isOpenLocation,
              faverite: this.isOpenFaverite,
              scancode: this.isOpenScancode
            }
          }
        })
      }

      let filter = {
        template_name: this.template_name,
        config: JSON.stringify(this.components),
        page_name: 'index'
      }
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.tabs]),
        page_name: 'tabs'
      }
      const template = await savePageParams(filter)
      const tabBar = await savePageParams(param)
      if (template && tabBar) {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
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
.components-view {
  display: flex;
  align-items: center;
  flex: 1;
  .component-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
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
.view-warp {
  position: relative;
}
.template-view {
  width: 420px;
  overflow-y: auto;
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
    .template-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding-bottom: 20px;
      z-index: 99;
      background: #efefef;
      .template-tabs {
        position: relative;
        display: flex;
        width: 320px;
        height: 49px;
        margin: 0 auto;
        border-top: 1px solid rgba(0, 0, 0, 0.3);
        .tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 49px;
          text-align: center;
          .svg-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 3px;
          }
          .tab-text {
            font-size: 11px;
            line-height: 1.2;
          }
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
      }
    }
    .section {
      margin-bottom: 10px;
    }
  }
}
.setting-view {
  position: absolute;
  left: 420px;
  top: 0;
  right: 0;
  height: 100%;
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

<style lang="scss" scoped>
.components-wrap {
  position: relative;
  padding-top: 80px;
  padding-bottom: 69px;
  overflow-y: overlay;
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
  width: 200px;
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
    -webkit-line-clamp: 1;
    /* autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
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
.setting-item {
  display: flex;
  position: relative;
  margin-bottom: 10px;
  .setting-remove {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    color: #ff5000;
  }
  .banner-uploader:last-child {
    margin-bottom: 0;
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
  }
}
</style>
