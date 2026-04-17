<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane :label="$t('b64b502c.de28d2')" name="standard">
        <el-card>
          <el-table :data="list.standard">
            <el-table-column :label="$t('8da83775.2b6bc0')" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row, 'standard')">
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
      </el-tab-pane>
      <el-tab-pane :label="$t('b64b502c.c5f087')" name="touch" @tab-click="handleClick">
        <el-card>
          <el-table :data="list.touch">
            <el-table-column :label="$t('8da83775.2b6bc0')" width="150">
              <template slot-scope="scope">
                <el-button type="text" @click="handleEdit(scope.row, 'touch')">
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
      </el-tab-pane>
      <!--修改-->
      <sideBar :visible.sync="show_sideBar" :title="$t('b64b502c.224e2c')">
        <el-form>
          <el-form-item :label="$t('b64b502c.d7ec2d')">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="app_id">
            <el-input v-model="form.app_id" />
          </el-form-item>
          <el-form-item label="secret">
            <el-input v-model="form.secret" />
          </el-form-item>
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
    </el-tabs>
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
      activeName: 'standard',
      loading: false,
      list: [],
      form: {
        name: '',
        app_id: '',
        secret: '',
        status: false,
        loginversion: 'standard'
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    handleClick() {
      this.getConfig()
    },
    getConfig() {
      this.loading = true
      getTrustLoginList().then((res) => {
        this.list = res.data.data
        for (var i = res.data.data.length - 1; i >= 0; i--) {
          if (this.list[i].status == 'true') {
            this.list[i].status = true
          }
          if (this.list[i].status == 'false') {
            this.list[i].status = false
          }
        }

        this.loading = false
      })
    },
    // 编辑
    handleEdit(data, loginversion) {
      this.show_sideBar = true
      this.form.name = data.name

      this.form.status = data.status

      this.form.app_id = data.app_id
      this.form.secret = data.secret
      this.form.type = data.type
      this.form.loginversion = loginversion
    },
    statusChange(data) {
      console.log(data)

      saveStatusSetting(data)
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('b64b502c.3b1083')
          })
          this.show_sideBar = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: this.$t('b64b502c.6de920')
          })
        })
    },
    onSubmit() {
      this.loading = true
      let query = {}
      if (this.activeName === 'standard') {
        query = this.standard_form
      } else {
        query = this.form
      }
      setstandardSetting(query)
        .then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('b64b502c.3b1083')
          })
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
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
