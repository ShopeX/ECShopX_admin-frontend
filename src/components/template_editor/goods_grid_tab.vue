<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <section v-if="name === 'goodsGridTab'" class="section">
    <div class="section-header with-border">{{ $t('16920dd5.e366cc') }}</div>
    <div class="section-body">
      <el-form label-width="130px" :label-position="usage == 'mobile' ? 'left' : 'top'">
        <el-form-item :label="$t('16920dd5.32c65d')">
          <el-input v-model="base.title" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_subtitle" :label="$t('16920dd5.72cf37')">
          <el-input v-model="base.subtitle" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item v-if="show_space" :label="$t('16920dd5.4707ba')">
          <el-switch v-model="base.padded" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="usage == 'pc'" :label="$t('16920dd5.4707ba')">
          <el-input v-model="base.padded" type="number" />
        </el-form-item>
        <!-- <el-form-item label="样式" v-if="show_style">
          <el-radio-group v-model="config.style" @change="styleChange">
            <el-radio :label="'grid'"><i class="style-icon iconfont icon-th-large"></i></el-radio>
            <el-radio :label="'grids'"><i class="style-icon iconfont icon-th"></i></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item v-if="show_price" :label="$t('16920dd5.ba302e')">
          <el-switch v-model="config.showPrice" active-color="#27cc6a" inactive-color="#efefef" />
        </el-form-item>
        <el-form-item v-if="config.style !== 'grids' && show_brand" :label="$t('16920dd5.02af2a')">
          <el-switch v-model="config.brand" active-color="#27cc6a" inactive-color="#efefef" />
          <span class="muted content-padded">{{ $t('16920dd5.248261') }}</span>
        </el-form-item>
        <el-form-item :label="$t('16920dd5.c3ece5')">
          <el-button
            type="default"
            class="iconfont icon-plus-circle banner-button-uploader"
            size="mini"
            @click="addTab"
          >
            {{ $t('16920dd5.736eaa') }}
          </el-button>
          <el-tabs v-model="editableTabsValue" closable @tab-remove="removeTab">
            <el-tab-pane
              v-for="(item, index) in list"
              :key="index"
              lazy
              :label="item.tabTitle"
              :name="'tab' + (index + 1)"
            >
              <el-form-item
                :label="$t('16920dd5.152f1c')"
                label-width="80px"
                style="margin: 10px 0; max-width: 500px"
              >
                <el-input v-model="item.tabTitle" type="text" maxlength="10" show-word-limit />
              </el-form-item>

              <el-button
                type="default"
                class="iconfont icon-cog banner-button-uploader"
                @click="setGoods(index)"
              >
                {{ $t('16920dd5.7d3792') }}
              </el-button>
              <span style="font-size: 12px; margin-left: 20px">{{ $t('16920dd5.d58793') }}</span>
              <el-row
                v-if="list[index].goodsList.length > 0"
                :gutter="20"
                class="content-bottom-padded"
                style="margin-left: 0px; margin-right: 0px"
              >
                <draggable v-model="item.goodsList" :options="dragItemsOptions" @end="onEnd">
                  <!-- <div class="setting-item item-selected" v-for="(item, index) in items" :key="index"> -->
                  <el-col
                    v-for="(item_y, index_y) in list[index].goodsList"
                    :key="index_y"
                    :span="6"
                    class="setting-item item-selected"
                    @mouseover.native="mouseoverHandle(index_y)"
                    @mouseleave.native="mouseleaveHandle()"
                  >
                    <img class="thumbnail" :src="wximageurl + item_y.imgUrl" alt="">
                    <div class="title">
                      {{ item_y.title }}
                    </div>
                    <div
                      :class="[{ active: index_y == activeIndex }, ' settingRemove']"
                      @click="removeItem(index, index_y)"
                    >
                      <i class="iconfont el-icon-error" />
                    </div>
                  </el-col>
                </draggable>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>

        <el-form-item v-if="config.moreLink" :label="$t('16920dd5.15d47a')">
          <div class="goods-select" @click="handleMoreLink">
            <div v-if="config.moreLink.title" class="link-content">
              <template v-if="config.moreLink.linkPage === 'goods'">
                {{ $t('16920dd5.10fe9c') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'category'">
                {{ $t('16920dd5.e7d2e8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'article'">
                {{ $t('16920dd5.8cb9b8') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'planting'">
                {{ $t('16920dd5.9dcd91') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'link'">
                {{ $t('16920dd5.ffd741') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'marketing'">
                {{ $t('16920dd5.c78a2f') }}
              </template>
              <template v-if="config.moreLink.linkPage === 'custom_page'">
                {{ $t('16920dd5.15ed03') }}
              </template>
              {{ config.moreLink.title }}
            </div>
            <div v-else class="content-center">
              <i class="el-icon-link" />{{ $t('16920dd5.4f2c29') }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    res: {
      type: Object,
      default: {}
    },
    show_space: {
      type: Boolean,
      default: true
    },
    show_style: {
      type: Boolean,
      default: true
    },
    show_brand: {
      type: Boolean,
      default: true
    },
    show_subtitle: {
      type: Boolean,
      default: true
    },
    show_price: {
      type: Boolean,
      default: true
    },
    limit_num: {
      // 限制上传商品的数量
      type: Number,
      default: 0
    },
    usage: {
      type: String,
      default: 'mobile'
    }
  },
  data() {
    return {
      name: '',
      base: {},
      config: {},
      data: [],
      list: [],
      items: [],
      tabList: [],
      listIndex: '',
      temp: '',
      dragItemsOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true
      },
      editableTabsValue: 'tab1',
      tabIndex: 0,
      activeIndex: null
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
    addTab(targetName) {
      let newTabName = this.list.length + 1
      let item = {
        tabTitle: 'newTab',
        goodsList: []
      }
      this.list.push(item)
      this.editableTabsValue = 'tab' + newTabName
    },
    removeTab(targetName) {
      let tabs = this.list
      let activeName = this.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if ('tab' + (index + 1) === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName =
                (tabs[index + 1] && 'tab' + (index + 1)) || (tabs[index] && 'tab' + index)
            }
          }
        })
      }

      this.editableTabsValue = activeName
      tabs.forEach((tab, index) => {
        if ('tab' + (index + 1) == targetName) {
          tabs.splice(index, 1)
          return
        }
      })
    },
    mouseoverHandle(index) {
      this.activeIndex = index
    },
    mouseleaveHandle() {
      this.activeIndex = null
    },
    setData(val) {
      this.name = val.name
      this.base = val.base
      this.config = val.config
      this.data = val.data
      this.items = val.list
      this.list = val.list ? val.list : []
      this.tabList = val.tabList
      if (val.base) {
        this.listIndex = val.base.listIndex
      }
    },
    removeList(index) {
      this.list.splice(index, 1)
    },
    removeItem(index, i) {
      this.list[index].goodsList.splice(i, 1)
    },
    setGoods(index) {
      this.base.listIndex = index
      this.$emit('bindGoods')
    },
    styleChange(val) {
      if (val === 'grids') {
        this.config.brand = false
      }
    },
    onEnd(evt) {
      this.temp = this.data[evt.oldIndex]
      this.data.splice(evt.oldIndex, 1)
      this.data.splice(evt.newIndex, 0, this.temp)
    },
    handleMoreLink() {
      this.$emit('bindLinks')
    }
  }
}
</script>

<style scoped lang="scss">
.style-icon {
  font-size: 20px;
  color: #aeaeae;
  vertical-align: middle;
}
.tab-list {
  padding-right: 30px;
  display: flex;
  flex-direction: column;
}
</style>
