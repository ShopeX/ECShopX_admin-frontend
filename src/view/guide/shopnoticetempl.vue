<!--
+----------------------------------------------------------------------
| ECShopX open source E-commerce
| ECShopX 开源商城系统 
+----------------------------------------------------------------------
| Copyright (c) 2003-2025 ShopeX,Inc.All rights reserved.
+----------------------------------------------------------------------
| Corporate Website:  https://www.shopex.cn 
+----------------------------------------------------------------------
| Licensed under the Apache License, Version 2.0
| http://www.apache.org/licenses/LICENSE-2.0
+----------------------------------------------------------------------
| The removal of shopeX copyright information without authorization is prohibited.
| 未经授权不可去除shopeX商派相关版权
+----------------------------------------------------------------------
| Author: shopeX Team <mkt@shopex.cn>
| Contact: 400-821-3106
+----------------------------------------------------------------------
-->
<template>
  <div>
    <div class="notices">
      <el-row :gutter="10">
        <el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="6">
          <div class="notice-item">
            <div class="notice-message">
              {{ item.message }}
            </div>
            <div class="notice-body">
              <ul class="notice-content">
                <li>
                  <div class="notice-key">
                    {{ dataList[item.id] ? dataList[item.id].title : item.message }}
                  </div>
                  <div class="notice-value">
                    {{ dataList[item.id] ? dataList[item.id].description : item.message }}
                  </div>
                </li>
              </ul>
            </div>
            <div class="notice-footer">
              <div class="footer-item">
                <div @click="handleEdit(index)"><i class="iconfont icon-edit" />编辑</div>
              </div>
              <div v-if="dataList[item.id]" class="footer-item">
                <div
                  v-if="1 == dataList[item.id].disabled"
                  @click="handleTemplOpen(dataList[item.id].template_id)"
                >
                  <i class="iconfont icon-trash-alt" />开启
                </div>
                <div v-else @click="handleTemplClose(dataList[item.id].template_id)">
                  <i class="iconfont icon-trash-alt" />关闭
                </div>
              </div>
              <!-- <div class="footer-item" @click="handleTemplRemove(index)">
                  <i class="iconfont icon-trash-alt"></i>废弃
                </div> -->
            </div>
          </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="notice-item notice-add" @click="handleCreate">
            <div>
              <div class="iconfont icon-plus-circle"></div>
              <div>创建模版</div>
            </div>
          </div>
        </el-col> -->
      </el-row>
      <el-dialog :title="message" :visible.sync="editVisible" :before-close="handleCancel">
        <template>
          <el-form ref="form" :model="form" class="demo-ruleForm" label-width="100px">
            <el-form-item label="是否开启">
              <el-switch
                v-model="form.disabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="false"
                :inactive-value="true"
              />
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="form.title" />
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.description" />
            </el-form-item>
            <el-form-item label="是否放大第一个内容">
              <el-switch
                v-model="form.emphasis_first_item"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item label="内容">
              <div v-for="(item, index) in form.content" :key="index" class="form-content">
                <div class="content-name">
                  <el-form-item label="名称">
                    <el-input v-model="item.key" placeholder="" />
                  </el-form-item>
                </div>
                <div class="content-desc">
                  <el-form-item label="描述">
                    <div class="view-flex">
                      <el-input v-model="item.value" class="view-flex-item" placeholder="" />
                    </div>
                  </el-form-item>
                </div>
                <el-button type="text" @click="handleContentRemove(index)"> 删除 </el-button>
              </div>
              <el-button icon="el-icon-circle-plus" type="primary" plain @click="handleContentAdd">
                添加内容
              </el-button>
            </el-form-item>
          </el-form>
        </template>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="handleCancel"> 取消 </el-button>
          <el-button type="primary" @click="handleTemplAdd"> 保存 </el-button>
        </div>
      </el-dialog>
      <el-pagination
        class="center"
        :current-page.sync="paging.page"
        :page-size="paging.pageSize"
        layout="prev, pager, next"
        :total="paging.total"
        @size-change="handleChangeSize"
        @current-change="handleChangeCurrent"
      />
    </div>
  </div>
</template>
<script>
import {
  getWorkWechatTemplateList,
  getWorkWechatTemplate,
  saveWorkWechatTemplate,
  openWorkWechatTemplate,
  closeWorkWechatTemplate
} from '@/api/wechat'

export default {
  data() {
    return {
      id: '',
      message: '',
      paging: {
        page: 1,
        pageSize: 10,
        total: 10
      },
      form: {
        title: '',
        description: '',
        content: []
      },
      current: 0,
      editVisible: false,
      dataList: [],
      list: [
        {
          message: '待发货通知',
          id: 'waitingDeliveryNotice',
          title: '',
          description: '',
          content: [
            {
              key: '',
              value: ''
            }
          ],
          disabled: true,
          emphasis_first_item: true
        }
        // {
        //   message: '导购任务通知',
        //   id: 'salespersonTaskNotice',
        //   title: '',
        //   description: '',
        //   content: [{
        //     key: '',
        //     value: ''
        //   }],
        //   disabled: true,
        //   emphasis_first_item: true
        // },
        // {
        //   message: '完成任务通知',
        //   id: 'completeTaskNotice',
        //   title: '',
        //   description: '',
        //   content: [{
        //     key: '',
        //     value: ''
        //   }],
        //   disabled: true,
        //   emphasis_first_item: true
        // }
      ]
    }
  },
  mounted() {
    this.getTemplateList()
  },
  methods: {
    handleChangeSize(e) {},
    handleChangeCurrent(e) {
      this.paging.page = e
    },
    handleCreate() {
      this.form = {
        title: '',
        description: '',
        content: [
          {
            key: '',
            value: ''
          }
        ],
        disabled: true,
        emphasis_first_item: true
      }
      this.editVisible = true
    },
    async handleEdit(idx) {
      let current = this.list[idx]
      this.id = current.id
      this.message = current.message
      let { data } = await getWorkWechatTemplate(current.id)
      this.form = {
        title: data.data.title || '',
        description: data.data.description || '',
        content: data.data.content || [],
        disabled: data.data.disabled ? true : false,
        emphasis_first_item: data.data.emphasis_first_item ? true : false
      }
      console.log('########', data.data, this.form)
      this.editVisible = true
    },
    async handleTemplAdd() {
      // 新增
      await saveWorkWechatTemplate(this.id, this.form)
      let message = '添加成功'
      this.$message({
        message,
        type: 'success'
      })
      this.editVisible = false
    },
    handleContentAdd() {
      if (this.form.content.length >= 10) {
        this.$message({
          message: '最多添加10条内容',
          type: 'error'
        })
      }
      let issues = {
        key: '',
        value: ''
      }
      this.form.content.push(issues)
    },
    handleTemplRemove(idx) {
      this.$confirm('确定废弃当前模版吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.list.splice(idx, 1)
        })
        .catch(() => {})
    },
    async handleTemplClose(id) {
      let that = this
      this.$confirm('确定关闭当前模版吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          // 新增
          closeWorkWechatTemplate(id).then(res => {
            that.$message({
              message: '关闭成功',
              type: 'success'
            })
            that.getTemplateList()
          })
        })
        .catch(() => {})
    },
    async handleTemplOpen(id) {
      let that = this
      this.$confirm('确定开启当前模版吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          // 新增
          openWorkWechatTemplate(id).then(res => {
            that.$message({
              message: '开启成功',
              type: 'success'
            })
            that.getTemplateList()
          })
        })
        .catch(() => {})
    },
    handleContentRemove(idx) {
      this.form.content.splice(idx, 1)
    },
    submitAction() {
      this.editVisible = false
    },
    handleCancel() {
      this.editVisible = false
    },
    /**
     * 删除
     * */
    handleClickDel(row) {
      this.$confirm('确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {})
    },
    async getTemplateList() {
      let { data } = await getWorkWechatTemplateList()
      this.dataList = data.data
    }
  }
}
</script>
<style scoped lang="scss">
.center {
  text-align: center;
}
.notices {
  margin-top: 20px;
  .notice-item {
    position: relative;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #fff;
    overflow: hidden;
    border: 1px solid #efefef;
    &::after {
      display: flex;
      padding-top: 13%;
      content: '';
    }
    .notice-message {
      padding: 10px;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #efefef;
    }
    .notice-body {
      bottom: 40px;
      padding: 20px;
      overflow: hidden;
      .notice-title {
        padding-top: 10px;
        font-size: 16px;
        font-weight: bold;
        color: #333;
      }
      .notice-desc {
        font-size: 16px;
        color: #999;
      }
      .notice-content {
        li {
          display: flex;
          font-size: 16px;
          .notice-key {
            padding-right: 10px;
            color: #b0b0b0;
          }
          .notice-value {
            color: #333;
          }
          &:first-child {
            display: block;
            padding: 30px 0;
            text-align: center;
            .notice-key {
              padding-right: 0;
              font-size: 16px;
            }
            .notice-value {
              font-size: 32px;
            }
          }
        }
      }
    }
    .notice-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      height: 40px;
      border-top: 1px solid #f8f8f8;
      .footer-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        color: #999;
        &::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          background: #f8f8f8;
          content: '';
        }
        &:last-child::after {
          content: none;
        }
        &:hover {
          color: $dominant_hue;
        }
        i {
          margin-right: 3px;
          vertical-align: middle;
          line-height: 1;
          font-size: 10px;
        }
      }
    }
  }
  .notice-add {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f8f8f8;
    .iconfont {
      margin-bottom: 20px;
      font-size: 60px;
      color: #fff;
      line-height: 1;
      border-radius: 50%;
      background: #eaeaea;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }
  .form-content {
    padding-bottom: 12px;
    display: flex;
    .content-name {
      width: 200px;
    }
    .content-desc {
      padding: 0 10px;
    }
    .content-keyword {
      width: 100px;
      text-align: center;
    }
  }
}
</style>
