<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-tabs v-model="activeName" class="section-white content-padded">
    <el-tab-pane :label="$t('823bb520.48caac')" name="first">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item :label="$t('823bb520.ac147c')">
          <div class="frm-tips">{{ $t('823bb520.d5a0d5') }}</div>
          <el-button
            type="primary"
            class="el-icon-plus banner-button-uploader"
            @click="handleAddBanner"
          >
            {{ $t('823bb520.22134f') }}
          </el-button>
          <el-table :data="form.bannerPicList" border style="width: 100%">
            <el-table-column :label="$t('823bb520.178bae')">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.url"
                  :src="wximageurl + scope.row.url"
                  class="banner-uploader"
                  @click="handleImgChange(scope.$index, 'banner')"
                />
                <i
                  v-else
                  class="el-icon-plus banner-uploader"
                  @click="handleImgChange(scope.$index, 'banner')"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('823bb520.d3eabc')">
              <template slot-scope="scope">
                <span v-if="scope.row.item_id"
                  >{{ scope.row.item_name }}
                  <el-button type="text" @click="handleGoodsChange(scope.$index, 'banner')">{{
                    $t('823bb520.8347a9')
                  }}</el-button>
                </span>
                <i
                  v-else
                  class="el-icon-plus banner-uploader"
                  @click="handleGoodsChange(scope.$index, 'banner')"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('823bb520.2b6bc0')">
              <template slot-scope="scope">
                <el-button icon="delete" @click="handleDelBanner(scope.$index)">
                  {{ $t('823bb520.2f4aad') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item :label="$t('823bb520.612b0b')">
          <el-table :data="form.hotGoods" border style="width: 100%">
            <el-table-column :label="$t('823bb520.b478dd')">
              <template slot-scope="scope">
                <img
                  v-if="scope.row.url"
                  :src="wximageurl + scope.row.url"
                  class="banner-uploader"
                  @click="handleImgChange(scope.$index, 'hotGoods')"
                />
                <i
                  v-else
                  class="el-icon-plus banner-uploader"
                  @click="handleImgChange(scope.$index, 'hotGoods')"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('823bb520.1f79ba')">
              <template slot-scope="scope">
                <span v-if="scope.row.item_id"
                  >{{ scope.row.item_name }}
                  <el-button type="text" @click="handleGoodsChange(scope.$index, 'hotGoods')">{{
                    $t('823bb520.8347a9')
                  }}</el-button>
                </span>
                <i
                  v-else
                  class="el-icon-plus banner-uploader"
                  @click="handleGoodsChange(scope.$index, 'hotGoods')"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="section-footer with-border content-center" style="width: 100%">
          <el-button type="primary" @click="save">{{ $t('823bb520.56df61') }}</el-button>
        </div>
      </el-form>
    </el-tab-pane>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <el-dialog
      :title="$t('823bb520.43d1e2')"
      class="select-goods-box"
      :visible.sync="selectGoodsVisible"
    >
      <template>
        <el-transfer
          v-model="selectGoods"
          :titles="[$t('823bb520.437974'), $t('823bb520.543b04')]"
          :button-texts="[$t('823bb520.be4911'), $t('823bb520.93d369')]"
          :data="goodsList"
          @change="handleSelectChange"
        >
          <div slot="left-footer" class="page-box">
            <el-pagination
              v-if="total_count > params.pageSize"
              layout="prev, next"
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="handleSelectGoodsChange"
            />
          </div>
        </el-transfer>
        <div class="section-footer with-border content-center" style="width: 100%">
          <el-button type="primary" @click="handleGoodsDialog">
            {{ $t('823bb520.38cf16') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-tabs>
</template>
<script>
import imgPicker from '../../../components/imageselect'
import { getItemsList } from '../../../api/goods'
import { setPageParams, getParamByTempName, updateParamsById } from '../../../api/wxa'
export default {
  components: {
    imgPicker
  },
  data() {
    return {
      selectGoods: [],
      selectItem: {
        item_id: 0,
        item_name: ''
      },
      selectGoodsVisible: false,
      currentType: 'banner',
      currentIndex: 0,
      isGetImage: false,
      imgDialog: false,
      activeName: 'first',
      // 商品相关
      total_count: 0,
      goodsList: [],
      params: {
        page: 1,
        pageSize: 20
      },
      bannerPicListSetId: 0,
      hotGoodsSetId: 0,
      form: {
        bannerPicList: [],
        hotGoods: [
          { url: '', item_id: '', item_name: '' },
          { url: '', item_id: '', item_name: '' }
        ]
      }
    }
  },
  mounted() {
    let filter = { template_name: 'yykmendian', name: 'banner', page_name: 'index' }
    getParamByTempName(filter).then((res) => {
      if (res.data.data) {
        this.form.bannerPicList = res.data.data[0].params
        this.bannerPicListSetId = res.data.data[0].id
      }
    })
    let hotGoodsFilter = { template_name: 'yykmendian', name: 'hotGoods', page_name: 'index' }
    getParamByTempName(hotGoodsFilter).then((res) => {
      if (res.data.data) {
        this.form.hotGoods = res.data.data[0].params
        this.hotGoodsSetId = res.data.data[0].id
      }
    })
  },
  methods: {
    handleAddBanner() {
      let row = { url: '', item_id: 0, item_name: '' }
      if (this.form.bannerPicList.length > 4) {
        this.$message({
          message: this.$t('823bb520.1d1897'),
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        this.form.bannerPicList.push(row)
      }
    },
    handleGoodsChange(index, type_name) {
      this.currentIndex = index
      this.currentType = type_name
      this.selectGoodsVisible = true
      this.selectGoods = []
      if (this.currentType == 'banner') {
        if (this.form.bannerPicList[this.currentIndex].item_id) {
          this.selectGoods = [this.form.bannerPicList[this.currentIndex].item_id]
        }
      } else {
        if (this.form.hotGoods[this.currentIndex].item_id) {
          this.selectGoods = [this.form.hotGoods[this.currentIndex].item_id]
        }
      }
      this.getGoodsList()
    },
    handleDelBanner(index) {
      this.form.bannerPicList.splice(index, 1)
    },
    handleImgChange(index, type_name) {
      this.imgDialog = true
      this.isGetImage = true
      this.currentType = type_name
      this.currentIndex = index
    },
    pickImg(data) {
      if (this.currentType == 'hotGoods') {
        this.form.hotGoods[this.currentIndex].url = data.url
      } else {
        this.form.bannerPicList[this.currentIndex].url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    },
    //选择商品分页
    handleSelectGoodsChange(val) {
      this.params.page = val
      this.goodsList.forEach((row) => {
        //如果选中
        let index = this.selectGoods.indexOf(row.key)
        if (index != -1) {
          if (this.currentType == 'banner') {
            this.form.bannerPicList[this.currentIndex].item_id = row.key
            this.form.bannerPicList[this.currentIndex].item_name = row.label
          } else {
            this.form.hotGoods[this.currentIndex].item_id = row.key
            this.form.hotGoods[this.currentIndex].item_name = row.label
          }
        }
      })
      this.getGoodsList()
    },
    //选择商品触发事件
    handleSelectChange(value, direction, movedKeys) {
      if (value.length > 1) {
        this.$message({
          message: this.$t('823bb520.0a5544'),
          type: 'error',
          duration: 5 * 1000
        })
      }
      this.selectGoods.splice(1)
    },
    //选择商品确认
    handleGoodsDialog() {
      this.selectGoodsVisible = false
      if (this.selectGoods.length > 0) {
        this.goodsList.forEach((row) => {
          //如果选中
          let index = this.selectGoods.indexOf(row.key)
          if (index != -1) {
            if (this.currentType == 'banner') {
              this.form.bannerPicList[this.currentIndex].item_id = row.key
              this.form.bannerPicList[this.currentIndex].item_name = row.label
            } else {
              this.form.hotGoods[this.currentIndex].item_id = row.key
              this.form.hotGoods[this.currentIndex].item_name = row.label
            }
          }
        })
      } else {
        if (this.currentType == 'banner') {
          this.form.bannerPicList[this.currentIndex].item_id = ''
          this.form.bannerPicList[this.currentIndex].item_name = ''
        } else {
          this.form.hotGoods[this.currentIndex].item_id = ''
          this.form.hotGoods[this.currentIndex].item_name = ''
        }
      }
      this.selectGoods = []
    },
    getGoodsList() {
      getItemsList(this.params).then((response) => {
        this.goodsList = []
        response.data.data.list.forEach((row) => {
          let itemid = ''
          if (this.currentType == 'banner') {
            itemid = this.form.bannerPicList[this.currentIndex].item_id
          } else {
            itemid = this.form.hotGoods[this.currentIndex].item_id
          }
          if (row.itemId != itemid) {
            this.goodsList.push({
              key: row.itemId,
              label: row.itemName
            })
          }
        })
        if (this.currentType == 'banner') {
          if (this.form.bannerPicList[this.currentIndex].item_id) {
            this.goodsList.push({
              key: this.form.bannerPicList[this.currentIndex].item_id,
              label: this.form.bannerPicList[this.currentIndex].item_name
            })
          }
        } else {
          if (this.form.hotGoods[this.currentIndex].item_id) {
            this.goodsList.push({
              key: this.form.hotGoods[this.currentIndex].item_id,
              label: this.form.hotGoods[this.currentIndex].item_name
            })
          }
        }
        this.total_count = response.data.data.total_count
      })
    },
    save() {
      if (this.bannerPicListSetId) {
        let bannerParams = {
          params: this.form.bannerPicList,
          template_name: 'yykmendian',
          name: 'banner',
          page_name: 'index',
          id: this.bannerPicListSetId
        }
        updateParamsById(bannerParams).then((response) => {
          this.$message({
            message: this.$t('823bb520.3b1083'),
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        let bannerParams = {
          params: this.form.bannerPicList,
          template_name: 'yykmendian',
          name: 'banner',
          page_name: 'index'
        }
        setPageParams(bannerParams).then((response) => {
          this.$message({
            message: this.$t('823bb520.3b1083'),
            type: 'success',
            duration: 5 * 1000
          })
        })
      }

      if (this.hotGoodsSetId) {
        let hotGoodsParams = {
          params: this.form.hotGoods,
          template_name: 'yykmendian',
          name: 'hotGoods',
          page_name: 'index',
          id: this.hotGoodsSetId
        }
        updateParamsById(hotGoodsParams).then((response) => {
          this.$message({
            message: this.$t('823bb520.3b1083'),
            type: 'success',
            duration: 5 * 1000
          })
        })
      } else {
        let hotGoodsParams = {
          params: this.form.hotGoods,
          template_name: 'yykmendian',
          name: 'hotGoods',
          page_name: 'index'
        }
        setPageParams(hotGoodsParams).then((response) => {
          this.$message({
            message: this.$t('823bb520.3b1083'),
            type: 'success',
            duration: 5 * 1000
          })
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.banner-button-uploader {
  margin-bottom: 10px;
}
.banner-uploader {
  font-size: 14px;
  color: #8c939d;
  width: 142px;
  height: 75px;
  line-height: 75px;
  text-align: center;
  border: 1px dashed #ddd;
}
.el-transfer {
  text-align: center;
  padding: 10px 0 20px;
}
</style>
<style type="text/css" lang="scss">
.select-goods-box {
  .el-transfer-panel {
    text-align: left;
    width: 270px;
    .el-transfer-panel__body {
      height: 270px;
    }
  }
}
</style>
