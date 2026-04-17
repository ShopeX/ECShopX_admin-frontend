<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="">
    <div class="view-flex view-flex-middle content-bottom-padded">
      <div class="view-flex-item">
        {{ $t('ba32d41d.678473') }} {{ total_count }} {{ $t('ba32d41d.81f47a') }}
      </div>
      <div>
        <el-button @click="addCodeThings"> {{ $t('ba32d41d.ec6dce') }} </el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col v-for="(item, index) in list" :key="index" :span="12">
        <div class="list-item view-flex">
          <div class="view-flex view-flex-item">
            <div class="thumbnail">
              <img :src="wximageurl + item.pic" />
            </div>
            <div>
              <div class="item-title">
                {{ item.thing_name }}
              </div>
              <div class="item-date">
                {{ item.created | datetime('YYYY-MM-DD HH:mm:ss') }}
              </div>
              <div class="item-batch">
                {{ $t('ba32d41d.fbd2b1') }}{{ item.batch_total_count }}{{ $t('ba32d41d.911e83') }}
                {{ $t('ba32d41d.450efd') }}{{ item.batch_total_quantity
                }}{{ $t('ba32d41d.f7edf5') }}
              </div>
            </div>
          </div>
          <div class="">
            <router-link
              :to="{
                path: '/brand/onecode/thingsbatchsdetail',
                query: { thing_id: item.thing_id }
              }"
            >
              <el-tooltip effect="light" :content="$t('ba32d41d.656222')" placement="top">
                <i class="iconfont icon-eye" />
              </el-tooltip>
            </router-link>
            <router-link
              :to="{ path: '/brand/onecode/things', query: { thing_id: item.thing_id } }"
            >
              <el-tooltip effect="light" :content="$t('ba32d41d.bb5539')" placement="top">
                <i class="iconfont icon-pen" />
              </el-tooltip>
            </router-link>
            <router-link
              :to="{ path: '/brand/onecode/batchs', query: { thing_id: item.thing_id } }"
            >
              <el-tooltip effect="light" :content="$t('ba32d41d.39dece')" placement="top">
                <i class="iconfont icon-download" />
              </el-tooltip>
            </router-link>
            <el-tooltip effect="light" :content="$t('ba32d41d.2b3378')" placement="top">
              <i class="el-icon-delete-solid" @click="deleteThingsAction(item.thing_id)" />
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getThingsList, getThingsDetail, deleteThings } from '../../../api/onecode'
export default {
  data() {
    return {
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20
      },
      list: []
    }
  },
  mounted() {
    this.getCodeThingsList()
  },
  methods: {
    addCodeThings() {
      this.$router.push({ path: '/brand/onecode/things' })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    editThingsAction(index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/brand/onecode/things/' + row.thing_id })
    },
    thingsDetail(index, row) {
      this.ItemsDetailVisible = true
      getThingsDetail(row.thing_id)
        .then((response) => {
          this.itemsDetailData = response.data.data
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('ba32d41d.badd26')
          })
        })
    },
    getCodeThingsList() {
      this.loading = true
      getThingsList(this.params)
        .then((response) => {
          this.list = response.data.data.list
          this.total_count = response.data.data.total_count
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: this.$t('ba32d41d.1caaf5')
          })
        })
    },
    deleteThingsAction(thing_id) {
      this.$confirm(this.$t('ba32d41d.e5a5b9'), this.$t('ba32d41d.02d981'), {
        confirmButtonText: this.$t('ba32d41d.38cf16'),
        cancelButtonText: this.$t('ba32d41d.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteThings(thing_id)
            .then((response) => {
              this.$message({
                message: this.$t('ba32d41d.6a6e33'),
                type: 'success',
                duration: 5 * 1000
              })
              this.getCodeThingsList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('ba32d41d.5649b5')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('ba32d41d.2111cc')
          })
        })
    },
    priceformatter(row, column) {
      return '￥' + row.price / 100
    }
  }
}
</script>

<style scoped lang="scss">
.list-item {
  padding: 15px;
  background: #fff;
  margin-bottom: 15px;
  .thumbnail {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    margin-right: 15px;
    background: #f8f8f8;
    &::after {
      display: block;
      padding-top: 100%;
      content: '';
    }
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .item-title {
    margin-bottom: 6px;
    font-size: 18px;
    color: #333;
  }
  .item-date {
    font-size: 13px;
    color: #ccc;
  }
  .item-batch {
    font-size: 14px;
    color: #999;
  }
}
</style>
