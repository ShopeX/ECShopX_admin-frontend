<template>
  <div class="section section-white section_add">
    <el-form ref="form" :model="form" label-width="110px"  class="demo-ruleForm">
      <template v-if="!isEditor || (isEditor && !form.item_main_cat_id)">
        <el-card shadow="never" header="选择主类目" v-loading="mainCateLoader">
          <el-cascader
            :options="mainCategory"
            v-model="selectedMainCategory"
            @change="handleCategoryChange"
            style="width: 360px;">
          </el-cascader>
        </el-card>
      </template>
      <div class="content-padded view-flex view-flex-middle" v-loading="loader" v-else>
        <div>主类目：</div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="inline">
          <el-breadcrumb-item v-for="(item, index) in categoryNames" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <template v-if="(!isEditor && selectedMainCategory.length > 0) || isEditor">
        <el-card shadow="never" v-loading="loader">
          <div slot="header" class="clearfix">
            <span>基础信息</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="panelCollapse('base')"><i class="iconfont" :class="panel.base ? 'icon-window-minimize1': 'icon-plus'"></i></el-button>
          </div>
          <transition name="el-zoom-in-top">
            <div class="form-collapse" v-show="panel.base">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="* 商品标题">
                    <el-input v-model="form.item_name" :maxlength="100" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="副标题">
                    <el-input v-model="form.brief" :maxlength="30" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="外文标题">
                    <el-input v-model="form.item_en_name" :maxlength="100" placeholder=""></el-input>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="* 运费模板">
                    <el-select v-model="form.templates_id" placeholder="请选择" class="wid100">
                      <el-option v-for="item in templatesList" :key="item.template_id" :label="item.name" :value="item.template_id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="* 品牌" >
                    <el-select
                      class="wid100"
                      v-model="form.brand_id"
                      remote
                      filterable
                      :remote-method="getBrandList"
                      clearable
                      placeholder="请选择">
                      <el-option
                        v-for="item in brandList"
                        :key="item.attribute_id"
                        :label="item.attribute_name"
                        :value="item.attribute_id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="计量单位">
                    <el-input v-model="form.item_unit" :maxlength="60" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="排序编号">
                    <el-input v-model="form.sort" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="产地">
                    <el-cascader
                      class="wid100"
                      placeholder="选择地区"
                      :options="regions"
                      v-model='select_regions_value'
                      @change="regionChange">
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="商品税率">
                    <el-input v-model="form.tax_rate" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='8'>
                  <el-form-item label="是否开启分润">
                    <el-switch
                     v-model="form.is_profit"
                     active-color="#13ce66"
                     inactive-color="#ff4949" @change="profitStatusChange">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span='8' v-if="form.type != 1">
                  <el-form-item label="是否套装商品">
                    <el-switch
                     v-model="form.is_package_items"
                     active-color="#13ce66"
                     inactive-color="#ff4949" @change="packageItemsChange">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span='8' v-if="form.type != 1">
                  <el-form-item label="* 是否为赠品">
                    <el-switch
                     v-model="form.is_gift"
                     active-color="#13ce66"
                     inactive-color="#ff4949" @change="giftStatusChange">
                    </el-switch>
                    <el-alert title="开启后前台不可购买" type="info" :closable="false" style="height:30px" show-icon></el-alert>
                  </el-form-item>
                </el-col>
                <el-col :span='16'>
                  <el-form-item label="* 商品分类">
                    <treeselect
                      :options="categoryList"
                      :show-count="true"
                      :multiple="true"
                      :disable-branch-nodes="true"
                      v-model="form.item_category"
                    >
                    </treeselect>
                  </el-form-item>
                </el-col>



                <el-col :xs="24">
                  <el-form-item label="* 商品图">
                    <div>
                      <div class="pics-box">
                        <ul class="goodspic-wrap">
                          <draggable v-model="form.pics" :options="dragIssuesOptions" @update="dragEnd" style="position:'relative'">
                            <li v-for="(item, index) in form.pics" :key='index' class="goodspic" @mouseenter="picsEnter(index)" @mouseleave="picsLeave">
                              <img :src="wximageurl + item" />
                              <div class="goodspic-mask" :class="(picsCurrent == index) ? 'on' : ''">
                                <div class="iconfont icon-trash-alt" @click="removePicsImg(index)"></div>
                                <div class="iconfont icon-arrows-alt"></div>
                              </div>
                              <el-checkbox class='checkBox' v-model="form.pics_create_qrcode[index]"></el-checkbox>
                            </li>
                            <div v-if="form.pics.length < 9" class="upload-box" @click="handlePicsChange">
                              <i class="iconfont icon-camera"></i>
                            </div>
                            <el-form-item label="是否生成分享码" class="allCheck" style="top: 123px;font-size:12px;line-height: 20px;">
                              <div @click.stop.prevent="isAllCheckChange">
                                <el-checkbox :value="isAllCheck">全选</el-checkbox>
                              </div>
                            </el-form-item>
                          </draggable>
                        </ul>
                      </div>
                      <div class="frm-tips">
                        <p>1. 最多可上传9个图片，文件格式为bmp、png、jpeg、jpg或gif，大小不超过2M（建议尺寸：500px * 500px）</p>
                        <p>2. 拖动图片进行可排序</p>
                        <p>3. 相册图朋友圈分享是否生成小程序码</p>
                      </div>

                    </div>
                    <imgPicker :dialog-visible="picsDialog" :sc-status="isGetPics" :is-most="multiple" @chooseImg="pickPics" @closeImgDialog="closePicsDialog"></imgPicker>
                  </el-form-item>
                </el-col>
                <el-col :xs="24">
                  <el-form-item label="上传视频">
                    <videoPicker :data="itemVideo" @change="pickVideo"></videoPicker>
                    <el-button v-if="itemVideo.media_id" @click="deleteVideo" type="text">删除</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
        </el-card>
        <!-- <el-card shadow="never" v-loading="loader">
          <div slot="header" class="clearfix">
            <span>是否特殊商品类型</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="panelCollapse('goods_type')"><i class="iconfont" :class="panel.goods_type ? 'icon-window-minimize1': 'icon-plus'"></i></el-button>
          </div>
          <el-radio-group v-model="form.special_type">
            <el-radio label="normal">普通商品</el-radio>
            <el-radio label="drug">处方药</el-radio>
          </el-radio-group>
        </el-card> -->
        <el-card shadow="never" v-loading="loader">
          <div slot="header" class="clearfix">
            <span>商品参数</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="panelCollapse('param')"><i class="iconfont" :class="panel.param ? 'icon-window-minimize1': 'icon-plus'"></i></el-button>
          </div>
          <transition name="el-zoom-in-top">
            <div class="form-collapse" v-show="panel.param">
              <el-row :gutter="20">
                <el-col :md="8" v-for="(item, index) in params" :key="index">
                  <el-form-item :label="item.label">
                    <el-select v-if="item.children.length > 0" v-model="form.item_params[index].attribute_value_id" placeholder="请选择" @change="paramsChange">
                      <el-option
                        v-for="child in item.children"
                        :key="child.value"
                        :label="child.label"
                        :value="child.value">
                      </el-option>
                    </el-select>
                    <el-input v-else v-model="form.item_params[index].attribute_value_name" :maxlength="60" placeholder=""></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
        </el-card>
        <el-card shadow="never" v-loading="loader">
          <div slot="header" class="view-flex">
            <div class="view-flex-item">商品规格</div>
            <template v-if="!isEditor">
              <span class="small mark" v-if="skus.length === 0">添加多规格商品请先为当前主类目绑定规格!</span>
              <template v-if="skus.length > 0">
                <el-switch
                  style="margin-left: 30px;"
                  v-model="form.nospec"
                  active-color="#13ce66"
                  inactive-color="#efefef"
                  active-text="统一规格"
                  inactive-text="多规格">
                </el-switch>
              </template>
            </template>
            <template v-if="!form.nospec">
              <span style="margin-left: 30px;">
                <span style="margin-right: 10px;">是否在商详页成列图片规格</span>
                <el-switch
                  v-model="form.is_show_specimg"
                  active-color="#13ce66"
                  inactive-color="#efefef">
                </el-switch>
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
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" v-if="!form.is_package_items">
                <el-form-item label="库存">
                  <el-input type="number" required min="0" v-model="form.store" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="商品货号">
                  <el-input v-model="form.item_bn" :maxlength="60" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="重量">
                  <el-input type="number" required min="0" v-model="form.weight" placeholder=""><template slot="append">kg</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="体积">
                  <el-input type="number" required min="0" v-model="form.volume" placeholder=""><template slot="append">m³</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="销售价">
                  <el-input type="number" required min="0" v-model="form.price" placeholder=""><template slot="prepend">¥</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="成本价">
                  <el-input type="number" required min="0" v-model="form.cost_price" placeholder=""><template slot="prepend">¥</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="原价">
                  <el-input type="number" required min="0" v-model="form.market_price" placeholder=""><template slot="prepend">¥</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="条形码">
                  <el-input required min="0" v-model="form.barcode" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" v-if="form.point_access == 'items'">
                <el-form-item label="获取积分">
                  <el-input type="number" required min="0" v-model="form.point_num" placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else >
            <el-card v-for="(item, index) in skus" :key="index">
              <div class="sku-select__item">
                <div class="goods">
                  {{item.sku_name}}：
                </div>
                <div class="sku-select__checkgroup">
                  <el-checkbox-group v-model="item.checked_sku" @change="handleSkuChange">
                    <template v-for="(value, vn) in item.sku_value" >
                      <div class="sku-select__checkitem" :key="vn">
                        <imgBox v-if="value.image_url" :imgUrl="value.image_url" width="50" height="50" />
                        <el-checkbox :label="value.attribute_value_id">
                          <el-input v-if="item.checked_sku.indexOf(value.attribute_value_id) !== -1" v-model="value.custom_attribute_value" size="mini" style="width: 100px;" @change="handleSkuName(value.custom_attribute_value, value.attribute_value_id)"></el-input>
                          <span v-else>{{value.attribute_value}}</span>
                        </el-checkbox>
                      </div>
                    </template>
                  </el-checkbox-group>
                </div>
              </div>
            </el-card>
            <div v-if="specImages.length > 0" class="content-bottom-padded">
              <div class="content-padded h3">设置规格图片</div>
              <el-table
                :data="specImages"
                :header-cell-style="{background:'#f5f7fa'}">
                <el-table-column label="规格" prop="item_spec" width="240">
                </el-table-column>
                <el-table-column label="规格图">
                  <template slot-scope="scope">
                    <imgBox v-for="(item, index) in scope.row.item_image_url" :key="index" :imgUrl="item" inline removeBtn width="50" height="50" @remove="handleImgRemove(scope.$index, index)"></imgBox>
                    <imgBox v-if="scope.row.item_image_url.length < 5" width="50" height="50" inline @click="handleSkuImg(scope.$index)"></imgBox>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="content-padded h3">设置规格</div>
            <el-table
              :data="bulkFilling"
              :show-header="false"
              :highlight-current-row="false">
              <el-table-column>
                <template slot-scope="scope">
                  {{scope.row.custom_attribute_value || scope.row.item_spec}}
                </template>
              </el-table-column>
              <el-table-column label="*状态">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.approve_status" size="mini" placeholder="请选择">
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.title"
                      size="mini"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="库存"  v-if="!form.is_package_items">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.store" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="货号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="重量">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="体积">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="销售价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.price" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="成本价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.cost_price" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.market_price" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.barcode" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column label="获取积分" v-if="form.point_access == 'items'">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.point_num" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-button type="primary" @click="fillSku" size="mini">填充</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="specItems[currentPage-1]"
              :header-cell-style="{background:'#f5f7fa'}"
              style="width: 100%">
              <el-table-column label="规格值">
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.item_spec" :key="index">
                    {{item.spec_custom_value_name || item.spec_value_name}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="状态" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.approve_status" size="mini" placeholder="请选择" @change="upadateState(scope.row)">
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="item.title"
                      size="mini"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="库存"  v-if="!form.is_package_items" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.store" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="货号">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="重量(kg)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="体积(m³)">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="销售价" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.price" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="成本价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.cost_price" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="原价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.market_price" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="条形码">
                <template slot-scope="scope">
<!--                  <el-input type="number" required min="0" v-model="scope.row.barcode" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>-->
                  <el-input :maxlength="6000" v-model="scope.row.barcode" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="获取积分" v-if="form.point_access == 'items'">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.point_num" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
                </template>
              </el-table-column>
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="clearSku(scope.$index)">清除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="content-center content-top-padded">
              <el-pagination
                :current-page="currentPage"
                :page-size="specPagesize"
                layout="prev, pager, next"
                @current-change="pageChange"
                :total="specTotal">
              </el-pagination>
            </div>
          </template>
        </el-card>

        <el-card v-if="form.type===1" header="跨境参数" shadow="never" v-loading="loader">
          <el-row style="margin-bottom:0px;" >
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="商品税率">
                <el-input type="number" :step="0.1" :min="0" :max="100" v-model="form.crossborder_tax_rate" :controls="false" :precision="2"><template slot="append">%</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-bottom:0px;" >
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="产地国家">
                <el-select v-model="form.origincountry_id" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in origincountry"
                    :key="item.origincountry_id"
                    :label="item.origincountry_name"
                    :value="item.origincountry_id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-bottom:0px;" >
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="税费策略">
                <el-select v-model="form.taxstrategy_id" filterable clearable placeholder="请选择">
                  <el-option
                    v-for="item in taxstrategy"
                    :key="item.id"
                    :label="item.taxstrategy_name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row style="margin-bottom:0px;" >
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item v-if="form.taxstrategy_id !== '0'" label="单位份数">
                <el-input type="number"  min="1" v-model="form.taxation_num"  :controls="false"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-card>

        <el-card header="TDK设置" shadow="never" v-loading="loader" class="TDK_SET">
          <el-form-item label="TITLE（页面标题）" label-width="150px">
            <el-input type="text" v-model="tdk_info.title"></el-input>
          </el-form-item>
          <el-form-item label="MATE_DESCRIPTION（页面描述）" label-width="150px">
            <el-input type="textarea" v-model="tdk_info.mate_description"></el-input>
          </el-form-item>
          <el-form-item label="MATE_KEYWORDS（关键词）" label-width="150px">
            <el-input type="textarea" v-model="tdk_info.mate_keywords"></el-input>
            <span class="tip">关键词之间请用半角”,”分隔</span>
          </el-form-item>
        </el-card>

        <el-card header="图文详情" shadow="never" v-loading="loader">
          <el-form-item label="模式" label-width="50px">
            <el-radio-group v-model="mode">
              <el-radio :label="'richText'">富文本</el-radio>
              <el-radio :label="'component'">组件式</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="mode === 'richText'">
            <vue-html5-editor :content="form.intro.toString()" ref="editor" @change="updateContent" :height="360"></vue-html5-editor>
            <span class="tpl_item img" @click="addImgPreview" style="">
              <i class="iconfont icon-image"></i>图片
            </span>
          </template>
          <template v-else>
            <richTextEditor :data="content" :control="['film','slider','heading','writing']" @change="handleContent"/>
          </template>
          <imgPicker :dialog-visible="thumbDialog" :sc-status="isGetThumb" :isMost="true" @chooseImg="pickThumb" @closeImgDialog="closeThumbDialog"></imgPicker>
        </el-card>
        <div class="section-footer with-border content-center">
          <el-button @click.native="handleCancel">取消</el-button>
          <el-button type="primary" @click="submitItemsActionConfirm" :loading="submitLoading">{{submitLoading ? '提交中' : '保存'}}</el-button>
        </div>
      </template>
    </el-form>
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
  import { getItemsDetail, createItems, updateItems, getCategory, getGoodsAttr, getCategoryInfo } from '@/api/goods'
  import { getShippingTemplatesList } from '@/api/shipping'
  import { uploadMaterial } from '@/api/wechat'
  import imgPicker from '@/components/imageselect'
  import videoPicker from '@/components/videoselect'
  import richTextEditor from '@/components/function/richTextEditor'
  import imgBox from '@/components/element/imgBox'
  import district from '@/common/district.json'
  import {getOrigincountry, getTaxstrategyList} from '../../../../api/crossborder'
  import {getPointRule} from '../../../../api/promotions'

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
    data() {
      return {
        // 跨境设置
        origincountry: [],    // 产地国
        taxstrategy: [],    // 税费策略
        isGift: false,
        itemVideo: {},
        select_regions_value: [],
        regions: district,
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
          goods_type: true,
        },
        is_new: false,
        isGetImage: false,
        imgDialog: false,
        isGetVideo: false,
        statusOption: [
          {
            title: '前台可销售',
            value: 'onsale'
          },
          {
            title: '可线下销售',
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
        categoryList: [],
        brandList: [],
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
          item_type: 'normal',
          special_type: 'normal',
          item_source: 'mall',
          item_category: [],
          item_params: [],
          item_name: '',
          sort: 0,
          tax_rate: 0,
          item_bn: '',
          brief: '',
          // item_en_name: '',
          weight: '',
          volume: '',
          price: '',
          market_price: '',
          cost_price: 0,
          barcode: '',
          item_unit: '',
          rebate: '',
          store: '',
          brand_id: '',
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
          item_main_cat_id: '',
          is_gift: false,
          crossborder_tax_rate: '',
          origincountry_id: 0,
          taxstrategy_id: '0',
          taxation_num: 1,
          type: 0,
          is_profit: true,
          point_access: 'order',
          point_num: 0,
          is_package_items: false,
          tdk_content: '',
          // 分享小程序码数组
          pics_create_qrcode: []
        },
        tdk_info: {
          title: '',
          mate_description: '',
          mate_keywords: ''
        },
        bulkFilling: [{
          item_spec: '批量填充',
          approve_status: '',
          store: '',
          item_bn: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: ''
        }],
        specPagesize: 10,
        specTotal: 0,
        specImages: [],
        specItems: [],
        templatesList: [],
        picsList: [],
        params: [],
        skus: [],
        templatesListParams: {
          page: 1,
          pageSize: 99
        },
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
      ...mapGetters([
        'editingSkus'
      ]),
      isAllCheck ({ form }) {
        const { pics_create_qrcode } = form
        const isNotAll = pics_create_qrcode.some(item => !item)
        return !isNotAll
      }
    },
    methods: {
      // 获取产地国
      getOrigincountry () {
        let where = {page: 1, pageSize: 99999}
        if (this.form.type === 1) {
          getOrigincountry(where).then(res => {
            this.origincountry = res.data.data.list
            this.getTaxstrategyList()
          })
        }
      },
      // 获取税费策略
      getTaxstrategyList () {
        let where = {page: 1, pageSize: 99999}
        if (this.form.type === 1) {
          getTaxstrategyList(where).then(res => {
            let listData = res.data.data.list
            listData.push({
              id: '0',
              taxstrategy_name: '不使用策略',
              created: '0',
              updated: '0'
            })
            this.taxstrategy = listData
          })
        }
      },
      regionChange() {
        this.form.regions_id = this.select_regions_value
        this.form.item_address_province = this.select_regions_value[0]
        this.form.item_address_city = this.select_regions_value[1]
        
      },
      fetchMainCate() {
        getCategory({is_main_category: true}).then(res => {
          let list = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.category_name,
              value: item.category_id,
              children: []
            }
            if (item.children.length > 0) {
              item.children.forEach(child => {
                let childObj = {
                  label: child.category_name,
                  value: child.category_id,
                  children: []
                }
                obj.children.push(childObj)
                if (child.children.length > 0) {
                  child.children.forEach(sub => {
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
      handleCategoryChange(val) {
        getCategoryInfo(val[val.length-1]).then(res => {
          let detail = res.data.data
          this.generateParams(detail.goods_params)
          this.generateSpec(detail.goods_spec)
        })
      },
      generateParams(data) {
        let params = []
        let formParams = []
        data.forEach(item => {
          let key = {
            value: item.attribute_id,
            label: item.attribute_name,
            children: []
          }
          item.attribute_values.list.forEach(child => {
            let val = {
              value: child.attribute_value_id,
              label: child.attribute_value
            }
            key.children.push(val)
          })
          params.push(key)
          let selected = this.form.item_params.find(n => item.attribute_id === n.attribute_id)
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
        this.specItems.forEach(item => {
          item.forEach(child => {
            if (child.sku_id.indexOf(id) !== -1) {
              child.item_spec[0].spec_custom_value_name = val
              store.dispatch('setSku', child)
              this.updateSku()
            }
          })
        })
      },
      generateSpec(data) {
        let skus = []
        data.forEach(item => {
          let specs = []
          item.attribute_values.list.forEach(spec => {
            if (!spec.custom_attribute_value) {
              Object.assign(spec, {custom_attribute_value: spec.attribute_value})
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
      upadateState(data) {
        store.dispatch('setSku', data)
      },
      panelCollapse(name) {
        this.panel[name] = !this.panel[name]
      },
      handleImgRemove(parent, index) {
        this.specImages[parent].item_image_url.splice(index, 1)
      },
      submitItemsAction: function () { // 提交商品
        if (+this.form.market_price < +this.form.rebate) {
          this.$confirm('当前店铺佣金大于商品原价, 是否继续保存?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then((res) => {
            this.submitItemsActionConfirm()
          }).catch(() => {
            return
          })
        } else {
          this.submitItemsActionConfirm()
        }
      },
      submitItemsActionConfirm() {

        this.submitLoading = true
        const that = this
        let formSkuItem=null

        if(this.editingSkus.length > 0){
            formSkuItem = this.editingSkus.filter(item =>item.approve_status != '')
        }

        // 如果spec_items属性为空
        if (this.specItems.length <= 0) {
          formSkuItem = []
        }


        // this.specItems.forEach(item => {
        //   item.forEach(child => {
        //     formSkuItem.push(child)
        //   })
        // })
        if (this.mode === 'component') {
          this.form.intro = JSON.stringify(this.content)
        }
        if (this.selectedMainCategory.length > 0) {
          this.form.item_main_cat_id = this.selectedMainCategory[this.selectedMainCategory.length-1]
        }
        if (!this.form.nospec) {
          if (formSkuItem.length > 0) {
            formSkuItem[0].is_default = true
            // } else {
            //   this.submitLoading = false
            //   this.$message({message: '请设置规格信息', type: "error"})
            //   return
          }
        }
        if (this.form.type === 1 && !this.form.origincountry_id) {
          this.submitLoading = false
          this.$message({message: '请选择产地国', type: 'error'})
          return
        }

        if (this.form.taxstrategy_id !== '0' && this.form.taxation_num < 1) {
          this.submitLoading = false
          this.$message({message: '单位份数不可小于1', type: 'error'})
          return
        }
        this.form.spec_images = JSON.stringify(this.specImages)
        this.form.spec_items = JSON.stringify(formSkuItem)
        this.form.tdk_content = JSON.stringify(this.tdk_info)

        if (this.form.item_id && !this.is_new) {
          updateItems(this.form.item_id, this.form).then(response => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.submitLoading = false
                that.refresh()
                that.isLeave = true
                that.$router.go(-1)
              }
            })
          }).catch(error => {
            this.submitLoading = false
          })
        } else {
          createItems(this.form).then(response => {
            this.$message({
              message: '添加成功',
              type: 'success',
              duration: 2 * 1000,
              onClose () {
                that.submitLoading = false
                that.refresh()
                that.isLeave = true
                that.$router.go(-1)
              }
            })
          }).catch(error => {
            this.submitLoading = false
          })
        }
      },
      updateContent: function (data) {
        this.form.intro = data
      },
      handleCancel: function () {
        this.$router.go(-1)
      },
      pageChange(val) {
        this.currentPage = val
      },
      // 详情中的上传图片
      addImgPreview: function () {
        this.thumbDialog = true
        this.isGetThumb = true
      },
      pickThumb: function (arr) {
        if (arr.length != 0) {
          arr.forEach(data => {
            if (data && data.url !== '') {
              this.thumbDialog = false
              var index = this.$refs.editor.$el.id
              var loc = this.$refs.editor
              var img = new Image()
              img.src = this.wximageurl + data.url
              if (loc.range) {
                loc.range.insertNode(img)
                var referenceNode = loc.range.endContainer
                if (referenceNode.className !== 'content') {
                  loc.range.setStartAfter(referenceNode)
                } else {
                  loc.range.setStart(loc.range.endContainer, loc.range.endOffset)
                }
              } else {
                loc.$refs.content.appendChild(img)
                loc.focus()
                loc.restoreSelection()
              }
              this.form.intro = loc.$refs.content.innerHTML
            }
          })
        }
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
      handleSkuImg(index) {
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
          }else {
            if (data.length != 0) {
              data.forEach(data => {
                if (data && data.url !== '') {
                  this.form.pics.push(data.url)
                  this.form.pics_create_qrcode.push(false)
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
            data.forEach(data => {
              if (data && data.url !== '') {
                this.specImages[this.currentSku].item_image_url.push(data.url)
              }
            })
          }
          this.currentSku = -1
        }
        this.picsDialog = false
      },
      fillSku() {
        let obj = {...this.bulkFilling[0]}
        let newObj = {}
        for (let key in obj) {
          if (obj[key] && key !== 'item_spec') {
            newObj[key] = obj[key]
          }
        }
        let list = [...this.specItems[this.currentPage-1]]
        list.forEach(item => {
          Object.assign(item, newObj)
        })
        store.dispatch('setPage', list)
      },
      clearSku(index) {
        this.$confirm('确定清除当前规格的数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let skuItem = this.specItems[this.currentPage-1][index]
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
        this.picsCurrent  = index
      },
      picsLeave () {
        this.picsCurrent  = -1
      },
      removePicsImg: function (index) {
        this.form.pics.splice(index, 1)
        this.form.pics_create_qrcode.splice(index, 1)
        this.picsOldLen = this.form.pics.length
      },
      handleSkuChange(data) {
        this.updateSku()
      },
      updateSku() {
        let arr = []
        let skus = []

        this.skus.forEach(item => {
          if (item.checked_sku.length > 0) {
            arr.push(item)
          }
        })

        if (arr.length > 0) {
          let n = arr.findIndex(item => JSON.parse(item.is_image))
          if (n != -1) {
            let obj = {...arr[n]}
            let imgs = []
            let addedImg = this.specImages
            obj.checked_sku.forEach(item => {
              let added = addedImg.find(n => n.spec_value_id === item)
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
          arr.forEach(item => {
            let skuGroup = []
            if (item.checked_sku.length > 0) {
              item.checked_sku.forEach(checked => {
                let issue = item.sku_value.find(sku => sku.attribute_value_id === checked)
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
          // if (this.skus.length > 1 && !allSku[0].length) {
          //   return false
          // }
          let skuList = []
          allSku.forEach(item => {
            let obj = {
              is_default: false,
              sku_id: this.generateSkuids(item),
              item_spec: item.length ? item : [item],
              approve_status: '',
              store: '',
              item_bn: '',
              weight: '',
              volume: '',
              price: '',
              cost_price: '',
              market_price: '',
              barcode: '',
              point_num: ''
            }
            skuList.push(obj)
          })
          if (this.editingSkus.length > 0) {
            this.editingSkus.forEach(item => {
              let in_item = skuList.find(n => item.sku_id === n.sku_id)
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
            list.forEach(item => {
              item.forEach(child => {
                let in_sku = this.editingSkus.find(editor => editor.sku_id === child.sku_id)
                if (in_sku) {
                  Object.assign(child, in_sku)
                }
              })
            })
          }

          list.forEach(item => {
            item.forEach(obj=>{
              store.dispatch('setSku',obj)
            })
            // let obj={
            //   item:item,
            //   isList:true
            // }
            //   store.dispatch('setSku',obj)
          })
          this.specItems = list


        } else {
          this.specItems = []
        }

      },
      getSkuName(id, skus) {
        let sku = skus.find(item => id === item.attribute_value_id)
        if (sku) {
          return sku.attribute_value
        }
      },
      generateSkuids(data) {
        if (data.length) {
          let skuIds = []
          data.forEach(child => {
            skuIds.push(child.spec_value_id)
          })
          return skuIds.join('_')
        } else {
          return data.spec_value_id
        }
      },
      generateSkus(data) {
        let len = data.length
        if (len >= 2) {
          let len1 = data[0].length
          let len2 = data[1].length
          let newlen = len1 * len2
          let temp = new Array(newlen)
          let index = 0
          for ( let i = 0; i < len1; i++) {
            for (let j = 0; j < len2; j++) {
              if (Array.isArray(data[0][i])) {
                temp[index] = [...data[0][i], data[1][j]]
              } else {
                temp[index] = [data[0][i], data[1][j]]
              }
              index++
            }
          }
          let newArray = new Array(len-1)
          for (let i = 2; i < len; i++){
            newArray[i - 1] = data[i]
          }
          newArray[0] = temp
          return this.generateSkus(newArray)
        }
        else{
          return data[0]
        }
      },
      renderRequire (h,{column}) {
        return h(
          'span', {
            class:'mark'
          }, '*' + column.label
        )
      },
      handleContent (data) {
        this.content = data
      },
      deleteVideo() {
        this.itemVideo = {}
        this.form.videos = ''
        this.form.videos_url = ''
      },
      // 获取品牌列表
      getBrandList (searchVal = '', isInit = false) {
        const list = []
        getGoodsAttr({
          page: 1,
          pageSize: 1000,
          attribute_type: 'brand',
          attribute_name: searchVal,
          attribute_ids: isInit ? this.form.brand_id : ''
        }).then(res => {
          for (let item of res.data.data.list) {
            list.push({attribute_name: item.attribute_name, attribute_id: item.attribute_id})
          }
          this.brandList = list
        })
      },
      init () {
        this.getBrandList('', true)
        getShippingTemplatesList(this.templatesListParams).then(response => {
          if (response.data.data.list.length > 0) {
            for(var i in response.data.data.list) {
              this.templatesList.push({
                'template_id': response.data.data.list[i].template_id,
                'name': response.data.data.list[i].name
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '请先添加运费模板'
            })
            this.$router.push({path: this.matchInternalRoute('shippingtemplates')})
          }
        })

        getCategory({is_show:false}).then(response => {
          this.categoryList = response.data.data
        })
        getPointRule().then(response => {
          this.form.point_access = response.data.data.access
        })
      },
      profitStatusChange(val) {
        if (val) {
          this.form.is_profit = true
        } else {
          this.form.is_profit = false
        }
      },packageItemsChange(val) {
        if (val) {
          this.form.is_package_items = true
        } else {
          this.form.is_package_items = false
        }
      },
      giftStatusChange(val){
        if (val) {
          this.isGift = true
          // this.form.price = 0
          // this.form.market_price = 0
        } else {
          this.isGift = false
        }
      },
      // select值变化
      paramsChange (e) {
        const params = this.params
        for (let i = 0; i < params.length; i++) {
          if (params[i].children && params[i].children.length > 0) {
            const children = params[i].children
            const isHave = children.findIndex(item => item.value == e)
            if (isHave !== -1) {
              this.form.item_params[i].attribute_value_name = children[isHave].label
              break
            }
          }
        }
      },
      dragEnd (e) {
        const { oldIndex, newIndex } = e
        const { pics_create_qrcode } = this.form
        const temp = pics_create_qrcode[oldIndex]
        pics_create_qrcode[oldIndex] = pics_create_qrcode[newIndex]
        pics_create_qrcode[newIndex] = temp
      },
      isAllCheckChange () {
        const list = [...this.form.pics_create_qrcode]
        const length = list.length
        for (let i = 0; i < length; i++) {
          list[i] = !this.isAllCheck
        }
        this.form.pics_create_qrcode = list
      }
    },
    beforeRouteLeave (to, from , next) {
      if (!this.isLeave) {
        this.$confirm('确定要离开当前页面，您将丢失已编辑的数据？！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          store.dispatch('clearSkus')
          next()
        }).catch(() => {
          next(false)
        })
      } else {
        store.dispatch('clearSkus')
        next()
      }
    },
    mounted () {

      if (this.$route.path.split('/')[2] === 'godsphysicalkj') {

        this.form.type = 1
      } else {

        this.form.type = 0
      }

      const _self = this
      async function onload () {
        if (_self.$route.query.is_new) {
          _self.is_new = _self.$route.query.is_new
        }
        if (_self.$route.params.itemId) {
          _self.isEditor = true
          _self.mainCateLoader = true
          // 初始化门店数据
          await getItemsDetail(_self.$route.params.itemId).then(response => {
            console.log("--response--",response)
            let itemsDetailData = response.data.data
            if (itemsDetailData.regions_id) {
              _self.select_regions_value = itemsDetailData.regions_id
            }
            _self.form.pics = itemsDetailData.pics
            // _self.form.pics_create_qrcode = itemsDetailData.pics_create_qrcode
            // 处理图片列表
            var picList = []
            for (var item in itemsDetailData.pics) {
              var newpic = {}
              newpic.url = _self.wximageurl + itemsDetailData.pics[item]
              picList.push(newpic)
            }
            // TDK处理
            if (itemsDetailData && itemsDetailData.tdk_content) {
              _self.tdk_info = JSON.parse(itemsDetailData.tdk_content)
            }
            _self.picsList = picList
            let obj = _self.form
            _self.form = ({obj} = {
              item_id: _self.is_new ? '' : itemsDetailData.item_id,
              item_source: itemsDetailData.item_source,
              item_type: itemsDetailData.item_type,
              special_type: itemsDetailData.special_type,
              item_category: itemsDetailData.item_category.length > 0? itemsDetailData.item_category : [],
              item_name: itemsDetailData.item_name,
              sort: itemsDetailData.sort,
              tax_rate: itemsDetailData.tax_rate,
              item_bn: _self.is_new ? '' : itemsDetailData.item_bn,
              brief: itemsDetailData.brief,
              // item_en_name: itemsDetailData.item_en_name,
              weight: itemsDetailData.weight,
              volume: itemsDetailData.volume,
              price: itemsDetailData.price/100,
              market_price: itemsDetailData.market_price/100,
              cost_price: itemsDetailData.cost_price/100,
              barcode: itemsDetailData.barcode,
              item_unit: itemsDetailData.item_unit,
              rebate: itemsDetailData.rebate/100,
              store: itemsDetailData.store,
              brand_id: itemsDetailData.brand_id,
              templates_id: itemsDetailData.templates_id ? itemsDetailData.templates_id.toString() : '',
              approve_status: itemsDetailData.approve_status,
              pics: itemsDetailData.pics,
              videos: itemsDetailData.videos,
              videos_url: itemsDetailData.videos_url,
              nospec: itemsDetailData.nospec,
              is_show_specimg: itemsDetailData.is_show_specimg,
              item_params: itemsDetailData.item_params,
              item_main_cat_id: itemsDetailData.item_main_cat_id,
              is_gift: itemsDetailData.is_gift,
              crossborder_tax_rate: itemsDetailData.crossborder_tax_rate,
              origincountry_id: itemsDetailData.origincountry_id,
              taxstrategy_id: itemsDetailData.taxstrategy_id,
              taxation_num: itemsDetailData.taxation_num,
              type: itemsDetailData.type,
              is_profit: itemsDetailData.is_profit,
              point_num: itemsDetailData.point_num,
              is_package_items: itemsDetailData.is_package_items,
              tdk_content: itemsDetailData.tdk_content,
              pics_create_qrcode: itemsDetailData.pics_create_qrcode?itemsDetailData.pics_create_qrcode:[]
            })
            getPointRule().then(response => {
              _self.form.point_access = response.data.data.access
            })
            _self.picsOldLen = _self.form.pics.length
            if (!itemsDetailData.item_main_cat_id) {
              _self.fetchMainCate()
            } else {
              let category = itemsDetailData.item_category_main
              _self.categoryNames = [category[0].category_name, category[0].children[0].category_name, category[0].children[0].children[0].category_name]
              _self.generateParams(itemsDetailData.item_params_list)
            }
            if (!_self.form.nospec) {
              _self.generateSpec(itemsDetailData.item_spec_list)
              _self.specImages = itemsDetailData.spec_images
              itemsDetailData.spec_items.forEach(item => {
                item.item_spec.forEach(child => {
                  let checkedIndex = _self.skus.findIndex(n => child.spec_id === n.sku_id)
                  let isin = _self.skus[checkedIndex].checked_sku.findIndex(k => child.spec_value_id === k)
                  if (isin === -1) {
                    _self.skus[checkedIndex].checked_sku.push(child.spec_value_id)
                  }
                })
              })

              itemsDetailData.spec_items.forEach(item => {
                let sku = Object.assign({}, item)
                sku.market_price = item.market_price/100
                sku.cost_price = item.cost_price/100
                sku.price = item.price/100
                sku.item_bn = _self.is_new ? '' : item.item_bn
                let itemId = []
                let specs = []
                item.item_spec.forEach(sub => {
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
                Object.assign(sku, {sku_id: itemId})
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
          _self.itemVideo = {media_id:_self.form.videos, url:_self.form.videos_url}
        } else {
          _self.fetchMainCate()
          _self.loader = false
        }
        await _self.init()
      }
      onload()
      this.getOrigincountry()
    }
  }
</script>
<style lang="scss">
  .section_add{
    .vue-treeselect__placeholder{
      line-height: 40px;
    }
    .allCheck, .TDK_SET{
      label{
        line-height: 20px;
      }
    }
    .el-form-item__label {
      padding: 0 20px 0 0;
    }
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
      content: "";
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
    overflow: visible;
    height: 160px;
    position: relative;
    .goodspic-wrap {
      margin-right: 5px;
      display: flex;
      overflow: visible;
      float: left;
      .goodspic {
        position: relative;
        float: left;
        width: 120px;
        height: 120px;
        margin: 0 5px 35px;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: visible; 
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
          background: rgba(0,0,0,.2);
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
    .allCheck {
      position: absolute;
      left: 50px;
      bottom: 0;
      transform: translateX(-100%);
    }
    .upload-box {
      border: 1px dashed #c0ccda;
      border-radius: 6px;
      cursor: pointer;
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
  .checkBox {
    display: block;
    line-height: 0;
    text-align: center;
  }
  .wid100{
    width: 100%;
  }
</style>
