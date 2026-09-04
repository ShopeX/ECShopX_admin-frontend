<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style scoped lang="scss">
.goods-title {
  // padding-bottom: 5px;
}
.goods-code {
  color: #888;
  font-size: 13px;
  i {
    cursor: pointer;
  }
}
.sp-filter-form {
  margin-bottom: 16px;
}
.btn-gap {
  margin-right: 8px;
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
    label {
    }
  }
}
.popover-edit {
  display: flex;
  .edit-input {
    margin-right: 10px;
  }
}
</style>
<style lang="scss">
.sku-dialog {
  .el-dialog__body {
    padding: 0;
  }
  .el-form {
    margin-right: 0 !important;
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  .el-form-item__content {
    margin-left: 0 !important;
  }
}
</style>
<template>
  <SpPage class="page-body">
    <template
      v-if="
        $route.path.indexOf('editor') === -1 &&
        $route.path.indexOf('physicalstoreupload') === -1 &&
        $route.path.indexOf('physicalprofitupload') === -1 &&
        $route.path.indexOf('physicalupload') === -1
      "
    >
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="keywords" :label="$t('b7aea01d.16eddb')">
          <el-input v-model="params.keywords" :placeholder="$t('b7aea01d.231f0b')" />
        </SpFilterFormItem>
        <!--        <SpFilterFormItem prop="supplier_goods_bn" label="供应商货号:">-->
        <!--          <el-input v-model="params.supplier_goods_bn" placeholder="请输入供应商货号" />-->
        <!--        </SpFilterFormItem>-->
        <SpFilterFormItem
          v-if="!IS_DISTRIBUTOR()"
          prop="approve_status"
          :label="$t('b7aea01d.2253ba')"
        >
          <el-select v-model="params.approve_status" clearable :placeholder="$t('b7aea01d.708c9d')">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem v-else prop="is_can_sale" :label="$t('b7aea01d.2253ba')">
          <el-select v-model="params.is_can_sale" clearable :placeholder="$t('b7aea01d.708c9d')">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="item_holder" label="商品类型:">
        <el-select v-model="params.item_holder" placeholder="请选择商品类型" clearable>
          <el-option
            v-for="item in goodCategory"
            :key="item.value"
            :label="item.title"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem> -->
        <SpFilterFormItem prop="main_cat_id" :label="$t('b7aea01d.e73602')">
          <el-cascader
            v-model="params.main_cat_id"
            :placeholder="$t('b7aea01d.708c9d')"
            clearable
            :options="itemCategoryList"
            :props="{ value: 'category_id', label: 'category_name', checkStrictly: true }"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="category" :label="$t('b7aea01d.7ef1b3')">
          <el-cascader
            v-model="params.category"
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
          <el-select v-model="params.audit_status">
            <el-option value="processing" label="待审核" />
            <el-option value="approved" label="审核通过" />
            <el-option value="rejected" label="审核拒绝" />
          </el-select>
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="templates_id" :label="$t('b7aea01d.63fc58')">
          <el-select v-model="params.templates_id" :placeholder="$t('b7aea01d.708c9d')" clearable>
            <el-option
              v-for="item in templatesList"
              :key="item.template_id"
              :label="item.name"
              :value="item.template_id"
            />
          </el-select>
        </SpFilterFormItem>
        <!--        <SpFilterFormItem prop="tax_rate_code" label="税率编码:">-->
        <!--          <el-input v-model="params.tax_rate_code" placeholder="商品编号或条形码" />-->
        <!--        </SpFilterFormItem>-->
        <SpFilterFormItem prop="brand_id" :label="$t('b7aea01d.dab469')">
          <el-select
            v-model="params.brand_id"
            :placeholder="$t('b7aea01d.2dd7e1')"
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
        <SpFilterFormItem prop="regions_id" :label="$t('b7aea01d.efcb2d')">
          <el-cascader
            v-model="params.regions_id"
            :placeholder="$t('b7aea01d.708c9d')"
            clearable
            :options="regions"
          />
        </SpFilterFormItem>
        <!--        <SpFilterFormItem prop="delivery_data_type" label="发货方式:">-->
        <!--          <el-select v-model="params.delivery_data_type">-->
        <!--            <el-option value="fixed_date" label="指定发货日期" />-->
        <!--            <el-option value="relative_date" label="相对发货日期" />-->
        <!--            <el-option value="default_date" label="默认发货日期" />-->
        <!--          </el-select>-->
        <!--        </SpFilterFormItem>-->
        <SpFilterFormItem prop="item_bn" :label="$t('b7aea01d.8dd62f')">
          <el-input v-model="params.item_bn" :placeholder="$t('b7aea01d.983e9f')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="goods_bn" :label="$t('b7aea01d.288587')">
          <el-input v-model="params.goods_bn" :placeholder="$t('b7aea01d.36438f')" />
        </SpFilterFormItem>
        <!-- <SpFilterFormItem prop="operator_name" label="来源供应商:">
          <el-input v-model="params.operator_name" placeholder="请输入来源供应商" />
        </SpFilterFormItem> -->
        <SpFilterFormItem prop="supplier_name" :label="$t('b7aea01d.40b1be') + ':'">
          <el-input v-model="params.supplier_name" :placeholder="$t('b7aea01d.5765f1')" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="is_gift" :label="$t('b7aea01d.d017cc') + ':'">
          <el-select v-model="params.is_gift">
            <el-option :value="undefined" :label="$t('b7aea01d.a8b0c2')" />
            <el-option :value="true" :label="$t('b7aea01d.0a60ac')" />
            <el-option :value="false" :label="$t('b7aea01d.c9744f')" />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_holder" :label="$t('b7aea01d.2af133') + ':'">
          <el-select v-model="params.item_holder" :placeholder="$t('b7aea01d.77ccd0')" clearable>
            <el-option
              v-for="item in goodCategory"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="batchChangeStore">
          {{ $t('b7aea01d.836304') }}
        </el-button>
        <el-dropdown trigger="click" @command="handleExport">
          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
            {{ $t('b7aea01d.55405e') }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="product-info">{{ $t('b7aea01d.b433e6') }}</el-dropdown-item>
            <el-dropdown-item v-if="!IS_SUPPLIER()" command="product-tag">
              {{ $t('b7aea01d.0f394b') }}
            </el-dropdown-item>
            <el-dropdown-item v-if="!VERSION_SHUYUN() && !IS_SUPPLIER()" command="h5-qrcode">
              {{ $t('b7aea01d.cde87b') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button v-if="isBindWdtErp" size="small" type="primary" @click="uploadWdtErpItems()">
          {{ $t('b7aea01d.fe2216') }}
        </el-button>
        <el-button v-if="isBindJstErp" size="small" type="primary" @click="uploadJstErpItems()">
          {{ $t('b7aea01d.78a38b') }}
        </el-button>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <div v-if="activeName == 'second' && !IS_DISTRIBUTOR()" class="tab-tools">
            <div class="warn-input">
              <label class="label">{{ $t('b7aea01d.7bee86') }}</label>
              <el-input v-model="warning_store" size="small" value="warning_store" />
              <el-button type="text" @click="setWarningStore">
                {{ $t('b7aea01d.be5fbb') }}
              </el-button>
            </div>
          </div>
          <el-table
            v-loading="loading"
            border
            :data="ItemsList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" :label="$t('b7aea01d.66eeac')" />
            <el-table-column
              prop="goods_id"
              :label="$t('b7aea01d.858526')"
              align="right"
              header-align="center"
            />
            <el-table-column prop="item_bn" :label="$t('b7aea01d.58cac1')" width="150" />
            <el-table-column prop="itemName" :label="$t('b7aea01d.9897d8')" width="300">
              <template slot-scope="scope">
                <div class="goods-title">
                  {{ scope.row.item_name }}
                  <el-tag
                    v-if="!scope.row.nospec"
                    size="mini"
                    effect="plain"
                    type="primary"
                    style="margin-left: 4px; cursor: default"
                    @click="handleViewSkuInfo(scope.row)"
                  >
                    {{ $t('b7aea01d.7b1568') }}
                    <i class="ecx-icon icon-sousuo" style="font-size: 12px; margin-left: 2px" />
                  </el-tag>
                </div>
                <div class="goods-code">
                  {{ $t('b7aea01d.2c8af9') }}{{ scope.row.goods_bn }}
                  <el-tooltip effect="dark" :content="$t('b7aea01d.79d3ab')" placement="top-start">
                    <i
                      v-clipboard:copy="scope.row.goods_bn"
                      v-clipboard:success="onCopySuccess"
                      class="el-icon-document-copy"
                    />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.792518')">
              <template slot-scope="scope">
                {{ scope.row.is_gift == '1' ? $t('b7aea01d.0a60ac') : $t('b7aea01d.c9744f') }}
              </template>
            </el-table-column>
            <el-table-column prop="item_holder" :label="$t('b7aea01d.2af133')" width="100">
              <template slot-scope="scope">
                <div class="ell3">
                  {{ $t(goodCategoryMap[scope.row.item_holder]) }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column label="标签">
              <template slot-scope="scope">
                <template>
                  <el-tag
                    v-for="taglist in scope.row.tagList"
                    :key="taglist.index"
                    :color="taglist.tag_color"
                    size="mini"
                    :style="'color:' + taglist.font_color"
                    style="display: inline-block; margin-right: 3px"
                  >
                    {{ taglist.tag_name }}
                  </el-tag>
                </template>
              </template>
            </el-table-column> -->
            <el-table-column
              :label="$t('b7aea01d.e8373a')"
              width="100"
              align="right"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  size="mini"
                  style="width: 60px"
                  @change="editItemsSort(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="store"
              :label="$t('b7aea01d.0eac88')"
              width="120"
              align="right"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.store }}</span>

                <el-popover
                  v-if="scope.row.nospec && !scope.row.is_total_store"
                  placement="top"
                  trigger="hover"
                  @show="() => onShowPopover(scope.row, 'store')"
                >
                  <div class="popover-edit">
                    <el-input
                      v-model="skuEditInput"
                      class="edit-input"
                      :placeholder="$t('b7aea01d.63f10e')"
                    />
                    <el-button type="primary" size="mini" @click="onModifyItemSku(scope.row)">
                      {{ $t('b7aea01d.38cf16') }}
                    </el-button>
                  </div>

                  <el-button slot="reference" type="text">
                    <i class="el-icon-edit" />
                  </el-button>
                </el-popover>
                <el-button
                  v-if="!scope.row.nospec && !scope.row.is_total_store"
                  type="text"
                  @click="onModifyItemSku(scope.row)"
                >
                  <i class="el-icon-edit" />
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="price" :label="$t('b7aea01d.cf0170')" width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.price }}</span>
                <template v-if="scope.row.item_holder != 'supplier'">
                  <el-popover
                    v-if="scope.row.nospec"
                    placement="top"
                    trigger="hover"
                    @show="() => onShowPopover(scope.row, 'price')"
                  >
                    <div class="popover-edit">
                      <el-input
                        v-model="skuPriceEditInput"
                        class="edit-input"
                        :placeholder="$t('b7aea01d.d594b7')"
                      />
                      <el-button type="primary" size="mini" @click="onModifyItemPrice(scope.row)">
                        {{ $t('b7aea01d.38cf16') }}
                      </el-button>
                    </div>

                    <el-button slot="reference" type="text">
                      <i class="el-icon-edit" />
                    </el-button>
                  </el-popover>
                  <el-button
                    v-if="!scope.row.nospec"
                    type="text"
                    @click="onModifyItemPrice(scope.row)"
                  >
                    <i class="el-icon-edit" />
                  </el-button>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="market_price" :label="$t('b7aea01d.5cd87e')" width="100" />
            <el-table-column
              v-if="IS_DISTRIBUTOR()"
              prop="gross_profit_rate"
              :label="$t('b7aea01d.8d7722')"
              width="110"
              align="right"
              header-align="center"
            />
            <el-table-column :label="$t('b7aea01d.19ff9d')" width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.is_can_sale">{{ $t('b7aea01d.434e17') }}</span>
                <span v-else>{{ $t('b7aea01d.b37fb8') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.7c0b7f')" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.is_can_sale">{{ $t('b7aea01d.2390fa') }}</span>
                <span v-else>{{ $t('b7aea01d.ca9084') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="itemCatName" :label="$t('b7aea01d.392d49')" width="150" />
            <el-table-column :label="$t('b7aea01d.40b1be')" prop="supplier_name" width="120" />
            <el-table-column
              :label="$t('b7aea01d.88d456')"
              prop="supplier_goods_bn"
              width="100"
              align="right"
              header-align="center"
            />
            <el-table-column :label="$t('b7aea01d.63d68b')" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.item_holder == 'distributor' && !scope.row.supplier_name" />
                <span v-else>{{
                  scope.row.is_market == '1' ? $t('b7aea01d.434e17') : $t('b7aea01d.b37fb8')
                }}</span>
              </template>
            </el-table-column>

            <el-table-column fixed="left" :label="$t('b7aea01d.2b6bc0')" width="180">
              <template slot-scope="scope">
                <el-button type="text" @click="editItemsAction(scope.$index, scope.row, false)">
                  {{ $t('b7aea01d.f26225') }}
                </el-button>
                <el-button type="text" @click="updateItemStatus(scope.row)">
                  {{ scope.row.is_can_sale ? $t('b7aea01d.d2379a') : $t('b7aea01d.4a5098') }}
                </el-button>
                <el-button type="text" @click="onClickLink(scope.row)">
                  {{ $t('b7aea01d.879058') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 选择运费模板-开始 -->
      <el-dialog
        :title="$t('b7aea01d.a7aae3')"
        :visible.sync="addTemplatesdialogVisible"
        width="30%"
      >
        <el-select
          v-model="templates_new_id"
          :placeholder="$t('b7aea01d.416fd4')"
          style="width: 100%"
        >
          <el-option
            v-for="item in templatesListavailable"
            :key="item.template_id"
            :label="item.name"
            :value="item.template_id"
          />
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTemplatesdialogVisible = false">{{
            $t('b7aea01d.625fb2')
          }}</el-button>
          <el-button type="primary" @click="changeTemplates">{{ $t('b7aea01d.38cf16') }}</el-button>
        </span>
      </el-dialog>
      <!-- 选择运费模板-结束 -->
      <!-- 选择商品分类-开始 -->
      <el-dialog
        :title="$t('b7aea01d.51af77')"
        :visible.sync="addCategorydialogVisible"
        width="30%"
      >
        <treeselect
          v-model="category_id"
          :options="categoryList"
          :multiple="true"
          :show-count="true"
          :disable-branch-nodes="true"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategorydialogVisible = false">{{
            $t('b7aea01d.625fb2')
          }}</el-button>
          <el-button type="primary" @click="changeCategory">{{ $t('b7aea01d.38cf16') }}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        :title="$t('b7aea01d.591158')"
        class="right-dialog"
        :visible.sync="tag.dialog"
        :before-close="handleCancelLabelsDialog"
      >
        <div class="tag-users view-flex view-flex-middle">
          <i class="iconfont icon-user-circle1" />
          <div class="view-flex-item">
            <span v-for="(item, index) in tag.editItem" :key="index"> {{ item }}，</span>
          </div>
        </div>
        <div class="selected-tags view-flex">
          <div class="label">{{ $t('b7aea01d.e98819') }}</div>
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
        <span slot="footer" class="dialog-footer">
          <el-button @click="tag.dialog = false">{{ $t('b7aea01d.625fb2') }}</el-button>
          <el-button type="primary" @click="submitItemTag">{{ $t('b7aea01d.38cf16') }}</el-button>
        </span>
      </el-dialog>
      <SideBar :visible.sync="show_rebate_sideBar" :title="$t('b7aea01d.e7f2ff')" width="60">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span v-if="popularizeSetting.popularize_ratio.type == 'profit'">
              <el-alert
                :title="$t('b7aea01d.9202b3')"
                :description="$t('b7aea01d.90c9f7')"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span v-else>
              <el-alert
                :title="$t('b7aea01d.18e6c2')"
                :description="$t('b7aea01d.7d9159')"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
          </div>
          {{ $t('b7aea01d.90f08f') }}{{ current.item_name }}
          <el-table v-loading="skuLoading" :data="rebateSpecItems">
            <el-table-column :label="$t('b7aea01d.ea887b')" prop="item_spec_desc" min-width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.item_spec_desc">{{ scope.row.item_spec_desc }}</span
                ><span v-else>{{ $t('b7aea01d.048df4') }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.e29575')" min-width="80">
              <template slot-scope="scope"> ¥{{ scope.row.price / 100 }} </template>
            </el-table-column>
            <!-- <el-table-column label="成本价" min-width="80">
                <template slot-scope="scope"> ¥{{ scope.row.cost_price / 100 }} </template>
              </el-table-column> -->
            <el-table-column :label="$t('b7aea01d.226b09')" width="160">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.rebate_conf.type"
                  active-value="money"
                  inactive-value="ratio"
                  :active-text="$t('b7aea01d.4cf24a')"
                  :inactive-text="$t('b7aea01d.150075')"
                />
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, key) in popularizeSetting.popularize_ratio.profit"
              :key="key"
              :label="item.name"
              min-width="110"
            >
              <template slot-scope="scope">
                <el-input
                  v-if="scope.row.rebate_conf.type == 'money'"
                  v-model="scope.row.rebate_conf.value[key]"
                  type="number"
                  size="mini"
                  suffix-icon="iconfont icon-yen-sign"
                />
                <el-input
                  v-else
                  v-model="scope.row.rebate_conf.value[key]"
                  size="mini"
                  type="number"
                  suffix-icon="iconfont icon-percent"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div slot="footer">
          <el-button type="primary" :loading="submitLoading" @click="saveRebateConf">
            {{ $t('b7aea01d.be5fbb') }}
          </el-button>
        </div>
      </SideBar>
      <SideBar
        :visible.sync="show_profit_sideBar"
        name="show_profit_sideBar"
        :title="$t('b7aea01d.e7f2ff')"
        width="60"
      >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>
              <el-alert
                :title="$t('b7aea01d.4bd218')"
                :description="$t('b7aea01d.f684e7')"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span>
              <el-alert
                :title="$t('b7aea01d.c7aa3f')"
                :description="$t('b7aea01d.4b3c96')"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
            <span>
              <el-alert
                :title="$t('b7aea01d.dd4b84')"
                :description="$t('b7aea01d.d7e97f')"
                type="info"
                close-text=" "
                class="alert-text"
                show-icon
              />
            </span>
          </div>
          {{ $t('b7aea01d.90f08f') }}{{ current.item_name }}
          <el-table v-loading="skuLoading" :data="profitSpecItems">
            <el-table-column :label="$t('b7aea01d.ea887b')" prop="item_spec_desc" min-width="120" />
            <el-table-column :label="$t('b7aea01d.1afdfe')" prop="market_price" width="100">
              <template slot-scope="scope"> ¥{{ scope.row.market_price }} </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.e29575')" width="100">
              <template slot-scope="scope"> ¥{{ scope.row.price }} </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.3d074c')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.profit_type" :placeholder="$t('b7aea01d.708c9d')">
                  <el-option :label="$t('b7aea01d.18c634')" :value="0" />
                  <el-option :label="$t('b7aea01d.81522a')" :value="1" />
                  <el-option :label="$t('b7aea01d.cbff02')" :value="2" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.a023cf')">
              <template slot-scope="scope">
                <div v-if="0 == scope.row.profit_type">
                  <el-input :disabled="true" size="mini" type="number" value="0" />
                </div>
                <div v-else>
                  <el-input v-model="scope.row.profit_conf_profit" size="mini" type="number">
                    <template v-if="1 == scope.row.profit_type" slot="append"> % </template>
                  </el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('b7aea01d.a38cb4')">
              <template slot-scope="scope">
                <div v-if="0 == scope.row.profit_type">
                  <el-input :disabled="true" size="mini" type="number" value="0" />
                </div>
                <div v-else>
                  <el-input
                    v-model="scope.row.profit_conf_popularize_profit"
                    size="mini"
                    type="number"
                  >
                    <template v-if="1 == scope.row.profit_type" slot="append"> % </template>
                  </el-input>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <div slot="footer">
          <el-button type="primary" :loading="submitLoading" @click="saveProfitConf">
            {{ $t('b7aea01d.be5fbb') }}
          </el-button>
        </div>
      </SideBar>
      <SideBar :visible.sync="show_sideBar" :title="$t('b7aea01d.9873e0')" width="60">
        <el-table v-loading="skuLoading" :data="specItems" height="100%">
          <el-table-column :label="$t('b7aea01d.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column :label="$t('b7aea01d.1afdfe')" prop="market_price" width="100">
            <template slot-scope="scope"> ¥{{ scope.row.market_price }} </template>
          </el-table-column>
          <el-table-column :label="$t('b7aea01d.e29575')" width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.item_id !== currentId">
                ¥{{ scope.row.price }}
                <i
                  class="el-input__icon el-icon-edit"
                  @click="editPrice(scope.row.item_id, scope.row.price)"
                />
              </div>
              <el-input
                v-else
                :ref="'input_' + scope.row.item_id"
                v-model="currentPrice"
                size="mini"
                @blur="handleBlur(scope.$index)"
              />
            </template>
          </el-table-column>
          <el-table-column :label="$t('b7aea01d.4d9dd5')">
            <el-table-column v-for="(item, index) in grade" :key="index" :label="item.grade_name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.grade[index].mprice" size="mini" type="number" />
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$t('b7aea01d.bc0883')">
            <el-table-column
              v-for="(item, index) in vipGrade"
              :key="index"
              :label="item.grade_name"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.vipGrade[index].mprice" size="mini" type="number" />
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button type="primary" :loading="submitLoading" @click="savePrice">
            {{ $t('b7aea01d.be5fbb') }}
          </el-button>
        </div>
      </SideBar>
      <!-- 选择商品分类-结束 -->
      <SideBar :visible.sync="show_itemStore" :title="$t('b7aea01d.b20f18')" width="60">
        <el-table v-loading="skuLoading" :data="storeItemsList" height="100%">
          <el-table-column :label="$t('b7aea01d.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column :label="$t('b7aea01d.0eac88')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.store" size="mini" type="number" />
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer">
          <el-button type="primary" :loading="submitLoading" @click="saveItemsStore">
            {{ $t('b7aea01d.be5fbb') }}
          </el-button>
        </div>
      </SideBar>
      <el-dialog
        :title="$t('b7aea01d.ad7f06')"
        :visible.sync="storeUpdate"
        width="30%"
        :close-on-click-modal="false"
      >
        {{ $t('b7aea01d.51b184') }}<el-input v-model="itemstore" size="mini" type="number" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="storeUpdate = false">{{ $t('b7aea01d.625fb2') }}</el-button>
          <el-button type="primary" @click="saveItemsStore">{{ $t('b7aea01d.38cf16') }}</el-button>
        </span>
      </el-dialog>
      <GoodsSelect
        :items-visible="xpGoodsVisible"
        @chooseGoods="chooseGoodsAction"
        @closeGoodsDialog="closeGoodsDialogAction"
      />

      <SpDialog
        ref="sendNumDialogRef"
        v-model="batchChangeStateDialog"
        :title="$t('b7aea01d.85b124')"
        :width="'500px'"
        :form="batchChangeStateForm"
        :form-list="batchChangeStateFormList"
        @onSubmit="onBatchChangeStateSubmit"
      />

      <!-- 商品sku配置 -->
      <SpDialog
        ref="itemSkuRef"
        v-model="itemSkuDialog"
        class="sku-dialog"
        width="1100px"
        destroy-on-close
        :title="`${$t('b7aea01d.7d3792')}【${itemSkuForm.itemName}】`"
        :form="itemSkuForm"
        :form-list="itemSkuFormList"
        @onSubmit="onItemSkuFormSubmit"
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
          <el-table-column :label="$t('b7aea01d.ea887b')" prop="item_spec_desc" min-width="120" />
          <el-table-column
            :label="$t('b7aea01d.88d456')"
            prop="supplier_goods_bn"
            min-width="120"
          />
          <el-table-column :label="$t('b7aea01d.0888fc')" prop="item_bn" min-width="120" />
        </el-table>
      </SpDrawer>
    </template>
    <router-view />
  </SpPage>
</template>
<script>
import districtOptions from '@/mixins/districtOptions'
import { mapGetters } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import SideBar from '@/components/element/sideBar'
import { getDefaultCurrency } from '@/api/company'
import {
  getItemsList,
  setItemsTemplate,
  setItemsCategory,
  deleteItems,
  getCategory,
  setItemsSort,
  updateGoodsInfo,
  getGoodsPrice,
  updateGoodsPrice,
  updateItemRebateConf,
  getTagList,
  itemsRelTags,
  updateItemsStore,
  updateItemsStatus,
  getGoodsAttr,
  exportItemsData,
  exportItemsTagData,
  getGoodsProfitPrice,
  saveGoodsProfitPrice,
  syncItems,
  saveIsGifts,
  flowItems
} from '@/api/goods'
import { getPageCode } from '@/api/marketing'
import { VERSION_IN_PURCHASE } from '@/utils'
import mixins from '@/mixins'
import { GOOD_CATEGORY, GOOD_CATEGORY_MAP } from '@/consts'

import GoodsSelect from './comps/goodsSelect'
import skuFinder from './comps/skuFinder'
import { uploadWdtErpItems } from '@/api/goods'

export default {
  components: {
    Treeselect,
    SideBar,
    GoodsSelect,
    skuFinder
  },
  mixins: [mixins, districtOptions],
  provide() {
    return {
      refresh: this.getGoodsList
    }
  },
  props: ['getStatus'],
  data() {
    const loginType = this.$store.getters.login_type

    let statusOption
    if (this.IS_DISTRIBUTOR()) {
      statusOption = [
        { title: this.$t('b7aea01d.cb17b3'), value: true },
        { title: this.$t('b7aea01d.e5bd97'), value: false }
      ]
    } else {
      statusOption = [
        { title: this.$t('b7aea01d.9b7481'), value: 'onsale' },
        { title: this.$t('b7aea01d.2c50a0'), value: 'offline_sale' },
        { title: this.$t('b7aea01d.acf86b'), value: 'only_show' },
        { title: this.$t('b7aea01d.ae83a3'), value: 'instock' }
      ]
    }

    return {
      show_rebate_sideBar: false,
      show_profit_sideBar: false,
      // select_category_value: [],
      select_tags_value: [],
      popularizeSetting: {
        popularize_ratio: {
          type: 'profit'
        }
      },
      regions: [],
      current: '',
      currentId: '',
      currentPrice: '',
      tabList: [
        { name: this.$t('b7aea01d.794a4e'), value: null, activeName: 'first' },
        { name: this.$t('b7aea01d.5a867d'), value: 'true', activeName: 'second' }
      ],
      goodsName: '',
      isEdit: false,
      activeName: 'first',
      ItemsList: [],
      item_id: [],
      goods_id: [],
      templates_new_id: '',
      templatesList: [],
      templatesListavailable: [],
      category_id: [],
      categoryList: [],
      itemCategoryList: [],
      show_sideBar: false,
      loading: false,
      skuLoading: false,
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
      tag: {
        dialog: false,
        editItem: [],
        list: [],
        form: {
          tag_ids: [],
          item_ids: []
        },
        currentTags: [],
        tags: []
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      params: {
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        item_bn: '',
        supplier_goods_bn: '',
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
        is_can_sale: '',
        supplier_name: '',
        category: '',
        item_holder: '',
        is_gift: ''
      },
      goodCategoryMap: GOOD_CATEGORY_MAP,
      goodCategory: GOOD_CATEGORY,
      start_date: '',
      end_date: '',
      addTemplatesdialogVisible: false,
      addCategorydialogVisible: false,
      currency: {},
      cursymbol: '￥',
      form: {},
      isGiftsData: {},
      exportData: {},
      exportTagData: {},
      specItems: [],
      rebateSpecItems: [],
      profitSpecItems: [],
      grade: [],
      vipGrade: [],
      statusOption: statusOption,
      storeUpdate: false,
      storeItemsList: [],
      show_itemStore: false,
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
          label: this.$t('b7aea01d.ce0008'),
          key: 'status',
          type: 'select',
          message: this.$t('b7aea01d.281bad'),
          options: statusOption
        }
      ],
      batchChangeStateForm: {
        status: ''
      },
      isBindWdtErp: false,
      isBindJstErp: false,
      skuEditInput: '',
      skuPriceEditInput: '',
      itemSkuDialog: false,
      itemShowSkuStore: false,
      itemShowSkuPrice: false,
      itemSkuForm: {
        itemName: '',
        itemId: ''
      },
      itemSkuFormList: [
        {
          key: 'invitation_code',
          component: () => (
            <skuFinder
              itemId={this.itemSkuForm.itemId}
              itemShowSkuStore={this.itemShowSkuStore}
              itemShowSkuPrice={this.itemShowSkuPrice}
              distributorId={this.shopId}
            />
          )
        }
      ],
      showItemSkuDrawer: false,
      itemSkuDrawerTitle: '',
      itemSkuList: [],
      goodCategoryMap: GOOD_CATEGORY_MAP,
      goodCategory: GOOD_CATEGORY.filter((item) => item.value != 'distributor')
    }
  },
  computed: {
    ...mapGetters(['wheight', 'login_type', 'shopId'])
  },
  watch: {
    $route(to, from) {
      this.init()
    },
    getStatus(val) {
      if (val) {
        this.getGoodsList()
      }
    }
  },
  mounted() {
    this.init()
    this.fetchWechatList()
    this.params.operator_name = this.$route.query.operator_name
    this.checkWdtErpBind()
    this.checkJstErpBind()
  },

  destroyed() {
    console.log(111)
  },
  methods: {
    onItemSkuFormSubmit() {
      this.itemSkuDialog = false
      this.itemShowSkuStore = false
      this.itemShowSkuPrice = false
      this.getGoodsList()
    },
    onShowPopover({ store, price }, type) {
      if (type == 'store') {
        this.skuEditInput = store
      } else if (type == 'price') {
        this.skuPriceEditInput = price
      }
    },
    // 修改库存
    async onModifyItemSku({ item_id, nospec, itemName }) {
      if (nospec) {
        await this.$api.marketing.updateDistributorItem({
          distributor_id: this.shopId,
          item_id,
          store: this.skuEditInput
        })
        this.getGoodsList()
      } else {
        this.itemSkuForm.itemName = itemName
        this.itemSkuForm.itemId = item_id
        this.itemSkuDialog = true
        this.itemShowSkuStore = true
        this.itemShowSkuPrice = true
      }
    },
    // 修改价格
    async onModifyItemPrice({ item_id, nospec, itemName }) {
      if (nospec) {
        await this.$api.marketing.updateDistributorItem({
          distributor_id: this.shopId,
          item_id,
          price: this.skuPriceEditInput * 100
        })
        this.getGoodsList()
      } else {
        this.itemSkuForm.itemName = itemName
        this.itemSkuForm.itemId = item_id
        this.itemSkuDialog = true
        this.itemShowSkuPrice = true
        this.itemShowSkuStore = false
      }
    },
    // 同步至店铺
    async syncToShop(isAll) {
      if (this.item_id.length == 0) {
        this.$message.error(this.$t('b7aea01d.ace302'))
        return
      }
      let distributorIds = '_all'
      if (!isAll) {
        const { data } = await this.$picker.shop()
        distributorIds = data.map((item) => item.distributor_id)
      }
      await this.$api.marketing.saveDistributorItems({
        distributor_ids: distributorIds,
        item_ids: this.item_id,
        // 是否同步并上架
        is_can_sale: true
      })
      this.$message.success(this.$t('b7aea01d.33130f'))
    },
    async fetchWechatList() {
      const { list } = await this.$api.minimanage.gettemplateweapplist()
      list.forEach((item, i) => {
        if (item.key_name == 'yykweishop') {
          this.appID = item.authorizer.authorizer_appid
        }
      })
    },
    handleShow(id) {
      const page = 'subpages/item/espier-detail'
      this.curPageUrl = `${page}?id=${id}`
      let params = {
        wxaAppId: this.appID,
        page,
        id
      }
      getPageCode(params).then((response) => {
        this.appCodeUrl = response.data.data.base64Image
      })
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
      if (command == 'physicalupload') {
        if (this.login_type == 'distributor') {
          this.$router.push({ path: `/shopadmin/products/product-import` })
        } else {
          this.$router.push({ path: `/products/product-manage/self-products/product-import` })
        }
      } else if (command == 'physicalstoreupload') {
        if (this.login_type == 'distributor') {
          this.$router.push({ path: `/shopadmin/entity/goodsphysical/physicalstoreupload` })
        } else {
          this.$router.push({ path: `/entity/goods/goodsphysical/physicalstoreupload` })
        }
      }
    },
    selectItems() {
      this.xpGoodsVisible = true
    },
    async chooseGoodsAction(data) {
      this.xpGoodsVisible = false
      let list = JSON.parse(JSON.stringify(data))
      if (list === null || list.length === 0) return
      const items = list.map((item) => {
        return {
          goods_id: item.goods_id
        }
      })
      const params = {
        items: JSON.stringify(items)
      }
      await flowItems(params)
      this.$message({
        type: 'success',
        message: this.$t('b7aea01d.9776eb')
      })
      this.getGoodsList()
      // console.log('this.items=======', items)
    },
    closeGoodsDialogAction() {
      this.xpGoodsVisible = false
    },
    async init() {
      if (this.$route.path.split('/')[2] === 'godsphysicalkj') {
        this.params.type = 1
      } else {
        this.params.type = 0
      }
      const { category, main_cat_id, tab } = this.$route.query
      if (category) {
        this.params.category = category.split(',')
        // this.select_category_value = category.split(',')
      }
      this.params.main_cat_id = this.$route.query.main_cat_id
      if (tab) {
        this.activeName = this.$route.query.tab
        this.params.is_warning = true
      }

      const res = await this.$api.promotions.getPopularizeSetting()
      this.popularizeSetting = res

      this.getGoodsList()
      this.getShippingTemplatesList()
      this.getCategory()
      this.getCurrencyInfo()
      this.getAllTagLists()
      this.getGoodsBranchList()
    },
    batchGifts(status) {
      if (this.item_id.length) {
        this.isGiftsData.item_id = Object.assign({}, this.item_id)
        this.isGiftsData.status = status
        saveIsGifts(this.isGiftsData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: this.$t('b7aea01d.33130f'),
              duration: 2000
            })
          } else {
            this.$message({
              type: 'error',
              message: this.$t('b7aea01d.5fa802'),
              duration: 2000
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.c5f66d'),
          duration: 2000
        })
      }
    },

    async exportItemsData() {
      const exportParams = {
        ...this.params
      }
      if (this.item_id.length > 0) {
        exportParams['item_id'] = this.item_id.map((item) => item)
      }
      const { status } = await this.$api.goods.exportItemsData(exportParams)
      if (status) {
        this.$message.success(this.$t('b7aea01d.3e1ddd'))
        this.$export_open('items')
      } else {
        this.$message.error(this.$t('b7aea01d.dd51ab'))
      }
    },
    async exportItemsTagData() {
      const exportParams = {
        ...this.params
      }
      if (this.item_id.length > 0) {
        exportParams['item_id'] = this.item_id.map((item) => item)
      }
      const { status } = await this.$api.goods.exportItemsTagData(exportParams)
      if (status) {
        this.$message.success(this.$t('b7aea01d.3e1ddd'))
        this.$export_open('normal_items_tag')
      } else {
        this.$message.error(this.$t('b7aea01d.dd51ab'))
      }
    },
    async exportItemsWxappCode(exportType) {
      const exportParams = {
        ...this.params
      }
      if (this.item_id.length > 0) {
        exportParams['item_id'] = this.item_id.map((item) => item)
      }
      const { status } = await this.$api.goods.exportGoodsCode({
        ...exportParams,
        item_source: 'item',
        export_type: exportType
      })
      if (status) {
        this.$message.success(this.$t('b7aea01d.3e1ddd'))
        this.$export_open('itemcode')
      } else {
        this.$message.error(this.$t('b7aea01d.dd51ab'))
      }
    },
    handleExport(command) {
      if (command === 'product-info') {
        this.exportItemsData()
      } else if (command === 'product-tag') {
        this.exportItemsTagData()
      } else if (command === 'h5-qrcode') {
        this.exportItemsWxappCode('h5')
      }
    },
    syncItems() {
      syncItems().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('b7aea01d.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b7aea01d.d61036')
          })
        }
      })
    },
    editPrice(id, price) {
      this.currentId = id
      this.currentPrice = price
      let self = this
      this.$nextTick(() => {
        self.$refs['input_' + id].focus()
      })
    },
    handleBlur(index) {
      if (this.currentPrice === this.specItems[index].price) {
        this.currentId = -1
        this.currentPrice = ''
        return
      }
      updateGoodsInfo({ item_id: this.currentId, price: this.currentPrice }).then((res) => {
        this.$message({
          type: 'success',
          message: this.$t('b7aea01d.33130f')
        })
        this.specItems[index].price = this.currentPrice
        this.currentId = -1
        this.currentPrice = ''
      })
    },
    handleClick(tab, event) {
      this.page.pageIndex = 1
      if (this.activeName == 'second') {
        this.params.is_warning = true
      } else {
        this.params.is_warning = false
      }
      this.getGoodsList()
    },
    async setWarningStore() {
      await this.$api.goods.getItemWarningStore({ store: this.warning_store })
      this.page.pageIndex = 1
      this.getGoodsList()
    },
    handleSelectionChange(val) {
      this.selections = val
      let item_id = []
      for (let i in val) {
        item_id.push(val[i].itemId)
      }
      this.item_id = item_id
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.goods_id = goods_id
    },
    handleCancelLabelsDialog() {
      this.tag.dialog = false
    },
    tagUpdate(row) {
      this.tag.editItem = [row.itemName]
      this.tag.currentTags = row.tagList || []
      this.tag.form.item_ids = row.item_id
      this.showTags()
    },
    addItemTag() {
      this.tag.currentTags = []
      if (this.item_id.length) {
        this.showTags()
        this.tag.form.item_ids = this.item_id
        this.tag.editItem = this.selections.map((v) => v.itemName)
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.c5f66d')
        })
      }
    },
    showTags() {
      let tags = []
      this.tag.list.forEach((item, index) => {
        let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
        if (isInArr === -1) {
          tags.push(item)
        }
      })
      this.tag.tags = tags
      this.tag.dialog = true
    },
    tagRemove(index) {
      this.tag.tags.unshift(this.tag.currentTags[index])
      this.tag.currentTags.splice(index, 1)
    },
    tagAdd(item, index) {
      let isInArr = this.tag.currentTags.findIndex((n) => n.tag_id == item.tag_id)
      if (isInArr == -1) {
        this.tag.currentTags.push(item)
        this.tag.tags.splice(index, 1)
      }
    },
    submitItemTag() {
      this.tag.form.tag_ids = []
      this.tag.currentTags.forEach((item) => {
        this.tag.form.tag_ids.push(item.tag_id)
      })
      this.tag.dialog = false
      itemsRelTags(this.tag.form)
        .then((res) => {
          if (res.data.data.status) {
            this.$message({
              type: 'success',
              message: this.$t('b7aea01d.e27f17')
            })
            this.getGoodsList()
          }
        })
        .catch((e) => {
          this.getGoodsList()
        })
    },
    tagSearchUserChange() {
      this.getParams()
      this.getItemsList(this.params)
      this.loading = false
    },
    getAllTagLists() {
      let params = {
        page: 1,
        pageSize: 500
      }
      getTagList(params).then((response) => {
        this.tag.list = response.data.data.list
      })
    },
    changeTemplates() {
      if (this.item_id.length) {
        if (!this.templates_new_id) {
          this.$message({
            type: 'error',
            message: this.$t('b7aea01d.d778f5')
          })
          return false
        }
        this.addTemplatesdialogVisible = false
        setItemsTemplate({ templates_id: this.templates_new_id, item_id: this.item_id }).then(
          (response) => {
            this.getGoodsList()
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
      }
    },
    editItemsSort(index, row) {
      setItemsSort({ sort: row.sort, item_id: row.itemId }).then((response) => {
        this.getGoodsList()
      })
    },
    changeCategory() {
      if (this.item_id.length) {
        if (!this.category_id) {
          this.$message({
            type: 'error',
            message: this.$t('b7aea01d.24b9c6')
          })
          return false
        }
        this.addCategorydialogVisible = false
        setItemsCategory({ category_id: this.category_id, item_id: this.item_id }).then(
          (response) => {
            this.getGoodsList()
            this.category_id = []
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
      }
    },
    addItems() {
      // 添加商品
      this.$router.push({ path: this.matchRoutePath('editor') })
    },
    addTemplates() {
      if (this.item_id.length) {
        this.addTemplatesdialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
      }
    },
    addCategory() {
      if (this.item_id.length) {
        this.addCategorydialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
      }
    },
    editItemsAction(index, row, isNew) {
      // // 编辑商品弹框
      // this.show_rebate_sideBar = false
      // this.show_sideBar = false
      // this.show_itemStore = false
      this.$router.push({
        path: `${this.$route.path}/editor/${row.item_id}`,
        query: {
          detail: true
        }
      })
    },
    saveRebateConf() {
      var rebateConf = []
      this.rebateSpecItems.forEach((item) => {
        var rebate_conf = item.rebate_conf
        rebate_conf.ratio_type = this.popularizeSetting.popularize_ratio.type
        rebateConf.push(rebate_conf)
      })
      updateItemRebateConf({ rebateConf: JSON.stringify(rebateConf) }).then((res) => {
        this.$message({ message: this.$t('b7aea01d.3b1083'), type: 'success', duration: 2 * 1000 })
      })
    },
    saveProfitConf() {
      var profitConf = []
      this.profitSpecItems.forEach((item) => {
        var profit_conf = {}
        profit_conf.item_id = item.item_id
        profit_conf.profit_type = item.profit_type
        profit_conf.price = item.price * 100
        if (1 == profit_conf.profit_type) {
          profit_conf.profit_conf_profit = item.profit_conf_profit
          profit_conf.profit_conf_popularize_profit = item.profit_conf_popularize_profit
        } else {
          profit_conf.profit_conf_profit = item.profit_conf_profit * 100
          profit_conf.profit_conf_popularize_profit = item.profit_conf_popularize_profit * 100
        }

        profitConf.push(profit_conf)
      })
      saveGoodsProfitPrice({ profit_conf: JSON.stringify(profitConf) }).then((res) => {
        this.$message({
          message: this.$t('b7aea01d.3b1083'),
          type: 'success',
          duration: 2 * 1000
        })
      })
    },
    handleRebateConf(data) {
      this.show_rebate_sideBar = true
      this.show_profit_sideBar = false
      this.show_sideBar = false
      this.skuLoading = true
      this.current = data
      getItemsList({
        page: 1,
        pageSize: 1000,
        is_sku: true,
        item_id: data.item_id,
        item_type: 'normal'
      }).then((res) => {
        var rebateSpecItems = []
        res.data.data.list.forEach((item) => {
          if (item.rebate_conf.length === 0) {
            item.rebate_conf = {}
            item.rebate_conf.type = 'money'
            item.rebate_conf.value = {}
            for (let key in this.popularizeSetting.popularize_ratio.profit) {
              item.rebate_conf.value[key] = ''
            }
          } else {
            if (
              this.popularizeSetting.popularize_ratio.type != item.rebate_conf.ratio_type &&
              item.rebate_conf.type != 'money'
            ) {
              for (let key in this.popularizeSetting.popularize_ratio.profit) {
                item.rebate_conf.value[key] = ''
              }
            }
          }
          item.rebate_conf.item_id = item.item_id
          rebateSpecItems.push(item)
        })
        this.rebateSpecItems = rebateSpecItems
        this.skuLoading = false
      })
    },
    handlePrice(data) {
      this.show_rebate_sideBar = false
      this.show_sideBar = true
      this.show_profit_sideBar = false
      this.current = data.item_id
      this.getGoodsPrice(data.item_id)
    },
    handleProfitPrice(data) {
      this.show_rebate_sideBar = false
      this.show_sideBar = false
      this.show_profit_sideBar = true
      this.current = data.item_id
      this.getGoodsProfitPrice(data.item_id)
    },
    getGoodsPrice(item_id) {
      this.skuLoading = true
      getGoodsPrice(item_id).then((res) => {
        let specItems = []
        let colConfigs = []
        res.data.data.list.forEach((item) => {
          specItems.push({
            item_id: item.item_id,
            item_spec_desc: item.item_spec_desc || item.itemName,
            price: item.price / 100,
            market_price: item.market_price / 100,
            grade: this.generatePrice(item.memberGrade.grade),
            vipGrade: this.generatePrice(item.memberGrade.vipGrade)
          })
        })
        this.grade = this.generatePrice(res.data.data.list[0].memberGrade.grade)
        this.vipGrade = this.generatePrice(res.data.data.list[0].memberGrade.vipGrade)
        this.specItems = specItems
        this.skuLoading = false
      })
    },
    getGoodsProfitPrice(item_id) {
      this.skuLoading = true
      getGoodsProfitPrice(item_id).then((res) => {
        let profitSpecItems = []
        let colConfigs = []
        res.data.data.list.forEach((item) => {
          let arr = {
            item_id: item.item_id,
            item_spec_desc: item.item_spec_desc || item.itemName,
            price: item.price / 100,
            market_price: item.market_price / 100,
            profit_type: item.profit_type,
            profit_conf_profit: item.profit_conf_profit,
            profit_conf_popularize_profit: item.profit_conf_popularize_profit
          }
          if (2 == item.profit_type) {
            arr.profit_conf_profit = item.profit_conf_profit / 100
            arr.profit_conf_popularize_profit = item.profit_conf_popularize_profit / 100
          }
          profitSpecItems.push(arr)
        })
        this.profitSpecItems = profitSpecItems
        this.skuLoading = false
      })
    },
    generatePrice(data) {
      let list = []
      for (let key in data) {
        list.push({
          vip_grade_id: data[key].vip_grade_id,
          grade_name: data[key].grade_name,
          mprice: data[key].mprice / 100 || ''
        })
      }
      return list
    },
    savePrice() {
      let param = {
        item_id: this.current,
        mprice: ''
      }
      let skus = {}
      this.specItems.forEach((item) => {
        let grade = {}
        item.grade.forEach((child) => {
          Object.assign(grade, { [child.vip_grade_id]: child.mprice })
        })
        let vipGrade = {}
        item.vipGrade.forEach((child) => {
          Object.assign(vipGrade, { [child.vip_grade_id]: child.mprice })
        })
        Object.assign(skus, {
          [item.item_id]: {
            grade: grade,
            vipGrade: vipGrade
          }
        })
      })
      param.mprice = JSON.stringify(skus)

      this.submitLoading = true
      const _self = this
      updateGoodsPrice(param)
        .then((res) => {
          this.$message({
            type: 'success',
            message: this.$t('b7aea01d.55aa63'),
            duration: 2000,
            onClose() {
              _self.submitLoading = false
              _self.getGoodsPrice(param.item_id)

              _self.getGoodsList()
            }
          })
        })
        .catch((res) => {
          _self.submitLoading = false
        })
    },
    handleCurrentChange(pageIndex) {
      this.page.pageIndex = pageIndex
      this.getGoodsList()
    },
    handleSizeChange(pageSize) {
      this.page.pageIndex = 1
      this.page.pageSize = pageSize
      this.getGoodsList()
    },
    onSearch() {
      this.page.pageIndex = 1
      this.$nextTick(() => {
        this.getGoodsList()
      })
    },
    async getGoodsList() {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        ...this.params,
        distributor_id: this.shopId
      }
      // const { list, total_count, warning_store } = await this.$api.goods.getItemsList(params)
      const { list, total_count, warning_store } = await this.$api.marketing.getDistributorItems(
        params
      )
      list.forEach((item) => {
        item.price = item.price / 100
        item.market_price = item.market_price / 100
        item.link = `subpages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`
      })
      this.ItemsList = list
      this.page.total = parseInt(total_count)
      this.warning_store = warning_store
      this.loading = false
    },
    deleteItemsAction(index, row) {
      this.$confirm(this.$t('b7aea01d.e569b1'), this.$t('b7aea01d.02d981'), {
        confirmButtonText: this.$t('b7aea01d.38cf16'),
        cancelButtonText: this.$t('b7aea01d.625fb2'),
        type: 'warning'
      })
        .then(() => {
          deleteItems(row.itemId).then((response) => {
            this.ItemsList.splice(index, 1)
            this.$message({
              message: this.$t('b7aea01d.a8504b'),
              type: 'success',
              duration: 2 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('b7aea01d.2111cc')
          })
        })
    },
    async getShippingTemplatesList() {
      const { list } = await this.$api.shipping.getShippingTemplatesList({
        page: 1,
        pageSize: 1000
      })
      this.templatesList = list
      this.templatesListavailable = list.filter((item) => item.status)
    },
    getGoodsBranchList(searchVal = '') {
      // this.loading = true
      // console.log(searchVal)
      this.goodsBranchParams.attribute_name = searchVal
      getGoodsAttr(this.goodsBranchParams).then((response) => {
        this.goodsBranchList = response.data.data.list
        // console.log(this.goodsBranchList)
      })
    },
    async getCategory() {
      //销售分类
      const categoryList = await this.$api.goods.getCategory({ is_show: false })
      this.categoryList = categoryList

      //管理分类
      const itemCategoryList = await this.$api.goods.getCategory({ is_main_category: true })
      this.itemCategoryList = itemCategoryList
    },
    getCurrencyInfo() {
      getDefaultCurrency().then((res) => {
        this.currency = res.data.data
        this.cursymbol = this.currency.symbol
      })
    },
    batchItemsStore() {
      this.storeItemsList = []
      if (this.item_id.length) {
        this.storeUpdate = true
      } else {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
      }
    },
    batchChangeStore() {
      if (this.goods_id.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.ace302')
        })
        return false
      }
      this.batchChangeStateDialog = true
    },
    async onBatchChangeStateSubmit() {
      await this.$api.marketing.updateDistributorItem({
        distributor_id: this.shopId,
        goods_id: this.goods_id,
        is_can_sale: this.batchChangeStateForm.status
      })

      this.$message.success(this.$t('b7aea01d.69be67'))
      this.getGoodsList()
      this.batchChangeStateDialog = false
    },
    async updateItemStatus(items) {
      this.loading = true
      let params = {}
      params = {
        goods_id: items.goods_id,
        // 'status': items.is_market == '0' ? 'onsale' : 'instock',
        // 'is_can_sale': items.is_market == '0' ? true : false,
        is_can_sale: !items.is_can_sale,
        distributor_id: this.shopId,
        operate_source: 'platform'
      }
      try {
        const { status } = await this.$api.marketing.updateDistributorItem(params)
        if (status) {
          this.$message.success(this.$t('b7aea01d.33130f'))
          this.getGoodsList()
        }
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    updateItemsStore(items) {
      this.skuLoading = true
      this.item_id = []
      let param = JSON.parse(JSON.stringify(this.params))
      param.item_id = items.item_id
      param.is_sku = true
      this.storeItemsList = []
      getItemsList({
        ...param,
        page: this.page.pageIndex,
        pageSize: this.page.pageSize
      }).then((response) => {
        let list = response.data.data.list
        let data = {}
        list.forEach((item) => {
          let data = {
            item_id: item.item_id,
            store: item.store,
            item_spec_desc: item.item_spec_desc ? item.item_spec_desc : item.item_name
          }
          this.storeItemsList.push(data)
        })
        this.skuLoading = false
      })
      this.show_itemStore = true
    },
    saveItemsStore() {
      this.skuLoading = true
      if (
        Number(this.itemstore) < 0 ||
        (this.storeItemsList.length && Number(this.storeItemsList[0].store) < 0)
      ) {
        this.$message({ type: 'error', message: this.$t('b7aea01d.9a4078'), duration: 2000 })
        this.skuLoading = false
        return
      }
      let params = {}
      if (this.storeItemsList.length > 0) {
        params = {
          items: JSON.stringify(this.storeItemsList)
        }
      } else if (this.item_id.length > 0) {
        let data = []
        this.item_id.forEach((itemid) => {
          data.push({ item_id: itemid, store: this.itemstore, is_default: true })
        })
        params = {
          items: JSON.stringify(data)
        }
      }
      this.submitLoading = true
      const _self = this
      updateItemsStore(params)
        .then((res) => {
          if (res.data.data.status) {
            this.$message({
              message: this.$t('b7aea01d.69be67'),
              type: 'success',
              duration: 2 * 1000
            })
          }
          this.submitLoading = false
          this.skuLoading = false
          this.storeUpdate = false

          this.getGoodsList()
        })
        .catch((err) => {
          this.submitLoading = false
          this.skuLoading = false
        })
    },
    // 上下架
    async handleViewSkuInfo(item) {
      this.skuLoading = true
      const { list } = await this.$api.goods.getDrawItemsList({
        item_type: 'normal',
        operate_source: 'platform',
        // operate_source: 'supplier',
        item_id: item.goods_id,
        is_sku: true,
        page: 1,
        pageSize: 1000,
        distributor_id: 0
      })
      this.itemSkuDrawerTitle = `${this.$t('d41d8cd9.k1l2m3')}${item.item_name}】`
      this.itemSkuList = list || []
      this.showItemSkuDrawer = true
      this.itemSkuList = list
      this.skuLoading = false
    },
    onClickLink(row) {
      this.$copyText(
        `${process.env.VUE_APP_H5_HOST}/subpages/item/espier-detail?id=${row.item_id}&dtid=${row.distributor_id}`
      ).then(() => {
        this.$message.success(this.$t('b7aea01d.20a495'))
      })
    },
    checkWdtErpBind() {
      this.$api.third.getWdtErpSetting().then((response) => {
        this.isBindWdtErp = response.is_open
      })
    },
    uploadWdtErpItems() {
      console.log(this.item_id)
      if (this.item_id.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.fd99ad')
        })
        return
      }
      let params = {}
      params = {
        item_id: this.item_id
      }
      this.$api.goods.uploadWdtErpItems(params).then((res) => {
        if (res.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('b7aea01d.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b7aea01d.1c83d7')
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
      if (this.item_id.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('b7aea01d.fd99ad')
        })
        return
      }
      let params = {}
      params = {
        item_id: this.item_id
      }
      this.$api.goods.uploadJstErpItems(params).then((res) => {
        if (res.status == true) {
          this.$message({
            type: 'success',
            message: this.$t('b7aea01d.bbdee9')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('b7aea01d.1c83d7')
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
.tag-users {
  padding-bottom: 10px;
  line-height: 1.2;
  .icon-user-circle1 {
    margin-right: 10px;
    font-size: 24px;
    color: #ccc;
  }
}
.selected-tags {
  padding-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  .label {
    margin-bottom: 15px;
  }
  .el-tag {
    margin-right: 10px;
    margin-bottom: 15px;
  }
}
.tag-item {
  cursor: pointer;
  color: #666;
  border-color: #dadadd;
  margin-right: 10px;
  margin-top: 10px;
}
.copy-btn {
  position: relative;
  [class^='copy-link'] {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    visibility: hidden;
  }
}
.page-code {
  width: 100%;
}
.page-btns {
  text-align: center;
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
