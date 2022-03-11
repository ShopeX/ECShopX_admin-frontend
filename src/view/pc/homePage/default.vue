<template>
  <div class="template">
    <div class="content-bottom-padded view-flex view-flex-middle view-flex-justify">
      <h2>效果预览</h2>
      <div>
        <!-- <el-button type="primary" @click="handlerView">浏览站点</el-button> -->
        <el-button
          type="primary"
          @click="handlerLayout"
        >
          编辑模版
        </el-button>
      </div>
    </div>
    <div class="template-show">
      <Navbar
        :cate-list="cateList"
        :data="navConfig"
        :setting="settings"
      />
      <div class="components-wrap">
        <div
          v-for="(widget, k) in components"
          v-if="renderable"
          :class="[k == editorIndex ? 'active' : '', 'component-item']"
          :style="{ padding: widget.base.padded + 'px 0' }"
          @click="setCurrent(k)"
        >
          <component
            :is="widget.name"
            :key="`${widget.uuid}${k}`"
            :data-uuid="widget.uuid"
            :data="widget"
            :usage="usage"
          >
            <div
              v-if="widget.base.title"
              class="component-title"
            >
              <h2>{{ widget.base.title }}</h2>
              <h5>{{ widget.base.subtitle }}</h5>
            </div>
          </component>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="template_dialog"
      width="80%"
      title="编辑首页"
      fullscreen
      lock-scroll
    >
      <section class="section section-white view-warp">
        <div class="components-widget">
          <draggable
            v-model="initData"
            class="components-view"
            v-bind="dragIssuesOptions"
            tag="div"
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
                  <use xlink:href="#icon-slider" />
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
              <template v-if="item.name === 'panel'">
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
          <div
            v-if="usage !== 'store'"
            class="setting"
            @click="setCurrent('settings')"
          >
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#icon-settings" />
            </svg>
            设置
          </div>
        </div>
        <div class="template-view">
          <div
            class="template"
            :style="'height: ' + (wheight - 160) + 'px;'"
          >
            <div @click="setCurrent('navbar')">
              <Navbar
                :usage="usage"
                :cate-list="cateList"
                :data="navConfig"
                :setting="settings"
              />
            </div>
            <draggable
              v-model="components"
              class="components-wrap"
              v-bind="dragViewOptions"
              tag="div"
              @start="onStart"
              @end="onEnd"
            >
              <div
                v-for="(widget, k) in components"
                v-if="renderable"
                :class="[k == editorIndex ? 'active' : '', 'component-item']"
                :style="{ padding: widget.base.padded + 'px 0' }"
                @click="setCurrent(k)"
              >
                <transition name="el-fade-in-linear">
                  <div
                    v-if="k == editorIndex"
                    class="iconfont icon-trash-alt"
                    @click="removeCurrent"
                  />
                </transition>
                <component
                  :is="widget.name"
                  :key="`${widget.uuid}${k}`"
                  :data-uuid="widget.uuid"
                  :data="widget"
                  :usage="usage"
                >
                  <div
                    v-if="widget.base.title"
                    class="component-title"
                  >
                    <h2>{{ widget.base.title }}</h2>
                    <h5>{{ widget.base.subtitle }}</h5>
                  </div>
                </component>
              </div>
            </draggable>
          </div>
        </div>
        <div class="setting-view">
          <template v-if="editorIndex !== null">
            <component
              :is="
                editorData.name == 'navbar' || editorData.name == 'nav'
                  ? 'navStyle'
                  : editorData.name == 'settings'
                    ? 'settingsStyle'
                    : components[editorIndex].name + 'Style'
              "
              v-if="renderable"
              :res="editorData"
              :data-uuid="
                editorData.name == 'navbar' || editorData.name == 'nav'
                  ? ''
                  : components[editorIndex].uuid
              "
              :usage="usage"
            />
          </template>
          <div
            v-else
            class="view-placeholder"
          >
            <i class="iconfont icon-shapes" />
            请选择左侧挂件
          </div>
        </div>
      </section>
      <section class="section-white content-center">
        <el-button
          class="btn-save"
          round
          type="primary"
          @click="saveConfig"
        >
          保存设置
        </el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import Vue from 'vue'
import plugins from './components/plugins/index'
import { Footer, Header, Navbar } from './components/common'
import { getCategory } from '@/api/goods'
import { savePageParams, getParamByTempName } from '@/api/pctemplate'
import sideBar from '@/components/element/sideBar'
const generate = require('nanoid/generate')
const str = '1234567890abcdef'

export default {
  components: {
    draggable,
    sideBar,
    Footer,
    Header,
    Navbar
  },
  props: ['usage', 'id'], // usage为store，则为具体每个店铺的首页装修;id为店铺id
  data () {
    return {
      template_dialog: false,
      renderable: true,
      componentHeight: '',
      editorIndex: null,
      editorData: {},
      editorDataIndex: null,
      show_sideBar: false,
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
            title: '轮播',
            subtitle: '',
            padded: 0
          },
          config: {
            offset: false,
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
              imgUrl: '',
              title: '',
              goodsId: '',
              brand: '',
              price: ''
            }
          ]
        },
        {
          uuid: '',
          name: 'goodsGrid',
          base: {
            title: '商品列表',
            subtitle: '',
            padded: 0
          },
          config: {
            brand: true,
            showPrice: false,
            style: 'grid'
          },
          data: []
        },
        {
          uuid: '',
          name: 'imgHotzone',
          base: {
            title: '热区图',
            subtitle: '',
            padded: 0
          },
          config: {
            imgUrl: ''
          },
          data: []
        },
        {
          uuid: '',
          name: 'panel',
          base: {
            title: '图片导航',
            subtitle: '',
            padded: 0
          },
          config: {},
          data: [
            {
              id: '',
              imgUrl: '',
              title: '',
              goodsId: '',
              brand: '',
              price: '',
              linkPage: ''
            },
            {
              id: '',
              imgUrl: '',
              title: '',
              goodsId: '',
              brand: '',
              price: '',
              linkPage: ''
            },
            {
              id: '',
              imgUrl: '',
              title: '',
              goodsId: '',
              brand: '',
              price: '',
              linkPage: ''
            },
            {
              id: '',
              imgUrl: '',
              title: '',
              goodsId: '',
              brand: '',
              price: '',
              linkPage: ''
            }
          ]
        },
        {
          uuid: '',
          name: 'floor',
          base: {
            title: '楼层导航',
            subtitle: '',
            padded: 0
          },
          config: {},
          data: {
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
      cateList: [],
      navConfig: {
        name: 'navbar',
        data: [],
        config: {},
        base: {}
      },
      settings: {
        name: 'settings',
        base: {},
        config: {
          category: 'collapse'
        },
        data: []
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    // editorData: {
    //   handler (newVal, oldVal) {
    //     this.renderable = false
    //     console.log('watch editorData', newVal)
    //     newVal.name !== 'navStyle' && (this.components[this.editorIndex] = newVal)
    //     this.$nextTick(_ => {
    //       this.renderable = true
    //     })
    //   },
    //   deep: true
    // }
  },
  created () {
    Object.keys(plugins).forEach((key) => {
      let widget = plugins[key].widget
      // console.log('widget', widget)
      Vue.component(key, widget)
    })

    this.$store.dispatch('setTemplateName', 'pc')
  },
  mounted () {
    this._getCateList()
    this._getParamByTempName()
  },
  methods: {
    handlerLayout () {
      this.template_dialog = true
    },
    handlerView () {},
    _getCateList () {
      getCategory().then(({ data }) => {
        this.cateList = data.data
      })
    },
    // 拖拽绑定事件
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
    onEnd (evt) {
      console.log('onend')
      this.setCurrent(evt.newIndex)
      if (evt.target.className === 'components-view' && evt.to.className === 'components-wrap') {
        this.initData.splice(evt.oldIndex, 0, JSON.parse(this.saveInit))
      }
      evt.preventDefault()
      // console.log('initData', this.initData)
    },
    setCurrent (val) {
      this.editorIndex = val
      this.show_sideBar = true
      if (val === 'navbar') {
        this.editorData = this.navConfig
        return
      }
      if (val === 'settings') {
        this.editorData = this.settings
        return
      }
      this.editorData = this.components[val]
      // console.log('editorData', this.editorData)
    },
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
    saveConfig () {
      const tmp = this.components.find((v) => v.name === 'navbar')
      this.components = tmp ? this.components : [...this.components, ...[this.navConfig]]
      // this.components.forEach((v, i) => {
      //   v.name == 'nav' && this.components.splice(i, 1)
      // })
      let filter = {
        template_name: 'pc',
        version: 'v1.0.1',
        config: JSON.stringify(this.components),
        page_name: 'index'
      }
      this.usage === 'store' &&
        Object.assign(filter, {
          version: `v1.0.1_${this.id}`,
          page_name: 'store_index'
        }) // 店铺
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
      if (this.usage !== 'store') {
        let setting = {
          template_name: 'pc',
          version: 'v1.0.1',
          config: JSON.stringify([this.settings]),
          page_name: 'settings'
        }
        savePageParams(setting).then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this._getParamByTempName() // 店铺装修弹框 该页面作为组件，保存后需要更新下数据，否则再次打开弹窗不走mounted
            this.$emit('saved')
          }
        })
      }
    },
    _getParamByTempName () {
      let filter = {
        template_name: 'pc',
        version: 'v1.0.1',
        page_name: 'index'
      }
      this.usage === 'store' &&
        Object.assign(filter, {
          version: `v1.0.1_${this.id}`,
          page_name: 'store_index'
        }) // 店铺
      getParamByTempName(filter).then((res) => {
        let components = res.data.data.config.filter((item) => {
          return item.name != 'navbar' && item.name != 'nav'
        })
        let navbar = res.data.data.config.filter((item) => {
          return item.name == 'navbar' || item.name == 'nav'
        })
        if (navbar.name == 'nav') {
          navbar.name = 'navbar'
        }
        if (components.length > 0) {
          this.components = components
        }
        if (navbar.length > 0) {
          this.navConfig = navbar[0]
        }
      })
      if (this.usage !== 'store') {
        let setting = {
          template_name: 'pc',
          version: 'v1.0.1',
          page_name: 'settings'
        }
        getParamByTempName(setting).then((res) => {
          if (res.data.data.config.length > 0) {
            this.settings = res.data.data.config[0]
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.template-show {
  background: #efefef;
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
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffb28b;
    content: '';
  }
}
.components-widget {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  .setting {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90px;
    height: 70px;
    text-align: center;
    background: #fff;
    font-size: 12px;
    color: #999;
    cursor: pointer;
    .svg-icon {
      width: 26px;
      height: 26px;
      margin-bottom: 5px;
    }
  }
}
.components-view {
  // display: flex;
  // align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #efefef;
  .component-control {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 90px;
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
  margin-left: 90px;
  margin-right: 500px;
  height: 100%;
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
  }
}
.setting-view {
  position: absolute;
  top: 0;
  right: 0;
  width: 500px;
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
.btn-save {
  margin-right: 20px;
  width: 150px;
}
.components-wrap {
  width: 1000px;
  height: 100%;
  padding-top: 0;
  margin: 0 auto;
  position: relative;
  overflow: visible;
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
    //   width: 90%!important;
    margin: 0 auto;
    .iconfont {
      position: absolute;
      width: 35px;
      height: 35px;
      top: 0;
      right: 0;
      line-height: 35px;
      background: #ff5000;
      border-radius: 0 0 0 3px;
      text-align: center;
      color: #ffffff;
      cursor: pointer;
      z-index: 9999;
    }
    &::after {
      position: absolute;
      left: -3px;
      top: -3px;
      bottom: -3px;
      right: -3px;
      border: 3px solid #ff5000;
      opacity: 1;
      box-shadow: 0 0 5px rgba(255, 80, 0, 0.3);
      background: rgba(255, 80, 0, 0.2);
      z-index: -1;
      transition: all 0.3s ease;
      content: '';
    }
    &.active::after {
      z-index: 999;
    }
    .component-title {
      position: relative;
      z-index: 10;
      height: 60px;
      padding: 0 20px;
      line-height: 60px;
      font-size: 18px;
      color: #999;
      display: flex;
      align-items: center;
      h2 {
        margin-right: 10px;
        font-size: 18px;
        font-weight: 400;
        color: #626262;
      }
      h5 {
        color: #999;
      }
    }
  }
  .component-wrap {
    position: relative;
    width: 320px;
    margin: 0 auto;
    cursor: pointer;
    background: #fff;
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
<style lang="scss">
.template .el-dialog__body {
  padding: 20px 0 0 0;
}
.floorStyle {
  .btn-width__100 {
    width: 100%;
  }
  .del-or-add-nav {
    margin-top: 20px;
    i {
      cursor: pointer;
    }
  }
  .img-pendant__uploader {
    display: block;
    width: 150px;
    border: 1px dashed #ddd;
    cursor: pointer;
  }
  .goods-name {
    line-height: 22px;
  }
}
</style>
