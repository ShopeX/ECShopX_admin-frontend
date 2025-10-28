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
.page-bargin {
  .upload-box {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    height: 107px;
    width: 308px;
    cursor: pointer;
    overflow: hidden;
  }
  .setting_pic {
    height: 107px;
    width: 308px;
  }
}
</style>

<template>
  <SpPage>
    <SpPlatformTip v-if="!VERSION_SHUYUN()" />
    <el-tabs v-if="$route.path.indexOf('editor') === -1" v-model="activeName" type="card">
      <el-tab-pane label="助力活动管理" name="list">
        <el-table v-loading="loading" :data="dataList" :height="wheight - 230">
          <el-table-column prop="title" label="活动名称" />
          <el-table-column label="活动时间" width="180">
            <template slot-scope="scope">
              {{ scope.row.begin_time | datetime('YYYY-MM-DD HH:mm:ss') }} <br>
              {{ scope.row.end_time | datetime('YYYY-MM-DD HH:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column prop="item_name" label="产品名称" />
          <el-table-column label="产品原价" align="center">
            <template slot-scope="scope"> ￥{{ scope.row.mkt_price / 100 }} </template>
          </el-table-column>
          <el-table-column label="产品底价" align="center">
            <template slot-scope="scope"> ￥{{ scope.row.price / 100 }} </template>
          </el-table-column>
          <!-- <el-table-column label="助力范围" align="center">
            <template slot-scope="scope">
              ￥[{{scope.row.bargain_range.min / 100}} ~ {{scope.row.bargain_range.max / 100}}]
            </template>
          </el-table-column> -->
          <el-table-column label="助力人数" align="center">
            <template slot-scope="scope">
              {{ scope.row.people_range.min }} ~ {{ scope.row.people_range.max }}
            </template>
          </el-table-column>
          <el-table-column prop="limit_num" label="产品数量" align="center" />
          <el-table-column prop="order_num" label="已购数量" align="center" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i
                v-if="!scope.row.is_expired"
                class="el-icon-edit"
                @click="editBargains(scope.$index, scope.row)"
              />
              <i
                v-if="!scope.row.is_expired"
                class="el-icon-delete"
                style="margin-left: 10px"
                @click="terminateBargainsAction(scope.$index, scope.row)"
                >废除</i
              >
              <i
                class="mark el-icon-delete"
                style="margin-left: 10px; color: #ff5000"
                @click="deleteBargainsAction(scope.$index, scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total_count > params.pageSize" class="content-center content-padded">
          <el-pagination
            layout="prev, pager, next"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="助力广告图" name="image">
        <el-form ref="form" label-position="left">
          <el-form-item>
            <div class="frm-tips">只能上传jpg/png文件，且不超过2M （建议尺寸：617px * 214px）</div>
            <div>
              <div class="upload-box" @click="handleImgChange">
                <img v-if="ad_pic" :src="wximageurl + ad_pic" class="setting_pic">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </div>
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-form-item>
        </el-form>
        <div class="section-footer with-border content-center" style="width: 100%">
          <el-button type="primary" @click="saveAdPic"> 保 存 </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '../../../components/imageselect'
import { listBargins, deleteBargains, terminateBargains } from '../../../api/promotions'
import util from '../../../common/js/util'
import { setPageParams, getParamByTempName, updateParamsById } from '../../../api/wxa'
export default {
  components: {
    imgPicker
  },
  provide() {
    return {
      refresh: this.refresh
    }
  },
  data() {
    return {
      isGetImage: false,
      imgDialog: false,
      loading: false,
      ad_pic: '',
      total_count: 0,
      activeName: 'list',
      tempatePageKanJiaParamId: 0,
      submit: false,
      params: {
        page: 1,
        pageSize: 20
      },
      dataList: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getBargainsList()
    // this.getAdPic()
  },
  methods: {
    saveAdPic() {
      if (this.tempatePageKanJiaParamId) {
        let params = { ad_pic: this.ad_pic }
        let query = {
          params: params,
          template_name: 'yykcutdown',
          name: 'banner',
          page_name: 'pages/kanjia',
          id: this.tempatePageKanJiaParamId
        }
        updateParamsById(query).then(response => {
          // this.getAdPic()
          this.$message({
            message: '保存成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        if (!this.submit) {
          this.submit = true
          let params = { ad_pic: this.ad_pic }
          let query = {
            params: params,
            template_name: 'yykcutdown',
            name: 'banner',
            page_name: 'pages/kanjia'
          }
          setPageParams(query).then(response => {
            // this.getAdPic()
            this.submit = false
            this.$message({
              message: '保存成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        }
      }
    },
    handleImgChange() {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.ad_pic = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    addBargains() {
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editBargains(index, row) {
      this.$router.push({ path: this.matchRoutePath('editor/') + row.bargain_id })
    },
    getAdPic() {
      let filter = { template_name: 'yykcutdown', name: 'banner', page_name: 'pages/kanjia' }
      getParamByTempName(filter).then(res => {
        if (res.data.data) {
          this.ad_pic = res.data.data[0].params.ad_pic
          this.tempatePageKanJiaParamId = res.data.data[0].id
        }
      })
    },
    deleteBargainsAction(index, row) {
      this.$confirm('此操作将删除该助力活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteBargains(row.bargain_id).then(response => {
            this.$message({
              message: '删除助力活动成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.getBargainsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    terminateBargainsAction(index, row) {
      this.$confirm('此操作将废除该助力活动, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          terminateBargains(row.bargain_id).then(response => {
            this.$message({
              message: '废除助力活动成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.getBargainsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getBargainsList() {
      this.loading = true
      let params = { page: this.params.page, pageSize: this.params.pageSize }
      listBargins(params)
        .then(response => {
          this.loading = false
          this.dataList = response.data.data.list
          this.total_count = response.data.data.total_count
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '获取活动列表出错'
          })
        })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getBargainsList()
    },
    refresh() {
      this.getBargainsList()
      // this.getAdPic()
    }
  }
}
</script>
