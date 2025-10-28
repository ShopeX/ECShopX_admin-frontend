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
    <div>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="企业" name="show_corp">
          <corp_template v-if="show_corp" :active-name="activeName" />
        </el-tab-pane>
        <el-tab-pane label="个体户" name="show_solo">
          <solo_template v-if="show_solo" :active-name="activeName" />
        </el-tab-pane>
        <el-tab-pane label="个人" name="show_user">
          <user_template v-if="show_user" :active-name="activeName" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <router-view />
  </div>
</template>

<script>
import corp_template from './applytype/corp.vue'
import solo_template from './applytype/solo.vue'
import user_template from './applytype/user.vue'
export default {
  components: {
    corp_template,
    solo_template,
    user_template
  },
  data() {
    return {
      activeName: 'show_corp',
      show_corp: true,
      show_solo: false,
      show_user: false
    }
  },
  methods: {
    handleClick() {
      if (this.activeName == 'show_corp') {
        this.show_corp = true
        this.show_solo = false
        this.show_user = false
      } else if (this.activeName == 'show_solo') {
        this.show_corp = false
        this.show_solo = true
        this.show_user = false
      } else if (this.activeName == 'show_user') {
        this.show_corp = false
        this.show_solo = false
        this.show_user = true
      }
    }
  }
}
</script>
