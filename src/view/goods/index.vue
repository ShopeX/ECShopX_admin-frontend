<style lang="scss">
.goods-index {
  .el-form-item__content {
    min-width: 260px;
  }

  .el-cascader {
    width: 100%;

    .el-input {
      width: 100%;
      max-width: initial;
    }
  }

  .image-checkbox-container {
    line-height: initial;
    margin-bottom: 10px;

    .el-checkbox {
      width: 80px;
      margin-right: 10px;
      text-align: center;

      .el-checkbox__label {
        display: none;
      }
    }
  }
}
.goods-img-list {
  display: flex;
  .img-content {
    margin-right: 10px;
  }
}
</style>
<template>
  <div class="goods-index">
    <el-alert
      v-if="form.audit_status == 'rejected' && IS_SUPPLIER()"
      :title="`审核失败：${form.audit_reason || ''}`"
      type="warning"
    />
    <!-- {{ form.specParams }} -->
    <SpForm
      ref="form"
      v-model="form"
      v-loading="loading"
      show-message
      label-width="100px"
      :form-list="formList"
      :submit="false"
    />

    <div class="footer-container">
      <el-button @click.native="handleCancel"> 取消</el-button>
      <el-button
        v-if="
          (IS_SUPPLIER() || !form.supplier_id) && !routerParams.detail && !routerParams.supplier
        "
        type="primary"
        :loading="submitLoading"
        @click="onFormSubmit('submitting')"
      >
        保存
      </el-button>
      <el-button
        v-if="IS_SUPPLIER() && !routerParams.detail"
        type="primary"
        :loading="submitLoading"
        @click.native="onFormSubmit('processing')"
      >
        提交审核
      </el-button>
      <!-- {{ form.audit_status }} -->
      <el-button
        v-if="IS_ADMIN() && form.audit_status == 'processing'"
        type="primary"
        :loading="submitLoading"
        @click.native="onApplyConfirm"
      >
        保存并审核
      </el-button>
    </div>

    <SpDialog
      ref="sendNumDialogRef"
      v-model="applyDialog"
      title="审核"
      :form="applyForm"
      :form-list="applyFormList"
      @onSubmit="onApplySubmit"
    />
  </div>
</template>

<script>
import _uniqBy from 'lodash/uniqBy'
import { isObject, isString, isArray, IS_SUPPLIER, getRegionNameById } from '@/utils'
import GoodsParams from './components/GoodsParams'
import SpecParams from './components/SpecParams'
import SkuParams from './components/SkuParams'
import sku from '../../store/modules/sku'
export default {
  async beforeRouteLeave(to, from, next) {
    if (this.$refs['decorateRef'].dialogVisible) {
      this.$refs['decorateRef'].resetDecorateTheme()
      this.$refs['decorateRef'].onClose()
    } else if (!this.isLeave && !this.routerParams.detail) {
      await this.$confirm('确定要离开当前页面，您将丢失已编辑的数据？！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      next()
    } else {
      next()
    }
  },
  data() {
    const cascaderProps = {
      props: {
        multiple: true,
        value: 'value',
        children: 'children'
      }
    }
    const { prohibit } = this.$route.query
    const disabled = prohibit == 1
    return {
      form: {
        supplier_id: 0,
        is_market: 0,
        item_id: '',
        audit_status: '',
        itemType: 'normal',
        specialType: 'normal',
        itemSource: 'mall',
        mainCategory: [],
        itemName: '',
        brief: '',
        templatesId: '',
        brandId: '',
        itemUnit: '',
        sort: 1,
        regionsId: [],
        taxRate: '',
        isGift: false,
        goods_bn: '',
        aftersales_end_date: '',
        delivery_data: {
          delivery_data_type: 'fixed_date',
          delivery_desc: ''
        },
        salesCategory: [],
        pics: [],
        picsQrcode: [],
        videos: '',
        paramsData: [],
        isSpecs: false, // 单规格
        isShowSpecimg: false, // 商品详情页规格选择器显示规格图片
        specParams: {
          approve_status: 'onsale',
          store: 1,
          item_bn: '',
          weight: '',
          volume: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: 0,
          tax_rate: '',
          tax_rate_code: '',
          buy_limit_area: ['all'],
          package_type: 'sku' // 后端要求单规格传sku/spu
        },
        skuParams: {
          skus: [],
          skuItemImages: [],
          specItems: [],
          package_type: '',
          package_num: 1,
          buy_limit_area: ['all']
        },
        mode: 'richText',
        intro: '',
        content: [],
        title: '', // pc页面标题
        mate_description: '', // pc页面标题
        mate_keywords: '', // pc页面标题
        goods_notice: '' // 商品公告
      },
      formList: [
        {
          label: '管理分类',
          type: 'group'
        },
        {
          label: '管理分类',
          key: 'mainCategory',
          width: '360px',
          required: true,
          disabled,
          message: '请选择管理分类',
          component: ({ key }, value) => {
            return (
              <el-cascader
                v-model={value[key]}
                disabled={this.mainCategoryDisabled}
                options={this.categoryList}
                on-change={this.onChangeMainCategory}
              />
            )
          }
        },
        {
          label: '基础信息',
          type: 'group'
        },
        {
          label: '商品标题',
          key: 'itemName',
          type: 'input',
          display: 'inline',
          // disabled,
          required: true,
          message: '请输入商品标题'
        },
        {
          label: '副标题',
          key: 'brief',
          type: 'input',
          // disabled,
          display: 'inline'
        },
        {
          label: '运费模板',
          key: 'templatesId',
          type: 'select',
          options: [],
          required: true,
          disabled,
          message: '请选择运费模板',
          display: 'inline'
        },
        {
          label: '品牌',
          key: 'brandId',
          type: 'select',
          options: [],
          disabled,
          required: true,
          message: '请选择品牌',
          display: 'inline'
        },
        {
          label: '计量单位',
          key: 'itemUnit',
          type: 'input',
          disabled,
          display: 'inline'
        },
        {
          label: '排序编号',
          key: 'sort',
          disabled,
          type: 'number',
          min: 0,
          display: 'inline'
        },
        {
          label: '产地',
          key: 'regionsId',
          component: ({ key }, value) => (
            <el-cascader
              disabled={disabled}
              v-model={value[key]}
              clearable
              options={this.regionsList}
            />
          ),
          display: 'inline'
        },
        {
          label: 'SPU编码',
          key: 'goods_bn',
          disabled,
          // disabled: () => {
          //   return !!this.form.item_id
          // },
          type: 'input',
          display: 'inline'
        },
        // {
        //   label: '申请售后',
        //   key: 'aftersales_end_date',
        //   component: ({ key }, value) => (
        //     <div>
        //       确认收货商品，将在
        //       <el-input
        //         disabled={disabled}
        //         v-model={value[key]}
        //         style='width: 80px; margin-left: 10px;'
        //       />
        //       （天）后不可申请售后
        //     </div>
        //   ),
        //   display: 'block'
        // },
        // {
        //   label: '发货日期',
        //   key: 'delivery_data',
        //   component: ({ key }, value) => (
        //     <div style='display: flex; align-items: center;'>
        //       <el-select
        //         disabled={disabled}
        //         v-model={value[key].delivery_data_type}
        //         style='width: 180px;'
        //         on-change={() => {
        //           value[key].delivery_desc = ''
        //         }}
        //       >
        //         <el-option value='fixed_date' label='指定发货日期' />
        //         <el-option value='relative_date' label='相对发货日期' />
        //         <el-option value='default_date' label='默认发货日期' />
        //       </el-select>
        //       {value[key].delivery_data_type === 'fixed_date' && (
        //         <el-date-picker
        //           disabled={disabled}
        //           v-model={value[key].delivery_desc}
        //           type='date'
        //           placeholder='选择日期'
        //           style='margin-left: 10px;'
        //         />
        //       )}
        //       {value[key].delivery_data_type === 'relative_date' && (
        //         <div>
        //           <el-input-number
        //             disabled={disabled}
        //             v-model={value[key].delivery_desc}
        //             controls-position='right'
        //             style='width: 120px; margin-left: 10px; display: inline-block;'
        //           />
        //           （天）后发货
        //         </div>
        //       )}
        //       {value[key].delivery_data_type === 'default_date' && (
        //         <div>
        //           <el-input-number
        //             disabled={disabled}
        //             v-model={value[key].delivery_desc}
        //             controls-position='right'
        //             style='width: 120px; margin-left: 10px; display: inline-block;'
        //           />
        //           （小时）后发货
        //         </div>
        //       )}
        //     </div>
        //   ),
        //   display: 'block',
        //   validator: async (rule, value, callback) => {
        //     if (value.delivery_data_type == 'fixed_date' && !value.delivery_desc) {
        //       callback('发货日期不能为空')
        //     } else {
        //       callback()
        //     }
        //   }
        // },
        // {
        //   label: '商品税率',
        //   key: 'taxRate',
        //   type: 'input',
        //   display: 'inline'
        // },
        {
          label: '供应状态',
          key: 'is_market',
          type: 'select',
          isShow: this.IS_SUPPLIER(),
          options: [
            { title: '可售', value: 1 },
            { title: '不可售', value: 0 }
          ],
          display: 'inline'
        },
        {
          label: '赠品',
          key: 'isGift',
          type: 'switch',
          tip: '开启后前台不可购买'
        },

        {
          label: '销售分类',
          key: 'salesCategory',
          width: '720px',
          // required: !this.IS_SUPPLIER() && !this.form.supplier_id,
          required: !this.IS_SUPPLIER(),
          message: '请选择销售分类',
          component: ({ key }, value) => (
            <el-cascader
              v-model={value[key]}
              class={[
                {
                  'is-error': value[key]
                }
              ]}
              clearable
              filterable
              {...{ props: cascaderProps }}
              options={this.saleCategoryList}
            />
          )
        },
        {
          label: '商品图',
          key: 'pics',
          required: true,
          message: '请上传商品图片',
          component: ({ key }, value) => (
            <div>
              {/* diabled */}
              {false ? (
                <div class='goods-img-list'>
                  {value[key].map((item) => (
                    <el-image
                      class='img-content'
                      src={item?.url || item}
                      fit='cover'
                      style='width:80px;height:80px'
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <SpImagePicker v-model={value[key]} drag max={9} />
                  <div class='image-checkbox-container'>
                    <el-checkbox-group v-model={value['picsQrcode']}>
                      {value[key].map((pic, index) => (
                        <el-checkbox label={index}></el-checkbox>
                      ))}
                    </el-checkbox-group>
                  </div>
                </div>
              )}
            </div>
          ),
          tip: `1. 最多可上传9张图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px * 500px）<br />2. 相册图朋友圈分享是否生成小程序码1`
        },
        {
          label: '商品视频',
          key: 'videos',
          component: ({ key }, value) => (
            <div>
              {/* {disabled && value[key] && (
                <video-player
                  class='picker-video-player'
                  options={this.getOptions(value[key]?.url || value[key])}
                  style='width:180px;height:80px'
                />
              )} */}
              {/* !disabled */}
              <SpVideoPicker v-model={value[key]} disabled={disabled} />
            </div>
          )
        },
        {
          label: '商品参数',
          disabled,
          type: 'group',
          isShow: (item, { paramsData }) => {
            return paramsData.length > 0
          }
        },
        {
          key: 'paramsData',
          component: ({ key }, value) => {
            return <GoodsParams v-model={value[key]} disabled={disabled} />
          },
          isShow: (item, { paramsData }) => {
            return paramsData.length > 0
          }
        },
        {
          label: '商品规格',
          type: 'group'
        },
        {
          label: '多规格',
          key: 'isSpecs',
          disabled,
          type: 'switch',
          onChange: () => {},
          isShow: (item, { isSpecs }) => {
            const { itemId } = this.$route.params
            const { skus } = this.form.skuParams
            // return !itemId || (itemId && !this.multipleSkuGoods && skus.length > 0)
            return !itemId
          }
        },
        {
          label: '规格图片',
          key: 'isShowSpecimg',
          type: 'switch',
          disabled,
          onChange: () => {},
          isShow: (item, { isSpecs }) => {
            return isSpecs
          },
          tip: '是否在商详页规格选择器显示规格图片'
        },
        {
          // 单规格组件
          key: 'specParams',
          component: ({ key }, value) => {
            return (
              disabled,
              (
                <SpecParams
                  v-model={value[key]}
                  ref='specParams'
                  is-show-point={this.isShowPoint}
                  disabled={disabled}
                  provinceList={this.provinceList}
                />
              )
            )
          },
          isShow: (item, { isSpecs }) => {
            return !isSpecs
          },
          showMessage: false,
          validator: async (rule, value, callback) => {
            try {
              if (!this.form.isSpecs) {
                await this.$refs['specParams'].handleSubmit()
              }
              callback()
            } catch (e) {
              const [key] = Object.keys(e)
              const [rule] = e[key]
              callback(rule.message)
            }
          }
        },
        {
          key: 'skuParams',
          component: ({ key }, value) => {
            return (
              <SkuParams
                v-model={value[key]}
                ref='skuParams'
                isSupplierGoods={this.routerParams.isSupplierGoods}
                is-show-point={this.isShowPoint}
                disabled={disabled}
                provinceList={this.provinceList}
              />
            )
          },
          isShow: (item, { isSpecs }) => {
            return isSpecs
          },
          // showMessage: false,
          validator: async (rule, value, callback) => {
            if (this.form.isSpecs) {
              const { specItems } = value

              const approveStatus = specItems.find(({ approve_status }) => !!approve_status)
              const store = specItems.find(({ store }) => !!store)
              const price = specItems.find(({ price }) => !!price)

              if (!IS_SUPPLIER() && !this.routerParams.isSupplierGoods &&  !approveStatus) {
                callback('请选择商品状态')
              } else if (!store) {
                callback('请输入商品库存')
              } else if (!price) {
                callback('请输入商品销售价格')
              } else {
                callback()
              }
            }
          }
        },
        {
          label: 'PC关键词搜索引擎',
          type: 'group'
        },
        {
          label: '页面标题',
          key: 'title',
          disabled,
          type: 'input'
        },
        {
          label: '页面描述',
          key: 'mate_description',
          type: 'textarea',
          disabled,
          width: '720px'
        },
        {
          label: '关键词',
          key: 'mate_keywords',
          type: 'textarea',
          placeholder: '关键词之间请用半角”,”分隔',
          disabled,
          width: '720px'
        },
        {
          label: '图文详情',
          type: 'group'
        },
        {
          label: '',
          key: 'mode',
          disabled,
          type: 'radio',
          options: [
            { label: 'richText', name: '富文本' },
            { label: 'component', name: '组件式' }
          ]
        },
        {
          label: '',
          key: 'intro',
          disabled,
          type: 'richText',
          isShow: (item, { mode }) => {
            return mode == 'richText'
          }
        },
        {
          label: '',
          key: 'content',
          component: ({ key }, value) => {
            return (
              <SpDecorate ref='decorateRef' v-model={value[key]} scene={'1002'} />
              /* <richTextEditor
                data={value[key]}
                control={['film', 'slider', 'heading', 'writing']}
                on-change={(data) => {
                  value[key] = data
                }}
              /> */
            )
          },
          isShow: (item, { mode }) => {
            return mode == 'component'
          }
        }
      ],
      categoryList: [],
      mainCategoryDisabled: false,
      saleCategoryList: [],
      regionsList: [],
      provinceList: [],
      goodsSpec: [],
      submitLoading: false,
      loading: false,
      isLeave: false,
      isShowPoint: false,
      // 管理分类上绑定的规格
      mainCategorySpec: [],
      // 当前商品是否多规格
      multipleSkuGoods: false,
      applyDialog: false,
      applyForm: {
        applyResult: 'rejected',
        audit_reason: ''
      },
      applyFormList: [
        {
          label: '处理结果',
          key: 'applyResult',
          type: 'radio',
          options: [
            { label: 'rejected', name: '不同意' },
            { label: 'approved', name: '同意' }
          ]
        },
        {
          label: '拒绝原因',
          key: 'audit_reason',
          type: 'textarea',
          placeholder: '请输入拒绝原因',
          isShow: (item, value) => {
            return value.applyResult == 'rejected'
          },
          validator: (rule, value, callback) => {
            if (this.applyForm.applyResult == 'rejected' && !value) {
              callback(new Error('请输入拒绝原因'))
            } else {
              callback()
            }
          }
        }
      ],
      routerParams: {
        isSupplierGoods:false
      }
    }
  },
  computed: {},
  created() {
    this.getPointRule()
    this.getMainCategory()
    this.getShippingTemplates()
    this.getBrandList()
    this.getAddress()
  },
  methods: {
    async getPointRule() {
      const pointRuleInfo = await this.$api.promotions.getPointRule()
      this.isShowPoint =
        pointRuleInfo.access == 'items' &&
        (pointRuleInfo.isOpenMemberPoint == 'true' || pointRuleInfo.isOpenMemberPoint == true)
    },
    // 获取管理分类
    async getMainCategory() {
      const { itemId } = this.$route.params
      this.loading = true
      const category = await this.$api.goods.getCategory({ is_main_category: true })
      function _deepCategory(cate, temp) {
        cate.forEach((item) => {
          const _temp = {
            label: item.category_name,
            value: item.category_id
          }
          if (item.children) {
            _temp['children'] = []
            _deepCategory(item.children, _temp.children)
          }
          temp.push(_temp)
        })
      }
      let categoryList = []
      _deepCategory(category, categoryList)
      this.categoryList = categoryList
      await this.getSaleCategory()
      if (itemId) {
        this.fetchDetail()
        this.mainCategoryDisabled = true
      } else {
        this.loading = false
      }
    },
    // 获取销售分类
    async getSaleCategory() {
      const res = await this.$api.goods.getCategory({ is_show: false })
      function _deepCategory(cate, temp) {
        cate.forEach((item) => {
          const _temp = {
            label: item.category_name,
            value: item.category_id
          }
          if (item.children) {
            _temp['children'] = []
            _deepCategory(item.children, _temp.children)
          }
          temp.push(_temp)
        })
      }
      let saleCategoryList = []
      _deepCategory(res, saleCategoryList)
      this.saleCategoryList = saleCategoryList
    },
    async fetchDetail() {
      const { itemId } = this.$route.params
      const { is_new, supplier } = this.$route.query
      this.routerParams = this.$route.query || {}
      const {
        item_id,
        supplier_id,
        audit_status,
        item_name,
        brief,
        templates_id,
        brand_id,
        item_unit,
        sort,
        regions_id,
        tax_rate,
        tax_rate_code,
        is_gift,
        pics,
        pics_create_qrcode,
        nospec,
        // 单规格数据
        approve_status,
        store,
        item_bn,
        weight,
        volume,
        price,
        cost_price,
        market_price,
        barcode,
        point_num,
        item_category_main, // 管理分类
        item_category_info, // 销售分类
        item_category, // 销售分类值
        item_spec_list,
        item_main_cat_id,
        is_show_specimg,
        is_market,
        spec_images,
        spec_items,
        mode,
        tdk_content,
        intro,
        videos,
        item_params_list,
        item_params,
        aftersales_end_date,
        goods_notice,
        delivery_data_type,
        delivery_desc,
        supplier_goods_bn,
        goods_bn,
        audit_reason,
        package_num,
        buy_limit_area = [],
        package_type = ''
      } = await this.$api.goods.getItemsDetail(itemId, {
        operate_source: supplier ? 'supplier' : IS_SUPPLIER() ? 'supplier' : 'platform'
      })
      console.log(666, buy_limit_area)
      this.loading = false
      let mainCategory = []
      this.deepMainCategory(item_category_main[0], mainCategory)
      this.form.mainCategory = mainCategory
      this.form.audit_status = audit_status
      this.form.audit_reason = audit_reason
      this.form.itemName = is_new ? `${item_name}_复制` : item_name
      this.form.item_id = item_id
      this.form.supplier_id = supplier_id
      this.form.brief = brief
      this.form.templatesId = templates_id.toString()
      this.form.brandId = brand_id
      this.form.itemUnit = item_unit
      this.form.sort = sort
      this.form.regionsId = regions_id
      this.form.isGift = is_gift
      this.form.taxRate = tax_rate
      this.form.videos = videos
      this.form.isShowSpecimg = is_show_specimg
      this.form.is_market = is_market
      this.form.aftersales_end_date = aftersales_end_date
      this.form.goods_notice = goods_notice
      this.form.goods_bn = is_new ? '' : goods_bn
      this.form.delivery_data = {
        delivery_data_type,
        delivery_desc
      }
      this.form.salesCategory = this.deepSalesCategory(item_category)
      this.form.pics = pics
      pics_create_qrcode.forEach((v, index) => {
        if (v) {
          this.form.picsQrcode.push(index)
        }
      })
      this.form.isSpecs = !nospec
      this.multipleSkuGoods = !nospec
      const _limit_area = []
      this.form.specParams = {
        approve_status: approve_status,
        store,
        item_id,
        item_bn: is_new ? '' : item_bn,
        weight,
        volume,
        price: isNaN(price / 100) ? '' : price / 100,
        cost_price: isNaN(cost_price / 100) ? '' : cost_price / 100,
        market_price: isNaN(market_price / 100) ? '' : market_price / 100,
        barcode,
        point_num,
        tax_rate,
        tax_rate_code,
        package_num,
        buy_limit_area: _limit_area,
        package_type: 'sku' // 后端要求单规格传sku/spu
      }
      const { goods_params, goods_spec = [] } = await this.$api.goods.getCategoryInfo(
        item_main_cat_id
      )
      this.mainCategorySpec = goods_spec
      this.resolveParamsData(goods_params, item_params)
      if (!nospec) {
        // 多规格
        const restParams = {
          package_num,
          buy_limit_area: _limit_area,
          package_type
        }
        this.resolveSkuParams(goods_spec, spec_items)
        this.$refs['skuParams'].onSkuChange({ spec_images, spec_items, restParams })
      } else {
        this.resolveSkuParams(goods_spec)
      }

      if (tdk_content) {
        let { title, mate_description, mate_keywords } = JSON.parse(tdk_content) || {}
        this.form.title = title
        this.form.mate_description = mate_description
        this.form.mate_keywords = mate_keywords
      }
      if (isArray(intro)) {
        this.form.mode = 'component'
        this.form.content = intro
      } else {
        this.form.intro = isString(intro) ? intro : intro.toString()
      }
    },
    // 递归管理分类
    deepMainCategory({ category_id, category_name, children }, mainCategory) {
      mainCategory.push(category_id)
      if (children) {
        this.deepMainCategory(children[0], mainCategory)
      }
    },
    deepSalesCategory(value) {
      const { saleCategoryList } = this
      function findPathById(tree, id, path) {
        if (typeof path === 'undefined') {
          path = []
        }
        for (let i = 0; i < tree.length; i++) {
          let tempPath = [...path]
          tempPath.push(tree[i].value)
          if (tree[i].value == id) {
            return tempPath
          }
          if (tree[i].children) {
            const result = findPathById(tree[i].children, id, tempPath)
            if (result) {
              return result
            }
          }
        }
      }

      let list = []
      value.forEach((v) => {
        list.push(findPathById(saleCategoryList, v))
      })
      return list
    },
    // 获取邮费模板
    async getShippingTemplates() {
      const { list } = await this.$api.shipping.getShippingTemplatesList({
        page: 1,
        pageSize: 99
      })
      if (list.length > 0) {
        this.formList[5].options = list.map((item) => {
          return {
            value: item.template_id,
            title: item.name
          }
        })

        console.log('this.formList[5]:', this.formList[5])
      } else {
        this.$message.error('请先添加运费模板')
      }
    },
    // 获取品牌列表
    async getBrandList() {
      const { list } = await this.$api.goods.getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand'
        // attribute_name: searchVal
      })
      this.formList[6].options = list.map(({ attribute_id, attribute_name }) => {
        return {
          value: attribute_id,
          title: attribute_name
        }
      })
    },
    // 获取地区列表
    async getAddress() {
      const res = await this.$api.common.getAddress()
      this.regionsList = res
      const _all_obj = {
        value: 'all',
        label: '全部'
      }
      const data_n = res.map((v) => {
        const children = []
        return { ...v, children }
      })
      this.provinceList = [].concat(_all_obj, data_n)
    },
    async onChangeMainCategory(val) {
      const { goods_params, goods_spec = [] } = await this.$api.goods.getCategoryInfo(
        val[val.length - 1]
      )
      this.resolveParamsData(goods_params)
      this.resolveSkuParams(goods_spec)
    },
    resolveParamsData(goodsParams, value = []) {
      this.form.paramsData = goodsParams.map(
        ({ attribute_id, attribute_name, attribute_values: { list } }, index) => {
          const fd = value.find((item) => item.attribute_id == attribute_id) || {}
          return {
            id: attribute_id,
            label: attribute_name,
            attr_id: fd?.attribute_value_id || '',
            children: list.map(({ attribute_value_id, attribute_value }) => {
              return {
                value: attribute_value_id,
                label: attribute_value
              }
            })
          }
        }
      )
    },
    resolveSkuParams(goodsSpec, specValue) {
      let specValueIds = []
      let tempItemSpecs = []
      if (specValue) {
        specValue.forEach(({ item_spec }) => {
          tempItemSpecs = tempItemSpecs.concat(item_spec)
        })
        specValueIds = _uniqBy(tempItemSpecs, 'spec_value_id')
      }

      this.form.skuParams.skus = goodsSpec.map(
        ({ attribute_id, attribute_name, is_image, attribute_values: { list } }) => {
          let checkedSku = []
          let t = {
            skuId: attribute_id,
            skuName: attribute_name,
            isImage: JSON.parse(is_image),
            skuValue: list.map(({ attribute_value_id, attribute_value }) => {
              if (specValueIds.find(({ spec_value_id }) => spec_value_id == attribute_value_id)) {
                checkedSku.push(attribute_value_id)
              }
              const { spec_custom_value_name } =
                tempItemSpecs.find((item) => item.spec_value_id == attribute_value_id) || {}
              return {
                attribute_value_id,
                attribute_value,
                custom_attribute_value: spec_custom_value_name,
                sku_images: []
              }
            }),
            checkedSku
          }

          return t
        }
      )
    },
    handleCancel() {
      this.$router.go(-1)
    },
    async onFormSubmit(action) {
      const { isSpecs } = this.form
      try {
        await this.$refs['form'].handleSubmit()
        this.onFormSave(action)
      } catch (err) {
        console.error(err)
      }
    },
    async onFormSave(action) {
      const { itemId } = this.$route.params
      const { is_new, supplier } = this.$route.query
      const {
        goods_bn,
        supplier_id,
        itemType,
        specialType,
        itemSource,
        mainCategory,
        itemName,
        brief,
        templatesId,
        brandId,
        itemUnit,
        sort,
        regionsId,
        isGift,
        taxRate,
        salesCategory,
        pics,
        picsQrcode,
        videos,
        isSpecs,
        is_market,
        title,
        mate_description,
        mate_keywords,
        mode,
        content,
        intro,
        specParams,
        isShowSpecimg,
        paramsData,
        aftersales_end_date,
        delivery_data: { delivery_data_type, delivery_desc },
        goods_notice
      } = this.form
      // 单规格销售区域
      let buy_limit_area = ''
      if (specParams.buy_limit_area) {
        const _limit_area = specParams.buy_limit_area
        if (_limit_area && _limit_area.length) {
          buy_limit_area = _limit_area.join(',')
        }
      }
      // 销售分类
      const _salesCategory = salesCategory.map((item) => item[item.length - 1])
      let _picsQrcode = []
      pics.forEach((pic, index) => {
        _picsQrcode.push(picsQrcode.includes(index))
      })
      let params = {
        buy_limit_area,
        goods_bn,
        supplier_id,
        is_market,
        item_type: itemType,
        operate_source: supplier ? 'supplier' : IS_SUPPLIER() ? 'supplier' : 'platform',
        audit_status: action, // submitting 待提交；processing 审核中
        special_type: specialType,
        item_source: itemSource,
        // 管理分类
        item_main_cat_id: mainCategory[mainCategory.length - 1],
        item_name: itemName,
        brief,
        templates_id: templatesId,
        brand_id: brandId,
        item_unit: itemUnit,
        sort,
        regions_id: regionsId?.length > 0 ? regionsId : '',
        regions: regionsId?.length > 0 ? getRegionNameById(regionsId, this.regionsList) : '',
        aftersales_end_date: aftersales_end_date,
        delivery_desc: delivery_desc,
        delivery_data_type: delivery_data_type,
        goods_notice: goods_notice,
        is_gift: isGift,
        tax_rate: taxRate,
        item_category: _salesCategory,
        pics,
        pics_create_qrcode: _picsQrcode,
        videos: videos,
        nospec: !isSpecs,
        is_show_specimg: isShowSpecimg,
        audit_reason: this.applyForm.audit_reason,
        item_params: paramsData.map(({ id, attr_id, children }) => {
          return {
            attribute_id: id,
            attribute_value_id: attr_id,
            attribute_value_name: attr_id
              ? children.find(({ value }) => value == attr_id).label
              : ''
          }
        }),
        tdk_content: JSON.stringify({
          title,
          mate_description,
          mate_keywords
        }),
        intro: mode == 'component' ? JSON.stringify(content) : intro
      }
      if (isSpecs) {
        const { skus, skuItemImages, specItems, package_type, package_num, buy_limit_area } =
          this.form.skuParams
        // 多规格
        params = {
          ...params,
          package_type,
          package_num,
          buy_limit_area: buy_limit_area.length ? buy_limit_area.join(',') : '',
          spec_images: JSON.stringify(
            skuItemImages.map(
              ({ attribute_value_id, custom_attribute_value, attribute_value, sku_images }) => {
                return {
                  spec_value_id: attribute_value_id,
                  item_spec: custom_attribute_value || attribute_value,
                  item_image_url: sku_images
                }
              }
            )
          ),
          spec_items: JSON.stringify(
            specItems.map((item, index) => {
              const { sku_id, is_default, price, cost_price, market_price } = item
              const skuIds = sku_id.split('_')
              return {
                ...item,
                item_bn: is_new == 'true' ? '' : item.item_bn,
                is_default: itemId ? index == 0 : is_default,
                item_spec: skuIds.map((id) => {
                  let resItemSpec = {}
                  skus.forEach((s) => {
                    s.skuValue.forEach(
                      ({ attribute_value_id, attribute_value, custom_attribute_value }) => {
                        if (attribute_value_id == id) {
                          resItemSpec['spec_id'] = s.skuId
                          resItemSpec['spec_value_id'] = attribute_value_id
                          resItemSpec['spec_value_name'] = attribute_value
                          resItemSpec['spec_custom_value_name'] = custom_attribute_value
                        }
                      }
                    )
                  })
                  return resItemSpec
                })
              }
            })
          )
        }
      } else {
        params = {
          ...params,
          ...specParams
        }
        if (is_new) {
          params = {
            ...params,
            item_bn: ''
          }
        }
      }

      this.submitLoading = true
      try {
        if (itemId && !is_new) {
          await this.$api.goods.updateItems(itemId, {
            ...params,
            item_id: itemId
          })
          this.$message.success('更新成功')
        } else {
          await this.$api.goods.createItems(params)
          this.$message.success('添加成功')
        }
        this.submitLoading = false
        this.isLeave = true
        this.$parent.onHooksRouteBack()
        setTimeout(() => {
          this.$router.go(-1)
        }, 200)
      } catch (e) {
        this.submitLoading = false
        console.log(e)
      }
    },
    onApplyConfirm() {
      this.applyDialog = true
    },
    async onApplySubmit() {
      this.onFormSubmit(this.applyForm.applyResult)
    },
    getOptions(src) {
      return {
        aspectRatio: '16:9',
        fluid: true,
        sources: [
          {
            type: 'video/mp4',
            src
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: false
      }
    }
  }
}
</script>
