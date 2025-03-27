<template>
  <div class="section section-white">
    <div class="section-body">
      <el-form
        ref="form"
        :model="form"
        label-width="150px"
        label-position="right"
        class="demo-ruleForm"
      >
        <div v-if="!form.id" class="content-center content-bottom-padded">
          <el-radio-group v-model="form.tem_type" @change="handleTypeChange">
            <el-radio-button label="ask_answer_paper"> 问卷调查 </el-radio-button>
            <el-radio-button label="basic_entry"> 基础录入(统计报表) </el-radio-button>
          </el-radio-group>
        </div>
        <el-form-item
          label="标题"
          prop="tem_name"
          :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
        >
          <el-col :span="20">
            <el-input v-model.trim="form.tem_name" :maxlength="30" placeholder="体测表单" />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="form.tem_type == 'ask_answer_paper'"
          label="表单风格"
          prop="form_style"
          :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]"
        >
          <el-row :gutter="20">
            <el-col :span="5">
              <el-radio v-model="form.form_style" label="single"> 单页问卷(多项集合) </el-radio>
              <!-- <el-radio v-model="form.form_style" label="multiple">多页问卷(每页一项)</el-radio> -->
            </el-col>
            <el-col :span="10">
              <!-- <el-alert
                v-if="form.form_style == 'single'"
                show-icon
                :closable="false"
                title="单页问卷方式不支持图片显示"
                type="warning"
              /> -->
              <el-alert
                v-if="form.form_style == 'multiple'"
                show-icon
                :closable="false"
                title="多页问卷方式提供图片显示"
                type="warning"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="form.tem_type == 'ask_answer_paper' && form.form_style == 'single'"
          label="头部文字"
        >
          <el-col :span="20">
            <el-input
              v-model.trim="form.header_link_title"
              type="textarea"
              :maxlength="500"
              placeholder="头部文字超级链接"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="form.tem_type == 'ask_answer_paper' && form.form_style == 'single'"
          label="头部内容"
        >
          <el-col :span="20">
            <el-input
              v-model="form.header_title"
              type="textarea"
              :maxlength="500"
              placeholder="体测表单"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="form.tem_type == 'ask_answer_paper' && form.form_style == 'single'"
          label="底部文字"
        >
          <el-col :span="20">
            <el-input
              v-model="form.bottom_title"
              type="textarea"
              :maxlength="500"
              placeholder="体测表单"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="表单内容"
          prop="content"
          :rules="[{ required: true, message: '请选择表单内容', trigger: 'change' }]"
        >
          <el-row v-for="(item, index) in form.content" :key="index" :gutter="2">
            <el-col :span="18">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <template v-if="form.tem_type == 'ask_answer_paper'">
                    <span>区块一标题:</span
                    ><el-input
                      v-model="item.title"
                      placeholder="区块标题"
                      size="mini"
                      style="width: 200px"
                    />
                    <span>排序:</span
                    ><el-input v-model="item.sort" size="mini" style="width: 50px" />
                  </template>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="checkContent(index)"
                  >
                    选择表单内容
                  </el-button>
                </div>
                <el-col v-if="item.formdata.length > 0">
                  <el-table :data="item.formdata" style="width: 100%">
                    <el-table-column prop="id" label="ID" width="40" />
                    <el-table-column prop="field_title" label="标题" width="100" />
                    <el-table-column prop="sort" label="排序" width="100">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" width="80" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="是否必填" width="100">
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.is_required"
                          :checked="scope.row.is_required"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column v-if="keyIndexIsShow" label="设置关键指数(最多设置5个)">
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.key_index"
                          @change="checkKeyIndex(scope.$index, scope.row)"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-card>
            </el-col>
            <el-col v-if="form.tem_type == 'ask_answer_paper'" :span="2">
              <el-button v-if="index == 0" circle type="primary" @click="addCard"> 增 </el-button>
              <el-button v-if="index != 0" circle type="primary" @click="delCard(index)">
                删
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="keyIndexIsShow && form.key_index.length > 0"
          label="关键指数"
          prop="tem_name"
        >
          <el-row>
            <el-col v-for="(item, index) in form.key_index" :key="index" :span="4">
              <div>{{ item.field_title }}</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          label="填写表单图片背景"
          prop="header_bg_pic"
          v-if="form.tem_type == 'ask_answer_paper'"
        >
          <el-col :span="20">
            <div>
              <imgBox
                :img-url="wximageurl + form.header_bg_pic"
                inline
                @click="handleImgBChange"
              />
            </div>
            <div class="frm-tips">
              只能上传jpg/png文件，且不超过2M （建议尺寸：640px，高度自适应）
            </div>
            <imgPicker
              :dialog-visible="imgDialog"
              :sc-status="isGetImage"
              @chooseImg="pickImg"
              @closeImgDialog="closeImgDialog"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="表单距离顶部高度"
          prop="header_height"
          v-if="form.tem_type == 'ask_answer_paper'"
        >
          <el-col :span="20">
            <el-input v-model.trim="form.header_height" placeholder="请输入数字" style="width:50%" />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel"> 取消 </el-button>
          <el-button type="primary" @click="submitAction"> 保存 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <SideBar :visible.sync="showElementList" title="选择表单元素" width="40">
      <slot>
        <el-row class="content-bottom-padded" :gutter="20">
          <el-col :span="6">
            <el-select
              v-model="params.form_element"
              placeholder="请选择表单元素"
              style="width: 100%"
              clearable
              @change="searchData"
            >
              <el-option
                v-for="(item, key) in formElement"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="params.field_title" placeholder="标题" style="width: 100%">
              <el-button slot="append" icon="el-icon-search" @click="searchData" />
            </el-input>
          </el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="ItemsList"
          tooltip-effect="dark"
          style="width: 100%"
          :row-key="getRowKeys"
          :select-on-indeterminate="false"
          @select="handleSelectChange"
          @select-all="handleSelectAll"
        >
          <el-table-column type="selection" :reserve-selection="true" width="50" />
          <el-table-column prop="id" label="ID" width="40" />
          <el-table-column prop="field_title" label="标题" width="150" />
          <el-table-column prop="form_element" label="元素" width="80" />
          <el-table-column label="选择项">
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.options" :key="index"> {{ item.value }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total_count > params.pageSize" class="tr">
          <el-pagination
            layout="prev, pager, next"
            :total="total_count"
            :page-size="params.pageSize"
            @current-change="handleCurrentChange"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveStoreAction">确 定</el-button>
        </span>
      </slot>
    </SideBar>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  saveTemplate,
  getTemplateInfo,
  updateTemplate,
  getSettingList
} from '../../../api/selfhelpform'
import SideBar from '@/components/element/sideBar'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'

export default {
  inject: ['refresh'],
  components: {
    SideBar,
    imgPicker,
    imgBox
  },
  data() {
    return {
      form: {
        id: '',
        tem_name: '',
        form_style: 'single',
        header_link_title: '',
        header_title: '',
        bottom_title: '',
        content: [{ title: '', sort: 1, formdata: [] }],
        tem_type: 'ask_answer_paper',
        status: 1,
        key_index: [],
        header_bg_pic: '',
        header_height: ''
      },
      params: {
        page: 1,
        pageSize: 10
      },
      settingList: [],
      total_count: 0,
      keyIndexIsShow: true,
      showElementList: false,
      ItemsList: [],
      loading: false,
      selectRows: [],
      formElement: [
        { name: '文本框', value: 'text' },
        { name: '文本域', value: 'textarea' },
        { name: '单选按钮', value: 'radio' },
        { name: '复选框', value: 'checkbox' },
        { name: '下拉选择框', value: 'select' },
        { name: '日期选择', value: 'date' },
        { name: '地区地址选择', value: 'area' },
        { name: '数字', value: 'number' },
        { name: '上传身份证', value: 'idcard' },
        { name: '上传其他附件', value: 'otherfile' },
      ],
      templateRadio: '',
      formcontentindex: 0,
      selectdata: [],
      imgDialog: false,
      isGetImage: false,
    }
  },
  mounted() {
    if (this.$route.query.id) {
      getTemplateInfo(this.$route.query.id).then((res) => {
        this.form = res.data.data
        if (this.form.tem_type === 'basic_entry') {
          this.keyIndexIsShow = true
        } else {
          this.keyIndexIsShow = false
        }
      })
    }
  },
  methods: {
    getDataList() {
      this.loading = true
      getSettingList(this.params).then((response) => {
        this.ItemsList = response.data.data.list
        this.$refs.multipleTable.clearSelection()
        this.selectdata.forEach((item) => {
          let checked = this.ItemsList.find((n) => n.id === item.id)
          if (checked) {
            this.$refs.multipleTable.toggleRowSelection(item)
          }
        })
        this.loading = false
        this.total_count = response.data.data.total_count
      })
    },
    submitAction() {
      const that = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.tem_type == 'basic_entry' && this.form.key_index.length <= 0) {
            this.$message({
              type: 'error',
              message: '请配置关键数值'
            })
            return false
          }
          const postparams = JSON.parse(JSON.stringify(this.form))

          postparams.key_index = JSON.stringify(postparams.key_index)
          postparams.content = JSON.stringify(postparams.content)
          if (this.form.id) {
            updateTemplate(postparams).then((res) => {
              if (res.data.data) {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  duration: 2 * 1000,
                  onClose() {
                    that.refresh()
                    that.$router.go(-1)
                  }
                })
              }
            })
          } else {
            saveTemplate(postparams)
              .then((res) => {
                if (res.data.data) {
                  this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration: 2 * 1000,
                    onClose() {
                      that.refresh()
                      that.$router.go(-1)
                    }
                  })
                }
              })
              .catch((error) => {
                this.$message({
                  type: 'error',
                  message: '保存出错'
                })
              })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请录入正确的数据'
          })
          return false
        }
      })
    },
    handleCancel() {
      this.$router.go(-1)
    },
    handleTypeChange(val) {
      this.showElementList = false
      this.form.tem_type = val
      if (val === 'basic_entry') {
        this.keyIndexIsShow = true
      } else {
        this.keyIndexIsShow = false
      }
    },
    checkIsRequired(index, val) {
      // console.log(val)
    },
    checkKeyIndex(index, val) {
      if (val.key_index && this.form.key_index.length >= 5) {
        this.form.content[index].key_index = false
        this.$message({
          type: 'error',
          message: '关键指数最高只能选5个'
        })
        return false
      }
      if (this.form.key_index.length > 0) {
        let inChecked = this.form.key_index.findIndex((n) => val.id === n.id)
        if (inChecked !== -1) {
          this.form.key_index.splice(inChecked, 1)
        } else if (val.key_index) {
          this.form.key_index.push(val)
        }
      } else {
        this.form.key_index.push(val)
      }
    },
    checkContent(index) {
      if (this.form.tem_type == 'basic_entry') {
        this.params.form_element = 'number'
        this.formElement = [{ name: '数字', value: 'number' }]
      } else {
        this.params.form_element = ''
        this.formElement = [
          { name: '文本框', value: 'text' },
          { name: '文本域', value: 'textarea' },
          { name: '单选按钮', value: 'radio' },
          { name: '复选框', value: 'checkbox' },
          { name: '下拉选择框', value: 'select' },
          { name: '日期选择', value: 'date' },
          { name: '地区地址选择', value: 'area' },
          { name: '数字', value: 'number' },
          { name: '上传身份证', value: 'idcard' },
          { name: '上传其他附件', value: 'otherfile' },
        ]
      }
      this.showElementList = true
      this.formcontentindex = index
      this.selectdata = this.form.content[index].formdata
      this.getDataList()
    },
    searchData() {
      this.params.page = 1
      this.getDataList()
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getDataList()
    },
    handleSizeChange(pageSize) {
      this.loading = false
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getDataList()
    },
    getRowKeys(row) {
      return row.id
    },
    getTemplateRow(index, row) {
      this.selectRows = new Array(row)
    },
    saveStoreAction() {
      let index = this.formcontentindex
      this.showElementList = false
      let newselectrows = JSON.parse(JSON.stringify(this.form.content[index].formdata))
      newselectrows.forEach((item) => {
        item.is_required = false
      })
      this.form.content[index].formdata = newselectrows
    },
    handleSelectAll(val) {
      let index = this.formcontentindex
      if (val.length > 0) {
        this.form.content[index].formdata = []
        val.forEach((item) => {
          let inChecked = this.form.content[index].formdata.findIndex((n) => item.id === n.id)
          if (inChecked === -1) {
            this.form.content[index].formdata.push(item)
          }
        })
      } else {
        this.ItemsList.forEach((item, index) => {
          let inChecked = this.form.content[index].formdata.findIndex((n) => item.id === n.id)
          if (inChecked !== -1) {
            this.form.content[index].formdata.splice(inChecked, 1)
          }
        })
      }
    },
    handleSelectChange(val, row) {
      let index = this.formcontentindex
      let inChecked = this.form.content[index].formdata.findIndex((item) => row.id === item.id)
      if (inChecked !== -1) {
        this.form.content[index].formdata.splice(inChecked, 1)
      } else {
        this.form.content[index].formdata.push(row)
      }
    },
    addCard() {
      let carddata = {
        title: '',
        formdata: [],
        sort: 1
      }
      this.form.content.push(carddata)
    },
    delCard(index) {
      this.form.content.splice(index, 1)
    },
    handleImgBChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      this.form.header_bg_pic = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
  }
}
</script>
<style scoped lang="scss">
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 650px;
}
</style>
