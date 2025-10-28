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
  <SpPage>
    <!--搜索添加-->

    <el-table
      border
      v-loading="loading"
      :data="list"
      :height="wheight - 300"
      element-loading-text="数据加载中"
    >
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)"> 编辑 </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="page" label="页面" />
    </el-table>

    <!--新增修改-->

    <sideBar :visible.sync="show_sideBar" :title="title">
      <el-form>
        <el-form-item
          label="
TITLE(页面标题）"
        >
          <el-input
            v-model="form['title']"
            type="textarea"
            :rows="2"
            placeholder="请选择"
            disabled
          />
          <div>
            <el-tag
              v-for="(tag, index) in tags"
              :key="index"
              :type="tagType('title', tag.value)"
              @click="handelClick('title', tag)"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </el-form-item>

        <el-form-item
          label="
MATE_DESCRIPTION(页面描述）"
        >
          <el-input
            v-model="form['mate_description']"
            type="textarea"
            :rows="2"
            placeholder="请选择"
            disabled
          />
          <div>
            <el-tag
              v-for="(tag, index) in tags"
              :key="index"
              :type="tagType('mate_description', tag.value)"
              @click="handelClick('mate_description', tag)"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item
          label="
MATE_KEYWORDS (关键词）"
        >
          <el-input
            v-model="form['mate_keywords']"
            type="textarea"
            :rows="2"
            placeholder="请选择"
            disabled
          />
          <div>
            <el-tag
              v-for="(tag, index) in tags"
              :key="index"
              :type="tagType('mate_keywords', tag.value)"
              @click="handelClick('mate_keywords', tag)"
            >
              {{ tag.label }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save"> 提交 </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import sideBar from '@/components/element/sideBar'
import {
  getTdkgivensetDetail,
  saveTdkgivensetDetail,
  getTdkgivensetList,
  saveTdkgivensetList
} from '@/api/tdkset'

export default {
  components: {
    sideBar
  },

  data() {
    return {
      loading: false,
      title: '配置',
      show_sideBar: false,
      detailTags: [
        {
          label: '商品名',
          value: '{goods_name}'
        },
        {
          label: '品牌',
          value: '{goods_brand}'
        },
        {
          label: '分类',
          value: '{goods_category}'
        },
        {
          label: '价格',
          value: '{goods_price}'
        },
        {
          label: '简介',
          value: '{goods_brief}'
        }
      ],
      listTags: [
        {
          label: '搜索关键词',
          value: '{search_keywords}'
        },
        {
          label: '商品分类',
          value: '{category}'
        },
        {
          label: '分类路径',
          value: '{category_path}'
        },
        {
          label: '商城名',
          value: '{shop_name}'
        }
      ],
      tags: [],
      // 提交数据

      // 列表数据
      list: [
        { page: '商品详情页', id: 'detailTags' },
        { page: '商品列表页', id: 'listTags' }
      ],
      type: '',
      form: {
        title: '',
        mate_description: '',
        mate_keywords: ''
      },
      tageArr: {
        title: [],
        mate_description: [],
        mate_keywords: []
      }
    }
  },
  mounted() {},

  methods: {
    tagType(type, value) {
      let bool = this.tageArr[type].findIndex(item => item == value)
      if (bool == -1) {
        return ''
      } else {
        return 'danger'
      }
    },
    // 编辑
    handleEdit(data) {
      this.show_sideBar = true
      this.resetData()
      this.type = data.id
      this.tags = this[data.id]
      this.title = data.page
      this.getList()
    },
    handelClick(type, tag) {
      let index = this.tageArr[type].findIndex(item => tag.value == item)
      if (index == -1) {
        this.tageArr[type].push(tag.value)
        for (let key in this.tageArr) {
          this.form[key] = this.tageArr[key].join(',')
        }
      } else {
        this.tageArr[type] = this.tageArr[type].filter(item => tag.value !== item)
        for (let key in this.tageArr) {
          this.form[key] = this.tageArr[key].join(',')
        }
      }
    },
    // 初始化
    resetData() {
      this.form = {
        title: '',
        mate_description: '',
        mate_keywords: ''
      }
      this.tageArr = {
        title: [],
        mate_description: [],
        mate_keywords: []
      }
    },
    // 保存数据
    save() {
      if (this.type == 'detailTags') {
        saveTdkgivensetDetail(this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.show_sideBar = false
        })
      } else {
        saveTdkgivensetList(this.form).then(res => {
          this.$message({ type: 'success', message: '操作成功' })
          this.show_sideBar = false
        })
      }
      this.resetData()
    },

    // 获取列表
    getList() {
      if (this.type == 'detailTags') {
        getTdkgivensetDetail().then(res => {
          let data = res.data.data
          this.form = data
          for (let key in data) {
            if (data[key]) {
              this.tageArr[key] = data[key].split(',')
            } else {
              this.tageArr[key] = []
            }
          }
        })
      } else {
        getTdkgivensetList().then(res => {
          let data = res.data.data
          this.form = data
          for (let key in data) {
            if (data[key]) {
              this.tageArr[key] = data[key].split(',')
            } else {
              this.tageArr[key] = []
            }
          }
        })
      }
    }
    // 上传图片
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.upload-box {
  width: 100px;
  height: 100px;

  .avatar-uploader-icon {
    line-height: 100px;
  }
}
</style>
