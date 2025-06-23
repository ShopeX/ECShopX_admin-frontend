<template>
  <SpPage>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="label" label="街道居委:">
        <el-input v-model="params.label" placeholder="请输入街道居委名称" />
      </SpFilterFormItem>
    </SpFilterForm>
    <div class="action-container">
      <el-button type="primary" plain @click="appendTop(categoryList)"> 新增街道 </el-button>
    </div>
    <el-card>
      <el-dialog
        :title="dialog.type === 'add' ? `新增${dialog.title}` : `编辑${dialog.title}`"
        :visible.sync="dialog.visible"
        destroy-on-close
      >
        <el-form label-width="180px">
          <el-form-item :label="`新增${dialog.title}名称`">
            <el-input v-model="dialog.label" />
          </el-form-item>
          <el-form-item v-if="!dialog.is_hassuperior && dialog.title == '街道'" label="选择地区">
            <el-cascader
              v-model="dialog.address"
              :options="addList"
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item v-if="dialog.is_hassuperior" label="所属街道">
            <el-input v-model="dialog.superior_cat_name" label="分类排序" :disabled="true" />
          </el-form-item>
          <el-form-item v-if="!dialog.is_hassuperior && dialog.title == '街道'" label="关联店铺">
            <el-select v-model="dialog.distributor_id" multiple clearable placeholder="请选择店铺">
              <el-option
                v-for="(item, index) in distributorList"
                :key="index"
                :label="item.name"
                :value="item.distributor_id"
              />
            </el-select>
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
        ref="tableTree"
        v-loading="loading"
        :data="categoryList"
        row-key="id"
        default-expand-all
        :height="- 180"
        :tree-props="{ children: 'children' }"
        style="width: 100%"
        size="small"
      >
        <el-table-column label="居委街道名称" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="distributor" label="关联店铺" width="480">
          <template slot-scope="scope">
            <span
              v-for="(item, index) in scope.row.distributor"
              :key="index"
              class="storeL"
              style="
                padding: 4px 10px;
                color: #fff;
                background-color: #1480e3;
                border-radius: 5px;
                margin: 5px;
              "
            >
              {{ item }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="地区">
          <template slot-scope="scope">
            <span>{{
              (scope.row.province || '') +
              ' ' +
              (scope.row.city || '') +
              ' ' +
              (scope.row.area || '')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.parent_id === '0'" type="text" @click="append(scope.row)">
              新增居委
            </el-button>
            <el-button type="text" @click="editCategory(scope.row)"> 编辑 </el-button>
            <el-button type="text" @click.native.prevent="deleteCategory(scope.row)">
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
  </SpPage>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDistributorList } from '@/api/marketing'
import {
  getSubDistrictList,
  getSubDistrictInfo,
  updateSubDistrictInfo,
  addSubDistrictInfo,
  deleteSubDistrictInfo
} from '@/api/subdistrict'
import { getAddress } from '@/api/common'
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
      // params: [],
      imgDialog: false,
      isGetImage: false,
      current: '',
      dialog: {
        visible: false,
        label: '',
        is_hassuperior: false,
        superior_cat_name: '',
        superior_cat_id: '',
        sort: 0,
        current_id: '',
        cat_img: '',
        loading: false,
        type: 'add',
        distributor_id: [],
        address: ''
      },
      distributorList: [],
      addList: [],
      params: {
        label: ''
      }
    }
  },
  computed: {
    ...mapGetters([ 'login_type'])
  },

  mounted() {
    this.getCategory()
    this.getDistributor()
    this.getAddress()
  },
  methods: {
    // getList(){
    //   getSubDistrictList
    // },
    onSearch() {
      this.getCategory()
    },
    getAddress() {
      this.loading = true
      getAddress().then(response => {
        this.loading = false
        // console.log('res===', response)
        const data = response.data.data

        if (data && data.length > 0) {
          const province = data.map(item => {
            return {
              label: item.label,
              value: item.value
            }
          })
          let city = []
          data.forEach(item => {
            city = city.concat(
              item.children.map(item2 => {
                return {
                  label: item2.label,
                  value: item2.value
                }
              })
            )
          })
          let area = []
          data.forEach(item => {
            item.children.forEach(item2 => {
              area = area.concat(
                ...item2.children.map(item3 => {
                  return {
                    label: item3.label,
                    value: item3.value
                  }
                })
              )
            })
          })
          this.addList = data
          this.province = province
          this.city = city
          this.area = area
        }
      })
    },
    append(row) {
      console.log('append', row)
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: true,
        superior_cat_name: row.label,
        superior_cat_id: row.category_id,
        current_id: row.id,
        type: 'add',
        label: '',
        title: '居委'
      }
    },
    editCategory(row) {
      console.log('editCategory', row)
      this.dialog = {
        ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'edit',
        current_id: row.id,
        distributor_id: row.distributor_id,
        label: row.label,
        parent_id: row.parent_id,
        title: row.parent_id == 0 ? '街道' : '居委',
        address: row.regions_id
      }
    },
    handleDeleteImg() {
      this.dialog.cat_img = null
    },
    handleSubmit() {
      // console.log('-----', this.dialog)
      const _this = this
      const { label, type, current_id, parent_id, distributor_id, address, is_hassuperior, title } =
        this.dialog
      if (!is_hassuperior && title == '街道' && !address) {
        this.$message.error('地区必选！')
        return
      }
      // debugger
      if (!label) {
        this.$message.error('名称必填！')
        return
      } else {
        this.dialog.loading = true
        let query = {}
        if (!is_hassuperior && title == '街道') {
          const province = this.province.find(item => item.value === address[0])
          const city = this.city.find(item => item.value === address[1])
          const area = this.area.find(item => item.value === address[2])
          if (!province || !city || !area) {
            this.$message.error('选择的地区不存在！')
          }
          query.regions_id = address
          query.province = province.label
          query.city = city.label
          query.area = area.label
        }
        if (type === 'add') {
          //添加
          query = {
            ...query,
            ...{
              label: label,
              parent_id: current_id || 0,
              distributor_id
            }
          }
          // console.log('query===', query)
          // return
          addSubDistrictInfo(query)
            .then(res => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                label: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch(err => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        } else {
          query = {
            ...query,
            ...{
              id: current_id,
              label,
              parent_id,
              distributor_id
            }
          }
          // console.log('query===', query)
          updateSubDistrictInfo(query)
            .then(res => {
              _this.dialog = {
                ..._this.dialog,
                loading: false,
                visible: false,
                label: '',
                cat_img: '',
                sort: 0,
                is_hassuperior: false,
                superior_cat_id: '',
                superior_cat_name: ''
              }
              _this.getCategory()
            })
            .catch(err => {
              if (err) {
                _this.dialog.loading = false
              }
            })
        }
      }
    },
    getDistributor() {
      var params = { page: 1, pageSize: 500 }
      getDistributorList(params).then(response => {
        if (response.data.data.list) {
          this.distributorList = response.data.data.list.map(item => {
            return {
              ...item,
              distributor_id: item.distributor_id + ''
            }
          })
        }
      })
    },
    getCategory() {
      this.loading = true
      getSubDistrictList(this.params).then(response => {
        // debugger
        this.categoryList = response.data.data
        this.categoryList.forEach(d => {
          d.distributor_list = d.distributor_id.map((dd, index) => {
            return {
              id: dd + '',
              name: d.distributor[index]
            }
          })
          d.distributor_id = d.distributor_id.map(item => {
            return item + ''
          })
        })
        this.loading = false
        this.spaceInput = false
      })
    },
    deleteCategory(data) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (typeof data.id != 'undefined') {
            deleteSubDistrictInfo(data.id).then(response => {
              this.$message({
                type: 'success',
                message: '删除分类成功'
              })
              this.getCategory()
            })
          } else {
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

    appendTop(data) {
      this.dialog = {
        // ...this.dialog,
        visible: true,
        is_hassuperior: false,
        type: 'add',
        label: '',
        distributor_id: [],
        parent_id: 0,
        title: '街道'
      }
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
<style lang="scss">
.el-table__indent {
  padding-left: 30px !important;
}
// .el-table__expand-icon {
//   .el-icon-arrow-right {
//     font-family: 'iconfont' !important;
//     font-size: 16px;
//     font-style: normal;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;

//     &::before {
//       content: '\e65f';
//       color:#ff0;
//     }
//   }
// }
// .el-table__expand-icon {
//   &.el-table__expand-icon--expanded {
//     transform: rotate(0deg);
//     transition: all 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
//     .el-icon-arrow-right {
//       &::before {
//         content: '\e655';
//         color:#ff0;
//       }
//     }
//   }
// }
</style>
