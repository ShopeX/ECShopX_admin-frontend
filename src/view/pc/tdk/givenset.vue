<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage>
    <!--搜索添加-->

    <el-table
      border
      v-loading="loading"
      :data="list"
      :height="wheight - 300"
      :element-loading-text="$t('33ffbda2.f09b12')"
    >
      <el-table-column :label="$t('33ffbda2.2b6bc0')" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.row)">
            {{ $t('33ffbda2.95b351') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="page"
        :label="$t('33ffbda2.59ceff')"
        :formatter="(row) => (row.page ? $t(row.page) : '')"
      />
    </el-table>

    <!--新增修改-->

    <sideBar :visible.sync="show_sideBar" :title="title ? $t(title) : $t('33ffbda2.224e2c')">
      <el-form>
        <el-form-item :label="$t('33ffbda2.522f16')">
          <el-input
            v-model="form['title']"
            type="textarea"
            :rows="2"
            :placeholder="$t('33ffbda2.708c9d')"
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

        <el-form-item :label="$t('33ffbda2.c2814d')">
          <el-input
            v-model="form['mate_description']"
            type="textarea"
            :rows="2"
            :placeholder="$t('33ffbda2.708c9d')"
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
        <el-form-item :label="$t('33ffbda2.75605b')">
          <el-input
            v-model="form['mate_keywords']"
            type="textarea"
            :rows="2"
            :placeholder="$t('33ffbda2.708c9d')"
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
          <el-button type="primary" @click="save">{{ $t('33ffbda2.939d53') }}</el-button>
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
      title: '',
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
        { page: '33ffbda2.b2da87', id: 'detailTags' },
        { page: '33ffbda2.544780', id: 'listTags' }
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
      let bool = this.tageArr[type].findIndex((item) => item == value)
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
      let index = this.tageArr[type].findIndex((item) => tag.value == item)
      if (index == -1) {
        this.tageArr[type].push(tag.value)
        for (let key in this.tageArr) {
          this.form[key] = this.tageArr[key].join(',')
        }
      } else {
        this.tageArr[type] = this.tageArr[type].filter((item) => tag.value !== item)
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
        saveTdkgivensetDetail(this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('33ffbda2.33130f') })
          this.show_sideBar = false
        })
      } else {
        saveTdkgivensetList(this.form).then((res) => {
          this.$message({ type: 'success', message: this.$t('33ffbda2.33130f') })
          this.show_sideBar = false
        })
      }
      this.resetData()
    },

    // 获取列表
    getList() {
      if (this.type == 'detailTags') {
        getTdkgivensetDetail().then((res) => {
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
        getTdkgivensetList().then((res) => {
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
