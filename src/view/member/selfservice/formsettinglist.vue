<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
</style>

<template>
  <SpPage>
    <template v-if="$route.path.indexOf('detail') === -1 && $route.path.indexOf('editor') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onReset">
        <SpFilterFormItem prop="form_element" :label="$t('1ad8a87f.921962')">
          <el-select
            v-model="params.form_element"
            :placeholder="$t('c831a478.c2dba8')"
            style="width: 100%"
          >
            <el-option
              v-for="item in formElement"
              :key="item.value"
              :label="$t(item.nameKey)"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>

        <SpFilterFormItem prop="field_title" :label="$t('1ad8a87f.eaaa50')">
          <el-input
            v-model="params.field_title"
            :placeholder="$t('c831a478.32c65d')"
            style="width: 100%"
          />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addElement">
          {{ $t('1ad8a87f.a8b6e4') }}
        </el-button>
      </div>

      <el-tabs v-model="params.is_valid" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="$t(item.nameKey)"
          :name="item.activeName"
        >
          <el-table v-loading="loading" border :data="tableList" :height="wheight - 280">
            <el-table-column :label="$t('8da83775.2b6bc0')" width="130">
              <template slot-scope="scope">
                <router-link
                  class="el-icon-edit"
                  :to="{ path: matchRoutePath('editor'), query: { id: scope.row.id } }"
                />
                <i
                  class="el-icon-zoom-in"
                  style="margin: 0px 10px"
                  @click="preview(scope.$index, scope.row)"
                />
                <i
                  v-if="scope.row.status == 1"
                  class="mark el-icon-delete"
                  style="color: #ff5000"
                  @click="deleteAction(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="id" :label="$t('1ad8a87f.b718ad')" width="50" />
            <el-table-column prop="field_title" :label="$t('c831a478.32c65d')" width="250" />
            <el-table-column prop="field_name" :label="$t('1ad8a87f.3a7c96')" width="200" />
            <el-table-column prop="form_element" :label="$t('1ad8a87f.e1e080')" width="100">
              <template slot-scope="scope">
                {{ getElementTypeLabel(scope.row.form_element) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('1ad8a87f.9e322a')">
              <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.options" :key="index">
                  {{ item.value }}</span
                >
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog :visible.sync="dialogVisible">
        <el-form ref="dataInfo" label-width="200px" label-position="left" class="demo-ruleForm">
          <el-form-item :label="dataInfo.field_title">
            <el-col v-if="dataInfo.form_element == 'text'" :span="12">
              <el-input :placeholder="$t('1ad8a87f.0a71fc')" />
            </el-col>
            <el-col v-if="dataInfo.form_element == 'textarea'" :span="12">
              <el-input type="textarea" :placeholder="$t('1ad8a87f.059727')" />
            </el-col>
            <el-col v-if="dataInfo.form_element == 'number'" :span="12">
              <el-input-number type="textarea" placeholder="55.55" />
            </el-col>
            <el-col v-if="dataInfo.form_element == 'image'" :span="12">
              <el-upload class="avatar-uploader" action="" :show-file-list="false">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-col>
            <el-col v-if="dataInfo.form_element == 'radio'" :span="12">
              <el-radio-group>
                <el-radio v-for="(item, index) in dataInfo.options" :key="index" :label="3">
                  {{ item.value }}
                </el-radio>
              </el-radio-group>
            </el-col>
            <el-col v-if="dataInfo.form_element == 'checkbox'" :span="12">
              <el-checkbox-group>
                <el-checkbox
                  v-for="(item, index) in dataInfo.options"
                  :key="index"
                  label="item.value"
                >
                  {{ item.value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col v-if="dataInfo.form_element == 'select'" :span="12">
              <el-select :placeholder="$t('ac2a6290.708c9d')">
                <el-option
                  v-for="item in dataInfo.options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col v-if="dataInfo.form_element == 'date'" :span="12">
              <el-date-picker v-model="value1" type="date" :placeholder="$t('1ad8a87f.2bebdd')" />
            </el-col>
            <el-col v-if="dataInfo.form_element == 'time'" :span="12">
              <el-time-picker
                v-model="value2"
                arrow-control
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                :placeholder="$t('1ad8a87f.c7d809')"
              />
            </el-col>
            <el-col v-if="dataInfo.form_element == 'area'" :span="12">
              <el-cascader
                v-model="value"
                :options="options"
                :props="{ expandTrigger: 'hover' }"
                @change="handleChange"
              />
            </el-col>
          </el-form-item>
        </el-form>
      </el-dialog>
    </template>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { deleteSetting } from '@/api/selfhelpform'
import { pageMixin } from '@/mixins'
export default {
  mixins: [pageMixin],
  provide() {
    return {
      refresh: this.fetchList
    }
  },
  data() {
    const initialParams = {
      form_element: undefined,
      field_title: undefined,
      is_valid: '1'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      isEdit: false,
      imageUrl: '',
      tabList: [
        { nameKey: '1ad8a87f.8bbd77', activeName: '1' },
        { nameKey: '1ad8a87f.0a2515', activeName: '2' }
      ],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      dialogVisible: false,
      dataInfo: {},
      formElement: [
        { nameKey: '1ad8a87f.5ac57c', value: 'text' },
        { nameKey: '1ad8a87f.d2362d', value: 'textarea' },
        { nameKey: '1ad8a87f.f96dab', value: 'radio' },
        { nameKey: '8da83775.db98f8', value: 'checkbox' },
        { nameKey: '1ad8a87f.ad61d4', value: 'select' },
        { nameKey: '1ad8a87f.de1a35', value: 'date' },
        { nameKey: '1ad8a87f.f127e4', value: 'area' },
        { nameKey: '1ad8a87f.55d479', value: 'number' },
        { nameKey: 'c831a478.820ef5', value: 'idcard' },
        { nameKey: 'c831a478.607b17', value: 'otherfile' }
      ],
      options: [
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            },
            {
              value: 'sketch',
              label: 'Sketch Templates'
            },
            {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    getStatus(val) {
      if (val) {
        this.fetchList()
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    getElementTypeLabel(value) {
      const item = this.formElement.find((i) => i.value === value)
      return item ? this.$t(item.nameKey) : value
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.fetchList()
      })
    },
    onReset() {
      this.params = { ...this.initialParams }
      this.onSearch()
    },
    addElement() {
      // 添加商品
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editAction(index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/member/selfservice/formsettingadd/' + row.id })
    },
    preview(index, row) {
      // 预览弹框
      this.dialogVisible = true
      this.dataInfo = row
    },
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.getSettingList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },

    deleteAction(index, row) {
      this.$confirm(this.$t('1ad8a87f.7d875a'), this.$t('8da83775.02d981'), {
        confirmButtonText: this.$t('8da83775.38cf16'),
        cancelButtonText: this.$t('8da83775.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteSetting(row.id)
            .then((response) => {
              this.tableList.splice(index, 1)
              this.$message({
                message: this.$t('1ad8a87f.2f3028'),
                type: 'success',
                duration: 5 * 1000
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$t('1ad8a87f.4f7bce')
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('1ad8a87f.2111cc')
          })
        })
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    handleTabClick(tab, event) {
      this.onSearch()
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
