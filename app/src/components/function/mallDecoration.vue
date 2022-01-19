<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="relStore.id == '0' ? '编辑小程序模板' : '编辑店铺首页'"
    fullscreen
    lock-scroll
    :before-close="cancelAction"
  >
    <section class="section section-white view-warp">
      <draggable
        v-model="initData"
        :options="dragIssuesOptions"
        @start="onStart"
        @end="onEnd"
        class="components-view"
      >
        <div v-for="(item, index) in initData" :key="index" class="component-control">
          <template
            v-if="
              item.name === 'nearbyShop' &&
              system_mode === 'platform' &&
              $store.getters.login_type !== 'distributor'
            "
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
          <template v-if="item.name === 'film'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-video"></use>
            </svg>
            视频
          </template>
          <template v-if="item.name === 'goodsGrid'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-grid"></use>
            </svg>
            商品栅格
          </template>
          <template v-if="item.name === 'goodsGridTab'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-grid"></use>
            </svg>
            商品Tab
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
          <template v-if="item.name === 'marquees'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-marquees"></use>
            </svg>
            文字轮播
          </template>
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
          <template
            v-if="
              item.name === 'store' &&
              system_mode === 'platform' &&
              $store.getters.login_type !== 'distributor'
            "
          >
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-store"></use>
            </svg>
            推荐店铺
          </template>

          <template v-if="item.name === 'floorImg'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            楼层图片
          </template>

          <!-- <template v-if="item.name === 'floorImg-two'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            楼层图片2
          </template> -->
          <template v-if="item.name === 'headline'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            文字标题
          </template>
          <template v-if="item.name === 'img-gif'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            视频图
          </template>

          <template v-if="item.name === 'hotTopic'">
            <svg class="svg-icon" aria-hidden="true">
              <use xlink:href="#icon-slider"></use>
            </svg>
            热点话题
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
            <div v-if="relStore.id != '0' && element_edit_status == 2">
              <div class="component-item" :key="index" v-for="(item, index) in platformComponents">
                <coupon v-if="item.name === 'coupon'" :res="item"></coupon>
                <film v-if="item.name === 'film'" :res="item"></film>
                <goodsGrid v-if="item.name === 'goodsGrid'" :res="item"></goodsGrid>
                <goodsGridTab v-if="item.name === 'goodsGridTab'" :res="item"></goodsGridTab>
                <goodsScroll v-if="item.name === 'goodsScroll'" :res="item"></goodsScroll>
                <imgHotzone v-if="item.name === 'imgHotzone'" :res="item"></imgHotzone>
                <marquees v-if="item.name === 'marquees'" :res="item"></marquees>
                <navigation v-if="item.name === 'navigation'" :res="item"></navigation>
                <search v-if="item.name === 'search'" :res="item"></search>
                <showcase v-if="item.name === 'showcase'" :res="item"></showcase>
                <slider v-if="item.name === 'slider'" :res="item"></slider>
                <floorImg v-if="item.name === 'floorImg'" :res="item"></floorImg>
                <!-- <floorImgTwo v-if="item.name === 'floorImg-two'" :res="item"></floorImgTwo> -->
                <headline v-if="item.name === 'headline'" :res="item"></headline>
                <hotTopic v-if="item.name === 'hotTopic'" :res="item"></hotTopic>
                <imgGif v-if="item.name === 'img-gif'" :res="item"></imgGif>
                <store
                  v-if="item.name === 'store' && system_mode === 'platform'"
                  :res="item"
                ></store>
              </div>
            </div>
            <draggable
              v-model="components"
              :options="dragViewOptions"
              @start="onStart"
              @end="onEnd"
              class="components-wrap"
            >
              <div
                class="component-item"
                :key="index"
                v-for="(item, index) in components"
                @click="setCurrent(index)"
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
                <film v-if="item.name === 'film'" :res="item" :active="index == editorIndex"></film>
                <goodsGrid
                  v-if="item.name === 'goodsGrid'"
                  :res="item"
                  :active="index == editorIndex"
                ></goodsGrid>
                <goodsGridTab
                  v-if="item.name === 'goodsGridTab'"
                  :res="item"
                  :active="index == editorIndex"
                ></goodsGridTab>
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
                <floorImg
                  v-if="item.name === 'floorImg'"
                  :res="item"
                  :active="index == editorIndex"
                ></floorImg>
                <!-- <floorImgTwo v-if="item.name === 'floorImg-two'" :res="item" :active="index == editorIndex"></floorImgTwo> -->
                <headline
                  v-if="item.name === 'headline'"
                  :res="item"
                  :active="index == editorIndex"
                ></headline>
                <hotTopic
                  v-if="item.name === 'hotTopic'"
                  :res="item"
                  :active="index == editorIndex"
                ></hotTopic>
                <imgGif
                  v-if="item.name === 'img-gif'"
                  :res="item"
                  :active="index == editorIndex"
                ></imgGif>
                <store
                  v-if="item.name === 'store' && system_mode === 'platform'"
                  :res="item"
                  :active="index == editorIndex"
                ></store>
              </div>
              <goodsGrid v-if="showLike == 1 && faverite.data.length" :res="faverite"></goodsGrid>
            </draggable>
          </div>

          <!-- <div class="template-footer">
            <div class="template-tabs" :style="{ background: tabs.config.backgroundColor, color: tabs.config.color }">
              <div class="tab" v-for="(item, index) in tabs.data" :key="index" :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''">
                <svg v-if="!item.iconPath" class="svg-icon" aria-hidden="true" :style="index === currentTab ? `color:${tabs.config.selectedColor}` : ''">
                  <use :xlink:href="`#icon-${item.name}`"></use>
                </svg>
                <template v-else>
                  <img v-if="index === currentTab" class="svg-icon" :src="item.selectedIconPath || 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icofont=lobster'" />
                  <img v-else class="svg-icon" :src="item.iconPath || 'https://fakeimg.pl/60x60/EFEFEF/CCC/?text=icon&font=lobster'" />
                </template>
                <div class="tab-text">{{item.text}}</div>
              </div>
            </div>
          </div> -->
        </div>
      </div>

      <div class="setting-view">
        <div class="view-placeholder" v-if="editorIndex === null">
          <i class="iconfont icon-shapes"></i>
          请选择左侧挂件
        </div>
        <template v-else>
          <!-- {{editorData}} -->
          <nearbyShopEditor :res="editorData" @tagSelectVisibleHandle="tagSelectVisibleHandle">
          </nearbyShopEditor>
          <couponEditor
            :res="editorData"
            @bindCoupons="showCoupons"
            @bindImgs="showImgs"
            @couponPackageVisible="pickHandle"
          ></couponEditor>
          <filmEditor :res="editorData" @change="getVideo" @radioChange="radioChange"></filmEditor>
          <goodsGridEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindLinks="showLinks"
          ></goodsGridEditor>
          <goodsGridTabEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindLinks="showLinks"
          ></goodsGridTabEditor>
          <goodsScrollEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindLinks="showLinks"
            @bindImgs="showImgs"
          ></goodsScrollEditor>
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
          <searchEditor :res="editorData"></searchEditor>
          <showcaseEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          ></showcaseEditor>

          <sliderEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          ></sliderEditor>

          <floorImgEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          ></floorImgEditor>
          <!-- <floorImgTwoEditor :res="editorData" @bindImgs="showImgs" @bindLinks="showLinks"></floorImgTwoEditor> -->
          <headlineEditor :res="editorData"></headlineEditor>
          <hotTopicEditor :res="editorData" @bindLinks="showLinks"></hotTopicEditor>
          <imgGifEditor :res="editorData" @bindImgs="showImgs"></imgGifEditor>
          <storeEditor
            :res="editorData"
            @bindGoods="showGoods"
            @bindImgs="showImgs"
            @tagSelectVisibleHandle="tagSelectVisibleHandle"
          ></storeEditor>
        </template>
      </div>
    </section>
    <section class="section-white content-center">
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
      :rel-store="curStore"
      :lock-store="relStore.id == '0' ? false : true"
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
    <!-- 选择优惠券包 -->
    <template v-if="couponPackageVisible">
      <couponPackageSelect
        :seletedCouponPackage="editorData.voucher_package"
        :visible="couponPackageVisible"
        @openHandle="pickHandle"
        @closeHandle="closeHandle"
        @seletedDataHandle="seletedDataHandle"
        @bindImgs="showImgs"
      ></couponPackageSelect>
    </template>
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
  </el-dialog>
</template>

<script>
const img = require('@/assets/img/demo-img.jpg')
const header = require('@/assets/img/topbar.png')
import { mapGetters } from 'vuex'
// 组件
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'
import goodsSelect from '@/components/goodsSelect'
import couponPicker from '@/components/coupon_picker'
import couponPackageSelect from '@/components/couponPackageSelect'
import TagSelect from '@/components/new_tagselect'
// 店铺装修组件
// view层组件
import coupon from '@/components/template/coupon'
import film from '@/components/template/film'
import goodsGrid from '@/components/template/goods_grid'
import goodsGridTab from '@/components/template/goods_grid_tab'
import goodsScroll from '@/components/template/goods_scroll'
import imgHotzone from '@/components/template/img_hotzone'
import marquees from '@/components/template/marquees'
import navigation from '@/components/template/navigation'
import search from '@/components/template/search'
import showcase from '@/components/template/showcase'
import slider from '@/components/template/slider'
import store from '@/components/template/store' //推荐商铺
import floorImg from '@/components/template/floorImg'
import floorImgTwo from '@/components/template/floorImg-two'
import headline from '@/components/template/headline'
import hotTopic from '@/components/template/hotTopic'
import imgGif from '@/components/template/img-gif'
import nearbyShop from '@/components/template/nearby_shop'

// control层组件
import couponEditor from '@/components/template_editor/coupon'
import filmEditor from '@/components/template_editor/film'
import goodsGridEditor from '@/components/template_editor/goods_grid'
import goodsGridTabEditor from '@/components/template_editor/goods_grid_tab'
import goodsScrollEditor from '@/components/template_editor/goods_scroll'
import imgHotzoneEditor from '@/components/template_editor/img_hotzone'
import marqueesEditor from '@/components/template_editor/marquees'
import navigationEditor from '@/components/template_editor/navigation'
import searchEditor from '@/components/template_editor/search'
import showcaseEditor from '@/components/template_editor/showcase'
import sliderEditor from '@/components/template_editor/slider'
import storeEditor from '@/components/template_editor/store'
import floorImgEditor from '@/components/template_editor/floorImg'
import floorImgTwoEditor from '@/components/template_editor/floorImg-two'
import headlineEditor from '@/components/template_editor/headline'
import hotTopicEditor from '@/components/template_editor/hotTopic'
import imgGifEditor from '@/components/template_editor/img-gif'
import nearbyShopEditor from '@/components/template_editor/nearby_shop'

// 第三方组件
import draggable from 'vuedraggable'

// api
import { savePageParams, getParamByTempName } from '@/api/wxa'
import { getPagesTemplateDetail, savePagesTemplate } from '@/api/template'
import { getRecommendLikeItemList } from '@/api/promotions'
import { getItemsList } from '@/api/goods'
import { forEach } from 'jszip'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: String
    },
    relStore: {
      type: Object,
      default: () => {
        return {}
      }
    },
    tabs: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showLike: {
      type: Number
    },
    templateName: {
      type: String
    }
  },
  components: {
    coupon,
    couponPackageSelect,
    film,
    goodsGrid,
    goodsGridTab,
    goodsScroll,
    imgHotzone,
    marquees,
    navigation,
    search,
    showcase,
    slider,
    store,
    floorImg,
    floorImgTwo,
    headline,
    hotTopic,
    imgGif,
    couponEditor,
    filmEditor,
    goodsGridEditor,
    goodsGridTabEditor,
    goodsScrollEditor,
    imgHotzoneEditor,
    marqueesEditor,
    navigationEditor,
    searchEditor,
    showcaseEditor,
    sliderEditor,
    storeEditor,
    floorImgEditor,
    floorImgTwoEditor,
    headlineEditor,
    hotTopicEditor,
    imgGifEditor,
    nearbyShop,
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
      tagSelectVisible: false,
      tagType: '', // nearby_shop || store
      storeID: null,
      couponPackageVisible: false,
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
      isSouponPackage: false, //是否为劵包 （用来判断图片选择）
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
          data: [
            // {
            //   type: 'cash',
            //   id: '',
            //   amount: '50',
            //   imgUrl: '../../images/coupon_brand_demo.jpg',
            //   title: '巴黎欧莱雅',
            //   desc: '全场商品满900减50'
            // },
            // {
            //   type: 'discount',
            //   id: '',
            //   amount: '8',
            //   imgUrl: '../../images/coupon_brand_demo.jpg',
            //   title: '巴黎欧莱雅',
            //   desc: '全场商品满900减50'
            // },
            // {
            //   type: 'cash',
            //   id: '',
            //   amount: '100',
            //   imgUrl: '../../images/coupon_brand_demo.jpg',
            //   title: '巴黎欧莱雅',
            //   desc: '全场商品满900减50'
            // }
          ],
          voucher_package: [
            // {
            //   get_num: '0',
            //   limit_count: '1',
            //   package_describe: '2112',
            //   package_id: '8',
            //   title: '212',
            //   imgUrl: '../../images/coupon_brand_demo.jpg'
            // }
          ]
        },
        {
          name: 'film',
          base: {
            title: '',
            subtitle: '',
            padded: true,
            // 视频比例, 默认16 / 9
            proportion: 0
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
            padded: true,
            listIndex: 0
          },
          config: {
            brand: true,
            showPrice: false,
            style: 'grid',
            //更多的跳转链接
            moreLink: {
              id: '',
              title: '',
              linkPage: ''
            }
          },
          //list: [],
          data: []
        },
        {
          name: 'goodsGridTab',
          base: {
            title: '爆品直邮',
            subtitle: '宅家买遍全法',
            padded: true,
            listIndex: 0
          },
          config: {
            brand: true,
            showPrice: false,
            style: 'grid',
            //更多的跳转链接
            moreLink: {
              id: '',
              title: '',
              linkPage: ''
            }
          },
          list: [],
          data: []
        },
        {
          name: 'goodsScroll',
          base: {
            title: '当地必买',
            subtitle: '看看大家都在买什么',
            padded: true,
            backgroundImg: ''
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
            // {
            //   imgUrl: '',
            //   title: '',
            //   brand: '',
            //   goodsId: ''
            // }
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
            scanCode: false
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
        },
        {
          name: 'floorImg', //楼层图片默认数据1
          base: {
            title: '专属礼遇',
            subtitle: '看看大家都在买什么',
            padded: true,
            backgroundImg: '',
            openBackImg: false
          },
          data: []
        },
        // {
        //   name: "floorImg-two", //楼层图片默认数据2
        //   base: {
        //     title: "专属礼遇"
        //   },
        //   data: []
        // },
        {
          name: 'headline', //楼层图片默认数据2
          base: {
            title: '全新作品',
            float: 'center'
          }
        },
        {
          name: 'hotTopic', //热点话题
          base: {
            title: '热点话题',
            index: 0
          },
          data: []
        },

        {
          name: 'img-gif', //视频图
          base: {
            title: '',
            index: 0
          },
          data: [
            {
              name: 'png',
              imgUrl: ''
            },
            {
              name: 'gif',
              imgUrl: ''
            }
          ]
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
      platformComponents: [],
      currentTab: 0,
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
      canEdit: false,
      element_edit_status: null,
      curStore: {},
      app_page_type: {
        wechat: 'wechat',
        alipay: 'alipay'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight', 'app_type', 'template_name', 'ali_template_name']),
    showDialog() {
      return this.dialogVisible
    }
  },
  methods: {
    /* ---------------------------------------------选择标签------------------------------------------ */
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
      console.log('this.editorData====================', this.editorData)
      console.log('this.components==========', this.components[this.editorIndex])
      this.editorData.seletedTags = seletedTags // editor
      this.components[this.editorIndex].seletedTags = seletedTags // view

      // this.tagSelectVisibleHandle();
    },

    /* ---------------------------------------------选择标签------------------------------------------ */

    /* ---------------------------------------------劵包组件方法------------------------------------------ */
    pickHandle() {
      this.couponPackageVisible = true
    },
    closeHandle() {
      this.couponPackageVisible = false
    },
    seletedDataHandle(seletedCoupon) {
      // for (let i = 0; i < seletedCoupon.length; i++) {
      //   for (let j = 0; j < this.editorData.voucher_package.length; j++) {
      //     if (this.editorData.voucher_package[j].package_id == seletedCoupon[i].package_id) {
      //      seletedCoupon.splice(i,1)
      //     }
      //   }
      // }

      // seletedCoupon = [...this.editorData.voucher_package,...seletedCoupon];

      this.editorData.voucher_package = seletedCoupon
      this.components[this.editorIndex].voucher_package = seletedCoupon
      // this.closeHandle()
    },
    /* ---------------------------------------------劵包组件方法结束------------------------------------------ */
    // 拖拽绑定事件
    onStart(evt) {
      if (evt.target.className === 'components-view') {
        this.saveInit = JSON.stringify(this.initData[evt.oldIndex])
      } else {
        this.setCurrent(evt.oldIndex)
      }
    },
    onEnd(evt) {
      console.log('---onEnd---')
      this.setCurrent(evt.newIndex)
      if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
        this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      }
    },
    // 设置当前编辑的组件
    setCurrent(val) {
      this.editorIndex = null
      this.$nextTick(() => {
        this.editorData = { ...this.components[val] }
        this.editorIndex = val
      })
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
    // 视频选择器绑定事件
    getVideo(data) {
      Object.assign(this.editorData.data[0], data)
      Object.assign(this.components[this.editorIndex].data[0], data)
    },
    // 视频比例
    radioChange(data) {
      this.$set(this.editorData.base, 'proportion', data)
      this.$set(this.components[this.editorIndex].base, 'proportion', data)
    },
    // 图片选择器绑定事件
    showImgs(index, isSouponPackage = false) {
      this.isSouponPackage = isSouponPackage
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        this.editorDataIndex = index
      }
    },
    pickImg(data) {
      // debugger
      console.log(this.isSouponPackage)
      if (this.components[this.editorIndex].name === 'imgHotzone') {
        this.components[this.editorIndex].config.imgUrl = data.url
      } else if (
        this.components[this.editorIndex].name === 'floorImg' ||
        this.components[this.editorIndex].name === 'goodsScroll'
      ) {
        if (this.editorDataIndex == 'backImg') {
          this.components[this.editorIndex].base.backgroundImg = data.url
        } else {
          this.components[this.editorIndex].data[this.editorDataIndex].imgUrl = data.url
        }
      } else if (this.components[this.editorIndex].name === 'store') {
        this.components[this.editorIndex].base.imgUrl = data.url
      } else {
        if (this.isSouponPackage) {
          // this.components[this.editorIndex].voucher_package[this.editorDataIndex].imgUrl = data.url   //无法触发watch。
          this.$set(
            this.components[this.editorIndex].voucher_package[this.editorDataIndex],
            'imgUrl',
            data.url
          )
        } else {
          this.components[this.editorIndex].data[this.editorDataIndex].imgUrl = data.url // 这里却可以。。。
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
      if (items.length > 0 && items[0].goodsId) {
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
      // console.log(data)
      // debugger

      // 如果是平台版本推荐店铺组件且店铺为总店（店铺id 0）
      if (
        this.editorData.name === 'store' &&
        this.system_mode === 'platform' &&
        Number(store.id) === 0
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
          if (values.length>=this.editorData.list[s].goodsList.length) {
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
          this.editorData.list[s].goodsList = values
          this.components[this.editorIndex].list[s].goodsList = values
        } else {
          console.log(values) // 新数据
          console.log(this.editorData.data) // 源数据
          if (values.length>=this.editorData.data.length) {
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
      this.linksVisible = true
      if (index !== undefined) {
        this.editorDataIndex = index
      }
    },
    // 链接选择器绑定事件
    setLink(data, type) {
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

      const _editorIndex = this.editorIndex
      this.editorIndex = null
      this.$nextTick(() => {
        this.editorIndex = _editorIndex
      })
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
    async saveConfig() {
      let filter = {
        distributor_id: this.relStore.id,
        pages_template_id: this.templateId,
        template_name: this.template_name,
        // template_name: this.app_type === 'wechat' ?  this.template_name : this.ali_template_name,
        // page_type: this.app_page_type[this.app_type],
        template_content: JSON.stringify({
          content: { ...this.platformComponents, ...this.components }
        })
      }
      // if (this.relStore.id != '0' && this.element_edit_status == 2) {
      //   filter.template_content = JSON.stringify({
      //     content: this.platformComponents,
      //     shop_content: this.components
      //   })
      // }
      console.log('保存的参数')
      console.log(JSON.parse(filter.template_content))
      await savePagesTemplate(filter)
      this.$message({
        message: '保存成功',
        type: 'success',
        onClose: () => {
          this.$emit('saved', false)
        }
      })
    },
    async getData() {
      if (this.system_mode === 'platform') {
        const isHaveStore = this.initData.some((item) => item.name === 'store')
        if (!isHaveStore) {
          this.initData.push({
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
          })
        }
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
      // 初始化获取数据
      const res = await getPagesTemplateDetail({
        pages_template_id: this.templateId
      })
      let template = res.data.data
      this.element_edit_status = template.element_edit_status
      let templateContent = template.template_content.config
      if (templateContent.length > 0) {
        let platformComponents = []
        let shopComponents = []
        templateContent.map((item) => {
          if (item.config && item.config.no_edit) {
            platformComponents.push(item)
          } else {
            shopComponents.push(item)
          }
        })
        this.platformComponents = platformComponents

        this.components = shopComponents
      } else {
        this.components = [...this.initData]
      }
    },
    cancelAction() {
      this.$emit('closeDialog')
    }
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      console.log('==================')
      if (newVal) {
        this.curStore = this.relStore
        this.editorData = {}
        this.editorIndex = null
        this.getData()
      }
    },

    initData: {
      handler(val) {},
      deep: true
    },
    components: {
      handler(val) {},
      deep: true
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
.mini-setting {
  text-align: right;
  margin-top: -40px;
}
.components-view {
  // display: flex;
  // align-items: center;
  // flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100%;
  overflow: auto;
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
.view-warp {
  position: relative;
}
.template-view {
  // width: 420px;
  width: 460px;
  margin-left: 80px;
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
  left: 540px;
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

<style lang="scss">
.components-container {
  position: relative;
  padding-top: 80px;
  padding-bottom: 69px;
  // overflow-y: overlay;
  height: calc(100vh - 170px);
  .components-wrap {
    height: 100%;

    &.edit {
      padding-top: 0px;
      padding-bottom: 69px;
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
.content-bottom-padded {
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
  .active {
    display: block;
  }
  .banner-uploader:last-child {
    margin-bottom: 0;
  }
  .title {
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
