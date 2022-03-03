<template>
  <div class="floorStyle">
    <div class="section-header with-border">
      设置
    </div>
    <el-row :gutter="10">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="120px"
      >
        <!-- 标题 -->
        <el-form-item label="标题：">
          <el-input v-model="dataForm.title" />
        </el-form-item>
        <!-- 左侧导航背景颜色 -->
        <el-form-item label="左侧导航背景:">
          <el-color-picker v-model="dataForm.LeftBackgroundColor" />
        </el-form-item>
        <!-- 左侧字体颜色 -->
        <el-form-item label="左侧字体背景:">
          <el-color-picker v-model="dataForm.LeftFontColor" />
        </el-form-item>
        <!-- 左侧图片挂件 -->
        <el-form-item label="左侧图片挂件： 图片大小 250*440">
          <el-col :span="12">
            <div class="setting-item slider">
              <div v-if="dataForm.leftImg.url">
                <img
                  :src="dataForm.leftImg.url"
                  class="img-pendant__uploader"
                  @click="handleImgChange(0)"
                >
              </div>
              <div
                v-else
                class="banner-uploader"
                @click="handleImgChange(0)"
              >
                <i class="iconfont icon-camera" />上传图片
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="setTypeNavLink(-1, 0)"
            >
              <i class="el-icon-circle-plus" />
              {{ dataForm.leftImg.children ? dataForm.leftImg.children.data.title : '设置路径' }}
            </el-button>
          </el-col>
        </el-form-item>
        <!-- 右侧图片挂件1 -->
        <el-form-item label="右侧图片挂件1： 图片大小 155*280">
          <el-col :span="12">
            <div class="setting-item slider">
              <div v-if="dataForm.rightImg1.url">
                <img
                  :src="dataForm.rightImg1.url"
                  class="img-pendant__uploader"
                  @click="handleImgChange(1)"
                >
              </div>
              <div
                v-else
                class="banner-uploader"
                @click="handleImgChange(1)"
              >
                <i class="iconfont icon-camera" />上传图片
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="setTypeNavLink(-1, 1)"
            >
              <i class="el-icon-circle-plus" />
              {{
                dataForm.rightImg1.children ? dataForm.rightImg1.children.data.title : '设置路径'
              }}
            </el-button>
          </el-col>
        </el-form-item>
        <!-- 右侧图片挂件 -->
        <el-form-item label="右侧图片挂件2： 图片大小 155*280">
          <el-col :span="12">
            <div class="setting-item slider">
              <div v-if="dataForm.rightImg2.url">
                <img
                  :src="dataForm.rightImg2.url"
                  class="img-pendant__uploader"
                  @click="handleImgChange(2)"
                >
              </div>
              <div
                v-else
                class="banner-uploader"
                @click="handleImgChange(2)"
              >
                <i class="iconfont icon-camera" />上传图片
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="setTypeNavLink(-1, 2)"
            >
              <i class="el-icon-circle-plus" />
              {{
                dataForm.rightImg2.children ? dataForm.rightImg2.children.data.title : '设置路径'
              }}
            </el-button>
          </el-col>
        </el-form-item>
        <!-- 类型导航项 -->
        <el-form-item label="类型导航项：">
          <template v-for="(item, index) in dataForm.leftNavList">
            <el-col
              :key="item.uuid"
              :span="18"
            >
              <el-input v-model="item.titleName" />
              <el-button
                size="mini"
                class="btn-width__100"
                @click="setTypeNavLink(index)"
              >
                {{
                  item.id ? item.title : '设置路径'
                }}
              </el-button>
            </el-col>
            <el-col
              :key="item.uuid2"
              :span="6"
            >
              <div class="del-or-add-nav">
                <i
                  class="iconfont icon-trash-alt"
                  @click="delTypeNav(index)"
                />
              </div>
            </el-col>
          </template>
          <el-col :span="24">
            <el-button
              :disabled="dataForm.leftNavList.length >= 9"
              size="mini"
              @click="addTypeNav"
            >
              <i class="el-icon-circle-plus" />
              设置项目
            </el-button>
          </el-col>
        </el-form-item>
        <!-- Tab类型切换 -->
        <el-form-item label="Tab类型切换：">
          <template v-for="(item, index) in dataForm.tabList">
            <el-col
              :key="item.uuid"
              :span="18"
            >
              <el-input v-model="item.title" />
            </el-col>
            <el-col
              :key="item.uuid2"
              :span="6"
            >
              <div>
                <i
                  class="iconfont icon-trash-alt"
                  @click="delTabList(index)"
                />
              </div>
            </el-col>
          </template>
          <el-col :span="24">
            <el-button
              :disabled="dataForm.leftNavList.length >= 9"
              size="mini"
              @click="addTabList"
            >
              <i class="el-icon-circle-plus" />
              设置Tap
            </el-button>
          </el-col>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item label="选择商品：">
          <el-tabs
            v-model="dataForm.activeName"
            type="card"
          >
            <el-tab-pane
              v-for="(items, index) in dataForm.tabList"
              :key="items.uuid"
              :label="items.title"
              :name="index + ''"
            >
              <el-col
                v-for="(item, i) in items.children"
                :key="item.id"
                :span="24"
              >
                <el-col :span="4">
                  <el-image
                    style="width: 60px; height: 60px"
                    :src="item.pics[0]"
                    fit="cover"
                  />
                </el-col>
                <el-col :span="14">
                  <p class="goods-name">
                    {{ item.itemName }}
                  </p>
                </el-col>
                <el-col :span="6">
                  <div class="del-or-add-nav">
                    <i
                      class="iconfont icon-trash-alt"
                      @click="delGoods(i)"
                    />
                  </div>
                </el-col>
              </el-col>
              <el-col :span="24">
                <el-button
                  size="mini"
                  @click="addGoods"
                >
                  <i class="el-icon-circle-plus" />
                  设置商品
                </el-button>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
    </el-row>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="imgsVisible = false"
    />
    <linkSetter
      :visible="linksVisible"
      @setLink="setLink"
      @closeDialog="linksVisible = false"
    />
    <goodsSelect
      :items-visible="goodsVisible"
      :get-status="setItemStatus"
      :rel-items-ids="relItemsIds"
      @chooseStore="pickGoods"
      @closeStoreDialog="goodsVisible = false"
    />
  </div>
</template>
<script>
import imgPicker from '@/components/imageselect' //上传图片
import linkSetter from '@/components/template_links' //添加导航连接
import goodsSelect from '@/components/goodsSelect' //添加商品
import marqueesEditor from '@/components/template_editor/marquees'
import { getItemsList } from '@/api/goods'
import { setTimeout } from 'timers'

export default {
  name: 'FloorStyle',
  components: {
    linkSetter,
    imgPicker,
    goodsSelect
  },
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      linksVisible: false, //添加类型导航设置路径 组建
      typeNavIndex: 0, //添加导航路径的 位置

      imgsVisible: false, // 上传图片组建
      isGetImage: false,
      imgIndex: 0, //添加图片挂机 位置 0=左侧图片挂机 1=右侧1 2=右侧2

      goodsVisible: false, //商品选择组建
      setItemStatus: false,
      relItemsIds: [],

      dataForm: this.data.data
    }
  },
  mounted () {
    this.goodsVisible = false //商品选择组建
    this.setItemStatus = true
  },

  methods: {
    /**
     * 添加 tab类型
     */
    addTabList () {
      this.dataForm.tabList.push({
        uuid: Date.now(),
        uuid2: Date.now() + 1,
        title: '',
        children: [] // 商品列表
      })
    },
    /**
     *删除选中的 Tab类型
     */
    delTabList (index) {
      this.dataForm.tabList.splice(index, 1)
    },
    /**
     * 添加类型导航项
     */
    addTypeNav () {
      this.dataForm.leftNavList.push({
        uuid: Date.now(),
        uuid2: Date.now() + 1,
        isActive: false,
        id: '',
        title: ''
      })
    },
    /**
     *删除选中的类型导航项
     */
    delTypeNav (index) {
      this.dataForm.leftNavList.splice(index, 1)
    },
    /**
     * 调用 添加类型导航设置路径 组建
     */
    setTypeNavLink (index, i) {
      this.typeNavIndex = index
      this.imgIndex = i

      this.linksVisible = true
    },
    /**
     * 添加类型导航设置路径 || 添加图片挂件路径
     */
    setLink (data, type) {
      console.log('setLink---')
      console.log(data)
      console.log(type)

      if (this.typeNavIndex >= 0) {
        //添加类型导航设置路径
        this.dataForm.leftNavList[this.typeNavIndex] = Object.assign(
          this.dataForm.leftNavList[this.typeNavIndex],
          { linkPage: type },
          data
        )
      } else {
        //添加图片挂件路径
        switch (this.imgIndex) {
          case 0:
            this.dataForm.leftImg.children = {
              data,
              type
            }
            break
          case 1:
            this.dataForm.rightImg1.children = {
              data,
              type
            }
            break
          case 2:
            this.dataForm.rightImg2.children = {
              data,
              type
            }
            break
          default:
            break
        }
      }

      console.log(this.dataForm.leftNavList)
    },

    /**
     * 显示上传图片组建
     */
    handleImgChange (index) {
      this.imgIndex = index
      this.imgsVisible = true
      this.isGetImage = true
      //   if (typeof index !== undefined) {
      //     this.cur_index = index
      //   }
    },

    /**
     * 显示上传图片组建 回调
     */
    pickImg (data) {
      console.log('pickImg---')
      console.log(data)
      console.log(this.imgIndex)
      switch (this.imgIndex) {
        case 0:
          this.dataForm.leftImg = data
          break
        case 1:
          this.dataForm.rightImg1 = data
          break
        case 2:
          this.dataForm.rightImg2 = data
          break
        default:
          break
      }
      this.imgsVisible = false
    },

    /**
     * 添加商品
     */
    addGoods () {
      if (this.dataForm.tabList.length > 0) {
        let i = Number(this.dataForm.activeName)
        this.relItemsIds = this.dataForm.tabList[i].children
      }
      setTimeout(() => {
        this.setItemStatus = true
        this.goodsVisible = true
      }, 1000)
    },

    /**
     * 删除选中的商品
     */
    delGoods (index) {
      let i = Number(this.dataForm.activeName)
      // let index =
      this.dataForm.tabList[i].children.splice(index, 1)
    },

    /**
     * 选择商品组建回调
     * */
    pickGoods (data) {
      console.log('pickGoods')
      console.log(data)
      let i = Number(this.dataForm.activeName)
      this.dataForm.tabList[i].children = data
      console.log(this.dataForm.tabList)
      this.goodsVisible = false
    }
  }
}
</script>
