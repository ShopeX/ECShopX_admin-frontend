<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-button type="primary" plain icon="el-icon-circle-plus" @click="appendTop(categoryList)"
          >新增商品分类</el-button
        >
        <!-- <el-button type="primary" @click="updateCategory" :disabled="isDisable"
          >保存分类</el-button
        > -->
      </el-col>
    </el-row>
    <el-card>
      <el-dialog
        :title="dialog.type === 'add' ? '新增分类' : '编辑分类'"
        :visible.sync="dialog.visible"
        destroy-on-close
      >
        <el-form label-width="80px">
          <el-form-item label="分类名称">
            <el-input v-model="dialog.cat_name" />
          </el-form-item>

          <el-form-item label="分类排序">
            <el-input-number v-model="dialog.sort" label="分类排序" :min="0"></el-input-number>
          </el-form-item>

          <el-form-item label="父级分类" v-if="dialog.is_hassuperior">
            <el-input
              v-model="dialog.superior_cat_name"
              label="分类排序"
              :disabled="true"
            ></el-input>
          </el-form-item>

          <el-form-item label="分类图片">
            <imgBox :imgUrl="dialog.cat_img" @click="handleImgChangeCat"></imgBox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button :loading="dialog.loading" type="primary" @click="handleSubmit"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-table
        :data="categoryList"
        row-key="id"
        ref="tableTree"
        default-expand-all
        v-loading="loading"
        :height="wheight - 180"
        :tree-props="{ children: 'children' }"
        style="width: 100%"
        size="small"
      >
        <el-table-column label="分类名称" width="380">
          <template slot-scope="scope">
            <span>{{ scope.row.category_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="分类排序" sortable width="80">
          <template slot-scope="scope">
            <div>{{ scope.row.sort }}</div>
          </template>
        </el-table-column>
        <el-table-column label="分类图片" width="200">
          <template slot-scope="scope">
            <el-image
              v-if="scope.row.image_url"
              style="width: 50px; height: 50px; vertical-align: middle"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              fit="cover"
            >
            </el-image>
            <!-- <el-button
              type="text"
              class="el-icon-upload2"
              @click="handleImgChange(scope.row)"
              >上传</el-button
            > -->
          </template>
        </el-table-column>
        <el-table-column prop="created" label="创建时间" width="120">
          <template slot-scope="scope">
            {{ scope.row.created | datetime('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">
              <router-link
                :to="{
                  path: login_type == 'distributor' ? '/shopadmin/entity/goodsphysical' : '/entity/goods/goodsphysical',
                  query: { category: scope.row.path }
                }"
                >查看商品</router-link
              >
            </el-button>
            <el-button type="text" v-if="scope.row.level < 2" @click="append(scope.row)"
              >新增子类</el-button
            >
            <el-button type="text" @click="editCategory(scope.row)">编辑</el-button>
            <el-button type="text" @click.native.prevent="deleteCategory(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    ></imgPicker>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCategory, saveCategory, deleteCategory, addCategory, editCategory } from '@/api/goods'
import imgPicker from '@/components/imageselect'
import imgBox from '@/components/element/imgBox'

export default {
  components: {
    imgPicker,
    imgBox
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
      current: '',
      dialog: {
        visible: false,
        cat_name: '',
        is_hassuperior: false,
        superior_cat_name: '',
        superior_cat_id: '',
        sort: 0,
        current_id: '',
        cat_img: '',
        loading: false,
        type: 'add'
      }
    }
  },
  computed: {
    ...mapGetters(['wheight', 'login_type'])
  },
  methods: {
    append(row) {
      // let { children: data, level = 0, id, parent_id = "" } = row;
      // let newParentId = level === 0 ? id : parent_id;
      // const newChild = {
      //   id: Date.parse(new Date()) / 1000,
      //   category_name: "",
      //   sort: 0,
      //   level: ++level,
      //   children: [],
      //   created: 0,
      //   image_url: "",
      //   parent_id: newParentId,
      // };
      // data.push(newChild);
      console.log(row)
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: true,
        superior_cat_name: row.label,
        superior_cat_id: row.category_id,
        type: 'add',
        cat_name: ''
      }
    },
    editCategory(row) {
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'edit',
        current_id: row.category_id,
        cat_img: row.image_url,
        cat_name: row.label,
        sort: row.sort
      }
    },
    handleSubmit() {
      const _this = this
      const {
        sort,
        cat_name,
        cat_img,
        is_hassuperior,
        superior_cat_id,
        type,
        current_id
      } = this.dialog
      if ((!sort && sort !== 0) || !cat_name) {
        this.$message.error('排序或分类名称必填！')
        return
      } else {
        this.dialog.loading = true
        if (type === 'add') {
          //添加
          addCategory({
            category_name: cat_name,
            sort: sort,
            image_url: cat_img,
            parent_id: is_hassuperior ? superior_cat_id : undefined
          })
            .then((res) => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                cat_name: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch((err) => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        } else {
          editCategory({
            category_name: cat_name,
            sort: sort,
            image_url: cat_img,
            category_id: current_id
          })
            .then((res) => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                cat_name: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch((err) => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        }
      }
    },
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
      saveCategory({ form: form }).then((response) => {
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
            deleteCategory(data.category_id).then((response) => {
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
            const parentIndex = categoryList.findIndex((item) => item.id === key)
            const deleteList = function(children, delId) {
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
            message: '已取消'
          })
        })
    },

    appendTop(data) {
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'add',
        cat_name: '',
        sort: 0
      }
      // const newChild = {id: Date.parse(new Date())/1000, category_name: '', sort: 0, level: 0, children: [], created: 0, image_url: ''}
      // data.push(newChild)
      // this.$nextTick(() => {
      //   let container = this.$el.querySelector('.el-table__body-wrapper');
      //   container.scrollTop = container.scrollHeight;
      // })
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
    handleImgChangeCat(data) {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      if (this.dialog.visible) {
        this.dialog.cat_img = data.url

        this.imgDialog = false
        return
      }

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
  },

  mounted() {
    this.getCategory()
  }
}
</script>
<style lang="scss">
.el-table__indent {
  padding-left: 30px !important;
}
.el-table__expand-icon {
  .el-icon-arrow-right {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &::before {
      content: '\e65f';
    }
  }
}
.el-table__expand-icon {
  &.el-table__expand-icon--expanded {
    transform: rotate(0deg);
    transition: all 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
    .el-icon-arrow-right {
      &::before {
        content: '\e655';
      }
    }
  }
}
</style>
