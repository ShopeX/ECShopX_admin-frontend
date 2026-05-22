<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <SpPage class="section section-white">
    <template slot="page-footer">
      <div class="text-center">
        <el-button @click.native="handleCancel"> {{ $t('4b43f5ef.625fb2') }} </el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitItemsActionConfirm">
          {{ submitLoading ? $t('4b43f5ef.7ef44a') : $t('4b43f5ef.be5fbb') }}
        </el-button>
      </div>
    </template>

    <el-form
      ref="form"
      v-loading="pageLoading"
      element-loading-custom-class="pointmall-add-loading"
      :model="form"
      label-width="auto"
      label-position="left"
      class="demo-ruleForm"
    >
      <template v-if="!isEditor || (isEditor && !form.item_main_cat_id)">
        <el-card shadow="never" :header="$t('4b43f5ef.c50637')">
          <el-cascader
            v-model="selectedMainCategory"
            :options="mainCategory"
            style="width: 360px"
            @change="handleCategoryChange"
          />
        </el-card>
      </template>
      <div v-else-if="isEditor && form.item_main_cat_id" class="content-padded flex items-center">
        <div>{{ $t('4b43f5ef.ca079c') }}</div>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="inline">
          <el-breadcrumb-item v-for="(item, index) in categoryNames" :key="index">
            {{ item }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <template v-if="(!isEditor && selectedMainCategory.length > 0) || isEditor">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ $t('4b43f5ef.6ea1fe') }}</span>
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
                  <el-form-item :label="$t('4b43f5ef.3ac6c1')">
                    <el-input v-model="form.item_name" :maxlength="100" placeholder="" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.72cf37')">
                    <el-input v-model="form.brief" :maxlength="30" placeholder="" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.a1f07e')">
                    <el-select v-model="form.templates_id" :placeholder="$t('4b43f5ef.708c9d')">
                      <el-option
                        v-for="item in templatesList"
                        :key="item.template_id"
                        :label="item.name"
                        :value="item.template_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.07595d')">
                    <el-select
                      v-model="form.brand_id"
                      remote
                      filterable
                      :remote-method="getBrandList"
                      clearable
                      :placeholder="$t('4b43f5ef.708c9d')"
                    >
                      <el-option
                        v-for="item in brandList"
                        :key="item.attribute_id"
                        :label="item.attribute_name"
                        :value="item.attribute_id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.251549')">
                    <el-input v-model="form.item_unit" :maxlength="60" placeholder="" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.e8373a')">
                    <el-input v-model="form.sort" placeholder="" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item :label="$t('4b43f5ef.2b6d31')">
                    <el-cascader
                      v-model="select_regions_value"
                      :placeholder="$t('4b43f5ef.e9a36d')"
                      :options="regions"
                      @change="regionChange"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="商品税率">
                    <el-input v-model="form.tax_rate" placeholder=""></el-input>
                  </el-form-item>
                </el-col> -->
                <!-- <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="是否开启分润">
                    <el-switch
                     v-model="form.is_profit"
                     active-color="#13ce66"
                     inactive-color="#ff4949" @change="profitStatusChange">
                    </el-switch>
                  </el-form-item>
                </el-col> -->
                <el-col :xs="24" :sm="12" :md="12">
                  <el-form-item :label="$t('4b43f5ef.728f47')" label-width="110px">
                    <el-cascader
                      v-model="form.item_category"
                      clearable
                      filterable
                      :props="cascaderProps"
                      :options="saleCategoryList"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>
                <!--
                <el-col :xs="24" :sm="12" :md="8">
                  <el-form-item label="*是否为赠品">
                    <el-switch
                     v-model="form.is_gift"
                     active-color="#13ce66"
                     inactive-color="#ff4949" @change="giftStatusChange">
                    </el-switch>
                    <el-alert title="开启后前台不可购买" type="info" :closable="false" show-icon></el-alert>
                  </el-form-item>
                </el-col>
                -->
                <el-col :xs="24">
                  <el-form-item :label="$t('4b43f5ef.9dcb7e')">
                    <div>
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
                              <img :src="wximageurl + item" />
                              <div class="goodspic-mask" :class="picsCurrent == index ? 'on' : ''">
                                <!-- <div class="el-icon-delete" /> -->
                                <SpIcon name="delete" @click="removePicsImg(index)" />
                                <!-- <div class="el-icon-rank" /> -->
                              </div>
                            </li>
                          </draggable>
                        </ul>
                        <div
                          v-if="form.pics.length < 9"
                          class="upload-box border border-dashed border-gray-300 flex items-center justify-center"
                          @click="handlePicsChange"
                        >
                          <SpIcon name="camera" size="24" />
                        </div>
                      </div>
                      <div class="frm-tips">
                        <p>
                          1.
                          {{ $t('4b43f5ef.f0e1d4') }}
                        </p>
                        <p>{{ $t('4b43f5ef.2eceaf') }}</p>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xs="24">
                  <el-form-item :label="$t('4b43f5ef.afddcb')">
                    <videoPicker :data="itemVideo" @change="pickVideo" />
                    <el-button v-if="itemVideo.media_id" type="text" @click="deleteVideo">
                      {{ $t('4b43f5ef.2f4aad') }}
                    </el-button>
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
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ $t('4b43f5ef.8686bb') }}</span>
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
                      :placeholder="$t('4b43f5ef.708c9d')"
                      @change="paramsChange"
                    >
                      <el-option
                        v-for="child in item.children"
                        :key="child.value"
                        :label="child.label"
                        :value="child.value"
                      />
                    </el-select>
                    <el-input
                      v-else
                      v-model="form.item_params[index].attribute_value_name"
                      :maxlength="60"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </transition>
        </el-card>
        <el-card shadow="never">
          <div slot="header" class="flex">
            <div class="view-flex-item">{{ $t('4b43f5ef.5fceb3') }}</div>
            <template v-if="!isEditor">
              <span v-if="skus.length === 0" class="small mark">{{ $t('4b43f5ef.fdd179') }}</span>
              <template v-if="skus.length > 0">
                <el-switch
                  v-model="form.nospec"
                  style="margin-left: 30px"
                  active-color="#13ce66"
                  inactive-color="#efefef"
                  :active-text="$t('4b43f5ef.fb49c4')"
                  :inactive-text="$t('4b43f5ef.5d60de')"
                />
              </template>
            </template>
            <template v-if="!form.nospec">
              <span style="margin-left: 30px">
                <span style="margin-right: 10px">{{ $t('4b43f5ef.b51e8b') }}</span>
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
                <el-form-item :label="$t('4b43f5ef.ce0008')" :render-header="renderRequire">
                  <el-select v-model="form.approve_status" :placeholder="$t('4b43f5ef.708c9d')">
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="$t(item.title)"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.fcd943')">
                  <el-input v-model="form.store" type="number" required min="0" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.e9de29')">
                  <el-input v-model="form.item_bn" :maxlength="60" placeholder="" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.8c0d75')">
                  <el-input v-model="form.weight" type="number" required min="0" placeholder="">
                    <template slot="append"> kg </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.3b35fa')">
                  <el-input v-model="form.volume" type="number" required min="0" placeholder="">
                    <template slot="append"> m³ </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="销售价">
                  <el-input type="number" required min="0" v-model="form.price" placeholder=""><template slot="prepend">¥</template></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.2e2ce2')">
                  <el-input v-model="form.cost_price" type="number" required min="0" placeholder="">
                    <template slot="prepend"> ¥ </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.818fc4')">
                  <el-input
                    v-model="form.market_price"
                    type="number"
                    required
                    min="0"
                    placeholder=""
                  >
                    <template slot="prepend"> ¥ </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.1e8836')">
                  <el-input v-model="form.barcode" required min="0" placeholder="" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.0c9d2b')" :render-header="renderRequire">
                  <el-select v-model="form.pay_class" :placeholder="$t('4b43f5ef.708c9d')">
                    <el-option
                      v-for="item in payClass"
                      :key="item.value"
                      :label="$t(item.title)"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.e29575')">
                  <el-input
                    v-if="form.pay_class === 'online' || form.pay_class === 'mix'"
                    v-model="form.price"
                    type="number"
                    required
                    min="0"
                    placeholder=""
                  >
                    <template slot="prepend"> ¥ </template>
                  </el-input>
                  <span v-if="!form.pay_class || form.pay_class === 'point'">-</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item :label="$t('4b43f5ef.bf6d40')">
                  <el-input
                    v-if="form.pay_class === 'point' || form.pay_class === 'mix'"
                    v-model="form.point"
                    type="number"
                    required
                    min="0"
                    placeholder=""
                  >
                    <template slot="append"> {{ $t('4b43f5ef.9f68a8') }} </template>
                  </el-input>
                  <span v-if="!form.pay_class || form.pay_class === 'online'">-</span>
                </el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <el-card v-for="(item, index) in skus" :key="item.index">
              <div class="sku-select__item">
                <div class="goods">{{ item.sku_name }}：</div>
                <div class="sku-select__checkgroup">
                  <el-checkbox-group v-model="item.checked_sku" @change="handleSkuChange">
                    <template v-for="(value, vn) in item.sku_value">
                      <div class="sku-select__checkitem">
                        <imgBox
                          v-if="value.image_url"
                          :img-url="value.image_url"
                          width="50"
                          height="50"
                        />
                        <el-checkbox :label="value.attribute_value_id">
                          <el-input
                            v-if="item.checked_sku.indexOf(value.attribute_value_id) !== -1"
                            v-model="value.custom_attribute_value"
                            size="mini"
                            style="width: 100px"
                            @change="
                              handleSkuName(value.custom_attribute_value, value.attribute_value_id)
                            "
                          />
                          <span v-else>{{ value.attribute_value }}</span>
                        </el-checkbox>
                      </div>
                    </template>
                  </el-checkbox-group>
                </div>
              </div>
            </el-card>
            <div v-if="specImages.length > 0" class="content-bottom-padded">
              <div class="content-padded h3">{{ $t('4b43f5ef.693413') }}</div>
              <el-table :data="specImages" :header-cell-style="{ background: '#f5f7fa' }">
                <el-table-column :label="$t('4b43f5ef.ea887b')" prop="item_spec" width="240" />
                <el-table-column :label="$t('4b43f5ef.22826b')">
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
            <div class="content-padded h3">{{ $t('4b43f5ef.29725a') }}</div>
            <el-table :data="bulkFilling" :show-header="false" :highlight-current-row="false">
              <el-table-column>
                <template slot-scope="scope">
                  {{
                    scope.row.custom_attribute_value ||
                    (scope.row.item_spec === '批量填充'
                      ? $t('4b43f5ef.d87166')
                      : scope.row.item_spec)
                  }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.47f00b')">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.approve_status"
                    size="mini"
                    :placeholder="$t('4b43f5ef.708c9d')"
                  >
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="$t(item.title)"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.fcd943')">
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
              <el-table-column :label="$t('4b43f5ef.9b979b')">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.item_bn"
                    :maxlength="60"
                    size="mini"
                    placeholder=""
                  />
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.8c0d75')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.3b35fa')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" />
                </template>
              </el-table-column>
              <!-- <el-table-column label="销售价">
                <template slot-scope="scope">
                  <el-input type="number" required min="0" v-model="scope.row.price" size="mini" placeholder=""></el-input>
                </template>
              </el-table-column> -->
              <el-table-column :label="$t('4b43f5ef.2e2ce2')">
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
              <el-table-column :label="$t('4b43f5ef.818fc4')">
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
              <el-table-column :label="$t('4b43f5ef.0c9d2b')">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.pay_class"
                    size="mini"
                    :placeholder="$t('4b43f5ef.708c9d')"
                  >
                    <el-option
                      v-for="item in payClass"
                      :key="item.value"
                      :label="$t(item.title)"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.e29575')">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.pay_class === 'online' || scope.row.pay_class === 'mix'"
                    v-model="scope.row.price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                  <span v-if="!scope.row.pay_class || scope.row.pay_class === 'point'">-</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.bf6d40')">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.pay_class === 'point' || scope.row.pay_class === 'mix'"
                    v-model="scope.row.point"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                  />
                  <span v-if="!scope.row.pay_class || scope.row.pay_class === 'online'">-</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.1e8836')">
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
                    {{ $t('4b43f5ef.756e44') }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="specItems[currentPage - 1]"
              :header-cell-style="{ background: '#f5f7fa' }"
              style="width: 100%"
            >
              <el-table-column :label="$t('4b43f5ef.94d502')">
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.item_spec" :key="index">
                    {{ item.spec_custom_value_name || item.spec_value_name }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.3fea7c')" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.approve_status"
                    size="mini"
                    :placeholder="$t('4b43f5ef.708c9d')"
                    @change="upadateState(scope.row)"
                  >
                    <el-option
                      v-for="item in statusOption"
                      :key="item.value"
                      :label="$t(item.title)"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.fcd943')" :render-header="renderRequire">
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
              <el-table-column :label="$t('4b43f5ef.9b979b')">
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
              <el-table-column :label="$t('4b43f5ef.8c0d75')">
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
              <el-table-column :label="$t('4b43f5ef.3b35fa')">
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
              <!-- <el-table-column label="销售价" :render-header="renderRequire">
              <template slot-scope="scope">
                <el-input type="number" required min="0" v-model="scope.row.price" size="mini" placeholder="" @change="upadateState(scope.row)"></el-input>
              </template>
            </el-table-column> -->
              <el-table-column :label="$t('4b43f5ef.2e2ce2')">
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
              <el-table-column :label="$t('4b43f5ef.818fc4')">
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
              <el-table-column :label="$t('4b43f5ef.0c9d2b')" :render-header="renderRequire">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.pay_class"
                    size="mini"
                    :placeholder="$t('4b43f5ef.708c9d')"
                    @change="upadateState(scope.row)"
                  >
                    <el-option
                      v-for="item in payClass"
                      :key="item.value"
                      :label="$t(item.title)"
                      size="mini"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.e29575')">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.pay_class === 'online' || scope.row.pay_class === 'mix'"
                    v-model="scope.row.price"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                  <span v-if="!scope.row.pay_class || scope.row.pay_class === 'point'">-</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.d42050')">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.pay_class === 'point' || scope.row.pay_class === 'mix'"
                    v-model="scope.row.point"
                    type="number"
                    required
                    min="0"
                    size="mini"
                    placeholder=""
                    @change="upadateState(scope.row)"
                  />
                  <span v-if="!scope.row.pay_class || scope.row.pay_class === 'online'">-</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('4b43f5ef.1e8836')">
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
              <el-table-column width="80">
                <template slot-scope="scope">
                  <el-button type="text" @click="clearSku(scope.$index)">
                    {{ $t('4b43f5ef.4403fc') }}
                  </el-button>
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

        <!-- <el-card v-if="form.type===1" header="跨境参数" shadow="never" v-loading="loader">
          <el-form-item label="商品税率">
            <el-input-number controls-position="right" v-model="form.crossborder_tax_rate"  :controls="false" :precision="2"
                             :step="0.1" :min="0" :max="100">
            </el-input-number>
            <span style="margin-left: 5px;">%</span>
          </el-form-item>
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
        </el-card> -->

        <el-card :header="$t('4b43f5ef.7db2d6')" shadow="never">
          <el-form-item :label="$t('4b43f5ef.f0789e')">
            <el-radio-group v-model="mode">
              <el-radio :label="'richText'"> {{ $t('4b43f5ef.e2591e') }} </el-radio>
              <el-radio :label="'component'"> {{ $t('4b43f5ef.b09ce9') }} </el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="mode === 'richText'">
            <SpRichText ref="editor" v-model="form.intro" class="rich-text-editor" />
            <!-- <span class="tpl_item img" style="" @click="addImgPreview">
              <i class="el-icon-picture" />图片
            </span> -->
          </template>
          <template v-else>
            <SpIphone>
              <SpDecorate ref="decorateRef" v-model="content" scene="1002" />
            </SpIphone>
          </template>
        </el-card>
      </template>
    </el-form>
  </SpPage>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import { getItemsDetail, createItems, updateItems } from '@/api/pointsmall'
import { getGoodsAttr, getCategory, getCategoryInfo } from '@/api/goods'
import { getShippingTemplatesList } from '@/api/shipping'
import { uploadMaterial } from '@/api/wechat'
import videoPicker from '@/components/videoselect'
import richTextEditor from '@/components/function/richTextEditor'
import imgBox from '@/components/element/imgBox'
import district from '@/common/district.json'
import { getOrigincountry } from '@/api/crossborder'
export default {
  beforeRouteLeave(to, from, next) {
    if (this.$refs['decorateRef'].dialogVisible) {
      this.$refs['decorateRef'].resetDecorateTheme()
      this.$refs['decorateRef'].onClose()
    }
    next()
  },
  components: {
    videoPicker,
    draggable,
    richTextEditor,
    imgBox
  },
  inject: ['refresh'],
  data() {
    const cascaderProps = {
      multiple: true,
      value: 'value',
      children: 'children'
    }
    return {
      cascaderProps,
      // 跨境设置
      origincountry: [], // 产地国
      itemVideo: {},
      select_regions_value: [],
      regions: district,
      mainCategory: [],
      selectedMainCategory: [],
      categoryNames: [],
      pageLoading: true,
      submitLoading: false,
      isEditor: false,
      isLeave: false,
      panel: {
        base: true,
        param: true,
        goods_type: true
      },
      is_new: false,
      isGetVideo: false,
      statusOption: [
        { title: '4b43f5ef.9b7481', value: 'onsale' },
        { title: '4b43f5ef.2c50a0', value: 'offline_sale' },
        { title: '4b43f5ef.acf86b', value: 'only_show' },
        { title: '4b43f5ef.ae83a3', value: 'instock' }
      ],
      payClass: [
        { title: '4b43f5ef.accd19', value: 'point' },
        { title: '4b43f5ef.fe94ed', value: 'online' },
        { title: '4b43f5ef.30bee6', value: 'mix' }
      ],
      saleCategoryList: [],
      brandList: [],
      content: [],
      dragIssuesOptions: {
        animation: 300,
        forceFallback: false,
        scroll: true,
        handle: '.el-icon-rank',
        draggable: '.goodspic'
      },
      form: {
        item_id: '',
        item_type: 'normal',
        special_type: 'normal',
        item_category: [],
        item_params: [],
        item_name: '',
        sort: 0,
        tax_rate: 0,
        item_bn: '',
        brief: '',
        weight: '',
        volume: '',
        price: '',
        market_price: '',
        pay_class: 'point',
        cost_price: 0,
        point: 0,
        barcode: '',
        item_unit: '',
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
        crossborder_tax_rate: '',
        origincountry_id: 0,
        type: 0
      },
      bulkFilling: [
        {
          item_spec: '批量填充',
          approve_status: '',
          store: '',
          item_bn: '',
          price: '',
          cost_price: '',
          market_price: '',
          pay_class: '',
          point: '',
          barcode: ''
        }
      ],
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
  mounted() {
    if (this.$route.params.itemId) {
      this.isEditor = true
    }
    console.log(this.$route.path.split('/')[2])
    if (this.$route.path.split('/')[2] === 'godsphysicalkj') {
      console.log('跨境商品')
      this.form.type = 1
    } else {
      console.log('普通商品')
      this.form.type = 0
    }

    const _self = this
    async function onload() {
      if (_self.$route.query.is_new) {
        _self.is_new = _self.$route.query.is_new
      }
      _self.pageLoading = true
      try {
      if (_self.$route.params.itemId) {
        // 初始化门店数据
        const response = await getItemsDetail(_self.$route.params.itemId)
        let itemsDetailData = response.data.data
        const categoryInfoRes = await getCategoryInfo(itemsDetailData.item_main_cat_id, {
          is_point: 1,
          item_id: _self.$route.params.itemId
        })
        const categoryInfoDetail = categoryInfoRes.data.data
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
          item_id: _self.is_new ? '' : itemsDetailData.item_id,
          item_source: itemsDetailData.item_source,
          item_type: itemsDetailData.item_type,
          special_type: itemsDetailData.special_type,
          item_category_temp:
            itemsDetailData.item_category.length > 0 ? itemsDetailData.item_category : [],
          item_name: itemsDetailData.item_name,
          sort: itemsDetailData.sort,
          tax_rate: itemsDetailData.tax_rate,
          item_bn: _self.is_new ? '' : itemsDetailData.item_bn,
          brief: itemsDetailData.brief,
          weight: itemsDetailData.weight,
          volume: itemsDetailData.volume,
          price: itemsDetailData.price / 100,
          market_price: itemsDetailData.market_price / 100,
          cost_price: itemsDetailData.cost_price / 100,
          point: itemsDetailData.point,
          pay_class: itemsDetailData.pay_class,
          barcode: itemsDetailData.barcode,
          item_unit: itemsDetailData.item_unit,
          // rebate: itemsDetailData.rebate/100,
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
          // is_gift: itemsDetailData.is_gift,
          crossborder_tax_rate: itemsDetailData.crossborder_tax_rate,
          origincountry_id: itemsDetailData.origincountry_id,
          type: itemsDetailData.type
          // is_profit: itemsDetailData.is_profit,
        }
        _self.picsOldLen = _self.form.pics.length
        if (!itemsDetailData.item_main_cat_id) {
          await _self.fetchMainCate()
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
          _self.generateSpec(categoryInfoDetail.goods_spec, itemsDetailData.spec_items)
          _self.specImages = itemsDetailData.spec_images
          // 恢复规格勾选状态
          itemsDetailData.spec_items.forEach((item) => {
            item.item_spec.forEach((child) => {
              let checkedIndex = _self.skus.findIndex((n) => child.spec_id === n.sku_id)
              if (checkedIndex > -1) {
                let isin = _self.skus[checkedIndex].checked_sku.findIndex(
                  (k) => child.spec_value_id === k
                )
                if (isin === -1) {
                  _self.skus[checkedIndex].checked_sku.push(child.spec_value_id)
                }
              }
            })
          })

          itemsDetailData.spec_items.forEach((item) => {
            let sku = Object.assign({}, item)
            sku.market_price = item.market_price / 100
            sku.cost_price = item.cost_price / 100
            sku.price = item.price / 100
            sku.item_bn = _self.is_new ? '' : item.item_bn
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
        // .catch(error => {
        //   _self.$router.go(-1)
        // })
        _self.itemVideo = { media_id: _self.form.videos, url: _self.form.videos_url }
      } else {
        await _self.fetchMainCate()
      }
      await _self.init()
      } finally {
        _self.pageLoading = false
      }
    }
    onload()
    this.getOrigincountry()
  },
  methods: {
    // 获取产地国
    getOrigincountry() {
      let where = { page: 1, pageSize: 99999 }
      if (this.form.type === 1) {
        getOrigincountry(where).then((res) => {
          this.origincountry = res.data.data.list
        })
      }
    },

    regionChange() {
      this.form.regions_id = this.select_regions_value
      this.form.item_address_province = this.select_regions_value[0]
      this.form.item_address_city = this.select_regions_value[1]
    },
    fetchMainCate() {
      return getCategory({ is_main_category: true }).then((res) => {
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
      })
    },
    handleCategoryChange(val) {
      getCategoryInfo(val[val.length - 1]).then((res) => {
        let detail = res.data.data
        this.generateParams(detail.goods_params)
        this.generateSpec(detail.goods_spec)
        // 切换分类后，如果有已保存的规格数据，需要重新恢复勾选状态
        if (this.isEditor && this.editingSkus && this.editingSkus.length > 0) {
          this.editingSkus.forEach((item) => {
            if (item.item_spec && item.item_spec.length > 0) {
              item.item_spec.forEach((child) => {
                let checkedIndex = this.skus.findIndex((n) => child.spec_id === n.sku_id)
                if (checkedIndex > -1) {
                  let isin = this.skus[checkedIndex].checked_sku.findIndex(
                    (k) => child.spec_value_id === k
                  )
                  if (isin === -1) {
                    this.skus[checkedIndex].checked_sku.push(child.spec_value_id)
                  }
                }
              })
            }
          })
          this.updateSku()
        }
      })
    },
    generateParams(data) {
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
    handleSkuName(val, id) {
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
    generateSpec(data, savedSpecItems = null) {
      let skus = []

      data.forEach((item) => {
        let specs = []
        let specValueIds = new Set()

        // 先添加分类中的规格值
        item.attribute_values.list.forEach((spec) => {
          if (!spec.custom_attribute_value) {
            Object.assign(spec, { custom_attribute_value: spec.attribute_value })
          }
          specs.push(spec)
          specValueIds.add(spec.attribute_value_id)
        })

        // 如果已保存的规格值不在分类的规格值列表中，也要添加进去
        // 这样可以确保新勾选的规格值能够正确显示和恢复
        if (savedSpecItems && savedSpecItems.length > 0) {
          savedSpecItems.forEach((savedItem) => {
            if (savedItem.item_spec && savedItem.item_spec.length > 0) {
              savedItem.item_spec.forEach((savedSpec) => {
                // 如果这个规格值属于当前规格（spec_id匹配），且不在列表中，则添加
                if (
                  savedSpec.spec_id === item.attribute_id &&
                  !specValueIds.has(savedSpec.spec_value_id)
                ) {
                  // 创建一个新的规格值对象，使用已保存的数据
                  specs.push({
                    attribute_value_id: savedSpec.spec_value_id,
                    attribute_value: savedSpec.spec_value_name || '',
                    custom_attribute_value:
                      savedSpec.spec_custom_value_name || savedSpec.spec_value_name || ''
                  })
                  specValueIds.add(savedSpec.spec_value_id)
                }
              })
            }
          })
        }

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
    submitItemsAction: function () {
      // 提交商品
      // if (+this.form.market_price < +this.form.rebate) {
      //   this.$confirm('当前店铺佣金大于商品市场价, 是否继续保存?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then((res) => {
      //     this.submitItemsActionConfirm()
      //   }).catch(() => {
      //     return
      //   })
      // } else {
      this.submitItemsActionConfirm()
      // }
    },
    submitItemsActionConfirm() {
      this.submitLoading = true
      const that = this
      let formSkuItem = this.editingSkus

      if (this.mode === 'component') {
        this.form.intro = JSON.stringify(this.content)
      }
      if (this.selectedMainCategory.length > 0) {
        this.form.item_main_cat_id = this.selectedMainCategory[this.selectedMainCategory.length - 1]
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
        this.$message({ message: this.$t('4b43f5ef.4f9c70'), type: 'error' })
        return
      }
      this.form.spec_images = JSON.stringify(this.specImages)
      this.form.spec_items = JSON.stringify(formSkuItem)
      const itemCategory = this.form.item_category || []
      const submitForm = {
        ...this.form,
        item_category: itemCategory.map((item) =>
          item && item.length ? item[item.length - 1] : item
        )
      }
      if (this.form.item_id && !this.is_new) {
        updateItems(this.form.item_id, submitForm)
          .then((response) => {
            this.$message({
              message: this.$t('4b43f5ef.55aa63'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.submitLoading = false
                that.refresh()
                that.isLeave = true
                that.$router.go(-1)
              }
            })
          })
          .catch((error) => {
            this.submitLoading = false
          })
      } else {
        createItems(submitForm)
          .then((response) => {
            this.$message({
              message: this.$t('4b43f5ef.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.submitLoading = false
                that.refresh()
                that.isLeave = true
                that.$router.go(-1)
              }
            })
          })
          .catch((error) => {
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
    async addImgPreview() {
      try {
        const { data } = await this.$picker.image({
          multiple: true,
          num: 20 // 最多选择20张图片
        })

        if (data && data.length > 0) {
          // 直接将图片插入到富文本内容中
          let imgHtml = ''
          data.forEach((item) => {
            const imgUrl = (item && item.url) || item || ''
            if (imgUrl) {
              // 如果包含 wximageurl，则提取相对路径
              let finalUrl = imgUrl
              if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
                finalUrl = imgUrl.replace(this.wximageurl, '')
              }
              const imageUrl = this.wximageurl + finalUrl
              imgHtml += `<img src="${imageUrl}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`
            }
          })

          if (imgHtml) {
            // 将图片HTML追加到现有内容中
            this.form.intro = this.form.intro + imgHtml
            this.$message.success(this.$t('4b43f5ef.cc33a9'))
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    //品牌LOGO
    async handleImgChange() {
      try {
        const { data } = await this.$picker.image()

        // 获取图片URL，可能是对象中的url属性，也可能是直接的字符串
        const imgUrl = (data && data.url) || data || ''

        if (imgUrl) {
          // 如果包含 wximageurl，则提取相对路径
          if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
            // 这里需要根据实际使用的字段来设置，目前没有看到具体使用的地方
            // 如果需要设置品牌LOGO，可以在这里添加相应的逻辑
            console.log('品牌LOGO图片:', imgUrl.replace(this.wximageurl, ''))
          }
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    //视频
    pickVideo(data) {
      this.form.videos = data.media_id
      this.form.videos_url = data.url
    },
    //上传商品图（9张）
    async handlePicsChange() {
      try {
        const remaining = 9 - this.picsOldLen
        if (remaining <= 0) {
          this.$message.error(this.$t('4b43f5ef.4352be'))
          return
        }

        const { data } = await this.$picker.image({
          multiple: true,
          num: remaining
        })

        if (data && data.length > 0) {
          data.forEach((item) => {
            const imgUrl = (item && item.url) || item || ''
            if (imgUrl) {
              // 如果包含 wximageurl，则提取相对路径
              let finalUrl = imgUrl
              if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
                finalUrl = imgUrl.replace(this.wximageurl, '')
              }
              this.form.pics.push(finalUrl)
              this.picsOldLen = this.form.pics.length
            }
          })
        }
      } catch (error) {
        // 用户取消选择时不处理错误
        console.log('图片选择已取消')
      }
    },
    async handleSkuImg(index) {
      try {
        this.currentSku = index
        const remaining = 5 - this.specImages[index].item_image_url.length
        if (remaining <= 0) {
          this.$message.error(this.$t('4b43f5ef.5bd788'))
          this.currentSku = -1
          return
        }

        const { data } = await this.$picker.image({
          multiple: true,
          num: remaining
        })

        if (data && data.length > 0) {
          data.forEach((item) => {
            const imgUrl = (item && item.url) || item || ''
            if (imgUrl) {
              // 如果包含 wximageurl，则提取相对路径
              let finalUrl = imgUrl
              if (this.wximageurl && imgUrl.indexOf(this.wximageurl) === 0) {
                finalUrl = imgUrl.replace(this.wximageurl, '')
              }
              this.specImages[index].item_image_url.push(finalUrl)
            }
          })
        }
        this.currentSku = -1
      } catch (error) {
        // 用户取消选择时不处理错误
        this.currentSku = -1
        console.log('图片选择已取消')
      }
    },
    fillSku() {
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
    clearSku(index) {
      this.$confirm(this.$t('4b43f5ef.3dd6cf'), this.$t('4b43f5ef.02d981'), {
        confirmButtonText: this.$t('4b43f5ef.38cf16'),
        cancelButtonText: this.$t('4b43f5ef.625fb2'),
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
    picsEnter(index) {
      this.picsCurrent = index
    },
    picsLeave() {
      this.picsCurrent = -1
    },
    removePicsImg: function (index) {
      this.form.pics.splice(index, 1)
      this.picsOldLen = this.form.pics.length
    },
    handleSkuChange(data) {
      this.updateSku()
    },
    updateSku() {
      let arr = []
      let skus = []
      this.skus.forEach((item) => {
        if (item.checked_sku.length > 0) {
          arr.push(item)
        }
      })
      if (arr.length > 0) {
        let n = arr.findIndex((item) => {
          // 确保 is_image 存在且不为空
          if (!item.is_image || item.is_image.trim() === '') {
            return false
          }
          try {
            const parsed = JSON.parse(item.is_image)
            return !!parsed
          } catch (e) {
            return false
          }
        })
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
              if (issue) {
                // 如果用户修改了自定义名称，用自定义名称更新 spec_value_name
                const customValue = issue.custom_attribute_value || ''
                let obj = {
                  spec_id: item.sku_id,
                  spec_value_id: issue.attribute_value_id,
                  spec_value_name: customValue || issue.attribute_value,
                  spec_custom_value_name: customValue
                }
                skuGroup.push(obj)
              }
            })
            skus.push(skuGroup)
          }
        })

        let allSku = this.generateSkus(skus)
        // if (this.skus.length > 1 && !allSku[0].length) {
        //   return false
        // }
        let skuList = []
        allSku.forEach((item) => {
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
            point: '',
            pay_class: '',
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
          let childs = skuList.slice(
            i * this.specPagesize,
            i * this.specPagesize + this.specPagesize
          )
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
        list.forEach((item) => {
          item.forEach((child) => {
            store.dispatch('setSku', child)
          })
        })
        this.specItems = list
      } else {
        this.specItems = []
      }
    },
    getSkuName(id, skus) {
      let sku = skus.find((item) => id === item.attribute_value_id)
      if (sku) {
        return sku.attribute_value
      }
    },
    generateSkuids(data) {
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
    generateSkus(data) {
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
    renderRequire(h, { column }) {
      return h(
        'span',
        {
          class: 'mark'
        },
        '*' + column.label
      )
    },
    handleContent(data) {
      this.content = data
    },
    deleteVideo() {
      this.itemVideo = {}
      this.form.videos = ''
      this.form.videos_url = ''
    },
    // 获取品牌列表
    getBrandList(searchVal = '', isInit = false) {
      const list = []
      getGoodsAttr({
        page: 1,
        pageSize: 1000,
        attribute_type: 'brand',
        attribute_name: searchVal,
        attribute_ids: isInit ? this.form.brand_id : ''
      }).then((res) => {
        for (let item of res.data.data.list) {
          list.push({ attribute_name: item.attribute_name, attribute_id: item.attribute_id })
        }
        this.brandList = list
      })
    },
    init() {
      this.getBrandList('', true)
      const templatesPromise = getShippingTemplatesList(this.templatesListParams).then((response) => {
        if (response.data.data.list.length > 0) {
          for (var i in response.data.data.list) {
            this.templatesList.push({
              template_id: response.data.data.list[i].template_id,
              name: response.data.data.list[i].name
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: this.$t('4b43f5ef.e9d74f')
          })
          this.$router.push({ path: this.matchInternalRoute('shippingtemplates') })
        }
      })

      const categoryPromise = getCategory({ is_show: false }).then((response) => {
        const res = response.data.data
        function _deepCategory(cate, temp) {
          cate.forEach((item) => {
            const _temp = {
              label: item.category_name,
              value: item.category_id
            }
            if (item.children) {
              _temp.children = []
              _deepCategory(item.children, _temp.children)
            }
            temp.push(_temp)
          })
        }
        const saleCategoryList = []
        _deepCategory(res, saleCategoryList)
        this.saleCategoryList = saleCategoryList
        if (this.$route.params.itemId && this.form.item_category_temp) {
          this.form.item_category = this.deepSalesCategory(this.form.item_category_temp)
          delete this.form.item_category_temp
        }
      })
      return Promise.all([templatesPromise, categoryPromise])
    },
    // profitStatusChange(val) {
    //   if (val) {
    //     this.form.is_profit = true
    //   } else {
    //     this.form.is_profit = false
    //   }
    // },
    deepSalesCategory(value) {
      const { saleCategoryList } = this
      function findPathById(tree, id, path) {
        if (typeof path === 'undefined') {
          path = []
        }
        for (let i = 0; i < tree.length; i++) {
          const tempPath = [...path]
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
      const list = []
      value.forEach((v) => {
        list.push(findPathById(saleCategoryList, v))
      })
      return list
    },
    // select值变化
    paramsChange(e) {
      const params = this.params
      for (let i = 0; i < params.length; i++) {
        if (params[i].children && params[i].children.length > 0) {
          const children = params[i].children
          const isHave = children.findIndex((item) => item.value == e)
          if (isHave !== -1) {
            this.form.item_params[i].attribute_value_name = children[isHave].label
            break
          }
        }
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isLeave) {
      this.$confirm(this.$t('4b43f5ef.3ba67c'), this.$t('4b43f5ef.02d981'), {
        confirmButtonText: this.$t('4b43f5ef.38cf16'),
        cancelButtonText: this.$t('4b43f5ef.625fb2'),
        type: 'warning'
      })
        .then((res) => {
          store.dispatch('clearSkus')
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      store.dispatch('clearSkus')
      next()
    }
  }
}
</script>
<style lang="scss">
/* 表单很高时，默认 loading 会居中在整页表单中部；改为固定视口遮罩 */
.pointmall-add-loading {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  z-index: 2000 !important;
}
.el-cascader {
  width: 100%;

  .el-input {
    width: 100%;
    max-width: initial;
  }
}
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

.rich-text-editor {
  width: 100% !important;
  .vue-html5-editor {
    width: 100% !important;
  }
}
</style>
