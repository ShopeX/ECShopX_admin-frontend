<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form :model="dataForm" label-width="80px">
      <el-form-item :label="$t('2547a1d3.32c65d')">
        <el-input v-model="dataForm.title" />
      </el-form-item>
      <el-form-item :label="$t('2547a1d3.2d711b')">
        <SpRichText v-model="dataForm.content" />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="primary" @click="handelClickSubmit">{{ $t('2547a1d3.be5fbb') }}</el-button>
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
        message = this.$t('2547a1d3.3fdaea')
      } else {
        // 修改
        params.notice_id = this.notice_id
        await editSalespersonoticeNotice(params)
        message = this.$t('2547a1d3.69be67')
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
