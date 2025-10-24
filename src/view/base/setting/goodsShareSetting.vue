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
  <div class="goodsShareSetting">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />
    <el-form ref="form" label-width="180px" :rules="rules" :model="form">
      <el-form-item label="商品分享是否限制">
        <el-switch v-model="form.is_open" />
      </el-form-item>
      <template v-if="form.is_open">
        <el-form-item label="可分享会员等级" prop="valid_grade">
          <el-checkbox-group v-model="form.valid_grade">
            <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="vipdata.lv_type"
            >
              {{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分享限制提示语" prop="msg">
          <el-input
            v-model="form.msg"
            style="width: 260px"
            type="text"
            placeholder="请输入分享限制提示语"
          />
        </el-form-item>
        <el-form-item label="提示后跳转页面路径" prop="page">
          <div class="path" @click="showSetLink">
            <span v-show="form.page.linkPage" class="pathTitle">{{ linkPage }}:</span>
            {{ form.page.title ? form.page.title : '设置路径' }}
          </div>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="save"> 保存 </el-button>
      </el-form-item>
    </el-form>

    <linkSetter :visible="linksVisible" @setLink="setLink" @closeDialog="closeDialog" />
  </div>
</template>

<script>
import linkSetter from '@/components/template_links'
import { listVipGrade } from '../../../api/cardticket'
import { getGradeList } from '../../../api/membercard'
import { getShareSetting, saveShareSetting } from '../../../api/goods'

export default {
  name: 'GoodsShareSetting',
  components: {
    linkSetter
  },
  data() {
    return {
      // 设置路径
      linksVisible: false,
      form: {
        is_open: false,
        valid_grade: [],
        msg: '当前等级无法分享',
        page: {}
      },
      rules: {
        valid_grade: [{ required: true, message: '请选择可以分享的会员等级', trigger: 'blur' }],
        msg: [{ required: true, message: '请输入分享限制提示语', trigger: 'blur' }],
        page: [{ required: true, message: '请选择跳转页面路径', trigger: 'change' }]
      },
      vipGrade: [],
      memberGrade: []
    }
  },
  computed: {
    linkPage({ form }) {
      const { page } = form
      const types = {
        goods: '商品',
        category: '分类',
        article: '文章',
        planting: '软文',
        link: '页面',
        marketing: '营销',
        custom_page: '自定义页面',
        other_wxapp: '小程序'
      }
      return types[page.linkPage]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      // 获取会员列表
      const grade = await getGradeList()
      const vip_grade = await listVipGrade()
      this.vipGrade = vip_grade.data.data
      this.memberGrade = grade.data.data
      this.getShareSettingInfo()
    },
    // 获取分享配置
    async getShareSettingInfo() {
      // 获取分享配置
      const data = await getShareSetting()
      this.form = { ...data.data.data }
      if (!this.form.page || Array.isArray(this.form.page)) {
        this.$set(this.form, 'page', {})
      }
      if (!this.form.valid_grade) {
        this.$set(this.form, 'valid_grade', [])
      }
      if (!this.form.msg) {
        this.$set(this.form, 'msg', '')
      }
    },
    showSetLink() {
      this.linksVisible = true
    },
    setLink(links, type) {
      this.$set(this.form, 'page', { ...links, linkPage: type })
    },
    closeDialog() {
      this.linksVisible = false
    },
    // 保存表单
    save() {
      this.$refs['form'].validate(async vaild => {
        if (vaild) {
          const { form } = this
          const data = await saveShareSetting(form)
          if (data.data.data.status) {
            this.$message.success('保存成功')
            this.getShareSettingInfo()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goodsShareSetting {
  width: 100%;
  height: 100%;
  .pathTitle {
    margin-right: 10px;
  }
  .path {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    color: #666;
    border: 1px dashed #dfdfdf;
    display: inline-block;
    min-width: 180px;
    text-align: center;
  }
}
</style>
