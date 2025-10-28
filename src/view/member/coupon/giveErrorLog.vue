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
    <el-table v-loading="loading" :data="giveErrorLogList" style="width: 100%" height="580" border>
      <el-table-column prop="username" label="用户姓名" />
      <el-table-column prop="mobile" label="手机号码" />
      <el-table-column prop="card_id" label="优惠券id" />
      <el-table-column prop="title" label="优惠券名称" />
      <el-table-column prop="note" label="失败原因" />
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="totalCount"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getGiveErrorLogList } from '../../../api/promotions'
export default {
  data() {
    return {
      loading: false,
      giveErrorLogList: [],
      totalCount: 0,
      params: {
        page: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getGiveErrorLogList()
  },
  methods: {
    handleCurrentChange(pageNum) {
      this.params.page = pageNum
      this.getGiveErrorLogList()
    },
    getGiveErrorLogList() {
      this.loading = true
      getGiveErrorLogList(this.$route.params.id, this.params)
        .then(response => {
          this.giveErrorLogList = response.data.data.list
          this.totalCount = response.data.data.total_count
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message({
            type: 'error',
            message: '获取优惠券发放详情列表信息出错'
          })
        })
    }
  }
}
</script>
<style scoped lang="scss">
.el-icon-edit {
  cursor: pointer;
}
.coupon-list {
  margin-top: 10px;
}
.coupon-item {
  position: relative;
  height: 130px;
  padding: 25px 20px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dadadd;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  width: 19%;
  float: left;
  margin: 0.5%;
  &.coupon-add {
    padding-top: 20px;
    cursor: pointer;
    i {
      font-size: 40px;
    }
    :last-child {
      margin-top: 10px;
    }
  }
  .price {
    font-size: 24px;
  }
  .color-gray {
    color: #99a9bf;
  }
  .color-gray-deep {
    color: #8492a6;
  }
  .item-code {
    display: inline-block;
    width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span.icon-triangle {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 34px solid #20a0ff;
    border-left: 34px solid transparent;
    color: #fff;
  }
  label {
    position: absolute;
    top: -34px;
    right: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
}
.item-bg {
  position: absolute;
  left: 0;
  bottom: -101%;
  width: 100%;
  height: 100%;
  background: rgba(241, 244, 246, 0.9);
  text-align: left;
  border-radius: 5px;
  padding-top: 8px;
  transition: all 0.4s ease;
  p {
    padding: 0 10px;
  }
  .item-operate {
    position: absolute;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    width: 100%;
    padding: 4px 0;
    text-align: center;
    cursor: pointer;
    a {
      color: #fff;
    }
  }
}
.coupon-item:hover {
  .item-bg {
    bottom: 0;
  }
}
.coupon-type-item {
  position: relative;
  padding: 30px 10px;
  border: 1px solid #ff5000;
  color: #ff5000;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 20px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  &:first-child {
    font-size: 18px;
  }
  .coupon-type-desc {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: -100%;
    left: 0;
    padding: 10px 0;
    background: #ff5000;
    color: #fff;
    font-size: 18px;
    transition: all 0.4s ease;
    div:last-child {
      width: 70%;
      margin: 8px auto 0;
      font-size: 12px;
    }
  }
  &:hover {
    .coupon-type-desc {
      bottom: 0;
    }
  }
}

.coupon-type-item,
.sendout-item {
  overflow: hidden;
  .icon-checked {
    display: none;
    width: 100px;
    height: 25px;
    transform: rotate(35deg);
    position: absolute;
    font-size: 14;
    top: 5px;
    right: -25px;
    font-size: 20px;
    color: #fff;
    background: #ff5000;
    i {
      transform: rotate(-35deg);
    }
  }
  &.checked {
    .icon-checked {
      display: block;
    }
  }

  &:hover .icon-checked {
    background: #fff;
    i {
      color: #ff5000;
    }
  }
}
.store-pop {
  padding: 20px 15px;
  .store-content {
    margin-bottom: 15px;
  }
}
</style>
