<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="memberReg">
    <SpPlatformTip v-if="!VERSION_SHUYUN()" h5 app alipay />
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="$t('8da83775.3a4128')" name="first">
        <el-card class="box-card">
          <div slot="header" class="between">
            <span>{{ $t('8da83775.d3c31d') }}</span>
            <div>
              <el-button v-if="!VERSION_SHUYUN()" type="primary" @click="showAddDialog()">
                {{ $t('8da83775.80e2ca') }}
              </el-button>
            </div>
          </div>
          <el-table v-loading="isLoading" :data="tableData">
            <el-table-column :label="$t('8da83775.d8c7e0')" prop="label" />
            <el-table-column :label="$t('8da83775.53c3dd')">
              <template slot-scope="scope">
                <el-switch
                  :value="!!scope.row.is_open"
                  :disabled="!!scope.row.is_must_start_required"
                  @change="
                    toggleStatus(
                      {
                        id: scope.row.id,
                        status: scope.row.is_open
                      },
                      1
                    )
                  "
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('8da83775.aba785')">
              <template slot-scope="scope">
                {{ getTypeLabel(scope.row.field_type) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('8da83775.9df451')" prop="alert_required_message" />
            <el-table-column :label="$t('8da83775.2b6bc0')">
              <template slot-scope="scope">
                <el-button type="text" @click="showAddDialog(scope.row)">
                  {{ $t('8da83775.95b351') }}
                </el-button>
                <el-button
                  v-if="!VERSION_SHUYUN() && !scope.row.is_default"
                  type="text"
                  class="delete"
                  @click="deleteField(scope.row)"
                >
                  {{ $t('8da83775.2f4aad') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div class="pagination">
          <el-pagination
            v-if="total_count > 0"
            small
            layout="prev, pager, next"
            :total="total_count"
            :page-size="pageParam.page_size"
            @current-change="pageChange"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('8da83775.f33fb2')" class="paneSecond" name="second">
        <div class="mainSecond">
          <el-form
            ref="privacy"
            :model="privacyForm"
            :rules="rules"
            :label-position="formLabelPosition"
            label-width="100px"
          >
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item :label="$t('8da83775.206057')" prop="member_register.title">
                    <el-input
                      v-model="privacyForm.member_register.title"
                      :placeholder="$t('8da83775.206057')"
                      style="width: 500px"
                      show-word-limit
                      maxlength="30"
                    />
                  </el-form-item>
                  <el-form-item :label="$t('8da83775.3c0397')" prop="member_register.content">
                    <SpRichText v-model="privacyForm.member_register.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item :label="$t('8da83775.f0002d')" prop="privacy.title">
                    <el-input
                      v-model="privacyForm.privacy.title"
                      :placeholder="$t('8da83775.f0002d')"
                      style="width: 500px"
                      show-word-limit
                      maxlength="30"
                    />
                  </el-form-item>
                  <el-form-item :label="$t('8da83775.cc953a')" prop="privacy.content">
                    <SpRichText v-model="privacyForm.privacy.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-form>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveContent"> {{ $t('8da83775.be5fbb') }} </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('8da83775.2d5360')" class="paneSecond" name="third">
        <div class="mainSecond">
          <el-form
            ref="medicine"
            :model="medicineForm"
            :rules="rules2"
            :label-position="formLabelPosition"
            label-width="100px"
          >
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item :label="$t('8da83775.78423a')" prop="title">
                    <el-input
                      v-model="medicineForm.title"
                      :placeholder="$t('8da83775.78423a')"
                      style="width: 500px"
                    />
                  </el-form-item>
                  <el-form-item :label="$t('8da83775.78423a')" prop="content">
                    <SpRichText v-model="medicineForm.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-form>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveMedicineContent">
              {{ $t('8da83775.be5fbb') }}
            </el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="showAdd" :title="modalTitle" @close="cancelEdit">
      <el-form
        ref="editform"
        :model="editform"
        :rules="editformRules"
        class="editform"
        label-width="120px"
      >
        <el-form-item :label="$t('8da83775.9c6a53')" prop="label">
          <el-input v-model="editform.label" type="text" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item :label="$t('8da83775.aba785')">
          <el-select v-model="editform.field_type" @change="fieldTypeChange">
            <el-option
              v-for="item in formTypeList"
              :key="item.type"
              :label="$t(item.labelKey)"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="editform.field_type === 2" :label="$t('8da83775.b7d43b')" prop="range">
          <el-row class="rangRow">
            <el-col :span="11">
              <el-input v-model="editform.range.start" type="number" />
            </el-col>
            <el-col :span="2" style="text-align: center"> - </el-col>
            <el-col :span="11">
              <el-input v-model="editform.range.end" type="number" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="editform.field_type === 4 || editform.field_type === 5"
          :label="$t('8da83775.e7f1b8')"
          class="select"
          prop="select"
        >
          <el-input
            v-model="selectValue.label"
            :placeholder="$t('8da83775.2d711b')"
            type="text"
            show-word-limit
          >
            <template slot="append">
              <el-button type="primary" :disabled="!isSelectValue" @click="saveSelect">
                {{ $t('8da83775.e83a25') }}
              </el-button>
            </template>
          </el-input>
          <!-- <div class="tip">最多添加10条选项，注意添加顺序</div> -->
          <div class="tags">
            <el-tag
              v-for="(item, index) in editform.radio_list"
              :key="index"
              class="item"
              closable
              @close="handleRmoveTag(item)"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item :label="$t('8da83775.9df451')" prop="alert_required_message">
          <el-input
            v-model="editform.alert_required_message"
            type="text"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm"> {{ $t('8da83775.e83a25') }} </el-button>
          <el-button @click="cancelEdit"> {{ $t('8da83775.625fb2') }} </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </SpPage>
</template>
<script>
import {
  setMemberRegisterSetting,
  getMemberRegisterSetting,
  setMemberRegisterContentSetting,
  getRegForm,
  createRegForm,
  updateRegForm,
  deleteRegForm,
  toggleRegForm,
  getMemberFieldSetting,
  saveMemberFieldSetting
} from '@/api/member'
import { getRulesInfo, putRulesInfo } from '@/api/shop'

const typeList = [
  { name: '文本', type: 1, labelKey: '8da83775.97d076' },
  { name: '数字', type: 2, labelKey: '8da83775.55d479' },
  { name: '日期', type: 3, labelKey: '8da83775.4ff1e7' },
  { name: '单选', type: 4, labelKey: '8da83775.9fd1b7' },
  { name: '复选框', type: 5, labelKey: '8da83775.db98f8' },
  { name: '手机号', type: 6, labelKey: '8da83775.8098e2' }
]
export default {
  filters: {
    filterType(val) {
      const data = typeList.find((item) => item.type === val)
      return data ? data.name : ''
    }
  },
  data() {
    return {
      activeName: 'first',
      pageTitle: '',
      settingStatus: false,
      showAdd: false,
      isLoading: false,
      total_count: 0,
      // 单选/多选select编辑数据
      selectValue: {
        label: '',
        is_checked: 0
      },
      // 是否强制授权
      isMustAuth: false,
      // 表单类型选项列表
      formTypeList: typeList,
      // 页面数据
      pageParam: {
        page: 1,
        page_size: 10
      },
      // 表格数据
      tableData: [],
      // 修改及添加数据
      editform: {
        module_type: 1,
        label: '',
        field_type: 1,
        alert_required_message: '',
        is_required: 0,
        is_edit: 1,
        range: {
          start: '',
          end: ''
        },
        radio_list: []
      },
      privacyForm: {
        privacy: {
          title: '',
          content: ''
        },
        member_register: {
          title: '',
          content: ''
        }
      },
      modalTitle: '',
      medicineForm: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    editformRules() {
      return {
        label: [{ required: true, message: this.$t('8da83775.b91aba'), trigger: 'blur' }],
        alert_required_message: [
          { required: true, message: this.$t('8da83775.46ba1b'), trigger: 'blur' }
        ],
        range: [{ required: true, validator: this.validRange, trigger: 'blur' }],
        radio_list: [{ required: true, message: this.$t('8da83775.0c6dc4'), trigger: 'blur' }]
      }
    },
    rules() {
      return {
        'privacy.title': [{ required: true, message: this.$t('8da83775.6d1a0f'), trigger: 'blur' }],
        'member_register.title': [
          { required: true, message: this.$t('8da83775.6d1a0f'), trigger: 'blur' }
        ],
        'privacy.content': [
          { required: true, message: this.$t('8da83775.bb76f9'), trigger: 'blur' }
        ],
        'member_register.content': [
          { required: true, message: this.$t('8da83775.78e455'), trigger: 'blur' }
        ]
      }
    },
    rules2() {
      return {
        title: [{ required: true, message: this.$t('8da83775.b91aba'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('8da83775.4fa229'), trigger: 'blur' }]
      }
    },
    formLabelPosition() {
      const lang = this.$store?.state?.system?.lang
      return ['en', 'ar'].includes(lang) ? 'top' : ''
    },
    isSelectValue({ selectValue }) {
      return !!selectValue.label
    }
  },
  mounted() {
    this.pageTitle = this.$t('8da83775.d3c31d')
    this.getFormItems()
    this.getShopRules()
    this.getMemberFieldSetting()
  },
  methods: {
    validRange(rule, value, callback) {
      if (!value.start || !value.end || value.start >= value.end) {
        callback(new Error(this.$t('8da83775.96641a')))
      } else {
        callback()
      }
    },
    getTypeLabel(fieldType) {
      const item = typeList.find((i) => i.type === fieldType)
      return item ? this.$t(item.labelKey) : ''
    },
    //选择商品分页
    pageChange(val) {
      this.pageParam.page = val
      this.getFormItems()
    },

    // 获取配置表单
    async getFormItems(isInit = false) {
      this.isLoading = true
      if (isInit) {
        this.pageParam.page = 1
      }
      const { pageParam } = this
      const data = await getRegForm({
        module_type: 1,
        id: -1,
        ...pageParam
      })
      const { list = [], total_count } = data.data.data
      this.tableData = list
      this.isLoading = false
      this.total_count = total_count
    },
    // 获取商城协议
    async getShopRules() {
      const data = await getRulesInfo()
      const rules = Array.isArray(data.data.data) ? {} : data.data.data

      this.privacyForm.member_register = rules.member_register || {
        title: '',
        content: ''
      }
      this.privacyForm.privacy = rules.privacy || {
        title: '',
        content: ''
      }
      this.medicineForm = rules.ehospital_risk_informed || {
        title: '',
        content: ''
      }
    },
    // 保存编辑
    saveForm() {
      this.$refs.editform.validate(async (valid) => {
        if (valid) {
          if (!this.editform.id) {
            await createRegForm(this.editform)
          } else {
            await updateRegForm(this.editform)
          }
          this.getFormItems(true)
          this.cancelEdit()
        }
      })
    },
    // 取消编辑
    cancelEdit() {
      this.showAdd = false
      this.selectValue = {
        label: '',
        is_checked: 0
      }
      this.editform = {
        module_type: 1,
        label: '',
        field_type: 1,
        alert_required_message: '',
        is_required: 0,
        is_edit: 1,
        range: {
          start: '',
          end: ''
        },
        radio_list: []
      }
      this.modalTitle = ''
    },
    // 切换
    fieldTypeChange() {
      this.editform.radio_list = []
      this.selectValue = {
        label: '',
        is_checked: 0
      }
    },
    // 存储select单选数据
    saveSelect() {
      const { selectValue, editform } = this
      if (!selectValue.label) {
        this.$message({
          message: this.$t('8da83775.5117bc'),
          type: 'warning'
        })
        return
      }
      this.editform.radio_list.push(selectValue)
      this.selectValue = {
        label: '',
        is_checked: 0
      }
    },
    // 移除tag
    handleRmoveTag(tag) {
      const { editform } = this
      const { label } = tag
      const findIndex = editform.radio_list.findIndex((item) => item.label === label)
      editform.radio_list.splice(findIndex, 1)
    },
    // 显示添加
    showAddDialog(editInfo = {}) {
      if (editInfo.id) {
        const {
          id = '',
          module_type = 1,
          label = '',
          field_type = 1,
          alert_required_message = '',
          is_required = 0,
          is_edit = 1,
          range = {
            start: '',
            end: ''
          },
          validate_condition = []
        } = editInfo

        this.editform = {
          id,
          module_type,
          label,
          field_type,
          alert_required_message,
          is_required: 0,
          is_edit: 1,
          range,
          radio_list: [...validate_condition]
        }
        this.modalTitle = this.$t('8da83775.664d9f')
      } else {
        this.modalTitle = this.$t('8da83775.80e2ca')
      }
      this.showAdd = true
    },
    // 删除规则
    deleteField(data) {
      const { id } = data
      this.$confirm(this.$t('8da83775.22442b'), this.$t('8da83775.02d981'), {
        confirmButtonText: this.$t('8da83775.38cf16'),
        cancelButtonText: this.$t('8da83775.625fb2'),
        type: 'warning'
      }).then(async () => {
        await deleteRegForm({ id })
        this.$message({
          type: 'success',
          message: this.$t('8da83775.fc9bdd')
        })
        this.getFormItems(true)
      })
    },
    // 切换状态
    async toggleStatus(item, type) {
      const { id, status } = item
      await toggleRegForm({
        id,
        type,
        switch: status === 0 ? 1 : 0
      })
      this.getFormItems()
    },
    handleClick(tab, event) {
      const titleMap = {
        first: this.$t('8da83775.d3c31d'),
        second: this.$t('8da83775.f33fb2'),
        third: this.$t('8da83775.2d5360')
      }
      this.pageTitle = titleMap[this.activeName]
    },
    updateContent: function (data) {
      this.privacyForm.member_register.content = data
    },
    updatePrivacyAgreement: function (data) {
      this.privacyForm.privacy.content = data
    },
    async saveMedicineContent() {
      console.log(this.medicineForm)
      this.$refs['medicine'].validate((valid) => {
        if (valid) {
          putRulesInfo({
            data: [
              {
                type: 'ehospital_risk_informed',
                ...this.medicineForm
              }
            ]
          }).then((response) => {
            this.$message({
              message: this.$t('8da83775.3b1083'),
              type: 'success'
            })
            this.getShopRules('medicine')
          })
        }
      })
    },
    saveContent(type) {
      this.$refs['privacy'].validate((valid) => {
        if (valid) {
          putRulesInfo({
            data: [
              {
                type: 'privacy',
                ...this.privacyForm.privacy
              },
              {
                type: 'member_register',
                ...this.privacyForm.member_register
              }
            ]
          }).then((response) => {
            this.$message({
              message: this.$t('8da83775.3b1083'),
              type: 'success'
            })
            this.getShopRules()
          })
        }
      })
    },
    // 获取授权配置
    async getMemberFieldSetting() {
      const res = await getMemberFieldSetting()
      const { switch_first_auth_force_validation } = res.data.data
      this.isMustAuth = !!switch_first_auth_force_validation
    },
    async onChangeMustAuth() {
      await saveMemberFieldSetting({
        switch_first_auth_force_validation: this.isMustAuth ? 1 : 0
      })
    }
  }
}
</script>
<style scoped lang="scss">
.memberReg {
  width: 100%;
  height: 100%;
  .setting-header {
    background: #ecf5ff;
  }
  .box-card {
    width: 100%;
    .between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .pagination {
    text-align: center;
  }
  .editform {
    width: 50%;
    min-width: 400px;
  }
  .rangRow {
    margin-bottom: 0;
  }
  .delete {
    color: red;
  }
  .select {
    .tip {
      line-height: 20px !important;
      font-size: 12px;
      color: #999;
    }
    .tags {
      line-height: 20px !important;
      margin-top: 5px;
      .item {
        margin-bottom: 5px;
      }
    }
  }
  .mainSecond {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 50px;
    .section-footer {
      position: absolute;
      width: 100%;
      background: #fff;
      left: 0;
      bottom: 0;
    }
  }
}
</style>

<style lang="scss">
.memberReg {
  .vue-html5-editor {
    .toolbar {
      ul {
        li {
          .icon-image {
            display: none !important;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.content-container {
  box-sizing: border-box;

  .content-wrapper {
    height: 100%;
    box-sizing: border-box;
    .el-tabs {
      height: 100%;
      box-sizing: border-box;
      .el-tabs__content {
        box-sizing: border-box;
        height: calc(100% - 40px);
        .el-tab-pane {
          height: 100%;
          overflow-y: auto;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
