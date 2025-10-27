<template>
  <div class="memberReg">
    <SpPlatformTip h5 app alipay />
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="注册项配置" name="first">
        <el-card class="box-card">
          <div slot="header" class="between">
            <span>会员中心个人信息录入项配置</span>

            <div>
              <el-button type="primary" @click="showAddDialog()"> 新增配置 </el-button>
              <!-- <label>初次授权时强制填写</label>
              <el-switch v-model="isMustAuth" @change="onChangeMustAuth" /> -->
            </div>
          </div>
          <el-table v-loading="isLoading" :data="tableData">
            <el-table-column label="信息" prop="label" />
            <el-table-column label="是否启用">
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
            <!-- <el-table-column label="必填">
              <template slot-scope="scope">
                <el-switch
                  :value="!!scope.row.is_required"
                  :disabled="!!scope.row.is_must_start_required"
                  @change="
                    toggleStatus(
                      {
                        id: scope.row.id,
                        status: scope.row.is_required
                      },
                      2
                    )
                  "
                />
              </template>
            </el-table-column>
            <el-table-column label="可修改">
              <template slot-scope="scope">
                <el-switch
                  :value="!!scope.row.is_edit"
                  @change="
                    toggleStatus(
                      {
                        id: scope.row.id,
                        status: scope.row.is_edit
                      },
                      3
                    )
                  "
                />
              </template>
            </el-table-column> -->
            <el-table-column label="信息格式">
              <template slot-scope="scope">
                {{ scope.row.field_type | filterType }}
              </template>
            </el-table-column>
            <el-table-column label="提示文案" prop="alert_required_message" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="showAddDialog(scope.row)"> 编辑 </el-button>
                <el-button
                  v-if="!scope.row.is_default"
                  type="text"
                  class="delete"
                  @click="deleteField(scope.row)"
                >
                  删除
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
      <el-tab-pane label="注册协议与隐私政策配置" class="paneSecond" name="second">
        <div class="mainSecond">
          <el-form ref="privacy" :model="privacyForm" :rles="rules" label-width="100px">
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item label="注册协议标题" prop="member_register.title">
                    <el-input
                      v-model="privacyForm.member_register.title"
                      placeholder="注册协议标题"
                      style="width: 500px"
                      show-word-limit
                      maxlength="30"
                    />
                  </el-form-item>
                  <el-form-item label="注册协议" prop="member_register.content">
                    <SpRichText v-model="privacyForm.member_register.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item label="隐私政策标题" prop="privacy.title">
                    <el-input
                      v-model="privacyForm.privacy.title"
                      placeholder="隐私政策标题"
                      style="width: 500px"
                      show-word-limit
                      maxlength="30"
                    />
                  </el-form-item>
                  <el-form-item label="隐私政策" prop="privacy.content">
                    <SpRichText v-model="privacyForm.privacy.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-form>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveContent"> 保存 </el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="互联网诊疗风险告知及知情同意书配置" class="paneSecond" name="third">
        <div class="mainSecond">
          <el-form ref="medicine" :model="medicineForm" :rules="rules2" label-width="100px">
            <div class="section-white content-padded">
              <el-card class="box-card">
                <div class="text item">
                  <el-form-item label="互联网诊疗风险告及知情同意书" prop="title">
                    <el-input
                      v-model="medicineForm.title"
                      placeholder="互联网诊疗风险告及知情同意书"
                      style="width: 500px"
                    />
                  </el-form-item>
                  <el-form-item label="互联网诊疗风险告及知情同意书" prop="content">
                    <SpRichText v-model="medicineForm.content" />
                  </el-form-item>
                </div>
              </el-card>
            </div>
          </el-form>
          <div class="section-footer with-border content-center">
            <el-button type="primary" @click="saveMedicineContent"> 保存 </el-button>
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
        <el-form-item label="配置标题" prop="label">
          <el-input v-model="editform.label" type="text" maxlength="9" show-word-limit />
        </el-form-item>
        <el-form-item label="信息格式">
          <el-select v-model="editform.field_type" @change="fieldTypeChange">
            <el-option
              v-for="item in formTypeList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="editform.field_type === 2" label="数值范围" prop="range">
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
          label="选项内容"
          class="select"
          prop="select"
        >
          <el-input
            v-model="selectValue.label"
            placeholder="内容"
            type="text"
            maxlength="10"
            show-word-limit
          >
            <template slot="append">
              <el-button type="primary" :disabled="!isSelectValue" @click="saveSelect">
                确认
              </el-button>
            </template>
          </el-input>
          <!-- <div class="tip">最多添加10条选项，注意添加顺序</div> -->
          <div class="tags">
            <el-tag
              v-for="item in editform.radio_list"
              :key="item.key"
              class="item"
              closable
              @close="handleRmoveTag(item)"
            >
              {{ item.label }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="提示文案" prop="alert_required_message">
          <el-input
            v-model="editform.alert_required_message"
            type="text"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm"> 确认 </el-button>
          <el-button @click="cancelEdit"> 取消 </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
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
  {
    name: '文本',
    type: 1
  },
  {
    name: '数字',
    type: 2
  },
  {
    name: '日期',
    type: 3
  },
  {
    name: '单选',
    type: 4
  },
  {
    name: '复选框',
    type: 5
  },
  {
    name: '手机号',
    type: 6
  }
]
export default {
  filters: {
    filterType(val) {
      const data = typeList.find((item) => item.type === val)
      return data.name
    }
  },
  data() {
    const validRange = (rule, value, callback) => {
      if (!value.start || !value.end || value.start >= value.end) {
        callback(new Error('请输入正确的数字范围'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
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
      editformRules: {
        label: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        alert_required_message: [{ required: true, message: '请输入提示语', trigger: 'blur' }],
        range: [{ required: true, validator: validRange, trigger: 'blur' }],
        radio_list: [{ required: true, message: '请添加选项', trigger: 'blur' }]
      },
      rules: {
        'privacy.title': [{ required: true, message: '请输入协议标题', trigger: 'blur' }],
        'member_register.title': [{ required: true, message: '请输入协议标题', trigger: 'blur' }],
        'privacy.content': [{ required: true, message: '请输入充值协议', trigger: 'blur' }],
        'member_register.content': [{ required: true, message: '请输入注册协议', trigger: 'blur' }]
      },
      rules2: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入意向书', trigger: 'blur' }]
      },
      modalTitle: '',
      medicineForm: {
        title: '',
        content: ''
      }
    }
  },
  computed: {
    isSelectValue({ selectValue }) {
      return !!selectValue.label
    }
  },
  mounted() {
    this.getFormItems()
    this.getShopRules()
    this.getMemberFieldSetting()
  },
  methods: {
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
          message: '请填写正确的值',
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
        this.modalTitle = '编辑配置'
      } else {
        this.modalTitle = '新增配置'
      }
      this.showAdd = true
    },
    // 删除规则
    deleteField(data) {
      const { id } = data
      this.$confirm('此操作将删除此规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await deleteRegForm({ id })
        this.$message({
          type: 'success',
          message: '删除成功!'
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
      console.log(tab, event)
    },
    updateContent: function (data) {
      this.privacyForm.member_register.content = data
    },
    updatePrivacyAgreement: function (data) {
      this.privacyForm.privacy.content = data
    },
    async saveMedicineContent(){
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
              message: '保存成功',
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
              message: '保存成功',
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
