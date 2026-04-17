<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage :title="$t('f5a87ec7.bfa895')">
    <el-form ref="form" :model="form" class="box-set" label-width="120px">
      <el-card shadow="naver">
        <el-form-item
          :label="$t('f5a87ec7.d7ec2d')"
          prop="limit_name"
          :rules="{ required: true, message: this.$t('f5a87ec7.411cac'), trigger: 'blur' }"
        >
          <el-col :span="20">
            <el-input
              v-model="form.limit_name"
              :maxlength="30"
              :placeholder="$t('f5a87ec7.017ce7')"
            />
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('f5a87ec7.5a0c6c')">
          <el-input v-model="rule.day" :maxlength="30" class="inline-input" style="width: 100px" />
          {{ $t('f5a87ec7.7c55f8') }}
          <el-input
            v-model="rule.limit"
            :maxlength="30"
            class="inline-input"
            style="width: 100px"
          />
          {{ $t('f5a87ec7.f7edf5') }}
          <p class="frm-tips">
            {{ $t('f5a87ec7.dc6744') }}
          </p>
        </el-form-item>
        <el-form-item :label="$t('f5a87ec7.6dbb6f')">
          <el-checkbox-group v-model="validGrade">
            <el-checkbox
              v-for="grade in memberGrade"
              :key="grade.grade_id"
              :label="String(grade.grade_id)"
            >
              {{ grade.grade_name }}
            </el-checkbox>
            <el-checkbox
              v-for="vipdata in vipGrade"
              :key="vipdata.lv_type"
              :label="String(vipdata.lv_type)"
            >
              {{ $t('f5a87ec7.310f84') }}{{ vipdata.grade_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('f5a87ec7.bb114a')">
          <el-col :span="20">
            <el-date-picker
              v-model="activity_date"
              type="datetimerange"
              :range-separator="$t('f5a87ec7.981cbe')"
              :start-placeholder="$t('f5a87ec7.fc92e9')"
              :end-placeholder="$t('f5a87ec7.1fa23f')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            />
          </el-col>
        </el-form-item>
      </el-card>
      <el-card :header="$t('f5a87ec7.ffbe83')" shadow="naver">
        <el-form-item :label="$t('f5a87ec7.409ea3')">
          <el-radio-group v-model="form.use_bound" @change="itemTypeChange">
            <el-radio label="goods"> {{ $t('f5a87ec7.1e0568') }} </el-radio>
            <el-radio label="category"> {{ $t('f5a87ec7.4e4c10') }} </el-radio>
            <el-radio label="tag"> {{ $t('f5a87ec7.d61cbb') }} </el-radio>
            <el-radio label="brand"> {{ $t('f5a87ec7.8f5e18') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="!zdItemHidden" style="position: relative">
          <SkuSelector :data="relItems" @change="getItems" />
          <div style="position: absolute; bottom: 0px; left: 112px">
            <el-upload
              style="display: inline-block; height: 0"
              action=""
              :on-change="uploadHandleChange"
              :auto-upload="false"
              :show-file-list="false"
            >
              <el-button type="primary"> {{ $t('f5a87ec7.c3202e') }} </el-button>
            </el-upload>
            <el-button style="margin-left: 10px" type="primary" @click="uploadHandleTemplate()">
              {{ $t('f5a87ec7.c3f9a1') }}
            </el-button>
          </div>
        </div>
        <el-col :xs="12" :sm="12" :md="12">
          <div v-if="!categoryHidden" style="height: 350px">
            <treeselect
              v-model="form.item_category"
              :no-results-text="$t('f5a87ec7.0ee4df')"
              :options="categoryList"
              :show-count="true"
              :multiple="true"
              :disable-branch-nodes="true"
              :clearable="false"
              @select="categorySelect"
              @deselect="categoryDeselect"
            />
          </div>
        </el-col>
        <template v-if="!tagHidden">
          <div class="selected-tags view-flex">
            <div class="label">{{ $t('f5a87ec7.e98819') }}</div>
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
          <div>
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
        </template>
        <template v-if="!brandHidden">
          <div class="selected-tags view-flex">
            <div class="label">{{ $t('f5a87ec7.f5bf1f') }}</div>
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
          <div>
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
        </template>
      </el-card>
      <!-- <el-card
      header="无效商品（已参加其他活动）"
      shadow="naver"
    >
      <el-table
        v-if="invalidItemsList.length > 0"
        :data="invalidItemsList"
        style="line-height: normal"
      >
        <el-table-column
          label="ID"
          prop="item_id"
          width="60"
        />
        <el-table-column
          label="名称"
          prop="itemName"
        />
        <el-table-column
          label="规格"
          prop="item_spec_desc"
        />
        <el-table-column label="操作" width="50">
                  <template slot-scope="scope">
                    <i class="el-icon-delete" @click="deleteItemRow(scope.$index, form.items)"></i>
                  </template>
                </el-table-column>
      </el-table>
    </el-card> -->
    </el-form>
    <div slot="page-footer" class="text-center">
      <el-button v-if="hasSaveButton" type="primary" @click="submitActivityAction()">
        {{ $t('f5a87ec7.be5fbb') }}
      </el-button>
      <el-button @click.native="handleCancel"> {{ $t('f5a87ec7.5f4112') }} </el-button>
    </div>
  </SpPage>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import SkuSelector from '@/components/function/skuSelector'
import { getGradeList } from '../../../../api/membercard'
import { listVipGrade } from '../../../../api/cardticket'
import {
  createLimitPromotions,
  getLimitPromotionsInfo,
  updateLimitPromotions,
  seckillActivityGetItemsList
} from '../../../../api/promotions'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../../api/common'
import { transformTree } from '@/utils'

export default {
  components: {
    SkuSelector,
    Treeselect
  },
  inject: ['refresh'],
  data() {
    return {
      relItems: [],
      activity_date: '',
      validGrade: [],
      vipGrade: [],
      memberGrade: [],
      rule: {
        day: 0,
        limit: 1
      },
      form: {
        limit_name: '',
        items: [],
        start_time: 0,
        end_time: 0,
        valid_grade: [],
        use_bound: 'goods',
        item_category: [],
        tag_ids: [],
        brand_ids: []
      },
      relMain: [],
      setMainStatus: false,
      mainVisible: false,
      hasSaveButton: true,
      zdItemHidden: false,
      categoryHidden: true,
      categoryList: [],
      tagHidden: true,
      tag: {
        list: [],
        form: {
          tag_ids: []
        },
        currentTags: [],
        tags: []
      },
      brandHidden: true,
      brand: {
        list: [],
        form: {
          brand_ids: []
        },
        currentBrands: [],
        brands: []
      },
      ItemsList: [],
      invalidItemsList: [],
      params: {
        page: 1,
        pageSize: -1,
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        category: 0,
        is_warning: false,
        tag_id: '',
        is_gift: 'all',
        type: 0,
        is_sku: 'true',
        item_id: ''
      }
    }
  },
  mounted() {
    this.getListVipGrade()
    this.getGradeList()
    if (this.$route.query.isshow) {
      this.hasSaveButton = false
    }
    if (this.$route.params.limit_id) {
      this.getLimitPromotionsInfo(this.$route.params.limit_id)
    }
    this.fetchMainCate()
    this.getAllTagLists()
    this.getBrandList('', true)
  },
  methods: {
    submitActivityAction() {
      const that = this
      if (this.activity_date.length > 0) {
        this.form.start_time = this.activity_date[0]
        this.form.end_time = this.activity_date[1]
      }

      this.form.valid_grade = this.normalizeValidGradeForSubmit(this.validGrade)
      this.form.day = this.rule.day
      this.form.limit = this.rule.limit
      let res = JSON.parse(JSON.stringify(this.form))
      if (res.use_bound != 'goods') {
        res.items = []
      }
      if (this.$route.params.limit_id) {
        updateLimitPromotions(this.$route.params.limit_id, res)
          .then((response) => {
            this.loading = false
            this.$message({
              message: this.$t('f5a87ec7.69be67'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          })
          .catch()
      } else {
        createLimitPromotions(res)
          .then((response) => {
            this.loading = false
            this.$message({
              message: this.$t('f5a87ec7.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          })
          .catch()
      }
    },
    getItems(data) {
      let items = []
      data.forEach((item) => {
        items.push(item.itemId)
      })
      this.form.items = items
      console.log(this.form.items)
    },
    getLimitPromotionsInfo(id) {
      getLimitPromotionsInfo(id).then((response) => {
        let res = response.data.data
        let data = {
          limit_name: res.limit_name,
          item_category: res.item_category,
          tag_ids: res.tag_ids,
          tag_list: res.tag_list,
          brand_ids: res.brand_ids,
          brand_list: res.brand_list,
          rel_brand_ids: res.rel_brand_ids,
          rel_category_ids: res.rel_category_ids,
          rel_tag_ids: res.rel_tag_ids
        }
        Object.assign(this.form, data)
        this.rule = JSON.parse(response.data.data.rule)
        this.relItems = response.data.data.itemTreeLists
        this.validGrade = this.normalizeValidGradeForView(response.data.data.valid_grade)
        this.activity_date = [response.data.data.start_time, response.data.data.end_time]
        this.zdItemHidden = true
        this.categoryHidden = true
        this.tagHidden = true
        this.brandHidden = true
        if (response.data.data.use_bound == 1) {
          this.form.use_bound = 'goods'
          this.zdItemHidden = false
        }

        if (response.data.data.use_bound == 2) {
          this.form.use_bound = 'category'
          this.categoryHidden = false
          this.generateSku()
        }

        if (response.data.data.use_bound == 3) {
          this.form.use_bound = 'tag'
          this.tagHidden = false
          this.tag.currentTags = response.data.data.tag_list || []
          this.showTags()
          this.generateSku()
        }

        if (response.data.data.use_bound == 4) {
          this.form.use_bound = 'brand'
          this.brandHidden = false
          this.brand.currentBrands = response.data.data.brand_list || []
          this.showBrands()
          this.generateSku()
        }
      })
    },
    handleCancel() {
      this.$router.back(-1)
    },
    getListVipGrade() {
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGrade = response.data.data
        }
      })
    },
    getGradeList() {
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          var result = response.data.data
          if (result) {
            this.memberGrade = result
          }
        }
      })
    },
    normalizeValidGradeForView(list = []) {
      if (!Array.isArray(list)) return []
      return list.map((item) => String(item))
    },
    normalizeValidGradeForSubmit(list = []) {
      if (!Array.isArray(list)) return []
      return list.map((item) => {
        const value = String(item)
        return /^\d+$/.test(value) ? Number(value) : value
      })
    },
    itemTypeChange: function (val) {
      this.params.main_cat_id = ''
      this.params.tag_id = ''
      this.params.brand_id = ''
      this.zdItemHidden = true
      this.categoryHidden = true
      this.tagHidden = true
      this.brandHidden = true
      this.form.items = []
      this.invalidItemsList = []
      this.form.rel_item_ids = []
      this.form.itemTreeLists = []
      this.form.item_category = []
      this.form.item_category = []
      this.tag.currentTags = []
      if (val === 'goods') {
        this.zdItemHidden = false
      } else if (val === 'category') {
        this.form.rel_item_ids = []
        this.form.itemTreeLists = []
        this.categoryHidden = false
        this.form.item_category = []
      } else if (val === 'tag') {
        this.tagHidden = false
        this.tag.currentTags = []
        this.showTags()
      } else if (val === 'brand') {
        this.brandHidden = false
        this.brand.currentBrands = []
        this.showBrands()
      }
    },
    fetchMainCate: function () {
      getCategory({ is_main_category: true, ignore_none: true }).then((response) => {
        this.categoryList = transformTree(response.data.data, {
          id: 'category_id',
          label: 'category_name',
          children: 'children'
        })
      })
    },
    addItemTag: function () {
      this.tag.currentTags = []
      if (this.item_id.length) {
        this.showTags()
        this.tag.form.item_ids = this.item_id
      } else {
        this.$message({
          type: 'error',
          message: this.$t('f5a87ec7.c5f66d')
        })
      }
    },
    showTags: function () {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
    },
    tagRemove: function (index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      let tagItems = []
      let tagInvalidItems = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
        let items = []

        this.ItemsList.forEach((i) => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) items.push(i)
        })
        tagItems = items

        let invalidItems = []
        this.invalidItemsList.forEach((i) => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) invalidItems.push(i)
        })
        tagInvalidItems = invalidItems
      })
      this.ItemsList = tagItems
      this.invalidItemsList = tagInvalidItems
      this.getItems(this.ItemsList)
    },
    tagAdd: function (item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: this.$t('f5a87ec7.3e5ac0')
        })
        return false
      }
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.form.tag_ids.push(item.tag_id)
      })
      this.params.tag_id = item.tag_id
      this.getGoodsList()
    },
    getAllTagLists: function () {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
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
      })
    },
    showBrands: function () {
      this.brand.brands = [...this.brand.list]
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
        if (isInArr != -1) this.brand.brands.splice(index, 1)
      })
    },
    brandAdd: function (item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: this.$t('f5a87ec7.3e5ac0')
        })
        return false
      }
      let isInArr = this.brand.currentBrands.findIndex((n) => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
      this.params.brand_id = item.attribute_id
      this.getGoodsList()
    },
    brandRemove: function (index) {
      let items = []
      this.ItemsList.forEach((item) => {
        if (this.brand.currentBrands[index].attribute_id != item.brand_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach((i) => {
        if (this.brand.currentBrands[index].attribute_id != i.brand_id) invalidItems.push(i)
      })

      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)

      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
      this.form.brand_ids = []
      this.brand.currentBrands.forEach((item) => {
        this.form.brand_ids.push(item.attribute_id)
      })
    },
    getGoodsList: function () {
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.$route.params.limit_id) {
        params.activity_id = this.$route.params.limit_id
      }
      params.seckill_type = this.form.seckill_type
      params.activity_release_time = params.activity_start_time = this.activity_date[0]
      params.activity_end_time = this.activity_date[1]
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      seckillActivityGetItemsList(params).then((response) => {
        let itemList = response.data.data.list.validItems.concat(this.ItemsList)
        let invalidItemList = response.data.data.list.invalidItems.concat(this.invalidItemsList)
        let newItemList = []
        let invalidItems = []
        let obj = {}
        let obj1 = {}
        itemList.forEach((item) => {
          let tag_ids = []
          item.tagList.forEach((tag) => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj[item.item_id]) {
            newItemList.push(item)
            obj[item.item_id] = true
          }
        })
        invalidItemList.forEach((item) => {
          let tag_ids = []
          item.tagList.forEach((tag) => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj1[item.item_id]) {
            invalidItems.push(item)
            obj1[item.item_id] = true
          }
        })

        this.ItemsList = newItemList
        this.invalidItemsList = invalidItems
        this.getItems(this.ItemsList)
      })
    },
    categorySelect: function (node, instanceId) {
      this.params.main_cat_id = node.category_id
      this.getGoodsList()
    },
    categoryDeselect: function (node, instanceId) {
      let items
      items = []
      this.ItemsList.forEach((item, index) => {
        if (node.category_id != item.item_main_cat_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach((i) => {
        if (node.category_id != i.item_main_cat_id) invalidItems.push(i)
      })

      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)
    },
    generateSku() {
      let noSkuItem
      noSkuItem = []
      let response = []
      let goodsList = JSON.parse(JSON.stringify(this.relItems))
      goodsList.forEach((item) => {
        if (!item.nospec && item.spec_items.length === 0) {
          noSkuItem.push(item.default_item_id)
        }
      })
      if (noSkuItem.length > 0) {
        let param = this.params
        param.item_id = noSkuItem
        getItemsList(this.params).then((res) => {
          goodsList.forEach((item) => {
            if (!item.nospec) {
              res.data.data.list.forEach((sku) => {
                if (item.item_id === sku.default_item_id) {
                  item.spec_items.push(sku)
                }
              })
            }
          })
          goodsList.forEach((item) => {
            if (!item.nospec) {
              response = [...response, ...item.spec_items]
            } else {
              response = [...response, item]
            }
          })
          this.ItemsList = response
          this.getItems(response)
        })
      } else {
        goodsList.forEach((item) => {
          if (!item.nospec) {
            response = [...response, ...item.spec_items]
          } else {
            response = [...response, item]
          }
        })
        this.ItemsList = response
        this.getItems(response)
      }
    },
    /**
     * 下载模板
     * */
    uploadHandleTemplate() {
      let params = { file_type: 'marketing_goods', file_name: this.$t('f5a87ec7.e07423') }
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
            message: this.$t('f5a87ec7.bfd8d5')
          })
        }
      })
    },
    /**
     * 上传模板
     * */
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then((response) => {
        this.$message({
          type: 'success',
          message: this.$t('f5a87ec7.a7699b')
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map((item) => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `${this.$t('f5a87ec7.ef474d')}${str}`,
              type: 'error',
              duration: 5000
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
    }
  }
}
</script>
