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
  margin-left: 100px;
  overflow: hidden;
  .template {
    margin-right: -15px;
    height: 100%;
    overflow-y: overlay;
  }
}
.category-setting-view {
  position: absolute;
  left: 500px;
  top: 0;
  right: 0;
  bottom: 0;
  padding-bottom: 30px;
}
.btn-save {
  width: 200px;
  border-radius: 60px;
}
/* 模板微缩样式 */
.layout-miniature {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: #fff;
  opacity: 0.4;
  cursor: pointer;
  &.active {
    position: relative;
    opacity: 1;
    &::after {
      position: absolute;
      left: 0;
      top: 10px;
      bottom: 10px;
      width: 5px;
      background: $active-color;
      content: '';
    }
  }
  .layout {
    display: flex;
    width: 60px;
    background: #fff;
    .layout-left {
      text-align: center;
      width: 12px;
      .layout-item {
        width: 7px;
        height: 7px;
        margin: 3px auto;
        background: $txt-placeholder;
        border-radius: 50%;
        &.active {
          background: $active-color;
        }
      }
    }
    .layout-right {
      flex: 1;
      .layout-group {
        padding: 3px;
        .layout-banner {
          height: 15px;
          background: $img-placeholder;
          margin-bottom: 5px;
          &.active {
            background: $active-color;
          }
        }
        .layout-item-list {
          display: flex;
          flex-wrap: wrap;
          .layout-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-bottom: 5px;
            width: 33.3333%;
            .item-icon {
              width: 10px;
              height: 10px;
              margin-bottom: 3px;
              background: $img-placeholder;
            }
            .item-name {
              width: 10px;
              height: 3px;
              background: $txt-placeholder;
              border-radius: 6px;
            }
          }
        }
        .layout-goods-list {
          .layout-item {
            display: flex;
            margin-bottom: 3px;
            .item-img {
              width: 10px;
              height: 10px;
              background: $img-placeholder;
            }
            .item-caption {
              flex: 1;
              padding-left: 3px;
              .item-txt-line {
                position: relative;
                &::before {
                  position: absolute;
                  left: 0;
                  top: 0;
                  right: 0;
                  height: 3px;
                  background: $txt-placeholder;
                  content: '';
                }
                &::after {
                  position: absolute;
                  left: 0;
                  top: 5px;
                  right: 20px;
                  height: 3px;
                  background: $txt-placeholder;
                  content: '';
                }
              }
            }
          }
        }
      }
    }
    &.layout-second {
      .layout-right {
        display: block;
        .layout-group {
          .layout-banner {
            height: 25px;
          }
          .layout-item {
            .item-icon {
              width: 12px;
              height: 12px;
            }
            .item-name {
              width: 12px;
            }
          }
        }
      }
    }
  }
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
      font-size: 12px;
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
    .layout-group {
      .parent-img {
        display: block;
        width: 250px;
        height: auto;
        margin-bottom: 10px;
      }
      .second-title {
        padding: 10px 10px 0;
        font-weight: bold;
      }
      .child-view {
        display: flex;
        flex-wrap: wrap;
        flex: 1;
        padding-top: 10px;
        .child-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-bottom: 10px;
          width: 33.3333%;
          font-size: 12px;
          color: #999;
          text-align: center;
          .child-img {
            width: 50px;
            height: 50px;
            margin-bottom: 5px;
          }
        }
      }
      .child-goods-view {
        .child-item {
          display: flex;
          margin-bottom: 10px;
          .item-img {
            width: 70px;
            height: 70px;
          }
          .item-caption {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            padding-left: 10px;
            .item-title {
              margin-bottom: 5px;
              line-height: 1.3;
              font-size: 14px;
              color: #666;
            }
            .item-desc {
              line-height: 1.2;
              font-size: 12px;
              color: #999;
            }
            .item-icon {
              padding-right: 10px;
              text-align: right;
              color: #ccc;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  &.layout-second {
    .child-layout-view {
      display: block;
      .layout-group {
        height: 120px;
        margin-bottom: 10px;
        transition: all 0.5s ease;
        overflow: hidden;
        &.active {
          height: auto;
        }
        .parent-img {
          width: 320px;
          height: auto;
        }
        .child-view {
          .child-item {
            .child-img {
              width: 70px;
              height: 70px;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
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
  color: #ccc;
  border: 1px solid #efefef;
  border-radius: 10px;
  .iconfont {
    margin-top: -100px;
    font-size: 50px;
    color: #eaeaea;
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
    .icon-times {
      display: inline-block;
      width: 15px;
      height: 15px;
      line-height: 15px;
      font-size: 9px;
      border-radius: 100%;
      transition: all 0.3s ease;
      text-align: center;
      &:hover {
        color: #fff;
        background: #c0c4dd;
      }
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    width: 90%;
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
      flex: 1;
      margin-right: 10px;
      input {
        height: 50px;
        line-height: 50px;
      }
    }
    .bind-btn {
      width: 230px;
      padding: 10px 20px;
      font-size: 14px;
      color: $dominant_hue;
      background: #fff;
      border-radius: 5px;
      text-align: center;
      box-shadow: 0 0 0 1px rgba(32, 131, 224, 0.5);
      cursor: pointer;
      &.iconfont {
        color: #888;
        background: #f8f8f8;
        box-shadow: none;
      }
    }
    .control-bar {
      margin-left: 10px;
      color: #999;
      &.move {
        cursor: move;
      }
      &.remove {
        cursor: pointer;
      }
    }
  }
  .form-parent,
  .form-second {
    position: relative;
    .form-item {
      position: relative;
      margin-bottom: 15px;
      z-index: 10;
    }
    &::after {
      display: block;
      position: absolute;
      width: 1px;
      left: 25px;
      top: 0;
      bottom: 0;
      background: #efefef;
      content: '';
      z-index: 0;
    }
  }
  .el-checkbox {
    margin-left: 15px;
    margin-right: 5px;
  }
  .parent-add-btn {
    margin-top: 20px;
  }
  .form-child {
    padding-left: 65px;
    .form-item {
      margin-bottom: 10px;
    }
    .child-add-btn {
      color: #666;
    }
  }
}
/* 模板选择分类弹窗 */
.category-list {
  padding: 0 20px;
  .parent {
    color: #999;
    font-size: 16px;
  }
  .children {
    padding: 5px 0 20px 10px;
    .child-item {
      display: inline-block;
      padding: 0 10px;
      margin-right: 5px;
      line-height: 30px;
      border-radius: 3px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.5s ease;
      &:hover {
        box-shadow: 0 0 0 1px rgba($active-color, 0.8);
        background: rgba($active-color, 0.4);
      }
      &.active {
        box-shadow: 0 0 0 1px rgba($active-color, 0.6);
        background: rgba($active-color, 0.2);
      }
    }
  }
}
.empty_div {
  min-height: 150px;
}
</style>

<style lang="scss">
.series-name-input {
  width: 80px;
  vertical-align: top;
  .el-input__inner {
    background: #efefef;
    border: none;
  }
}
</style>

<template>
  <transition
    name="el-fade-in-linear"
    mode="out-in"
  >
    <div>
      <section
        class="section section-white category-view-warp"
        :style="'height: ' + (wheight - 160) + 'px;'"
      >
        <!-- 模板分类微缩展示 -->
        <div class="category-type-view">
          <div class="category-type-scroll">
            <div
              class="layout-miniature"
              :class="{ active: form.name === 'base' }"
              @click="switchType('base')"
            >
              <div class="layout">
                <div class="layout-left">
                  <div
                    class="layout-item"
                    :class="{ active: form.name === 'base' }"
                  />
                  <div class="layout-item" />
                </div>
                <div class="layout-right">
                  <div class="layout-group">
                    <div class="layout-banner" />
                    <div class="layout-item-list">
                      <div class="layout-item">
                        <div class="item-icon" />
                        <div class="item-name" />
                      </div>
                      <div class="layout-item">
                        <div class="item-icon" />
                        <div class="item-name" />
                      </div>
                      <div class="layout-item">
                        <div class="item-icon" />
                        <div class="item-name" />
                      </div>
                      <div class="layout-item">
                        <div class="item-icon" />
                        <div class="item-name" />
                      </div>
                      <div class="layout-item">
                        <div class="item-icon" />
                        <div class="item-name" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="layout-miniature" :class="{active : form.name === 'fresh'}" @click="switchType('fresh')">
              <div class="layout">
                <div class="layout-left">
                  <div class="layout-item" :class="{active : form.name === 'fresh'}"></div>
                  <div class="layout-item"></div>
                </div>
                <div class="layout-right">
                  <div class="layout-group">
                    <div class="layout-banner"></div>
                    <div class="layout-goods-list">
                      <div class="layout-item">
                        <div class="item-img"></div>
                        <div class="item-caption">
                          <div class="item-txt-line"></div>
                        </div>
                      </div>
                      <div class="layout-item">
                        <div class="item-img"></div>
                        <div class="item-caption">
                          <div class="item-txt-line"></div>
                        </div>
                      </div>
                      <div class="layout-item">
                        <div class="item-img"></div>
                        <div class="item-caption">
                          <div class="item-txt-line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- <div class="layout-miniature" :class="{active : form.name === 'beauty'}" @click="switchType('beauty')">
              <div class="layout layout-second">
                <div class="layout-right">
                  <div class="layout-group">
                    <div class="layout-banner" :class="{active : form.name === 'beauty'}"></div>
                    <div class="layout-item-list">
                      <div class="layout-item">
                        <div class="item-icon"></div>
                        <div class="item-name"></div>
                      </div>
                      <div class="layout-item">
                        <div class="item-icon"></div>
                        <div class="item-name"></div>
                      </div>
                      <div class="layout-item">
                        <div class="item-icon"></div>
                        <div class="item-name"></div>
                      </div>
                      <div class="layout-item">
                        <div class="item-icon"></div>
                        <div class="item-name"></div>
                      </div>
                      <div class="layout-item">
                        <div class="item-icon"></div>
                        <div class="item-name"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <!-- 分类模板样式展示 -->
        <div class="category-view">
          <div class="template">
            <div class="layout-view">
              <el-tabs
                v-if="series.length > 0"
                v-model="editableSeries"
                @tab-click="handleClick"
              >
                <el-tab-pane
                  v-for="(item, index) in series"
                  :key="item.name"
                  :label="item.title"
                  :name="item.name"
                />
              </el-tabs>
            </div>
            <div v-if="form.name == 'base' && editableData.length > 0">
              <div class="layout-view">
                <div class="parent-view">
                  <div
                    v-for="(item, index) in editableData"
                    :key="index"
                    class="parent-item"
                    :class="{ active: index === currentFidx }"
                    @click="switchTab(index)"
                  >
                    <span
                      v-if="item.hot"
                      class="hot-tag"
                    />{{ item.name ? item.name : '分类' }}
                  </div>
                </div>
                <div class="child-layout-view">
                  <div class="layout-group">
                    <img
                      class="parent-img"
                      :src="
                        editableData[currentFidx].img
                          ? editableData[currentFidx].img
                          : 'https://fakeimg.pl/250x100/EFEFEF/CCC/'
                      "
                      alt=""
                    >
                    <div
                      v-for="(sitem, sidx) in editableData[currentFidx].children"
                      :key="sidx"
                      class="child"
                    >
                      <div
                        v-if="sitem.name"
                        class="second-title"
                      >
                        {{ sitem.name }}
                      </div>
                      <div class="child-view">
                        <div
                          v-for="(litem, lidx) in sitem.children"
                          :key="lidx"
                          class="child-item"
                        >
                          <img
                            class="child-img"
                            :src="litem.img ? litem.img : 'https://fakeimg.pl/50x50/EFEFEF/CCC/'"
                            alt=""
                          >
                          <div>{{ litem.name ? litem.name : '子分类' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="form.name == 'fresh' && editableData.length > 0">
              <div class="layout-view">
                <div class="parent-view">
                  <div
                    v-for="(item, index) in editableData"
                    :key="index"
                    class="parent-item"
                    :class="{ active: index === currentFidx }"
                    @click="switchTab(index)"
                  >
                    {{ item.name ? item.name : '分类' }}
                  </div>
                </div>
                <div class="child-layout-view">
                  <div class="layout-group">
                    <img
                      class="parent-img"
                      :src="
                        editableData[currentFidx].img
                          ? editableData[currentFidx].img
                          : 'https://fakeimg.pl/250x100/EFEFEF/CCC/'
                      "
                      alt=""
                    >
                    <div
                      v-for="item in 3"
                      class="child-goods-view"
                    >
                      <div class="child-item">
                        <img
                          class="item-img"
                          src="https://fakeimg.pl/70x70/EFEFEF/CCC/"
                          alt=""
                        >
                        <div class="item-caption">
                          <div>
                            <div class="item-title">
                              当前类目商品标题
                            </div>
                            <div class="item-desc">
                              当前类目商品描述
                            </div>
                          </div>
                          <div class="item-icon">
                            <div class="iconfont icon-cart-plus" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="form.name == 'beauty' && editableData.length > 0">
              <div class="layout-view layout-second">
                <div class="child-layout-view">
                  <div
                    v-for="(item, index) in editableData"
                    :key="index"
                    class="layout-group"
                    :class="{ active: index === currentFidx }"
                  >
                    <img
                      class="parent-img"
                      :src="item.img ? item.img : 'https://fakeimg.pl/320x120/EFEFEF/CCC/'"
                      alt=""
                      @click="switchTab(index)"
                    >
                    <div
                      v-for="(sitem, sidx) in item.children"
                      :key="sidx"
                      class="child"
                    >
                      <div
                        v-if="sitem.name"
                        class="second-title"
                      >
                        {{ sitem.name }}
                      </div>
                      <div class="child-view">
                        <div
                          v-for="(litem, lidx) in sitem.children"
                          :key="lidx"
                          class="child-item"
                        >
                          <img
                            class="child-img"
                            :src="litem.img ? litem.img : 'https://fakeimg.pl/70x70/EFEFEF/CCC/'"
                            alt=""
                          >
                          <div>{{ litem.name ? litem.name : '子分类' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!editableData.length"
              class="no-category-placeholder"
            >
              <div class="iconfont icon-th-list" />
              <div>请添加分类</div>
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
                  @tab-click="handleClick"
                >
                  <el-tab-pane
                    v-for="(item, index) in series"
                    :key="item.name"
                    :label="item.title"
                    :name="item.name"
                  >
                    <span
                      v-if="editableSeries === item.name"
                      slot="label"
                    >
                      <el-input
                        v-model="item.title"
                        size="mini"
                        class="series-name-input"
                      />
                      <i
                        class="iconfont icon-times"
                        @click="removeTab(item.name)"
                      />
                    </span>
                  </el-tab-pane>
                </el-tabs>
                <el-popover
                  v-model="seriesVisible"
                  placement="top"
                  width="160"
                >
                  <div class="content-bottom-padded">
                    <el-input
                      v-model="seriesTitle"
                      type="text"
                      size="small"
                      placeholder="请输入系列名称"
                    />
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleCancel"
                    >
                      取消
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="addSeries"
                    >
                      确定
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    class="add-btn iconfont icon-plus-circle"
                  >
                    添加系列
                  </el-button>
                </el-popover>
              </div>
            </div>
            <draggable
              v-model="editableData"
              :options="dragParentOptions"
            >
              <div
                v-for="(item, fidx) in editableData"
                :key="fidx"
                class="form-parent"
              >
                <div class="form-item">
                  <div
                    class="setting-img"
                    @click="showImgs(fidx)"
                  >
                    <img
                      v-if="item.img"
                      :src="item.img ? item.img : 'https://fakeimg.pl/50x50'"
                      alt=""
                    >
                    <div
                      v-else
                      class="iconfont icon-images"
                    />
                  </div>
                  <el-input
                    v-model="item.name"
                    placeholder="名称"
                  />
                  <div
                    v-if="form.name === 'fresh'"
                    class="bind-btn iconfont icon-link"
                    @click="showCategory(fidx)"
                  >
                    {{ item.category_name ? item.category_name : '绑定分类' }}
                  </div>
                  <div
                    class="bind-btn iconfont icon-link"
                    @click="openPageDialog(fidx)"
                  >
                    {{ item.page_name ? item.page_name : '绑定自定义页面' }}
                  </div>
                  <el-checkbox v-model="item.hot">
                    热推
                  </el-checkbox>
                  <div class="control-bar move iconfont icon-stream" />
                  <div
                    class="control-bar remove iconfont icon-trash"
                    @click="remove(fidx)"
                  />
                </div>
                <div
                  v-if="form.name !== 'fresh'"
                  class="form-child"
                >
                  <draggable
                    v-model="item.children"
                    :options="dragSecondOptions"
                  >
                    <div
                      v-for="(sitem, sidx) in item.children"
                      :key="sidx"
                      class="form-second"
                    >
                      <div class="form-item">
                        <div
                          class="setting-img"
                          @click="showImgs(fidx, sidx)"
                        >
                          <img
                            v-if="sitem.img"
                            :src="sitem.img ? sitem.img : 'https://fakeimg.pl/50x50'"
                            alt=""
                          >
                          <div
                            v-else
                            class="iconfont icon-images"
                          />
                        </div>
                        <el-input
                          v-model="sitem.name"
                          placeholder="名称"
                        />
                        <div
                          class="bind-btn"
                          :class="{
                            ' iconfont icon-link': !sitem.main_category_id && !sitem.category_id
                          }"
                          @click="showCategory(fidx, sidx)"
                        >
                          {{ sitem.main_category_id ? '主类目：' : ''
                          }}{{ sitem.category_id ? '商品分类：' : ''
                          }}{{ sitem.category_name ? sitem.category_name : '绑定分类' }}
                        </div>
                        <div class="control-bar move iconfont icon-stream" />
                        <div
                          class="control-bar remove iconfont icon-trash"
                          @click="remove(fidx, sidx)"
                        />
                      </div>
                      <div class="form-child">
                        <draggable
                          v-model="sitem.children"
                          :options="dragLastOptions"
                        >
                          <div
                            v-for="(litem, lidx) in sitem.children"
                            :key="lidx"
                            class="form-last"
                          >
                            <div class="form-item">
                              <div
                                class="setting-img"
                                @click="showImgs(fidx, sidx, lidx)"
                              >
                                <img
                                  v-if="litem.img"
                                  :src="litem.img ? litem.img : 'https://fakeimg.pl/50x50'"
                                  alt=""
                                >
                                <div
                                  v-else
                                  class="iconfont icon-images"
                                />
                              </div>
                              <el-input
                                v-model="litem.name"
                                placeholder="名称"
                              />
                              <div
                                class="bind-btn"
                                :class="{
                                  'iconfont icon-link':
                                    !litem.main_category_id && !litem.category_id
                                }"
                                @click="showCategory(fidx, sidx, lidx)"
                              >
                                {{ litem.main_category_id ? '主类目：' : ''
                                }}{{ litem.category_id ? '商品分类：' : ''
                                }}{{ litem.category_name ? litem.category_name : '绑定分类' }}
                              </div>
                              <div class="control-bar move iconfont icon-stream" />
                              <div
                                class="control-bar remove iconfont icon-trash"
                                @click="remove(fidx, sidx, lidx)"
                              />
                            </div>
                          </div>
                        </draggable>
                        <el-button
                          type="text"
                          class="child-add-btn iconfont icon-plus-circle"
                          @click="add(fidx, sidx)"
                        >
                          添加三级分类
                        </el-button>
                      </div>
                    </div>
                  </draggable>
                  <el-button
                    type="text"
                    class="child-add-btn iconfont icon-plus-circle"
                    @click="add(fidx)"
                  >
                    添加二级分类
                  </el-button>
                </div>
              </div>
            </draggable>
            <el-button
              class="parent-add-btn iconfont icon-plus"
              @click="add()"
            >
              添加分类
            </el-button>
          </div>
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
      <!-- 分类选择器弹窗 -->
      <el-dialog
        title="绑定分类"
        :visible.sync="categoryDialog"
        :before-close="hideCategory"
      >
        <el-form>
          <el-form-item>
            <el-radio-group v-model="curCateType">
              <el-radio-button label="goodsCate">
                商品分类
              </el-radio-button>
              <el-radio-button label="mainCate">
                主类目
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择分类">
            <el-cascader
              v-if="curCateType === 'goodsCate'"
              placeholder="选择商品分类"
              :options="category"
              :props="{ checkStrictly: true }"
              clearable
              @change="handleCateChange"
            />
            <el-cascader
              v-if="curCateType === 'mainCate'"
              placeholder="选择主类目"
              :options="mainCategory"
              :props="{ checkStrictly: true }"
              clearable
              @change="handleMainCateChange"
            />
          </el-form-item>
        </el-form>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="categoryDialog = false">取 消</el-button>
          <el-button
            type="primary"
            @click="setCategory"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择自定义页面 -->
      <el-dialog
        title="选择页面"
        :visible.sync="pageDialogVisible"
      >
        <el-select
          v-model="selectedCustomPage"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in customPageList"
            :key="index"
            :label="item.page_name"
            :value="item.id"
          />
        </el-select>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="pageDialogVisible = false">
            取 消
          </el-button>
          <el-button
            type="primary"
            @click="confirmPageDialog"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
      <imgPicker
        :dialog-visible="imgsVisible"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeimgsVisible"
      />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
// 组件
import imgPicker from '@/components/imageselect'
// 第三方组件
import draggable from 'vuedraggable'
// api
import { getCategory } from '@/api/goods'
import { saveALiPageParams, getALiParamByTempName, getALiCustomPageList } from '@/api/ali'
export default {
  components: {
    imgPicker,
    // 第三方组件
    draggable
  },
  data () {
    return {
      currentFidx: 0,
      currentSidx: 0,
      currentLidx: 0,
      seriesVisible: false,
      // 模版保存提交的表单
      seriesTitle: '',
      editableSeries: '',
      series: [],
      editableData: [
        {
          name: '名称',
          img: '',
          category_id: '',
          category_name: '',
          id: '', // 页面id
          page_name: '',
          children: [
            {
              name: '名称',
              img: '',
              category_id: '',
              category_name: '',
              children: []
            }
          ]
        }
      ],
      form: {
        name: 'base',
        hasSeries: false,
        data: []
      },
      // 拖拽组件属性
      dragParentOptions: {
        group: 'parent',
        sort: true,
        handle: '.move',
        draggable: '.form-parent',
        forceFallback: false,
        animation: 150,
        scroll: true
      },
      dragSecondOptions: {
        group: 'second',
        sort: true,
        handle: '.move',
        draggable: '.form-second',
        forceFallback: false,
        animation: 150,
        scroll: true
      },
      dragLastOptions: {
        group: 'last',
        sort: true,
        handle: '.move',
        draggable: '.form-last',
        forceFallback: false,
        animation: 150,
        scroll: true
      },
      // 图片选择器
      isGetImage: false,
      imgsVisible: false,
      // 分类选择器
      curCateType: 'goodsCate',
      categoryLoading: false,
      categoryDialog: false,
      category: [],
      mainCategory: [],
      currentCategory: '',
      pageDialogVisible: false,
      customPageList: [],
      selectedCustomPage: '',
      curTabIndex: 0
    }
  },
  computed: {
    ...mapGetters(['wheight', 'ali_template_name'])
  },
  mounted () {
    let filter = { template_name: this.ali_template_name, version: 'v1.0.1', page_name: 'category' }
    getALiParamByTempName(filter).then((res) => {
      if (res.data.data.list.length !== 0) {
        let results = res.data.data.list[0].params
        if (!results.hasSeries) {
          results.data.map((item) => {
            item.children.map((child) => {
              if (!child.children) {
                Object.assign(child, { children: [] })
              }
            })
          })
          this.form = results
          this.editableData = results.data
        } else {
          results.data.map((item) => {
            item.content.map((series) => {
              series.children.map((child) => {
                if (!child.children) {
                  Object.assign(child, { children: [] })
                }
              })
            })
          })
          this.form = results
          this.series = results.data
          this.editableData = this.series[0].content
          this.editableSeries = results.data[0].name
        }
      }
    })
  },
  methods: {
    handleCateChange (val) {
      this.currentCategory = {
        main_category_id: '',
        category_id: val[val.length - 1],
        category_name: this.findCateName(val, this.category)
      }
    },
    handleMainCateChange (val) {
      this.currentCategory = {
        main_category_id: val[val.length - 1],
        category_id: '',
        category_name: this.findCateName(val, this.mainCategory)
      }
    },
    findCateName (val, data) {
      const fidx = data.findIndex((n) => val[0] === n.value)
      const cidx = val[1] ? data[fidx].children.findIndex((n) => val[1] === n.value) : ''
      const gidx = val[2]
        ? data[fidx].children[cidx].children.findIndex((n) => val[2] === n.value)
        : ''
      let name = ''
      if (gidx !== '') {
        name = data[fidx].children[cidx].children[gidx].label
      }
      if (gidx === '' && cidx !== '') {
        name = data[fidx].children[cidx].label
      }
      if (gidx === '' && cidx === '') {
        name = data[fidx].label
      }
      return name
    },
    // 添加系列
    addSeries () {
      if (!this.seriesTitle) {
        this.$message({ message: '系列名称必填', type: 'error' })
        return
      }
      if (this.series.length >= 3) {
        this.$message({ message: '最多添加3个系列', type: 'error' })
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
    handleCancel () {
      this.seriesTitle = ''
      this.seriesVisible = false
    },
    // 移除系列
    removeTab (targetName) {
      console.log(targetName)
      this.$confirm('删除系列将删除该系列下配置的分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let tabs = this.series
          let activeName = this.editableSeries
          console.log(activeName)
          if (activeName === targetName) {
            tabs.forEach((tab, index) => {
              if (tab.name === targetName) {
                console.log(index)
                let nextTab = tabs[index + 1] || tabs[index - 1]
                console.log(nextTab)
                if (nextTab) {
                  activeName = nextTab.name
                }
              }
            })
          }
          console.log(activeName)
          this.editableSeries = activeName
          this.series = tabs.filter((tab) => tab.name !== targetName)
          if (this.series.length === 0) {
            this.form.hasSeries = false
            this.editableData = this.form.data.find((item) => item.name === targetName).content
          } else {
            this.editableData = this.series.find((item) => item.name === activeName).content
          }
        })
        .catch(() => {})
    },
    // 点击tab
    handleClick (data) {
      this.curTabIndex = data.index
      this.currentFidx = 0
      this.editableData = this.series[data.index].content
    },
    // 添加菜单
    add (idx, sidx) {
      let item = {
        name: '',
        img: '',
        category_id: '',
        category_name: ''
      }
      if (idx !== undefined && sidx === undefined) {
        item.children = []
        this.editableData[idx].children.push(item)
      }
      if (idx !== undefined && sidx !== undefined) {
        this.editableData[idx].children[sidx].children.push(item)
      }
      if (idx === undefined && sidx === undefined) {
        item.children = []
        item.hot = false
        this.editableData.push(item)
      }
    },
    // 移除菜单
    remove (fidx, sidx, lidx) {
      if (lidx !== undefined) {
        this.$confirm('确认删除？')
          .then((_) => {
            this.editableData[fidx].children[sidx].children.splice(lidx, 1)
          })
          .catch((_) => {})
      } else {
        this.$confirm('删该分类将会删除其所有子级，确认删除吗？')
          .then((_) => {
            if (sidx !== undefined) {
              this.editableData[fidx].children.splice(sidx, 1)
            } else {
              this.editableData.splice(fidx, 1)
            }
          })
          .catch((_) => {})
      }
    },
    // 模版演示父级菜单切换
    switchTab (index) {
      this.currentFidx = index
    },
    // 模板类型切换
    switchType (type) {
      this.form.name = type
    },
    // 图片选择器绑定事件
    showImgs (fidx, sidx, lidx) {
      this.imgsVisible = true
      this.isGetImage = true
      this.currentFidx = fidx
      if (lidx !== undefined) {
        this.currentSidx = sidx
        this.currentLidx = lidx
      }
      if (sidx !== undefined && lidx === undefined) {
        this.currentSidx = sidx
        this.currentLidx = ''
      }
      if (sidx === undefined && lidx === undefined) {
        this.currentSidx = ''
        this.currentLidx = ''
      }
    },
    pickImg (data) {
      if (this.currentLidx !== '') {
        this.editableData[this.currentFidx].children[this.currentSidx].children[
          this.currentLidx
        ].img = data.url
      }
      if (this.currentSidx !== '' && this.currentLidx === '') {
        this.editableData[this.currentFidx].children[this.currentSidx].img = data.url
      }
      if (this.currentSidx === '' && this.currentLidx === '') {
        this.editableData[this.currentFidx].img = data.url
      }
      this.imgsVisible = false
    },
    closeimgsVisible () {
      this.imgsVisible = false
    },
    // 分类设置绑定事件
    showCategory (fidx, sidx, lidx) {
      this.currentFidx = fidx
      this.currentCategory = ''
      if (lidx !== undefined) {
        this.currentSidx = sidx
        this.currentLidx = lidx
      }
      if (sidx !== undefined && lidx === undefined) {
        this.currentSidx = sidx
        this.currentLidx = ''
      }
      if (sidx === undefined && lidx === undefined) {
        this.currentSidx = ''
        this.currentLidx = ''
      }
      this.categoryDialog = true
      this.categoryLoading = true
      getCategory().then((response) => {
        this.category = this.initCategory(response.data.data)
      })
      getCategory({ is_main_category: true }).then((response) => {
        this.mainCategory = this.initCategory(response.data.data)
      })
    },
    initCategory (data) {
      let categorys = []
      data.map((item) => {
        let fitem = {
          value: item.category_id,
          label: item.category_name
        }
        if (item.children.length) {
          Object.assign(fitem, { children: [] })
          item.children.map((child) => {
            let citem = {
              value: child.category_id,
              label: child.category_name
            }
            if (child.children.length) {
              Object.assign(citem, { children: [] })
              child.children.map((grandson) => {
                let gitem = {
                  value: grandson.category_id,
                  label: grandson.category_name
                }
                citem.children.push(gitem)
              })
            }
            fitem.children.push(citem)
          })
        }
        categorys.push(fitem)
      })
      return categorys
    },
    setCategory () {
      if (this.currentLidx !== '') {
        Object.assign(
          this.editableData[this.currentFidx].children[this.currentSidx].children[this.currentLidx],
          this.currentCategory
        )
      }
      if (this.currentSidx !== '' && this.currentLidx === '') {
        Object.assign(
          this.editableData[this.currentFidx].children[this.currentSidx],
          this.currentCategory
        )
      }
      if (this.currentSidx === '' && this.currentLidx === '') {
        Object.assign(this.editableData[this.currentFidx], this.currentCategory)
      }
      this.categoryDialog = false
    },
    hideCategory () {
      this.currentCategory = ''
      this.categoryDialog = false
    },
    // 保存设置
    saveConfig () {
      if (!this.form.hasSeries) {
        this.form.data = this.editableData
      } else {
        this.series[this.curTabIndex].content = this.editableData
        this.form.data = this.series
      }
      let param = {
        template_name: this.ali_template_name,
        config: JSON.stringify([this.form]),
        page_name: 'category'
      }
      saveALiPageParams(param).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    async _getALiCustomPageList () {
      const res = await getALiCustomPageList({
        page: 1,
        pageSize: 100,
        template_name: this.ali_template_name
      })
      this.customPageList = res.data.data.list
    },
    confirmPageDialog () {
      this.pageDialogVisible = false
      const index = this.currentFidx
      this.editableData[index].id = this.selectedCustomPage
      const cur = this.customPageList.find((v) => v.id == this.selectedCustomPage)
      cur && (this.editableData[index].page_name = cur.page_name)
    },
    openPageDialog (index) {
      !this.customPageList.length && this._getALiCustomPageList()
      this.pageDialogVisible = true
      this.currentFidx = index
    }
  }
}
</script>
