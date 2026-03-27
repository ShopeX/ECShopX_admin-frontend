<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.sp-filter-form {
  margin-bottom: 16px;
}
.tab-tools {
  text-align: right;
  @include clearfix();
  margin-bottom: 8px;
  .warn-input {
    display: flex;
    align-items: center;
    float: right;
    .el-input {
      width: 120px;
      margin: 0 8px;
    }
  }
}
</style>
<style lang="scss">
.supplier-goods-check {
  .edittext-col {
    display: flex;
    align-items: center;
    .edit-box {
      display: block;
    }
  }
}
</style>
<template>
  <div class="supplier-goods-check">
    <SpRouterView>
      <SpPage>
        <!--      <div v-if="IS_SUPPLIER()" class="action-container">-->
        <!--        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addItems">-->
        <!--          添加商品-->
        <!--        </el-button>-->
        <!--        <el-dropdown @command="handleImport">-->
        <!--          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">-->
        <!--            导入<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="physicalupload"> 商品导入 </el-dropdown-item>-->
        <!--            <el-dropdown-item command="physicalstoreupload"> 库存导入 </el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->
        <!--      </div>-->

        <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
          <SpFilterFormItem prop="keywords" :label="$t('d41d8cd9.9d02ac') + ':'">
            <el-input v-model="searchParams.keywords" :placeholder="$t('d41d8cd9.9d02ac')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="goods_bn" :label="$t('d41d8cd9.c3a815') + ':'">
            <el-input v-model="searchParams.goods_bn" :placeholder="$t('d41d8cd9.7d3a61')" />
          </SpFilterFormItem>
          <SpFilterFormItem prop="supplier_name" :label="$t('d41d8cd9.55c61d') + ':'">
            <el-input v-model="searchParams.supplier_name" :placeholder="$t('d41d8cd9.s8p9l1p')" />
          </SpFilterFormItem>
          <!--        <SpFilterFormItem prop="approve_status" label="商品状态:">-->
          <!--          <el-select v-model="searchParams.approve_status" clearable placeholder="请选择">-->
          <!--            <el-option-->
          <!--              v-for="item in statusOption"-->
          <!--              :key="item.value"-->
          <!--              :label="item.title"-->
          <!--              size="mini"-->
          <!--              :value="item.value"-->
          <!--            />-->
          <!--          </el-select>-->
          <!--        </SpFilterFormItem>-->
          <SpFilterFormItem prop="main_cat_id" :label="$t('d41d8cd9.7f29b6') + ':'">
            <el-cascader
              v-model="searchParams.main_cat_id"
              :placeholder="$t('d41d8cd9.3e1b0a')"
              clearable
              :options="itemCategoryList"
              :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
            />
          </SpFilterFormItem>
          <!-- <SpFilterFormItem prop="audit_status" label="审核状态:">
          <el-select v-model="searchParams.audit_status">
            <el-option value="processing" label="待审核" />
            <el-option value="approved" label="审核通过" />
            <el-option value="rejected" label="审核拒绝" />
          </el-select>
        </SpFilterFormItem> -->
          <SpFilterFormItem prop="templates_id" :label="$t('d41d8cd9.c9b832') + ':'">
            <el-select
              v-model="searchParams.templates_id"
              :placeholder="$t('d41d8cd9.3e1b0a')"
              clearable
            >
              <el-option
                v-for="item in templatesList"
                :key="item.template_id"
                :label="item.name"
                :value="item.template_id"
              />
            </el-select>
          </SpFilterFormItem>
          <!--        <SpFilterFormItem prop="tax_rate_code" label="税率编码:">-->
          <!--          <el-input v-model="searchParams.tax_rate_code" placeholder="商品编号或条形码" />-->
          <!--        </SpFilterFormItem>-->
          <SpFilterFormItem prop="brand_id" :label="$t('d41d8cd9.4a8f15') + ':'">
            <el-select
              v-model="searchParams.brand_id"
              :placeholder="$t('d41d8cd9.5b6c09')"
              remote
              filterable
              clearable
              :remote-method="getGoodsBranchList"
            >
              <el-option
                v-for="item in goodsBranchList"
                :key="item.attribute_id"
                :label="item.attribute_name"
                :value="item.attribute_id"
              />
            </el-select>
          </SpFilterFormItem>
          <SpFilterFormItem prop="regions_id" :label="$t('d41d8cd9.d82b43') + ':'">
            <el-cascader
              v-model="searchParams.regions_id"
              :placeholder="$t('d41d8cd9.3e1b0a')"
              clearable
              :options="regions"
            />
          </SpFilterFormItem>
          <!--        <SpFilterFormItem prop="delivery_data_type" label="发货方式:">-->
          <!--          <el-select v-model="searchParams.delivery_data_type">-->
          <!--            <el-option value="fixed_date" label="指定发货日期" />-->
          <!--            <el-option value="relative_date" label="相对发货日期" />-->
          <!--          </el-select>-->
          <!--        </SpFilterFormItem>-->
          <SpFilterFormItem prop="item_bn" :label="$t('d41d8cd9.8a2c1f') + ':'">
            <el-input v-model="searchParams.item_bn" />
          </SpFilterFormItem>
        </SpFilterForm>

        <div class="action-container">
          <el-button type="primary" plain @click="Examine"> {{ $t('d41d8cd9.298be1') }} </el-button>
        </div>

        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane
            v-for="(item, index) in tabList"
            :key="index"
            :label="item.name"
            :name="item.activeName"
          >
            <!-- <div v-if="activeName == 'second'" class="tab-tools">
            <div class="warn-input">
              <label class="label">预警数量:</label>
              <el-input v-model="warning_store" size="small" value="warning_store" />
              <el-button type="text" @click="setWarningStore"> 保存 </el-button>
            </div>
          </div> -->
          </el-tab-pane>
        </el-tabs>

        <SpFinder
          ref="finder"
          :url="IS_DISTRIBUTOR() ? '/distributor/items' : '/goods/items'"
          fixed-row-action
          row-actions-width="200px"
          :other-config="{}"
          :setting="tableList"
          :hooks="{
            beforeSearch: beforeSearch
          }"
          row-actions-fixed-align="left"
          @selection-change="onSelectionChange"
        />

        <!-- 设置会员价 -->
        <SpDrawer
          v-model="showMemberPriceDrawer"
          :title="$t('d41d8cd9.c7d8e9')"
          :width="800"
          :confirm-text="$t('d41d8cd9.f0a1b2')"
          @confirm="onSaveMemberPrice"
        >
          <el-table v-loading="skuLoading" border :data="specItems" height="100%">
            <el-table-column :label="$t('d41d8cd9.c3d4e5')" prop="item_spec_desc" min-width="120" />
            <el-table-column :label="$t('d41d8cd9.f6g7h8')" prop="market_price" width="100">
              <template slot-scope="scope"> ¥{{ scope.row.market_price }} </template>
            </el-table-column>
            <el-table-column :label="$t('d41d8cd9.i9j0k1')" width="160">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.price"
                  controls-position="right"
                  size="small"
                  :min="0"
                  :precision="2"
                  style="width: 120px"
                  @change="updateGoodsSkuPrice(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d41d8cd9.l2m3n4')">
              <el-table-column v-for="(item, index) in grade" :key="index" :label="item.grade_name">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.grade[index].mprice"
                    controls-position="right"
                    size="small"
                    :min="0"
                    :precision="2"
                    style="width: 120px"
                  />
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :label="$t('d41d8cd9.o5p6q7')">
              <el-table-column
                v-for="(item, index) in vipGrade"
                :key="index"
                :label="item.grade_name"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.vipGrade[index].mprice"
                    controls-position="right"
                    size="small"
                    :min="0"
                    :precision="2"
                    style="width: 120px"
                  />
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </SpDrawer>

        <!-- 设置商品库存 -->
        <SpDrawer
          v-model="showItemStoreDrawer"
          :title="$t('d41d8cd9.r8s9t0')"
          :width="800"
          @confirm="onSaveItemStore"
        >
          <el-table v-loading="skuLoading" border :data="storeItemsList" height="100%">
            <el-table-column :label="$t('d41d8cd9.c3d4e5')" prop="item_spec_desc" min-width="120" />
            <el-table-column :label="$t('d41d8cd9.k8s9t0u')">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.store"
                  controls-position="right"
                  size="small"
                  :min="0"
                  style="width: 120px"
                />
              </template>
            </el-table-column>
          </el-table>
        </SpDrawer>

        <!-- 更改销售分类 -->
        <SpDialog
          ref="saleCategoryDialogRef"
          v-model="saleCategoryDialog"
          :title="$t('dc9cefd6.51af77')"
          :form="saleCategoryForm"
          :form-list="saleCategoryFormList"
          @onSubmit="onSaleCategorySubmit"
        />

        <!-- 运费模板 -->
        <SpDialog
          ref="freightTemplateDialogRef"
          v-model="freightTemplateDialog"
          :title="$t('d41d8cd9.a7b8c0')"
          :form="freightTemplateForm"
          :form-list="freightTemplateFormList"
          @onSubmit="onFreightTemplateSubmit"
        />

        <!-- 批量修改库存 -->
        <SpDialog
          ref="storeItemDialogRef"
          v-model="storeItemDialog"
          :title="$t('d41d8cd9.d1e2f3')"
          :form="storeItemForm"
          :form-list="storeItemFormList"
          @onSubmit="onStoreItemSubmit"
        />

        <!-- 批量改价 -->
        <!-- <SpDialog
        ref="changePriceDialogRef"
        v-model="changePriceDialog"
        title="批量改价"
        :form="changePriceForm"
        :form-list="changePriceFormList"
        @onSubmit="onChangePriceSubmit"
      /> -->

        <!-- 打标签 -->
        <SpDialog
          ref="labelDialogRef"
          v-model="labelDialog"
          :title="$t('d41d8cd9.g4h5i6')"
          :modal="false"
          :form="labelForm"
          :form-list="labelFormList"
          @onSubmit="onLabelFormSubmit"
        />

        <!-- 查看多规格信息 -->
        <SpDrawer
          v-model="showItemSkuDrawer"
          :title="itemSkuDrawerTitle"
          :width="800"
          @confirm="
            () => {
              showItemSkuDrawer = false
            }
          "
        >
          <el-table v-loading="skuLoading" border :data="itemSkuList" height="100%">
            <el-table-column :label="$t('d41d8cd9.c3d4e5')" prop="item_spec_desc" min-width="120" />
            <el-table-column
              :label="$t('d41d8cd9.j7k8l9')"
              prop="supplier_goods_bn"
              min-width="120"
            />
            <el-table-column :label="$t('d41d8cd9.m0n1o2')" prop="tax_rate_code" min-width="120" />
            <el-table-column :label="$t('d41d8cd9.p3q4r5')" prop="tax_rate" min-width="120">
              <template slot-scope="scope">
                <span>{{ `${scope.row.tax_rate}%` }}</span>
              </template>
            </el-table-column>
          </el-table>
        </SpDrawer>

        <el-dialog :title="$t('d41d8cd9.s6t7u8')" :visible.sync="dialogVisibleExamine" width="30%">
          <el-form ref="form" :model="examineForm" label-width="80px">
            <el-form-item :label="$t('d41d8cd9.v9w0x1')">
              <el-radio-group v-model="examineForm.audit_status">
                <el-radio label="approved"> {{ $t('d41d8cd9.y2z3a4') }} </el-radio>
                <el-radio label="rejected"> {{ $t('d41d8cd9.b5c6d7') }} </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="examineForm.audit_status == 'rejected'"
              :label="$t('d41d8cd9.e8f9g0')"
            >
              <el-input v-model="examineForm.audit_reason" type="textarea" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="examineLoading" @click="onSubmitExamine">
                {{ $t('d41d8cd9.aa7527') }}
              </el-button>
              <el-button @click="dialogVisibleExamine = false">
                {{ $t('d41d8cd9.625fb2') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </SpPage>
    </SpRouterView>
  </div>
</template>
<script>
import moment from 'moment'
import { IS_SUPPLIER } from '@/utils'
import { GOODS_APPLY_STATUS } from '@/consts'
import { batchReviewItems } from '@/api/goods'

export default {
  data() {
    const loginType = this.$store.getters.login_type
    let statusOption
    if (loginType == 'distributor') {
      statusOption = [
        { title: this.$t('d41d8cd9.a8b0c2'), value: '' },
        { title: this.$t('d41d8cd9.h1i2j3'), value: 'rejected' },
        { title: this.$t('d41d8cd9.k4l5m6'), value: 'processing' },
        { title: this.$t('d41d8cd9.9b7481'), value: 'onsale' },
        { title: this.$t('d41d8cd9.2c50a0'), value: 'offline_sale' },
        { title: this.$t('d41d8cd9.acf86b'), value: 'only_show' },
        { title: this.$t('d41d8cd9.ae83a3'), value: 'instock' }
      ]
    } else {
      statusOption = [
        { title: this.$t('d41d8cd9.a8b0c2'), value: '' },
        { title: this.$t('d41d8cd9.9b7481'), value: 'onsale' },
        { title: this.$t('d41d8cd9.2c50a0'), value: 'offline_sale' },
        { title: this.$t('d41d8cd9.acf86b'), value: 'only_show' },
        { title: this.$t('d41d8cd9.ae83a3'), value: 'instock' }
      ]
    }

    const tabList = [
      { name: this.$t('d41d8cd9.a9c0d1'), value: 'all', activeName: 'first' },
      { name: this.$t('d41d8cd9.c3f6a8'), value: 'processing', activeName: 'processing' },
      { name: this.$t('d41d8cd9.d4a7b9'), value: 'approved', activeName: 'approved' },
      { name: this.$t('d41d8cd9.e5b8ca'), value: 'rejected', activeName: 'rejected' }
    ]

    return {
      show_profit_sideBar: false,
      select_tags_value: [],
      examineForm: {
        audit_status: 'approved',
        audit_reason: ''
      },
      current: '',
      currentId: '',
      currentPrice: '',
      tabList,
      activeName: 'first',
      goodsName: '',
      isEdit: false,
      ItemsList: [],
      item_id: [],
      goods_id: [],
      templates_new_id: '',

      category_id: [],
      show_sideBar: false,
      loading: false,

      submitLoading: false,
      total_count: 0,
      warning_store: 5,
      templatesParams: {
        page: 1,
        pageSize: 1000
      },
      goodsBranchList: [],
      appID: '',
      appCodeUrl: '',
      curPageUrl: '',
      goodsBranchParams: {
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: ''
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      searchParams: {
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        item_bn: '',
        category: 0,
        item_category: 0,
        is_warning: false,
        audit_status: '',
        delivery_data_type: '',
        tag_id: '',
        tax_rate_code: '',
        is_gift: undefined,
        type: 0,
        barcode: '',
        distributor_id: 0,
        regions_id: [],
        brand_id: '',
        goods_bn: '',
        supplier_name: ''
      },
      start_date: '',
      end_date: '',
      addCategorydialogVisible: false,
      dialogVisibleExamine: false,
      examineLoading: false,
      form: {},
      isGiftsData: {},
      exportData: {},
      exportTagData: {},

      tagList: [],
      grade: [],
      vipGrade: [],
      statusOption: statusOption,
      itemstore: 0,
      distributorVisible: false,
      setDistributorStatus: false,
      relDistributorIds: '',
      selections: [],
      // showSelectGoods: true,
      xpGoodsVisible: false,
      batchChangeStateDialog: false,
      batchChangeStateFormList: [
        {
          label: this.$t('d41d8cd9.d2a6c3') + ':',
          key: 'status',
          type: 'select',
          message: this.$t('d41d8cd9.n7o8p9'),
          options: statusOption
        }
      ],
      batchChangeStateForm: {
        status: ''
      },

      categoryList: [],
      templatesList: [],
      templatesListavailable: [],
      itemCategoryList: [],
      regions: [],
      showMemberPriceDrawer: false,
      showItemStoreDrawer: false,
      specItems: [],
      storeItemsList: [],
      skuLoading: false,
      showItemSkuDrawer: false,
      itemSkuDrawerTitle: '',
      itemSkuList: [],
      labelDialog: false,
      labelForm: {
        item_id: []
      },
      labelFormList: [
        {
          label: this.$t('d41d8cd9.q0r1s2'),
          key: '',
          component: ({ key }, value) => (
            <div>
              {this.tagList
                .filter((item) => !!item.selected)
                .map((item) => (
                  <el-tag
                    closable
                    on-close={() => (item.selected = false)}
                    style='margin: 0 10px 10px 0;'
                  >
                    {item.tag_name}
                  </el-tag>
                ))}
            </div>
          )
        },
        {
          label: this.$t('d41d8cd9.t3u4v5'),
          key: '',
          component: ({ key }, value) => (
            <div>
              {this.tagList
                .filter((item) => !item.selected)
                .map((item) => (
                  <el-button
                    plain
                    size='mini'
                    class='tag-item'
                    onClick={() => {
                      item.selected = true
                    }}
                  >
                    {item.tag_name}
                  </el-button>
                ))}
            </div>
          )
        }
      ],
      selectionItems: [],
      saleCategoryDialog: false,
      saleCategoryForm: {
        item_id: [],
        category_id: ''
      },
      saleCategoryFormList: [
        {
          label: this.$t('dc9cefd6.392d49'),
          key: 'category_id',
          component: ({ key }, value) => (
            <el-cascader
              v-model={value[key]}
              props={{
                props: {
                  value: 'category_id',
                  label: 'category_name',
                  multiple: true,
                  checkStrictly: true,
                  children: 'children'
                }
              }}
              options={this.categoryList}
            />
          )
        }
      ],
      freightTemplateDialog: false,
      freightTemplateForm: {
        item_id: [],
        templates_id: ''
      },
      freightTemplateFormList: [
        {
          label: this.$t('d41d8cd9.c9b832'),
          key: 'templates_id',
          component: ({ key }, value) => (
            <el-select v-model={value[key]}>
              {this.templatesListavailable.map((item) => (
                <el-option label={item.name} value={item.template_id} />
              ))}
            </el-select>
          )
        }
      ],
      storeItemDialog: false,
      storeItemForm: {
        item_id: [],
        storeNum: undefined
      },
      storeItemFormList: [
        {
          label: this.$t('d41d8cd9.k8s9t0u'),
          key: 'storeNum',
          component: ({ key }, value) => (
            <el-input-number
              v-model={value[key]}
              controls-position='right'
              min={0}
              style='width: 120px'
            />
          )
        }
      ],
      changePriceDialog: false,
      changePriceForm: {},
      changePriceFormList: [],

      tableList: {
        actions: [
          {
            name: this.$t('d41d8cd9.w6x7y8'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return row.audit_status == 'processing'
            },
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true',
                    supplier: true,
                    prohibit: 1,
                    isSupplierGoods: true
                  }
                })
              }
            }
          },
          {
            name: this.$t('d41d8cd9.z9a0b1'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true',
                    isSupplierGoods: true,
                    detail: true
                  }
                })
              }
            }
          }
        ],
        columns: [
          {
            name: this.$t('d41d8cd9.c2d3e4'),
            key: 'item_id',
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.f5g6h7'),
            key: 'main_item_id',
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.i8j9k0'),
            key: 'itemName',
            width: 280,
            render: (h, scope) => {
              return (
                <div>
                  <div style='white-space: normal;'>
                    {scope.row.itemName}
                    {!scope.row.nospec && (
                      <el-tag
                        size='mini'
                        effect='plain'
                        type='primary'
                        style='margin-left: 4px; cursor: default;'
                        on-click={() => {
                          this.handleViewSkuInfo(scope.row)
                        }}
                      >
                        {this.$t('d41d8cd9.e8b3c6')}
                        <i
                          class='ecx-icon icon-sousuo'
                          style='font-size: 12px; margin-left: 2px;'
                        ></i>
                      </el-tag>
                    )}
                  </div>
                  <div style='color: #666;'>
                    {`${this.$t('d41d8cd9.b1f6ae')}${scope.row.goods_bn}`}
                    <el-tooltip
                      effect='dark'
                      content={this.$t('d41d8cd9.l1m2n3')}
                      placement='top-start'
                    >
                      <i
                        on-click={() => {
                          this.$copyText(scope.row.goods_bn).then(() => {
                            this.$message.success(this.$t('d41d8cd9.o4p5q6'))
                          })
                        }}
                        class='el-icon-document-copy'
                        style='margin-left: 4px;'
                      />
                    </el-tooltip>
                  </div>
                </div>
              )
            }
          },
          { name: this.$t('d41d8cd9.0888fc'), key: 'item_bn' },
          { name: this.$t('d41d8cd9.55c61d'), key: 'supplier_name' },
          {
            name: this.$t('d41d8cd9.g4h5i6'),
            key: 'tagList',
            render: (h, scope) => (
              <div style='white-space: normal;'>
                {scope.row.tagList.map((item) => (
                  <span
                    style={{
                      color: item.font_color,
                      'background-color': item.tag_color,
                      'font-size': '12px',
                      padding: '2px 5px',
                      'border-radius': '2px',
                      margin: '0 8px 8px 0'
                    }}
                  >
                    {item.tag_name}
                  </span>
                ))}
              </div>
            )
          },
          // {
          //   name: '商品税率',
          //   key: 'tax_rate',
          //   formatter: (value) => {
          //     return value + '%'
          //   },
          //   align: "right",
          //   headerAlign: 'center'
          // },
          {
            name: this.$t('d41d8cd9.r7s8t9'),
            key: 'sort',
            width: 120,
            showType: 'editable',
            componentProps: {
              icon: 'el-icon-plus',
              change: async (v, row) => {
                await this.$api.goods.setItemsSort({ sort: v, item_id: row.itemId })
                this.$refs['finder'].refresh()
              }
            }
          },
          { name: this.$t('d41d8cd9.k8s9t0u'), key: 'store', align: 'right', headerAlign: 'center' },
          {
            name: this.$t('d41d8cd9.u0v1w2'),
            key: 'market_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.x3y4z5'),
            key: 'price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.a6b7c8'),
            key: 'cost_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.d9e0f1'),
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('d41d8cd9.6e27f4'),
            key: 'is_market',
            formatter: (value, row, col) => {
              return value == '1' ? this.$t('d41d8cd9.8c1a2d') : this.$t('d41d8cd9.f4b3e1')
            }
          },
          // {
          //   name: '商品状态',
          //   width: 120,
          //   key: 'approve_status',
          //   formatter: (value, row, col) => {
          //     return this.statusOption.find((item) => item.value === value)?.title
          //   }
          // },
          {
            name: this.$t('d41d8cd9.v9w0x1'),
            key: 'audit_status',
            formatter: (value, row, col) => {
              return GOODS_APPLY_STATUS[value]
            }
          },
          { name: this.$t('d41d8cd9.a52e1c'), key: 'itemCatName', minWidth: 120 },
          {
            name: this.$t('d41d8cd9.ec05e3'),
            key: 'created',
            width: 160,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          {
            name: this.$t('d41d8cd9.g2h3i4'),
            key: 'audit_date',
            width: 160,
            formatter: (value, row, col) => {
              return value ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
            }
          },
          {
            name: this.$t('d41d8cd9.9b6f13'),
            key: 'updated',
            width: 160,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
    this.getAddress()
    this.getShippingTemplatesList()
    this.$activated = () => {
      this.$refs['finder'].refresh()
    }
  },
  methods: {
    beforeSearch(params) {
      params = {
        ...params,
        item_type: 'normal',
        operate_source: 'supplier',
        ...this.searchParams
      }
      return params
    },
    onSearch() {
      this.$refs['finder'].refresh(true)
    },
    async getShippingTemplatesList() {
      const { list } = await this.$api.shipping.getShippingTemplatesList({
        page: 1,
        pageSize: 1000
      })
      this.templatesList = list
      this.templatesListavailable = list.filter((item) => item.status)
    },
    async getCategory() {
      //销售分类
      const categoryList = await this.$api.goods.getCategory({ is_show: false })
      this.categoryList = categoryList

      //管理分类
      const itemCategoryList = await this.$api.goods.getCategory({ is_main_category: true })
      this.itemCategoryList = itemCategoryList
    },
    async getMemberPriceByGoods(item_id) {
      this.currentId = item_id
      this.skuLoading = true
      this.showMemberPriceDrawer = true
      const specItems = []
      const { list } = await this.$api.goods.getGoodsPrice(item_id)
      list.forEach((item) => {
        specItems.push({
          item_id: item.item_id,
          item_spec_desc: item.item_spec_desc || item.itemName,
          is_edit: false,
          price: item.price / 100,
          market_price: item.market_price / 100,
          grade: this.generatePrice(item.memberGrade.grade),
          vipGrade: this.generatePrice(item.memberGrade.vipGrade)
        })
      })
      this.grade = this.generatePrice(list[0].memberGrade.grade)
      this.vipGrade = this.generatePrice(list[0].memberGrade.vipGrade)
      this.specItems = specItems
      this.skuLoading = false
    },
    async getSkuStoreByGoods(item_id) {
      this.skuLoading = true
      const { list } = await this.$api.goods.getItemsList({
        item_type: 'normal',
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        item_id,
        is_sku: true,
        page: 1,
        pageSize: 1000
      })
      this.showItemStoreDrawer = true
      this.storeItemsList = list.map((item) => {
        return {
          item_id: item.item_id,
          store: item.store,
          item_spec_desc: item.item_spec_desc ? item.item_spec_desc : item.item_name
        }
      })
      this.skuLoading = false
    },
    async getAllTagLists() {
      const { list } = await this.$api.goods.getTagList({
        page: 1,
        pageSize: 500
      })
      this.tagList = list.map((item) => {
        return {
          ...item,
          selected: false
        }
      })
    },
    async onSaveMemberPrice() {
      const param = {
        item_id: this.currentId,
        mprice: ''
      }
      console.log('specItems', this.specItems)
      let skus = {}
      this.specItems.forEach((item) => {
        let grade = {}
        item.grade.forEach((child) => {
          Object.assign(grade, { [child.vip_grade_id]: child.mprice > 0 ? child.mprice : '' })
        })
        let vipGrade = {}
        item.vipGrade.forEach((child) => {
          Object.assign(vipGrade, { [child.vip_grade_id]: child.mprice > 0 ? child.mprice : '' })
        })
        skus[item.item_id] = {
          grade,
          vipGrade
        }
      })
      param.mprice = JSON.stringify(skus)
      this.showMemberPriceDrawer = false
      await this.$api.goods.updateGoodsPrice(param)
      this.$message.success(this.$t('58789194.55aa63'))
      this.$refs['finder'].refresh()
    },
    async onSaveItemStore() {
      const params = {
        items: JSON.stringify(this.storeItemsList),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      }
      await this.$api.goods.updateItemsStore(params)
      this.$message.success(this.$t('58789194.69be67'))
      this.$refs['finder'].refresh()
      this.showItemStoreDrawer = false
    },
    handleTabClick() {
      if (this.activeName == 'first') {
        this.searchParams.is_warning = false
        this.searchParams.audit_status = ''
      } else if (this.activeName == 'second') {
        this.searchParams.is_warning = true
        this.searchParams.audit_status = ''
      } else {
        this.searchParams.is_warning = false
        this.searchParams.audit_status = this.activeName
      }
      this.$refs['finder'].refresh()
    },
    onSelectionChange(selection) {
      this.selectionItems = selection
    },
    changeCategory() {
      if (this.selectionItems.length > 0) {
        this.saleCategoryForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.saleCategoryDialog = true
      } else {
        this.$message.error(this.$t('dc9cefd6.ace302'))
      }
    },
    async onSaleCategorySubmit() {
      const { item_id, category_id } = this.saleCategoryForm
      const _category_id = category_id.map((item) => {
        return item[item.length - 1]
      })
      await this.$api.goods.setItemsCategory({ item_id, category_id: _category_id })
      this.$message.success(this.$t('dc9cefd6.33130f'))
      this.saleCategoryDialog = false
      this.$refs['finder'].refresh()
    },
    changeFreightTemplate() {
      if (this.selectionItems.length > 0) {
        this.freightTemplateForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.freightTemplateDialog = true
      } else {
        this.$message.error(this.$t('58789194.ace302'))
      }
    },
    async onFreightTemplateSubmit() {
      const { item_id, templates_id } = this.freightTemplateForm
      await this.$api.goods.setItemsTemplate({
        templates_id,
        item_id
      })
      this.$message.success(this.$t('58789194.33130f'))
      this.freightTemplateDialog = false
      this.$refs['finder'].refresh()
    },
    changeItemsStore() {
      if (this.selectionItems.length > 0) {
        this.storeItemForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.storeItemDialog = true
      } else {
        this.$message.error(this.$t('58789194.ace302'))
      }
    },
    async onStoreItemSubmit() {
      const { item_id, storeNum } = this.storeItemForm
      const data = []
      item_id.forEach((id) => {
        data.push({ item_id: id, store: storeNum, is_default: true })
      })
      await this.$api.goods.updateItemsStore({
        items: JSON.stringify(data),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      })
      this.$message.success(this.$t('58789194.33130f'))
      this.storeItemDialog = false
      this.$refs['finder'].refresh()
    },
    changeGoodsPrice() {
      if (this.selectionItems.length > 0) {
        this.changePriceDialog = true
      } else {
        this.$message.error(this.$t('58789194.ace302'))
      }
    },
    // 批量审批
    Examine() {
      if (this.selectionItems.length === 0) {
        this.$message.error(this.$t('58789194.ace302'))
        return false
      }

      this.dialogVisibleExamine = true
    },
    // 审核确定
    onSubmitExamine() {
      this.examineForm.item_ids = this.selectionItems.map((item) => item.item_id).join(',')
      this.examineLoading = true
      batchReviewItems(this.examineForm)
        .then((res) => {
          this.$message.success(this.$t('58789194.3b1083'))
          this.dialogVisibleExamine = false
          this.$refs['finder'].refresh()
        })
        .finally(() => {
          this.examineLoading = false
        })
    },
    async onChangePriceSubmit() {},
    changeGoodsLabel() {
      if (this.selectionItems.length > 0) {
        this.labelForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.tagList.forEach((item) => {
          item.selected = false
        })
        this.labelDialog = true
      } else {
        this.$message.error(this.$t('58789194.ace302'))
      }
    },
    async onLabelFormSubmit() {
      const { item_id } = this.labelForm
      const tagIds = this.tagList.filter((item) => !!item.selected).map((item) => item.tag_id)
      await this.$api.goods.itemsRelTags({
        item_ids: item_id,
        tag_ids: tagIds
      })
      this.labelDialog = false
      this.$message.success(this.$t('58789194.33130f'))
      this.$refs['finder'].refresh()
    },
    // 获取地区列表
    async getAddress() {
      const res = await this.$api.common.getAddress()
      this.regions = res
    },
    // 同步至店铺
    async syncToShop(isAll) {
      if (this.selectionItems.length == 0) {
        this.$message.error(this.$t('58789194.ace302'))
        return
      }
      let distributorIds = '_all'
      if (!isAll) {
        const { data } = await this.$picker.shop()
        distributorIds = data.map((item) => item.distributor_id)
      }
      await this.$api.marketing.saveDistributorItems({
        distributor_ids: distributorIds,
        item_ids: this.selectionItems.map((item) => item.item_id),
        // 是否同步并上架
        is_can_sale: false
      })
      this.$message.success(this.$t('58789194.33130f'))
    },

    handleDownload(name) {
      var a = document.createElement('a')
      var temp = name
      if (this.appCodeUrl) {
        a.href = this.appCodeUrl
        a.download = temp + '.png'
        a.click()
      }
    },
    handleImport(command) {
      this.$router.push({ path: `${this.$route.path}/${command}` })
    },
    async init() {
      const { category, item_category, main_cat_id, tab } = this.$route.query
      if (category) {
        this.searchParams.category = category.split(',')
      }
      if (item_category) {
        this.searchParams.item_category = item_category.split(',')
      }
      this.searchParams.main_cat_id = this.$route.query.main_cat_id
      if (tab) {
        this.activeName = this.$route.query.tab
        this.searchParams.is_warning = true
      }

      this.getCategory()
      this.getAllTagLists()
      this.getGoodsBranchList()
    },

    async updateGoodsSkuPrice({ item_id, price }) {
      await this.$api.goods.updateGoodsInfo({ item_id, price })
      this.$message.success(this.$t('58789194.33130f'))
    },

    async setWarningStore() {
      await this.$api.goods.getItemWarningStore({ store: this.warning_store })
      this.$refs['finder'].refresh()
    },

    addItems() {
      // 添加商品
      this.$router.push({ path: `${this.$route.path}/editor` })
    },
    generatePrice(data) {
      let list = []
      for (let key in data) {
        list.push({
          vip_grade_id: data[key].vip_grade_id,
          grade_name: data[key].grade_name,
          mprice: data[key].mprice / 100 || undefined
        })
      }
      return list
    },
    async getGoodsBranchList(searchVal = '') {
      this.goodsBranchParams.attribute_name = searchVal
      const { list } = await this.$api.goods.getGoodsAttr(this.goodsBranchParams)
      this.goodsBranchList = list
    },
    async handleViewSkuInfo(item) {
      this.skuLoading = true
      const { list } = await this.$api.goods.getItemsList({
        item_type: 'normal',
        operate_source: 'supplier',
        item_id: item.item_id,
        is_sku: true,
        page: 1,
        pageSize: 1000
      })
      this.itemSkuDrawerTitle = this.$t('58789194.9897d8') + '【' + item.item_name + '】'
      this.itemSkuList = list || []
      this.showItemSkuDrawer = true
      this.itemSkuList = list
      this.skuLoading = false
    }
  }
}
</script>
