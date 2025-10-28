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
    <el-form ref="dataForm" :model="dataForm" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="">
            <el-button type="primary" @click="handleClickUpload"> 上传封面 </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-image
            style="width: 200px; height: 200px"
            :src="dataForm.article_cover"
            :preview-src-list="coverList"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item label="标题">
            <el-input v-model="dataForm.article_title" maxlength="20" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述">
            <el-input v-model="dataForm.article_subtitle" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容">
            <SpRichText v-model="dataForm.article_content" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="连接">
            <el-button @click="showVisible = true">
              {{ buttonLinkText }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="center">
          <el-button type="primary" @click="_setActivearticle">
            {{ buttonText }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="false"
      @chooseImg="pickPics"
      @closeImgDialog="picsDialog = false"
    />
    <linkSetter
      :visible="showVisible"
      @setLink="handleClickSetLink"
      @closeDialog="showVisible = false"
    />
  </div>
</template>
<script>
import linkSetter from '@/components/template_links' //添加导航连接

import imgPicker from '@/components/imageselect'
import { getActivearticle, setActivearticle, putActivearticle } from '@/api/promotions'
export default {
  components: {
    imgPicker,
    linkSetter
  },
  data() {
    return {
      dataForm: {
        article_cover: '',
        article_title: '',
        article_subtitle: '',
        article_content: '',
        directional_url: '',
        is_show: 0,
        sort: 0
      },
      picsDialog: false,
      isGetPics: false,
      coverList: [],
      buttonText: '保存',
      showVisible: false,
      buttonLinkText: '设置路径'
    }
  },
  mounted() {
    console.log(this.$route.query)
    let { id } = this.$route.query
    if (id) {
      this.buttonText = '修改'
      this._getActivearticle(id)
    }
  },
  methods: {
    /**
     * 图片上传组件 show
     * */
    handleClickUpload(index) {
      this.picsDialog = true
      this.isGetPics = true
    },

    /**
     * 上传封面
     * */
    pickPics(item) {
      this.picsDialog = false
      this.dataForm.article_cover = item.url
      this.coverList = [item.url]
    },

    /**
     * 富文本编辑器
     * */
    updateWithdrawDescContent(data) {
      this.dataForm.article_content = data
    },

    /**
     * 设置路径
     * */
    handleClickSetLink(row, type) {
      console.log('row', row, type)
      this.showVisible = false
      this.buttonLinkText = row.title
      this.dataForm.directional_url = this.handleFilterLink(type, row.id)
    },

    /**
     * 获取详情
     * */
    async _getActivearticle(id) {
      let { data } = await getActivearticle(id)
      this.dataForm = data.data
      this.coverList = [data.data.article_cover]
    },

    /**
     * 保存或修改
     * */
    async _setActivearticle() {
      let params = this.dataForm
      try {
        if (this.$route.query.id) {
          delete params.created
          delete params.updated
          delete params.company_id
          params.is_show = params.is_show ? 1 : 0

          await putActivearticle(params)
        } else {
          await setActivearticle(params)
        }

        this.$message({
          message: `${this.buttonText}成功`,
          type: 'success'
        })

        this.refresh()
        this.$router.go(-1)
      } catch (err) {
        // this.$message({
        //   message: "保存失败",
        //   type: "error"
        // });
        // console.log(err);
      }
    },

    handleFilterLink(type, id) {
      let url = ''

      switch (type) {
        case 'goods':
          url = '/pages/item/espier-detail?id=' + id
          break
        case 'category':
          url = '/pages/item/list?cat_id=' + id
          break
        case 'article':
          url = '/pages/article/index?id=' + id
          break
        case 'planting':
          url = '/pages/recommend/detail?id=' + id
          break
        case 'custom_page':
          url = '/pages/custom/custom-page?id=' + id
          break
        case 'marketing':
          url = '/pages/item/group-list'
          break
        case 'seckill':
          url = '/pages/item/seckill-goods-list?seckill_id=' + id
          break
        case 'link':
          url = id === 'vipgrades' ? '/pages/vip/vipgrades' : ''
          break
        case 'tag':
          url = '/pages/item/list?tag_id=' + id
          break
        case 'regactivity':
          url = '/marketing/pages/reservation/goods-reservate?activity_id=' + id
          break
        case 'custom':
          url = id
          break
        default:
      }

      return url
    }
  }
}
</script>

<style scoped lang="scss">
.banner-h {
  height: 200px;
}
.center {
  text-align: center;
}
</style>
