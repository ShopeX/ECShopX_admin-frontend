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
  <div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="父级菜单" prop="pid">
        <el-select v-model="ruleForm.pid" placeholder="请选择根菜单">
          <el-option label="请选择根菜单" value="0" />
          <el-option
            v-for="item in parentMenu"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="ruleForm.sort" />
      </el-form-item>
      <el-form-item label="是否显示" prop="is_show">
        <el-switch v-model="ruleForm.is_show" active-text="显示" inactive-text="不显示" />
      </el-form-item>
      <el-form-item label="菜单类型">
        <el-radio-group v-model="ruleForm.menu_type">
          <el-radio :label="1"> 发送消息 </el-radio>
          <el-radio :label="2"> 跳转网页 </el-radio>
          <el-radio :label="3"> 扩展菜单 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消息">
        <el-radio-group v-model="ruleForm.news_type">
          <el-radio :label="1"> 图文消息 </el-radio>
          <el-radio :label="2"> 文字消息 </el-radio>
          <el-radio :label="3"> 图片消息 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图文消息" prop="media_id">
        <el-input v-model="ruleForm.media_id" />
      </el-form-item>
      <el-form-item label="关键字" prop="keyword">
        <el-input v-model="ruleForm.keyword" />
      </el-form-item>
      <el-form-item label="图片消息" prop="media_id">
        <el-input v-model="ruleForm.media_id" />
      </el-form-item>
      <el-form-item label="url链接" prop="url">
        <el-input v-model="ruleForm.url" />
      </el-form-item>
      <el-form-item label="微信扩展菜单" prop="wxsys">
        <el-select v-model="ruleForm.wxsys" placeholder="请选择">
          <el-option label="扫码带提示" value="scancode_waitmsg" />
          <el-option label="扫码推事件" value="scancode_push" />
          <el-option label="系统拍照发图" value="pic_sysphoto" />
          <el-option label="拍照或者相册发图" value="pic_photo_or_album" />
          <el-option label="微信相册发图" value="pic_weixin" />
          <el-option label="发送位置" value="location_select" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"> 立即创建 </el-button>
        <el-button @click="resetForm('ruleForm')"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="sort" label="显示顺序" width="180" />
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="menutype" label="菜单类型" width="180" />
      <el-table-column prop="menutype" label="菜单类型值" width="180" />
      <el-table-column prop="operation" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData4)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData4)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="!weappHidden" class="menu_content">
    <p class="frm-tips">订阅者点击该子菜单会跳到以下小程序</p>
    <div>
      <div class="clearfix">
        <span class="label f_l">小程序路径</span>&nbsp;&nbsp;
        <div class="content_wrap content_mar_l f_l">
          <template v-if="form.appItem != null && form.appItem.id > 0">
            <el-input v-model="form.appItem.url" style="width: 300px" />
            <p class="frm-tips">已选择小程序 - {{ form.appItem.name }}</p>
          </template>
          <p>
            <el-button @click="wbAppAction"> 选择小程序 </el-button>
          </p>
        </div>
      </div>
      <div class="clearfix" style="margin-top: 10px">
        <span class="label f_l">备用网页</span>&nbsp;&nbsp;
        <div class="content_wrap content_mar_l f_l">
          <el-input style="width: 300px" />
          <p class="frm-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getParentMenu, addMenu, getMenuTree } from '../../../api/wechat'

export default {
  data() {
    return {
      ruleForm: {
        name: '',
        pid: '',
        sort: '',
        is_show: '',
        menu_type: 1,
        news_type: 1,
        keyword: '',
        media_id: '',
        url: '',
        wxsys: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 4,
            message: '长度在 1 到 4 个汉字',
            trigger: 'blur'
          }
        ],
        menu_type: [
          {
            required: true,
            message: '请选择菜单类型',
            trigger: 'change'
          }
        ]
      },
      parentMenu: [],
      tableData: []
    }
  },
  mounted() {
    this.getParentMenu()
    this.getMenuTree()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            name: this.ruleForm.name,
            pid: this.ruleForm.pid,
            sort: this.ruleForm.sort,
            is_show: this.ruleForm.is_show,
            menu_type: this.ruleForm.menu_type,
            news_type: this.ruleForm.news_type,
            keyword: this.ruleForm.keyword,
            media_id: this.ruleForm.media_id,
            url: this.ruleForm.url,
            wxsys: this.ruleForm.wxsys
          }
          addMenu(params).then(res => {
            this.tableData = res.data.data.menu
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getParentMenu() {
      let params = {
        pid: '0'
      }
      getParentMenu(params).then(res => {
        if (res.data.data.menu) {
          this.parentMenu = res.data.data.menu
        }
      })
    },
    getMenuTree() {
      getMenuTree().then(res => {
        if (res.data.data.menu) {
          this.tableData = res.data.data.menu
        }
      })
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>
