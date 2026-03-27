<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section floorStyle">
    <div class="section-header with-border">{{ $t('9549f378.1c883a') }}</div>
    <div class="section-body">
      <el-form ref="data" v-model="data" label-position="top">
        <!-- 标题 -->
        <el-form-item :label="$t('9549f378.d0b05b')">
          <el-input v-model="base.title" />
        </el-form-item>
        <el-form-item :label="$t('9549f378.72cf37')">
          <el-input v-model="base.subtitle" />
        </el-form-item>
        <el-form-item :label="$t('9549f378.4707ba')">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <!-- 左侧导航背景颜色 -->
            <el-form-item :label="$t('9549f378.320d61')">
              <el-color-picker v-model="data.LeftBackgroundColor" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 左侧字体颜色 -->
            <el-form-item :label="$t('9549f378.333acc')">
              <el-color-picker v-model="data.LeftFontColor" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 类型导航项 -->
        <el-form-item :label="$t('9549f378.49e88f')">
          <template v-if="data.leftNavList">
            <div v-for="(item, index) in data.leftNavList" class="setting-item">
              <div class="setting-remove" @click="delTypeNav(index)">
                <i class="el-icon-delete" />
              </div>
              <div class="uploader-setting" style="padding-left: 0">
                <el-input v-model="item.titleName" :placeholder="$t('9549f378.9cb0c6')" />
                <div class="goods-select" @click="setTypeNavLink(index)">
                  <div v-if="item.id" class="link-content">
                    <template v-if="item.linkPage === 'goods'">
                      {{ $t('9549f378.10fe9c') }}
                    </template>
                    <template v-if="item.linkPage === 'category'">
                      {{ $t('9549f378.e7d2e8') }}
                    </template>
                    <template v-if="item.linkPage === 'article'">
                      {{ $t('9549f378.8cb9b8') }}
                    </template>
                    <template v-if="item.linkPage === 'planting'">
                      {{ $t('9549f378.9dcd91') }}
                    </template>
                    <template v-if="item.linkPage === 'link'">
                      {{ $t('9549f378.ffd741') }}
                    </template>
                    <template v-if="item.linkPage === 'marketing'">
                      {{ $t('9549f378.c78a2f') }}
                    </template>
                    {{ item.title }}
                  </div>
                  <div v-else class="content-center">
                    <i class="el-icon-link" @click="setTypeNavLink(index)" />{{
                      $t('9549f378.4f2c29')
                    }}
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
              {{ $t('9549f378.709c56') }}
            </el-button>
            <div class="frm-tips">{{ $t('9549f378.90698a') }}</div>
          </template>
        </el-form-item>
        <!-- 左侧图片挂件 -->
        <el-form-item :label="$t('9549f378.757243')">
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
                    <i class="el-icon-camera" />{{ $t('9549f378.ce6855') }}
                  </div>
                </div>
                <span class="frm-tips">{{ $t('9549f378.d304ef') }}</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 0)">
                    <div v-if="data.leftImg.children" class="link-content">
                      <template v-if="data.leftImg.children.data.linkPage === 'goods'">
                        {{ $t('9549f378.10fe9c') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'category'">
                        {{ $t('9549f378.e7d2e8') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'article'">
                        {{ $t('9549f378.8cb9b8') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'planting'">
                        {{ $t('9549f378.9dcd91') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'link'">
                        {{ $t('9549f378.ffd741') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'marketing'">
                        {{ $t('9549f378.c78a2f') }}
                      </template>
                      <template v-if="data.leftImg.children.data.linkPage === 'custom_page'">
                        {{ $t('9549f378.15ed03') }}
                      </template>
                      {{ data.leftImg.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 0)">
                      <i class="el-icon-link" />{{ $t('9549f378.4f2c29') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- 右侧图片挂件1 -->
        <el-form-item :label="$t('9549f378.1b773e')">
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
                    <i class="el-icon-camera" />{{ $t('9549f378.ce6855') }}
                  </div>
                </div>
                <span class="frm-tips">{{ $t('9549f378.0146da') }}</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 1)">
                    <div v-if="data.rightImg1.children" class="link-content">
                      <template v-if="data.rightImg1.children.data.linkPage === 'goods'">
                        {{ $t('9549f378.10fe9c') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'category'">
                        {{ $t('9549f378.e7d2e8') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'article'">
                        {{ $t('9549f378.8cb9b8') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'planting'">
                        {{ $t('9549f378.9dcd91') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'link'">
                        {{ $t('9549f378.ffd741') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'marketing'">
                        {{ $t('9549f378.c78a2f') }}
                      </template>
                      <template v-if="data.rightImg1.children.data.linkPage === 'custom_page'">
                        {{ $t('9549f378.15ed03') }}
                      </template>
                      {{ data.rightImg1.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 1)">
                      <i class="el-icon-link" />{{ $t('9549f378.4f2c29') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- 右侧图片挂件 -->
        <el-form-item :label="$t('9549f378.b46ad1')">
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
                    <i class="el-icon-camera" />{{ $t('9549f378.ce6855') }}
                  </div>
                </div>
                <span class="frm-tips">{{ $t('9549f378.0146da') }}</span>
              </div>
              <div class="view-flex-item">
                <div class="uploader-setting">
                  <div class="goods-select" @click="setTypeNavLink(-1, 2)">
                    <div v-if="data.rightImg2.children" class="link-content">
                      <template v-if="data.rightImg2.children.data.linkPage === 'goods'">
                        {{ $t('9549f378.10fe9c') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'category'">
                        {{ $t('9549f378.e7d2e8') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'article'">
                        {{ $t('9549f378.8cb9b8') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'planting'">
                        {{ $t('9549f378.9dcd91') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'link'">
                        {{ $t('9549f378.ffd741') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'marketing'">
                        {{ $t('9549f378.c78a2f') }}
                      </template>
                      <template v-if="data.rightImg2.children.data.linkPage === 'custom_page'">
                        {{ $t('9549f378.15ed03') }}
                      </template>
                      {{ data.rightImg2.children.data.title }}
                    </div>
                    <div v-else class="content-center" @click="setTypeNavLink(-1, 2)">
                      <i class="el-icon-link" />{{ $t('9549f378.4f2c29') }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-form-item>
        <!-- Tab类型切换 -->
        <el-form-item :label="$t('9549f378.16bca6')">
          <template v-if="data.leftNavList">
            <div v-for="(item, index) in data.tabList" class="setting-item">
              <div class="setting-remove" @click="delTabList(index)">
                <i class="el-icon-delete" />
              </div>
              <div class="uploader-setting" style="padding-left: 0">
                <el-input v-model="item.title" :placeholder="$t('9549f378.be34cc')" />
              </div>
            </div>
            <el-button
              :disabled="data.leftNavList.length >= 9"
              icon="el-icon-circle-plus-outline"
              class="banner-button-uploader"
              @click="addTabList"
            >
              {{ $t('9549f378.4b742d') }}
            </el-button>
            <div class="frm-tips">{{ $t('9549f378.bf2ce5') }}</div>
          </template>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item :label="$t('9549f378.9d60e7')">
          <template v-if="data.tabList && data.tabList.length > 0">
            <el-tabs v-model="data.activeName" type="card">
              <el-tab-pane
                v-for="(items, index) in data.tabList"
                :key="items.uuid"
                :label="items.title ? items.title : $t('9549f378.713219')"
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
                    {{ $t('9549f378.8ab0d7') }}
                  </el-button>
                </el-col>
              </el-tab-pane>
            </el-tabs>
          </template>
          <div v-else class="frm-tips">
            <i class="el-icon-warning mark" /> {{ $t('9549f378.3c1725') }}
          </div>
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
      let data = row.map((v) => {
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
