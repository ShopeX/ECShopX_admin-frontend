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
        <SpFilterFormItem prop="tem_name" :label="$t('d3f8464b.fad9b7')">
          <el-input v-model="params.tem_name" :placeholder="$t('d3f8464b.a5d1c5')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="tem_type" :label="$t('d3f8464b.719bc8')">
          <el-select
            v-model="params.tem_type"
            :placeholder="$t('d3f8464b.bfd708')"
            style="width: 100%"
          >
            <el-option key="basic_entry" :label="$t('d3f8464b.c94d96')" value="basic_entry" />
            <el-option
              key="ask_answer_paper"
              :label="$t('0493712c.859b34')"
              value="ask_answer_paper"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addTemplate">
          {{ $t('d3f8464b.6fef15') }}
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
            <el-table-column :label="$t('8da83775.2b6bc0')" width="150">
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
            <el-table-column prop="id" :label="$t('1ad8a87f.b718ad')" width="100" />
            <el-table-column prop="tem_name" :label="$t('d3f8464b.a5d1c5')" width="300" />
            <el-table-column prop="tem_type" :label="$t('d3f8464b.bfd708')" width="300" />
            <el-table-column prop="status" :label="$t('d3f8464b.3fea7c')" width="100" />
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
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="50">
        <el-alert v-if="headerTitle" :title="headerTitle" type="info" :closable="false" /><br>
        <el-card v-for="(carditem, index) in dialogContent" :key="index">
          <div slot="header">
            {{ carditem.title }}
          </div>
          <el-form
            ref="carditem.formdata"
            label-width="100px"
            label-position="right"
            class="demo-ruleForm"
          >
            <el-form-item
              v-for="(item, index) in carditem.formdata"
              :key="index"
              :label="item.field_title"
            >
              <el-col v-if="item.form_element == 'text'" :span="12">
                <el-input :placeholder="$t('1ad8a87f.0a71fc')" disabled />
              </el-col>
              <el-col v-if="item.form_element == 'number'" :span="12">
                <el-input placeholder="1" size="mini" disabled style="width: 120px" />
                <span class="frm-tips"> {{ $t('d3f8464b.6d389f') }}</span>
              </el-col>
              <el-col v-if="item.form_element == 'textarea'" :span="12">
                <el-input type="textarea" :placeholder="$t('1ad8a87f.059727')" disabled :rows="5" />
              </el-col>
              <el-col v-if="item.form_element == 'radio'" :span="12">
                <el-radio-group disabled>
                  <el-radio v-for="(item, index) in item.options" :key="index" :label="3">
                    {{ item.value }}
                  </el-radio>
                </el-radio-group>
              </el-col>
              <el-col v-if="item.form_element == 'checkbox'" :span="12">
                <el-checkbox-group disabled>
                  <el-checkbox
                    v-for="(item, index) in item.options"
                    :key="index"
                    label="item.value"
                  >
                    {{ item.value }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
              <el-col v-if="item.form_element == 'select'" :span="12">
                <el-select :placeholder="$t('ac2a6290.708c9d')">
                  <el-option
                    v-for="item in item.options"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value"
                    disabled
                  />
                </el-select>
              </el-col>
            </el-form-item>
          </el-form>
        </el-card>
        <el-alert v-if="bottomTitle" :title="bottomTitle" type="info" :closable="false" />
        <el-button type="primary" disabled>{{ $t('d3f8464b.28dda2') }}</el-button>
      </el-dialog>
    </template>
    <router-view />
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { deleteTemplate } from '@/api/selfhelpform'
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
      tem_name: undefined,
      tem_type: undefined,
      is_valid: '1'
    }
    return {
      initialParams,
      params: {
        ...initialParams
      },
      isEdit: false,
      tabList: [
        { nameKey: 'd3f8464b.9ea5a5', activeName: '1' },
        { nameKey: 'd3f8464b.d3c88c', activeName: '2' }
      ],
      ItemsDetailVisible: false,
      itemsDetailData: {},
      loading: false,
      dialogVisible: false,
      dialogContent: [],
      headerTitle: '',
      bottomTitle: '',
      dialogTitle: ''
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
    getParams() {
      let params = {
        ...this.params
      }
      return params
    },
    addTemplate() {
      // 添加商品
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    editTemplateAction(index, row) {
      // 编辑商品弹框
      this.$router.push({ path: '/member/selfservice/formtemplateadd/' + row.id })
    },
    preview(index, row) {
      this.dialogVisible = true
      this.dialogTitle = row.tem_name + ' ( ' + this.$t('d3f8464b.5fad96') + ' )'
      this.dialogContent = row.content
      this.headerTitle = row.header_title
      this.bottomTitle = row.bottom_title
    },
    async fetchList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.getParams()
      }
      const { list, total_count } = await this.$api.selfhelpform.getTemplateList(params)
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },
    deleteAction(index, row) {
      this.$confirm(this.$t('d3f8464b.01602a'), this.$t('8da83775.02d981'), {
        confirmButtonText: this.$t('8da83775.38cf16'),
        cancelButtonText: this.$t('8da83775.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteTemplate(row.id)
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
.el-dialog {
  width: 30%;
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
