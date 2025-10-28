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
  <div v-loading="loading">
    <div class="log-header">
      <div class="log-container">
        <div class="brand">
          <img :src="brand" alt="">
        </div>
        <div class="log-welcome">选择店铺</div>
      </div>
    </div>
    <div class="log-container">
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="name" label="店铺名称" width="180" />
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_valid == 'true'" type="success"> 启用 </el-tag>
            <el-tag v-else-if="scope.row.is_valid == 'delete'" type="danger"> 废弃 </el-tag>
            <el-tag v-else type="info"> 禁用 </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="店铺地址">
          <template slot-scope="scope">
            {{ scope.row.store_address }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created | datetime('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              :disabled="scope.row.is_valid == 'delete'"
              @click="selectDistributor(scope.row)"
            >
              进入店铺
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import { getDistributorList } from '@/api/marketing'
import { shopLoginSelectShopId } from '@/api/company'
import { VERSION_STANDARD } from '@/utils'
export default {
  data() {
    const system = VERSION_STANDARD() ? 'onex' : 'ecshopx'
    const brand = require(`@/assets/img/${system}/logo.jpg`)
    return {
      loading: true,
      brand: brand,
      login_bg: '',
      list: []
    }
  },
  mounted() {
    console.log('-----2')
    getDistributorList({ page: 1, pageSize: 100, is_all: true }).then(response => {
      if (response.data.data.total_count === 1) {
        this.selectDistributor(response.data.data.list[0])
      } else {
        this.list = response.data.data.list
        this.loading = false
      }
    })

    // this.brand = require('@/assets/img/' + this.companyBrandImg + '/logo.svg')
  },
  methods: {
    selectDistributor(data) {
      shopLoginSelectShopId({ set_distributor_id: data.distributor_id }).then(res => {
        if (res.data.data.status) {
          this.$store.dispatch('setShopId', data.distributor_id)
          window.location.href = '/'
          // console.log(this.$store.getters.menus)
          // this.$router.push({ path: this.$store.getters.menus[0].children[0].url })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
body {
  background: #fff;
}
.log-header {
  padding: 20px 0;
  background: #fff;
}
.brand {
  display: inline-block;
  width: 150px;
  vertical-align: middle;
}
.brand img {
  width: 100%;
  height: auto;
}
.log-welcome {
  display: inline-block;
  padding-left: 24px;
  margin-left: 24px;
  border-left: 1px solid #efefef;
  vertical-align: middle;
}
.log-body {
  padding: 118px 0;
  background-size: cover;
}
.log-img {
  float: left;
  width: 360px;
  padding-top: 5px;
  padding-left: 50px;
}
.log-img img {
  width: 100%;
  height: auto;
}
.log-container {
  width: 900px;
  margin: 0 auto;
}
.log-container::after {
  display: table;
  clear: both;
  content: '';
}
.login-log-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)*/
  float: right;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  width: 290px;
  padding: 0px 35px 15px 35px;
  background: #fff;
  //border: 1px solid #eaeaea;
  .title {
    margin: 0px auto 35px auto;
    text-align: center;
    color: #505458;
    position: relative;
    font-size: 18px;
  }
  .remember {
    // margin: 0px 0px 35px 0px;
    float: left;
  }
  .log-opr {
    margin-bottom: 10px;
  }
  .signup {
    color: #ff5000;
    font-size: 14px;
    position: absolute;
    right: 0;
    line-height: 27px;
    &:hover {
      text-decoration: underline;
    }
  }
  .forget-pwd {
    float: right;
    &:hover {
      text-decoration: underline;
    }
  }
}
.el-form-item {
  margin-bottom: 30px;
}
.log-footer {
  color: #999;
  text-align: center;
  margin-top: 30px;
  a {
    color: #999;
    margin: 0 5px;
    &:hover {
      color: #ff5000;
    }
  }
}
.login-type-tab {
  float: right;
}
</style>
<style lang="scss">
.log-body {
  .el-input {
    .el-input__inner {
      height: 38px;
    }
  }
}
</style>
