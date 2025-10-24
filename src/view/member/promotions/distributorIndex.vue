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
    <div class="content-bottom-padded">
      <el-tooltip class="item" effect="light" content="创建分销商注册促销" placement="right-start">
        <el-button type="primary" icon="plus" @click="actionCouponAdd">
          创建分销商注册促销
        </el-button>
      </el-tooltip>
    </div>
    <el-table v-loading="loading" :data="dataList" style="width: 100%" height="580" border>
      <el-table-column prop="id" label="编号" width="60" />
      <el-table-column prop="ad_title" label="标题" width="200" />
      <el-table-column prop="is_open" label="是否开启" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_open == 'true'" type="success" size="mini"> 是 </el-tag>
          <el-tag v-else type="success" size="mini"> 否 </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="distributor" label="参与的分销商">
        <template slot-scope="scope">
          <el-tag
            v-for="(item, index) in scope.row.distributor_id.list"
            :key="index"
            type="success"
            size="mini"
          >
            {{ item.label }}
</el-tag
          >&nbsp;&nbsp;&nbsp;&nbsp;
        </template>
      </el-table-column>
      <!-- <el-table-column prop="distributor" label="参与的商品"> </el-table-column>
      <el-table-column prop="distributor" label="参与的优惠券"> </el-table-column> -->
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" icon="view" @click="itemsDetail(scope.$index, scope.row)">
            详情
          </el-button>
          <el-button size="mini" icon="edit" @click="editAction(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-button
            size="mini"
            icon="delete"
            type="danger"
            @click="deleteAction(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-4 text-right">
      <el-pagination
        layout="prev, pager, next"
        :total="pagers.total"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog title="查看详情" :visible.sync="detailVisible">
      <el-row :gutter="20">
        <el-col :span="6"> 注册引导广告标题 </el-col>
        <el-col :span="6">
          {{ dateDetail.ad_title }}
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6"> 注册引导图片 </el-col>
        <el-col :span="6">
          {{ dateDetail.ad_pic }}
        </el-col>
      </el-row>
      <el-row v-if="dateDetail.discributor_id" :gutter="20">
        <el-col :span="6"> 参与的分销商 </el-col>
        <el-col :span="6">
          <div v-for="item in dateDetail.discributor_id.list">
            {{ item.label }}
          </div>
        </el-col>
      </el-row>
      <el-row v-if="dateDetail.promotions_value" :gutter="20">
        <el-col :span="6"> 参与的优惠券 </el-col>
        <div v-for="item in dateDetail.promotions_value.coupons">
          {{ item.title }}
        </div>
        <el-col :span="6" />
      </el-row>
      <!-- <el-row :gutter="20">
        <el-col :span="6"></el-col>
        <el-col :span="6"></el-col>
      </el-row> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addCouponVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../common/js/util'
import { getRegisterList, getRegisterInfo, deleteRegister } from '../../../api/promotions'

export default {
  data() {
    return {
      loading: false,
      detailVisible: false,
      dataList: [],
      dateDetail: {},
      pagers: {
        total: 0
      },
      params: {
        page: 1,
        pageSize: 15,
        register_type: 'distributor',
        status: ''
      }
    }
  },
  mounted() {
    this.getDataList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    actionCouponAdd() {
      this.$router.push({ path: '/member/marketing/register/' })
    },
    editAction(index, row) {
      this.$router.push({ path: '/member/marketing/register/' + row.id })
    },
    itemsDetail(index, row) {
      this.loading = true
      getRegisterInfo(row.id).then(res => {
        console.log(res.data.data)
        if (res.data.data) {
          this.dateDetail = res.data.data
          this.loading = false
        } else {
          this.dateDetail = {}
          this.loading = false
        }
      })
      this.detailVisible = true
    },
    deleteAction(index, row) {
      this.$confirm('此操作将删除该促销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRegister(row.id)
            .then(response => {
              this.dataList.splice(index, 1)
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    getDataList() {
      this.loading = true
      getRegisterList(this.params)
        .then(res => {
          if (res.data.data.list.length > 0) {
            this.dataList = res.data.data.list
            this.pagers.total = res.data.data.pagers.total
            this.loading = false
          } else {
            this.dataList = []
            this.loading = false
          }
        })
        .catch(error => {
          this.loading = false
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
