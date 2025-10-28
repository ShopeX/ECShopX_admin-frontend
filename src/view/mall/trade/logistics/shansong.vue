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
  <el-card header="闪送配置">
    <el-form
      ref="form"
      :model="form"
      :label-position="labelPosition"
      label-width="80px"
      :rules="rules"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="商户ID" prop="shop_id">
            <el-input v-model="form.shop_id" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="App-key" prop="client_id">
            <el-input v-model="form.client_id" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="App-密钥" prop="app_secret">
            <el-input v-model="form.app_secret" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="freight_type">
            <div class="padding-bottom">
              运费承担方<span class="frm-tips" style="display: inne-block; margin-left: 20px"
                >买家承担请保证商品规格数据准确性</span
              >
            </div>
            <el-radio-group v-model="form.freight_type">
              <el-radio label="0"> 商家承担 </el-radio>
              <el-radio label="1"> 买家承担 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="online">
            <div class="padding-bottom">是否上线</div>
            <el-switch
              v-model="form.online"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="is_open">
            <div class="padding-bottom">是否开启</div>
            <el-switch
              v-model="form.is_open"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer-container">
      <el-button type="primary" @click="save"> 保存配置 </el-button>
    </div>
  </el-card>
</template>

<script>
import GlobalFooter from '@/components/global_footer'
import { getShansongInfo, saveShansongInfo } from '@/api/logistics'

export default {
  components: {
    GlobalFooter
  },
  data() {
    return {
      labelPosition: 'top',
      form: {
        is_open: 0,
        shop_id: '',
        client_id: '',
        app_secret: '',
        online: 0,
        freight_type: '1'
      },
      rules: {
        shop_id: [{ required: true, message: '请输入商户ID' }],
        client_id: [{ required: true, message: '请输入App-key' }],
        app_secret: [{ required: true, message: '请输入App-密钥' }]
      }
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    save: function () {
      saveShansongInfo({
        ...this.form
      }).then(res => {
        console.log('saveShansongInfo', res)
        if (res.status === 200) {
          this.$message.success('同城配设置成功！')
          return
        }
      })
    },
    getDetail: function () {
      getShansongInfo().then(res => {
        const {
          data: { data }
        } = res
        if (data.shop_id) {
          this.form = data
          this.form.freight_type = data.freight_type ? '1' : '0'
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.cunstom_required {
  &:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.padding-bottom {
  padding-bottom: 10px;
}
.flex-center {
  display: flex;
  align-items: center;
}
</style>
