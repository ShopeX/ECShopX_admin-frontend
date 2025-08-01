<template>
  <el-form ref="form" :model="form" class="box-set page-memberpreference" label-width="120px">
    <el-card header="基础信息" shadow="naver">
      <el-form-item
        label="名称"
        prop="marketing_name"
        :rules="{ required: true, message: '活动名称必填', trigger: 'blur' }"
      >
        <el-col :span="20">
          <el-input
            v-model="form.marketing_name"
            :disabled="form.status == 'waiting' ? false : true"
            :maxlength="30"
            placeholder="最多30个字"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="适用会员">
        <el-checkbox-group v-model="validGrade" :disabled="form.status == 'waiting' ? false : true">
          <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
            {{ grade.grade_name }}
          </el-checkbox>
          <el-checkbox v-for="vipdata in vipGrade" :key="vipdata.lv_type" :label="vipdata.lv_type">
            付费{{ vipdata.grade_name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="有效期">
        <el-col :span="20">
          <el-date-picker
            v-model="activity_date"
            :disabled="form.status == 'waiting' ? false : true"
            type="datetimerange"
            range-separator="至"
            start-placeholder="生效时间"
            end-placeholder="过期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-col>
      </el-form-item>
    </el-card>
    <el-card header="选择商品" shadow="naver">
      <el-form-item label="适用商品">
        <el-radio-group v-model="form.use_bound" @change="itemTypeChange">
          <el-radio label="goods"> 指定商品适用 </el-radio>
          <el-radio label="category"> 指定分类适用 </el-radio>
          <el-radio label="tag"> 指定商品标签适用 </el-radio>
          <el-radio label="brand"> 指定品牌适用 </el-radio>
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
            <el-button type="primary"> 批量上传 </el-button>
          </el-upload>
          <el-button style="margin-left: 10px" type="primary" @click="uploadHandleTemplate()">
            下载模板
          </el-button>
        </div>
      </div>
      <el-col :xs="12" :sm="12" :md="12">
        <div v-if="!categoryHidden" style="height: 350px">
          <treeselect
            v-model="form.item_category"
            :append-to-body="true"
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
          <div class="label">已选中标签：</div>
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
          <div class="label">已选中品牌：</div>
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
    <div class="content-center">
      <el-button v-if="hasSaveButton" type="primary" @click="submitActivityAction()">
        保存
      </el-button>
      <el-button @click.native="handleCancel"> 返回 </el-button>
    </div>
  </el-form>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import {
  addMarketingActivity,
  updateMarketingActivity,
  getMarketingActivityInfo,
  seckillActivityGetItemsList
} from '../../../../api/promotions'
import { getGradeList } from '../../../../api/membercard'
import { listVipGrade } from '../../../../api/cardticket'
import { getDefaultCurrency } from '../../../../api/company'
import SkuSelector from '@/components/function/skuSelector'
import { getItemsList, getCategory, getTagList, getGoodsAttr } from '@/api/goods'
import { handleUploadFile, exportUploadTemplate } from '../../../../api/common'
import store from '@/store'
import { transformTree } from '@/utils'
export default {
  inject: ['refresh'],
  components: {
    SkuSelector,
    Treeselect
  },
  data() {
    return {
      is_distributor: false,
      cursymbol: '￥',
      storeVisible: false,
      relItems: [],
      relStores: [],
      setStatus: false,
      form: {
        marketing_id: '',
        marketing_type: 'member_preference',
        marketing_name: '',
        marketing_desc: '会员优先购',
        start_time: '',
        end_time: '',
        used_platform: 0,
        use_bound: 'goods',
        use_shop: 0,
        shop_ids: [],
        item_ids: [],
        test: [],
        item_type: 'normal',
        valid_grade: [],
        condition_type: 'totalfee',
        condition_value: [],
        join_limit: 0,
        promotion_tag: '会员优先购',
        status: 'waiting',
        item_category: [],
        tag_ids: [],
        brand_ids: []
      },
      vipGrade: [],
      memberGrade: [],
      conditionValue: [{ full: '', discount: '' }],
      validGrade: [],
      activity_date: '',
      selectItemType: 'normal',
      itemVisible: false,
      setItemStatus: false,
      imgDialog: false,
      isGetImage: false,
      isIndeterminate: true,
      checkAll: false,
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
  watch: {
    'form.item_ids': {
      handler: function (val) {
        if (val) {
          //this.form.use_bound = val.length > 0 ? 1 : 0
        }
      }
    },
    relStores(val) {
      if (val) {
        this.form.use_shop = val.length > 0 ? 1 : 0
      }
    }
  },
  mounted() {
    if (store.getters.login_type === 'distributor') {
      this.is_distributor = true
    }
    if (this.$route.params.marketing_id) {
      this.getActivityDetail(this.$route.params.marketing_id)
    }

    if (this.$route.query.isnodata) {
      this.hasSaveButton = false
    }

    listVipGrade().then(response => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        this.vipGrade = response.data.data
      }
    })

    getGradeList().then(response => {
      if (response != undefined && response.data.data && response.data.data.length > 0) {
        var result = response.data.data
        if (result) {
          this.memberGrade = result
        }
      }
    })

    this.fetchMainCate()
    this.getAllTagLists()
    this.getBrandList('', true)
  },
  methods: {
    getItems(data) {
      let ids = []
      data.forEach(item => {
        ids.push(item.itemId)
      })
      this.form.item_ids = ids
    },
    addRules() {
      this.conditionValue.push({ full: '', discount: '' })
    },
    delRules(index) {
      this.conditionValue.splice(index, 1)
    },
    relStoresClick() {
      this.storeVisible = true
      this.setStatus = true
    },
    chooseStoreAction(data) {
      this.storeVisible = false
      this.form.shop_ids = []
      if (data === null || data.length <= 0) return
      this.relStores = data
    },
    closeStoreDialogAction() {
      this.storeVisible = false
    },
    deleteStoreRow(index) {
      this.setStatus = false
      this.relStores.splice(index, 1)
    },
    submitActivityAction() {
      const that = this
      if (this.activity_date && this.activity_date.length > 0) {
        this.form.start_time = this.activity_date[0]
        this.form.end_time = this.activity_date[1]
      } else {
        this.$message.error('有效期必填!')
        return
      }

      if (this.conditionValue.length > 0) {
        this.form.condition_value = JSON.stringify(this.conditionValue)
      }
      if (this.validGrade.length > 0) {
        this.form.valid_grade = this.validGrade
      }

      this.form.shop_ids = []
      if (this.relStores && this.relStores.length > 0) {
        this.relStores.forEach(item => {
          this.form.shop_ids.push(item.distributor_id)
        })
      }

      // if (this.form.use_bound != 'all') {
      //   if (this.form.item_ids && this.form.item_ids.length <= 0) {
      //     this.$message.error('参加活动的商品必填!')
      //     return false
      //   }
      // }
      //this.use_bound = 1

      if (this.form.marketing_id) {
        updateMarketingActivity(this.form).then(res => {
          if (res.data.data.marketing_id) {
            this.loading = false
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose() {
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
        addMarketingActivity(this.form).then(res => {
          if (res.data.data.marketing_id) {
            this.loading = false
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose() {
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
    getActivityDetail(id) {
      getMarketingActivityInfo({ marketing_id: id }).then(res => {
        let response = res.data.data
        let data = {
          marketing_type: 'member_preference',
          promotion_tag: '会员优先购',
          marketing_id: response.marketing_id,
          marketing_name: response.marketing_name,
          marketing_desc: response.marketing_desc,
          start_time: response.start_time,
          end_time: response.end_time,
          used_platform: response.used_platform,
          use_bound: response.use_bound,
          use_shop: response.use_shop,
          valid_grade: response.valid_grade,
          condition_type: response.condition_type,
          condition_value: response.condition_value,
          join_limit: response.join_limit,
          free_postage: response.free_postage,
          item_type: response.item_type,
          status: response.status,
          item_category: response.item_category,
          tag_ids: response.tag_ids,
          tag_list: response.tag_list,
          brand_ids: response.brand_ids,
          brand_list: response.brand_list,
          rel_brand_ids: response.rel_brand_ids,
          rel_category_ids: response.rel_category_ids,
          rel_tag_ids: response.rel_tag_ids
        }
        Object.assign(this.form, data)
        this.conditionValue = response.condition_value
        this.validGrade = response.valid_grade
        this.activity_date = [response.start_time, response.end_time]
        this.relItems = response.itemTreeLists || []
        this.relStores = response.storeLists || []
        this.zdItemHidden = true
        this.categoryHidden = true
        this.tagHidden = true
        this.brandHidden = true

        if (response.use_bound == 0) {
          this.form.use_bound = 'all'
        }

        if (response.use_bound == 1) {
          this.form.use_bound = 'goods'
          this.zdItemHidden = false
        }

        if (response.use_bound == 2) {
          this.form.use_bound = 'category'
          this.categoryHidden = false
          this.generateSku()
        }

        if (response.use_bound == 3) {
          this.form.use_bound = 'tag'
          this.tagHidden = false
          this.tag.currentTags = response.tag_list || []
          this.showTags()
          this.generateSku()
        }

        if (response.use_bound == 4) {
          this.form.use_bound = 'brand'
          this.brandHidden = false
          this.brand.currentBrands = response.brand_list || []
          this.showBrands()
          this.generateSku()
        }
      })
    },
    handleCancel: function () {
      this.$router.back(-1)
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
      getCategory({ is_main_category: true, ignore_none: true }).then(response => {
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
          message: '请选择至少一个商品!'
        })
      }
    },
    showTags: function () {
      this.tag.tags = [...this.tag.list]
      this.tag.tags.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex(n => n.tag_id == item.tag_id)
        if (isInArr != -1) this.tag.tags.splice(index, 1)
      })
    },
    tagRemove: function (index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
      this.form.tag_ids = []
      let tagItems = []
      let tagInvalidItems = []
      this.tag.currentTags.forEach(item => {
        this.form.tag_ids.push(item.tag_id)
        let items = []

        this.ItemsList.forEach(i => {
          if (i.tag_ids.indexOf(item.tag_id) != -1) items.push(i)
        })
        tagItems = items

        let invalidItems = []
        this.invalidItemsList.forEach(i => {
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
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.tag.currentTags.findIndex(n => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
      this.form.tag_ids = []
      this.tag.currentTags.forEach(item => {
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
      getTagList(params).then(response => {
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
      }).then(res => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brand.list = list
      })
    },
    showBrands: function () {
      this.brand.brands = [...this.brand.list]
      this.brand.brands.forEach((item, index) => {
        let isInArr = this.brand.currentBrands.findIndex(n => n.attribute_id == item.attribute_id)
        if (isInArr != -1) this.brand.brands.splice(index, 1)
      })
    },
    brandAdd: function (item, index) {
      if (this.activity_date.length <= 0) {
        this.$message({
          type: 'error',
          message: '请选择活动时间!'
        })
        return false
      }
      let isInArr = this.brand.currentBrands.findIndex(n => n.attribute_id == item.attribute_id)
      if (isInArr == -1) {
        this.brand.currentBrands.push(item)
        this.brand.brands.splice(index, 1)
      }
      this.form.brand_ids = []
      this.brand.currentBrands.forEach(item => {
        this.form.brand_ids.push(item.attribute_id)
      })
      this.params.brand_id = item.attribute_id
      this.getGoodsList()
    },
    brandRemove: function (index) {
      let items = []
      this.ItemsList.forEach(item => {
        if (this.brand.currentBrands[index].attribute_id != item.brand_id) items.push(item)
      })
      let invalidItems = []
      this.invalidItemsList.forEach(i => {
        if (this.brand.currentBrands[index].attribute_id != i.brand_id) invalidItems.push(i)
      })

      this.invalidItemsList = invalidItems
      this.ItemsList = items
      this.getItems(this.ItemsList)

      this.brand.brands.unshift(this.brand.currentBrands[index])
      this.brand.currentBrands.splice(index, 1)
      this.form.brand_ids = []
      this.brand.currentBrands.forEach(item => {
        this.form.brand_ids.push(item.attribute_id)
      })
    },
    getGoodsList: function () {
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.$route.params.marketing_id) {
        params.activity_id = this.$route.params.marketing_id
      }
      params.marketing_type = this.form.marketing_type
      params.activity_release_time = params.activity_start_time = this.activity_date[0]
      params.activity_end_time = this.activity_date[1]
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      seckillActivityGetItemsList(params).then(response => {
        let itemList = response.data.data.list.validItems.concat(this.ItemsList)
        let invalidItemList = response.data.data.list.invalidItems.concat(this.invalidItemsList)
        let newItemList = []
        let invalidItems = []
        let obj = {}
        let obj1 = {}
        itemList.forEach(item => {
          let tag_ids = []
          item.tagList.forEach(tag => {
            tag_ids.push(tag.tag_id)
          })
          item.tag_ids = tag_ids
          if (!obj[item.item_id]) {
            newItemList.push(item)
            obj[item.item_id] = true
          }
        })
        invalidItemList.forEach(item => {
          let tag_ids = []
          item.tagList.forEach(tag => {
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
      this.invalidItemsList.forEach(i => {
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
      goodsList.forEach(item => {
        if (!item.nospec && item.spec_items.length === 0) {
          noSkuItem.push(item.default_item_id)
        }
      })
      if (noSkuItem.length > 0) {
        let param = this.params
        param.item_id = noSkuItem
        getItemsList(this.params).then(res => {
          goodsList.forEach(item => {
            if (!item.nospec) {
              res.data.data.list.forEach(sku => {
                if (item.item_id === sku.default_item_id) {
                  item.spec_items.push(sku)
                }
              })
            }
          })
          goodsList.forEach(item => {
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
        goodsList.forEach(item => {
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
      let params = { file_type: 'marketing_goods', file_name: '商品模板' }
      exportUploadTemplate(params).then(response => {
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
    /**
     * 上传模板
     * */
    uploadHandleChange(file, fileList) {
      let params = { isUploadFile: true, file_type: 'marketing_goods', file: file.raw }
      handleUploadFile(params).then(response => {
        this.$message({
          type: 'success',
          message: '上传成功'
        })

        let { data } = response.data

        if (data.fail.length > 0) {
          let str = data.fail.map(item => {
            return item.item_bn
          })

          setTimeout(() => {
            this.$message({
              showClose: true,
              message: `以下商品编号不存在：${str}`,
              type: 'error',
              duration: 5000
            })
          }, 1500)
        }
        if (data.succ.length <= 0) return
        this.relItems = data.succ
        let list = []
        data.succ.forEach(item => {
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

<style lang="scss" scoped>
.page-memberpreference ::v-deep .el-card {
  margin-bottom: 20px;
}
</style>
