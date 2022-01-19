<template>
  <div class="content-wrap">
    <div class="content-view">
      <div class="content" :class="{ 'is-edit': components.length > 0 }">
        <div class="component-item" v-for="(item, index) in components" :key="index">
          <film v-if="item.name === 'film'" :res="item" :active="index == editorIndex"></film>
          <goods v-if="item.name === 'goods'" :res="item" :active="index == editorIndex"></goods>
          <heading
            v-if="item.name === 'heading'"
            :res="item"
            :active="index == editorIndex"
          ></heading>
          <slider v-if="item.name === 'slider'" :res="item" :active="index == editorIndex"></slider>
          <writing
            v-if="item.name === 'writing'"
            :res="item"
            :active="index == editorIndex"
          ></writing>
        </div>
        <transition name="el-fade-in-linear">
          <div class="edit-btn content-center">
            <el-button type="primary" plain round @click="plantingShow">编辑内容</el-button>
          </div>
        </transition>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="80%" title="编辑文章" fullscreen lock-scroll>
      <section class="section section-white view-warp">
        <draggable
          v-model="initData"
          :options="dragIssuesOptions"
          @start="onStart"
          @end="onEnd"
          class="components-view"
        >
          <div v-for="(item, index) in initData" class="component-control" :key="index">
            <template v-if="item.name === 'film'">
              <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#icon-video"></use>
              </svg>
              视频
            </template>
            <template v-if="item.name === 'goods'">
              <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#icon-goods"></use>
              </svg>
              商品
            </template>
            <template v-if="item.name === 'heading'">
              <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#icon-title"></use>
              </svg>
              标题
            </template>
            <template v-if="item.name === 'slider'">
              <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#icon-slider"></use>
              </svg>
              轮播
            </template>
            <template v-if="item.name === 'writing'">
              <svg class="svg-icon" aria-hidden="true">
                <use xlink:href="#icon-text"></use>
              </svg>
              文本
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
                <film v-if="item.name === 'film'" :res="item" :active="index == editorIndex"></film>
                <goods
                  v-if="item.name === 'goods'"
                  :res="item"
                  :active="index == editorIndex"
                ></goods>
                <heading
                  v-if="item.name === 'heading'"
                  :res="item"
                  :active="index == editorIndex"
                ></heading>
                <slider
                  v-if="item.name === 'slider'"
                  :res="item"
                  :active="index == editorIndex"
                ></slider>
                <writing
                  v-if="item.name === 'writing'"
                  :res="item"
                  :active="index == editorIndex"
                ></writing>
              </div>
            </draggable>
          </div>
        </div>
        <div class="setting-view">
          <div class="view-placeholder" v-if="editorIndex === null">
            <i class="iconfont icon-shapes"></i>
            请拖选左侧挂件
          </div>
          <filmEditor :res="editorData" @change="getVideo"></filmEditor>
          <goodsEditor :res="editorData"></goodsEditor>
          <headingEditor :res="editorData"></headingEditor>
          <sliderEditor
            :res="editorData"
            @bindImgs="showImgs"
            @bindLinks="showLinks"
          ></sliderEditor>
          <writingEditor :res="editorData"></writingEditor>
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
      ></linkSetter>
      <goodsPicker
        :visible="goodsVisible"
        @pickGoods="pickGoods"
        @closeDialog="closeDialog"
      ></goodsPicker>
    </el-dialog>
  </div>
</template>

<script>
const img = require('@/assets/img/demo-img.jpg')
const header = require('@/assets/img/topbar.png')
import { mapGetters } from 'vuex'
// 组件
import imgPicker from '@/components/imageselect'
import linkSetter from '@/components/template_links'
import goodsPicker from '@/components/goods_picker'
// 店铺装修组件
// view层组件
import film from '@/components/template/film'
import goods from '@/components/template/goods'
import heading from '@/components/template/heading'
import slider from '@/components/template/slider'
import writing from '@/components/template/writing'
// control层组件
import filmEditor from '@/components/template_editor/film'
import goodsEditor from '@/components/template_editor/goods'
import headingEditor from '@/components/template_editor/heading'
import sliderEditor from '@/components/template_editor/slider'
import writingEditor from '@/components/template_editor/writing'

// 第三方组件
import draggable from 'vuedraggable'

// api
import { savePageParams, getParamByTempName } from '@/api/wxa'

export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    control: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    film,
    goods,
    slider,
    heading,
    writing,
    filmEditor,
    goodsEditor,
    sliderEditor,
    headingEditor,
    writingEditor,
    // 其他组件
    imgPicker,
    linkSetter,
    goodsPicker,
    // 第三方组件
    draggable
  },
  data() {
    return {
      dialogVisible: false,
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
      initData: [],
      components: [],
      currentTab: 0,
      headerBg: header,
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      // 商品选择器
      goodsVisible: false,
      // 路径设置组件
      linksVisible: false
    }
  },
  watch: {
    data(val) {
      this.components = val
    }, 
    dialogVisible:{
      handler(newVal){
        if(!newVal){
          console.log("===this.data",this.data,this.components)
          let oldData=[...this.data];
          if(this.data.length!==this.components.length){
            // debugger;
            //说明没有保存 
            this.$emit('change', oldData)
          }
          
        }
      }, 
    }
  },
  methods: {
    plantingShow() {
      this.dialogVisible = true
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
      if (val === 'tabBar') {
        this.editorData = { ...this.tabBar }
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
    showImgs(index) {
      this.imgsVisible = true
      this.isGetImage = true
      if (typeof index !== undefined) {
        this.editorDataIndex = index
      }
    },
    pickImg(data) {
      if (this.components[this.editorIndex].name === 'imgHotzone') {
        this.components[this.editorIndex].config.imgUrl = data.url
      } else {
        this.components[this.editorIndex].data[this.editorDataIndex].imgUrl = data.url
      }
      this.imgsVisible = false
    },
    closeimgsVisible() {
      this.imgsVisible = false
    },
    // 商品选择器绑定事件
    showGoods(index) {
      if (index) {
        this.editorDataIndex = index
      }
      this.goodsVisible = true
    },
    pickGoods(data) {
      this.editorData.data = data
      this.components[this.editorIndex].data = data
      this.goodsVisible = false
    },
    getVideo(data) {
      Object.assign(this.editorData.data[0], data)
      Object.assign(this.components[this.editorIndex].data[0], data)
    },
    showLinks(index) {
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
    showIcons(index) {
      this.iconsVisible = true
      this.editorDataIndex = index
    },
    pickIcon(data) {
      this.editorData.data[this.editorDataIndex].pathName = data
      this.tabBar.data[this.editorDataIndex].pathName = data
      this.iconsVisible = false
    },
    // 选择器公用关闭事件
    closeDialog(key) {
      switch (key) {
        case 'goods':
          this.goodsVisible = false
          break
        case 'link':
          this.linksVisible = false
          break
        case 'icon':
          this.iconsVisible = false
          break
        default:
      }
    },
    // 保存配置
    saveConfig() {
      this.dialogVisible = false
      this.$emit('change', this.components)
    }
  },
  mounted() {
    let init = [
      {
        name: 'film',
        base: {
          title: '',
          subtitle: '',
          padded: true
        },
        data: [
          {
            desc: '',
            media_id: '',
            name: '',
            update_time: '',
            url: ''
          }
        ]
      },
      {
        name: 'goods',
        base: {
          title: '',
          subtitle: '',
          padded: true
        },
        config: {
          style: 'card'
        },
        data: [
          {
            distributor_id: 0,
            item_id: '',
            item_name: '',
            sales: '',
            img_url: '',
            price: ''
          }
        ]
      },
      {
        name: 'heading',
        base: {
          title: '',
          subtitle: '',
          padded: true
        },
        config: {
          bold: true,
          color: '',
          align: 'left',
          italic: false
        },
        data: [
          {
            content: ''
          }
        ]
      },
      {
        name: 'slider',
        base: {
          title: '',
          subtitle: '',
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
          content: false
        },
        data: [
          {
            imgUrl: '',
            linkPage: '',
            content: '',
            title: '',
            id: ''
          }
        ]
      },
      {
        name: 'writing',
        base: {
          title: '',
          subtitle: '',
          padded: true
        },
        config: {
          align: 'left'
        },
        data: [
          {
            content: ''
          }
        ]
      }
    ]
    let controlList = []
    this.control.forEach((item) => {
      let key = init.find((n) => item === n.name)
      if (key) {
        controlList.push(key)
      }
    })
    this.initData = controlList
    this.components = this.data
  }
}
</script>

<style scope lang="scss">
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
  margin-left: 80px;
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
    .components-wrap {
      height: calc(100vh - 200px);
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
    top:80px;
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

.content-view {
  height: 100%;
  overflow-y: overlay;
  .content {
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
    }
  }
}
</style>
