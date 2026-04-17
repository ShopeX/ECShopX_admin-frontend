<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div class="section section-white page-formtemplateadd">
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
            <el-radio-button label="ask_answer_paper">{{ $t('0493712c.859b34') }}</el-radio-button>
            <el-radio-button label="basic_entry">{{ $t('0493712c.4e8c55') }}</el-radio-button>
          </el-radio-group>
        </div>
        <el-form-item :label="$t('c831a478.32c65d')" prop="tem_name" :rules="titleRules">
          <el-col :span="20">
            <el-input
              v-model.trim="form.tem_name"
              :maxlength="30"
              :placeholder="$t('0493712c.450f34')"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          v-if="form.tem_type == 'ask_answer_paper'"
          :label="$t('0493712c.78ce0e')"
          prop="form_style"
          :rules="titleRules"
        >
          <el-row :gutter="20">
            <el-col :span="5">
              <el-radio v-model="form.form_style" label="single">
                {{ $t('0493712c.0ba634') }}
              </el-radio>
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
                :title="$t('0493712c.d9cc4f')"
                type="warning"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item
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
        </el-form-item> -->
        <!-- <el-form-item
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
        </el-form-item> -->
        <!-- <el-form-item
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
        </el-form-item> -->
        <el-form-item :label="$t('0493712c.4dca81')" prop="content" :rules="formContentRules">
          <el-row v-for="(item, index) in form.content" :key="index" :gutter="2">
            <el-col :span="18">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <template v-if="form.tem_type == 'ask_answer_paper'">
                    <span>{{ $t('0493712c.0de15f') }}</span
                    ><el-input
                      v-model="item.title"
                      :placeholder="$t('0493712c.5a02fa')"
                      size="mini"
                      style="width: 200px"
                    />
                    <span>{{ $t('0493712c.488f80') }}</span
                    ><el-input v-model="item.sort" size="mini" style="width: 50px" />
                  </template>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="checkContent(index)"
                  >
                    {{ $t('0493712c.99eb0c') }}
                  </el-button>
                </div>
                <el-col v-if="item.formdata.length > 0">
                  <el-table :data="item.formdata" style="width: 100%">
                    <el-table-column prop="id" :label="$t('1ad8a87f.b718ad')" width="40" />
                    <el-table-column
                      prop="field_title"
                      :label="$t('c831a478.32c65d')"
                      width="100"
                    />
                    <el-table-column prop="sort" :label="$t('0493712c.c360e9')" width="100">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.sort" width="80" size="small" />
                      </template>
                    </el-table-column>
                    <el-table-column prop="sort" :label="$t('0493712c.04d815')" width="100">
                      <template slot-scope="scope">
                        <el-checkbox
                          v-model="scope.row.is_required"
                          :checked="scope.row.is_required"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column v-if="keyIndexIsShow" :label="$t('0493712c.633608')">
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
              <el-button v-if="index == 0" circle type="primary" @click="addCard">
                {{ $t('c831a478.c0a0f2') }}
              </el-button>
              <el-button v-if="index != 0" circle type="primary" @click="delCard(index)">
                {{ $t('0493712c.fe5c38') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-if="keyIndexIsShow && form.key_index.length > 0"
          :label="$t('0493712c.b25fc1')"
          prop="tem_name"
        >
          <el-row>
            <el-col v-for="(item, index) in form.key_index" :key="index" :span="4">
              <div>{{ item.field_title }}</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          :label="$t('0493712c.634fb6')"
          prop="header_bg_pic"
          v-if="form.tem_type == 'ask_answer_paper'"
        >
          <el-col :span="20">
            <div>
              <imgBox :img-url="wximageurl + form.header_bg_pic" inline @click="handleImgBChange" />
            </div>
            <div class="frm-tips">
              {{ $t('0493712c.a206d0') }}
            </div>
          </el-col>
        </el-form-item>
        <el-form-item
          :label="$t('0493712c.21dbb2')"
          prop="header_height"
          v-if="form.tem_type == 'ask_answer_paper'"
        >
          <el-col :span="20">
            <el-input
              v-model.trim="form.header_height"
              :placeholder="$t('0493712c.de66a2')"
              style="width: 50%"
            />
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button @click.native="handleCancel">{{ $t('8da83775.625fb2') }}</el-button>
          <el-button type="primary" @click="submitAction">{{ $t('8da83775.be5fbb') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <SideBar :visible.sync="showElementList" :title="$t('0493712c.864188')" width="40">
      <el-row class="content-bottom-padded" :gutter="20">
        <el-col :span="6">
          <el-select
            v-model="params.form_element"
            :placeholder="$t('c831a478.c2dba8')"
            style="width: 100%"
            clearable
            @change="searchData"
          >
            <el-option
              v-for="item in formElement"
              :key="item.value"
              :label="$t(item.nameKey)"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="params.field_title"
            :placeholder="$t('c831a478.32c65d')"
            style="width: 100%"
          >
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
        <el-table-column prop="id" :label="$t('1ad8a87f.b718ad')" width="40" />
        <el-table-column prop="field_title" :label="$t('c831a478.32c65d')" width="150" />
        <el-table-column prop="form_element" :label="$t('1ad8a87f.e1e080')" width="80" />
        <el-table-column :label="$t('1ad8a87f.9e322a')">
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
        <el-button type="primary" @click="saveStoreAction">{{ $t('ac2a6290.aa7527') }}</el-button>
      </span>
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
import imgBox from '@/components/element/imgBox'

export default {
  inject: ['refresh'],
  components: {
    SideBar,
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
      templateRadio: '',
      formcontentindex: 0,
      selectdata: []
    }
  },
  computed: {
    titleRules() {
      return [{ required: true, message: this.$t('8da83775.b91aba'), trigger: 'blur' }]
    },
    formContentRules() {
      return [{ required: true, message: this.$t('0493712c.00d91e'), trigger: 'change' }]
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
              message: this.$t('0493712c.3c46c9')
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
                  message: this.$t('c831a478.55aa63'),
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
                    message: this.$t('c831a478.3fdaea'),
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
                  message: this.$t('0493712c.3d73d2')
                })
              })
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$t('c831a478.3737df')
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
          message: this.$t('0493712c.bd8d8e')
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
        this.formElement = [{ nameKey: '1ad8a87f.55d479', value: 'number' }]
      } else {
        this.params.form_element = ''
        this.formElement = [
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
    async handleImgBChange() {
      try {
        const { data } = await this.$picker.image({
          data: this.form.header_bg_pic ? { url: this.form.header_bg_pic } : undefined
        })

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          // form.header_bg_pic 存储的是相对路径（显示时使用 wximageurl + form.header_bg_pic）
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            this.form.header_bg_pic = imgUrl.replace(this.wximageurl, '')
          } else {
            this.form.header_bg_pic = imgUrl
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page-formtemplateadd {
  .content-bottom-padded {
    margin-bottom: 20px;
    text-align: center;
  }
}
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
