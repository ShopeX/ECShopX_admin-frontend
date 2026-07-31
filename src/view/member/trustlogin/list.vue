<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-card>
      <el-table :data="list" data-testid="member-trustlogin-table">
        <el-table-column :label="$t('8da83775.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">
              {{ $t('b64b502c.224e2c') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('b64b502c.d7ec2d')" width="150">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('b64b502c.3fea7c')" width="300">
          <template slot-scope="scope">
            <div>
              <el-tag
                v-if="scope.row.status == true || scope.row.status == 'true'"
                type="success"
              >
                {{ $t('b64b502c.cc42dd') }}
              </el-tag>
              <el-tag
                v-else-if="scope.row.status == false || scope.row.status == 'false'"
                type="danger"
              >
                {{ $t('b64b502c.b15d91') }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <sideBar :visible.sync="show_sideBar" :title="$t('b64b502c.224e2c')">
      <el-form>
        <el-form-item :label="$t('b64b502c.d7ec2d')">
          <el-input v-model="form.name" />
        </el-form-item>
        <template v-if="form.type === 'apple'">
          <el-form-item :label="$t('b64b502c.f8a201')">
            <el-input
              v-model="form.app_id"
              placeholder="ecshopx-shop.ex-sandbox.com"
            />
          </el-form-item>
          <el-form-item :label="$t('b64b502c.f8a202')">
            <el-input v-model="form.apple_team_id" placeholder="J78N572P2G" />
          </el-form-item>
          <el-form-item :label="$t('b64b502c.f8a203')">
            <el-input v-model="form.apple_key_id" placeholder="V6MAPA8UM5" />
          </el-form-item>
          <el-form-item :label="$t('b64b502c.f8a204')">
            <el-input
              v-model="form.apple_private_key"
              type="textarea"
              :rows="10"
              :placeholder="$t('b64b502c.f8a205')"
              data-testid="member-trustlogin-apple-private-key"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('b64b502c.f8a208')">
            <el-input v-model="form.app_id" />
          </el-form-item>
          <el-form-item :label="$t('b64b502c.f8a209')">
            <el-input v-model="form.secret" />
          </el-form-item>
          <el-form-item :label="$t('b64b502c.f8a206')">
            <el-input
              v-model="form.extra_config"
              type="textarea"
              :rows="6"
              :placeholder="$t('b64b502c.f8a207')"
              data-testid="member-trustlogin-extra-config"
            />
          </el-form-item>
        </template>
        <el-form-item :label="$t('b64b502c.3fea7c')">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="statusChange(form)">
            {{ $t('b64b502c.939d53') }}
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </SpPage>
</template>
<script>
import sideBar from '@/components/element/sideBar'
import { getTrustLoginList, saveStatusSetting } from '../../../api/trustlogin'
export default {
  components: {
    sideBar
  },
  data() {
    return {
      loading: false,
      show_sideBar: false,
      list: [],
      form: {
        name: '',
        app_id: '',
        secret: '',
        extra_config: '',
        apple_team_id: '',
        apple_key_id: '',
        apple_private_key: '',
        status: false,
        loginversion: 'touch',
        type: ''
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      this.loading = true
      getTrustLoginList().then((res) => {
        const payload = res.data.data || { touch: [] }
        this.list = Array.isArray(payload.touch) ? payload.touch : []
        this.list.forEach((row) => {
          if (row.status === 'true') row.status = true
          if (row.status === 'false') row.status = false
          if (row.extra_config === undefined || row.extra_config === null) {
            row.extra_config = ''
          }
        })
        this.loading = false
      })
    },
    parseExtraConfig(extraConfig) {
      if (!extraConfig) {
        return {}
      }
      if (typeof extraConfig === 'object') {
        return extraConfig
      }
      try {
        const parsed = JSON.parse(extraConfig)
        return parsed && typeof parsed === 'object' ? parsed : {}
      } catch (e) {
        return {}
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.form.name = data.name
      this.form.status = data.status
      this.form.app_id = data.app_id
      this.form.secret = data.secret
      this.form.type = data.type
      this.form.loginversion = 'touch'
      const extra = this.parseExtraConfig(data.extra_config || '')
      this.form.apple_team_id = extra.team_id || ''
      this.form.apple_key_id = extra.key_id || ''
      this.form.apple_private_key =
        extra.private_key && extra.private_key !== '***' ? extra.private_key : ''
      this.form.extra_config =
        data.type === 'apple' ? '' : data.extra_config || ''
    },
    buildAppleExtraConfigPayload() {
      return {
        team_id: String(this.form.apple_team_id || '').trim(),
        key_id: String(this.form.apple_key_id || '').trim(),
        private_key: String(this.form.apple_private_key || '').trim()
      }
    },
    validateAppleForm() {
      if (!String(this.form.app_id || '').trim()) {
        return this.$t('b64b502c.f8a20a')
      }
      const extra = this.buildAppleExtraConfigPayload()
      if (!extra.team_id || !extra.key_id) {
        return this.$t('b64b502c.f8a20b')
      }
      if (!extra.private_key) {
        return this.$t('b64b502c.f8a20c')
      }
      if (!extra.private_key.includes('BEGIN PRIVATE KEY')) {
        return this.$t('b64b502c.f8a20d')
      }
      return ''
    },
    statusChange(data) {
      const payload = { ...data }
      if (data.type === 'apple') {
        const error = this.validateAppleForm()
        if (error) {
          this.$message.error(error)
          return
        }
        payload.extra_config = this.buildAppleExtraConfigPayload()
        payload.secret = ''
        delete payload.apple_team_id
        delete payload.apple_key_id
        delete payload.apple_private_key
      }
      saveStatusSetting(payload)
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$t('b64b502c.3b1083')
          })
          this.show_sideBar = false
          this.getConfig()
        })
        .catch((err) => {
          const msg =
            err?.data?.message ||
            err?.message ||
            this.$t('b64b502c.6de920')
          this.$message.error(msg)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 10px;
  .frm-tips {
    color: #ff0000;
  }
}
</style>
