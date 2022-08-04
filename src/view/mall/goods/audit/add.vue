<template>
  <div class="section section-white">
    <el-form :model="form" label-width="auto" label-position="left" class="demo-ruleForm">
      <template v-if="!isEditor || (isEditor && !form.item_main_cat_id)">
        <el-card v-loading="mainCateLoader" shadow="never" header="选择主分类">
          <el-cascader
            v-model="selectedMainCategory"
            :options="mainCategory"
            style="width: 360px"
            @change="handleCategoryChange"
          />
        </el-card>
      </template>
      <div v-else v-loading="loader" class="content-padded view-flex view-flex-middle">
        <div>主分类：</div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="inline">
          <el-breadcrumb-item v-for="(item, index) in categoryNames" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <template v-if="(!isEditor && selectedMainCategory.length > 0) || isEditor">
        <el-card v-loading="loader" shadow="never">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="panelCollapse('base')"
            >
              <i class="iconfont" :class="panel.base ? 'icon-window-minimize1' : 'icon-plus'" />
            </el-button>
          </div>
          <transition name="el-zoom-in-top">
            <div v-show="panel.base" class="form-collapse">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="*商品标题">
                    <el-input
                      v-model="form.item_name"
                      :maxlength="30"
                      placeholder=""
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="副标题">
                    <el-input
                      v-model="form.brief"
                      :maxlength="30"
                      placeholder=""
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="计量单位">
                    <el-input
                      v-model="form.item_unit"
                      :maxlength="60"
                      placeholder=""
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="排序编号">
                    <el-input v-model="form.sort" placeholder="" :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="产地">
                    <el-cascader
                      v-model="select_regions_value"
                      :disabled="true"
                      placeholder="选择地区"
                      :options="regions"
                      @change="regionChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24">
                  <el-form-item label="*商品图">
                    <div class="pics-box">
                      <ul class="goodspic-wrap">
                        <draggable v-model="form.pics" :options="dragIssuesOptions">
                          <li
                            v-for="(item, index) in form.pics"
                            :key="index"
                            class="goodspic"
                            @mouseenter="picsEnter(index)"
                            @mouseleave="picsLeave"
                          >
                            <img :src="wximageurl + item">
                          </li>
                        </draggable>
                      </ul>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xs="24">
                  <el-form-item label="上传视频">
                    <videoPicker :data="itemVideo" @change="pickVideo" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
        </el-card>
        <el-card v-loading="loader" shadow="never">
          <div slot="header" class="clearfix">
            <span>是否特殊商品类型</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="panelCollapse('goods_type')"
            >
              <i
                class="iconfont"
                :class="panel.goods_type ? 'icon-window-minimize1' : 'icon-plus'"
              />
            </el-button>
          </div>
          <el-radio-group v-model="form.special_type">
            <el-radio label="normal" :disabled="true">
普通商品
</el-radio>
            <el-radio label="drug" :disabled="true">
处方药
</el-radio>
          </el-radio-group>
        </el-card>
        <el-card v-loading="loader" shadow="never">
          <div slot="header" class="clearfix">
            <span>商品参数</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="panelCollapse('param')"
            >
              <i class="iconfont" :class="panel.param ? 'icon-window-minimize1' : 'icon-plus'" />
            </el-button>
          </div>
          <transition name="el-zoom-in-top">
            <div v-show="panel.param" class="form-collapse">
              <el-row :gutter="20">
                <el-col
                  v-for="(item, index) in params"
                  :key="index"
                  :xs="24"
                  :sm="12"
                  :md="8"
                  :lg="6"
                >
                  <el-form-item :label="item.label">
                    <el-select
                      v-if="item.children.length > 0"
                      v-model="form.item_params[index].attribute_value_id"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="child in item.children"
                        :key="child.value"
                        :disabled="true"
                        :label="child.label"
                        :value="child.value"
                      />
                    </el-select>
                    <el-input
                      v-else
                      v-model="form.item_params[index].attribute_value_name"
                      :maxlength="60"
                      placeholder=""
                      :disabled="true"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
        </el-card>
        <el-card v-loading="loader" shadow="never">
          <div slot="header" class="view-flex">
            <div class="view-flex-item">
商品规格
</div>
            <template v-if="!isEditor">
              <span v-if="skus.length === 0" class="small mark"
                >添加多规格商品请先为当前主类目绑定规格!</span
              >
              <template v-if="skus.length > 0">
                <el-switch
                  v-model="form.nospec"
                  style="margin-left: 30px"
                  active-color="#13ce66"
                  inactive-color="#efefef"
                  active-text="统一规格"
                  inactive-text="多规格"
                />
              </template>
            </template>
            <template v-if="!form.nospec">
              <span style="margin-left: 30px">
                <span style="margin-right: 10px">是否在商详页成列图片规格</span>
                <el-switch
                  v-model="form.is_show_specimg"
                  active-color="#13ce66"
                  inactive-color="#efefef"
                />
              </span>
            </template>
          </div>
          <template v-if="form.nospec">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="商品状态" :render-header="renderRequire">
                  <el-select v-model="form.approve_status" placeholder="请选择">
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.title"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="库存">
                  <el-input v-model="form.store" type="number" required min="0" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="商品货号">
                  <el-input v-model="form.item_bn" :maxlength="60" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="重量">
                  <el-input v-model="form.weight" type="number" required min="0" placeholder="">
                    <template slot="append">
kg
</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="体积">
                  <el-input v-model="form.volume" type="number" required min="0" placeholder="">
                    <template slot="append">
m³
</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="销售价">
                  <el-input v-model="form.price" type="number" required min="0" placeholder="">
                    <template slot="prepend">
¥
</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="成本价">
                  <el-input v-model="form.cost_price" type="number" required min="0" placeholder="">
                    <template slot="prepend">
¥
</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="原价">
                  <el-input
                    v-model="form.market_price"
                    type="number"
                    required
                    min="0"
                    placeholder=""
                  >
                    <template slot="prepend">
¥
</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="条形码">
                  <el-input v-model="form.barcode" type="number" required min="0" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <div v-if="specImages.length > 0" class="content-bottom-padded">
              <div class="content-padded h3">
设置规格图片
</div>
              <el-table :data="specImages" :header-cell-style="{ background: '#f5f7fa' }">
                <el-table-column label="规格" prop="item_spec" width="240" />
                <el-table-column label="规格图">
                  <template slot-scope="scope">
                    <imgBox
                      v-for="(item, index) in scope.row.item_image_url"
                      :key="index"
                      :img-url="item"
                      inline
                      remove-btn
                      width="50"
                      height="50"
                      @remove="handleImgRemove(scope.$index, index)"
                    />
                    <imgBox
                      v-if="scope.row.item_image_url.length < 5"
                      width="50"
                      height="50"
                      inline
                      @click="handleSkuImg(scope.$index)"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="content-padded h3">
设置规格
</div>
            <el-table>
              <el-table-column label="*状态">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.approve_status" size="mini" placeholder="请选择">
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.title"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="库存">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.store"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="货号">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.item_bn"
                    :maxlength="60"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="重量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" />
                </template>
              </el-table-column>
              <el-table-column label="体积">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" />
                </template>
              </el-table-column>
              <el-table-column label="销售价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="成本价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.cost_price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.market_price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.barcode"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="fillSku">
填充
</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="specItems[currentPage - 1]"
              :header-cell-style="{ background: '#f5f7fa' }"
              style="width: 100%"
            >
              <el-table-column label="规格值">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.item_spec">
                    {{ item.spec_custom_value_name || item.spec_value_name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="状态" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.approve_status"
                    size="mini"
                    placeholder="请选择"
                    @change="upadateState(scope.row)"
                  >
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.title"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="库存" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.store"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="货号">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.item_bn"
                    :maxlength="60"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.weight"
                    :maxlength="60"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="体积(m³)">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.volume"
                    :maxlength="60"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="销售价" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="成本价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.cost_price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.market_price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.barcode"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
            <div class="content-center content-top-padded">
              <el-pagination
                :current-page="currentPage"
                :page-size="specPagesize"
                layout="prev, pager, next"
                :total="specTotal"
                @current-change="pageChange"
              />
            </div>
          </template>
        </el-card>
        <el-card v-loading="loader" header="图文详情" shadow="never">
          <el-form-item label="模式">
            <el-radio-group v-model="mode">
              <el-radio :label="'richText'">
富文本
</el-radio>
              <el-radio :label="'component'">
组件式
</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="mode === 'richText'">
            <vue-html5-editor :content="form.intro" :height="360" />
          </template>
          <template v-else>
            <richTextEditor
              :data="content"
              :control="['film', 'slider', 'heading', 'writing']"
              @change="handleContent"
            />
          </template>
        </el-card>
        <div class="section-footer with-border content-center">
          <el-button @click.native="handleCancel">
返回
</el-button>
          <el-button
            v-if="form.audit_status == 'processing'"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="dialogVisible = true"
          >
            审核商品
          </el-button>
        </div>
      </template>
    </el-form>
    <el-dialog title="审核商品" :visible.sync="dialogVisible" width="30%">
      <el-form :model="authForm" label-width="80px">
        <el-form-item label="审核状态">
          <el-radio-group v-model="authForm.audit_status">
            <el-radio label="approved">
通过
</el-radio>
            <el-radio label="rejected">
拒绝
</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="authForm.audit_status == 'rejected'" label="拒绝原因">
          <el-input v-model="authForm.audit_reason" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">
确定
</el-button>
          <el-button @click="dialogVisible = false">
取消
</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
// import the component
import Treeselect from '@riophae/vue-treeselect'
import draggable from 'vuedraggable'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getItemsDetail,
  createItems,
  updateItems,
  getCategory,
  getGoodsAttr,
  getCategoryInfo,
  auditItems
} from '@/api/goods'
import { getShippingTemplatesList } from '@/api/shipping'
import { uploadMaterial } from '@/api/wechat'
import imgPicker from '@/components/imageselect'
import videoPicker from '@/components/videoselect'
import richTextEditor from '@/components/function/richTextEditor'
import imgBox from '@/components/element/imgBox'
import district from '@/common/district.json'
export default {
  inject: ['refresh'],
  components: {
    imgPicker,
    videoPicker,
    Treeselect,
    draggable,
    richTextEditor,
    imgBox
  },
  data () {
    return {
      itemVideo: {},
      select_regions_value: [],
      regions: district,
      authForm: {
        audit_status: 'approved',
        audit_reason: ''
      },
      mainCategory: [],
      selectedMainCategory: [],
      categoryNames: [],
      mainCateLoader: false,
      loader: true,
      submitLoading: false,
      isEditor: false,
      isLeave: false,
      panel: {
        base: true,
        param: true,
        goods_type: true
      },
      isGetImage: false,
      imgDialog: false,
      isGetVideo: false,
      statusOption: [
        {
          title: '前台可销售',
          value: 'onsale'
        },
        {
          title: '前台不展示',
          value: 'offline_sale'
        },
        {
          title: '前台仅展示',
          value: 'only_show'
        },
        {
          title: '不可销售',
          value: 'instock'
        }
      ],
      content: [],
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.icon-arrows-alt',
        draggable: '.goodspic'
      },
      form: {
        item_id: '',
        goods_id: '',
        item_type: 'normal',
        special_type: 'normal',
        item_source: 'mall',
        item_category: [],
        item_params: [],
        item_name: '',
        sort: 0,
        item_bn: '',
        brief: '',
        weight: '',
        volume: '',
        price: '',
        market_price: '',
        cost_price: 0,
        barcode: '',
        item_unit: '',
        rebate: '',
        store: '',
        templates_id: '',
        approve_status: 'onsale',
        intro: '',
        pics: [],
        videos: '',
        videos_url: '',
        nospec: true,
        is_show_specimg: false,
        spec_images: [],
        spec_items: [],
        item_main_cat_id: ''
      },
      bulkFilling: [
        {
          item_spec: '批量填充',
          approve_status: '',
          store: '',
          item_bn: '',
          item_unit: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: ''
        }
      ],
      specPagesize: 10,
      specTotal: 0,
      specImages: [],
      specItems: [],
      picsList: [],
      params: [],
      skus: [],
      dialogVisible: false,
      dialogImageUrl: '',
      thumbDialog: false,
      isGetThumb: false,
      isGetPics: false,
      picsDialog: false,
      picsCurrent: -1,
      picsOldLen: 0,
      currentSku: -1,
      currentPage: 1,
      multiple: false,
      mode: 'richText'
    }
  },
  computed: {
    ...mapGetters(['editingSkus'])
  },
  mounted () {
    const _self = this
    async function onload () {
      if (_self.$route.params.id) {
        _self.isEditor = true
        _self.mainCateLoader = true
        // 初始化门店数据
        await getItemsDetail(_self.$route.params.id).then((response) => {
          let itemsDetailData = response.data.data
          if (itemsDetailData.regions_id) {
            _self.select_regions_value = itemsDetailData.regions_id
          }
          _self.form.pics = itemsDetailData.pics
          // 处理图片列表
          var picList = []
          for (var item in itemsDetailData.pics) {
            var newpic = {}
            newpic.url = _self.wximageurl + itemsDetailData.pics[item]
            picList.push(newpic)
          }
          _self.picsList = picList
          let obj = _self.form
          _self.form = { obj } = {
            item_id: itemsDetailData.item_id,
            goods_id: itemsDetailData.goods_id,
            item_source: itemsDetailData.item_source,
            item_type: itemsDetailData.item_type,
            special_type: itemsDetailData.special_type,
            item_category:
              itemsDetailData.item_category.length > 0 ? itemsDetailData.item_category : [],
            item_name: itemsDetailData.item_name,
            sort: itemsDetailData.sort,
            item_bn: itemsDetailData.item_bn,
            brief: itemsDetailData.brief,
            weight: itemsDetailData.weight,
            volume: itemsDetailData.volume,
            price: itemsDetailData.price / 100,
            market_price: itemsDetailData.market_price / 100,
            cost_price: itemsDetailData.cost_price / 100,
            barcode: itemsDetailData.barcode,
            item_unit: itemsDetailData.item_unit,
            rebate: itemsDetailData.rebate / 100,
            store: itemsDetailData.store,
            brand_id: itemsDetailData.brand_id,
            templates_id: itemsDetailData.templates_id
              ? itemsDetailData.templates_id.toString()
              : '',
            approve_status: itemsDetailData.approve_status,
            pics: itemsDetailData.pics,
            videos: itemsDetailData.videos,
            videos_url: itemsDetailData.videos_url,
            nospec: itemsDetailData.nospec,
            is_show_specimg: itemsDetailData.is_show_specimg,
            item_params: itemsDetailData.item_params,
            item_main_cat_id: itemsDetailData.item_main_cat_id
          }
          _self.picsOldLen = _self.form.pics.length
          if (!itemsDetailData.item_main_cat_id) {
            _self.fetchMainCate()
          } else {
            let category = itemsDetailData.item_category_main
            _self.categoryNames = [
              category[0].category_name,
              category[0].children[0].category_name,
              category[0].children[0].children[0].category_name
            ]
            _self.generateParams(itemsDetailData.item_params_list)
          }
          if (!_self.form.nospec) {
            _self.generateSpec(itemsDetailData.item_spec_list)
            _self.specImages = itemsDetailData.spec_images
            itemsDetailData.spec_items.forEach((item) => {
              item.item_spec.forEach((child) => {
                let checkedIndex = _self.skus.findIndex((n) => child.spec_id === n.sku_id)
                let isin = _self.skus[checkedIndex].checked_sku.findIndex(
                  (k) => child.spec_value_id === k
                )
                if (isin === -1) {
                  _self.skus[checkedIndex].checked_sku.push(child.spec_value_id)
                }
              })
            })

            itemsDetailData.spec_items.forEach((item) => {
              let sku = Object.assign({}, item)
              sku.market_price = item.market_price / 100
              sku.cost_price = item.cost_price / 100
              sku.price = item.price / 100
              sku.item_bn = item.item_bn
              let itemId = []
              let specs = []
              item.item_spec.forEach((sub) => {
                specs.push({
                  spec_id: sub.spec_id,
                  spec_value_id: sub.spec_value_id,
                  spec_value_name: sub.spec_value_name,
                  spec_custom_value_name: sub.spec_custom_value_name || ''
                })
                itemId.push(sub.spec_value_id)
              })
              sku.item_spec = specs
              itemId = itemId.join('_')
              Object.assign(sku, { sku_id: itemId })
              store.dispatch('setSku', sku)
            })
            _self.updateSku()
          }
          if (typeof itemsDetailData.intro === 'object') {
            _self.mode = 'component'
            _self.content = itemsDetailData.intro
          } else {
            _self.form.intro = itemsDetailData.intro
          }
        })
        // .catch(error => {
        //   _self.$router.go(-1)
        // })
        _self.loader = false
        _self.itemVideo = { media_id: _self.form.videos, url: _self.form.videos_url }
      } else {
        _self.fetchMainCate()
        _self.loader = false
      }
    }
    onload()
  },
  methods: {
    regionChange () {
      this.form.regions_id = this.select_regions_value
      this.form.item_address_province = this.select_regions_value[0]
      this.form.item_address_city = this.select_regions_value[1]
    },
    fetchMainCate () {
      getCategory({ is_main_category: true }).then((res) => {
        let list = []
        res.data.data.forEach((item) => {
          let obj = {
            label: item.category_name,
            value: item.category_id,
            children: []
          }
          if (item.children.length > 0) {
            item.children.forEach((child) => {
              let childObj = {
                label: child.category_name,
                value: child.category_id,
                children: []
              }
              obj.children.push(childObj)
              if (child.children.length > 0) {
                child.children.forEach((sub) => {
                  let subObj = {
                    label: sub.category_name,
                    value: sub.category_id
                  }
                  childObj.children.push(subObj)
                })
              }
            })
          }
          list.push(obj)
        })
        this.mainCategory = list
        this.mainCateLoader = false
      })
    },
    handleCategoryChange (val) {
      getCategoryInfo(val[val.length - 1]).then((res) => {
        let detail = res.data.data
        this.generateParams(detail.goods_params)
        this.generateSpec(detail.goods_spec)
      })
    },
    generateParams (data) {
      let params = []
      let formParams = []
      data.forEach((item) => {
        let key = {
          value: item.attribute_id,
          label: item.attribute_name,
          children: []
        }
        item.attribute_values.list.forEach((child) => {
          let val = {
            value: child.attribute_value_id,
            label: child.attribute_value
          }
          key.children.push(val)
        })
        params.push(key)
        let selected = this.form.item_params.find((n) => item.attribute_id === n.attribute_id)
        formParams.push({
          attribute_id: item.attribute_id,
          attribute_value_id: selected ? selected.attribute_value_id : '',
          attribute_value_name: selected ? selected.attribute_value_name : ''
        })
      })
      this.params = params
      this.form.item_params = formParams
    },
    handleSkuName (val, id) {
      this.specItems.forEach((item) => {
        item.forEach((child) => {
          if (child.sku_id.indexOf(id) !== -1) {
            child.item_spec[0].spec_custom_value_name = val
            store.dispatch('setSku', child)
            this.updateSku()
          }
        })
      })
    },
    generateSpec (data) {
      let skus = []
      data.forEach((item) => {
        let specs = []
        item.attribute_values.list.forEach((spec) => {
          if (!spec.custom_attribute_value) {
            Object.assign(spec, { custom_attribute_value: spec.attribute_value })
          }
          specs.push(spec)
        })
        let sku = {
          sku_id: item.attribute_id,
          sku_name: item.attribute_name,
          is_image: item.is_image,
          sku_value: specs,
          checked_sku: []
        }
        skus.push(sku)
      })
      this.skus = skus
    },
    upadateState (data) {
      store.dispatch('setSku', data)
    },
    panelCollapse (name) {
      this.panel[name] = !this.panel[name]
    },
    handleImgRemove (parent, index) {
      this.specImages[parent].item_image_url.splice(index, 1)
    },
    onSubmit () {
      this.authForm.goods_id = this.form.goods_id
      auditItems(this.authForm).then((res) => {
        this.$message({ type: 'success', message: '保存成功' })
        this.dialogVisible = false
        this.$router.go(-1)
      })
    },
    updateContent: function (data) {
      this.form.intro = data
    },
    handleCancel: function () {
      this.$router.go(-1)
    },
    pageChange (val) {
      this.currentPage = val
    },
    // 详情中的上传图片
    addImgPreview: function () {
      this.thumbDialog = true
      this.isGetThumb = true
    },
    closeThumbDialog: function () {
      this.thumbDialog = false
    },
    //品牌LOGO
    handleImgChange () {
      this.imgDialog = true
      this.isGetImage = true
    },
    closeImgDialog () {
      this.imgDialog = false
    },
    //视频
    pickVideo (data) {
      this.form.videos = data.media_id
      this.form.videos_url = data.url
    },
    //上传商品图（9张）
    handlePicsChange: function () {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
    },
    handleSkuImg (index) {
      this.currentSku = index
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
    },
    pickPics (data) {
      if (this.currentSku === -1) {
        if (this.picsOldLen + data.length >= 10) {
          this.$message.error('最多上传9张图片!')
          return false
        } else {
          if (data.length != 0) {
            data.forEach((data) => {
              if (data && data.url !== '') {
                this.form.pics.push(data.url)
                this.picsOldLen = this.form.pics.length
              }
            })
          }
        }
      } else {
        if (this.specImages[this.currentSku].item_image_url.length + data.length > 5) {
          this.$message.error('最多添加5张图片!')
          return false
        }
        if (data.length > 0) {
          data.forEach((data) => {
            if (data && data.url !== '') {
              this.specImages[this.currentSku].item_image_url.push(data.url)
            }
          })
        }
        this.currentSku = -1
      }
      this.picsDialog = false
    },
    fillSku () {
      let obj = { ...this.bulkFilling[0] }
      let newObj = {}
      for (let key in obj) {
        if (obj[key] && key !== 'item_spec') {
          newObj[key] = obj[key]
        }
      }
      let list = [...this.specItems[this.currentPage - 1]]
      list.forEach((item) => {
        Object.assign(item, newObj)
      })
      store.dispatch('setPage', list)
    },
    clearSku (index) {
      this.$confirm('确定清除当前规格的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let skuItem = this.specItems[this.currentPage - 1][index]
        store.dispatch('removeSku', skuItem)
        for (let key in skuItem) {
          if (key !== 'item_spec') {
            if (key !== 'sku_id') {
              skuItem[key] = ''
            }
          }
        }
      })
    },
    closePicsDialog () {
      this.picsDialog = false
    },
    picsEnter (index) {
      this.picsCurrent = index
    },
    picsLeave () {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.form.pics.splice(index, 1)
      this.picsOldLen = this.form.pics.length
    },
    handleSkuChange () {
      this.updateSku()
    },
    updateSku () {
      let arr = []
      let skus = []
      this.skus.forEach((item) => {
        if (item.checked_sku.length > 0) {
          arr.push(item)
        }
      })
      if (arr.length === 0) return
      let n = arr.findIndex((item) => JSON.parse(item.is_image))
      if (n != -1) {
        let obj = { ...arr[n] }
        let imgs = []
        let addedImg = this.specImages
        obj.checked_sku.forEach((item) => {
          let added = addedImg.find((n) => n.spec_value_id === item)
          let img = {
            spec_value_id: item,
            item_spec: this.getSkuName(item, obj.sku_value),
            item_image_url: added ? added.item_image_url : []
          }
          imgs.push(img)
        })
        this.specImages = imgs
        arr.splice(n, 1)
        arr.unshift(obj)
      }
      arr.forEach((item) => {
        let skuGroup = []
        if (item.checked_sku.length > 0) {
          item.checked_sku.forEach((checked) => {
            let issue = item.sku_value.find((sku) => sku.attribute_value_id === checked)
            let obj = {
              spec_id: item.sku_id,
              spec_value_id: issue.attribute_value_id,
              spec_value_name: issue.attribute_value,
              spec_custom_value_name: issue.custom_attribute_value || ''
            }
            skuGroup.push(obj)
          })
          skus.push(skuGroup)
        }
      })
      let allSku = this.generateSkus(skus)
      if (this.skus.length > 1 && !allSku[0].length) {
        return false
      }
      let skuList = []
      allSku.forEach((item) => {
        let obj = {
          is_default: false,
          sku_id: this.generateSkuids(item),
          item_spec: item.length ? item : [item],
          approve_status: '',
          store: '',
          item_bn: '',
          item_unit: '',
          weight: '',
          volume: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: ''
        }
        skuList.push(obj)
      })
      if (this.editingSkus.length > 0) {
        this.editingSkus.forEach((item) => {
          let in_item = skuList.find((n) => item.sku_id === n.sku_id)
          if (!in_item) {
            store.dispatch('removeSku', item)
          }
        })
      }

      this.specTotal = skuList.length
      let list = []
      let len = Math.ceil(skuList.length / this.specPagesize)
      for (let i = 0; i < len; i++) {
        let childs = skuList.slice(i * this.specPagesize, i * this.specPagesize + this.specPagesize)
        list.push(childs)
      }
      if (this.editingSkus.length > 0) {
        list.forEach((item) => {
          item.forEach((child) => {
            let in_sku = this.editingSkus.find((editor) => editor.sku_id === child.sku_id)
            if (in_sku) {
              Object.assign(child, in_sku)
            }
          })
        })
      }
      this.specItems = list
    },
    getSkuName (id, skus) {
      let sku = skus.find((item) => id === item.attribute_value_id)
      if (sku) {
        return sku.attribute_value
      }
    },
    generateSkuids (data) {
      if (data.length) {
        let skuIds = []
        data.forEach((child) => {
          skuIds.push(child.spec_value_id)
        })
        return skuIds.join('_')
      } else {
        return data.spec_value_id
      }
    },
    generateSkus (data) {
      let len = data.length
      if (len >= 2) {
        let len1 = data[0].length
        let len2 = data[1].length
        let newlen = len1 * len2
        let temp = new Array(newlen)
        let index = 0
        for (let i = 0; i < len1; i++) {
          for (let j = 0; j < len2; j++) {
            if (Array.isArray(data[0][i])) {
              temp[index] = [...data[0][i], data[1][j]]
            } else {
              temp[index] = [data[0][i], data[1][j]]
            }
            index++
          }
        }
        let newArray = new Array(len - 1)
        for (let i = 2; i < len; i++) {
          newArray[i - 1] = data[i]
        }
        newArray[0] = temp
        return this.generateSkus(newArray)
      } else {
        return data[0]
      }
    },
    renderRequire (h, { column }) {
      return h(
        'span',
        {
          class: 'mark'
        },
        '*' + column.label
      )
    },
    handleContent (data) {
      this.content = data
    },
    deleteVideo () {
      this.itemVideo = {}
      this.form.videos = ''
      this.form.videos_url = ''
    }
  }
}
</script>
<style scoped lang="scss">
.vue-treeselect__placeholder {
  line-height: 40px;
}
</style>
<style scoped lang="scss">
.fallback-class {
  width: 118px;
  height: 118px;
}
.chosen-class {
  position: relative;
  height: 118px;
  text-align: center;
  .svg-icon {
    width: 26px;
    height: 26px;
  }
  &::after {
    position: absolute;
    top: 0;
    left: 118px;
    right: 118px;
    bottom: 0;
    background: #ffb28b;
    box-shadow: inset 0 0 0 2px #ff5000;
    content: '';
  }
}
.sku-value {
  margin-right: 10px;
}
.sku-img {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 5px;
  vertical-align: middle;
}
.sku-img-pick {
  color: #999;
  cursor: pointer;
}
.avatar-uploader-icon {
  font-size: 48px;
}
.sku-select__item {
  display: flex;
  position: relative;
}
.sku-select__checkgroup {
  padding-left: 20px;
  flex: 1;
}
.sku-select__checkitem {
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
}
.sku-remove__icon {
  position: absolute;
  width: 30px;
  height: 30px;
  top: -20px;
  right: -20px;
  background: #ff5000;
  line-height: 30px;
  text-align: center;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}
.sku-tip {
  padding-left: 10px;
  font-size: 12px;
  color: #999;
}

.pics-box {
  overflow: hidden;
  .goodspic-wrap {
    float: left;
    margin-right: 5px;
    overflow: hidden;
    .goodspic {
      position: relative;
      float: left;
      width: 120px;
      height: 120px;
      margin: 0 5px 10px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
      .goodspic-mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        cursor: pointer;
        &.on {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .iconfont {
          margin: 0 8px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .upload-box {
    display: inline-block;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    .iconfont {
      font-size: 30px;
      color: #ccc;
    }
  }
}

.tpl_item {
  display: inline-block;
  border: 1px solid #ddd;
  background-color: #fff;
  text-align: left;
  padding: 0 15px;
  line-height: 36px;
  cursor: pointer;
  border-radius: 3px;
  .iconfont {
    margin-right: 5px;
  }
}

.tpl_item .fa {
  width: 12px;
  height: 22px;
  vertical-align: middle;
  display: inline-block;
  margin-right: 1em;
  font-size: 20px;
  text-align: center;
}

.vue-html5-editor {
  vertical-align: top;
  display: inline-block;
}

.demo-ruleForm {
  .vue-html5-editor {
    width: 80%;
  }
}
</style>
