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
.store-name {
  padding-bottom: 5px;
  font-size: 16px;
  color: #333;
}
.store-contact {
  color: #888;
  span {
    margin-right: 10px;
  }
}
.store-address {
  color: #888;
}
</style>
<template>
  <div>
    <div
      v-if="
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('detail') === -1 &&
        $route.path.indexOf('_template') === -1
      "
    >
      <el-row v-if="$store.getters.login_type !== 'distributor'" :gutter="20">
        <!-- <el-col> -->
        <!-- <el-cascader
            placeholder="根据地区筛选"
            :options="regions"
            filterable
            clearable
            :props="{ checkStrictly: true }"
            @change="RegionChangeSearch"
          ></el-cascader>
          <el-input class="input-m" placeholder="店铺名称" v-model="params.name"></el-input> -->
        <shop-select distributors :shop-id-default="params.distributor_id" @update="storeSearch" />
        <el-input v-model="params.mobile" class="input-m" placeholder="联系人手机号">
          <el-button slot="append" icon="el-icon-search" @click="numberSearch" />
        </el-input>
        <!-- </el-col> -->
      </el-row>
      <el-row :gutter="20" />
      <el-card>
        <el-table v-loading="loading" :data="list">
          <el-table-column width="50" prop="distributor_id" label="ID" />
          <el-table-column label="店铺">
            <template slot-scope="scope">
              <div class="store-name">
                {{ scope.row.name }}
              </div>
              <!-- <div class="store-contact">
                <span v-if="scope.row.contact">
                  <i class="el-icon-user"></i>
                  {{scope.row.contact}}
                </span>
                <span>
                  <i class="el-icon-mobile"></i>
                  {{scope.row.mobile}}
                </span>
              </div>
              <div v-if="scope.row.store_address" class="store-address">
                <i class="el-icon-place"></i>
                {{scope.row.store_address}}
              </div>-->
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{ scope.row.status_msg }}
            </template>
          </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handelClick(scope.row, '查看')"> 查看 </el-button>
              <el-button
                v-if="scope.row.status == 1 || scope.row.status == 4"
                type="text"
                @click="handelClick(scope.row, '编辑')"
              >
                编辑
              </el-button>
              <el-button
                v-if="
                  $store.getters.login_type !== 'distributor' &&
                  (scope.row.status == 1 || scope.row.status == 4)
                "
                type="text"
                @click="handelClick(scope.row, '开户')"
              >
                开户
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-4 text-right">
          <el-pagination
            background
            :current-page="params.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="params.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total_count"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>

      <!-- <el-dialog
        title="修改状态"
        width="18%"
        :visible.sync="editValidDialog"
        :before-close="handleCancelLabelsDialog"
      >
        <template>
          <el-radio-group v-model="editValidData.is_valid" @change="editValidSubmit">
            <el-radio label="true">启用</el-radio>
            <el-radio label="false">禁用</el-radio>
            <el-radio label="delete">废弃</el-radio>
          </el-radio-group>
        </template>
      </el-dialog>-->

      <!-- 添加、编辑基础物料-结束 -->

      <!-- 编辑距离-开始 -->

      <!-- 编辑距离-结束 -->
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import shopSelect from '@/components/shopSelect'
import { getEnterapplyList, upHfkaihu } from '@/api/fenzhang'

import district from '@/common/district.json'

import store from '@/store'
// 取选中地区的值
function getCascaderObj(val, opt) {
  return val.map(function (value, index, array) {
    for (var itm of opt) {
      if (itm.value === value) {
        opt = itm.children
        return itm
      }
    }
    return null
  })
}

export default {
  components: {
    shopSelect
  },
  data() {
    return {
      dialogVisible: false,
      current: '', // 当前店铺id
      regions: district,
      total_count: 0,
      statusText: {
        1: '未提交进件信息',
        2: '审核中',
        3: '审核成功',
        4: '审核失败'
      },
      params: {
        page: 1,
        pageSize: 20,
        name: '',
        mobile: '',
        province: '',
        is_valid: true,
        city: '',
        area: ''
      },
      loading: false,
      list: []
    }
  },

  computed: {
    ...mapGetters(['wheight'])
  },
  mounted() {
    this.getList()
    // this.getAllTagList()
  },
  methods: {
    getList() {
      this.loading = true
      if (this.$store.getters.login_type == 'distributor') {
        this.params.distributor_id = this.$store.getters.shopId
      }
      getEnterapplyList(this.params).then(res => {
        console.log(res, 'res')
        if (res.data.data.list) {
          this.list = res.data.data.list
          this.total_count = res.data.data.total_count
        }
        this.loading = false
      })
    },

    numberSearch(e) {
      this.params.page = 1
      this.getList()
    },

    handelClick(row, type) {
      switch (type) {
        case '查看':
          this.$router.push({
            path: this.matchRoutePath('editor'),
            query: { id: row.distributor_id, type: '0' }
          })
          break
        case '编辑':
          this.$router.push({
            path: this.matchRoutePath('editor'),
            query: { id: row.distributor_id, type: '1' }
          })

          break
        case '开户':
          {
            this.$confirm('确认开户？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                upHfkaihu({ distributor_id: row.distributor_id }).then(res => {
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                  this.getList()
                })
              })
              .catch(() => {
                //   this.$message({
                //     type: 'info',
                //     message: '已取消删除',
                //   })
              })
          }
          break
      }

      //   this.$confirm('确认开户？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //   })
      //     .then(() => {
      //       this.$message({
      //         type: 'success',
      //         message: '提交成功!',
      //       })
      //     })
      //     .catch(() => {
      //     //   this.$message({
      //     //     type: 'info',
      //     //     message: '已取消删除',
      //     //   })
      //     })
    },
    storeSearch(val) {
      this.params.page = 1
      val && val.shop_id
      this.params.distributor_id = val.shop_id
      this.getList()
    },
    RegionChangeSearch(value) {
      console.log(value)
      var vals = getCascaderObj(value, this.regions)
      if (vals.length == 1) {
        this.params.province = vals[0].label
        this.params.city = ''
        this.params.area = ''
      } else if (vals.length == 2) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = ''
      } else if (vals.length == 3) {
        this.params.province = vals[0].label
        this.params.city = vals[1].label
        this.params.area = vals[2].label
      } else {
        this.params.province = ''
        this.params.city = ''
        this.params.area = ''
      }
      this.params.page = 1
      // this.getList()
    },

    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange(page) {
      this.params.page = page
      this.getList()
    }
  },
  beforeRouteUpdate(to, from, next) {
    next()
    if (to.path.indexOf('editor') === -1 && to.path.indexOf('detail') === -1) {
      this.getList()
      //   this.getAllTagList()
    }
  }
}
</script>
