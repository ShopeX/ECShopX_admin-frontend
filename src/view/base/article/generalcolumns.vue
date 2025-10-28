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
    <div class="custom-tree-container">
      <div class="action-container">
        <el-button type="primary" icon="plus" @click="updateCategory"> 保存栏目 </el-button>
      </div>

      <div class="block">
        <ul class="custom-tree-node-title">
          <li>栏目名称</li>
          <li>栏目排序</li>
          <li>复制链接</li>
          <li>创建时间</li>
          <li>操作</li>
        </ul>
      </div>
      <div class="tree-background block">
        <el-tree
          v-loading="loading"
          :data="categoryList"
          default-expand-all
          :expand-on-click-node="false"
        >
          <ul slot-scope="{ node, data }" class="custom-tree-node">
            <li>
              <i v-if="data.level == 0" /><i v-else>　├─</i>
              <input v-model="data.category_name" placeholder="栏目名称">
              <!-- <span class="add-child-category" v-if="data.level == 0"
                  @click="append(data.children, 1)">
            <i class="el-icon-plus"></i>增加子栏目 
          </span> -->
            </li>
            <li>
              <input v-model="data.sort" placeholder="栏目排序">
            </li>
            <li v-clipboard:copy="data.link" v-clipboard:success="onCopy">
              <input v-model="data.link" class="copy-link" type="text">
              <i class="iconfont icon-copy" /> 复制栏目链接
            </li>
            <li v-if="data.created">
              {{ data.created | datetime }}
            </li>
            <li v-else />
            <li>
              <span class="remove-category" @click="deleteCategory(node, data)">
                <i class="iconfont icon-trash-alt" />
              </span>
            </li>
          </ul>
        </el-tree>

        <div class="add-category">
          <span @click="append(categoryList)"><i class="el-icon-plus" />增加栏目</span>
        </div>
      </div>
      <imgPicker
        :dialog-visible="imgDialog"
        :sc-status="isGetImage"
        @chooseImg="pickImg"
        @closeImgDialog="closeImgDialog"
      />
    </div>
  </SpPage>
</template>
<script>
import {
  getArticleCategoryList,
  saveArticleCategory,
  deleteArticleCategoryInfo
} from '@/api/article'
import imgPicker from '@/components/imageselect'

export default {
  components: {
    imgPicker
  },
  data() {
    return {
      loading: false,
      spaceInput: false,
      categoryList: [],
      total_count: 0,
      params: {
        category_type: 'general'
      },
      imgDialog: false,
      isGetImage: false,
      current: ''
    }
  },

  mounted() {
    this.getArticleCategory()
  },
  methods: {
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
      })
    },
    getArticleCategory() {
      this.loading = true
      getArticleCategoryList(this.params).then(response => {
        let list = response.data.data
        list.forEach((item, index) => {
          let link = `/pages/recommend/list?id=${item.category_id}&name=${item.category_name}`
          list[index] = { ...item, link }
        })
        this.categoryList = list
        this.loading = false
      })
    },
    updateCategory() {
      for (var i = 0; i < this.categoryList.length; i++) {
        for (var a = 0; a < this.categoryList.length - 1 - i; a++) {
          if (this.categoryList[a].category_name == this.categoryList[a + 1].category_name) {
            this.$message({
              type: 'error',
              message: '同级栏目名称不能相同'
            })
            return false
          }
        }

        if (!this.catNameCheck(this.categoryList[i].category_name)) {
          return false
        }

        for (var j = 0; j < this.categoryList[i].children.length; j++) {
          for (var b = 0; b < this.categoryList[i].children.length - 1 - j; b++) {
            if (
              this.categoryList[i].children[b].category_name ==
              this.categoryList[i].children[b + 1].category_name
            ) {
              this.$message({
                type: 'error',
                message: '同级栏目名称不能相同'
              })
              return false
            }
          }
          if (!this.catNameCheck(this.categoryList[i].children[j].category_name)) {
            return false
          }
        }
      }
      let form = JSON.stringify(this.categoryList)
      saveArticleCategory({ form: form }).then(response => {
        this.$message({
          type: 'success',
          message: '保存栏目成功'
        })
        this.getArticleCategory()
      })
    },
    deleteCategory(node, data) {
      this.$confirm('此操作将删除该栏目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (typeof data.category_id != 'undefined') {
            deleteArticleCategoryInfo(data.category_id).then(response => {
              this.$message({
                type: 'success',
                message: '删除栏目成功'
              })
              this.getArticleCategory()
            })
          } else {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    append(data, level = 0) {
      const newChild = {
        category_name: '',
        sort: 0,
        level: level,
        children: [],
        created: 0,
        image_url: '',
        category_type: 'general'
      }
      data.push(newChild)
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
        if (catNameLength > 12) {
          this.$message({
            type: 'error',
            message: '栏目名称长度最多6个汉字或12个字符'
          })
          return false
        }
        return true
      } else {
        this.$message({
          type: 'error',
          message: '栏目不能为空'
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
      } else {
        const findex = this.categoryList.findIndex(d => d.id === this.current.parent_id)
        const cindex = this.categoryList[findex].children.findIndex(d => d.id === this.current.id)
        this.categoryList[findex].children[cindex].image_url = data.url
      }
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
    }
  }
}
</script>

<style scoped lang="scss">
.custom-tree-container {
  background-color: #fff;
  min-width: 1100px;
}

.tree-background {
  padding-bottom: 45px;
  margin: 0px 20px;
}

.custom-tree-node,
.custom-tree-node-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  /*padding-right: 8px;*/
  li {
    display: inline-block;
    text-align: center;
    width: 25%;
  }
  li:first-child {
    text-align: left;
  }
  li.category-icon {
    display: flex;
    align-items: middle;
    justify-content: center;
    span {
      height: 30px;
    }
    img {
      width: auto;
      height: 30px;
    }
  }
}

.custom-tree-node-title {
  font-weight: bold;
  color: #909399;
  margin: 0px 20px;
  li {
    padding: 12px 0;
  }
}

.add-category {
  margin-left: 25px;
  margin-top: 30px;
  span {
    cursor: pointer;
  }
}

.remove-category {
  margin-left: 10px;
}

.add-child-category {
  margin-left: 10px;
}
</style>
<style lang="scss">
.custom-tree-container {
  .el-tree-node__content {
    height: 45px;
    padding: 0px;
    line-height: 45px;
  }
  .el-tree > .el-tree-node {
    position: relative;
    &::after {
      position: absolute;
      height: 1px;
      left: 0;
      right: 0;
      bottom: 0;
      content: '';
      background-color: #e6e6e6;
    }
  }
  .el-tree > .el-tree-node:first-child {
    &::before {
      position: absolute;
      height: 1px;
      left: 0;
      right: 0;
      top: 0;
      content: '';
      background-color: #e6e6e6;
    }
  }
}

.custom-tree-node {
  input {
    border: 1px solid #ddd;
    line-height: 25px;
    padding-left: 5px;
    width: 150px;
  }
}

.copy-link {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  visibility: hidden;
}
</style>
