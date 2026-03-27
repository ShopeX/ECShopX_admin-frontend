<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

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
  <SpPage :title="$t('de022579.b4f5db')" class="goods-index">
    <template slot="page-footer">
      <div class="text-center">
        <el-button @click.native="handleCancel">{{ $t('de022579.625fb2') }}</el-button>
        <el-button
          v-if="
            (IS_SUPPLIER() || !form.supplier_id) && !routerParams.detail && !routerParams.supplier
          "
          type="primary"
          :loading="submitLoading"
          @click="onFormSubmit('submiting')"
        >
          {{ $t('de022579.be5fbb') }}
        </el-button>
        <el-button
          v-if="IS_SUPPLIER() && !routerParams.detail"
          type="primary"
          :loading="submitLoading"
          @click.native="onFormSubmit('processing')"
        >
          {{ $t('de022579.646db0') }}
        </el-button>
        <el-button
          v-if="IS_ADMIN() && form.audit_status == 'processing'"
          type="primary"
          :loading="submitLoading"
          @click.native="onApplyConfirm"
        >
          {{ $t('de022579.388305') }}
        </el-button>
      </div>
    </template>

    <el-alert
      v-if="form.audit_status == 'rejected' && IS_SUPPLIER()"
      :title="$t('de022579.1158bc') + (form.audit_reason || '')"
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

    <SpDialog
      ref="sendNumDialogRef"
      v-model="applyDialog"
      :title="$t('de022579.cf13b1')"
      :form="applyForm"
      :form-list="applyFormList"
      @onSubmit="onApplySubmit"
    />
  </SpPage>
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
    if (this.$refs['decorateRef']?.dialogVisible) {
      this.$refs['decorateRef'].resetDecorateTheme()
      this.$refs['decorateRef'].onClose()
    } else if (!this.isLeave && !this.routerParams.detail) {
      await this.$confirm(this.$t('de022579.3ba67c'), this.$t('de022579.02d981'), {
        confirmButtonText: this.$t('de022579.38cf16'),
        cancelButtonText: this.$t('de022579.625fb2'),
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
        isPrescriptionApproved: false,
        templatesId: '',
        templatesName: '',
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
          medicine_spec: '',
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
          package_type: 'sku', // 后端要求单规格传sku/spu
          delivery_time: '',
          start_num: 0 //起订量
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
        goods_notice: '', // 商品公告
        is_medicine: '0',
        medicine_type: '',
        manufacturer: '',
        common_name: '',
        special_common_name: '',
        approval_number: '',
        unit: '',
        packing_spec: '',
        dosage: '',
        is_prescription: true,
        use_tip: '',
        symptom: ''
      },
      formList: [
        {
          label: this.$t('de022579.b3ed9f'),
          type: 'group'
        },
        {
          label: this.$t('de022579.b3ed9f'),
          key: 'mainCategory',
          required: true,
          disabled,
          message: this.$t('de022579.db6c82'),
          component: ({ key }, value) => {
            return (
              <el-cascader
                style={{ maxWidth: '500px' }}
                v-model={value[key]}
                disabled={this.mainCategoryDisabled}
                options={this.categoryList}
                on-change={this.onChangeMainCategory}
              />
            )
          }
        },
        {
          label: this.$t('de022579.6ea1fe'),
          type: 'group'
        },
        {
          label: this.$t('de022579.07ec01'),
          key: 'itemName',
          type: 'input',
          display: 'inline',
          required: true,
          message: this.$t('de022579.90795d')
        },
        {
          label: this.$t('de022579.72cf37'),
          key: 'brief',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('de022579.416fd4'),
          key: 'templatesId',
          type: 'select',
          options: [],
          required: true,
          disabled,
          message: this.$t('de022579.d778f5'),
          display: 'inline',
          isShow: () => !this.routerParams?.isSupplierGoods
        },
        {
          label: this.$t('de022579.416fd4'),
          key: 'templatesName',
          type: 'input',
          disabled: true,
          display: 'inline',
          isShow: () => this.routerParams?.isSupplierGoods
        },
        {
          label: this.$t('de022579.09307c'),
          key: 'brandId',
          type: 'select',
          options: [],
          disabled,
          required: true,
          message: this.$t('de022579.f70267'),
          display: 'inline'
        },
        {
          label: this.$t('de022579.251549'),
          key: 'itemUnit',
          type: 'input',
          disabled,
          display: 'inline'
        },
        {
          label: this.$t('de022579.e8373a'),
          key: 'sort',
          disabled,
          type: 'number',
          min: 0,
          display: 'inline'
        },
        {
          label: this.$t('de022579.2b6d31'),
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
          label: this.$t('de022579.18ea2a'),
          key: 'goods_bn',
          disabled,
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('de022579.2af133'),
          key: 'is_medicine',
          type: 'radio',
          isShow: () => this.is_pharma_industry,
          disabled: () => !this.is_pharma_industry || !!this.$route.params.itemId,
          options: [
            { label: '0', name: this.$t('de022579.b5a63d') },
            { label: '1', name: this.$t('de022579.32a3cd') }
          ],
          required: true,
          message: this.$t('de022579.e9bb44')
        },
        {
          label: this.$t('de022579.13ce61'),
          key: 'medicine_type',
          isShow: () => this.form.is_medicine == '1',
          type: 'select',
          options: [
            { title: this.$t('de022579.ccb52e'), value: '0' },
            { title: this.$t('de022579.15042c'), value: '1' },
            { title: this.$t('de022579.0d98c7'), value: '3' }
          ],
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1') {
              callback(this.$t('de022579.66f2cc'))
            } else {
              callback()
            }
          },
          display: 'inline'
        },
        {
          label: this.$t('de022579.1fe7ae'),
          key: 'manufacturer',
          type: 'input',
          isShow: () => this.form.is_medicine == '1',
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1') {
              callback(this.$t('de022579.db028d'))
            } else {
              callback()
            }
          },
          display: 'inline'
        },
        {
          label: this.$t('de022579.ebb8fd'),
          key: 'common_name',
          isShow: () => this.form.is_medicine == '1',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1') {
              callback(this.$t('de022579.1a1a7e'))
            } else {
              callback()
            }
          },
          display: 'inline'
        },
        {
          label: this.$t('de022579.33ded3'),
          key: 'special_common_name',
          type: 'input',
          isShow: () => this.form.is_medicine == '1',
          display: 'inline'
        },
        {
          label: this.$t('de022579.fff94f'),
          key: 'approval_number',
          isShow: () => this.form.is_medicine == '1',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1') {
              callback(this.$t('de022579.645604'))
            } else {
              callback()
            }
          },
          display: 'inline'
        },
        {
          label: this.$t('de022579.4253ed'),
          key: 'unit',
          isShow: () => this.form.is_medicine == '1',
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1') {
              callback(this.$t('de022579.039e09'))
            } else {
              callback()
            }
          },
          display: 'inline'
        },
        {
          label: this.$t('de022579.991539'),
          key: 'packing_spec',
          isShow: () => this.form.is_medicine == '1',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('de022579.9a5043'),
          key: 'dosage',
          isShow: () => this.form.is_medicine == '1',
          type: 'input',
          display: 'inline'
        },
        {
          label: this.$t('de022579.9c251b'),
          key: 'is_prescription',
          isShow: () => this.form.is_medicine == '1',
          disabled: () => !!this.$route.params.itemId,
          type: 'switch',
          tip: this.$t('de022579.8338a8')
        },
        {
          label: this.$t('de022579.88396c'),
          key: 'use_tip',
          type: 'input',
          isShow: () => this.medicinePrescription,
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1' && this.form.is_prescription) {
              callback(this.$t('de022579.b10bac'))
            } else {
              callback()
            }
          }
        },
        {
          label: this.$t('de022579.5e15d4'),
          key: 'symptom',
          isShow: () => this.medicinePrescription,
          type: 'input',
          validator: async (rule, value, callback) => {
            if (!value && this.form.is_medicine == '1' && this.form.is_prescription) {
              callback(this.$t('de022579.6ca63d'))
            } else {
              callback()
            }
          }
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
          label: this.$t('de022579.63d68b'),
          key: 'is_market',
          type: 'select',
          isShow: this.IS_SUPPLIER(),
          options: [
            { title: this.$t('de022579.434e17'), value: 1 },
            { title: this.$t('de022579.b37fb8'), value: 0 }
          ],
          display: 'inline'
        },
        {
          label: this.$t('de022579.d017cc'),
          key: 'isGift',
          type: 'switch',
          tip: this.$t('de022579.66619b')
        },
        {
          label: this.$t('de022579.392d49'),
          key: 'salesCategory',
          width: '720px',
          required: true,
          message: this.$t('de022579.24b9c6'),
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
          label: this.$t('de022579.5352d4'),
          key: 'pics',
          required: true,
          message: this.$t('de022579.4d1ed9'),
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
          tip: this.$t('de022579.fd4ce6')
        },
        {
          label: this.$t('de022579.face4f'),
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
          label: this.$t('de022579.8686bb'),
          disabled,
          type: 'group',
          isShow: (item, { paramsData }) => {
            return paramsData.length > 0
          }
        },
        {
          key: 'paramsData',
          component: ({ key }, value) => {
            return (
              <GoodsParams
                v-model={value[key]}
                disabled={disabled}
                on-change={this.onChangeParamsData}
              />
            )
          },
          isShow: (item, { paramsData }) => {
            return paramsData.length > 0
          }
        },
        {
          label: this.$t('de022579.5fceb3'),
          type: 'group'
        },
        {
          label: this.$t('de022579.5d60de'),
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
        // {
        //   label: '规格图片',
        //   key: 'isShowSpecimg',
        //   type: 'switch',
        //   disabled,
        //   onChange: () => {},
        //   isShow: (item, { isSpecs }) => {
        //     return isSpecs
        //   },
        //   tip: '是否在商详页规格选择器显示规格图片'
        // },
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
                  isMedicine={this.form.is_medicine == '1'}
                  medicinePrescription={this.medicinePrescription}
                  isPrescriptionApproved={this.isPrescriptionApproved}
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
                medicinePrescription={this.medicinePrescription}
                isPrescriptionApproved={this.isPrescriptionApproved}
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
              const { specItems, skus } = value
              const approveStatus = specItems.find(({ approve_status }) => !!approve_status)
              const store = specItems.find(({ store }) => !!store)
              const price = specItems.find(({ price }) => !!price)
              const max_num = specItems.find(({ max_num }) => !!max_num)

              const isSkusUnChecked = skus?.some((item) => !item.checkedSku.length)
              if (isSkusUnChecked) {
                callback(this.$t('de022579.d78fc6'))
              }

              if (!IS_SUPPLIER() && !this.routerParams.isSupplierGoods && !approveStatus) {
                callback(this.$t('de022579.c3b891'))
              } else if (!store) {
                callback(this.$t('de022579.643cc7'))
              } else if (!price) {
                callback(this.$t('de022579.50d707'))
              } else if (!max_num && this.medicinePrescription) {
                callback(this.$t('de022579.8d1f7c'))
              } else {
                callback()
              }
            }
          }
        },
        {
          label: this.$t('de022579.b02a70'),
          type: 'group'
        },
        {
          label: this.$t('de022579.8d6b59'),
          key: 'title',
          disabled,
          type: 'input'
        },
        {
          label: this.$t('de022579.abf8f4'),
          key: 'mate_description',
          type: 'textarea',
          disabled,
          width: '720px'
        },
        {
          label: this.$t('de022579.9699a5'),
          key: 'mate_keywords',
          type: 'textarea',
          placeholder: this.$t('de022579.c0a63b'),
          disabled,
          width: '720px'
        },
        {
          label: this.$t('de022579.7db2d6'),
          type: 'group'
        },
        {
          label: '',
          key: 'mode',
          disabled,
          type: 'radio',
          options: [
            { label: 'richText', name: this.$t('de022579.e2591e') },
            { label: 'component', name: this.$t('de022579.b09ce9') }
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
              <SpIphone>
                <SpDecorate ref='decorateRef' v-model={value[key]} scene={'1002'} />
              </SpIphone>
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
      is_pharma_industry: true,
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
          label: this.$t('de022579.9eb71d'),
          key: 'applyResult',
          type: 'radio',
          options: [
            { label: 'rejected', name: this.$t('de022579.1bf19c') },
            { label: 'approved', name: this.$t('de022579.e61f2c') }
          ]
        },
        {
          label: this.$t('de022579.f48f94'),
          key: 'audit_reason',
          type: 'textarea',
          placeholder: this.$t('de022579.fc955a'),
          isShow: (item, value) => {
            return value.applyResult == 'rejected'
          },
          validator: (rule, value, callback) => {
            if (this.applyForm.applyResult == 'rejected' && !value) {
              callback(new Error(this.$t('de022579.fc955a')))
            } else {
              callback()
            }
          }
        }
      ],
      routerParams: {
        isSupplierGoods: false
      },
      customizeStatus: []
    }
  },
  computed: {
    medicinePrescription() {
      return this.form.is_medicine == '1' && this.form.is_prescription
    }
  },
  created() {
    this.getPointRule()
    this.getMainCategory()
    this.getShippingTemplates()
    this.getBrandList()
    this.getAddress()
    this.getBaseSetting()
  },
  methods: {
    async getBaseSetting() {
      const res = await this.$api.company.getGlobalSetting()
      this.is_pharma_industry = res.medicine_setting?.is_pharma_industry == '1'
      console.log(777, this.is_pharma_industry)
    },
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

      //供应商商品销售分类非必填
      const salesCategoryIndex = this.formList.findIndex((item) => item.key == 'salesCategory')
      if (salesCategoryIndex != -1) {
        this.formList[salesCategoryIndex].required = !(
          this.IS_SUPPLIER() || this.routerParams?.isSupplierGoods
        )
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
      const { is_new, supplier, islist } = this.$route.query
      this.routerParams = this.$route.query || {}
      // 将 isSupplierGoods 从字符串转换为布尔值
      if (this.routerParams.isSupplierGoods !== undefined) {
        this.routerParams.isSupplierGoods =
          this.routerParams.isSupplierGoods === 'true' || this.routerParams.isSupplierGoods === true
      }

      const {
        item_id,
        supplier_id,
        audit_status,
        item_name,
        brief,
        templates_id,
        templates_name,
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
        delivery_time,
        // 单规格数据
        approve_status,
        store,
        item_bn,
        medicine_spec,
        start_num,
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
        package_type = '',
        is_medicine,
        medicine_data
      } = await this.$api.goods.getItemsDetail(itemId, {
        operate_source: supplier
          ? 'supplier'
          : IS_SUPPLIER()
          ? 'supplier'
          : this.routerParams?.isSupplierGoods
          ? 'supplier'
          : 'platform',
        page_from: islist ? 'supplier_items' : ''
      })

      const {
        medicine_type,
        manufacturer,
        common_name,
        special_common_name,
        approval_number,
        unit,
        packing_spec,
        dosage,
        is_prescription,
        use_tip,
        max_num,
        symptom
      } = medicine_data || {}
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
      this.form.templatesId = templates_id?.toString() || ''
      this.form.templatesName = templates_name
      this.form.brandId = brand_id + ''
      this.form.itemUnit = item_unit
      this.form.sort = sort
      this.form.regionsId = regions_id
      this.form.isGift = is_gift
      this.form.taxRate = tax_rate
      this.form.videos = videos || ''
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

      //处方药
      if (medicine_data?.audit_status == 2) {
        //审核成功
        this.isPrescriptionApproved = true
      }
      this.form.is_medicine = is_medicine + ''
      if (Object.keys(medicine_data || {}).length) {
        this.form.medicine_type = medicine_type + ''
        this.form.manufacturer = manufacturer
        this.form.common_name = common_name
        this.form.special_common_name = special_common_name
        this.form.approval_number = approval_number
        this.form.unit = unit
        this.form.packing_spec = packing_spec
        this.form.dosage = dosage
        this.form.is_prescription = is_prescription == 1
        this.form.use_tip = use_tip
        this.form.symptom = symptom
      }

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
        medicine_spec,
        start_num,
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
        delivery_time,
        buy_limit_area: _limit_area,
        package_type: 'sku', // 后端要求单规格传sku/spu
        max_num
      }
      const { goods_params, goods_spec = [] } = await this.$api.goods.getCategoryInfo(
        item_main_cat_id,
        { item_id: itemId ? itemId : '' }
      )
      this.mainCategorySpec = goods_spec
      this.resolveParamsData(goods_params, item_params)
      this.customizeStatus = item_params
      if (!nospec) {
        // 多规格
        const restParams = {
          package_num,
          buy_limit_area: _limit_area,
          package_type
        }
        this.resolveSkuParams(goods_spec, spec_items)
        let spec_images = []
        spec_items.forEach((item) => {
          item.item_spec.forEach((item) => {
            spec_images.push(item)
          })
        })
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
        this.form.intro = isString(intro) ? intro : intro?.toString()
      }
    },
    // 递归管理分类
    deepMainCategory({ category_id, category_name, children = [] }, mainCategory) {
      mainCategory.push(category_id)
      if (children?.length > 0) {
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
        pageSize: 99,
        status: 1
      })
      if (list.length > 0) {
        const index = this.formList.findIndex((item) => item.key == 'templatesId')
        this.formList[index].options = list.map((item) => {
          return {
            value: item.template_id,
            title: item.name
          }
        })
      } else {
        this.$message.error(this.$t('de022579.e9d74f'))
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
      console.log('-----------', this.formList)
      const index = this.formList.findIndex((item) => item.key == 'brandId')
      this.formList[index].options = list.map(({ attribute_id, attribute_name }) => {
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
        label: this.$t('de022579.a8b0c2')
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
            isImage: Boolean(is_image),
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
    async onChangeParamsData(item) {
      this.form.paramsData = []
      let { goods_params, goods_spec = [] } = await this.$api.goods.getCategoryInfo(
        this.form.mainCategory[this.form.mainCategory.length - 1]
      )
      let paprms = {}
      goods_params.forEach((item11) => {
        if (item11.attribute_id == item.id) {
          console.log('item11ffff:', item11)
          if (item11.attribute_values.total_count > 0) {
            item11?.attribute_values?.list.forEach((item2) => {
              if (item2.attribute_value == item.attr_id) {
                paprms = item2
              }
            })
          }
        }
      })
      this.customizeStatus.push({
        attribute_id: item.id,
        attribute_name: item.label,
        attribute_value_id: paprms.attribute_value_id,
        atttribute_value_name: paprms.attribute_value
      })

      this.customizeStatus = this.uniqueArrayById(this.customizeStatus, 'attribute_id')

      this.resolveParamsData(goods_params, this.customizeStatus)
    },

    uniqueArrayById(arr, idKey = 'id') {
      const result = []
      const seen = new Set()

      // 从后向前遍历，这样相同id的对象会保留靠后的
      for (let i = arr.length - 1; i >= 0; i--) {
        const item = arr[i]
        if (!seen.has(item[idKey])) {
          seen.add(item[idKey])
          result.unshift(item) // 使用 unshift 保持原有顺序
        }
      }

      return result
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
        goods_notice,
        is_medicine,
        medicine_type,
        manufacturer,
        common_name,
        special_common_name,
        approval_number,
        unit,
        packing_spec,
        dosage,
        is_prescription,
        use_tip,
        symptom
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
      const _salesCategory =
        salesCategory?.map((item) => item?.[item?.length ? item.length - 1 : 0]) || []
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
        nospec: String(!isSpecs),
        is_show_specimg: isShowSpecimg,
        audit_reason: this.applyForm.audit_reason,
        item_params: paramsData.map(({ id, attr_id, children }) => {
          return {
            attribute_id: id,
            attribute_value_id: attr_id,
            attribute_value_name: attr_id
              ? children.find(({ value }) => value == attr_id)?.label || ''
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
            specItems
              ?.filter((el) => el.spec_name)
              ?.map((item, index) => {
                const { sku_id, is_default, price, cost_price, market_price } = item
                const skuIds = sku_id.split('_')
                return {
                  ...item,
                  item_bn: is_new == 'true' ? '' : item.item_bn,
                  is_default: itemId ? index == 0 : is_default,
                  item_spec: skuIds.map((id) => {
                    let resItemSpec = {}
                    skus.forEach((s) => {
                      s.skuValue?.forEach(
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
      console.log('params', params)
      //处方药
      if (is_medicine == '1') {
        params = {
          ...params,
          is_medicine,
          medicine_type,
          manufacturer,
          common_name,
          special_common_name,
          approval_number,
          unit,
          packing_spec,
          dosage
        }
        if (is_prescription) {
          params = {
            ...params,
            is_prescription: '1',
            use_tip,
            symptom
          }
        } else {
          params.is_prescription = is_prescription ? '1' : '0'
        }
      } else {
        params.is_medicine = is_medicine
      }

      this.submitLoading = true
      try {
        if (itemId && !is_new) {
          await this.$api.goods.updateItems(itemId, {
            ...params,
            item_id: itemId
          })
          this.$message.success(this.$t('de022579.55aa63'))
        } else {
          await this.$api.goods.createItems(params)
          this.$message.success(this.$t('de022579.3fdaea'))
        }
        this.submitLoading = false
        this.isLeave = true
        // 安全调用父组件方法
        if (this.$parent && typeof this.$parent.onActivated === 'function') {
          this.$parent.onActivated()
        }
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
        notSupportedMessage: this.$t('de022579.01c0da'),
        controlBar: false
      }
    }
  }
}
</script>
