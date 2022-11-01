<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      label="标准版"
      name="standard"
    >
      <el-card>
        <el-table :data="list.standard">
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.row, 'standard')"
              >
                配置
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            width="150"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="300"
          >
            <template slot-scope="scope">
              <div>
                <el-tag
                  v-if="scope.row.status == true || scope.row.status == 'true'"
                  type="success"
                >
                  开启
                </el-tag>
                <el-tag
                  v-else-if="scope.row.status == false || scope.row.status == 'false'"
                  type="danger"
                >
                  关闭
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane
      label="触屏版"
      name="touch"
      @tab-click="handleClick"
    >
      <el-card>
        <el-table :data="list.touch">
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleEdit(scope.row, 'touch')"
              >
                配置
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            width="150"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="300"
          >
            <template slot-scope="scope">
              <div>
                <el-tag
                  v-if="scope.row.status == true || scope.row.status == 'true'"
                  type="success"
                >
                  开启
                </el-tag>
                <el-tag
                  v-else-if="scope.row.status == false || scope.row.status == 'false'"
                  type="danger"
                >
                  关闭
                </el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <!--修改-->
    <sideBar
      :visible.sync="show_sideBar"
      :title="'配置'"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="app_id">
          <el-input v-model="form.app_id" />
        </el-form-item>
        <el-form-item label="secret">
          <el-input v-model="form.secret" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="statusChange(form)"
          >
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </el-tabs>
</template>
<script>
import sideBar from '@/components/element/sideBar'
import { getTrustLoginList, saveStatusSetting } from '../../../api/trustlogin'
export default {
  components: {
    sideBar
  },
  data () {
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
  mounted () {
    this.getConfig()
  },
  methods: {
    handleClick () {
      this.getConfig()
    },
    getConfig () {
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
    handleEdit (data, loginversion) {
      this.show_sideBar = true
      this.form.name = data.name
      if (data.status == 'true') {
        this.form.status = true
      }
      if (data.status == 'false') {
        this.form.status = false
      }
      this.form.app_id = data.app_id
      this.form.secret = data.secret
      this.form.type = data.type
      this.form.loginversion = loginversion
    },
    statusChange (data) {
      console.log(data)

      saveStatusSetting(data)
        .then((res) => {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.show_sideBar = false
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '保存失败'
          })
        })
    },
    onSubmit () {
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
            message: '保存成功'
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
