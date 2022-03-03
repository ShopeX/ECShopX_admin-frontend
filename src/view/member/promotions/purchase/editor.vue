<template>
  <div>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="110px"
    >
      <el-form-item label="活动名称：">
        <el-input
          v-model="form.purchase_name"
          style="width: 400px"
          maxlength="30"
          type="textarea"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="活动封面：">
        <div class="frm-tips">
          建议上传尺寸大小为300*300且格式为png、jpg图片；文件大小为2M内。
        </div>
        <div>
          <imgBox
            :img-url="form.ad_pic"
            inline
            @click="handleImgChange"
          />
        </div>
        <imgPicker
          :dialog-visible="imgDialog"
          :sc-status="isGetImage"
          @chooseImg="pickImg"
          @closeImgDialog="closeImgDialog"
        />
      </el-form-item>
      <el-form-item label="活动时间：">
        <el-col :span="20">
          <el-date-picker
            v-model="activity_date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="适用角色：">
        <el-checkbox-group v-model="form.used_roles">
          <el-checkbox
            v-for="roleItem in roleArr"
            :key="roleItem.key"
            :label="roleItem.key"
            :disabled="roleItem.key === 'employee'"
            :value="roleItem.key"
          >
            {{ roleItem.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div style="display: flex">
        <el-form-item label="员工额度：">
          <el-input
            v-model="form.employee_limitfee"
            style="width: 240px"
          >
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="form.used_roles.includes('dependents')">
          <el-checkbox v-model="form.is_share_limitfee">
            是否共享额度
          </el-checkbox>
        </el-form-item>
      </div>
      <el-form-item
        v-if="form.used_roles.includes('dependents') && !form.is_share_limitfee"
        label="家属额度："
      >
        <el-input
          v-model="form.dependents_limitfee"
          style="width: 240px"
        >
          <template slot="append">
            元
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        v-if="form.used_roles.includes('dependents')"
        label="员工邀请上限："
      >
        <el-input
          v-model="form.dependents_limit"
          style="width: 240px"
        >
          <template slot="append">
            人
          </template>
        </el-input>
      </el-form-item>
      <el-card
        header="活动商品"
        shadow="naver"
      >
        <el-form-item label="适用商品">
          <el-radio-group
            v-model="form.item_type"
            @change="itemTypeChange"
          >
            <el-radio label="all">
              全部商品
            </el-radio>
            <el-radio label="item">
              指定商品适用
            </el-radio>
            <el-radio label="category">
              指定分类适用
            </el-radio>
            <el-radio label="tag">
              指定商品标签适用
            </el-radio>
            <el-radio label="brand">
              指定品牌适用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="!allHiden"
          label="每人限购："
        >
          <el-input
            v-model="allLimit"
            style="width: 240px"
          >
            <template slot="append">
              件
            </template>
          </el-input>
        </el-form-item>
        <div v-if="!zdItemHidden">
          <div style="position: relative">
            <div style="position: absolute; bottom: 0px; left: 112px">
              <el-upload
                style="display: inline-block"
                action=""
                :on-change="uploadHandleChange"
                :auto-upload="false"
                :show-file-list="false"
              >
                <el-button type="primary">
                  批量上传
                </el-button>
              </el-upload>
              <el-button
                style="margin-left: 10px"
                type="primary"
                @click="uploadHandleTemplate()"
              >
                下载模板
              </el-button>
            </div>
            <SkuSelector
              :data="relItems"
              @change="getItems"
            />
          </div>
          <el-button
            type="primary"
            plain
            style="margin-top: 10px"
            @click="dialogFormVisible = true"
          >
            批量设置
          </el-button>
          <el-table
            key="currentGoodKey"
            :data="good.currentGoods"
          >
            <el-table-column
              prop="item_id"
              label="ID"
              width="180"
            />
            <el-table-column
              prop="itemName"
              label="商品名称"
              width="180"
            />
            <el-table-column
              prop="item_spec_desc"
              label="规格"
              width="180"
            />
            <el-table-column
              prop="limit_num"
              label="每人限购"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_num"
                  @input="inputChange(scope.$index, 'good.currentGoods')"
                >
                  <template slot="append">
                    件
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="limit_fee"
              label="每人限额"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_fee"
                  @input="inputChange(scope.$index, 'good.currentGoods')"
                >
                  <template slot="append">
                    元
                  </template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-col v-if="!categoryHidden">
          <div>
            <div style="width: 300px">
              <treeselect
                v-model="item_category"
                :options="categoryList"
                :show-count="true"
                :multiple="true"
                :disable-branch-nodes="true"
                :clearable="false"
                value-format="object"
              />
            </div>
            <el-button
              type="primary"
              plain
              style="margin-top: 10px"
              @click="dialogFormVisible = true"
            >
              批量设置
            </el-button>
            <el-table
              key="categoryKey"
              :data="item_category"
            >
              <el-table-column
                prop="category_id"
                label="ID"
                width="180"
              />
              <el-table-column
                prop="category_name"
                label="分类名称"
                width="180"
              />
              <el-table-column
                label="每人限购"
                width="280"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.limit_num"
                    @input="inputChange(scope.$index, 'item_category')"
                  >
                    <template slot="append">
                      件
                    </template>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="limit_fee"
                label="每人限额"
                width="280"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.limit_fee"
                    @input="inputChange(scope.$index, 'item_category')"
                  >
                    <template slot="append">
                      元
                    </template>
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
        <template v-if="!tagHidden">
          <div class="view-flex">
            <div class="label">
              未选标签：
            </div>
            <el-tag
              v-for="(tag, index) in tag.tags"
              :key="index"
              class="tag-item"
              size="medium"
              color="#ffffff"
              :disable-transitions="false"
              @click.native="tagAdd(tag, index)"
            >
              {{ tag.tag_name }}
            </el-tag>
          </div>
          <div
            class="selected-tags view-flex"
            style="margin-top: 10px"
          >
            <div class="label">
              已选标签：
            </div>
            <div class="view-flex-item">
              <el-tag
                v-for="(tag, index) in tag.currentTags"
                :key="index"
                closable
                size="small"
                :disable-transitions="false"
                @close="tagRemove(index)"
              >
                {{ tag.tag_name }}
              </el-tag>
            </div>
          </div>
          <el-button
            type="primary"
            plain
            style="margin-top: 10px"
            @click="dialogFormVisible = true"
          >
            批量设置
          </el-button>
          <el-table
            key="currentTagKey"
            :data="tag.currentTags"
          >
            <el-table-column
              prop="tag_id"
              label="ID"
              width="180"
            />
            <el-table-column
              prop="tag_name"
              label="标签名称"
              width="180"
            />
            <el-table-column
              prop="limit_num"
              label="每人限购"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_num"
                  @input="inputChange(scope.$index, 'tag.currentTags')"
                >
                  <template slot="append">
                    件
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="limit_fee"
              label="每人限额"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_fee"
                  @input="inputChange(scope.$index, 'tag.currentTags')"
                >
                  <template slot="append">
                    元
                  </template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <template v-if="!brandHidden">
          <div class="view-flex">
            <div class="label">
              未选品牌：
            </div>
            <div class="view-flex-item">
              <el-tag
                v-for="(brand, index) in brand.brands"
                :key="index"
                class="tag-item"
                size="medium"
                color="#ffffff"
                :disable-transitions="false"
                @click.native="brandAdd(brand, index)"
              >
                {{ brand.attribute_name }}
              </el-tag>
            </div>
          </div>

          <div
            class="selected-tags view-flex"
            style="margin-top: 10px"
          >
            <div class="label">
              已选品牌：
            </div>
            <div class="view-flex-item">
              <el-tag
                v-for="(brand, index) in brand.currentBrands"
                :key="index"
                closable
                size="small"
                :disable-transitions="false"
                @close="brandRemove(index)"
              >
                {{ brand.attribute_name }}
              </el-tag>
            </div>
          </div>
          <el-button
            type="primary"
            plain
            style="margin-top: 10px"
            @click="dialogFormVisible = true"
          >
            批量设置
          </el-button>
          <el-table
            key="currentBrandKey"
            :data="brand.currentBrands"
          >
            <el-table-column
              prop="attribute_id"
              label="ID"
              width="180"
            />
            <el-table-column
              prop="attribute_name"
              label="品牌名称"
              width="180"
            />
            <el-table-column
              prop="limit_num"
              label="每人限购"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_num"
                  @input="inputChange(scope.$index, 'brand.currentBrands')"
                >
                  <template slot="append">
                    件
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="limit_fee"
              label="每人限额"
              width="280"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.limit_fee"
                  @input="inputChange(scope.$index, 'brand.currentBrands')"
                >
                  <template slot="append">
                    元
                  </template>
                </el-input>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-dialog
          title="批量设置限购"
          :visible="dialogFormVisible"
          width="500px"
          @close="dialogClose"
        >
          <el-form
            key="dialogFormKey"
            :model="dialogForm"
          >
            <el-form-item
              label="每人限购："
              style="display: flex"
            >
              <el-input
                v-model="dialogForm.limit_num"
                autocomplete="off"
              >
                <template slot="append">
                  件
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="每人限额："
              style="display: flex"
            >
              <el-input
                v-model="dialogForm.limit_fee"
                autocomplete="off"
              >
                <template slot="append">
                  元
                </template>
              </el-input>
            </el-form-item>
            <div>设置后将更新所有参与活动的商品规格限购数量</div>
          </el-form>
          <div
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="dialogFormVisible = false">
              取 消
            </el-button>
            <el-button
              type="primary"
              @click="dialogFormConfirm()"
            >
              确 定
            </el-button>
          </div>
        </el-dialog>
      </el-card>
      <div class="content-center">
        <el-button
          type="primary"
          @click="submitActivityAction()"
        >
          保存
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import imgBox from '@/components/element/imgBox'
import imgPicker from '@/components/imageselect'
import SkuSelector from '@/components/function/skuSelector'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { handleUploadFile, exportUploadTemplate } from '@/api/common'
import { getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { createPurchase, editPurchase, getPurchaseInfo } from '@/api/purchase'

export default {
  inject: ['refresh'],
  components: {
    imgBox,
    imgPicker,
    SkuSelector,
    Treeselect
  },
  data () {
    return {
      form: {
        purchase_id: '',
        purchase_name: '',
        ad_pic: '',
        item_type: 'all',
        tag_ids: [],
        begin_time: '',
        end_time: '',
        employee_limitfee: '',
        dependents_limit: '',
        dependents_limitfee: '',
        is_share_limitfee: false,
        used_roles: ['employee'],
        item_limit: ''
      },
      activity_date: [],
      rules: {},
      imgDialog: false,
      isGetImage: false,
      roleArr: [
        { key: 'employee', name: '员工' },
        { key: 'dependents', name: '家属' }
      ],
      allHiden: false,
      allLimit: '',
      zdItemHidden: true,
      relItems: [],
      categoryHidden: true,
      categoryList: [],
      item_category: [],
      good: {
        currentGoods: []
      },
      tagHidden: true,
      tag: {
        list: [],
        currentTags: [],
        tags: []
      },
      brandHidden: true,
      brand: {
        list: [],
        currentBrands: [],
        brands: []
      },
      ItemsList: [],
      dialogFormVisible: false,
      dialogForm: {
        limit_num: '',
        limit_fee: ''
      },
      invalidItemsList: [],
      itemTreeLists: []
    }
  },

  mounted () {
    this.fetchMainCate()
    this.getAllTagLists()
    this.getBrandList('', true)
    if (this.$route.query.id) {
      let filter = { purchase_id: this.$route.query.id }
      getPurchaseInfo(filter).then((res) => {
        this.form = res.data.data
        const { used_roles, dependents_limitfee, employee_limitfee, item_limit } = this.form
        this.form.used_roles = eval(used_roles)
        this.form.dependents_limitfee = (dependents_limitfee / 100).toFixed(2)
        this.form.employee_limitfee = (employee_limitfee / 100).toFixed(2)
        if (Array.isArray(item_limit) && item_limit.length > 0) {
          this.form.item_limit = item_limit.map((item) => {
            item.limit_fee = (item.limit_fee / 100).toFixed(2)
            return item
          })
        }
        this.activity_date = [this.form.begin_date, this.form.end_date]
        if (this.form.item_type === 'category') {
          this.categoryHidden = false
          this.allHiden = true
          this.item_category = this.form.item_limit.map((item) => {
            item.category_id = item.item_id
            item.category_name = item.name
            return item
          })
        }
        if (this.form.item_type === 'tag') {
          this.tagHidden = false
          this.allHiden = true
          this.tag.currentTags = this.form.item_limit.map((item) => {
            item.tag_id = item.item_id
            item.tag_name = item.name
            return item
          })
        }
        if (this.form.item_type === 'brand') {
          this.brandHidden = false
          this.allHiden = true
          this.brand.currentBrands = this.form.item_limit.map((item) => {
            item.attribute_id = item.item_id
            item.attribute_name = item.name
            return item
          })
        }
        if (this.form.item_type === 'item') {
          this.zdItemHidden = false
          this.allHiden = true
          this.$nextTick(() => {
            this.relItems = res.data.data.itemTreeLists
          })
        }
        if (this.form.item_type === 'all') {
          this.allHiden = false
          this.allLimit = this.form.item_limit
        }
      })
    }
  },

  methods: {
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg (data) {
      if (data.image_type !== 'image/jpeg' && data.image_type !== 'image/png') {
        this.$message({
          type: 'warning',
          message: '仅支持格式为png、jpg的图片'
        })
        return
      }
      this.form.ad_pic = data.url
      this.imgDialog = false
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    itemTypeChange: function (val) {
      this.allHiden = true
      this.zdItemHidden = true
      this.categoryHidden = true
      this.tagHidden = true
      this.brandHidden = true
      this.itemTreeLists = []
      this.item_category = []
      this.tag.currentTags = []
      this.form.item_type = val
      this.dialogForm = {
        limit_num: '',
        limit_fee: ''
      }
      if (val === 'item') {
        this.zdItemHidden = false
        this.good.currentGoods = []
      } else if (val === 'category') {
        this.categoryHidden = false
        this.item_category = []
      } else if (val === 'tag') {
        this.tagHidden = false
        this.tag.currentTags = []
        this.showTags()
      } else if (val === 'brand') {
        this.brandHidden = false
        this.brand.currentBrands = []
        this.showBrands()
      } else if (val === 'all') {
        this.allHiden = false
      }
    },
    fetchMainCate: function () {
      getCategory({ is_main_category: true, ignore_none: true }).then((response) => {
        this.categoryList = response.data.data
      })
    },
    getItems (data) {
      const { item_limit } = this.form
      if (Array.isArray(item_limit) && item_limit.length > 0) {
        this.good.currentGoods = data.map((item) => {
          this.form.item_limit.forEach((limitItem) => {
            if (item.itemId === limitItem.item_id) {
              item.limit_fee = limitItem.limit_fee
              item.limit_num = limitItem.limit_num
            }
          })
          return item
        })
      } else {
        this.good.currentGoods = data
      }
    },
    dialogClose () {
      this.dialogFormVisible = false
    },
    inputChange (index, arr) {
      const curObj = eval('this.' + arr)
      const tempObj = curObj[index]
      this.$set(curObj, index, tempObj)
      this.$forceUpdate()
    },

    /**
     * 上传模板
     * */
    uploadHandleChange (file, fileList) {
      console.log('file', file)
      let params = { isUploadFile: true, file_type: 'purchase_goods', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `以下商品编号不存在：${str}`,
              type: 'error',
              duration: 100000
            })
          }, 1500)
        }
        if (data.succ.length <= 0) return
        this.relItems = data.succ
        let list = []
        data.succ.forEach((item) => {
          if (!item.nospec) {
            list.push(Object.assign(item, { spec_items: [] }))
          } else {
            list.push(item)
          }
        })
      })
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate () {
      let params = { file_type: 'purchase_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then((response) => {
        let { data } = response.data
        if (data.file) {
          var a = document.createElement('a')
          a.href = data.file
          a.download = data.name
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else {
          this.$message({
            type: 'error',
            message: '没有相关数据可导出'
          })
        }
      })
    },
    getAllTagLists: function () {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
        this.showTags()
      })
    },
    showTags: function () {
      let remainTags = []
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr == -1) remainTags.push(item)
      })
      this.tag.tags = remainTags
    },
    tagAdd: function (item, index) {
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
      })
    },
    tagRemove: function (index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      let tagItems = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
        let items = []
        this.ItemsList.forEach((i) => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) items.push(i)
        })
        tagItems = items
      })
      this.ItemsList = tagItems
      this.getItems(this.ItemsList)
    },
    // 获取品牌列表
    getBrandList: function (searchVal = '', isInit = false) {
      const list = []
      getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal,
        attribute_ids: isInit ? this.form.brand_id : ''
      }).then((res) => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brand.list = list
        this.showBrands()
      })
    },
    showBrands: function () {
      let remainBrands = []
      this.brand.brands = [...this.brand.list]
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
        if (isInArr == -1) remainBrands.push(item)
      })
      this.brand.brands = remainBrands
    },
    brandRemove: function (index) {
      let items = []
      this.ItemsList.forEach((item) => {
        if (this.brand.currentBrands[index].attribute_id != item.brand_id) items.push(item)
      })
      this.ItemsList = items
      this.getItems(this.ItemsList)

      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
    },
    brandAdd: function (item, index) {
      let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
    },
    submitActivityAction () {
      const that = this
      if (this.activity_date.length > 0) {
        this.form.begin_time = this.activity_date[0]
        this.form.end_time = this.activity_date[1]
      } else {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      if (this.form.item_type === 'brand') {
        const newArr = this.brand.currentBrands.map((item) => {
          const newItem = {}
          newItem.id = item.attribute_id
          newItem.limit_fee = item.limit_fee
          newItem.limit_num = item.limit_num
          return newItem
        })
        this.form.item_limit = newArr
      }
      if (this.form.item_type === 'tag') {
        const newArr = this.tag.currentTags.map((item) => {
          const newItem = {}
          newItem.id = item.tag_id
          newItem.limit_fee = item.limit_fee
          newItem.limit_num = item.limit_num
          return newItem
        })
        this.form.item_limit = newArr
      }
      if (this.form.item_type === 'category') {
        const newArr = this.item_category.map((item) => {
          const newItem = {}
          newItem.id = item.category_id
          newItem.limit_fee = item.limit_fee
          newItem.limit_num = item.limit_num
          return newItem
        })
        this.form.item_limit = newArr
      }
      if (this.form.item_type === 'item') {
        const newArr = this.good.currentGoods.map((item) => {
          const newItem = {}
          newItem.id = item.itemId
          newItem.limit_fee = item.limit_fee
          newItem.limit_num = item.limit_num
          return newItem
        })
        this.form.item_limit = newArr
      }

      if (this.form.item_type === 'all') {
        this.form.item_limit = this.allLimit
      }
      // console.log('this.form==>', this.form)
      // return
      if (this.form.purchase_id) {
        editPurchase(this.form).then((res) => {
          if (res.data.data.purchase_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      } else {
        createPurchase(this.form).then((res) => {
          if (res.data.data.purchase_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.refresh()
                that.$router.go(-1)
              }
            })
          } else {
            this.$message.error('保存失败!')
            return false
          }
        })
      }
    },
    // 批量设置限购
    dialogFormConfirm () {
      const type = this.form.item_type
      let currentArr = []
      const { limit_num, limit_fee } = this.dialogForm
      switch (type) {
        case 'item':
          currentArr = this.good.currentGoods
          break
        case 'tag':
          currentArr = this.tag.currentTags
          break
        case 'category':
          currentArr = this.item_category
          break
        case 'brand':
          currentArr = this.brand.currentBrands
          break
        default:
          break
      }
      currentArr.forEach((item, index) => {
        item.limit_num = limit_num
        item.limit_fee = limit_fee
        this.$set(currentArr, index, item)
        this.$forceUpdate()
      })
      this.dialogFormVisible = false
    }
  }
}
</script>
<style scoped lang="scss"></style>
<style type="text/css" lang="scss"></style>
