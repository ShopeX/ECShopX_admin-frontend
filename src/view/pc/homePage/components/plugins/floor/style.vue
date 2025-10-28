<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div class="section floorStyle">
    <div class="section-header with-border">楼层</div>
    <div class="section-body">
      <el-form ref="data" v-model="data" label-position="top">
        <!-- 标题 -->
        <el-form-item label="标题：">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item label="组件间距">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <!-- 左侧导航背景颜色 -->
            <el-form-item label="左上背景色">
              <el-color-picker v-model="data.LeftBackgroundColor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 左侧字体颜色 -->
            <el-form-item label="左上文字色">
              <el-color-picker v-model="data.LeftFontColor" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 类型导航项 -->
        <el-form-item label="左上快链">
          <template v-if="data.leftNavList">
            <div v-for="(item, index) in data.leftNavList" class="setting-item">
              <div class="setting-remove" @click="delTypeNav(index)">
                <i class="iconfont icon-trash-alt" />
              </div>
              <div class="uploader-setting" style="padding-left: 0">
                <el-input v-model="item.titleName" placeholder="请输入快链名称" />
                <div class="goods-select" @click="setTypeNavLink(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'"> 商品： </template>
                    <template v-if="item.linkPage === 'category'"> 分类： </template>
                    <template v-if="item.linkPage === 'article'"> 文章： </template>
                    <template v-if="item.linkPage === 'planting'"> 软文： </template>
                    <template v-if="item.linkPage === 'link'"> 页面： </template>
                    <template v-if="item.linkPage === 'marketing'"> 营销： </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="iconfont icon-link" @click="setTypeNavLink(index)" />设置路径
                  </div>
                </div>
              </div>
            </div>
            <el-button
              :disabled="data.leftNavList.length >= 9"
              icon="el-icon-circle-plus-outline"
              class="banner-button-uploader"
              @click="addTypeNav"
            >
              添加快链
            </el-button>
            <div class="frm-tips">最多添加9个快链</div>
          </template>
        </el-form-item>
        <!-- 左侧图片挂件 -->
        <el-form-item label="左下图">
          <template v-if="data.leftImg">
            <div class="view-flex">
              <div>
                <div class="setting-item slider">
                  <img
                    v-if="data.leftImg.url"
                    :src="data.leftImg.url"
                    class="img-pendant__uploader"
                    @click="handleImgChange(0)"
                  >
                  <div v-else class="banner-uploader" @click="handleImgChange(0)">
                    <i class="iconfont icon-camera" />上传图片
                  </div>
                </div>
                <span class="frm-tips">建议尺寸：250x440</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 0)">
                    <div v-if="data.leftImg.children" class="link-content">
                      <template v-if="data.leftImg.children.data.linkPage === 'goods'">
                        商品：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'category'">
                        分类：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'article'">
                        文章：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'planting'">
                        软文：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'link'">
                        页面：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'marketing'">
                        营销：
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'custom_page'">
                        自定义页面：
                      </template>
                      {{ data.leftImg.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 0)">
                      <i class="iconfont icon-link" />设置路径
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- 右侧图片挂件1 -->
        <el-form-item label="右上图">
          <template v-if="data.rightImg1">
            <div class="view-flex">
              <div>
                <div class="setting-item slider">
                  <div v-if="data.rightImg1.url">
                    <img
                      :src="data.rightImg1.url"
                      class="img-pendant__uploader"
                      @click="handleImgChange(1)"
                    >
                  </div>
                  <div v-else class="banner-uploader" @click="handleImgChange(1)">
                    <i class="iconfont icon-camera" />上传图片
                  </div>
                </div>
                <span class="frm-tips">建议尺寸：155x280</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 1)">
                    <div v-if="data.rightImg1.children" class="link-content">
                      <template v-if="data.rightImg1.children.data.linkPage === 'goods'">
                        商品：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'category'">
                        分类：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'article'">
                        文章：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'planting'">
                        软文：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'link'">
                        页面：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'marketing'">
                        营销：
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'custom_page'">
                        自定义页面：
                      </template>
                      {{ data.rightImg1.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 1)">
                      <i class="iconfont icon-link" />设置路径
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- 右侧图片挂件 -->
        <el-form-item label="右下图">
          <template v-if="data.rightImg2">
            <div class="view-flex">
              <div>
                <div class="setting-item slider">
                  <div v-if="data.rightImg2.url">
                    <img
                      :src="data.rightImg2.url"
                      class="img-pendant__uploader"
                      @click="handleImgChange(2)"
                    >
                  </div>
                  <div v-else class="banner-uploader" @click="handleImgChange(2)">
                    <i class="iconfont icon-camera" />上传图片
                  </div>
                </div>
                <span class="frm-tips">建议尺寸：155x280</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 2)">
                    <div v-if="data.rightImg2.children" class="link-content">
                      <template v-if="data.rightImg2.children.data.linkPage === 'goods'">
                        商品：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'category'">
                        分类：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'article'">
                        文章：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'planting'">
                        软文：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'link'">
                        页面：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'marketing'">
                        营销：
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'custom_page'">
                        自定义页面：
                      </template>
                      {{ data.rightImg2.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 2)">
                      <i class="iconfont icon-link" />设置路径
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- Tab类型切换 -->
        <el-form-item label="组件导航">
          <template v-if="data.leftNavList">
            <div v-for="(item, index) in data.tabList" class="setting-item">
              <div class="setting-remove" @click="delTabList(index)">
                <i class="iconfont icon-trash-alt" />
              </div>
              <div class="uploader-setting" style="padding-left: 0">
                <el-input v-model="item.title" placeholder="请输入导航名称" />
              </div>
            </div>
            <el-button
              :disabled="data.leftNavList.length >= 9"
              icon="el-icon-circle-plus-outline"
              class="banner-button-uploader"
              @click="addTabList"
            >
              添加导航
            </el-button>
            <div class="frm-tips">最多添加9个导航</div>
          </template>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item label="导航关联商品">
          <template v-if="data.tabList && data.tabList.length > 0">
            <el-tabs v-model="data.activeName" type="card">
              <el-tab-pane
                v-for="(items, index) in data.tabList"
                :key="items.uuid"
                :label="items.title ? items.title : '未设置名称'"
                :name="index + ''"
              >
                <draggable
                  v-model="items.children"
                  class="content-bottom-padded"
                  :options="dragItemsOptions"
                  @end="onEnd"
                >
                  <div
                    v-for="(item, i) in items.children"
                    :key="item.id"
                    class="setting-item item-selected"
                  >
                    <img class="thumbnail" :src="wximageurl + item.pics[0]" alt="">
                    <div class="">
                      {{ item.item_name }}
                    </div>
                    <div class="setting-remove" @click="editGoods(i)">
                      <i class="el-icon-s-tool" />
                    </div>
                    <div class="setting-remove" @click="delGoods(i)">
                      <i class="el-icon-delete" />
                    </div>
                  </div>
                </draggable>
                <el-col :span="24">
                  <el-button
                    type="default"
                    icon="el-icon-setting"
                    class="banner-button-uploader"
                    @click="addGoods"
                  >
                    设置商品
                  </el-button>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </template>
          <div v-else class="frm-tips"><i class="el-icon-warning mark" /> 请先设置导航</div>
        </el-form-item>
      </el-form>
    </div>
    <imgPicker
      :dialog-visible="imgsVisible"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="imgsVisible = false"
    />
    <linkSetter
      :links="linksArr"
      :visible="linksVisible"
      :show_article="false"
      :show_planting="false"
      :show_page="false"
      :show_marketing="false"
      :show_store="false"
      @setLink="setLink"
      @closeDialog="linksVisible = false"
    />
    <goodsPicker
      usage="pc"
      :visible="goodsVisible"
      @pickGoods="pickGoods"
      @closeDialog="goodsVisible = false"
    />
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import imgPicker from '@/components/imageselect' //上传图片
import linkSetter from '@/components/template_links' //添加导航连接
import goodsPicker from '@/components/goods_picker' //添加商品
import marqueesEditor from '@/components/template_editor/marquees'
import { getItemsList } from '@/api/goods'

export default {
  name: 'FloorStyle',
  components: {
    draggable,
    linkSetter,
    imgPicker,
    goodsPicker
  },
  props: {
    res: {
      type: Object
    }
  },
  data() {
    return {
      temp: '',
      linksArr: ['goods', 'store', 'custom_page', 'category'],
      linksVisible: false, //添加类型导航设置路径 组建
      typeNavIndex: 0, //添加导航路径的 位置

      imgsVisible: false, // 上传图片组建
      isGetImage: false,
      imgIndex: 0, //添加图片挂机 位置 0=左侧图片挂机 1=右侧1 2=右侧2

      goodsVisible: false, //商品选择组建
      editItemStatus: true, //true 新增商品   false 修改商品
      editGoodsIndex: null,
      name: '',
      base: {},
      config: {},
      data: {},
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      }
    }
  },
  watch: {
    res: {
      deep: true,
      handler(value) {
        if (value) {
          this.setData(value)
        }
      }
    }
  },
  mounted() {
    this.setData(this.res)
  },
  methods: {
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
    },
    /**
     * 添加 tab类型
     */
    addTabList() {
      this.data.tabList.push({
        uuid: Date.now(),
        uuid2: Date.now() + 1,
        title: '',
        children: [] // 商品列表
      })
    },
    /**
     *删除选中的 Tab类型
     */
    delTabList(index) {
      this.data.tabList.splice(index, 1)
    },
    /**
     * 添加类型导航项
     */
    addTypeNav() {
      this.data.leftNavList.push({
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
    delTypeNav(index) {
      this.data.leftNavList.splice(index, 1)
    },
    /**
     * 调用 添加类型导航设置路径 组建
     */
    setTypeNavLink(index, i) {
      this.typeNavIndex = index
      this.imgIndex = i

      this.linksVisible = true
    },
    /**
     * 添加类型导航设置路径 || 添加图片挂件路径
     */
    setLink(data, type) {
      console.log('setLink---')
      console.log(data)
      console.log(type)

      if (this.typeNavIndex >= 0) {
        //添加类型导航设置路径
        this.data.leftNavList[this.typeNavIndex] = Object.assign(
          this.data.leftNavList[this.typeNavIndex],
          { linkPage: type },
          data
        )
      } else {
        //添加图片挂件路径
        switch (this.imgIndex) {
          case 0:
            this.data.leftImg.children = {
              data,
              type
            }
            break
          case 1:
            this.data.rightImg1.children = {
              data,
              type
            }
            break
          case 2:
            this.data.rightImg2.children = {
              data,
              type
            }
            break
          default:
            break
        }
      }

      console.log(this.data.leftNavList)
    },
    /**
     * 显示上传图片组建
     */
    handleImgChange(index) {
      this.imgIndex = index
      this.imgsVisible = true
      this.isGetImage = true
    },
    /**
     * 显示上传图片组建 回调
     */
    pickImg(data) {
      console.log('pickImg---')
      console.log(data)
      console.log(this.imgIndex)
      switch (this.imgIndex) {
        case 0:
          this.data.leftImg = data
          break
        case 1:
          this.data.rightImg1 = data
          break
        case 2:
          this.data.rightImg2 = data
          break
        default:
          break
      }
      this.imgsVisible = false
    },
    /**
     * 添加商品
     */
    addGoods() {
      this.editItemStatus = true
      this.goodsVisible = true
    },
    /**
     * 删除选中的商品
     */
    delGoods(index) {
      let i = Number(this.data.activeName)
      this.data.tabList[i].children.splice(index, 1)
    },

    /**
     * 修改选中的商品
     */
    editGoods(index) {
      this.editGoodsIndex = index
      this.editItemStatus = false
      this.goodsVisible = true
    },
    /**
     * 选择商品组建回调
     * */
    pickGoods(row) {
      let data = row.map(v => {
        return { ...v, item_name: v.title, item_id: v.goodsId, pics: [v.imgUrl] }
      })
      let i = Number(this.data.activeName)

      if (this.editItemStatus) {
        //新增
        this.data.tabList[i].children = [...this.data.tabList[i].children, ...data]
      } else {
        //修改
        let item = data.pop()
        this.data.tabList[i].children.splice(this.editGoodsIndex, 1, item)
      }
      this.goodsVisible = false
    },
    onEnd(evt) {
      this.temp = this.data.tabList[this.data.activeName].children[evt.oldIndex]
      this.data.tabList[this.data.activeName].children.splice(evt.oldIndex, 1)
      this.data.tabList[this.data.activeName].children.splice(evt.newIndex, 0, this.temp)
    }
  }
}
</script>
