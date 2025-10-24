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
    <el-form :model="dataForm" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item label="内容">
        <SpRichText v-model="dataForm.content" />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" @click="handelClickSubmit"> 保存 </el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getSalespersonoticeDetail,
  setSalespersonoticeNotice,
  editSalespersonoticeNotice
} from '@/api/marketing'

export default {
  inject: ['refresh'],

  data() {
    return {
      notice_id: '',
      dataForm: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.notice_id = this.$route.query.id
    if (this.notice_id) {
      this._getSalespersonoticeDetail()
    }
  },
  methods: {
    /**
     * 保存 || 修改
     * */
    async handelClickSubmit() {
      let { title, content } = this.dataForm
      let params = {
        title,
        content
      }
      let message = ''
      if (!this.notice_id) {
        // 新增
        await setSalespersonoticeNotice(params)
        message = '添加成功'
      } else {
        // 修改
        params.notice_id = this.notice_id
        await editSalespersonoticeNotice(params)
        message = '修成成功'
      }
      this.$message({
        message,
        type: 'success'
      })
      this.refresh()

      this.$router.go(-1)
    },

    handelChangeUpdateContent(data) {
      this.dataForm.content = data
    },

    /**
     * 获取导购通知
     * */
    async _getSalespersonoticeDetail() {
      let { data } = await getSalespersonoticeDetail({ notice_id: this.notice_id, with_log: 0 })
      this.dataForm = data.data
      console.log('_getSalespersonoticeDetail', data)
    }
  }
}
</script>

<style scoped lang="scss"></style>
