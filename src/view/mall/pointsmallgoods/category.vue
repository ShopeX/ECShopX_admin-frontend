<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-button type="primary" :disabled="isDisable" @click="updateCategory">
          {{ $t('cbe7fc28.7bd7e6') }}
        </el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus" @click="appendTop(categoryList)">
          {{ $t('cbe7fc28.41be0e') }}
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
        <el-table-column :label="$t('cbe7fc28.04d7d8')" min-width="280">
          <template slot-scope="scope">
            <el-input v-model="scope.row.category_name" class="input-b" size="mini" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" :label="$t('cbe7fc28.53eb44')" sortable width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sort" class="input-s" type="number" size="mini" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('cbe7fc28.b34dc8')" width="150">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.image_url"
              style="width: 50px; height: 50px; vertical-align: middle"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              fit="cover"
            />
            <el-button type="text" class="el-icon-upload2" @click="handleImgChange(scope.row)">
              {{ $t('cbe7fc28.d5a73b') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="created" :label="$t('cbe7fc28.eca37c')" width="120">
          <template slot-scope="scope">
            {{ scope.row.created | datetime }}
          </template>
        </el-table-column>
        <el-table-column width="180" :label="$t('cbe7fc28.2b6bc0')">
          <template slot-scope="scope">
            <router-link
              :to="{
                path: '/pointsmall/pointsmallgoods/pointsmallphysical',
                query: { category: scope.row.category_id }
              }"
            >
              {{ $t('cbe7fc28.f13684') }}
            </router-link>
            <el-button
              v-if="scope.row.level < 2"
              type="text"
              style="margin-left: 5px"
              @click="append(scope.row)"
            >
              {{ $t('cbe7fc28.82537d') }}
            </el-button>
            <el-button
              type="text"
              style="margin-left: 5px"
              @click.native.prevent="deleteCategory(scope.row)"
            >
              {{ $t('cbe7fc28.2f4aad') }}
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
      getCategory(this.params).then((response) => {
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
              message: this.$t('cbe7fc28.cd40f5')
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
                message: this.$t('cbe7fc28.cd40f5')
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
      saveCategory({ form: form }).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('cbe7fc28.e07262')
        })
        this.getCategory()
      })
    },
    deleteCategory(data) {
      this.$confirm(this.$t('cbe7fc28.442ecc'), this.$t('cbe7fc28.02d981'), {
        confirmButtonText: this.$t('cbe7fc28.38cf16'),
        cancelButtonText: this.$t('cbe7fc28.625fb2'),
        type: 'warning'
      })
        .then(() => {
          if (typeof data.category_id != 'undefined') {
            deleteCategory(data.category_id).then((response) => {
              this.$message({
                type: 'success',
                message: this.$t('cbe7fc28.1fe03c')
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
            const parentIndex = categoryList.findIndex((item) => item.id === key)
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
        .catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: this.$t('cbe7fc28.2111cc')
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
            message: this.$t('cbe7fc28.12d07c')
          })
          return false
        }
        return true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('cbe7fc28.1bb421')
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
        const index = this.categoryList.findIndex((d) => d.id === this.current.id)
        this.categoryList[index].image_url = data.url
      } else if (this.current.parent_id && this.current.level == 1) {
        const findex = this.categoryList.findIndex((d) => d.id === this.current.parent_id)
        const cindex = this.categoryList[findex].children.findIndex((d) => d.id === this.current.id)
        this.categoryList[findex].children[cindex].image_url = data.url
      } else {
        let findex
        let cindex
        for (var item in this.categoryList) {
          cindex = this.categoryList[item].children.findIndex(
            (d) => d.id === this.current.parent_id
          )
          findex = item
          if (cindex > -1) break
        }
        const tindex = this.categoryList[findex].children[cindex].children.findIndex(
          (d) => d.id === this.current.id
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
