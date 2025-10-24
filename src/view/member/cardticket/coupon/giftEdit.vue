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
  <div class="gift-edit">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>适用店铺信息</span>
        <el-button
          :disabled="listData.is_active"
          style="float: right"
          type="primary"
          size="mini"
          @click="addDistributorAction"
        >
          选择店铺
        </el-button>
      </div>
      <div class="content store-content">
        <template v-if="distributorList && distributorList.length > 0">
          <div class="account">
            <div v-for="item in showDistributorList" :key="item.distributor_id" class="list">
              <div class="item">
                <div>{{ item.name }}</div>
                <i
                  v-if="!listData.is_active"
                  class="el-icon-error close-icon"
                  @click="deleteStore(item)"
                />
              </div>
            </div>
          </div>
          <div class="page">
            <el-pagination
              layout="prev, pager, next"
              :total="distributorList && distributorList.length"
              :page-size="storePageSize"
              :current-page.sync="storeCurrentPage"
              @current-change="handleCurrentChange"
            />
          </div>
        </template>

        <div v-else class="tips">
          默认全部店铺适用，若该券只适用于部分店铺请点击右上角
          <span class="primary-color">「选择店铺」</span>
        </div>
      </div>
    </el-card>

    <el-card class="box-card goods" shadow="never">
      <div slot="header" class="clearfix">
        <span>可兑商品信息</span>
        <span v-if="goodsList && goodsList.length > 0" class="tips">
          (多规格商品支持SPU级别，如只能兑换其中一个规格产品请选择相应规格)</span
        >
        <div style="float: right">
          <template v-if="goodsList && goodsList.length > 0">
            <span>商品查询：</span>
            <el-input
              v-model="searchGoodsName"
              size="small"
              placeholder="请输入内容"
              style="width: 220px"
              class="goods-input"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchGoods" />
            </el-input>
</template
          >&nbsp;

          <el-button
            :disabled="listData.is_active"
            type="primary"
            size="mini"
            @click="handleGoodsDialogShow"
          >
            选择商品
          </el-button>
          <el-button
            :disabled="listData.is_active"
            type="primary"
            size="mini"
            @click="showUpload = true"
          >
            批量上传
          </el-button>
        </div>
      </div>
      <div class="content">
        <template v-if="goodsList && goodsList.length > 0">
          <div class="goods-content">
            <div v-for="item in showGoodsList" :key="item.itemId" class="goods-list">
              <div style="width: 10%" class="item goods-id">
                <div class="title-tips">商品ID</div>
                <div>{{ item.itemId }}</div>
              </div>
              <div style="width: 50%" class="item goods-info">
                <img v-if="item.pics" :src="item.pics[0]" alt="">
                <div class="goods-sku">
                  <div>
                    {{ item.itemName }}
                  </div>
                  <div class="title-tips">
                    {{ item.item_spec_desc }}
                  </div>
                </div>
              </div>

              <div style="width: 10%" class="item goods-price">
                <div class="title-tips">价格</div>
                <div>￥ {{ item.price / 100 }}</div>
              </div>
              <div style="width: 10%" class="item goods-count">
                <div class="title-tips">库存</div>
                <div>{{ item.store }}</div>
              </div>
              <div style="width: 20%" class="item goods-limit">
                <div class="title-tips">兑换上限</div>
                <div>
                  <el-input
                    v-model="item.limit"
                    :disabled="listData.is_active"
                    style="width: 80px"
                    size="small"
                    type="number"
                    min="0"
                    @input="changeLimit(arguments[0], item.itemId)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="page">
            <el-pagination
              layout="prev, pager, next"
              :total="allShowGoodsList && allShowGoodsList.length"
              :page-size="goodsPageSize"
              :current-page.sync="goodsCurrentPage"
              @current-change="handleCurrentGoodsChange"
            />
          </div>
        </template>
        <div v-else class="tips">
          暂未无可兑商品，请点击右上角<span class="primary-color">「选择商品」</span>进行添加
        </div>
      </div>
    </el-card>

    <div class="content-center">
      <el-button @click="cancelSubmit"> 取消 </el-button>
      <el-button v-loading="loading" type="primary" @click="submitDetail"> 提交 </el-button>
    </div>

    <DistributorSelect
      :store-visible="distributorVisible"
      :is-valid="true"
      :rel-data-ids="distributorList"
      :get-status="setDistributorStatus"
      return-type="selectRow"
      @chooseStore="chooseDistributorAction"
      @closeStoreDialog="closeDistributorDialogAction"
    />

    <GoodsSelector
      v-if="itemVisible && setItemStatus"
      :items-visible="itemVisible"
      :get-status="setItemStatus"
      :rel-items-ids="selectGoodsList"
      item-type="normal"
      :limit-count="200"
      :set-search="true"
      :is-change-store="true"
      :gift="false"
      @chooseStore="handleGoodsSubmit"
      @closeStoreDialog="handleGoodsDialogHide"
    />

    <!-- 上传 -->
    <UploadGoods v-model="showUpload" @uploadFile="uploadFile" />
  </div>
</template>

<script>
import DistributorSelect from '@/components/storeListSelect'
import GoodsSelector from '@/components/goodsSelect/index'
import UploadGoods from '@/components/uploadGoods/index'
export default {
  inject: ['refresh'],
  components: {
    DistributorSelect,
    GoodsSelector,
    UploadGoods
  },
  props: {
    listData: {
      type: Object,
      defalut: {}
    }
  },
  data() {
    return {
      loading: false,
      distributorVisible: false,
      setDistributorStatus: false,
      distributorList: [],
      showDistributorList: [],

      itemVisible: false,
      setItemStatus: false,
      relItems: [],

      //店铺分页
      storePageSize: 20,
      storeCurrentPage: 1,

      goodsList: [], // 勾选商品的全部数据
      allShowGoodsList: [], // 商品列表展示的全部数据
      showGoodsList: [], // 当前页面商品列表展示的数据

      // 商品分页
      goodsPageSize: 6,
      goodsCurrentPage: 1,

      searchGoodsName: '', // 商品列表查询关键字
      showUpload: false,

      uploadList: [], // 上传的全部商品数据
      selectGoodsList: [] // 选择器选择的全部商品
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 截取分页数据
    getRowList(list, currentPage, pageSize) {
      let newList = []
      if (list && list.length > 0) {
        let startRow = (currentPage - 1) * pageSize
        let endRow = currentPage * pageSize
        newList = list.slice(startRow, endRow)
      }
      return newList
    },
    // 关键字查询
    searchkeyWord(list, keyWord) {
      let arr = []
      list.forEach(v => {
        if (v.itemName.indexOf(keyWord) >= 0) {
          arr.push(v)
        }
      })
      return arr
    },

    // 获取初始数据
    init() {
      const { itemTreeLists = [], distributor_info = [] } = this.listData
      itemTreeLists &&
        itemTreeLists.forEach(v => {
          v.limit = v.use_limit || 0
        })
      this.initStoreList(distributor_info)
      this.initGoodsList(itemTreeLists)
    },
    cancelSubmit() {
      this.refresh()
      this.$emit('changeShowEdit', false)
      this.$router.go(-1)
    },
    submitDetail() {
      if (this.goodsList.length < 1) {
        this.$alert('您还未选择商品，请选择商品后再提交', '警告消息', {
          confirmButtonText: '确定',
          type: 'warning',
          callback: action => {}
        })
      } else {
        this.$confirm(
          '活动创建成功后，活动开始之后商品和店铺相关信息不可修改，请确认是否提交',
          '系统通知',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )
          .then(async () => {
            // 提交返回列表页
            const distributor_ids = this.distributorList.map(v => v.distributor_id)

            const items = this.goodsList.map(v => {
              return {
                id: v.itemId,
                limit: v.limit || 0
              }
            })
            this.listData.distributor_ids = JSON.stringify(distributor_ids)
            this.listData.items = JSON.stringify(items)
            this.$emit('submitList', this.listData)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },

    // 店铺操作-----
    initStoreList(data) {
      this.distributorList = data
      this.showDistributorList = this.getRowList(data, 1, this.storePageSize)
    },
    addDistributorAction() {
      this.distributorVisible = true
      this.setDistributorStatus = true
    },
    closeDistributorDialogAction() {
      this.distributorVisible = false
    },
    chooseDistributorAction(data) {
      this.distributorList = data
      this.showDistributorList = this.getRowList(data, this.storeCurrentPage, this.storePageSize)
      this.distributorVisible = false
    },
    handleCurrentChange(val) {
      this.storeCurrentPage = val
      this.showDistributorList = this.getRowList(this.distributorList, val, this.storePageSize)
    },

    // 删除门店
    deleteStore(item) {
      let index = this.distributorList.findIndex(v => item.distributor_id === v.distributor_id)
      if (index !== -1) {
        this.distributorList.splice(index, 1)
        this.storeCurrentPage = 1
        this.showDistributorList = this.getRowList(
          this.distributorList,
          this.storeCurrentPage,
          this.storePageSize
        )
      }
    },

    // 商品操作------
    // 初始化商品数据
    initGoodsList(data) {
      this.searchGoodsName = ''
      this.goodsList = data
      this.allShowGoodsList = data
      this.showGoodsList = this.getRowList(data, 1, this.goodsPageSize)
    },

    // 上传选择商品后数据处理
    changeGoodsList() {
      let allData = this.selectGoodsList || []
      this.uploadList.forEach(v => {
        let index = allData.findIndex(item => item.itemId === v.itemId)
        if (index !== -1) {
          allData.splice(index, 1)
        }
      })

      this.initGoodsList(allData.concat(this.uploadList))
    },

    handleGoodsDialogShow() {
      this.itemVisible = true
      this.setItemStatus = true
    },
    handleGoodsSubmit(data) {
      data.forEach(v => {
        v.limit = v.store
      })
      this.itemVisible = false
      this.selectGoodsList = data
      this.changeGoodsList()
    },
    handleCurrentGoodsChange(val) {
      this.goodsCurrentPage = val
      this.showGoodsList = this.getRowList(this.allShowGoodsList, val, this.goodsPageSize)
    },
    handleGoodsDialogHide() {
      this.itemVisible = false
    },

    // 商品查询
    searchGoods() {
      this.allShowGoodsList = this.searchkeyWord(this.goodsList, this.searchGoodsName)
      this.showGoodsList = this.getRowList(this.allShowGoodsList, 1, this.goodsPageSize)
    },

    // 上传
    uploadFile(uploadList) {
      uploadList.forEach(v => {
        v.limit = Number(v.limit_num)
        // let index = this.uploadList.findIndex((item) => item.itemId === v.itemId)
        // if (index !== -1) {
        //   this.uploadList.splice(index, 1)
        // }
      })
      // this.uploadList = this.uploadList.concat(uploadList)
      this.uploadList = uploadList
      this.changeGoodsList()
      this.showUpload = false
    },

    // 变更限制
    changeLimit(value, itemId) {
      // 展示数据和原数据都需要变更
      let index = this.showGoodsList.findIndex(v => v.itemId === itemId)
      this.showGoodsList[index].limit = Number(value)

      let goodsindex = this.goodsList.findIndex(v => v.itemId === itemId)
      this.goodsList[goodsindex].limit = Number(value)
      this.$nextTick(() => {
        let newVal = Math.max(Number(value), 0)
        this.showGoodsList[index].limit = Number(newVal)

        this.goodsList[goodsindex].limit = Number(newVal)
        this.changeGoodsList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-edit {
  .store-content {
    height: 300px;
  }
  .content {
    position: relative;
    .tips {
      width: 100%;
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .account {
      display: flex;
      flex-wrap: wrap;
      .list {
        width: 25%;
        box-sizing: border-box;
        .item {
          height: 50px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          margin-right: 10px;
          .close-icon {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 20px;
            color: #ccc;
            cursor: pointer;
          }
        }

        &:nth-child(4n) {
          .item {
            margin-right: 0;
          }
        }
      }
    }
    .page {
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
  }

  .goods {
    .account {
      width: 100%;
      margin-bottom: 20px;
    }
    .goods-list {
      width: 100%;
      display: flex;
      align-items: center;
      .item {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
      }
      .goods-info {
        display: flex;
        align-items: center;
        justify-content: flex-start !important;
        flex-direction: row;
        img {
          width: 64px;
          height: 64px;
          margin-right: 20px;
        }
      }
    }
  }

  .goods-content {
    height: 600px;
    .goods-list {
      height: 80px;
      margin-bottom: 10px;
    }
  }
}
.primary-color {
  color: #409eff;
}
.tips {
  color: #7f7f7f;
}
.title-tips {
  color: #999999;
}
</style>
