<template>
  <div>
    <section class="section section-white">
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
          <template v-if="item.name === 'banner'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="icon-loucengtupian" />
            </svg>
            轮播
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
          <template v-if="item.name === 'imgHotzone'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-hotzone" />
            </svg>
            热区图
          </template>
          <template v-if="item.name === 'panel' && usage !== 'store'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-navigation" />
            </svg>
            图片导航
          </template>
          <template v-if="item.name === 'floor'">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-floor" />
            </svg>
            楼层挂件
          </template>
        </div>
      </draggable>
    </section>
    <section class="section section-white view-warp el-row">
      <div class="template-view el-col el-col-16">
        <div class="template">
          <!-- <Navbar @click.native="setCurrent('nav')" :usage="usage" :data="navConfig"></Navbar> -->
          <draggable
            v-model="components"
            class="components-wrap"
            :options="dragViewOptions"
            :style="'height: ' + (wheight - 220) + 'px;'"
            @start="onStart"
            @end="onEnd"
          >
            <component
              :is="widget.name"
              v-for="(widget, k) in components"
              v-if="renderable"
              :key="widget.uuid"
              :data-uuid="widget.uuid"
              :data="widget"
              :class="[k == editorIndex ? 'active' : '', 'component-item']"
              :usage="usage"
              @click.native="setCurrent(k)"
            >
              <transition name="el-fade-in-linear">
                <div
                  v-if="k == editorIndex"
                  class="iconfont icon-trash-alt1"
                  @click="removeCurrent"
                />
              </transition>
            </component>
          </draggable>
        </div>
      </div>
      <div class="setting-view el-col el-col-8">
        <div
          v-if="editorIndex === null && editorData"
          class="view-placeholder"
        >
          <i class="iconfont icon-shapes" />
          请选择左侧挂件
        </div>
        <template v-else>
          <component
            :is="editorData.name == 'nav' ? 'navStyle' : components[editorIndex].name + 'Style'"
            v-if="renderable"
            :data="editorData"
            :data-uuid="editorData.name == 'nav' ? '' : components[editorIndex].uuid"
            :usage="usage"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Vue from 'vue'
import plugins from './components/plugins/index'
// import { Footer, Header, Nav } from "./components/common";
import { savePageParams, getParamByTempName } from '@/api/pctemplate'
const generate = require('nanoid/generate')
const str = '1234567890abcdef'
export default {
  components: { draggable },
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
      type: String
    },
    template_name: {
      type: String
    }
  },
  data () {
    return {
      renderable: true,
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
          name: 'easyview',
          pull: true
        },
        animation: 150,
        forceFallback: false,
        scroll: true
      },
      saveInit: '',
      initData: [
        {
          uuid: '',
          name: 'banner',
          base: {
            title: '分享拼单',
            subtitle: '分享有好礼，拼单更便宜',
            padded: true
          },
          config: {
            current: 0,
            interval: 3000,
            spacing: 0,
            height: 140, // 轮播高度
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
          data: [
            {
              imgUrl: 'https://i.loli.net/2018/11/04/5bdeba4028e90.png',
              title: '科勒官方智能马桶盖烘干除臭坐便器盖板',
              goodsId: '576',
              brand: '',
              price: 1
            }
          ]
        },
        {
          uuid: '',
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
              imgUrl: 'https://i.loli.net/2018/11/04/5bdeba4028e90.png',
              title: '科勒官方智能马桶盖烘干除臭坐便器盖板',
              goodsId: '576',
              brand: '',
              price: 1
            }
          ]
        },
        {
          uuid: '',
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
          uuid: '',
          name: 'panel',
          base: {},
          config: {},
          data: [
            {
              imgUrl: 'https://i.loli.net/2018/11/04/5bdeba4028e90.png',
              title: '科勒官方智能马桶盖烘干除臭坐便器盖板',
              goodsId: '576',
              brand: '',
              price: 1
            }
          ]
        },
        {
          uuid: '',
          name: 'floor',
          base: {},
          config: {},
          data: {
            title: '楼层导航',
            activeName: '0',
            tabList: [], //Tab 类型切换
            leftNavList: [], //左侧商品类型导航列表
            LeftBackgroundColor: null, //左侧导航背景颜色
            LeftFontColor: null, //左侧字体颜色
            goodsList: [], //商品列表

            leftImg: {}, //左侧图片挂件
            rightImg1: {}, //右侧图片挂件 1
            rightImg2: {}, //右侧图片挂件 2
            typeNavList: [] //类型导航项
          }
        }
      ],
      components: [], //视图动态组建 list
      navConfig: {
        name: 'nav',
        data: [],
        config: {},
        base: {}
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    id: {
      handler (newName, oldName) {
        if (newName === oldName) return
        this.editorIndex = null
        this.components = []
        this._getParamByTempName(newName)
      },
      immediate: true
    }
  },
  created () {
    Object.keys(plugins).forEach((key) => {
      let widget = plugins[key].widget
      Vue.component(key, widget)
    })
    this.$store.dispatch('setTemplateName', 'pc')
  },
  methods: {
    /**
     * 拖拽事件开始
     */
    onStart (evt) {
      if (evt.target.className === 'components-view') {
        let item = this.initData[evt.oldIndex]
        item.uuid = generate(str, 10)
        this.saveInit = JSON.stringify(item)
      } else {
        console.log('onstart')
        this.setCurrent(evt.oldIndex)
      }
      evt.preventDefault()
    },
    /**
     * 拖拽事件结束
     */
    onEnd (evt) {
      console.log('onend')
      this.setCurrent(evt.newIndex)
      if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
        this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      }
      evt.preventDefault()
      // console.log('initData', this.initData)
    },
    /**
     * 设置
     */
    setCurrent (val) {
      this.editorIndex = val
      if (val === 'nav') {
        console.log('set', plugins.navStyle.widget)
        this.editorData = this.navConfig
        return
      }
      this.editorData = this.components[val]
      console.log('setCurrent', this.editorIndex, this.components)
      // console.log('editorData', this.editorData)
    },
    /**
     * 确认删除当前组件
     */
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
    /**
     * 保存
     */
    saveConfig () {
      const tmp = this.components.find((v) => v.name === 'nav')
      this.components = tmp ? this.components : [...this.components, ...[this.navConfig]]
      console.log('save components', this.components)
      console.log('save nav', tmp)

      let filter = {
        template_name: this.template_name,
        version: 'v1.0.1',
        config: JSON.stringify(this.components),
        page_name: `custom_${this.id}`
      }

      savePageParams(filter).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this._getParamByTempName() // 店铺装修弹框 该页面作为组件，保存后需要更新下数据，否则再次打开弹窗不走mounted
          this.$emit('saved')
        }
      })
    },
    /**
     * 获取
     */
    _getParamByTempName (newName) {
      let filter = {
        template_name: this.template_name,
        version: 'v1.0.1',
        page_name: `custom_${newName}`
      }
      getParamByTempName(filter).then((res) => {
        const data = res.data.data
        if (!data.config.length) return
        this.components = data.config
        const tmp = data.config.find((v) => v.name === 'nav') // 导航
        tmp && (this.navConfig = tmp)
        console.log('_getParamByTempName nav-->', tmp)
      })
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
  // position: relative;
}
.template-view {
  // width: 840px;
  overflow-y: auto;
  background: #efefef;
  .template {
    border: 1px solid #ff5000;
    position: relative;
    .template-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      padding-top: 1px;
      z-index: 99;
      background: #fafafa;
      border-bottom: 1px solid #e6e6e6;
      margin-bottom: 10px;
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
      // padding-bottom: 20px;
      z-index: 999;
      background: #efefef;
      .template-tabbar {
        position: relative;
        display: flex;
        width: 320px;
        height: 49px;
        margin: 0 auto;
        border-top: 1px solid transparent;
        &.black {
          border-color: rgba(0, 0, 0, 0.3);
        }
        &.white {
          border-color: rgba(255, 255, 255, 0.3);
        }
        .tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 49px;
          text-align: center;
          &.iconwhite {
            .svg-icon {
              color: #fff;
            }
          }
          &.iconblack {
            .svg-icon {
              color: #666;
            }
          }
          .svg-icon {
            width: 24px;
            height: 24px;
            margin-bottom: 3px;
            &.red {
              color: #ff5000;
            }
            &.blue {
              color: #2541d0;
            }
            &.green {
              color: #009966;
            }
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
  // position: absolute;
  // left: 840px;
  // top: 0;
  // right: 0px;
  // bottom: 0;
  // overflow-y: auto;
  // overflow-x: hidden;
  // border-left: 1px solid #efefef;
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
.btn-save {
  width: 200px;
  border-radius: 60px;
}
</style>

<style lang="scss" scoped>
.components-wrap {
  position: relative;
  padding: 0;
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
    margin: 40px 0;
    //   width: 90%!important;
    margin: 0 auto;
    .iconfont {
      position: absolute;
      right: 20px;
      color: #ff5000;
      cursor: pointer;
      z-index: 99;
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
    line-clamp: 1;
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

<style lang="scss" scoped>
.components-wrap .active {
  border: 3px solid #ff5000;
  opacity: 1;
  box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
  background: rgba(255, 80, 0, 0.2);
  z-index: 999;
  transition: all 0.3s ease;
}
</style>
