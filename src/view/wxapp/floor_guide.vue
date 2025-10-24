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
<style scoped lang="scss">
$active-color: #ff593d;
$img-placeholder: #dcdddf;
$txt-placeholder: #f5f5f7;

/* 分类模块 */
.category-view-warp {
  position: relative;
}
.category-type-view {
  float: left;
  width: 100px;
  height: 100%;
  overflow: hidden;
}
.category-type-scroll {
  margin-right: -15px;
  height: 100%;
  overflow-y: overlay;
}
.category-view {
  width: 380px;
  height: 100%;
  padding: 10px 0;
  overflow: hidden;
  .template {
    margin-right: -15px;
    height: 100%;
    overflow-y: overlay;
  }
}
.category-setting-view {
  position: absolute;
  left: 420px;
  top: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 30px;
}
.btn-save {
  width: 200px;
  border-radius: 60px;
}
/* 模板展示样式 */
.layout-view {
  display: flex;
  width: 320px;
  margin: 0 auto;
  .el-tabs {
    margin: 0 auto;
  }
  .parent-view {
    width: 70px;
    .parent-item {
      margin: 0 auto;
      width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      line-height: 40px;
      font-size: 14px;
      cursor: pointer;
      &.active {
        color: $active-color;
      }
      .hot-tag {
        margin-right: 3px;
        padding: 2px 3px;
        vertical-align: super;
        text-align: center;
        background: #ff5000;
        border-radius: 3px;
        color: #fff;
        &::after {
          content: '热';
        }
      }
    }
  }
  .child-layout-view {
    flex: 1;
  }
}
.no-category-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320px;
  height: 100%;
  margin: 0 auto;
  padding: 50px 0;
  color: #dadada;
  background: #f8f8f8;
  border-radius: 10px;
  .iconfont {
    margin-top: -100px;
    font-size: 50px;
  }
}
/* 模板配置表单 */
.category-form {
  height: 100%;
  overflow-y: overlay;
  .series {
    position: relative;
    float: left;
    height: 40px;
    padding-right: 90px;
    .add-btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    width: 80%;
    .setting-img {
      position: relative;
      width: 50px;
      height: 50px;
      margin-right: 10px;
      line-height: 50px;
      border: 1px dashed #ccc;
      border-radius: 3px;
      text-align: center;
      color: #ccc;
      background: #fff;
      z-index: 5;
      cursor: pointer;
      .iconfont {
        font-size: 20px;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
    .el-input {
      margin-right: 10px;
      input {
        height: 50px;
        line-height: 50px;
      }
    }
    .bind-btn {
      width: 160px;
      padding: 0 20px;
      line-height: 40px;
      font-size: 14px;
      color: #888;
      background: #f8f8f8;
      border-radius: 5px;
      text-align: center;
      cursor: pointer;
      &.disable {
        opacity: 0.5;
      }
    }
    .control-bar {
      margin-right: 10px;
      color: #999;
      transition: all 0.3s ease;
      &.bind {
        cursor: pointer;
      }
      &.move {
        cursor: move;
      }
      &.remove {
        cursor: pointer;
      }
      &:hover {
        color: $dominant_hue;
      }
    }
  }
  .form-parent {
    position: relative;
    .form-item {
      position: relative;
      margin-bottom: 15px;
      z-index: 10;
    }
  }
}
.view-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #dadadd;
  font-size: 14px;
  .iconfont {
    font-size: 42px;
  }
}
.tags-view {
  height: 30px;
  overflow: hidden;
}
.tags-wrap {
  position: relative;
  height: 45px;
  overflow-x: auto;
  overflow-y: hidden;
  .tags {
    position: absolute;
    height: 35px;
    white-space: nowrap;
  }
  .tag-item {
    padding: 0 10px;
    display: inline-block;
    margin-right: 5px;
    line-height: 24px;
    border-radius: 24px;
    background: #efefef;
    font-size: 12px;
    cursor: pointer;
    &.active {
      background: $warning;
      color: #fff;
    }
  }
}
.stores-list {
  .store-item {
    position: relative;
    display: flex;
    padding: 10px 0;
    font-size: 12px;
    color: #999;
    &::after {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      content: '';
      background: #f5f5f5;
    }
    .store-img {
      width: 50px;
      height: 50px;
      margin-bottom: 5px;
      margin-right: 10px;
    }
    .store-caption {
      padding: 5px 0;
      flex: 1;
      .store-name {
        margin-bottom: 8px;
        color: #333;
        font-size: 13px;
        @include text-overflow();
      }
      .store-tag {
        @include text-overflow();
        span {
          display: inline-block;
          padding-right: 5px;
          font-size: 12px;
          color: #999;
        }
      }
    }
    .icon-trash {
      cursor: pointer;
    }
  }
}
</style>

<template>
  <transition name="el-fade-in-linear" mode="out-in">
    <div>
      <section
        class="section section-white category-view-warp"
        :style="'height: ' + (wheight - 160) + 'px;'"
      >
        <!-- 楼层引导模板样式展示 -->
        <div class="category-view">
          <div class="template">
            <div class="layout-view">
              <el-tabs v-if="series.length > 0" v-model="editableSeries" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) in series"
                  :key="item.name"
                  :label="item.title"
                  :name="item.name"
                />
              </el-tabs>
            </div>
            <div v-if="editableData.length > 0">
              <div class="layout-view">
                <div class="parent-view">
                  <div
                    v-for="(item, index) in editableData"
                    :key="index"
                    class="parent-item"
                    :class="{ active: index === curIdx }"
                    @click="switchTab(index)"
                  >
                    {{ item.name ? item.name : '楼层' }}
                  </div>
                </div>
                <div class="child-layout-view">
                  <div v-if="editableData[curIdx].tags.length" class="tags-view">
                    <div class="tags-wrap">
                      <ul class="tags">
                        <li
                          class="tag-item"
                          :class="{ active: currentTag === '' }"
                          @click="currentTag = ''"
                        >
                          全部
                        </li>
                        <li
                          v-for="(item, idx) in editableData[curIdx].tags"
                          class="tag-item"
                          :class="{ active: currentTag === item.id }"
                          @click="handleTagClick(item.id)"
                        >
                          {{ item.name }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div v-if="editableData[curIdx].stores.length" class="stores-list">
                    <div
                      v-for="item in editableData[curIdx].stores"
                      v-if="
                        currentTag === '' || item.tags.findIndex(n => n.id === currentTag) !== -1
                      "
                      :key="item.distributor_id"
                      class="store-item"
                    >
                      <img
                        class="store-img"
                        :src="item.logo ? item.logo : 'https://fakeimg.pl/50x50/EFEFEF/CCC/'"
                        alt=""
                      >
                      <div class="store-caption">
                        <div class="store-name">
                          {{ item.name }}
                        </div>
                        <div class="store-tag">
                          <span v-for="tag in item.tags">{{ tag.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="view-placeholder">
                    <i class="iconfont icon-shapes" />
                    请绑定楼层店铺
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!editableData.length" class="no-category-placeholder">
              <div class="iconfont icon-cubes" />
              <div>请添加楼层</div>
            </div>
          </div>
        </div>
        <!-- 分类模板设置表单 -->
        <div class="category-setting-view">
          <div class="category-form">
            <div class="content-bottom-padded clearfix">
              <div class="series">
                <el-tabs
                  v-if="series.length > 0"
                  v-model="editableSeries"
                  type="card"
                  closable
                  @tab-remove="removeTab"
                  @tab-click="handleClick"
                >
                  <el-tab-pane
                    v-for="(item, index) in series"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                  />
                </el-tabs>
                <el-popover v-model="seriesVisible" placement="top" width="160">
                  <div class="content-bottom-padded">
                    <el-input
                      v-model="seriesTitle"
                      type="text"
                      size="small"
                      placeholder="请输入系列名称"
                    />
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="handleCancel"> 取消 </el-button>
                    <el-button type="primary" size="mini" @click="addSeries"> 确定 </el-button>
                  </div>
                  <el-button slot="reference" type="text" class="add-btn iconfont icon-plus-circle">
                    添加区域
                  </el-button>
                </el-popover>
              </div>
            </div>
            <draggable v-model="editableData" :options="dragOptions">
              <div v-for="(item, idx) in editableData" :key="idx" class="form-parent">
                <div class="form-item">
                  <div class="control-bar move iconfont icon-stream" />
                  <div class="control-bar remove iconfont icon-cog" @click="showStore(idx)" />
                  <el-input v-model="item.name" placeholder="楼层" />
                  <div class="control-bar remove iconfont icon-trash" @click="remove(idx)" />
                </div>
              </div>
            </draggable>
            <el-button class="parent-add-btn iconfont icon-plus" @click="add()">
              添加楼层
            </el-button>
          </div>
        </div>
      </section>
      <section class="content-padded-s section-white content-center">
        <el-button class="btn-save" type="primary" @click="saveConfig"> 保存 </el-button>
      </section>
      <storeList
        :visible="storePickerVisible"
        multiple
        :data="curStores"
        @onClose="handleClose"
        @change="handleChange"
      />
      <sideBar :visible.sync="storeVisible" title="编辑商铺" width="24">
        <div v-if="curStores.length" class="stores-list">
          <div v-for="(item, idx) in curStores" :key="item.distributor_id" class="store-item">
            <img
              class="store-img"
              :src="item.logo ? item.logo : 'https://fakeimg.pl/50x50/EFEFEF/CCC/'"
              alt=""
            >
            <div class="store-caption">
              {{ item.name }}
            </div>
            <div class="iconfont icon-trash" @click="handleStoreRemove(idx)" />
          </div>
        </div>
        <div v-else class="view-placeholder">
          <i class="iconfont icon-store" />
          请绑定楼层店铺
        </div>
        <div slot="footer" class="content-center">
          <el-button
            type="primary"
            plain
            class="control-bar bind iconfont icon-cog"
            @click="bindStore()"
          >
            选择商铺
          </el-button>
        </div>
      </sideBar>
    </div>
  </transition>
</template>

<script>
import api from '@/api'
import { mapGetters } from 'vuex'
// 组件
import storeList from '@/components/function/storeList'
import sideBar from '@/components/element/sideBar'
// 第三方组件
import draggable from 'vuedraggable'
// api
import { getCategory } from '@/api/goods'
import { savePageParams, getParamByTempName, getCustomPageList } from '@/api/wxa'
export default {
  components: {
    storeList,
    sideBar,
    // 第三方组件
    draggable
  },
  data() {
    return {
      curIdx: 0,
      seriesVisible: false,
      // 模版保存提交的表单
      seriesTitle: '',
      editableSeries: '',
      series: [],
      editableData: [],
      form: {
        name: 'base',
        hasSeries: false,
        data: []
      },
      // 拖拽组件属性
      dragOptions: {
        group: 'parent',
        sort: true,
        handle: '.move',
        draggable: '.form-parent',
        forceFallback: false,
        animation: 150,
        scroll: true
      },
      // 分类选择器
      storeVisible: false,
      storePickerVisible: false,
      curStores: [],
      tags: [],
      currentTag: ''
    }
  },
  computed: {
    ...mapGetters(['wheight', 'template_name'])
  },
  mounted() {
    let filter = { template_name: this.template_name, version: 'v1.0.1', page_name: 'floor_guide' }
    getParamByTempName(filter).then(res => {
      if (res.data.data.list.length !== 0) {
        this.form = res.data.data.list[0].params
        if (!this.form.hasSeries) {
          this.editableData = res.data.data.list[0].params.data
          this.editableSeries = res.data.data.list[0].params.data.name
        } else {
          this.series = res.data.data.list[0].params.data
          this.editableData = this.series[0].content
          this.editableSeries = res.data.data.list[0].params.data[0].name
        }
      }
    })
  },
  methods: {
    // 添加系列
    addSeries() {
      if (!this.seriesTitle) {
        this.$message({ message: '区域名称必填', type: 'error' })
        return
      }
      let newTabName = Date.parse(new Date()) + ''
      this.series.push({
        title: this.seriesTitle,
        name: newTabName,
        content: !this.form.hasSeries ? this.editableData : []
      })
      this.editableSeries = newTabName
      this.seriesTitle = ''
      this.seriesVisible = false
      this.editableData = this.series[this.series.length - 1].content
      this.form.hasSeries = true
    },
    // 取消添加
    handleCancel() {
      this.seriesTitle = ''
      this.seriesVisible = false
    },
    // 移除系列
    removeTab(targetName) {
      this.$confirm('删除系列将删除该区域下绑定的所有店铺, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let tabs = this.series
          let activeName = this.editableSeries
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                let nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }

          this.editableSeries = activeName
          this.series = tabs.filter(tab => tab.name !== targetName)
          if (this.series.length === 0) {
            this.form.hasSeries = false
            this.editableData = this.form.data.find(item => item.name === targetName).content
          } else {
            this.editableData = this.form.data.find(item => item.name === activeName).content
          }
        })
        .catch(() => {})
    },
    // 点击tab
    handleClick(data) {
      this.editableData = this.series[data.index].content
      this.curIdx = 0
    },
    // 添加楼层
    add() {
      let item = {
        name: '',
        tags: [],
        stores: []
      }
      this.editableData.push(item)
    },
    // 移除楼层
    remove(idx) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.editableData.splice(idx, 1)
        })
        .catch(_ => {})
    },
    // 模版演示父级菜单切换
    switchTab(index) {
      this.curIdx = index
      this.curStores = JSON.parse(JSON.stringify(this.editableData[this.curIdx].stores))
    },
    // 分类设置绑定事件
    showStore(idx) {
      this.storeVisible = true
      this.curIdx = idx
      this.curStores = this.editableData[idx].stores
    },
    bindStore() {
      this.storePickerVisible = true
    },
    handleClose() {
      this.storePickerVisible = false
    },
    handleChange(val) {
      this.editableData[this.curIdx].stores = JSON.parse(JSON.stringify(val))
      this.curStores = JSON.parse(JSON.stringify(val))
      let ids = []
      val.map(item => {
        ids.push(item.id)
      })
      api.marketing
        .getDistributorList({ page: 1, pageSize: 200, is_valid: true, distributor_id: ids })
        .then(({ tagList }) => {
          let tags = []
          tagList.map(item => {
            tags.push({
              name: item.tag_name,
              id: item.tag_id
            })
          })
          this.editableData[this.curIdx].tags = tags
        })
      this.storePickerVisible = false
    },
    handleStoreRemove(idx) {
      this.editableData[this.curIdx].stores.splice(idx, 1)
      this.curStores.splice(idx, 1)
    },
    handleTagClick(id) {
      this.currentTag = id
    },
    // 保存设置
    saveConfig() {
      if (!this.form.hasSeries) {
        this.form.data = this.editableData
      } else {
        this.form.data = this.series
      }
      let param = {
        template_name: this.template_name,
        config: JSON.stringify([this.form]),
        page_name: 'floor_guide'
      }
      savePageParams(param).then(res => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
