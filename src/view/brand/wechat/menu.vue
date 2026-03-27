<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
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
      <el-form-item :label="$t('5cceb5ec.8ee9f2')" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.e3cc5b')" prop="pid">
        <el-select v-model="ruleForm.pid" :placeholder="$t('5cceb5ec.efb062')">
          <el-option :label="$t('5cceb5ec.efb062')" value="0" />
          <el-option
            v-for="item in parentMenu"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.c360e9')" prop="sort">
        <el-input v-model="ruleForm.sort" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.ae57b1')" prop="is_show">
        <el-switch
          v-model="ruleForm.is_show"
          :active-text="$t('5cceb5ec.4d775d')"
          :inactive-text="$t('5cceb5ec.2064fc')"
        />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.52fe00')">
        <el-radio-group v-model="ruleForm.menu_type">
          <el-radio :label="1"> {{ $t('5cceb5ec.b5f159') }} </el-radio>
          <el-radio :label="2"> {{ $t('5cceb5ec.1d38c9') }} </el-radio>
          <el-radio :label="3"> {{ $t('5cceb5ec.fd42b3') }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.ff692f')">
        <el-radio-group v-model="ruleForm.news_type">
          <el-radio :label="1"> {{ $t('5cceb5ec.834a3b') }} </el-radio>
          <el-radio :label="2"> {{ $t('5cceb5ec.7c8a1b') }} </el-radio>
          <el-radio :label="3"> {{ $t('5cceb5ec.1babf2') }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.834a3b')" prop="media_id">
        <el-input v-model="ruleForm.media_id" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.cfb5f1')" prop="keyword">
        <el-input v-model="ruleForm.keyword" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.1babf2')" prop="media_id">
        <el-input v-model="ruleForm.media_id" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.875373')" prop="url">
        <el-input v-model="ruleForm.url" />
      </el-form-item>
      <el-form-item :label="$t('5cceb5ec.718ed3')" prop="wxsys">
        <el-select v-model="ruleForm.wxsys" :placeholder="$t('5cceb5ec.708c9d')">
          <el-option :label="$t('5cceb5ec.6e4c7f')" value="scancode_waitmsg" />
          <el-option :label="$t('5cceb5ec.9d3cbd')" value="scancode_push" />
          <el-option :label="$t('5cceb5ec.ac1c71')" value="pic_sysphoto" />
          <el-option :label="$t('5cceb5ec.99fa5f')" value="pic_photo_or_album" />
          <el-option :label="$t('5cceb5ec.1293a6')" value="pic_weixin" />
          <el-option :label="$t('5cceb5ec.7dfa59')" value="location_select" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          {{ $t('5cceb5ec.9fd000') }}
        </el-button>
        <el-button @click="resetForm('ruleForm')"> {{ $t('5cceb5ec.4b9c32') }} </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="sort" :label="$t('5cceb5ec.0a05b1')" width="180" />
      <el-table-column prop="name" :label="$t('5cceb5ec.8ee9f2')" width="180" />
      <el-table-column prop="menutype" :label="$t('5cceb5ec.52fe00')" width="180" />
      <el-table-column prop="menutype" :label="$t('5cceb5ec.7c5d7b')" width="180" />
      <el-table-column prop="operation" :label="$t('5cceb5ec.2b6bc0')">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData4)"
          >
            {{ $t('5cceb5ec.95b351') }}
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData4)"
          >
            {{ $t('5cceb5ec.86048b') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="!weappHidden" class="menu_content">
    <p class="frm-tips">{{ $t('5cceb5ec.6bacca') }}</p>
    <div>
      <div class="clearfix">
        <span class="label f_l">{{ $t('5cceb5ec.ef4cc6') }}</span
        >&nbsp;&nbsp;
        <div class="content_wrap content_mar_l f_l">
          <template v-if="form.appItem != null && form.appItem.id > 0">
            <el-input v-model="form.appItem.url" style="width: 300px" />
            <p class="frm-tips">{{ $t('5cceb5ec.ba2537') }} - {{ form.appItem.name }}</p>
          </template>
          <p>
            <el-button @click="wbAppAction"> {{ $t('5cceb5ec.28b1db') }} </el-button>
          </p>
        </div>
      </div>
      <div class="clearfix" style="margin-top: 10px">
        <span class="label f_l">{{ $t('5cceb5ec.e7c4ed') }}</span
        >&nbsp;&nbsp;
        <div class="content_wrap content_mar_l f_l">
          <el-input style="width: 300px" />
          <p class="frm-tips">{{ $t('5cceb5ec.13375c') }}</p>
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
            message: this.$t('5cceb5ec.4cd562'),
            trigger: 'blur'
          },
          {
            min: 1,
            max: 4,
            message: this.$t('5cceb5ec.fd7784'),
            trigger: 'blur'
          }
        ],
        menu_type: [
          {
            required: true,
            message: this.$t('5cceb5ec.ab8ab7'),
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
      this.$refs[formName].validate((valid) => {
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
          addMenu(params).then((res) => {
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
      getParentMenu(params).then((res) => {
        if (res.data.data.menu) {
          this.parentMenu = res.data.data.menu
        }
      })
    },
    getMenuTree() {
      getMenuTree().then((res) => {
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
