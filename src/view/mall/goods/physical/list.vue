<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpRouterView>
    <SpPage>
      <SpFormPlus
        ref="searchForm"
        v-model="searchParams"
        :form-items="searchFormItems"
        form-type="searchForm"
        @submit="onSearch"
      />
      <div class="action-container mt-4">
        <el-button type="primary" @click="addItems"> {{ $t('d41d8cd9.fa3aee') }} </el-button>

        <el-button v-if="!IS_SUPPLIER()" type="primary" @click="changeCategory">
          {{ $t('d41d8cd9.51af77') }}
        </el-button>
        <el-button v-if="!IS_SUPPLIER()" type="primary" @click="changeGoodsLabel">
          {{ $t('d41d8cd9.fedbca') }}
        </el-button>
        <el-button type="primary" @click="changeFreightTemplate">
          {{ $t('d41d8cd9.a7aae3') }}
        </el-button>
        <el-button
          v-if="!IS_ADMIN() && !IS_DISTRIBUTOR()"
          type="primary"
          @click="onBatchSubmitItems"
        >
          {{ $t('d41d8cd9.298be1') }}
        </el-button>
        <el-button type="primary" @click="changeItemsStore">
          {{ $t('d41d8cd9.0648ad') }}
        </el-button>
        <el-button v-if="!IS_SUPPLIER()" type="primary" @click="batchChangeStore">
          {{ $t('d41d8cd9.836304') }}
        </el-button>
        <el-button type="primary" @click="batchGifts('true')">
          {{ $t('d41d8cd9.86a83b') }}
        </el-button>
        <el-button type="primary" @click="batchGifts('false')">
          {{ $t('d41d8cd9.389203') }}
        </el-button>

        <el-button v-if="IS_SUPPLIER()" type="primary" @click="() => changeHaltTheSales('stop')">
          {{ $t('d41d8cd9.965407') }}
        </el-button>
        <el-button v-if="IS_SUPPLIER()" type="primary" @click="() => changeHaltTheSales('start')">
          {{ $t('d41d8cd9.1cc97f') }}
        </el-button>
        <!-- <el-button type="primary" plain @click="changeGoodsPrice"> 批量改价 </el-button> -->
        <el-dropdown @command="handleImport">
          <el-button type="primary" icon="iconfont icon-daorucaozuo-01">
            {{ $t('d41d8cd9.8d9a07') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="$store.getters.login_type != 'merchant'"
              command="product-import"
            >
              {{ $t('d41d8cd9.9745ac') }}
            </el-dropdown-item>
            <el-dropdown-item command="stock-import">
              {{ $t('d41d8cd9.ac5320') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown @command="handleExport">
          <el-button type="primary">
            {{ $t('d41d8cd9.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="product-info">
              {{ $t('d41d8cd9.b433e6') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()" command="product-tag">
              {{ $t('d41d8cd9.0f394b') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()" command="wxapp-qrcode">
              {{ $t('d41d8cd9.b85b43') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="!VERSION_SHUYUN() && !IS_SUPPLIER()" command="h5-qrcode">
              {{ $t('d41d8cd9.cde87b') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-if="isBindJstErp" size="small" type="primary" @click="uploadJstErpItems()">
          {{ $t('d41d8cd9.78a38b') }}
        </el-button>
        <!-- <el-button size="small" v-if="isBindJstErp" type="primary" @click="queryInventory()">同步聚水潭商品库存</el-button> -->
        <el-button v-if="isBindWdtErp" size="small" type="primary" @click="uploadWdtErpItems()">
          {{ $t('d41d8cd9.fe2216') }}
        </el-button>
        <el-dropdown v-if="VERSION_STANDARD() && IS_ADMIN()">
          <el-button type="primary">
            {{ $t('d41d8cd9.5aa3a7') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="() => syncToShop()">{{ $t('d41d8cd9.2b7f47') }}</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="syncToShop('all')"> {{ $t('d41d8cd9.b634bc') }} </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <SpPageUpload />

      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <div v-if="activeName == 'second'" class="tab-tools">
            <div class="warn-input">
              <label class="label text-sm text-normary">{{ $t('d41d8cd9.7bee86') }}</label>
              <el-input v-model="warning_store" size="small" value="warning_store" />
              <el-button type="text" @click="setWarningStore">
                {{ $t('d41d8cd9.be5fbb') }}
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <SpFinder
        ref="finder"
        :url="IS_DISTRIBUTOR() ? '/distributor/items' : '/goods/items'"
        fixed-row-action
        :row-actions-align="'left'"
        row-actions-width="160px"
        :other-config="{}"
        :setting="tableList"
        :hooks="{
          beforeSearch: beforeSearch,
          afterSearch: afterSearch
        }"
        row-actions-fixed-align="left"
        @selection-change="onSelectionChange"
      />

      <!-- 设置会员价 -->
      <SpDrawer
        v-model="showMemberPriceDrawer"
        :title="$t('dc9cefd6.fb2f7a')"
        :width="800"
        :confirm-text="$t('dc9cefd6.be5fbb')"
        @confirm="onSaveMemberPrice"
      >
        <el-table v-loading="skuLoading" border :data="specItems" height="100%">
          <el-table-column :label="$t('dc9cefd6.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column :label="$t('dc9cefd6.818fc4')" prop="market_price" width="160">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.market_price"
                controls-position="right"
                :min="0"
                :precision="2"
                style="width: 120px"
                @change="updateGoodsSkuPrice(scope.row, 'market_price')"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('dc9cefd6.e29575')" width="160">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.price"
                controls-position="right"
                :min="0"
                :precision="2"
                style="width: 120px"
                @change="updateGoodsSkuPrice(scope.row, 'price')"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('dc9cefd6.2e2ce2')" width="160">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.cost_price"
                controls-position="right"
                :min="0"
                :precision="2"
                style="width: 120px"
                @change="updateGoodsSkuPrice(scope.row, 'cost_price')"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('dc9cefd6.4d9dd5')">
            <el-table-column v-for="(item, index) in grade" :key="index" :label="item.grade_name">
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.grade[index].mprice"
                  controls-position="right"
                  :min="0"
                  :precision="2"
                  style="width: 120px"
                />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$t('dc9cefd6.bc0883')">
            <el-table-column
              v-for="(item, index) in vipGrade"
              :key="index"
              :label="item.grade_name"
            >
              <template slot-scope="scope">
                <el-input-number
                  v-model="scope.row.vipGrade[index].mprice"
                  controls-position="right"
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
        :title="$t('dc9cefd6.b20f18')"
        :width="800"
        @confirm="onSaveItemStore"
      >
        <el-table v-loading="skuLoading" border :data="storeItemsList" height="100%">
          <el-table-column :label="$t('dc9cefd6.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column :label="$t('dc9cefd6.0eac88')">
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
        :title="$t('dc9cefd6.a7aae3')"
        :form="freightTemplateForm"
        :form-list="freightTemplateFormList"
        @onSubmit="onFreightTemplateSubmit"
      />

      <!-- 批量修改库存 -->
      <SpDialog
        ref="storeItemDialogRef"
        v-model="storeItemDialog"
        :title="$t('dc9cefd6.ad7f06')"
        :form="storeItemForm"
        :form-list="storeItemFormList"
        @onSubmit="onStoreItemSubmit"
      />

      <!-- 批量改价 -->
      <!-- <SpDialog
        ref="changePriceDialogRef"
        v-model="changePriceDialog"
        :title="$t('d41d8cd9.g1h2i3')"
        :form="changePriceForm"
        :form-list="changePriceFormList"
        @onSubmit="onChangePriceSubmit"
      /> -->

      <!-- 打标签 -->
      <SpDialog
        ref="labelDialogRef"
        v-model="labelDialog"
        :title="$t('dc9cefd6.14d342')"
        :modal="false"
        :form="labelForm"
        :form-list="labelFormList"
        @onSubmit="onLabelFormSubmit"
      />

      <el-dialog :title="$t('dc9cefd6.d513d9')" width="600px" :visible.sync="commissionDialog">
        <el-form ref="form" :model="commissionForm" label-width="150px">
          <el-form-item :label="$t('dc9cefd6.43ae04')">
            <el-input v-model="commissionForm.commission_ratio" maxlength="5" style="width: 160px">
              <template slot="append">%</template>
            </el-input>
            <div class="frm-tips">{{ $t('d41d8cd9.e3c004') }}</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="formLoading" @click="commissionSubmit">
              {{ $t('d41d8cd9.4323be') }}
            </el-button>
            <el-button @click="commissionDialog = false">{{ $t('d41d8cd9.625fb2') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <SpDialog
        ref="sendNumDialogRef"
        v-model="batchChangeStateDialog"
        :title="$t('dc9cefd6.85b124')"
        :width="'500px'"
        :form="batchChangeStateForm"
        :form-list="batchChangeStateFormList"
        @onSubmit="onBatchChangeStateSubmit"
      />

      <el-dialog
        custom-class="goods-self-products-sun-code-dialog"
        :title="sunCodeTitle"
        :visible.sync="sunCode"
        width="360px"
      >
        <div class="page-code">
          <img class="page-code-img" :src="appCodeUrl" />
          <div class="page-btns">
            <el-button type="primary" plain @click="handleDownload(sunCodeTitle)">
              {{ $t('d41d8cd9.99e985') }}
            </el-button>
            <el-button v-clipboard:copy="curPageUrl" type="primary" plain>
              {{ $t('d41d8cd9.879058') }}
            </el-button>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sunCode = false">{{ $t('d41d8cd9.aa7527') }}</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="$t('dc9cefd6.4604d5')" :visible.sync="errMessageVis" width="560px">
        <div class="page-code">
          {{ errMessage }}
        </div>
      </el-dialog>

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
          <el-table-column :label="$t('dc9cefd6.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column
            :label="$t('dc9cefd6.88d456')"
            prop="supplier_goods_bn"
            min-width="120"
          />
          <el-table-column :label="$t('d41d8cd9.0888fc')" prop="item_bn" min-width="120" />
          <el-table-column :label="$t('dc9cefd6.c927ea')" prop="tax_rate_code" min-width="120" />
          <el-table-column :label="$t('dc9cefd6.2a79a7')" prop="tax_rate" min-width="120">
            <template slot-scope="scope">
              <span>{{ `${scope.row.tax_rate}%` }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dc9cefd6.0eac88')" prop="store" min-width="120" />
        </el-table>
      </SpDrawer>
    </SpPage>
  </SpRouterView>
</template>
<script>
import moment from 'moment'
import { exportItemsData, exportItemsTagData, saveIsGifts, uploadWdtErpItems } from '@/api/goods'
import { IS_ADMIN, IS_SUPPLIER, IS_DISTRIBUTOR } from '@/utils'
import { getPageCode } from '@/api/marketing'
import { GOODS_APPLY_STATUS } from '@/consts'
import { createTbAddForm } from './schema'
import SpPageUpload from '@/components/sp-page-upload'
import { createSetting } from '@shopex-ui/finder'

export default {
  components: {
    SpPageUpload
  },
  data() {
    const loginType = this.$store.getters.login_type
    let statusOption
    let updateStatusOption = [
      { title: this.$t('dc9cefd6.a8b0c2'), value: '' },
      { title: this.$t('dc9cefd6.9b7481'), value: 'onsale' },
      { title: this.$t('dc9cefd6.2c50a0'), value: 'offline_sale' },
      { title: this.$t('dc9cefd6.acf86b'), value: 'only_show' },
      { title: this.$t('dc9cefd6.ae83a3'), value: 'instock' }
    ]
    if (loginType == 'distributor') {
      statusOption = [
        { title: this.$t('dc9cefd6.a8b0c2'), value: '' },
        { title: this.$t('dc9cefd6.a77aa8'), value: 'rejected' },
        { title: this.$t('dc9cefd6.f6324c'), value: 'processing' },
        { title: this.$t('dc9cefd6.9b7481'), value: 'onsale' },
        { title: this.$t('dc9cefd6.2c50a0'), value: 'offline_sale' },
        { title: this.$t('dc9cefd6.acf86b'), value: 'only_show' },
        { title: this.$t('dc9cefd6.ae83a3'), value: 'instock' }
      ]
    } else {
      statusOption = updateStatusOption
    }

    // let tabList = []
    // if (IS_SUPPLIER()) {
    //   tabList = [
    //     { name: '全部商品', value: 'all', activeName: 'first' },
    //     { name: '待提交', value: 'submiting', activeName: 'submiting' },
    //     { name: '待审核', value: 'processing', activeName: 'processing' },
    //     { name: '已通过', value: 'approved', activeName: 'approved' },
    //     { name: '已拒绝', value: 'rejected', activeName: 'rejected' },
    //     { name: '库存预警商品', value: 'true', activeName: 'second' }
    //   ]
    // } else {
    //   tabList = [
    //     { name: '全部商品', value: 'all', activeName: 'first' },
    //     {name: '处方商品', value: 'chufang', activeName: 'third'},
    //     { name: '库存预警商品', value: 'true', activeName: 'second' }
    //   ]
    // }

    return {
      formLoading: false,
      commissionDialog: false,
      commissionForm: { goods_id: 0, commission_ratio: '' },
      show_profit_sideBar: false,
      select_tags_value: [],

      current: '',
      currentId: '',
      currentPrice: '',
      // tabList,
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
      sunCode: false,
      sunCodeTitle: '',
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
        is_market: '',
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        item_bn: '',
        supplier_goods_bn: '',
        approve_status: '',
        category: 0,
        item_category: 0,
        is_warning: false,
        is_medicine: '',
        audit_status: '',
        delivery_data_type: '',
        tag_id: '',
        tax_rate_code: '',
        is_gift: undefined,
        is_prescription: '',
        type: 0,
        barcode: '',
        distributor_id: 0,
        regions_id: [],
        brand_id: '',
        goods_bn: '',
        operator_name: '',
        cat_id: '',
        created_time: [],
        main_cat_id: null
      },
      auditStatusMap: {
        1: this.$t('dc9cefd6.97a81d'),
        2: this.$t('dc9cefd6.871a30'),
        3: this.$t('dc9cefd6.abad33')
      },
      start_date: '',
      end_date: '',
      addCategorydialogVisible: false,
      form: {},
      isGiftsData: {},
      exportData: {},
      exportTagData: {},
      errMessage: '',
      errMessageVis: false,
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
          label: this.$t('dc9cefd6.ce0008'),
          key: 'status',
          type: 'select',
          message: this.$t('dc9cefd6.281bad'),
          options: updateStatusOption
        }
      ],
      batchChangeStateForm: {
        status: ''
      },
      is_pharma_industry: false,
      isBindWdtErp: false,
      isBindJstErp: false,
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
          label: this.$t('dc9cefd6.4a0bfa'),
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
          label: this.$t('dc9cefd6.bbb504'),
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
                  // checkStrictly: true,
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
          label: this.$t('dc9cefd6.416fd4'),
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
          label: this.$t('dc9cefd6.0eac88'),
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
      list_time: []
    }
  },
  computed: {
    // 表格配置
    tableList() {
      return createSetting({
        actions: [
          {
            name: this.$t('dc9cefd6.95b351'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return (
                IS_SUPPLIER() ||
                row.supplier_id == 0 ||
                IS_DISTRIBUTOR() ||
                (IS_ADMIN() && this.VERSION_STANDARD())
              )
            },
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true'
                  }
                })
              }
            }
          },
          {
            name: this.$t('dc9cefd6.607e7a'),
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => IS_SUPPLIER() || IS_ADMIN(),
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true',
                    detail: true
                  }
                })
              }
            }
          },
          {
            name: this.$t('dc9cefd6.6271ca'),
            key: 'repush',
            type: 'button',
            buttonType: 'text',
            visible: (row) => row.medicine_data?.audit_status == 3,
            action: {
              type: 'link',
              handler: async ([row]) => {
                await this.$api.goods.medicineItemsSync({ goods_id: row.goods_id })
                this.$message.success(this.$t('dc9cefd6.33130f'))
                setTimeout(() => {
                  this.$refs['finder'].refresh(true)
                }, 200)
              }
            }
          },
          {
            name: this.$t('dc9cefd6.536ff1'),
            key: 'put',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async ([row]) => {
                this.handleShow(row)
              }
            }
          },
          {
            name: this.$t('dc9cefd6.d30586'),
            key: 'similarity',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true',
                    is_new: true
                  }
                })
              }
            }
          },
          {
            name: this.$t('dc9cefd6.2f4aad'),
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              const isShow =
                IS_ADMIN() ||
                IS_DISTRIBUTOR() ||
                (IS_SUPPLIER() && row.is_market == 0 && row.audit_status != 'processing') // 供应商端：不可售&非审核中状态可删除
              return isShow
            },
            action: {
              type: 'link',
              handler: async ([row]) => {
                await this.$confirm(this.$t('dc9cefd6.e569b1'), this.$t('dc9cefd6.02d981'))
                try {
                  await this.$api.goods.deleteItems(row.item_id)
                } catch (error) {
                  // 正常删除，不会返回
                  if (error.data) {
                    error.data.data.message
                    return
                  }
                }
                this.$message.success(this.$t('dc9cefd6.a8504b'))
                setTimeout(() => {
                  this.$refs['finder'].refresh()
                }, 200)
              }
            }
          },
          {
            name: this.$t('dc9cefd6.8978ed'),
            key: 'copy',
            type: 'button',
            buttonType: 'text',
            visible: (row) => IS_SUPPLIER(),
            action: {
              type: 'link',
              handler: async ([row]) => {
                this.$router.push({
                  path: `${this.$route.path}/editor/${row.item_id}`,
                  query: {
                    some_param: 'true',
                    is_new: true
                  }
                })
              }
            }
          },
          // {
          //   name: '佣金',
          //   key: 'set_commission',
          //   type: 'button',
          //   buttonType: 'text',
          //   visible: (row) => !IS_SUPPLIER(),
          //   action: {
          //     type: 'link',
          //     handler: async ([row]) => {
          //       this.formLoading = false
          //       this.commissionForm.goods_id = row.goods_id
          //       this.commissionForm.commission_ratio = row.commission_ratio / 100
          //       this.commissionDialog = true
          //     }
          //   }
          // },
          {
            name: this.$t('dc9cefd6.fb2f7a'),
            key: 'setup_price',
            type: 'button',
            buttonType: 'text',
            visible: (row) => !IS_SUPPLIER(),
            action: {
              type: 'link',
              handler: async ([row]) => {
                this.getMemberPriceByGoods(row.item_id)
              }
            }
          },
          {
            name: this.$t('dc9cefd6.14d342'),
            key: 'label',
            type: 'button',
            buttonType: 'text',
            visible: (row) => IS_ADMIN() || IS_DISTRIBUTOR(),
            action: {
              type: 'link',
              handler: async ([row]) => {
                // 同步taglist选中状态
                this.tagList.forEach((item) => {
                  if (row.tagList.map((item) => item.tag_id).includes(item.tag_id)) {
                    item.selected = true
                  } else {
                    item.selected = false
                  }
                })
                this.labelForm.item_id = row.item_id
                this.labelDialog = true
              }
            }
          },
          {
            name: this.$t('dc9cefd6.9461f8'),
            key: 'change_store',
            type: 'button',
            buttonType: 'text',

            action: {
              type: 'link',
              handler: async ([row]) => {
                this.getSkuStoreByGoods(row.item_id)
              }
            }
          },
          {
            name: this.$t('dc9cefd6.879058'),
            key: 'link',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async ([row]) => {
                this.$copyText(
                  `${process.env.VUE_APP_H5_HOST}/subpages/item/espier-detail?id=${row.item_id}`
                ).then(() => {
                  this.$message.success(this.$t('dc9cefd6.20a495'))
                })
              }
            }
          },
          {
            name: this.$t('dc9cefd6.d2379a'),
            key: 'offline',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              // const visible = row.approve_status == 'onsale' && !IS_SUPPLIER() && !IS_ADMIN()
              const visible = row.approve_status == 'onsale' && !IS_SUPPLIER()
              return visible
            },
            action: {
              type: 'link',
              handler: async ([row]) => {
                await this.$api.goods.updateItemsStatus({
                  items: [{ goods_id: row.item_id }],
                  status: 'instock',
                  operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
                })
                this.$message.success(this.$t('dc9cefd6.33130f'))
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('dc9cefd6.4a5098'),
            key: 'online',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              // const visible = row.approve_status == 'instock' && !IS_SUPPLIER() && !IS_ADMIN()
              const visible = row.approve_status == 'instock' && !IS_SUPPLIER()
              return visible
            },
            action: {
              type: 'link',
              handler: async ([row]) => {
                await this.$api.goods.updateItemsStatus({
                  items: [{ goods_id: row.item_id }],
                  status: 'onsale',
                  operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
                })
                this.$message.success(this.$t('dc9cefd6.33130f'))
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: this.$t('dc9cefd6.858526'), key: 'goods_id', width: 80 },
          {
            name: this.$t('dc9cefd6.07ec01'),
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
                    {scope.row.is_gift == 1 && (
                      <el-tag
                        size='mini'
                        effect='plain'
                        type='primary'
                        style='margin-left: 4px; cursor: default;'
                      >
                        {this.$t('d41d8cd9.a2f0c1')}
                      </el-tag>
                    )}
                  </div>
                  <div style='color: #666;'>
                    {`${this.$t('d41d8cd9.b1f6ae')}${scope.row.goods_bn}`}
                    <el-tooltip
                      effect='dark'
                      content={this.$t('dc9cefd6.79d3ab')}
                      placement='top-start'
                    >
                      <i
                        on-click={() => {
                          this.$copyText(scope.row.goods_bn).then(() => {
                            this.$message.success(this.$t('dc9cefd6.20a495'))
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
          // {
          //   name: '是否处方',
          //   key: 'item_bn',
          //   width: 150,
          //   render: (h, { row }) => (row.is_prescription == '1' ? '是' : '否')
          // },
          {
            name: this.$t('d41d8cd9.0888fc'),
            key: 'item_bn',
            width: 160,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('dc9cefd6.14d342'),
            width: 180,
            visible: !IS_SUPPLIER(),
            key: 'tagList',
            render: (h, scope) => (
              <div style='white-space: normal;'>
                {scope.row.tagList?.map((item) => (
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
          //   name: '供应商货号',
          //   key: 'supplier_goods_bn',
          //   align: "right",
          //   headerAlign: 'center'
          // },
          {
            name: this.$t('dc9cefd6.0eac88'),
            key: 'store',
            align: 'right',
            headerAlign: 'center'
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
            name: this.$t('dc9cefd6.e29575') + '（¥）',
            key: 'price',
            width: 120,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('dc9cefd6.818fc4') + '（¥）',
            key: 'market_price',
            width: 120,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('dc9cefd6.2e2ce2') + '（¥）',
            key: 'cost_price',
            width: 120,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: this.$t('dc9cefd6.4d02c7'),
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          // {
          //   name: '来源供应商',
          //   key: 'operator_name',
          //   width: 100,
          //   visible: !(this.IS_DISTRIBUTOR() && this.VERSION_PLATFORM())
          // },
          {
            name: this.$t('dc9cefd6.63d68b'),
            key: 'is_market',
            formatter: (value, row, col) => {
              return value == '1' ? this.$t('dc9cefd6.434e17') : this.$t('dc9cefd6.b37fb8')
            },
            visible: IS_SUPPLIER()
          },
          {
            name: this.$t('dc9cefd6.ce0008'),
            width: 120,
            visible: !IS_SUPPLIER(),
            key: 'approve_status',
            formatter: (value, row, col) => {
              return this.statusOption.find((item) => item.value === value)?.title
            }
          },
          {
            name: this.$t('dc9cefd6.b6d0e9'),
            key: 'audit_status',
            width: 200,
            visible: !IS_ADMIN(),
            render: (h, scope) => (
              <div>
                <span>{GOODS_APPLY_STATUS[scope.row.audit_status]}</span>
                {scope.row.audit_status == 'rejected' && IS_SUPPLIER() && (
                  <div class='physical-cell-reason'>
                    {this.$t('d41d8cd9.a36d88')}
                    {scope.row.audit_reason}
                  </div>
                )}
              </div>
            )
          },
          { name: this.$t('dc9cefd6.392d49'), key: 'itemCatName', minWidth: 120 },
          { name: this.$t('dc9cefd6.ed52fd'), key: 'start_num', minWidth: 120 },
          {
            name: this.$t('dc9cefd6.e8373a'),
            key: 'sort',
            width: 120,
            showType: 'editable',
            componentProps: {
              class: 'flex items-center',
              icon: 'el-icon-plus',
              change: async (v, row) => {
                await this.$api.goods.setItemsSort({
                  sort: v,
                  item_id: row.item_id,
                  operate_source: this.IS_SUPPLIER() ? 'supplier' : ''
                })
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: this.$t('dc9cefd6.73cfdf'),
            key: 'is_prescription',
            width: 150,
            render: (h, { row }) =>
              row.is_prescription == '1' ? this.$t('dc9cefd6.0a60ac') : this.$t('dc9cefd6.c9744f'),
            visible: this.is_pharma_industry
          },
          {
            name: this.$t('d41d8cd9.72ba49'),
            key: 'audit_reason',
            width: 150,
            render: (h, { row }) => (
              <div>
                {row.medicine_data?.audit_reason && row.medicine_data?.audit_status == 3 && (
                  <div onClick={() => this.handleErrDetail(row.medicine_data)}>
                    {this.handleAuditReason(row.medicine_data)}
                    <i class='el-icon-info'></i>
                  </div>
                )}
              </div>
            ),
            visible: this.is_pharma_industry
          },
          {
            name: this.$t('d41d8cd9.ec05e3'),
            key: 'created',
            width: 160,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          },
          // {
          //   name: '审核时间',
          //   key: 'audit_date',
          //   width: 160,
          //   formatter: (value, row, col) => {
          //     return value ? moment(value * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
          //   }
          // },
          {
            name: this.$t('d41d8cd9.9b6f13'),
            key: 'updated',
            width: 160,
            formatter: (value, row, col) => {
              return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
          }
        ]
      })
    },
    // 搜索表单配置
    searchFormItems() {
      return [
        {
          fieldName: 'keywords',
          label: this.$t('d41d8cd9.9d02ac'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('d41d8cd9.7c5e2b')
          }
        },
        // 商品状态（非供应商）
        {
          fieldName: 'approve_status',
          label: this.$t('d41d8cd9.d2a6c3'),
          component: 'select',
          isShow: () => !this.IS_SUPPLIER(),
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('d41d8cd9.3e1b0a'),
            options: this.statusOption.map((item) => ({
              label: item.title,
              value: item.value
            }))
          }
        },
        // 供应状态（供应商）
        {
          fieldName: 'is_market',
          label: this.$t('d41d8cd9.6e27f4'),
          component: 'select',
          isShow: () => this.IS_SUPPLIER(),
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            placeholder: this.$t('d41d8cd9.3e1b0a'),
            options: [
              { label: this.$t('d41d8cd9.8c1a2d'), value: 1 },
              { label: this.$t('d41d8cd9.f4b3e1'), value: 0 }
            ]
          }
        },
        // 管理分类
        {
          fieldName: 'main_cat_id',
          label: this.$t('d41d8cd9.7f29b6'),
          cellWidth: 1.3,
          component: 'cascader',
          componentProps: {
            placeholder: this.$t('d41d8cd9.3e1b0a'),
            clearable: true,
            options: this.itemCategoryList,
            props: { value: 'category_id', label: 'category_name', checkStrictly: true }
          }
        },
        // 销售分类
        {
          fieldName: 'category',
          label: this.$t('d41d8cd9.a52e1c'),
          component: 'cascader',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            options: this.categoryList,
            props: {
              checkStrictly: true,
              label: 'category_name',
              value: 'category_id',
              emitPath: false
            }
          }
        },
        // 运费模板
        {
          fieldName: 'templates_id',
          label: this.$t('d41d8cd9.c9b832'),
          cellWidth: 1.3,
          component: 'select',
          componentProps: {
            placeholder: this.$t('d41d8cd9.3e1b0a'),
            clearable: true,
            options: this.templatesList.map((item) => ({
              label: item.name,
              value: item.template_id
            }))
          }
        },
        // 品牌（支持远程搜索）
        {
          fieldName: 'brand_id',
          label: this.$t('d41d8cd9.4a8f15'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('d41d8cd9.5b6c09'),
            remote: true,
            filterable: true,
            clearable: true,
            remoteMethod: this.getGoodsBranchList,
            options: this.goodsBranchList.map((item) => ({
              label: item.attribute_name,
              value: item.attribute_id
            }))
          }
        },
        // SKU编码
        {
          fieldName: 'item_bn',
          label: this.$t('d41d8cd9.8a2c1f'),
          component: 'input',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('d41d8cd9.6e19f2')
          }
        },
        // SPU编码
        {
          fieldName: 'goods_bn',
          label: this.$t('d41d8cd9.c3a815'),
          cellWidth: 1.3,
          component: 'input',
          componentProps: {
            placeholder: this.$t('d41d8cd9.7d3a61')
          }
        },
        // 商品产地
        {
          fieldName: 'regions_id',
          label: this.$t('d41d8cd9.d82b43'),
          component: 'cascader',
          cellWidth: 1.3,
          componentProps: {
            placeholder: this.$t('d41d8cd9.3e1b0a'),
            clearable: true,
            options: this.regions
          }
        },
        // 商品标签（非供应商）
        {
          fieldName: 'tag_id',
          label: this.$t('d41d8cd9.f1a62d'),
          component: 'cascader',
          cellWidth: 1.3,
          isShow: () => !this.IS_SUPPLIER(),
          componentProps: {
            placeholder: this.$t('d41d8cd9.2c9b17'),
            clearable: true,
            options: this.tagList,
            props: { value: 'tag_id', label: 'tag_name' }
          }
        },
        // 赠品
        {
          fieldName: 'is_gift',
          label: this.$t('d41d8cd9.b8a1f9'),
          component: 'select',
          cellWidth: 1.3,
          componentProps: {
            clearable: true,
            options: [
              { label: this.$t('d41d8cd9.a8b0c2'), value: '' },
              { label: this.$t('d41d8cd9.5c8d21'), value: true },
              { label: this.$t('d41d8cd9.3f27e8'), value: false }
            ]
          }
        },
        // 处方药（医药行业）
        {
          fieldName: 'is_prescription',
          label: this.$t('d41d8cd9.e7f3a5'),
          component: 'select',
          cellWidth: 1.3,
          isShow: () => this.is_pharma_industry,
          componentProps: {
            clearable: true,
            options: [
              { label: this.$t('d41d8cd9.a8b0c2'), value: '' },
              { label: this.$t('d41d8cd9.e7f3a5'), value: '1' },
              { label: this.$t('d41d8cd9.c6e8d4'), value: '0' }
            ]
          }
        }
      ]
    },
    tabList() {
      let tabList = []
      if (IS_SUPPLIER()) {
        tabList = [
          { name: this.$t('d41d8cd9.a9c0d1'), value: 'all', activeName: 'first' },
          { name: this.$t('d41d8cd9.b2e5f7'), value: 'submiting', activeName: 'submiting' },
          { name: this.$t('d41d8cd9.c3f6a8'), value: 'processing', activeName: 'processing' },
          { name: this.$t('d41d8cd9.d4a7b9'), value: 'approved', activeName: 'approved' },
          { name: this.$t('d41d8cd9.e5b8ca'), value: 'rejected', activeName: 'rejected' },
          { name: this.$t('d41d8cd9.f6c9db'), value: 'true', activeName: 'second' }
        ]
      } else {
        tabList = [
          { name: this.$t('d41d8cd9.a9c0d1'), value: 'all', activeName: 'first' },

          { name: this.$t('d41d8cd9.f6c9db'), value: 'true', activeName: 'second' }
        ]
      }

      if (this.is_pharma_industry) {
        tabList.splice(1, 0, {
          name: this.$t('d41d8cd9.a7d0ec'),
          value: 'is_medicine',
          activeName: 'third'
        })
      }

      return tabList
    },
    tbAddFormList() {
      return createTbAddForm(this)
    }
  },
  mounted() {
    this.init()
    this.getAddress()
    this.getShippingTemplatesList()
    this.searchParams.operator_name = this.$route.query.operator_name
    this.fetchWechatList()
    this.checkWdtErpBind()
    this.checkJstErpBind()
    this.getBaseSetting()

    this.$activated = () => {
      this.$refs['finder']?.refresh?.()
    }
  },
  methods: {
    async getBaseSetting() {
      const res = await this.$api.company.getGlobalSetting()
      this.is_pharma_industry = res.medicine_setting?.is_pharma_industry == '1'
    },
    async fetchWechatList() {
      try {
        const data = (await this.$api.minimanage.gettemplateweapplist()) || {}
        const list = data.list || []
        list.forEach((item) => {
          if (item.key_name === 'yykweishop' && item.authorizer) {
            this.appID = item.authorizer.authorizer_appid
          }
        })
      } catch (_) {
        // 微信模板接口不可用时跳过，不影响商品列表主流程
      }
    },

    beforeSearch(params) {
      params = {
        ...params,
        item_type: 'normal',
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        ...this.searchParams,
        item_source: 'platform',
        created_time_start:
          this.searchParams.created_time.length > 0 ? this.searchParams.created_time[0] / 1000 : '',
        created_time_end:
          this.searchParams.created_time.length > 0 ? this.searchParams.created_time[1] / 1000 : ''
      }
      delete params.created_time
      if (Array.isArray(params.main_cat_id)) {
        params.main_cat_id = params.main_cat_id.filter(
          (item) => item != null && item != undefined && item != ''
        )
        if (params.main_cat_id.length === 0) {
          delete params.main_cat_id
        }
      } else if (!params.main_cat_id || params.main_cat_id === '') {
        delete params.main_cat_id
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
          cost_price: item.cost_price / 100,
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
    handleShow({ goods_id, itemName }) {
      const page = 'subpages/item/espier-detail'
      this.curPageUrl = `${page}?id=${goods_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        id: goods_id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
        // this.$message.success('投放成功')
        this.sunCodeTitle = itemName + this.$t('d41d8cd9.f8b726')
        this.sunCode = true
      })
    },
    handleErrDetail(val) {
      if (!val || !val.audit_reason) return
      this.errMessage = val.audit_reason
      this.errMessageVis = true
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
    afterSearch(val) {
      this.warning_store = val.data.data.warning_store
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
      this.$message.success(this.$t('dc9cefd6.55aa63'))
      this.$refs['finder'].refresh()
    },
    async onSaveItemStore() {
      const params = {
        items: JSON.stringify(this.storeItemsList),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      }
      await this.$api.goods.updateItemsStore(params)
      this.$message.success(this.$t('dc9cefd6.69be67'))
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

      if (this.activeName == 'third') {
        this.searchParams.is_medicine = 1
        this.searchParams.audit_status = ''
      } else {
        this.searchParams.is_medicine = ''
      }

      //淘宝商品
      if (this.activeName == 'taobao') {
        this.searchParams.audit_status = ''
      }
      this.searchParams.is_taobao = this.activeName == 'taobao' ? 1 : ''

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
        this.$message.error(this.$t('dc9cefd6.ace302'))
      }
    },
    handleAuditReason(data) {
      const { audit_reason = '' } = data || {}
      return audit_reason.length > 8 ? audit_reason.slice(0, 8) + '...' : audit_reason
    },
    async onFreightTemplateSubmit() {
      const { item_id, templates_id } = this.freightTemplateForm
      await this.$api.goods.setItemsTemplate({
        templates_id,
        item_id
      })
      this.$message.success(this.$t('dc9cefd6.33130f'))
      this.freightTemplateDialog = false
      this.$refs['finder'].refresh()
    },
    changeItemsStore() {
      if (this.selectionItems.length > 0) {
        this.storeItemForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.storeItemDialog = true
      } else {
        this.$message.error(this.$t('dc9cefd6.ace302'))
      }
    },
    batchGifts(status) {
      if (this.selectionItems.length) {
        this.isGiftsData.item_id = Object.assign(
          {},
          this.selectionItems.map((item) => item.item_id)
        )
        this.isGiftsData.status = status
        saveIsGifts(this.isGiftsData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: this.$t(status === 'true' ? 'dc9cefd6.e8f9a1' : 'dc9cefd6.f0a2b3'),
              duration: 2000
            })
          } else {
            this.$message({
              type: 'error',
              message: this.$t('d41d8cd9.m7n8o9'),
              duration: 2000
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t('dc9cefd6.ace302'),
          duration: 2000
        })
      }
    },

    batchChangeStore() {
      if (this.selectionItems.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('d41d8cd9.a7b8c9')
        })
        return false
      }
      this.batchChangeStateDialog = true
    },
    async onBatchChangeStateSubmit() {
      let data = []
      this.selectionItems.map((item) => {
        data.push({ goods_id: item.goods_id })
      })
      await this.$api.goods.updateItemsStatus({
        distributor_id: this.shopId,
        items: JSON.stringify(data),
        status: this.batchChangeStateForm.status
      })

      this.$message.success(this.$t('dc9cefd6.69be67'))
      this.$refs['finder'].refresh()
      this.batchChangeStateDialog = false
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
      this.$message.success(this.$t('dc9cefd6.33130f'))
      this.storeItemDialog = false
      this.$refs['finder'].refresh()
    },
    async changeHaltTheSales(status) {
      if (this.selectionItems.length > 0) {
        await this.$confirm(
          `${status == 'stop' ? this.$t('d41d8cd9.965407') : this.$t('d41d8cd9.1cc97f')}${this.$t(
            'd41d8cd9.g8h9i0j1'
          )}`,
          this.$t('d41d8cd9.02d981')
        )
        const params = {
          goods_id: this.selectionItems.map((item) => item.goods_id),
          is_market: status == 'stop' ? '0' : '1',
          operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
        }
        await this.$api.goods.updateGoodsInfo(params)
        this.$message.success(this.$t('dc9cefd6.33130f'))
        this.$refs['finder'].refresh()
      } else {
        await this.$confirm(
          `${status == 'stop' ? this.$t('d41d8cd9.965407') : this.$t('d41d8cd9.1cc97f')}${this.$t(
            'd41d8cd9.k2l3m4n5'
          )}`,
          this.$t('d41d8cd9.02d981')
        )
        const params = {
          is_market: status == 'stop' ? '0' : '1',
          operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
        }
        await this.$api.goods.updateGoodsInfo(params)
        this.$message.success(this.$t('dc9cefd6.33130f'))
        this.$refs['finder'].refresh()
      }
    },
    changeGoodsPrice() {
      if (this.selectionItems.length > 0) {
        this.changePriceDialog = true
      } else {
        this.$message.error(this.$t('dc9cefd6.ace302'))
      }
    },
    async onChangePriceSubmit() {},
    changeGoodsLabel() {
      if (this.selectionItems.length > 0) {
        this.labelForm.item_id = this.selectionItems.map((item) => item.item_id)
        let res = []
        this.selectionItems.forEach((item) => {
          res = [...res, ...item.tagList]
        })
        res.forEach((item) => {
          this.tagList.forEach((tag) => {
            if (item.tag_id == tag.tag_id) {
              tag.selected = true
            }
          })
        })
        // this.tagList.forEach((item) => {
        //   item.selected = false
        // })
        this.labelDialog = true
      } else {
        this.$message.error(this.$t('dc9cefd6.ace302'))
      }
    },
    async commissionSubmit() {
      this.formLoading = true
      try {
        await this.$api.goods.setCommissionRatio(this.commissionForm)
        this.commissionDialog = false
        this.$refs['finder'].refresh()
        this.$message.success(this.$t('dc9cefd6.33130f'))
      } catch (e) {
        console.log(e)
      }
      this.formLoading = false
    },
    async onLabelFormSubmit() {
      const { item_id } = this.labelForm
      const tagIds = this.tagList.filter((item) => !!item.selected).map((item) => item.tag_id)
      await this.$api.goods.itemsRelTags({
        item_ids: item_id,
        tag_ids: tagIds
      })
      this.labelDialog = false
      this.$message.success(this.$t('dc9cefd6.33130f'))
      this.$refs['finder'].refresh()
    },
    // 获取地区列表
    async getAddress() {
      const res = await this.$api.common.getAddress()
      this.regions = res
    },
    // 同步至店铺
    async syncToShop(isAll) {
      let distributorIds = '_all'
      if (!isAll) {
        const { data } = await this.$picker.shop({
          queryParams: { is_valid: 'cloud_all', show_distributor_self: 1 }
        })
        distributorIds = data.map((item) => item.distributor_id)
      }
      if (this.selectionItems.length == 0) {
        await this.$confirm(this.$t('6f19b2ab.6b3d7e'), this.$t('d41d8cd9.02d981'))
        await this.$api.marketing.saveDistributorItems({
          distributor_ids: distributorIds,
          item_ids: '_all',
          // 是否同步并上架
          is_can_sale: false
        })
      } else {
        await this.$api.marketing.saveDistributorItems({
          distributor_ids: distributorIds,
          item_ids: this.selectionItems.map((item) => item.item_id),
          // 是否同步并上架
          is_can_sale: false
        })
      }
      this.$message.success(this.$t('dc9cefd6.33130f'))
    },
    // 批量提交
    async onBatchSubmitItems() {
      if (this.selectionItems.length == 0) {
        this.$message.error(this.$t('dc9cefd6.ace302'))
        return
      }
      await this.$confirm(this.$t('d41d8cd9.b1a2c3'), this.$t('d41d8cd9.298be1'), {
        confirmButtonText: this.$t('d41d8cd9.aa7527'),
        cancelButtonText: this.$t('d41d8cd9.625fb2')
      })
      await this.$api.goods.updateGoodsInfo({
        goods_id: this.selectionItems.map((item) => item.item_id),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        audit_status: 'processing'
      })
      this.$message.success(this.$t('dc9cefd6.33130f'))
      this.$refs['finder'].refresh()
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
        const categoryArr = category.split(',')
        this.searchParams.category = categoryArr[categoryArr.length - 1]
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
    handleExport(command) {
      if (command === 'product-info') {
        this.exportItemsData()
      } else if (command === 'product-tag') {
        this.exportItemsTagData()
      } else if (command === 'wxapp-qrcode') {
        this.exportItemsWxappCode('wxa')
      } else if (command === 'h5-qrcode') {
        this.exportItemsWxappCode('h5')
      }
    },
    async exportItemsData() {
      const exportParams = {
        ...this.searchParams,
        item_source: 'platform'
      }
      if (this.selectionItems.length > 0) {
        exportParams['item_id'] = this.selectionItems.map((item) => item.item_id)
      }
      // const { url:exportKey } = await this.$api.goods.exportApiFileName(exportParams)

      // this.$store.dispatch('setExportKeyAndTotal', {exportKey, exportTotal:0})
      const { status } = await this.$api.goods.exportItemsData(exportParams)
      if (status) {
        this.$message.success(this.$t('dc9cefd6.3e1ddd'))
        this.$export_open(IS_SUPPLIER() ? 'supplier_goods' : 'items')
      } else {
        this.$message.error(this.$t('dc9cefd6.dd51ab'))
      }
    },
    async exportItemsTagData() {
      const exportParams = {
        ...this.searchParams
      }
      if (this.selectionItems.length > 0) {
        exportParams['item_id'] = this.selectionItems.map((item) => item.item_id)
      }
      const { status } = await this.$api.goods.exportItemsTagData(exportParams)
      if (status) {
        this.$message.success(this.$t('dc9cefd6.3e1ddd'))
        this.$export_open('normal_items_tag')
      } else {
        this.$message.error(this.$t('dc9cefd6.dd51ab'))
      }
    },
    async exportItemsWxappCode(exportType) {
      const exportParams = {
        ...this.searchParams
      }
      if (this.selectionItems.length > 0) {
        exportParams['item_id'] = this.selectionItems.map((item) => item.item_id)
      }
      const { status } = await this.$api.goods.exportGoodsCode({
        ...exportParams,
        item_source: 'item',
        export_type: exportType
      })
      if (status) {
        this.$message.success(this.$t('dc9cefd6.3e1ddd'))
        this.$export_open('itemcode')
      } else {
        this.$message.error(this.$t('dc9cefd6.dd51ab'))
      }
    },
    async updateGoodsSkuPrice({ item_id, price, cost_price, market_price }, priceType) {
      const priceMap = {
        price: price,
        cost_price: cost_price,
        market_price: market_price
      }
      await this.$api.goods.updateGoodsInfo({
        item_id,
        [priceType]: priceMap[priceType],
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      })
      this.$message.success(this.$t('dc9cefd6.33130f'))
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
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        item_id: item.item_id,
        is_sku: true,
        page: 1,
        pageSize: 1000
      })
      this.itemSkuDrawerTitle = `${this.$t('d41d8cd9.k1l2m3')}${item.item_name}】`
      this.itemSkuList = list || []
      this.showItemSkuDrawer = true
      this.itemSkuList = list
      this.skuLoading = false
    },
    checkWdtErpBind() {
      this.$api.third.getWdtErpSetting().then((response) => {
        this.isBindWdtErp = response.is_open
      })
    },
    uploadWdtErpItems() {
      console.log(this.selectionItems)
      if (this.selectionItems.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('d41d8cd9.n4o5p6')
        })
        return
      }
      let params = {}
      params = {
        item_id: this.selectionItems.map((item) => item.item_id)
      }
      this.$api.goods.uploadWdtErpItems(params).then((res) => {
        if (res.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('d41d8cd9.q7r8s9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('d41d8cd9.t0u1v2')
          })
        }
      })
    },
    checkJstErpBind() {
      this.$api.third.getJstErpSetting().then((response) => {
        this.isBindJstErp = response.is_open
      })
    },
    uploadJstErpItems() {
      if (this.selectionItems.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('d41d8cd9.n4o5p6')
        })
        return
      }
      let params = {}
      params = {
        item_id: this.selectionItems.map((item) => item.item_id)
      }
      this.$api.goods.uploadJstErpItems(params).then((res) => {
        if (res.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('d41d8cd9.q7r8s9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('d41d8cd9.t0u1v2')
          })
        }
      })
    }
  }
}
</script>
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
.page-code {
  text-align: center;
}
.page-code-img {
  width: 200px;
  height: 200px;
}
/* 自营商品列表太阳码弹窗：二维码与按钮居中（与 saleCategory 投放弹层一致） */
.goods-self-products-sun-code-dialog {
  .el-dialog__body {
    padding-top: 16px;
  }
  .page-code {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .page-code-img {
    display: block;
    max-width: 100%;
    height: auto;
    flex-shrink: 0;
  }
  .page-btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    width: 100%;
  }
}
</style>
<style lang="scss">
.physical-cell-reason {
  @include text-overflow();
  width: 180px;
}
</style>
