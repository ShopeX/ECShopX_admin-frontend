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
  <SpPage>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="attribute_name" label="品牌名称:">
        <el-input v-model="params.attribute_name" placeholder="请输入品牌名称" />
      </SpFilterFormItem>
    </SpFilterForm>

    <div class="action-container">
      <el-button type="primary" @click="handleNew"> 新增品牌 </el-button>
    </div>

    <!-- <div class="action-container">
      <el-button
        type="primary"
        plain
        @click="syncBrand"
      >
        同步品牌
      </el-button>
    </div> -->
    <el-table
      v-loading="loading"
      border
      :data="list"
      :height="wheight - 170"
      element-loading-text="数据加载中"
      :default-sort="{ prop: 'bind_date', order: 'descending' }"
    >
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)"> 编辑 </el-button>
          <el-button type="text" @click="handleDelete(scope)"> 删除 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="品牌图片" width="150">
        <template slot-scope="scope">
          <el-image style="width: 70px; height: 70px" :src="scope.row.image_url" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="attribute_name" label="品牌名称">
        <template slot-scope="scope">
          <div v-if="!scope.row.attribute_id">
            <el-input v-model="scope.row.attribute_name" placeholder="请输入品牌名称" />
          </div>
          <div v-else>
            {{ scope.row.attribute_name }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page.sync="page.pageIndex"
        :page-sizes="[10, 20, 50]"
        :total="total_count"
        :page-size="page.pageSize"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
      />
    </div>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar :visible.sync="show_sideBar" :title="'新增品牌'">
      <el-form>
        <el-form-item label="品牌名">
          <el-input v-model="form.attribute_name" />
        </el-form-item>
        <el-form-item label="品牌logo">
          <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：200px * 200px）</div>
          <div class="upload-box" @click="handleImgPicker">
            <img v-if="form.image_url" :src="form.image_url" class="avatar" width="100%">
            <SpIcon v-else name="camera" :size="28" class="avatar-uploader-icon" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="save"> 提交 </el-button>
      </div>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import {
  getGoodsAttr,
  addGoodsAttr,
  updateGoodsAttr,
  deleteGoodsAttr,
  syncBrand
} from '../../../../api/goods'
import { pageMixin } from '@/mixins'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar,
    imgPicker
  },
  mixins: [pageMixin],
  data() {
    return {
      form: {
        attribute_type: 'brand',
        attribute_id: '',
        attribute_name: '',
        image_url: ''
      },
      params: {
        attribute_type: 'brand',
        attribute_name: ''
      },
      list: [],
      loading: false,
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      brand_name: '',
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    // handleCurrentChange(page_num) {
    //   this.page.pageIndex = page_num
    //   this.fetchList()
    // },
    // handleSizeChange(pageSize) {
    //   this.page.pageIndex = 1
    //   this.page.pageSize = pageSize
    //   this.fetchList()
    // },
    handleDelete(data) {
      this.$confirm('确认删除该品牌？')
        .then(_ => {
          deleteGoodsAttr(data.row.attribute_id).then(res => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: '操作成功' })
          })
        })
        .catch(_ => {})
    },
    handleNew() {
      this.show_sideBar = true
      this.resetData()
    },
    resetData() {
      this.form = {
        attribute_id: '',
        attribute_type: 'brand',
        attribute_name: '',
        image_url: ''
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.form = {
        attribute_id: data.attribute_id,
        attribute_type: data.attribute_type,
        attribute_name: data.attribute_name,
        image_url: data.image_url
      }
    },
    save() {
      // 如果没有id，则表示为新增
      if (!this.form.attribute_id) {
        addGoodsAttr(this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.page.pageIndex = 1
          this.resetData()
          this.fetchList()
        })
      } else {
        updateGoodsAttr(this.form.attribute_id, this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.fetchList()
        })
      }
    },
    fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params
      }
      getGoodsAttr(params).then(res => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    handleImgChange(data) {
      this.imgDialog = true
      this.isGetImage = true
      this.imgIndex = data.$index
    },
    handleImgPicker() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.image_url = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    },
    syncBrand() {
      syncBrand().then(res => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '同步失败'
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;
  .avatar-uploader-icon {
    line-height: 100px;
  }
}
.sp-filter-form {
  margin-bottom: 16px;
}
</style>
