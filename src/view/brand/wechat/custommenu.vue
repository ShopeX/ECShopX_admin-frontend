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
  <div v-loading="loading" class="menu-box">
    <div class="menu-wrap content-padded section-white content-box clearfix">
      <div class="menu_preview_area">
        <div class="mobile_menu_preview">
          <div class="mobile_hd tc">ONex平台</div>
          <div class="mobile_bd">
            <ul
              class="pre_menu_list grid_line ui-sortable ui-sortable-disabled"
              :class="{ no_menu: menuData.length === 0 }"
            >
              <li
                v-for="(item, index) in menuData"
                class="pre_menu_item grid_item grid_item selected size1of2"
                :class="
                  item.id === id && !cid ? 'current' : item.id === id && cid ? '' : 'no_extra'
                "
                @click="chooseMenu(item.id, index)"
              >
                <input type="hidden" name="parentmenu" :value="index">
                <a href="javascript:;" class="pre_menu_link"
                  ><i v-if="menuData.length <= 0" class="el-icon-plus" /><span>{{
                    item.name
                  }}</span></a
                >
                <div v-if="item.second_menu !== undefined" class="sub_pre_menu_box">
                  <ul class="sub_pre_menu_list">
                    <li
                      v-for="(subItem, subIndex) in item.second_menu"
                      :class="subItem.id === cid ? 'current' : ''"
                      @click.stop="chooseSubMenu(subItem.id, index, subIndex)"
                    >
                      <input type="hidden" name="submenu" :value="index + '-' + subIndex">
                      <a href="javascript:;">
                        <span class="sub_pre_menu_inner">{{ subItem.name }}</span>
                      </a>
                    </li>
                    <li v-if="item.second_menu.length < 5">
                      <a href="javascript:;" @click.stop="addSubMenu">
                        <span class="sub_pre_menu_inner"><i class="el-icon-plus" /></span>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li
                v-if="menuData.length < 3"
                class="js_addMenuBox pre_menu_item grid_item no_extra size1of2"
              >
                <a
                  href="javascript:;"
                  class="pre_menu_link"
                  title="最多添加4个一级菜单"
                  @click="addMenu"
                >
                  <i class="el-icon-plus" /> <span v-if="menuData.length === 0">添加菜单</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="content-box-right">
        <div class="editor-box">
          <div class="section-header with-border">
            <h3>菜单名称</h3>
            <a
              v-if="id !== null"
              class="fr link"
              style="margin-top: -30px"
              @click.prevent="removemenu"
              >删除菜单</a
            >
          </div>
          <div class="section-body">
            <template v-if="!isChild">
              <el-form
                v-for="(item, index) in menuData"
                v-if="item.id === id"
                :key="item.id"
                label-width="90px"
              >
                <el-form-item label="菜单名称">
                  <el-input v-model="item.name" :maxlength="4" style="width: 240px" />
                  <p class="form-text-tip">字数不超过4个字</p>
                </el-form-item>
                <template v-if="item.second_menu === undefined || item.second_menu.length === 0">
                  <!-- <el-form-item label="排序" prop="sort">
                    <el-input v-model="item.sort"></el-input>
                  </el-form-item> -->
                  <el-form-item label="菜单内容">
                    <el-radio-group v-model="item.menu_type">
                      <el-radio :label="1"> 发送消息 </el-radio>
                      <el-radio :label="2"> 跳转网页 </el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                    <MsgSender
                      v-if="item.menu_type == 1"
                      v-model="item.content"
                      :type="item.news_type"
                      @change="updateMsg"
                    />
                    <div v-if="item.menu_type == 2" class="menu_content">
                      <p class="frm-tips">订阅者点击该子菜单会跳到以下链接</p>
                      <div class="clearfix">
                        <span class="label f_l" style="display: block; padding-right: 10px"
                          >页面地址</span
                        >
                        <div class="f_l content_mar_l">
                          <el-input v-model="item.url" style="width: 300px" />
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </template>
              </el-form>
            </template>
            <template v-else>
              <el-form
                v-for="(item, index) in menuData[id].second_menu"
                v-if="menuData[id].second_menu && item.id === cid"
                :key="item.id"
                label-width="90px"
              >
                <el-form-item label="菜单名称">
                  <el-input v-model="item.name" :maxlength="4" style="width: 240px" />
                  <p class="form-text-tip">字数不超过4个字</p>
                </el-form-item>
                <!-- <el-form-item label="排序" prop="sort">
                  <el-input v-model="item.sort"></el-input>
                </el-form-item> -->
                <el-form-item label="菜单内容">
                  <el-radio-group v-model="item.menu_type">
                    <el-radio :label="1"> 发送消息 </el-radio>
                    <el-radio :label="2"> 跳转网页 </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <MsgSender
                    v-if="item.menu_type == 1"
                    v-model="item.content"
                    :type="item.news_type"
                    @change="updateMsg"
                  />
                  <div v-if="item.menu_type == 2" class="menu_content">
                    <p class="frm-tips">订阅者点击该子菜单会跳到以下链接</p>
                    <div class="clearfix">
                      <span class="label f_l" style="display: block; padding-right: 10px"
                        >页面地址</span
                      >
                      <div class="f_l content_mar_l">
                        <el-input v-model="item.url" style="width: 300px" />
                      </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </div>
          <div class="section-footer with-border tc">
            <el-button v-if="id !== null" type="primary" @click="submitForm">
              保存并发布至微信
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <TWXXSelect
      :twxx-visible="twxxVisible"
      :show-history="true"
      @chooseTW="chooseTWAction"
      @closeTWDialog="closeTWDialogAction"
    />
    <WbApp
      :app-visible="appVisisble"
      @chooseApp="chooseAppAction"
      @closeTWDialog="closeAppDialogAction"
    />
  </div>
</template>

<script>
import WbApp from '../../../components/wbappselect'
import TWXXSelect from '../../../components/twxxselect'
import MsgSender from '../../../components/messagesender'
import { addMenu, getMenuTree } from '../../../api/menu'
let id = 1000
export default {
  components: {
    WbApp,
    TWXXSelect,
    MsgSender
  },
  data() {
    return {
      loading: false,
      appVisisble: false,
      twxxVisible: false,
      id: null,
      cid: null,
      isChild: false,
      menuData: [],
      twxxItem: {}
    }
  },
  mounted() {
    this.loading = true
    getMenuTree().then(res => {
      if (res.data.data) {
        this.menuData = res.data.data
        this.loading = false
        if (this.menuData.length > 0) {
          this.id = this.menuData[0].id
        }
      }
    })
  },
  methods: {
    chooseMenu(id, index) {
      this.id = id
      this.cid = null
      this.isChild = false
    },
    chooseSubMenu(id, parentIndex, subIndex) {
      this.cid = id
      this.isChild = true
    },
    addMenu() {
      var defaultMenuData = {
        id: '',
        name: '菜单',
        menu_type: 1,
        news_type: '',
        sort: '',
        is_show: '',
        url: '',
        app_id: '',
        pagepath: '',
        content: [],
        second_menu: []
      }
      defaultMenuData.id = this.menuData.length
      this.id = defaultMenuData.id
      this.cid = null
      this.isChild = false
      this.menuData.push(defaultMenuData)
    },
    addSubMenu() {
      var defaultSubmenuData = {
        id: '',
        name: '菜单',
        menu_type: 1,
        news_type: '',
        sort: '',
        is_show: '',
        url: '',
        app_id: '',
        pagepath: '',
        content: []
      }
      defaultSubmenuData.id = this.id + '_' + this.menuData[this.id].second_menu.length
      this.cid = defaultSubmenuData.id
      this.isChild = true
      this.menuData[this.id].second_menu.push(defaultSubmenuData)
    },
    removemenu() {
      this.$confirm('删除后菜单下设置的内容将被删除', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.menuData.forEach((item, index) => {
          if (!this.cid) {
            if (this.id === item.id) {
              this.menuData.splice(index, 1)
            }
          } else {
            for (var i = 0; i < item.second_menu.length; i++) {
              if (this.cid === item.second_menu[i].id) {
                item.second_menu.splice(i, 1)
              }
            }
          }
        })
        this.id = null
        this.cid = null
        this.isChild = false
        this.updateIds()
      })
    },
    updateIds() {
      for (var i = 0; i < this.menuData.length; i++) {
        this.menuData[i].id = i
        if (this.menuData[i].second_menu.length > 0) {
          for (var j = 0; j < this.menuData[i].second_menu.length; j++) {
            this.menuData[i].second_menu[j].id = i + '_' + j
          }
        }
      }
    },
    publicNewsSelectAction() {
      this.twxxVisible = true
    },
    chooseAppAction(data) {
      this.appVisisble = false
      if (data && data.id > 0) {
        this.form.appItem = data
      }
    },
    closeAppDialogAction() {
      this.appVisisble = false
    },
    wbAppAction() {
      this.appVisisble = true
    },
    chooseTWAction(data) {
      this.twxxVisible = false
      if (data && data.url !== undefined) {
        this.twxxItem = data
      }
    },
    closeTWDialogAction() {
      this.twxxVisible = false
    },
    updateMsg(val, type) {
      if (!this.cid) {
        for (var i = 0; i < this.menuData.length; i++) {
          if (this.id === this.menuData[i].id) {
            this.menuData[i].content = val
            this.menuData[i].news_type = type
          }
        }
      } else {
        for (var i = 0; i < this.menuData.length; i++) {
          if (this.id === this.menuData[i].id) {
            for (var k = 0; k < this.menuData[i].second_menu.length; k++) {
              if (this.cid === this.menuData[i].second_menu[k].id) {
                this.menuData[i].second_menu[k].content = val
                this.menuData[i].second_menu[k].news_type = type
              }
            }
          }
        }
      }
    },
    submitForm() {
      let params = this.menuData
      addMenu(params).then(res => {
        this.$message({
          message: '菜单添加成功',
          type: 'success',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.pre_menu_item a {
  display: block;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  color: #616161;
  text-decoration: none;
}
.custom_alert {
  .is-big {
    font-size: 32px;
  }
  .is-bold {
    font-size: 16px;
  }
  &.msg {
    margin-top: 20px;
    background-color: #e0eaf6;
    color: #333;
    i {
      color: #20a0ff;
    }
    .is-big {
      font-size: 16px;
    }
    .desc {
      color: #333;
    }
  }
}
.menu-wrap {
  padding-bottom: 20px;
}
.mobile_menu_preview {
  position: relative;
  width: 317px;
  height: 580px;
  background: transparent url('~@/assets/img/bg_mobile_head.png') no-repeat 0 0;
  border: 1px solid #e7e7eb;
  box-sizing: content-box;
  .mobile_hd {
    color: #fff;
    text-align: center;
    padding-top: 30px;
    font-size: 15px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin: 0 30px;
  }
}
.menu_preview_area {
  float: left;
  margin-right: 12px;
  position: relative;
  .pre_menu_list {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e7e7eb;
    background: transparent url('~@/assets/img/bg_mobile_foot.png') no-repeat 0 0;
    padding-left: 43px;
    z-index: 2;
    display: flex;
    &.no_menu {
      .pre_menu_link {
        border: 1px solid #ff5000;
        color: #ff5000;
      }
    }
  }
  .pre_menu_item {
    line-height: 50px;
    &.current {
      .pre_menu_link {
        border: 1px solid #ff5000;
        color: #ff5000;
        background: #fff;
        line-height: 48px;
      }
    }
  }
  .sub_pre_menu_box {
    bottom: 60px;
    background-color: #fafafa;
    border-top-width: 0;
  }
  .sub_pre_menu_list {
    li {
      line-height: 44px;
      border: 1px solid transparent;
      margin: 0 -1px -1px;
      position: relative;
      a {
        padding: 0 0.5em;
      }
      &:first-child {
        border-top: 1px solid #d0d0d0;
        .sub_pre_menu_inner {
          border-top-width: 0;
        }
      }
      &:last-child {
        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          left: 50%;
          transform: translateX(-50%);
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
        }
        &::after {
          bottom: -8px;
          border-top: 8px solid #d0d0d0;
        }
        &::before {
          bottom: -7px;
          border-top: 8px solid #fafafa;
          z-index: 2;
        }
      }
      &.current {
        background-color: #fff;
        border: 1px solid #ff5000;
        position: relative;
        z-index: 1;
        line-height: 45px;
        .sub_pre_menu_inner {
          border-top-width: 0;
        }
        a {
          color: #ff5000;
        }
      }
    }
  }
  .sub_pre_menu_inner {
    display: block;
    border-top: 1px solid #e7e7eb;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    cursor: pointer;
  }
}
.pre_menu_item {
  position: relative;
  flex: 1;
  line-height: 38px;
  text-align: center;
  cursor: pointer;
  a {
    display: block;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
    color: #666;
    text-decoration: none;
  }
}
.grid_item {
  &.no_extra {
    float: none;
    width: auto;
    overflow: hidden;
  }
}
.grid_line {
  .no_extra {
    &.grid_item {
      float: none;
      width: auto;
      overflow: hidden;
    }
  }
}
.pre_menu_link {
  border-left: 1px solid #e7e7eb;
}
.sub_pre_menu_box {
  position: absolute;
  bottom: 50px;
  left: 0;
  width: 100%;
  border: 1px solid #d0d0d0;
  background-color: #fff;
}
.editor-box {
  .el-form-item::before,
  .el-form-item::after {
    display: none;
  }
}

.fl {
  float: left;
}
.fr {
  float: right;
}
</style>

<style lang="scss">
.edit_area {
  textarea {
    border: 0 !important;
  }
}
.tab_content {
  .appmsg {
    width: 320px;
    display: inline-block;
    margin-bottom: 0;
  }
  a.link {
    display: inline-block;
    vertical-align: bottom;
    margin-left: 10px;
  }
}
.sub-msg-item:hover,
.article-msg-item:hover {
  .preview-mask {
    display: flex;
  }
}
.content-box {
  .content-box-left {
    float: left;
    width: 320px;
    margin-right: 20px;
    overflow: hidden;
  }
  .content-box-right {
    margin-left: 340px;
  }
}
.editor-box {
  .el-form-item__content::before,
  .el-form-item__content::after {
    display: none;
  }
}
</style>
