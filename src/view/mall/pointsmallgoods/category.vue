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
    <el-row :gutter="20">
      <el-col>
        <el-button type="primary" :disabled="isDisable" @click="updateCategory">
          保存分类
        </el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus" @click="appendTop(categoryList)">
          新增商品分类
        </el-button>
      </el-col>
    </el-row>
    <el-card>
      <el-table
        ref="tableTree"
        v-loading="loading"
        :data="categoryList"
        row-key="id"
        default-expand-all
        :height="wheight - 180"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column label="分类名称" min-width="280">
          <template slot-scope="scope">
            <el-input v-model="scope.row.category_name" class="input-b" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="分类排序" sortable width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" class="input-s" type="number" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="分类图片" width="150">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.image_url"
              style="width: 50px; height: 50px; vertical-align: middle"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              fit="cover"
            />
            <el-button type="text" class="el-icon-upload2" @click="handleImgChange(scope.row)">
              上传
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.created | datetime }}
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{
                path: '/pointsmall/pointsmallgoods/pointsmallphysical',
                query: { category: scope.row.category_id }
              }"
            >
              查看商品
            </router-link>
            <el-button
              v-if="scope.row.level < 2"
              type="text"
              style="margin-left: 5px"
              @click="append(scope.row)"
            >
              新增子类
            </el-button>
            <el-button
              type="text"
              style="margin-left: 5px"
              @click.native.prevent="deleteCategory(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCategory, saveCategory, deleteCategory } from '../../../api/pointsmall'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      isDisable: false,
      loading: false,
      spaceInput: false,
      categoryList: [],
      total_count: 0,
      params: [],
      imgDialog: false,
      isGetImage: false,
      current: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },

  mounted() {
    this.getCategory()
  },
  methods: {
    getCategory() {
      this.loading = true
      getCategory(this.params).then(response => {
        this.categoryList = response.data.data
        this.loading = false
        this.spaceInput = false
      })
    },
    updateCategory() {
      for (var i = 0; i < this.categoryList.length; i++) {
        for (var a = 0; a < this.categoryList.length - 1 - i; a++) {
          if (this.categoryList[a].category_name == this.categoryList[a + 1].category_name) {
            this.$message({
              type: 'error',
              message: '同级分类名称不能相同'
            })
            return false
          }
        }

        if (!this.catNameCheck(this.categoryList[i].category_name)) {
          return false
        }

        for (var j = 0; j < this.categoryList[i].children.length; j++) {
          if (!this.catNameCheck(this.categoryList[i].children[j].category_name)) {
            return false
          }
          for (var b = 0; b < this.categoryList[i].children.length - 1 - j; b++) {
            if (
              this.categoryList[i].children[b].category_name ==
              this.categoryList[i].children[b + 1].category_name
            ) {
              this.$message({
                type: 'error',
                message: '同级分类名称不能相同'
              })
              return false
            }
          }
          // if (!this.catNameCheck(this.categoryList[i].children[j].category_name)) {
          //   return false
          // }
        }
      }

      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 1000)

      let form = JSON.stringify(this.categoryList)
      saveCategory({ form: form }).then(response => {
        this.$message({
          type: 'success',
          message: '保存分类成功'
        })
        this.getCategory()
      })
    },
    deleteCategory(data) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (typeof data.category_id != 'undefined') {
            deleteCategory(data.category_id).then(response => {
              this.$message({
                type: 'success',
                message: '删除分类成功'
              })
              this.getCategory()
            })
          } else {
            // const parent = node.parent;
            // const children = parent.data.children || parent.data;
            // const index = children.findIndex(d => d.category_name === data.category_name);
            // children.splice(index, 1);
            const { level, id, parent_id } = data
            let key = level === 0 ? id : parent_id
            const categoryList = this.categoryList
            const parentIndex = categoryList.findIndex(item => item.id === key)
            const deleteList = function (children, delId) {
              if (!children) return
              for (let i = 0; i < children.length; i++) {
                if (children[i].id === delId) {
                  children.splice(i, 1)
                  return
                } else {
                  deleteList(children[i].children, delId)
                }
              }
            }
            if (key === id) {
              categoryList.splice(parentIndex, 1)
            } else {
              deleteList(categoryList[parentIndex].children, id)
            }
            this.categoryList = categoryList
          }
        })
        .catch(e => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    append(row) {
      console.log(row)
      let { children: data, level = 0, id, parent_id = '' } = row
      let newParentId = level === 0 ? id : parent_id
      const newChild = {
        id: Date.parse(new Date()) / 1000,
        category_name: '',
        sort: 0,
        level: ++level,
        children: [],
        created: 0,
        image_url: '',
        parent_id: newParentId
      }
      data.push(newChild)
    },
    appendTop(data) {
      const newChild = {
        id: Date.parse(new Date()) / 1000,
        category_name: '',
        sort: 0,
        level: 0,
        children: [],
        created: 0,
        image_url: ''
      }
      data.push(newChild)
      this.$nextTick(() => {
        let container = this.$el.querySelector('.el-table__body-wrapper')
        container.scrollTop = container.scrollHeight
      })
    },
    catNameCheck(catName) {
      let catNameLength = 0
      if (catName) {
        for (var i = 0; i < catName.length; i++) {
          if (catName.charCodeAt(i) > 255) {
            catNameLength += 2
          } else {
            catNameLength++
          }
        }
        if (catNameLength > 50) {
          this.$message({
            type: 'error',
            message: '分类名称长度最多25个汉字或50个字符'
          })
          return false
        }
        return true
      } else {
        this.$message({
          type: 'error',
          message: '分类不能为空'
        })
        return false
      }
    },
    handleImgChange(data) {
      this.imgDialog = true
      this.isGetImage = true
      this.current = data
    },
    pickImg(data) {
      if (!this.current.parent_id || this.current.parent_id == 0) {
        const index = this.categoryList.findIndex(d => d.id === this.current.id)
        this.categoryList[index].image_url = data.url
      } else if (this.current.parent_id && this.current.level == 1) {
        const findex = this.categoryList.findIndex(d => d.id === this.current.parent_id)
        const cindex = this.categoryList[findex].children.findIndex(d => d.id === this.current.id)
        this.categoryList[findex].children[cindex].image_url = data.url
      } else {
        let findex
        let cindex
        for (var item in this.categoryList) {
          cindex = this.categoryList[item].children.findIndex(d => d.id === this.current.parent_id)
          findex = item
          if (cindex > -1) break
        }
        const tindex = this.categoryList[findex].children[cindex].children.findIndex(
          d => d.id === this.current.id
        )
        this.categoryList[findex].children[cindex].children[tindex].image_url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>
