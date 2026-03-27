<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-card :header="$t('33477150.9a685d')">
    <el-form
      ref="form"
      :model="form"
      :label-position="labelPosition"
      label-width="80px"
      :rules="rules"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="$t('33477150.0bcf5a')" prop="shop_id">
            <el-input v-model="form.shop_id" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="App-key" prop="client_id">
            <el-input v-model="form.client_id" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('33477150.af65db')" prop="app_secret">
            <el-input v-model="form.app_secret" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="freight_type">
            <div class="padding-bottom">
              {{ $t('33477150.8b3191')
              }}<span class="frm-tips" style="display: inne-block; margin-left: 20px">{{
                $t('33477150.d70b38')
              }}</span>
            </div>
            <el-radio-group v-model="form.freight_type">
              <el-radio label="0">{{ $t('33477150.ec1ffa') }}</el-radio>
              <el-radio label="1">{{ $t('33477150.3f3e01') }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="online">
            <div class="padding-bottom">{{ $t('33477150.d53d61') }}</div>
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
            <div class="padding-bottom">{{ $t('33477150.780afe') }}</div>
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
      <el-button type="primary" @click="save">{{ $t('33477150.ed7526') }}</el-button>
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
      }
    }
  },
  computed: {
    rules() {
      return {
        shop_id: [{ required: true, message: this.$t('33477150.59f65b') }],
        client_id: [{ required: true, message: this.$t('33477150.4c3c41') }],
        app_secret: [{ required: true, message: this.$t('33477150.4e40f3') }]
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
      }).then((res) => {
        console.log('saveShansongInfo', res)
        if (res.status === 200) {
          this.$message.success(this.$t('33477150.84a218'))
          return
        }
      })
    },
    getDetail: function () {
      getShansongInfo().then((res) => {
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
