<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-form ref="form" v-loading="loading" :model="form" class="box-set" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="8">
          <section class="section section-white">
            <el-form-item :label="$t('477a43bd.fad9b7')">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item :label="$t('477a43bd.f3171a')">
              <el-radio v-if="templatesId" v-model="form.is_free" disabled label="0">
                {{ $t('d41d8cd9.b2c3d4') }}
              </el-radio>
              <el-radio v-else v-model="form.is_free" label="0">
                {{ $t('d41d8cd9.b2c3d4') }}
              </el-radio>
              <el-radio v-if="templatesId" v-model="form.is_free" disabled label="1">
                {{ $t('d41d8cd9.f8g9h0') }}
              </el-radio>
              <el-radio v-else v-model="form.is_free" label="1">
                {{ $t('d41d8cd9.f8g9h0') }}
              </el-radio>
              <p class="frm-tips">{{ $t('d41d8cd9.h8i9j0') }}</p>
            </el-form-item>
            <el-form-item v-show="form.is_free == 0" :label="$t('477a43bd.99caba')">
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="1">
                {{ $t('d41d8cd9.k1l2m3') }}
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="1">
                {{ $t('d41d8cd9.k1l2m3') }}
              </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="2">
                {{ $t('d41d8cd9.n4o5p6') }}
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="2">
                {{ $t('d41d8cd9.n4o5p6') }}
              </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="3">
                {{ $t('d41d8cd9.q7r8s9') }}
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="3">
                {{ $t('d41d8cd9.q7r8s9') }}
              </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="4">
                {{ $t('d41d8cd9.t0u1v2') }}
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="4">
                {{ $t('d41d8cd9.t0u1v2') }}
              </el-radio>
              <p class="frm-tips">{{ $t('d41d8cd9.w3x4y5') }}</p>
            </el-form-item>
            <el-form-item :label="$t('477a43bd.84d6a9')">
              <el-radio v-model="form.status" label="1"> {{ $t('d41d8cd9.z6a7b8') }} </el-radio>
              <el-radio v-model="form.status" label="0"> {{ $t('d41d8cd9.c9d0e1') }} </el-radio>
            </el-form-item>
            <el-form-item v-show="form.is_free == 1" :label="$t('477a43bd.411d4a')">
              <section class="section section-white shipping-calc">
                <p class="font-bold">{{ $t('d41d8cd9.f2g3h4') }}</p>
                <p v-if="nopost_self_conf && nopost_self_conf.length > 0" class="font-bold nopost">
                  {{ nopost_self_conf | formatCityData(district) }}
                </p>
                <p v-else class="font-bold nopost">{{ $t('d41d8cd9.i5j6k7') }}</p>
                <div class="content-v-padded">
                  <el-button type="primary" size="mini" @click="handleSelfNoPostEditArea()">
                    {{ $t('d41d8cd9.l8m9n0') }}
                  </el-button>
                </div>
              </section>
            </el-form-item>
          </section>
        </el-col>
        <el-col v-show="form.is_free == 0" :span="16">
          <section v-show="form.valuation == 1" class="section section-white">
            <p class="font-bold">{{ $t('d41d8cd9.o1p2q3') }}:</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.r4s5t6') }}:</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.u7v8w9') }}
                <el-input v-model="fee_conf[0].start_standard" size="mini" style="width: 100px" />
                {{ $t('d41d8cd9.x0y1z2') }}
                <el-input v-model="fee_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">{{ $t('d41d8cd9.a3b4c5') }}:</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.www1xx') }}
                <el-input
                  v-model="fee_conf[0].add_standard"
                  class="inline-input"
                  style="width: 100px"
                />
                {{ $t('d41d8cd9.yyy3zz') }}
                <el-input v-model="fee_conf[0].add_fee" class="inline-input" style="width: 100px" />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.m5n6o7') }}</p>
              <el-table :data="fee_conf.slice(1)" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.4aed3f')" width="200">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleWeightFeeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.8c0d75')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.23e30a')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.1ed90e')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.0dc2ad')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleWeightFeeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('fee_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.f2g3h4') }}</p>
              <p v-if="nopost_conf && nopost_conf.length > 0" class="font-bold nopost">
                {{ nopost_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">{{ $t('d41d8cd9.aaa1bb') }}</p>
              <div class="content-v-padded">
                <el-button type="primary" size="mini" @click="handleWeightNoPostEditArea()">
                  {{ $t('d41d8cd9.bbb3cc') }}
                </el-button>
              </div>
            </section>
            <p class="font-bold">
              <el-checkbox v-model="priceFreeStatus" :value="priceFreeStatus" />
              {{ $t('d41d8cd9.s1t2u3') }}
            </p>
            <section v-if="priceFreeStatus" class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.p8q9r0') }}</p>
              <el-table :data="free_conf" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.df53d0')" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleWeightFreeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.ad40d2')">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      :placeholder="$t('477a43bd.708c9d')"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span v-if="1 == scope.row.freetype || 3 == scope.row.freetype"
                      >{{ $t('d41d8cd9.c7d8e9') }}&nbsp;<el-input
                        v-model="scope.row.inweight"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.i3j4k5') }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.n2o3p4') }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleWeightFreeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
          </section>
          <section v-show="form.valuation == 2" class="section section-white">
            <p class="font-bold">{{ $t('d41d8cd9.ccc5dd') }}</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.ddd7ee') }}</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.v4w5x6') }}
                <el-input
                  v-model="fee_number_conf[0].start_standard"
                  size="mini"
                  style="width: 100px"
                />
                {{ $t('d41d8cd9.x0y1z2') }}
                <el-input v-model="fee_number_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">{{ $t('d41d8cd9.y7z8a9') }}</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.b0c1d2') }}
                <el-input
                  v-model="fee_number_conf[0].add_standard"
                  size="mini"
                  style="width: 100px"
                />
                {{ $t('d41d8cd9.e3f4g5') }}
                <el-input v-model="fee_number_conf[0].add_fee" size="mini" style="width: 100px" />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.m5n6o7') }}</p>
              <el-table :data="fee_number_conf.slice(1)" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.4aed3f')">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleNumberFeeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.cb7d60')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.23e30a')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.a472ba')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.0dc2ad')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')" width="80">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleNumberFeeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('fee_number_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.f2g3h4') }}</p>
              <p
                v-if="nopost_number_conf && nopost_number_conf.length > 0"
                class="font-bold nopost"
              >
                {{ nopost_number_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">{{ $t('d41d8cd9.aaa1bb') }}</p>
              <div class="content-v-padded">
                <el-button type="primary" size="mini" @click="handleNumberNoPostEditArea()">
                  {{ $t('d41d8cd9.bbb3cc') }}
                </el-button>
              </div>
            </section>
            <p class="font-bold">
              <el-checkbox v-model="numberFreeStatus" :value="numberFreeStatus" />
              {{ $t('d41d8cd9.s1t2u3') }}
            </p>
            <section v-if="numberFreeStatus" class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.p8q9r0') }}</p>
              <el-table :data="free_number_conf" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.df53d0')" width="120">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleNumberFreeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.95c6aa')">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      :placeholder="$t('477a43bd.708c9d')"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in options_number"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span v-if="1 == scope.row.freetype || 3 == scope.row.freetype"
                      >{{ $t('d41d8cd9.h6i7j8') }}&nbsp;<el-input
                        v-model="scope.row.upquantity"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.k9l0m1') }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.n2o3p4') }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')" width="80">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleNumberFreeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_number_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
          </section>
          <section v-show="form.valuation == 3" class="section section-white">
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.m5n6o7') }}</p>
              <el-table :data="fee_money_conf" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.4aed3f')">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleMoneyFeeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.785b74')" width="300">
                  <template slot-scope="scope">
                    <div
                      v-for="(money_key, money_index) in scope.row.rules"
                      style="margin-top: 5px"
                    >
                      <el-input
                        v-model="money_key.up"
                        disabled
                        class="inline-input"
                        style="width: 100px"
                      />
                      -
                      <el-input
                        v-if="money_key.now > 0"
                        v-model="money_key.down"
                        disabled
                        class="inline-input"
                        style="width: 100px"
                        @blur="handleInputDownMoney(money_key.down, money_index, scope.$index)"
                      />
                      <el-input
                        v-else
                        v-model="money_key.down"
                        class="inline-input"
                        style="width: 100px"
                        @blur="handleInputDownMoney(money_key.down, money_index, scope.$index)"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.ef79a9')" width="200">
                  <template slot-scope="scope">
                    <div v-for="money_key in scope.row.rules" style="margin-top: 5px">
                      <el-input
                        v-model="money_key.basefee"
                        class="inline-input"
                        style="width: 100px"
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="add_standard" :label="$t('477a43bd.2b6bc0')" width="100">
                  <template slot-scope="scope">
                    <div
                      v-for="(money_key, money_index) in scope.row.rules"
                      v-if="scope.row.rules.length - 1 == money_index"
                    >
                      <el-button
                        v-if="scope.$index != 0 || money_index != 0"
                        size="mini"
                        icon="delete"
                        type="danger"
                        @click="handleMoneyFeeDeleteArea(scope.$index, money_index)"
                      >
                        {{ $t('d41d8cd9.g9h0i1') }}
                      </el-button>
                    </div>
                    <div v-else style="height: 45px" />
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('fee_money_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.f2g3h4') }}</p>
              <p v-if="nopost_money_conf && nopost_money_conf.length > 0" class="font-bold nopost">
                {{ nopost_money_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">{{ $t('d41d8cd9.aaa1bb') }}</p>
              <div class="content-v-padded">
                <el-button type="primary" size="mini" @click="handleMoneyNoPostEditArea()">
                  {{ $t('d41d8cd9.bbb3cc') }}
                </el-button>
              </div>
            </section>
          </section>
          <section v-show="form.valuation == 4" class="section section-white">
            <p class="font-bold">{{ $t('d41d8cd9.ccc5dd') }}</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.ddd7ee') }}</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.t8u9v0') }}
                <el-input
                  v-model="fee_volume_conf[0].start_standard"
                  size="mini"
                  style="width: 100px"
                />
                {{ $t('d41d8cd9.x0y1z2') }}
                <el-input v-model="fee_volume_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">{{ $t('d41d8cd9.w1x2y3') }}</p>
              <el-form-item label-width="140">
                {{ $t('d41d8cd9.z4a5b6') }}
                <el-input
                  v-model="fee_volume_conf[0].add_standard"
                  class="inline-input"
                  style="width: 100px"
                />
                {{ $t('d41d8cd9.e3f4g5') }}
                <el-input
                  v-model="fee_volume_conf[0].add_fee"
                  class="inline-input"
                  style="width: 100px"
                />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.m5n6o7') }}</p>
              <el-table :data="fee_volume_conf.slice(1)" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.4aed3f')" width="200">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleVolumeFeeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.748118')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.23e30a')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2e42ab')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.0dc2ad')">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleVolumeFeeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('fee_volume_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.f2g3h4') }}</p>
              <p
                v-if="nopost_volume_conf && nopost_volume_conf.length > 0"
                class="font-bold nopost"
              >
                {{ nopost_volume_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">{{ $t('d41d8cd9.aaa1bb') }}</p>
              <div class="content-v-padded">
                <el-button type="primary" size="mini" @click="handleVolumeNoPostEditArea()">
                  {{ $t('d41d8cd9.bbb3cc') }}
                </el-button>
              </div>
            </section>
            <p class="font-bold">
              <el-checkbox v-model="volumeFreeStatus" :value="volumeFreeStatus" />
              {{ $t('d41d8cd9.s1t2u3') }}
            </p>
            <section v-if="volumeFreeStatus" class="section section-white shipping-calc">
              <p class="font-bold">{{ $t('d41d8cd9.p8q9r0') }}</p>
              <el-table :data="free_volume_conf" style="width: 100%" border>
                <el-table-column :label="$t('477a43bd.df53d0')" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleVolumeFreeEditArea(scope.$index, scope.row)"
                    >
                      {{ $t('d41d8cd9.d6e7f8') }}
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.80ef80')">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      :placeholder="$t('477a43bd.708c9d')"
                      style="width: 100px"
                    >
                      <el-option
                        v-for="item in options_volume"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span v-if="1 == scope.row.freetype || 3 == scope.row.freetype"
                      >{{ $t('d41d8cd9.c7d8e9') }}&nbsp;<el-input
                        v-model="scope.row.upvolume"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.f0g1h2') }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;{{ $t('d41d8cd9.n2o3p4') }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column :label="$t('477a43bd.2b6bc0')" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleVolumeFreeDeleteArea(scope.$index)"
                    >
                      {{ $t('d41d8cd9.g9h0i1') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_volume_conf')"
                >
                  {{ $t('d41d8cd9.j2k3l4') }}
                </el-button>
              </div>
            </section>
          </section>
        </el-col>
      </el-row>
      <div class="section-footer with-border content-center clearfix">
        <el-button type="primary" @click="submitSaveAction">
          {{ $t('d41d8cd9.l6m7n8') }}
        </el-button>
      </div>
      <el-dialog :title="$t('477a43bd.97d03d')" :visible.sync="dialogAreaFormVisible" width="960px">
        <el-row>
          <el-col :span="6">
            <el-row class="province-list">
              <el-col>{{ $t('d41d8cd9.o9p0q1') }}</el-col>
              <el-col
                v-for="(item, index) in areaInfo"
                :key="'province' + index"
                :style="provinceIndex == index ? 'background: #ddd' : ''"
              >
                <el-checkbox
                  v-model="item.checked"
                  :value="item.value"
                  style="width: 50%"
                  @change="handleCheckProvinceChange(index, item.checked)"
                >
                  {{ item.label }}
                </el-checkbox>
                <div class="el-icon-caret-right" @click="handlechildProvinceChoose(index)" />
              </el-col>
            </el-row>
          </el-col>
          <el-col v-if="provinceIndex > -1" :span="6">
            <el-row class="city-list">
              <el-col>{{ $t('d41d8cd9.r2s3t4') }}</el-col>
              <el-col
                v-for="(item, index) in areaInfo[provinceIndex].children"
                :key="'city' + index"
                :style="cityIndex == index ? 'background: #ddd' : ''"
              >
                <el-checkbox
                  v-model="item.checked"
                  :value="item.value"
                  style="width: 50%"
                  @change="handleCheckCityChange(index, item.checked)"
                >
                  {{ item.label | subStr(12) }}
                </el-checkbox>
                <div class="el-icon-caret-right" @click="handlechildCityChoose(index)" />
              </el-col>
            </el-row>
          </el-col>
          <el-col v-else :span="6">
            <el-row class="region-list">
              <el-col>{{ $t('d41d8cd9.r2s3t4') }}</el-col>
            </el-row>
          </el-col>
          <el-col v-if="cityIndex > -1" :span="6">
            <el-row class="region-list">
              <el-col>{{ $t('d41d8cd9.u5v6w7') }}</el-col>
              <el-col
                v-for="(item, index) in areaInfo[provinceIndex].children[cityIndex].children"
                :key="'city' + index"
              >
                <el-checkbox
                  v-model="item.checked"
                  :value="item.value"
                  @change="handleCheckRegionChange(index, item.checked)"
                >
                  {{ item.label | subStr(12) }}
                </el-checkbox>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-else :span="6">
            <el-row class="region-list">
              <el-col>{{ $t('d41d8cd9.u5v6w7') }}</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row class="region-list">
              <el-col>
                {{ $t('d41d8cd9.x8y9z0') }}<br />
                {{ conf_area | formatCityData(district, false) }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAreaFormVisible = false">
            {{ $t('d41d8cd9.a1b2c3') }}
          </el-button>
          <el-button type="primary" @click="handleAreaChooseFinish">
            {{ $t('d41d8cd9.d4e5f6') }}
          </el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import {
  getShippingTemplatesInfo,
  createShippingTemplates,
  updateShippingTemplates
} from '../../../../api/shipping'
import districtOptions from '@/mixins/districtOptions'
//匹配省市区
export default {
  mixins: [districtOptions],
  inject: ['refresh'],
  data() {
    return {
      loading: true,
      templatesId: '',
      numberFreeStatus: true,
      priceFreeStatus: true,
      volumeFreeStatus: true,
      dialogAreaFormVisible: false,
      areaInfoCount: [],
      childChoose: [],
      areaInfo: [],
      provinceIndex: -1,
      cityIndex: -1,
      provinceInfoBackground: '',
      cityInfoBackground: '',
      regionInfoBackground: '',
      areaInfoCount: [],
      form: {
        name: '',
        is_free: '0',
        valuation: '1',
        status: '1',
        fee_conf: [],
        nopost_conf: [],
        free_conf: []
      },
      fee_conf: [
        {
          start_standard: '',
          start_fee: '',
          add_standard: '',
          add_fee: ''
        }
      ],
      nopost_conf: [],
      nopost_number_conf: [],
      nopost_money_conf: [],
      nopost_volume_conf: [],
      nopost_self_conf: [],
      conf_id: null,
      conf_name: '',
      free_conf: [
        {
          area: '0',
          freetype: '1',
          inweight: '',
          upmoney: ''
        }
      ],
      conf_area: [],
      fee_number_conf: [
        {
          start_standard: '',
          start_fee: '',
          add_standard: '',
          add_fee: ''
        }
      ],
      free_number_conf: [
        {
          area: '0',
          freetype: '1',
          upquantity: '',
          upmoney: ''
        }
      ],
      fee_volume_conf: [
        {
          start_standard: '',
          start_fee: '',
          add_standard: '',
          add_fee: ''
        }
      ],
      free_volume_conf: [
        {
          area: '0',
          freetype: '1',
          upvolume: '',
          upmoney: ''
        }
      ],
      fee_money_conf: [
        {
          area: '0',
          rules: [
            {
              up: 0.0,
              down: '',
              basefee: ''
            }
          ]
        }
      ],
      options: [
        {
          label: this.$t('477a43bd.fcd943'),
          value: '1'
        },
        {
          label: this.$t('477a43bd.4cf24a'),
          value: '2'
        },
        {
          label: this.$t('477a43bd.ee0422'),
          value: '3'
        }
      ],
      options_number: [
        {
          label: this.$t('477a43bd.e4f48b'),
          value: '1'
        },
        {
          label: this.$t('477a43bd.4cf24a'),
          value: '2'
        },
        {
          label: this.$t('477a43bd.87b0b8'),
          value: '3'
        }
      ],
      options_volume: [
        {
          label: this.$t('477a43bd.972d5f'),
          value: '1'
        },
        {
          label: this.$t('477a43bd.4cf24a'),
          value: '2'
        },
        {
          label: this.$t('477a43bd.a39163'),
          value: '3'
        }
      ],
      rule: {
        name: [{ required: true, message: this.$t('477a43bd.920abc'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getAddress()
    if (this.$route.params.templatesId) {
      this.templatesId = this.$route.params.templatesId
      getShippingTemplatesInfo(this.templatesId).then((res) => {
        if (res.data.data) {
          this.form.name = res.data.data.name
          this.form.is_free = res.data.data.is_free
          res.data.data.nopost_conf = JSON.parse(res.data.data.nopost_conf)
          if (this.form.is_free != 1) {
            this.form.valuation = res.data.data.valuation
            this.form.status = res.data.data.status ? '1' : '0'
            res.data.data.fee_conf = JSON.parse(res.data.data.fee_conf)
            res.data.data.free_conf = JSON.parse(res.data.data.free_conf)
            switch (res.data.data.valuation) {
              case '1':
                this.fee_conf = res.data.data.fee_conf
                this.free_conf = res.data.data.free_conf
                this.nopost_conf = res.data.data.nopost_conf
                break
              case '2':
                this.fee_number_conf = res.data.data.fee_conf
                this.free_number_conf = res.data.data.free_conf
                this.nopost_number_conf = res.data.data.nopost_conf
                break
              case '3':
                this.fee_money_conf = res.data.data.fee_conf
                this.nopost_money_conf = res.data.data.nopost_conf
                for (var item in this.fee_money_conf) {
                  for (var rules_item in this.fee_money_conf[item].rules) {
                    this.fee_money_conf[item].rules[rules_item].now =
                      this.fee_money_conf[item].rules[rules_item].down
                    this.$set(
                      this.fee_money_conf[item].rules,
                      rules_item,
                      this.fee_money_conf[item].rules[rules_item]
                    )
                  }
                }
                break
              case '4':
                this.fee_volume_conf = res.data.data.fee_conf
                this.free_volume_conf = res.data.data.free_conf
                this.nopost_volume_conf = res.data.data.nopost_conf
                break
            }
          } else {
            this.nopost_self_conf = res.data.data.nopost_conf
          }
        }
      })
    }
  },
  methods: {
    submitSaveAction() {
      const that = this
      if (!this.form.name) {
        this.$message.error(this.$t('477a43bd.ea85b5'))
        return
      }
      switch (this.form.valuation) {
        case '1':
          this.form.fee_conf = this.fee_conf
          this.form.free_conf = this.priceFreeStatus ? this.free_conf : []
          this.form.nopost_conf = this.nopost_conf
          break
        case '2':
          this.form.fee_conf = this.fee_number_conf
          this.form.free_conf = this.numberFreeStatus ? this.free_number_conf : []
          this.form.nopost_conf = this.nopost_number_conf
          break
        case '3':
          this.form.fee_conf = this.fee_money_conf
          this.form.nopost_conf = this.nopost_money_conf
          break
        case '4':
          this.form.fee_conf = this.fee_volume_conf
          this.form.free_conf = this.volumeFreeStatus ? this.free_volume_conf : []
          this.form.nopost_conf = this.nopost_volume_conf
          break
      }

      if (0 == this.form.is_free) {
        if (3 == this.form.valuation) {
          for (var i in this.form.fee_conf) {
            for (var j in this.form.fee_conf[i].rules) {
              if (this.form.fee_conf[i].rules[j].basefee === '') {
                this.$message.error(this.$t('477a43bd.8408b0'))
                return
              }
            }
          }
        } else {
          if (
            !this.form.fee_conf[0].start_standard ||
            !this.form.fee_conf[0].start_fee ||
            !this.form.fee_conf[0].add_standard ||
            !this.form.fee_conf[0].add_fee
          ) {
            this.$message.error(this.$t('477a43bd.63162f'))
            return
          }
        }
      } else {
        this.form.nopost_conf = this.nopost_self_conf
      }
      if (this.templatesId) {
        updateShippingTemplates(this.templatesId, this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              message: this.$t('477a43bd.55aa63'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          }
        })
      } else {
        createShippingTemplates(this.form).then((res) => {
          if (res.data.data) {
            this.$message({
              message: this.$t('477a43bd.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          }
        })
      }
    },
    // 选择地区
    handleAddArea(type) {
      var conf = []
      switch (type) {
        case 'fee_conf':
          conf = this.fee_conf
          break
        case 'free_conf':
          conf = this.free_conf
          break
        case 'fee_number_conf':
          conf = this.fee_number_conf
          break
        case 'free_number_conf':
          conf = this.free_number_conf
          break
        case 'fee_volume_conf':
          conf = this.fee_volume_conf
          break
        case 'free_volume_conf':
          conf = this.free_volume_conf
          break
        case 'fee_money_conf':
          conf = this.fee_money_conf
          break
      }
      this.conf_name = type
      this.formatCityDataClear(conf)
      this.conf_id = null
      this.conf_area = []
      this.provinceIndex = -1
      this.cityIndex = -1
      this.dialogAreaFormVisible = true
    },
    handleSelfNoPostEditArea() {
      this.formatCityDataEdit([], this.nopost_self_conf)
      this.conf_area = JSON.parse(JSON.stringify(this.nopost_self_conf))
      this.conf_name = 'nopost_self_conf'
      this.dialogAreaFormVisible = true
    },
    // 按重量运费修改
    handleWeightFeeEditArea(index, row) {
      this.formatCityDataEdit(this.fee_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'fee_conf'
      this.conf_id = index + 1
      this.dialogAreaFormVisible = true
    },
    handleWeightNoPostEditArea() {
      this.formatCityDataEdit([], this.nopost_conf)
      this.conf_area = JSON.parse(JSON.stringify(this.nopost_conf))
      this.conf_name = 'nopost_conf'
      this.dialogAreaFormVisible = true
    },
    // 按重量包邮修改
    handleWeightFreeEditArea(index, row) {
      this.formatCityDataEdit(this.free_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'free_conf'
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    // 按重量运费修改
    handleVolumeFeeEditArea(index, row) {
      this.formatCityDataEdit(this.fee_volume_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'fee_volume_conf'
      this.conf_id = index + 1
      this.dialogAreaFormVisible = true
    },
    handleVolumeNoPostEditArea() {
      this.formatCityDataEdit([], this.nopost_volume_conf)
      this.conf_area = JSON.parse(JSON.stringify(this.nopost_volume_conf))
      this.conf_name = 'nopost_volume_conf'
      this.dialogAreaFormVisible = true
    },
    // 按重量包邮修改
    handleVolumeFreeEditArea(index, row) {
      this.formatCityDataEdit(this.free_volume_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'free_volume_conf'
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    // 按件数运费修改
    handleNumberFeeEditArea(index, row) {
      this.formatCityDataEdit(this.fee_number_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'fee_number_conf'
      this.conf_id = index + 1
      this.dialogAreaFormVisible = true
    },
    handleNumberNoPostEditArea() {
      this.formatCityDataEdit([], this.nopost_number_conf)
      this.conf_area = JSON.parse(JSON.stringify(this.nopost_number_conf))
      this.conf_name = 'nopost_number_conf'
      this.dialogAreaFormVisible = true
    },
    // 按件数包邮修改
    handleNumberFreeEditArea(index, row) {
      this.formatCityDataEdit(this.free_number_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'free_number_conf'
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    // 按金额运费修改
    handleMoneyFeeEditArea(index, row) {
      this.formatCityDataEdit(this.fee_money_conf, row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = 'fee_money_conf'
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    handleMoneyNoPostEditArea() {
      this.formatCityDataEdit([], this.nopost_money_conf)
      this.conf_area = JSON.parse(JSON.stringify(this.nopost_money_conf))
      this.conf_name = 'nopost_money_conf'
      this.dialogAreaFormVisible = true
    },
    // 按重量运费删除
    handleWeightFeeDeleteArea(index) {
      this.fee_conf.splice(index + 1, 1)
    },
    // 按重量包邮删除
    handleWeightFreeDeleteArea(index) {
      this.free_conf.splice(index, 1)
    },
    // 按体积运费删除
    handleVolumeFeeDeleteArea(index) {
      this.fee_volume_conf.splice(index + 1, 1)
    },
    // 按体积包邮删除
    handleVolumeFreeDeleteArea(index) {
      this.free_volume_conf.splice(index, 1)
    },
    // 按件数运费删除
    handleNumberFeeDeleteArea(index) {
      this.fee_number_conf.splice(index + 1, 1)
    },
    // 按金额运费删除
    handleMoneyFeeDeleteArea(index, money_index) {
      for (var item in this.fee_money_conf) {
        if (
          money_index > 0 &&
          this.fee_money_conf[item] &&
          this.fee_money_conf[item].rules.length > 0
        ) {
          this.fee_money_conf[index].rules.splice(money_index, 1)
          this.fee_money_conf[index].rules[money_index - 1].now = 0
        } else {
          this.fee_money_conf.splice(index, 1)
        }
      }
    },
    // 按件数包邮删除
    handleNumberFreeDeleteArea(index) {
      this.free_number_conf.splice(index, 1)
    },
    // 地区选择完成
    handleAreaChooseFinish() {
      if (this.conf_area.length == 0) {
        this.$message({
          type: 'error',
          message: this.$t('477a43bd.ad1a24')
        })
        return false
      }
      switch (this.conf_name) {
        case 'fee_conf':
          if (this.conf_id !== null) {
            this.fee_conf[this.conf_id].area = this.conf_area
            this.$set(this.fee_conf, this.conf_id, this.fee_conf[this.conf_id])
          } else {
            this.fee_conf.push({
              area: this.conf_area.sort(),
              start_standard: '',
              start_fee: '',
              add_standard: '',
              add_fee: ''
            })
          }
          break
        case 'nopost_conf':
          this.nopost_conf = this.conf_area.sort()
          break
        case 'nopost_self_conf':
          this.nopost_self_conf = this.conf_area.sort()
          break
        case 'nopost_number_conf':
          this.nopost_number_conf = this.conf_area.sort()
          this.nopost_number_conf = this.conf_area.sort()
          break
        case 'nopost_money_conf':
          this.nopost_money_conf = this.conf_area.sort()
          break
        case 'nopost_volume_conf':
          this.nopost_volume_conf = this.conf_area.sort()
          break
        case 'free_conf':
          if (this.conf_id !== null) {
            this.free_conf[this.conf_id].area = this.conf_area
            this.$set(this.free_conf, this.conf_id, this.free_conf[this.conf_id])
          } else {
            this.free_conf.push({
              area: this.conf_area.sort(),
              freetype: '1',
              inweight: '',
              upmoney: ''
            })
          }
          break
        case 'fee_number_conf':
          if (this.conf_id !== null) {
            this.fee_number_conf[this.conf_id].area = this.conf_area
            this.$set(this.fee_number_conf, this.conf_id, this.fee_number_conf[this.conf_id])
          } else {
            this.fee_number_conf.push({
              area: this.conf_area.sort(),
              start_standard: '',
              start_fee: '',
              add_standard: '',
              add_fee: ''
            })
          }
          break
        case 'free_number_conf':
          if (this.conf_id !== null) {
            this.free_number_conf[this.conf_id].area = this.conf_area
            this.$set(this.free_number_conf, this.conf_id, this.free_number_conf[this.conf_id])
          } else {
            this.free_number_conf.push({
              area: this.conf_area.sort(),
              freetype: '1',
              upquantity: '',
              upmoney: ''
            })
          }
          break
        case 'fee_volume_conf':
          if (this.conf_id !== null) {
            this.fee_volume_conf[this.conf_id].area = this.conf_area
            this.$set(this.fee_volume_conf, this.conf_id, this.fee_volume_conf[this.conf_id])
          } else {
            this.fee_volume_conf.push({
              area: this.conf_area.sort(),
              start_standard: '',
              start_fee: '',
              add_standard: '',
              add_fee: ''
            })
          }
          break
        case 'free_volume_conf':
          if (this.conf_id !== null) {
            this.free_volume_conf[this.conf_id].area = this.conf_area
            this.$set(this.free_volume_conf, this.conf_id, this.free_volume_conf[this.conf_id])
          } else {
            this.free_volume_conf.push({
              area: this.conf_area.sort(),
              freetype: '1',
              upvolume: '',
              upmoney: ''
            })
          }
          break
        case 'fee_money_conf':
          if (this.conf_id !== null) {
            this.fee_money_conf[this.conf_id].area = this.conf_area
            this.$set(this.fee_money_conf, this.conf_id, this.fee_money_conf[this.conf_id])
          } else {
            this.fee_money_conf.push({
              area: this.conf_area.sort(),
              rules: [
                {
                  up: 0.0,
                  down: '',
                  basefee: ''
                }
              ]
            })
          }
          break
      }
      this.dialogAreaFormVisible = false
    },
    // 省份区域选择
    handleCheckProvinceChange(index, checked) {
      let that = this,
        searchIndex,
        regionAllNum = 0,
        checkedCityAllNum = 0,
        checkedRegionAllNum = 0,
        checkedRegionAllArrNum = [],
        provinceInfo = this.areaInfo,
        cityInfo = this.areaInfo[index].children
      // 样式开始
      Object.assign(provinceInfo[index], { checked: checked })
      this.$set(provinceInfo, index, provinceInfo[index])
      searchIndex = this.conf_area.indexOf(provinceInfo[index].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      cityInfo.forEach(function (cityItem) {
        if (typeof checkedRegionAllArrNum[cityItem.value] == 'undefined')
          checkedRegionAllArrNum[cityItem.value] = 0
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        Object.assign(cityItem, { checked: checked })
        if (true == cityItem.checked) checkedCityAllNum++
        regionAllNum += that.areaInfoCount[cityItem.value]
        cityItem.children.forEach(function (regionItem) {
          searchIndex = that.conf_area.indexOf(regionItem.value)
          if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
          Object.assign(regionItem, { checked: checked })
          if (true == regionItem.checked) {
            checkedRegionAllArrNum[cityItem.value]++
            checkedRegionAllNum++
          }
        })
      })
      // 样式结束
      if (true == checked) {
        if (
          this.areaInfoCount[provinceInfo[index].value] == checkedCityAllNum &&
          regionAllNum == checkedRegionAllNum
        ) {
          this.conf_area.push(provinceInfo[index].value)
        } else {
          cityInfo.forEach(function (cityItem) {
            if (
              true == cityItem.checked &&
              checkedRegionAllArrNum[cityItem.value] == that.areaInfoCount[cityItem.value]
            ) {
              that.conf_area.push(cityItem.value)
            } else {
              cityItem.children.forEach(function (regionItem) {
                that.conf_area.push(regionItem.value)
              })
            }
          })
        }
      }

      // console.log('province', this.conf_area)
    },
    handlechildProvinceChoose(index) {
      this.cityIndex = -1
      this.provinceIndex = index
    },
    // 城市选择
    handleCheckCityChange(index, checked) {
      let that = this,
        searchIndex,
        checkedCityAllNum = 0,
        checkedRegionAllNum = 0,
        checkedRegionAllArrNum = [],
        provinceInfo = this.areaInfo,
        cityInfo = this.areaInfo[this.provinceIndex].children,
        regionInfo = this.areaInfo[this.provinceIndex].children[index].children
      // 选择样式开始
      Object.assign(provinceInfo[this.provinceIndex], { checked: false })
      this.$set(provinceInfo, this.provinceIndex, provinceInfo[this.provinceIndex])
      Object.assign(cityInfo[index], { checked: checked })
      searchIndex = this.conf_area.indexOf(provinceInfo[this.provinceIndex].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      cityInfo.forEach(function (cityItem) {
        if (typeof checkedRegionAllArrNum[cityItem.value] == 'undefined')
          checkedRegionAllArrNum[cityItem.value] = 0
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == cityItem.checked) {
          checkedCityAllNum++
          Object.assign(provinceInfo[that.provinceIndex], { checked: true })
        }
        cityItem.children.forEach(function (regionItem) {
          if (true == regionItem.checked) {
            checkedRegionAllArrNum[cityItem.value]++
          }
        })
      })

      checkedRegionAllArrNum[cityInfo[index].value] = 0
      regionInfo.forEach(function (regionItem) {
        searchIndex = that.conf_area.indexOf(regionItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == checked) {
          checkedRegionAllArrNum[cityInfo[index].value]++
          checkedRegionAllNum++
        }
        Object.assign(regionItem, { checked: checked })
      })
      // 选择样式结束
      if (
        checkedCityAllNum == this.areaInfoCount[provinceInfo[this.provinceIndex].value] &&
        checkedRegionAllNum == this.areaInfoCount[cityInfo[index].value]
      ) {
        this.conf_area.push(provinceInfo[this.provinceIndex].value)
      } else {
        cityInfo.forEach(function (cityItem) {
          if (
            cityItem.checked == true &&
            checkedRegionAllArrNum[cityItem.value] == that.areaInfoCount[cityItem.value]
          )
            that.conf_area.push(cityItem.value)
        })
        if (checkedRegionAllNum != this.areaInfoCount[cityInfo[index].value]) {
          searchIndex = that.conf_area.indexOf(cityInfo[index].value)
          if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
          regionInfo.forEach(function (regionItem) {
            if (checked == true) that.conf_area.push(regionItem.value)
          })
        }
      }
      // console.log('city', this.conf_area)
    },
    handlechildCityChoose(index) {
      this.cityIndex = index
    },
    // 选择区
    handleCheckRegionChange(index, checked) {
      let that = this,
        searchIndex,
        checkedCityAllNum = 0,
        checkedRegionAllNum = 0,
        provinceInfo = this.areaInfo,
        cityInfo = this.areaInfo[this.provinceIndex].children,
        regionInfo = this.areaInfo[this.provinceIndex].children[this.cityIndex].children
      // 样式选择开始
      Object.assign(provinceInfo[this.provinceIndex], { checked: false })
      this.$set(provinceInfo, this.provinceIndex, provinceInfo[this.provinceIndex])
      Object.assign(cityInfo[this.cityIndex], { checked: false })
      Object.assign(regionInfo[index], { checked: checked })
      searchIndex = this.conf_area.indexOf(provinceInfo[this.provinceIndex].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      regionInfo.forEach(function (regionItem) {
        searchIndex = that.conf_area.indexOf(regionItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == regionItem.checked) {
          checkedRegionAllNum++
          Object.assign(cityInfo[that.cityIndex], { checked: true })
        }
      })
      cityInfo.forEach(function (cityItem) {
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == cityItem.checked) {
          checkedCityAllNum++
          Object.assign(provinceInfo[that.provinceIndex], { checked: true })
        }
      })
      // 样式选择结束
      if (
        checkedCityAllNum == this.areaInfoCount[provinceInfo[this.provinceIndex].value] &&
        checkedRegionAllNum == this.areaInfoCount[cityInfo[this.cityIndex].value]
      ) {
        this.conf_area.push(provinceInfo[this.provinceIndex].value)
      } else {
        cityInfo.forEach(function (cityItem) {
          if (true == cityItem.checked) that.conf_area.push(cityItem.value)
          cityItem.children.forEach(function (regionItem) {
            if (false == regionItem.checked) {
              searchIndex = that.conf_area.indexOf(cityItem.value)
              if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
            }
          })
        })
        if (checkedRegionAllNum != this.areaInfoCount[cityInfo[this.cityIndex].value]) {
          searchIndex = that.conf_area.indexOf(cityInfo[this.cityIndex].value)
          if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
          regionInfo.forEach(function (regionItem) {
            if (true == regionItem.checked) that.conf_area.push(regionItem.value)
          })
        }
      }
      console.log(this.conf_area)
    },
    // 城市数据清理
    formatCityDataClear(conf) {
      let searchIndex
      this.areaInfo = JSON.parse(JSON.stringify(this.district))
      var cityChooseList = []
      for (var i in conf) {
        for (var j in conf[i].area) {
          cityChooseList.push(conf[i].area[j])
        }
      }

      for (var provinceKey = this.areaInfo.length - 1; provinceKey >= 0; provinceKey--) {
        searchIndex = cityChooseList.indexOf(this.areaInfo[provinceKey].value)
        Object.assign(this.areaInfo[provinceKey], { checked: false })
        this.$set(this.areaInfo, provinceKey, this.areaInfo[provinceKey])
        if (searchIndex > -1) {
          this.areaInfo.splice(provinceKey, 1)
          continue
        }
        for (
          var cityKey = this.areaInfo[provinceKey].children.length - 1;
          cityKey >= 0;
          cityKey--
        ) {
          searchIndex = cityChooseList.indexOf(this.areaInfo[provinceKey].children[cityKey].value)
          Object.assign(this.areaInfo[provinceKey].children[cityKey], { checked: false })
          this.$set(
            this.areaInfo[provinceKey].children,
            cityKey,
            this.areaInfo[provinceKey].children[cityKey]
          )
          if (searchIndex > -1) {
            this.areaInfo[provinceKey].children.splice(cityKey, 1)
            continue
          }
          for (
            var regionKey = this.areaInfo[provinceKey].children[cityKey].children.length - 1;
            regionKey >= 0;
            regionKey--
          ) {
            searchIndex = cityChooseList.indexOf(
              this.areaInfo[provinceKey].children[cityKey].children[regionKey].value
            )
            Object.assign(this.areaInfo[provinceKey].children[cityKey].children[regionKey], {
              checked: false
            })
            this.$set(
              this.areaInfo[provinceKey].children[cityKey].children,
              regionKey,
              this.areaInfo[provinceKey].children[cityKey].children[regionKey]
            )
            if (searchIndex > -1) {
              this.areaInfo[provinceKey].children[cityKey].children.splice(regionKey, 1)
              continue
            }
          }
          if (0 == this.areaInfo[provinceKey].children[cityKey].children.length) {
            this.areaInfo.splice(cityKey, 1)
            continue
          }
        }
        if (0 == this.areaInfo[provinceKey].children.length) {
          this.areaInfo.splice(provinceKey, 1)
          continue
        }
      }
    },
    // 格式化城市编辑
    formatCityDataEdit(conf, row) {
      if (row == null) row = []
      // console.log(conf, row)
      let that = this,
        searchIndex

      this.provinceIndex = -1
      this.cityIndex = -1
      this.areaInfo = JSON.parse(JSON.stringify(this.district))
      var cityChooseList = []
      var cityChooseNowList = []
      if (row.length > 0) {
        for (var k in row) {
          cityChooseNowList.push(row[k])
        }
      }
      if (typeof row.area != 'undefined') {
        for (var k in row.area) {
          cityChooseNowList.push(row.area[k])
        }
      }

      for (var i in conf) {
        for (var j in conf[i].area) {
          cityChooseList.push(conf[i].area[j])
        }
      }

      for (var provinceKey = this.areaInfo.length - 1; provinceKey >= 0; provinceKey--) {
        Object.assign(this.areaInfo[provinceKey], { checked: false })
        if (cityChooseNowList.indexOf(this.areaInfo[provinceKey].value) > -1) {
          Object.assign(this.areaInfo[provinceKey], { checked: true })
        } else {
          searchIndex = cityChooseList.indexOf(this.areaInfo[provinceKey].value)
          if (searchIndex > -1) {
            this.areaInfo.splice(provinceKey, 1)
            continue
          }
        }
        for (
          var cityKey = this.areaInfo[provinceKey].children.length - 1;
          cityKey >= 0;
          cityKey--
        ) {
          Object.assign(this.areaInfo[provinceKey].children[cityKey], { checked: false })
          this.$set(
            this.areaInfo[provinceKey].children,
            cityKey,
            this.areaInfo[provinceKey].children[cityKey]
          )
          if (
            cityChooseNowList.indexOf(this.areaInfo[provinceKey].value) > -1 ||
            cityChooseNowList.indexOf(this.areaInfo[provinceKey].children[cityKey].value) > -1
          ) {
            Object.assign(this.areaInfo[provinceKey], { checked: true })
            Object.assign(this.areaInfo[provinceKey].children[cityKey], { checked: true })
          } else {
            searchIndex = cityChooseList.indexOf(this.areaInfo[provinceKey].children[cityKey].value)
            if (searchIndex > -1) {
              this.areaInfo[provinceKey].children.splice(cityKey, 1)
              continue
            }
          }
          for (
            var regionKey = this.areaInfo[provinceKey].children[cityKey].children.length - 1;
            regionKey >= 0;
            regionKey--
          ) {
            Object.assign(this.areaInfo[provinceKey].children[cityKey].children[regionKey], {
              checked: false
            })
            this.$set(
              this.areaInfo[provinceKey].children[cityKey].children,
              regionKey,
              this.areaInfo[provinceKey].children[cityKey].children[regionKey]
            )
            if (
              cityChooseNowList.indexOf(this.areaInfo[provinceKey].value) > -1 ||
              cityChooseNowList.indexOf(this.areaInfo[provinceKey].children[cityKey].value) > -1 ||
              cityChooseNowList.indexOf(
                this.areaInfo[provinceKey].children[cityKey].children[regionKey].value
              ) > -1
            ) {
              Object.assign(this.areaInfo[provinceKey], { checked: true })
              Object.assign(this.areaInfo[provinceKey].children[cityKey], { checked: true })
              Object.assign(this.areaInfo[provinceKey].children[cityKey].children[regionKey], {
                checked: true
              })
            } else {
              searchIndex = cityChooseList.indexOf(
                this.areaInfo[provinceKey].children[cityKey].children[regionKey].value
              )
              if (searchIndex > -1) {
                this.areaInfo[provinceKey].children[cityKey].children.splice(regionKey, 1)
                continue
              }
            }
          }
          //   if (0 == this.areaInfo[provinceKey].children[cityKey].children.length) {
          //     this.areaInfo.splice(cityKey, 1)
          //     continue
          //   }
          this.$set(this.areaInfo, provinceKey, this.areaInfo[provinceKey])
        }
        if (0 == this.areaInfo[provinceKey].children.length) {
          this.areaInfo.splice(provinceKey, 1)
          continue
        }
      }
    },
    getAddress() {
      this.loadDistrictOptions().then((list) => {
        list.forEach((provinceItem) => {
          this.areaInfoCount[provinceItem.value] = provinceItem.children?.length || 0
          ;(provinceItem.children || []).forEach((cityItem) => {
            this.areaInfoCount[cityItem.value] = cityItem.children?.length || 0
          })
        })
        this.loading = false
      })
    },
    handleInputDownMoney(lastMoney, index, parentIndex) {
      if (lastMoney == 0) {
        return false
      }
      if (parseInt(this.fee_money_conf[parentIndex].rules[index].up) > parseInt(lastMoney)) {
        this.$message.error(this.$t('477a43bd.e5873e'))
        return false
      }
      this.fee_money_conf[parentIndex].rules[index].now = lastMoney
      this.$set(
        this.fee_money_conf[parentIndex].rules,
        index,
        this.fee_money_conf[parentIndex].rules[index]
      )
      this.fee_money_conf[parentIndex].rules.push({
        up: lastMoney,
        down: '',
        basefee: ''
      })
      this.$set(
        this.fee_money_conf[parentIndex].rules,
        index + 1,
        this.fee_money_conf[parentIndex].rules[index + 1]
      )
    }
  }
}
</script>

<style scoped lang="scss">
.box-set {
  background: #fff;
  border-top: 3px #d2d6de solid;
  padding: 20px 0;
}

.form-view {
  float: left;
  width: 25%;
  margin-right: 40px;
  min-width: 387px;
}

.form-wrapper {
  display: flow-root;
  margin-left: 20px;
  float: left;
  min-width: 750px;
}

.shipping-calc {
  min-height: 20px;
  padding: 19px;
  margin-top: 5px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
}

.child-data {
  position: absolute;
  opacity: 1;
  left: 0;
  width: 100%;
  top: 25px;
  padding: 10px 1px;
  background-color: #eeeeee;
  z-index: 9999;
}

.province-list,
.city-list,
.region-list {
  border: 1px solid #f2f2fe;
  overflow: scroll;
  height: 500px;
  margin-left: 15px;
  & > div {
    padding: 8px 8px;
  }
}

.el-icon-caret-right {
  width: 50px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  vertical-align: middle;
}
.nopost {
  text-align: center;
  background: #fff;
  padding: 15px;
  border: 1px solid #ebeef5;
}
</style>
