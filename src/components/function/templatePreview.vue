<template>
  <el-dialog
    :visible.sync="showDialog"
    width="400px"
    :title="template_title"
    :close-on-click-modal="false"
    :before-close="cancelAction"
  >
    <section class="section section-white view-wrap">
      <div class="template-view preview">
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
          <div
            class="components-wrap"
            :style="'height: ' + (wheight - 290) + 'px;'"
          >
            <div
              v-for="(item, index) in components"
              :key="index"
              class="component-item"
            >
              <coupon
                v-if="item.name === 'coupon'"
                :res="item"
              />
              <film
                v-if="item.name === 'film'"
                :res="item"
              />
              <goodsGrid
                v-if="item.name === 'goodsGrid'"
                :res="item"
              />
              <goodsGridTab
                v-if="item.name === 'goodsGridTab'"
                :res="item"
              />
              <goodsScroll
                v-if="item.name === 'goodsScroll'"
                :res="item"
              />
              <imgHotzone
                v-if="item.name === 'imgHotzone'"
                :res="item"
              />
              <marquees
                v-if="item.name === 'marquees'"
                :res="item"
              />
              <navigation
                v-if="item.name === 'navigation'"
                :res="item"
              />
              <search
                v-if="item.name === 'search'"
                :res="item"
              />
              <showcase
                v-if="item.name === 'showcase'"
                :res="item"
              />
              <slider
                v-if="item.name === 'slider'"
                :res="item"
              />
              <floorImg
                v-if="item.name === 'floorImg'"
                :res="item"
              />
              <headline
                v-if="item.name === 'headline'"
                :res="item"
              />
              <hotTopic
                v-if="item.name === 'hotTopic'"
                :res="item"
              />
              <imgGif
                v-if="item.name === 'img-gif'"
                :res="item"
              />
              <store
                v-if="item.name === 'store' && VERSION_PLATFORM"
                :res="item"
              />
            </div>
            <goodsGrid
              v-if="showLike == 1 && faverite.data.length"
              :res="faverite"
            />
          </div>
          <div class="template-footer">
            <div
              class="template-tabs"
              :style="{ background: tabs.config.backgroundColor, color: tabs.config.color }"
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
    </section>
  </el-dialog>
</template>

<script>
const header = require('@/assets/img/topbar.png')
import { mapGetters } from 'vuex'

// 店铺装修组件
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
import floorImg from '@/components/template/floorImg'
import headline from '@/components/template/headline'
import hotTopic from '@/components/template/hotTopic'
import imgGif from '@/components/template/img-gif'
import store from '@/components/template/store'

// api
import { getParamByTempName } from '@/api/wxa'
import { getPagesTemplateDetail } from '@/api/template'
import { getRecommendLikeItemList } from '@/api/promotions'

export default {
  components: {
    coupon,
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
    floorImg,
    headline,
    hotTopic,
    imgGif,
    store
  },
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
    }
  },
  data () {
    return {
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
        data: []
      },
      components: [],
      currentTab: 0,
      headerBg: header,
      template_title: null
    }
  },
  computed: {
    ...mapGetters(['wheight']),
    showDialog () {
      return this.dialogVisible
    }
  },
  watch: {
    // templateId: {
    //   handler (newVal, oldVal) {
    //     this.getData(newVal)
    //   },
    //   immediate: true
    // },
    dialogVisible (newVal, oldVal) {
      if (newVal) {
        this.getData()
      }
    }
  },
  methods: {
    cancelAction () {
      this.$emit('closeDialog')
    },
    async getData () {
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

      const res = await getPagesTemplateDetail({
        pages_template_id: this.templateId
      })
      let template = res.data.data
      this.template_title = template.template_title
      let templateContent = template.template_content
      if (template.template_content.config.length > 0) {
        this.components = template.template_content.config
      } else {
        this.components = [...this.initData]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.view-wrap {
  position: relative;
}

.template-view {
  width: 360px;
  overflow-y: auto;
  background: #efefef;

  &.preview {
    margin-left: 0;
  }

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
</style>

<style lang="scss">
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
          padding-left: 8px;
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
</style>
