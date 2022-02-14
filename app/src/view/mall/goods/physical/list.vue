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
</style>
<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1 && $route.path.indexOf('physicalstoreupload') === -1 && $route.path.indexOf('physicalprofitupload') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-input class="input-m" placeholder="商品名称" v-model="params.keywords">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="商品编号" v-model="params.item_bn">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
          <el-input class="input-m" placeholder="条形码" v-model="params.barcode">
            <el-button slot="append" icon="el-icon-search" @click="goodsSearch"></el-button>
          </el-input>
          <el-select v-model="templates_id" @change="handleChangeTemplates" placeholder="运费模板" clearable>
            <el-option v-for="item in templatesList" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
          </el-select>
          <el-cascader
            placeholder="商品产地"
            :options="regions"
            v-model='select_regions_value'
            clearable
            @change="searchAction">
          </el-cascader>
          <el-select v-model="params.approve_status" clearable placeholder="商品状态" @change="goodsSearch">
            <el-option v-if="login_type != 'distributor'" v-for="item in statusOption" :key="item.value"
                       :label="item.title" size="mini" :value="item.value"></el-option>
            <el-option v-if="login_type == 'distributor'" v-for="item in shopStatusOption" :key="item.value"
                       :label="item.title" size="mini" :value="item.value"></el-option>
          </el-select>
          <el-select
            placeholder="选择品牌"
            remote
            filterable
            :remote-method="getGoodsBranchList"
            clearable
            v-model='select_branch_value'
            @change="searchAction">
            <el-option
              v-for="item in goodsBranchList"
              :key="item.attribute_id"
              :label="item.attribute_name"
              :value="item.attribute_id"
            ></el-option>
          </el-select>
          <el-cascader
            placeholder="商品分类"
            :options="categoryList"
            :props="{value:'category_id',checkStrictly:true}"
            v-model='select_category_value'
            clearable
            @change="searchAction">
          </el-cascader>
          <el-cascader
            placeholder="商品标签"
            :options="tag.list"
            :props="{value:'tag_id', label: 'tag_name'}"
            v-model='select_tags_value'
            clearable
            @change="searchAction">
          </el-cascader>
          <!-- <el-select v-model="params.special_type" clearable placeholder="商品类型" @change="searchAction">
            <el-option
              placeholder="商品类型"
              v-for="item in special_type_list"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-col>
        <!--
        <el-col :md="3" :lg="3">
          <el-select size="small" v-model="params.is_gift" placeholder="是否赠品" @change="searchAction" style="width: 110px">
            <el-option label="全部" value="all"></el-option>
            <el-option label="赠品" :value="true"></el-option>
            <el-option label="商品" :value="false"></el-option>
          </el-select>
        </el-col>
        -->
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <el-button-group>
            <el-button size="small" type="primary" @click="addCategory">更改商品分类</el-button>
            <el-button size="small" type="primary" @click="addTemplates">更改运费模板</el-button>
            <el-button size="small" type="primary" @click="addItemTag">打标签</el-button>
            <el-button size="small" type="primary" @click="batchItemsStore">统一库存</el-button>
            <el-button size="small" type="primary" @click="batchItemsStatus('onsale')">批量上架</el-button>
            <el-button size="small" type="primary" @click="batchItemsStatus('instock')">批量下架</el-button>
            <el-button size="small" type="primary" @click="batchGifts('true')">批量设置为赠品</el-button>
            <el-button size="small" type="primary" @click="batchGifts('false')">批量设置为非赠品</el-button>
            <export-tip @exportHandle='exportItemsData'>
              <el-button size="small" type="primary">导出商品信息</el-button>
            </export-tip>
             <export-tip @exportHandle='exportItemsTagData'>
            <el-button size="small" type="primary">导出商品标签</el-button>
             </export-tip>
            <el-button size="small" type="primary" @click="syncItems">同步商品数据</el-button>
            <router-link to="/entity/goods/goodsphysical/physicalstoreupload">
              <el-button size="small" type="primary">商品库存导入</el-button>
            </router-link>
            <router-link to="/entity/goods/goodsphysical/physicalprofitupload">
              <el-button size="small" type="primary">商品分润导入</el-button>
            </router-link>
          </el-button-group>
          <el-button size="small" type="primary" icon="el-icon-circle-plus" plain @click="addItems">添加商品</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.name" :name="item.activeName">
          <div v-if="activeName == 'second'" style="margin-bottom: 15px; width:280px;">
            <el-input size="small" v-model="warning_store" value="warning_store">
              <template slot="prepend">预警数量</template>
              <el-button slot="append" @click="setWarningStore">保存</el-button>
            </el-input>
          </div>
          <el-table :data="ItemsList" @selection-change="handleSelectionChange" v-loading="loading">
            <el-table-column type="selection" align="center" label="全选" ></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="editItemsAction(scope.$index, scope.row, false)" class="btn-gap">编辑</el-button>
                <el-popover
                  placement="right"
                  width="450"
                  trigger="hover">
                <div class="operating-icons">
                  <el-button type="text" @click="deleteItemsAction(scope.$index, scope.row)" class="btn-gap">删除</el-button>
                  <el-button type="text" @click="editItemsAction(scope.$index, scope.row, true)" class="btn-gap">添加相似</el-button>
                  <el-button type="text" @click="handlePrice(scope.row)" class="btn-gap">设置价格</el-button>
                  <!--el-button v-if="popularizeSetting.isOpenPopularize == 'true'" type="text" @click="handleRebateConf(scope.row)" class="btn-gap">分销配置</el-button-->
                  <el-button type="text" @click="handleProfitPrice(scope.row)" class="btn-gap">分润配置</el-button>
                  <el-button type="text" @click="tagUpdate(scope.row)" class="btn-gap">标签</el-button>
                  <el-button type="text" @click="updateItemsStore(scope.row)" class="btn-gap" >更改库存</el-button>
                  <el-button class="copy-btn"
                    type="text"
                    v-clipboard:copy="scope.row.link"
                    v-clipboard:success="onCopy">
                    <input class="copy-link" type="text" v-model="scope.row.link"></input>复制链接
                  </el-button>
                  <el-button type="text" v-if="scope.row.approve_status == 'onsale'" @click="updateItemStatus(scope.row)" class="btn-gap" >下架</el-button>
                  <el-button type="text" v-if="scope.row.approve_status == 'instock'" @click="updateItemStatus(scope.row)" class="btn-gap" >上架</el-button>
                </div>
                <el-button type="text" slot="reference"><i class="iconfont icon-angle-double-right"></i></el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column type="expand" label="标签">
              <template slot-scope="scope">
                <template v-if="scope.row.tagList.length > 0">
                  <el-tag v-for="taglist in scope.row.tagList" :key="taglist.index" :color="taglist.tag_color" size="mini" :style="'color:'+ taglist.font_color" style="display: inline-block; margin-right:3px;">{{taglist.tag_name}}</el-tag>
                </template>
                <template v-else>
                  <span class="muted">暂无标签</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="goods_id" label="商品ID" width="80"></el-table-column>
            <el-table-column prop="itemName" label="商品">
              <template slot-scope="scope">
                <div class="goods-title">{{scope.row.item_name}} <el-tag size="mini" effect="plain" type="primary" v-if="!scope.row.nospec">多规格</el-tag></div>
                <div class="goods-code">
                  货号：{{scope.row.itemBn}}
                  <el-tooltip effect="dark" content="复制" placement="top-start">
                    <i v-clipboard:copy="scope.row.itemBn" v-clipboard:success="onCopy" class="el-icon-document-copy"></i>
                  </el-tooltip>
                </div>
                <!-- <el-tag type="danger" size="mini" v-if="scope.row.special_type == 'drug'">处方药</el-tag> -->
              </template>
            </el-table-column>
            <el-table-column label="排序编号" width="90">
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" @change="editItemsSort(scope.$index, scope.row)" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="store" label="库存" width="80"></el-table-column>
            <el-table-column label="原价" width="80">
              <template slot-scope="scope">
                ¥{{scope.row.market_price}}
              </template>
            </el-table-column>
            <el-table-column label="销售价" width="80">
              <template slot-scope="scope">
                ¥{{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.audit_status == 'processing'">等待审核</span>
                <el-popover v-else-if="scope.row.audit_status == 'rejected'" placement="top-start" width="200" trigger="hover" :content="scope.row.audit_reason">
                  <el-button type="text" slot="reference">审核驳回</el-button>
                </el-popover>
                <span v-else-if="scope.row.approve_status == 'onsale' ">前台可销</span>
                <span v-else-if="scope.row.approve_status == 'offline_sale' ">可线下销售</span>
                <span v-else-if="scope.row.approve_status == 'only_show' ">前台仅展示</span>
                <span v-else>不可销售</span>
              </template>
            </el-table-column>

            <!-- <el-table-column prop="itemMainCatName" label="主类目" width="150"></el-table-column> -->
            <el-table-column prop="itemCatName" label="商品分类" width="150"></el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page.sync="params.page"
              :page-sizes="[10,20,50]"
              :total="total_count"
              :page-size="params.pageSize">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 选择运费模板-开始 -->
      <el-dialog
        title="更改运费模板"
        :visible.sync="addTemplatesdialogVisible"
        width="30%">
        <el-select v-model="templates_new_id" placeholder="运费模板" style="width: 100%;">
          <el-option v-for="item in templatesList" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addTemplatesdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeTemplates">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 选择运费模板-结束 -->
      <!-- 选择商品分类-开始 -->
      <el-dialog
        title="更改商品分类"
        :visible.sync="addCategorydialogVisible"
        width="30%">
        <treeselect
          :options="categoryList"
          :multiple="true"
          :show-count="true"
          :disable-branch-nodes="true"
          v-model="category_id"
        >
        </treeselect>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategorydialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changeCategory">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="为商品打标签" class="right-dialog" :visible.sync="tag.dialog" :before-close="handleCancelLabelsDialog">
        <div class="tag-users view-flex view-flex-middle">
          <i class="iconfont icon-user-circle1"></i>
          <div class="view-flex-item">
            <span v-for="(item, index) in tag.editItem" :key="index"> {{item}}，</span>
          </div>
        </div>
        <div class="selected-tags view-flex">
          <div class="label">已选中标签：</div>
          <div class="view-flex-item">
            <el-tag :key="index" v-for="(tag, index) in tag.currentTags" closable size="small" :disable-transitions="false" @close="tagRemove(index)">
              {{tag.tag_name}}
            </el-tag>
          </div>
        </div>
        <div>
          <el-tag class="tag-item" :key="index" v-for="(tag, index) in tag.tags" size="medium" color="#ffffff" :disable-transitions="false" @click.native="tagAdd(tag, index)">
            {{tag.tag_name}}
          </el-tag>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tag.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitItemTag">确 定</el-button>
        </span>
      </el-dialog>
      <SideBar :visible.sync="show_rebate_sideBar" title="商品分销配置" width="60">
        <slot>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span v-if="popularizeSetting.popularize_ratio.type == 'profit'">
                <el-alert title="返佣计算类型: 【按利润分佣】"
                  description="计算方式：商品利润 ×  百分比，其中商品利润为【支付金额-运费-商品成本价】，如果设置的返佣为固定金额，则不会按利润返佣，返佣金额就是设置的固定金额。如果不填则使用通用配置返佣"
                  type="info" close-text=" " class="alert-text" show-icon>
                </el-alert>
              </span>
              <span v-else>
                <el-alert title="返佣计算类型: 【按订单金额分佣】"
                  description="计算方式： 订单金额 × 百分比，其中订单金额为【支付金额-运费】，如果设置的返佣为固定金额，则不会按订单金额分佣，返佣金额就是设置的固定金额。如果不填则使用通用配置返佣"
                  type="info" close-text=" " class="alert-text" show-icon>
                </el-alert>
              </span>
            </div>
            商品名称：{{current.item_name}}
            <el-table :data="rebateSpecItems" v-loading="skuLoading">
              <el-table-column label="规格" prop="item_spec_desc" min-width="120">
                <template slot-scope="scope"><span v-if="scope.row.item_spec_desc">{{scope.row.item_spec_desc}}</span><span v-else>单规格</span></template>
              </el-table-column>
              <el-table-column label="销售价" min-width="80"> <template slot-scope="scope"> ¥{{scope.row.price/100}} </template> </el-table-column>
              <el-table-column label="成本价" min-width="80"> <template slot-scope="scope"> ¥{{scope.row.cost_price/100}} </template> </el-table-column>
              <el-table-column label="类型" width="160">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.rebate_conf.type" active-value="money" inactive-value="ratio" active-text="金额" inactive-text="比例"> </el-switch>
                </template>
              </el-table-column>
              <el-table-column v-for="(item,key) in popularizeSetting.popularize_ratio.profit" :key="key" :label="item.name" min-width="110">
                <template slot-scope="scope">
                  <el-input v-if="scope.row.rebate_conf.type == 'money'" type="number" v-model="scope.row.rebate_conf.value[key]" size="mini" suffix-icon="iconfont icon-yen-sign"></el-input>
                  <el-input v-else v-model="scope.row.rebate_conf.value[key]" size="mini" type="number" suffix-icon="iconfont icon-percent"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </slot>
        <div slot="footer"><el-button type="primary" @click="saveRebateConf" :loading="submitLoading">保存</el-button></div>
      </SideBar>
      <SideBar :visible.sync="show_profit_sideBar" name="show_profit_sideBar" title="商品分销配置" width="60">
        <slot>
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>
                <el-alert
                  title="导购分润计算类型: 【默认】"
                  description="计算方式：默认按照 主类目分润配置优先,导购分润配置计算其次"
                  type="info"
                  close-text=" "
                  class="alert-text"
                  show-icon
                ></el-alert>
              </span>
              <span>
                <el-alert
                  title="导购分润计算类型: 【百分比】"
                  description="计算方式：商品最终金额 ×  百分比，其中计算方式：商品最终金额为【支付金额-运费-商品优惠金额】"
                  type="info"
                  close-text=" "
                  class="alert-text"
                  show-icon
                ></el-alert>
              </span>
              <span>
                <el-alert
                  title="导购分润计算类型: 【商品金额】"
                  description="计算方式： 固定金额分佣"
                  type="info"
                  close-text=" "
                  class="alert-text"
                  show-icon
                ></el-alert>
              </span>
            </div>
            商品名称：{{current.item_name}}
            <el-table :data="profitSpecItems" v-loading="skuLoading">
              <el-table-column label="规格" prop="item_spec_desc" min-width="120"></el-table-column>
              <el-table-column label="原价" prop="market_price" width="100">
                <template slot-scope="scope">¥{{scope.row.market_price}}</template>
              </el-table-column>
              <el-table-column label="销售价" width="100">
                <template slot-scope="scope">¥{{scope.row.price}}</template>
              </el-table-column>
              <el-table-column label="分润类型">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.profit_type" placeholder="请选择">
                    <el-option label="默认" :value="0"></el-option>
                    <el-option label="百分比" :value="1"></el-option>
                    <el-option label="商品金额" :value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="拉新导购分润">
                <template slot-scope="scope">
                  <div v-if="0 == scope.row.profit_type">
                    <el-input
                      :disabled="true"
                      size="mini"
                      type="number"
                      value="0">
                    </el-input>
                  </div>
                  <div v-else>
                    <el-input v-model="scope.row.profit_conf_profit" size="mini" type="number">
                      <template v-if="1 == scope.row.profit_type" slot="append">%</template>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="推广导购分润">
                <template slot-scope="scope">
                  <div v-if="0 == scope.row.profit_type">
                    <el-input
                      :disabled="true"
                      size="mini"
                      type="number"
                      value="0"
                    >
                    </el-input>
                  </div>
                  <div v-else>
                    <el-input v-model="scope.row.profit_conf_popularize_profit" size="mini" type="number">
                      <template v-if="1 == scope.row.profit_type" slot="append">%</template>
                    </el-input>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </slot>
        <div slot="footer">
          <el-button type="primary" @click="saveProfitConf" :loading="submitLoading">保存</el-button>
        </div>
      </SideBar>
      <SideBar :visible.sync="show_sideBar" title="设置会员价" width="60">
        <slot>
          <el-table :data="specItems" v-loading="skuLoading" height="100%">
            <el-table-column label="规格" prop="item_spec_desc" min-width="120">
            </el-table-column>
            <el-table-column label="原价" prop="market_price" width="100">
              <template slot-scope="scope">
                ¥{{scope.row.market_price}}
              </template>
            </el-table-column>
            <el-table-column label="销售价" width="100">
              <template slot-scope="scope">
                <div v-if="scope.row.item_id !== currentId">
                  ¥{{scope.row.price}}
                  <i class="el-input__icon el-icon-edit" @click="editPrice(scope.row.item_id, scope.row.price)"></i>
                </div>
                <el-input v-else v-model="currentPrice" @blur="handleBlur(scope.$index)" size="mini" :ref="'input_' + scope.row.item_id"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="会员">
              <el-table-column v-for="(item, index) in grade" :key="index" :label="item.grade_name">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.grade[index].mprice" size="mini" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column label="付费会员">
              <el-table-column v-for="(item, index) in vipGrade" :key="index" :label="item.grade_name">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.vipGrade[index].mprice" size="mini" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </slot>
        <div slot="footer"><el-button type="primary" @click="savePrice" :loading="submitLoading">保存</el-button></div>
      </SideBar>
      <!-- 选择商品分类-结束 -->
      <SideBar :visible.sync="show_itemStore" title="设置商品库存" width="60">
        <slot>
          <el-table :data="storeItemsList" v-loading="skuLoading" height="100%">
            <el-table-column label="规格" prop="item_spec_desc" min-width="120">
            </el-table-column>
            <el-table-column label="库存">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.store" size="mini" type="number"></el-input>
                </template>
            </el-table-column>
          </el-table>
        </slot>
        <div slot="footer"><el-button type="primary" @click="saveItemsStore" :loading="submitLoading">保存</el-button></div>
      </SideBar>
      <el-dialog
        title="批量修改库存"
        :visible.sync="storeUpdate"
        width="30%">
        统一库存：<el-input v-model="itemstore" size="mini" type="number"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="storeUpdate = false">取 消</el-button>
          <el-button type="primary" @click="saveItemsStore">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPopularizeSetting } from '@/api/promotions'
// import the component
import Treeselect from '@riophae/vue-treeselect'
import SideBar from '@/components/element/sideBar'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { Message } from 'element-ui'
import { getShippingTemplatesList } from '@/api/shipping'
import { getDefaultCurrency } from '@/api/company'
import district from '@/common/district.json'
import {
  getItemsList,
  setItemsTemplate,
  setItemsCategory,
  deleteItems,
  getItemWarningStore,
  getCategory,
  setItemsSort,
  updateGoodsInfo,
  getGoodsPrice,
  updateGoodsPrice,
  updateItemRebateConf,
  getTagList,
  itemsRelTags,
  tagSearchItem,
  updateItemsStore,
  updateItemsStatus,
  getGoodsAttr,
  getGoodsExport,
  exportItemsData,
  exportItemsTagData,
  getGoodsProfitPrice,
  saveGoodsProfitPrice,
  syncItems,
  saveIsGifts
} from '@/api/goods'

export default {
  components: {
    Treeselect,
    SideBar,
  },
  props: ['getStatus'],
  provide() {
    return {
      refresh: this.getGoodsList
    }
  },
  data() {
    return {
      login_type: 'default',
      show_rebate_sideBar: false,
      show_profit_sideBar: false,
      select_regions_value: [],
      select_category_value: [],
      select_tags_value: [],
      select_branch_value: [],
      special_type_list: [
        { value: 'normal', name: '普通商品' },
        { value: 'drug', name: '处方药' }
      ],
      popularizeSetting: {
        popularize_ratio: {
          type: 'profit'
        }
      },
      regions: district,
      current: '',
      currentId: '',
      currentPrice: '',
      tabList: [
        { name: '全部商品', value: null, activeName: 'first' },
        { name: '库存预警商品', value: 'true', activeName: 'second' }
      ],
      goodsName: '',
      isEdit: false,
      activeName: 'first',
      ItemsList: [],
      item_id: [],
      goods_id: [],
      templates_id: '',
      templates_new_id: '',
      templatesList: [],
      category_id: [],
      categoryList: [],
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
      params: {
        page: 1,
        pageSize: 20,
        item_type: 'normal',
        templates_id: '',
        keywords: '',
        category: 0,
        is_warning: false,
        tag_id: '',
        is_gift: 'all',
        type: 0,
        barcode: '',
        distributor_id: 0
      },
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
      statusOption: [
        { title: '前台可销售', value: 'onsale' },
        { title: '可线下销售', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ],
      shopStatusOption: [
        { title: '审核驳回', value: 'rejected' },
        { title: '等待审核', value: 'processing' },
        { title: '前台可销售', value: 'onsale' },
        { title: '可线下销售', value: 'offline_sale' },
        { title: '前台仅展示', value: 'only_show' },
        { title: '不可销售', value: 'instock' }
      ],
      storeUpdate: false,
      storeItemsList: [],
      show_itemStore: false,
      itemstore: 0,
      distributorVisible: false,
      setDistributorStatus: false,
      relDistributorIds: '',
      selections: []
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  methods: {
    init() {
      if (this.$route.path.split('/')[2] === 'godsphysicalkj') {
        console.log('跨境商品列表')
        this.params.type = 1
      } else {
        console.log('普通商品列表')
        this.params.type = 0
      }
      this.login_type = this.$store.getters.login_type
      if (this.$route.query.category) {
        this.params.category = this.$route.query.category
        this.select_category_value = this.params.category.split(',')
      }
      this.params.main_cat_id = this.$route.query.main_cat_id

      getPopularizeSetting().then((response) => {
        this.popularizeSetting = response.data.data
      })
      if (this.$route.query.tab) {
        this.activeName = this.$route.query.tab
        this.params.is_warning = true
      }

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
              message: '操作成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '操作失败'
            })
          }
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品!'
        })
      }
    },
    exportItemsData() {
      if (this.item_id.length) {
        this.exportData.item_id = Object.assign({}, this.item_id)
        exportItemsData(this.exportData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      } else {
        this.exportData = Object.assign({}, this.params)
        exportItemsData(this.exportData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      }
    },
    exportItemsTagData() {
      if (this.item_id.length) {
        this.exportTagData.item_id = Object.assign({}, this.item_id)
        exportItemsTagData(this.exportTagData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      } else {
        this.exportTagData = Object.assign({}, this.params)
        exportItemsTagData(this.exportTagData).then((res) => {
          if (res.data.data.status == true) {
            this.$message({
              type: 'success',
              message: '已加入执行队列，请在设置-导出列表中下载'
            })
          } else {
            this.$message({
              type: 'error',
              message: '导出失败'
            })
          }
        })
      }
    },
    syncItems() {
      syncItems().then((res) => {
        if (res.data.data.status == true) {
          this.$message({
            type: 'success',
            message: '已加入执行队列'
          })
        } else {
          this.$message({
            type: 'error',
            message: '同步失败'
          })
        }
      })
    },
    searchAction() {
      this.params.page = 1
      if (this.select_regions_value) {
        this.params.regions_id = this.select_regions_value
      }

       
     const category = [...this.select_category_value]
      this.params.category = category.pop()
      if (this.select_tags_value) {
        this.params.tag_id = this.select_tags_value[0]
      }
      this.params.brand_id = this.select_branch_value
      this.getGoodsList()
    },
    onCopy() {
      this.$notify.success({
        message: '复制成功',
        showClose: true
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
          message: '操作成功'
        })
        this.specItems[index].price = this.currentPrice
        this.currentId = -1
        this.currentPrice = ''
      })
    },
    handleClick(tab, event) {
      this.params.page = 1
      if (this.activeName == 'second') {
        this.params.is_warning = true
      } else {
        this.params.is_warning = false
      }
      this.getGoodsList()
    },
    setWarningStore() {
      getItemWarningStore({ store: this.warning_store }).then((res) => {
        this.params.page = 1
        this.getGoodsList()
      })
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getGoodsList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getGoodsList()
    },
    handleChangeTemplates(val) {
      this.currentPage = 1
      this.params.templates_id = val
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
        this.tag.editItem = this.selections.map(v => v.itemName)
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品!'
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
      itemsRelTags(this.tag.form).then((res) => {
        if (res.data.data.status) {
          this.$message({
            type: 'success',
            message: '打标签完成'
          })
          this.getGoodsList()
        }
      }).catch(e => {
        this.getGoodsList()
      })
    },
    tagSearchUserChange() {
      this.currentPage = 1
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
            message: '请选择运费模板'
          })
          return false
        }
        this.addTemplatesdialogVisible = false
        setItemsTemplate({ 'templates_id': this.templates_new_id, 'item_id': this.item_id }).then(
          (response) => {
            this.getGoodsList()
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    editItemsSort(index, row) {
      setItemsSort({ 'sort': row.sort, 'item_id': row.itemId }).then((response) => {
        this.getGoodsList()
      })
    },
    changeCategory() {
      if (this.item_id.length) {
        if (!this.category_id) {
          this.$message({
            type: 'error',
            message: '请选择商品分类'
          })
          return false
        }
        this.addCategorydialogVisible = false
        setItemsCategory({ 'category_id': this.category_id, 'item_id': this.item_id }).then(
          (response) => {
            this.getGoodsList()
            this.category_id = []
          }
        )
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    addItems() {
      // 添加商品
      this.$router.push({ path: this.matchHidePage('editor') })
    },
    addTemplates() {
      if (this.item_id.length) {
        this.addTemplatesdialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    addCategory() {
      if (this.item_id.length) {
        this.addCategorydialogVisible = true
      } else {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
      }
    },
    editItemsAction(index, row, isNew) {
      // 编辑商品弹框
      this.show_rebate_sideBar = false
      this.show_sideBar = false
      this.show_itemStore = false
      if (isNew) {
        var routeData = this.$router.push({
          path: this.matchHidePage('editor/') + row.itemId,
          query: { is_new: true }
        })
      } else {
        var routeData = this.$router.push({ path: this.matchHidePage('editor/') + row.itemId })
      }
    },
    saveRebateConf() {
      var rebateConf = []
      this.rebateSpecItems.forEach((item) => {
        var rebate_conf = item.rebate_conf
        rebate_conf.ratio_type = this.popularizeSetting.popularize_ratio.type
        rebateConf.push(rebate_conf)
      })
      updateItemRebateConf({ rebateConf: JSON.stringify(rebateConf) }).then((res) => {
        this.$message({ message: '保存成功', type: 'success', duration: 2 * 1000 })
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
          message: '保存成功',
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
            for (var key in this.popularizeSetting.popularize_ratio.profit) {
              item.rebate_conf.value[key] = ''
            }
          } else {
            if (
              this.popularizeSetting.popularize_ratio.type != item.rebate_conf.ratio_type &&
              item.rebate_conf.type != 'money'
            ) {
              for (var key in this.popularizeSetting.popularize_ratio.profit) {
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
            message: '更新成功',
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
    goodsSearch() {
      this.params.page = 1
      this.getGoodsList()
    },
    getGoodsList() {
      this.loading = true
      let params = JSON.parse(JSON.stringify(this.params))
      if (params.is_gift == 'all') {
        this.$delete(params, 'is_gift')
      }
      getItemsList(params).then((response) => {
        this.ItemsList = response.data.data.list
        this.ItemsList.forEach((item) => {
          item.price = item.price / 100
          item.market_price = item.market_price / 100
          item.link = `pages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`
        })
        this.total_count = response.data.data.total_count
        this.warning_store = response.data.data.warning_store
        this.loading = false
      })
    },
    deleteItemsAction(index, row) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteItems(row.itemId).then((response) => {
            this.ItemsList.splice(index, 1)
            this.$message({
              message: '删除商品成功',
              type: 'success',
              duration: 2 * 1000
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    priceformatter(row, column) {
      return this.cursymbol + row.price / 100
    },
    rebateformatter(row, column) {
      return this.cursymbol + row.rebate / 100
    },
    getTaskTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    getTimeStr(date) {
      return this.getTaskTime(new Date(parseInt(date) * 1000))
    },
    getShippingTemplatesList() {
      this.loading = true
      getShippingTemplatesList(this.templatesParams).then((response) => {
        this.templatesList = response.data.data.list
      })
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
    getCategory() {
      getCategory({ is_show: false }).then((response) => {
        this.categoryList = response.data.data
        // this.init()
      })
      
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
          message: '请选择至少一个商品'
        })
      }
    },
    batchItemsStatus(status) {
      if (this.goods_id.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择至少一个商品'
        })
        return false
      }
      this.skuLoading = true
      let params = {}
      if (this.goods_id.length > 0) {
        let data = []
        this.goods_id.forEach((goods_id) => {
          data.push({ goods_id: goods_id })
        })
        params = {
          'items': JSON.stringify(data),
          'status': status
        }
      }
      this.submitLoading = true
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getGoodsList()
        }
        this.submitLoading = false
        this.skuLoading = false
      })
    },
    updateItemStatus(items) {
      this.loading = true
      let params = {}
      params = {
        'items': [{ 'goods_id': items.goods_id }],
        'status': items.approve_status === 'instock' ? 'onsale' : 'instock'
      }
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.getGoodsList()
        }
      })
      this.loading = false
    },
    updateItemsStore(items) {
      this.skuLoading = true
      this.item_id = []
      let param = JSON.parse(JSON.stringify(this.params))
      param.item_id = items.item_id
      param.is_sku = true
      this.storeItemsList = []
      getItemsList(param).then((response) => {
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
      let params = {}
      if (this.storeItemsList.length > 0) {
        params = {
          'items': JSON.stringify(this.storeItemsList)
        }
      } else if (this.item_id.length > 0) {
        let data = []
        this.item_id.forEach((itemid) => {
          data.push({ item_id: itemid, store: this.itemstore, is_default: true })
        })
        params = {
          'items': JSON.stringify(data)
        }
      }
      this.submitLoading = true
      const _self = this
      updateItemsStore(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
        }
        this.submitLoading = false
        this.skuLoading = false
        this.storeUpdate = false

        this.getGoodsList()
      })
    }
  },
  mounted() {
    this.init()
  },

  destroyed() {
    console.log(111)
  },
  watch: {
    '$route'(to, from) {
      this.init()
    },
    getStatus(val) {
      if (val) {
        this.getGoodsList()
      }
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
