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
</style>
<style lang="scss">
.physical-cell-reason {
  @include text-overflow();
  width: 180px;
}
</style>
<template>
  <div class="page-body">
    <SpRouterView>
      <div class="action-container">
        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addItems">
          添加商品
        </el-button>
        <el-dropdown @command="handleImport">
          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
            导入<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="$store.getters.login_type != 'merchant'"
              command="physicalupload"
            >
              商品导入
            </el-dropdown-item>
            <el-dropdown-item command="physicalstoreupload"> 库存导入 </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!--      <div v-else class="action-container">-->
      <!--        <el-button type="primary" icon="iconfont icon-xinzengcaozuo-01" @click="addItems">-->
      <!--          添加商品-->
      <!--        </el-button>-->
      <!--      </div>-->

      <SpFilterForm :model="searchParams" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="keywords" label="商品标题:">
          <el-input v-model="searchParams.keywords" placeholder="商品标题或副标题关键词" />
        </SpFilterFormItem>
        <!--        <SpFilterFormItem prop="supplier_goods_bn" label="供应商货号:">-->
        <!--          <el-input v-model="searchParams.supplier_goods_bn" placeholder="请输入供应商货号" />-->
        <!--        </SpFilterFormItem>-->
        <SpFilterFormItem prop="approve_status" label="商品状态:" v-if="!IS_SUPPLIER()">
          <el-select v-model="searchParams.approve_status" clearable placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_market" label="供应状态:" v-if="IS_SUPPLIER()">
          <el-select v-model="searchParams.is_market" clearable placeholder="请选择">
            <el-option :key="1" label="可售" :value="1" />
            <el-option :key="0" label="不可售" :value="0" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="main_cat_id" label="管理分类:">
          <el-cascader
            v-model="searchParams.main_cat_id"
            placeholder="请选择"
            clearable
            :options="itemCategoryList"
            :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="category" label="销售分类:">
          <el-cascader
            v-model="searchParams.category"
            :options="categoryList"
            :props="{
              checkStrictly: true,
              label: 'category_name',
              value: 'category_id',
              emitPath: false
            }"
            clearable
          />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="audit_status" label="审核状态:">
          <el-select v-model="searchParams.audit_status">
            <el-option value="processing" label="待审核" />
            <el-option value="approved" label="审核通过" />
            <el-option value="rejected" label="审核拒绝" />
          </el-select>
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="templates_id" label="运费模板:">
          <el-select v-model="searchParams.templates_id" placeholder="请选择" clearable>
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
        <SpFilterFormItem prop="brand_id" label="品牌:">
          <el-select
            v-model="searchParams.brand_id"
            placeholder="商品/商标关键词"
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
        <SpFilterFormItem prop="regions_id" label="商品产地:">
          <el-cascader
            v-model="searchParams.regions_id"
            placeholder="请选择"
            clearable
            :options="regions"
          />
        </SpFilterFormItem>
        <!--        <SpFilterFormItem prop="delivery_data_type" label="发货方式:">-->
        <!--          <el-select v-model="searchParams.delivery_data_type">-->
        <!--            <el-option value="fixed_date" label="指定发货日期" />-->
        <!--            <el-option value="relative_date" label="相对发货日期" />-->
        <!--            <el-option value="default_date" label="默认发货日期" />-->
        <!--          </el-select>-->
        <!--        </SpFilterFormItem>-->
        <SpFilterFormItem prop="goods_bn" label="SPU编码:">
          <el-input v-model="searchParams.goods_bn" placeholder="请输入SPU编码" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_bn" label="SKU编码:">
          <el-input v-model="searchParams.item_bn" placeholder="请输入SKU编码" />
        </SpFilterFormItem>
        <SpFilterFormItem v-if="!IS_SUPPLIER()" prop="tag_id" label="商品标签:">
          <el-cascader
            v-model="searchParams.tag_id"
            size="small"
            placeholder="选择标签"
            :options="tagList"
            :props="{ value: 'tag_id', label: 'tag_name' }"
            clearable
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_gift" label="赠品:">
          <el-select v-model="searchParams.is_gift">
            <el-option :value="undefined" label="全部" />
            <el-option :value="true" label="是" />
            <el-option :value="false" label="否" />
          </el-select>
        </SpFilterFormItem>

        <!--        <SpFilterFormItem prop="goods_bn" label="SPU编码:">-->
        <!--          <el-input v-model="searchParams.goods_bn" placeholder="请输入SPU编码" />-->
        <!--        </SpFilterFormItem>-->
        <!--        <SpFilterFormItem prop="operator_name" label="来源供应商:">-->
        <!--          <el-input v-model="searchParams.operator_name" placeholder="请输入来源供应商" />-->
        <!--        </SpFilterFormItem>-->
      </SpFilterForm>

      <div class="action-container">
        <el-button v-if="!IS_SUPPLIER()" type="primary" plain @click="changeCategory">
          更改销售分类
        </el-button>
        <el-button type="primary" v-if="!IS_SUPPLIER()" plain @click="changeGoodsLabel">
          打标签
        </el-button>
        <el-button type="primary" plain @click="changeFreightTemplate"> 更改运费模板 </el-button>
        <el-button
          v-if="!IS_ADMIN() && !IS_DISTRIBUTOR()"
          type="primary"
          plain
          @click="onBatchSubmitItems"
        >
          批量提交审核
        </el-button>
        <el-button type="primary" plain @click="changeItemsStore"> 统一库存 </el-button>
        <el-button type="primary" plain v-if="!IS_SUPPLIER()" @click="batchChangeStore">
          更改状态
        </el-button>
        <el-button type="primary" plain @click="batchGifts('true')"> 设为赠品 </el-button>
        <el-button type="primary" plain @click="batchGifts('false')"> 设为非赠品 </el-button>

        <el-button
          v-if="IS_SUPPLIER()"
          type="primary"
          plain
          @click="() => changeHaltTheSales('stop')"
        >
          停售
        </el-button>
        <el-button
          v-if="IS_SUPPLIER()"
          type="primary"
          plain
          @click="() => changeHaltTheSales('start')"
        >
          开售
        </el-button>
        <!-- <el-button type="primary" plain @click="changeGoodsPrice"> 批量改价 </el-button> -->

        <el-dropdown>
          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
            导出<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <export-tip @exportHandle="exportItemsData"> 商品信息 </export-tip>
            </el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()">
              <export-tip @exportHandle="exportItemsTagData"> 商品标签 </export-tip>
            </el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()">
              <export-tip @exportHandle="exportItemsWxappCode('wxa')"> 小程序码 </export-tip>
            </el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()">
              <export-tip @exportHandle="exportItemsWxappCode('h5')"> H5二维码 </export-tip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" v-if="isBindJstErp" type="primary" @click="uploadJstErpItems()"
          >上传商品到聚水潭</el-button
        >
        <!-- <el-button size="small" v-if="isBindJstErp" type="primary" @click="queryInventory()">同步聚水潭商品库存</el-button> -->
        <el-button size="small" v-if="isBindWdtErp" type="primary" @click="uploadWdtErpItems()"
          >上传商品到旺店通</el-button
        >
        <el-dropdown v-if="VERSION_STANDARD && IS_ADMIN()">
          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
            同步商品<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="() => syncToShop()">同步至店铺</span>
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="syncToShop('all')"> 同步至所有店铺 </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <div v-if="activeName == 'second'" class="tab-tools">
            <div class="warn-input">
              <label class="label">预警数量:</label>
              <el-input v-model="warning_store" size="small" value="warning_store" />
              <el-button type="text" @click="setWarningStore"> 保存 </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <SpFinder
        ref="finder"
        :url="IS_DISTRIBUTOR() ? '/distributor/items' : '/goods/items'"
        fixed-row-action
        :row-actions-align="'left'"
        row-actions-width="200px"
        :other-config="{}"
        :setting="tableList"
        :hooks="{
          beforeSearch: beforeSearch
        }"
        @selection-change="onSelectionChange"
      />

      <!-- 设置会员价 -->
      <SpDrawer
        v-model="showMemberPriceDrawer"
        title="设置价格"
        :width="800"
        confirm-text="保存"
        @confirm="onSaveMemberPrice"
      >
        <el-table v-loading="skuLoading" border :data="specItems" height="100%">
          <el-table-column label="规格" prop="item_spec_desc" min-width="120" />
          <el-table-column label="市场价" prop="market_price" width="160">
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
          <el-table-column label="销售价" width="160">
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
          <el-table-column label="成本价" width="160">
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
          <el-table-column label="会员">
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
          <el-table-column label="付费会员">
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
        title="设置商品库存"
        :width="800"
        @confirm="onSaveItemStore"
      >
        <el-table v-loading="skuLoading" border :data="storeItemsList" height="100%">
          <el-table-column label="规格" prop="item_spec_desc" min-width="120" />
          <el-table-column label="库存">
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
        title="更改销售分类"
        :form="saleCategoryForm"
        :form-list="saleCategoryFormList"
        @onSubmit="onSaleCategorySubmit"
      />

      <!-- 运费模板 -->
      <SpDialog
        ref="freightTemplateDialogRef"
        v-model="freightTemplateDialog"
        title="更改运费模板"
        :form="freightTemplateForm"
        :form-list="freightTemplateFormList"
        @onSubmit="onFreightTemplateSubmit"
      />

      <!-- 批量修改库存 -->
      <SpDialog
        ref="storeItemDialogRef"
        v-model="storeItemDialog"
        title="批量修改库存"
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
        title="标签"
        :modal="false"
        :form="labelForm"
        :form-list="labelFormList"
        @onSubmit="onLabelFormSubmit"
      />

      <el-dialog title="设置商品佣金" width="600px" :visible.sync="commissionDialog">
        <el-form ref="form" :model="commissionForm" label-width="150px">
          <el-form-item label="平台佣金比例:">
            <el-input v-model="commissionForm.commission_ratio" maxlength="5" style="width: 160px">
              <template slot="append">%</template>
            </el-input>
            <div class="frm-tips">* 0-100之间，最多两位小数</div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="formLoading" @click="commissionSubmit">
              保存设置
            </el-button>
            <el-button @click="commissionDialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <SpDialog
        ref="sendNumDialogRef"
        v-model="batchChangeStateDialog"
        title="更改商品状态"
        :width="'500px'"
        :form="batchChangeStateForm"
        :form-list="batchChangeStateFormList"
        @onSubmit="onBatchChangeStateSubmit"
      />

      <el-dialog :title="sunCodeTitle" :visible.sync="sunCode" width="360px">
        <div class="page-code">
          <img class="page-code-img" :src="appCodeUrl" />
          <div class="page-btns">
            <el-button type="primary" plain @click="handleDownload(sunCodeTitle)">
              下载码
            </el-button>
            <el-button v-clipboard:copy="curPageUrl" type="primary" plain> 复制链接 </el-button>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sunCode = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 查看多规格信息 -->
      <SpDrawer
        v-model="showItemSkuDrawer"
        :title="itemSkuDrawerTitle"
        :width="800"
        @confirm="
          () => {
            this.showItemSkuDrawer = false
          }
        "
      >
        <el-table v-loading="skuLoading" border :data="itemSkuList" height="100%">
          <el-table-column label="规格" prop="item_spec_desc" min-width="120" />
          <el-table-column label="供应商货号" prop="supplier_goods_bn" min-width="120" />
          <el-table-column label="sku编码" prop="item_bn" min-width="120" />
          <el-table-column label="税率编码" prop="tax_rate_code" min-width="120" />
          <el-table-column label="税率" prop="tax_rate" min-width="120">
            <template slot-scope="scope">
              <span>{{ `${scope.row.tax_rate}%` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="store" min-width="120" />
        </el-table>
      </SpDrawer>
    </SpRouterView>
  </div>
</template>
<script>
import moment from 'moment'
import { exportItemsData, exportItemsTagData, saveIsGifts, uploadWdtErpItems } from '@/api/goods'
import { IS_ADMIN, IS_SUPPLIER, IS_DISTRIBUTOR } from '@/utils'
import { getPageCode } from '@/api/marketing'
import { GOODS_APPLY_STATUS } from '@/consts'

export default {
  data() {
    const loginType = this.$store.getters.login_type
    let statusOption
    let updateStatusOption = [
      { title: '全部', value: '' },
      { title: '前台可销售', value: 'onsale' },
      { title: '前台不展示', value: 'offline_sale' },
      { title: '前台仅展示', value: 'only_show' },
      { title: '不可销售', value: 'instock' }
    ]
    if (loginType == 'distributor') {
      statusOption = [
        { title: '全部', value: '' },
        { title: '审核驳回', value: 'rejected' },
        { title: '等待审核', value: 'processing' },
        { title: '前台可销售', value: 'onsale' },
        { title: '前台不展示', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ]
    } else {
      statusOption = updateStatusOption
    }

    let tabList = []
    if (IS_SUPPLIER()) {
      tabList = [
        { name: '全部商品', value: 'all', activeName: 'first' },
        { name: '待提交', value: 'submitting', activeName: 'submitting' },
        { name: '待审核', value: 'processing', activeName: 'processing' },
        { name: '已通过', value: 'approved', activeName: 'approved' },
        { name: '已拒绝', value: 'rejected', activeName: 'rejected' },
        { name: '库存预警商品', value: 'true', activeName: 'second' }
      ]
    } else {
      tabList = [
        { name: '全部商品', value: 'all', activeName: 'first' },
        { name: '库存预警商品', value: 'true', activeName: 'second' }
      ]
    }
    return {
      formLoading: false,
      commissionDialog: false,
      commissionForm: { goods_id: 0, commission_ratio: '' },
      show_profit_sideBar: false,
      select_tags_value: [],

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
        operator_name: '',
        cat_id: ''
      },
      start_date: '',
      end_date: '',
      addCategorydialogVisible: false,
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
          label: '商品状态',
          key: 'status',
          type: 'select',
          message: '不能为空',
          options: updateStatusOption
        }
      ],
      batchChangeStateForm: {
        status: ''
      },
      isBindWdtErp: false,
      isBindJstErp: false,
      categoryList: [],
      templatesList: [],
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
          label: '已选标签',
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
          label: '所有标签',
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
          label: '销售分类',
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
          label: '运费模板',
          key: 'templates_id',
          component: ({ key }, value) => (
            <el-select v-model={value[key]}>
              {this.templatesList.map((item) => (
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
          label: '库存',
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
            name: '编辑',
            key: 'edit',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              return (
                IS_SUPPLIER() ||
                row.supplier_id == 0 ||
                IS_DISTRIBUTOR() ||
                (IS_ADMIN() && this.VERSION_STANDARD)
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
            name: '查看',
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
            name: '投放',
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
            name: '添加相似',
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
            name: '删除',
            key: 'delete',
            type: 'button',
            buttonType: 'text',
            visible: (row) => {
              const isShow =
                IS_ADMIN() ||
                IS_DISTRIBUTOR() ||
                (IS_SUPPLIER() &&
                  (row.audit_status == 'submitting' || row.audit_status == 'rejected'))
              return isShow
            },
            action: {
              type: 'link',
              handler: async ([row]) => {
                await this.$confirm('此操作将删除该商品, 是否继续?', '提示')
                try {
                  await this.$api.goods.deleteItems(row.item_id)
                } catch (error) {
                  // 正常删除，不会返回
                  if (error.data) {
                    error.data.data.message
                    return
                  }
                }
                this.$message.success('删除商品成功')
                setTimeout(() => {
                  this.$refs['finder'].refresh(true)
                }, 200)
              }
            }
          },
          {
            name: '复制商品',
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
            name: '设置价格',
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
            name: '标签',
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
            name: '更改库存',
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
            name: '复制链接',
            key: 'link',
            type: 'button',
            buttonType: 'text',
            action: {
              type: 'link',
              handler: async ([row]) => {
                this.$copyText(
                  `${process.env.VUE_APP_H5_HOST}/pages/item/espier-detail?id=${row.item_id}`
                ).then(() => {
                  this.$message.success('复制成功')
                })
              }
            }
          },
          {
            name: '下架',
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
                this.$message.success('操作成功')
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '上架',
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
                this.$message.success('操作成功')
                this.$refs['finder'].refresh()
              }
            }
          }
        ],
        columns: [
          { name: '商品ID', key: 'goods_id', width: 80 },
          {
            name: '商品标题',
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
                        多
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
                        赠
                      </el-tag>
                    )}
                  </div>
                  <div style='color: #666;'>
                    {`SPU编码：${scope.row.goods_bn}`}
                    <el-tooltip effect='dark' content='复制' placement='top-start'>
                      <i
                        on-click={() => {
                          this.$copyText(scope.row.goods_bn).then(() => {
                            this.$message.success('复制成功')
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

          {
            name: 'sku编码',
            key: 'item_bn',
            width: 150,
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '标签',
            width: 120,
            visible: !IS_SUPPLIER(),
            key: 'tagList',
            render: (h, scope) => (
              <div style='white-space: normal;'>
                {scope.row.tagList?.map((item) => (
                  <span
                    style={{
                      'color': item.font_color,
                      'background-color': item.tag_color,
                      'font-size': '12px',
                      'padding': '2px 5px',
                      'border-radius': '2px',
                      'margin': '0 8px 8px 0'
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
            name: '库存',
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
            name: '排序编号',
            key: 'sort',
            width: 120,
            showType: 'editable',
            componentProps: {
              icon: 'el-icon-plus',
              change: async (v, row) => {
                await this.$api.goods.setItemsSort({ 'sort': v, 'item_id': row.itemId })
                this.$refs['finder'].refresh()
              }
            }
          },
          {
            name: '市场价（¥）',
            key: 'market_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '销售价（¥）',
            key: 'price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '成本价（¥）',
            key: 'cost_price',
            width: 100,
            formatter: (value, row, col) => {
              return (value / 100).toFixed(2)
            },
            align: 'right',
            headerAlign: 'center'
          },
          {
            name: '毛利率（%)',
            key: 'gross_profit_rate',
            width: 100,
            align: 'right',
            headerAlign: 'center'
          },
          // {
          //   name: '来源供应商',
          //   key: 'operator_name',
          //   width: 100,
          //   visible: !(this.IS_DISTRIBUTOR() && this.VERSION_PLATFORM)
          // },
          {
            name: '供应状态',
            key: 'is_market',
            formatter: (value, row, col) => {
              return value == '1' ? '可售' : '不可售'
            },
            visible: IS_SUPPLIER()
          },
          {
            name: '商品状态',
            width: 120,
            visible: !IS_SUPPLIER(),
            key: 'approve_status',
            formatter: (value, row, col) => {
              return this.statusOption.find((item) => item.value === value)?.title
            }
          },
          {
            name: '审核状态',
            key: 'audit_status',
            width: 200,
            visible: !IS_ADMIN(),
            render: (h, scope) => (
              <div>
                <span>{GOODS_APPLY_STATUS[scope.row.audit_status]}</span>
                {scope.row.audit_status == 'rejected' && loginType == 'supplier' && (
                  <div class='physical-cell-reason'>拒绝原因：{scope.row.audit_reason}</div>
                )}
              </div>
            )
          },
          { name: '销售分类', key: 'itemCatName', minWidth: 120 },
          {
            name: '创建时间',
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
            name: '更新时间',
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
    this.searchParams.operator_name = this.$route.query.operator_name
    this.fetchWechatList()
    this.checkWdtErpBind()
    this.checkJstErpBind()
  },
  methods: {
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    onHooksRouteBack() {
      this.$refs['finder'].refresh()
    },
    beforeSearch(params) {
      params = {
        ...params,
        item_type: 'normal',
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        ...this.searchParams,
        item_source: 'platform'
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
      const page = 'pages/item/espier-detail'
      this.curPageUrl = `${page}?id=${goods_id}`
      let params = {
        wxaAppId: this.appID,
        page,
        id: goods_id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
        // this.$message.success('投放成功')
        this.sunCodeTitle = itemName + '---商品太阳码'
        this.sunCode = true
      })
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
      this.$message.success('更新成功')
      this.$refs['finder'].refresh()
    },
    async onSaveItemStore() {
      const params = {
        items: JSON.stringify(this.storeItemsList),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      }
      await this.$api.goods.updateItemsStore(params)
      this.$message.success('修改成功')
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
        this.$message.error('请选择至少一个商品')
      }
    },
    async onSaleCategorySubmit() {
      const { item_id, category_id } = this.saleCategoryForm
      const _category_id = category_id.map((item) => {
        return item[item.length - 1]
      })
      await this.$api.goods.setItemsCategory({ item_id, category_id: _category_id })
      this.$message.success('操作成功')
      this.saleCategoryDialog = false
      this.$refs['finder'].refresh()
    },
    changeFreightTemplate() {
      if (this.selectionItems.length > 0) {
        this.freightTemplateForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.freightTemplateDialog = true
      } else {
        this.$message.error('请选择至少一个商品')
      }
    },
    async onFreightTemplateSubmit() {
      const { item_id, templates_id } = this.freightTemplateForm
      await this.$api.goods.setItemsTemplate({
        templates_id,
        item_id
      })
      this.$message.success('操作成功')
      this.freightTemplateDialog = false
      this.$refs['finder'].refresh()
    },
    changeItemsStore() {
      if (this.selectionItems.length > 0) {
        this.storeItemForm.item_id = this.selectionItems.map((item) => item.item_id)
        this.storeItemDialog = true
      } else {
        this.$message.error('请选择至少一个商品')
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
              message: '操作成功',
              duration: 2000
            })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败',
              duration: 2000
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品!',
          duration: 2000
        })
      }
    },

    batchChangeStore() {
      if (this.selectionItems.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
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

      this.$message.success('修改成功')
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
      this.$message.success('操作成功')
      this.storeItemDialog = false
      this.$refs['finder'].refresh()
    },
    async changeHaltTheSales(status) {
      if (this.selectionItems.length > 0) {
        await this.$confirm(`${status == 'stop' ? '停售' : '开售'}选中商品, 是否继续?`, '提示')
        const params = {
          goods_id: this.selectionItems.map((item) => item.goods_id),
          is_market: status == 'stop' ? '0' : '1',
          operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
        }
        await this.$api.goods.updateGoodsInfo(params)
        this.$message.success('操作成功')
        this.$refs['finder'].refresh()
      } else {
        await this.$confirm(`${status == 'stop' ? '停售' : '开售'}所有商品, 是否继续?`, '提示')
        const params = {
          is_market: status == 'stop' ? '0' : '1',
          operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
        }
        await this.$api.goods.updateGoodsInfo(params)
        this.$message.success('操作成功')
        this.$refs['finder'].refresh()
      }
    },
    changeGoodsPrice() {
      if (this.selectionItems.length > 0) {
        this.changePriceDialog = true
      } else {
        this.$message.error('请选择至少一个商品')
      }
    },
    async onChangePriceSubmit() {},
    changeGoodsLabel() {
      if (this.selectionItems.length > 0) {
        this.labelForm.item_id = this.selectionItems.map((item) => item.item_id)
        let res = []
        this.selectionItems.forEach(item=>{
          res = [...res,...item.tagList]
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
        this.$message.error('请选择至少一个商品')
      }
    },
    async commissionSubmit() {
      this.formLoading = true
      try {
        await this.$api.goods.setCommissionRatio(this.commissionForm)
        this.commissionDialog = false
        this.$refs['finder'].refresh()
        this.$message.success('操作成功')
      } catch (e) {}
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
      this.$message.success('操作成功')
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
        const { data } = await this.$picker.shop()
        distributorIds = data.map((item) => item.distributor_id)
      }
      if (this.selectionItems.length == 0) {
        await this.$confirm('是否将所有商品的都同步至店铺?', '提示')
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
      this.$message.success('操作成功')
    },
    // 批量提交
    async onBatchSubmitItems() {
      if (this.selectionItems.length == 0) {
        this.$message.error('请选择至少一个商品')
        return
      }
      await this.$confirm('确认是否批量提交？', '批量提交', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await this.$api.goods.updateGoodsInfo({
        goods_id: this.selectionItems.map((item) => item.item_id),
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform',
        audit_status: 'processing'
      })
      this.$message.success('操作成功')
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
    async exportItemsData() {
      const exportParams = {
        ...this.searchParams,
        item_source: 'platform'
      }
      if (this.selectionItems.length > 0) {
        exportParams['item_id'] = this.selectionItems.map((item) => item.item_id)
      }
      const { status } = await this.$api.goods.exportItemsData(exportParams)
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('items')
      } else {
        this.$message.error('导出失败')
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
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('normal_items_tag')
      } else {
        this.$message.error('导出失败')
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
        source: 'item',
        export_type: exportType
      })
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('itemcode')
      } else {
        this.$message.error('导出失败')
      }
    },
    async updateGoodsSkuPrice({ item_id, price, cost_price, market_price }, priceType) {
      const priceMap = {
        'price': price,
        'cost_price': cost_price,
        'market_price': market_price
      }
      await this.$api.goods.updateGoodsInfo({
        item_id,
        [priceType]: priceMap[priceType],
        operate_source: IS_SUPPLIER() ? 'supplier' : 'platform'
      })
      this.$message.success('操作成功')
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
      this.itemSkuDrawerTitle = `商品【${item.item_name}】`
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
          message: '请选择需要同步的商品'
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
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '执行失败'
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
          message: '请选择需要同步的商品'
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
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '执行失败'
          })
        }
      })
    }
  }
}
</script>
