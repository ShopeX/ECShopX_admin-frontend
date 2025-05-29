<template>
  <div>
    <el-form ref="form" v-loading="loading" :model="form" class="box-set" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="8">
          <section class="section section-white">
            <el-form-item label="模板名称:">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="规则说明:">
              <el-input v-model="form.intro" maxlength="200" show-word-limit />
            </el-form-item>
            <!--  -->
            <el-form-item label="是否包邮:">
              <!--  -->
              <el-radio v-if="templatesId" v-model="form.is_free" disabled label="0">
                买家承担-自定义运费
              </el-radio>
              <el-radio v-else v-model="form.is_free" label="0"> 买家承担-自定义运费 </el-radio>
              <!--  -->
              <el-radio v-if="templatesId" v-model="form.is_free" disabled label="2">
                买家承担-到付
              </el-radio>
              <el-radio v-else v-model="form.is_free" label="2"> 买家承担-到付 </el-radio>
              <!--  -->
              <el-radio v-if="templatesId" v-model="form.is_free" disabled label="1">
                卖家承担-免运费
              </el-radio>
              <el-radio v-else v-model="form.is_free" label="1"> 卖家承担-免运费 </el-radio>
              <p class="frm-tips">选择了卖家承担运费，运费计算和包邮规则设置将会丢失！</p>
            </el-form-item>
            <!--  -->
            <el-form-item label="计费模式:">
              <el-radio v-model="form.price_model" label="single"> 单店计费 </el-radio>
              <el-radio v-model="form.price_model" label="combine"> 合并计费 </el-radio>
            </el-form-item>
            <el-form-item label="适用区域:">
              <el-select
                v-model="form.regionauth_id"
                :disabled="!!templatesId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in areas"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--  -->
            <el-form-item v-show="form.is_free == 0" label="计价方式:">
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="1">
                按重量
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="1"> 按重量 </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="2">
                按件数
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="2"> 按件数 </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="3">
                按金额
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="3"> 按金额 </el-radio>
              <el-radio v-if="templatesId" v-model="form.valuation" disabled label="4">
                按体积
              </el-radio>
              <el-radio v-else v-model="form.valuation" label="4"> 按体积 </el-radio>
              <p class="frm-tips">运费模版保存后，计费方式将无法切换！！</p>
            </el-form-item>
            <el-form-item label="是否启用:">
              <el-radio v-model="form.status" label="1"> 启用 </el-radio>
              <el-radio v-model="form.status" label="0"> 禁用 </el-radio>
            </el-form-item>
            <el-form-item v-show="form.is_free == 1" label="不配送城市:">
              <section class="section section-white shipping-calc">
                <p class="font-bold">不配送城市（优先级最高）</p>
                <p v-if="nopost_self_conf && nopost_self_conf.length > 0" class="font-bold nopost">
                  {{ nopost_self_conf | formatCityData(district) }}
                </p>
                <p v-else class="font-bold nopost">暂无数据</p>
                <div class="content-v-padded">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleNoPostEditArea('nopost_self_conf')"
                  >
                    编辑地区
                  </el-button>
                </div>
              </section>
            </el-form-item>
          </section>
        </el-col>
        <el-col v-show="form.is_free == 0" :span="16">
          <section v-show="form.valuation == 1" class="section section-white">
            <p class="font-bold">运费计算:</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">默认运费:</p>
              <el-form-item label-width="140">
                重量（kg以内）：
                <el-input v-model="fee_conf[0].start_standard" size="mini" style="width: 100px" />
                运费（元）：
                <el-input v-model="fee_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">增重运费:</p>
              <el-form-item label-width="140">
                每增加（kg内）：
                <el-input
                  v-model="fee_conf[0].add_standard"
                  class="inline-input"
                  style="width: 100px"
                />
                增加（元）：
                <el-input v-model="fee_conf[0].add_fee" class="inline-input" style="width: 100px" />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">为指定地区城市设置运费</p>
              <el-table :data="fee_conf.slice(1)" style="width: 100%" border>
                <el-table-column label="运送到" width="200">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFeeEditArea(scope.$index + 1, scope.row, 'fee_conf')"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="重量(kg)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="首费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续重(kg)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleFeeDeleteArea(scope.$index, 'fee_conf')"
                    >
                      删除
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
                  添加地区
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">不配送城市（优先级最高）</p>
              <p v-if="nopost_conf && nopost_conf.length > 0" class="font-bold nopost">
                {{ nopost_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">暂无数据</p>
              <div class="content-v-padded">
                <el-button type="primary" size="mini" @click="handleNoPostEditArea('nopost_conf')">
                  编辑地区
                </el-button>
              </div>
            </section>
            <!--  -->
            <el-checkbox v-model="priceFreeStatus" true-label="isFree" false-label=""
              >指定条件包邮:</el-checkbox
            >
            <el-checkbox v-model="priceFreeStatus1" true-label="isAmount" false-label=""
              >指定条件到付:</el-checkbox
            >
            <section
              v-for="info in [priceFreeStatus, priceFreeStatus1].filter((v) => v)"
              :key="info"
              class="section section-white shipping-calc"
            >
              <p class="font-bold">为指定地区设置{{ getText(info) }}规则</p>
              <el-table :data="getData('free_conf', info)" style="width: 100%" border>
                <el-table-column label="地区设置" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFreeEditArea(scope.$index, scope.row, 'free_conf', info)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="`${getText(info)}条件(kg)`">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      placeholder="请选择"
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
                      >在&nbsp;<el-input
                        v-model="scope.row.inweight"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;kg以{{ info == 'isFree' ? '内' : '上' }}{{ getText(info) }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;元以{{ info == 'isFree' ? '上' : '内' }}{{ getText(info) }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleFeeDeleteArea(scope.$index - 1, 'free_conf', info)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_conf', info)"
                >
                  添加地区
                </el-button>
              </div>
            </section>
            <!--  -->
          </section>
          <section v-show="form.valuation == 2" class="section section-white">
            <p class="font-bold">运费计算:</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">默认运费:</p>
              <el-form-item label-width="140">
                件数（件以内）：
                <el-input
                  v-model="fee_number_conf[0].start_standard"
                  size="mini"
                  style="width: 100px"
                />
                运费（元）：
                <el-input v-model="fee_number_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">增件运费:</p>
              <el-form-item label-width="140">
                每增加（件内）：
                <el-input
                  v-model="fee_number_conf[0].add_standard"
                  size="mini"
                  style="width: 100px"
                />
                增加（元）：
                <el-input v-model="fee_number_conf[0].add_fee" size="mini" style="width: 100px" />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">为指定地区城市设置运费</p>
              <el-table :data="fee_number_conf.slice(1)" style="width: 100%" border>
                <el-table-column label="运送到">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFeeEditArea(scope.$index + 1, scope.row, 'fee_number_conf')"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="首件(件)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="首费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续件(件)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleFeeDeleteArea(scope.$index, 'fee_number_conf')"
                    >
                      删除
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
                  添加地区
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">不配送城市（优先级最高）</p>
              <p
                v-if="nopost_number_conf && nopost_number_conf.length > 0"
                class="font-bold nopost"
              >
                {{ nopost_number_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">暂无数据</p>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleNoPostEditArea('nopost_number_conf')"
                >
                  编辑地区
                </el-button>
              </div>
            </section>
            <!--  -->
            <el-checkbox v-model="numberFreeStatus" true-label="isFree" false-label=""
              >指定条件包邮:</el-checkbox
            >
            <el-checkbox v-model="numberFreeStatus1" true-label="isAmount" false-label=""
              >指定条件到付:</el-checkbox
            >
            <section
              v-for="info in [numberFreeStatus, numberFreeStatus1].filter((v) => v)"
              :key="info"
              class="section section-white shipping-calc"
            >
              <p class="font-bold">为指定地区设置{{ getText(info) }}规则</p>
              <el-table :data="getData('free_number_conf', info)" style="width: 100%" border>
                <el-table-column label="地区设置" width="120">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFreeEditArea(scope.$index, scope.row, 'free_number_conf', info)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="`${getText(info)}条件(件)`">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      placeholder="请选择"
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
                      >{{ info == 'isFree' ? '满' : '在' }}&nbsp;<el-input
                        v-model="scope.row.upquantity"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;件{{ info == 'isFree' ? '' : '以内' }}{{ getText(info) }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;元{{ info == 'isFree' ? '以上' : '以内' }}{{ getText(info) }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleNumberFreeDeleteArea(scope.$index, info)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_number_conf', info)"
                >
                  添加地区
                </el-button>
              </div>
            </section>
            <!--  -->
          </section>
          <section v-show="form.valuation == 3" class="section section-white">
            <section class="section section-white shipping-calc">
              <p class="font-bold">为指定地区城市设置运费</p>
              <el-table :data="fee_money_conf" style="width: 100%" border>
                <el-table-column label="运送到">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFeeEditArea(scope.$index, scope.row, 'fee_money_conf')"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="金额上下限(元)" width="300">
                  <template slot-scope="scope">
                    <div
                      v-for="(money_key, money_index) in scope.row.rules"
                      :key="money_index"
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
                <el-table-column label="运费(元)" width="200">
                  <template slot-scope="scope">
                    <div style="display: flex">
                      <div>
                        <div
                          v-for="(money_key, money_index) in scope.row.rules"
                          :key="money_index"
                          style="margin-top: 5px"
                        >
                          <el-input
                            v-model="money_key.basefee"
                            class="inline-input"
                            :disabled="amountFeeStatus[scope.$index]?.[money_index]"
                            style="width: 100px"
                          />
                        </div>
                      </div>
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          justify-content: space-evenly;
                          margin-left: 10px;
                        "
                      >
                        <div
                          v-for="(money_key, money_index) in scope.row.rules"
                          :key="money_index + 'check'"
                          style="margin-top: 5px"
                        >
                          <el-checkbox
                            v-if="scope.$index != 0 || money_index != 0"
                            :value="amountFeeStatus[scope.$index]?.[money_index]"
                            false-label=""
                            true-label="isAmount"
                            @change="
                              handleChangeCheck(
                                scope.$index,
                                money_index,
                                'amountFeeStatus',
                                'fee_money_conf'
                              )
                            "
                            >到付</el-checkbox
                          >
                          <div v-else style="height: 23px" />
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="add_standard" label="操作" width="100">
                  <template slot-scope="scope">
                    <div v-for="(money_key, money_index) in scope.row.rules" :key="money_index">
                      <template v-if="scope.row.rules.length - 1 == money_index">
                        <el-button
                          v-if="scope.$index != 0 || money_index != 0"
                          size="mini"
                          icon="delete"
                          type="danger"
                          @click="handleMoneyFeeDeleteArea(scope.$index, money_index)"
                        >
                          删除
                        </el-button>
                      </template>
                      <div v-else style="height: 45px" />
                    </div>
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
                  添加地区
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">不配送城市（优先级最高）</p>
              <p v-if="nopost_money_conf && nopost_money_conf.length > 0" class="font-bold nopost">
                {{ nopost_money_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">暂无数据</p>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleNoPostEditArea('nopost_money_conf')"
                >
                  编辑地区
                </el-button>
              </div>
            </section>
          </section>
          <section v-show="form.valuation == 4" class="section section-white">
            <p class="font-bold">运费计算:</p>
            <section class="section section-white shipping-calc">
              <p class="font-bold">默认运费:</p>
              <el-form-item label-width="140">
                体积（m³以内）：
                <el-input
                  v-model="fee_volume_conf[0].start_standard"
                  size="mini"
                  style="width: 100px"
                />
                运费（元）：
                <el-input v-model="fee_volume_conf[0].start_fee" size="mini" style="width: 100px" />
              </el-form-item>
              <p class="font-bold">增体积运费:</p>
              <el-form-item label-width="140">
                每增加（m³内）：
                <el-input
                  v-model="fee_volume_conf[0].add_standard"
                  class="inline-input"
                  style="width: 100px"
                />
                增加（元）：
                <el-input
                  v-model="fee_volume_conf[0].add_fee"
                  class="inline-input"
                  style="width: 100px"
                />
              </el-form-item>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">为指定地区城市设置运费</p>
              <el-table :data="fee_volume_conf.slice(1)" style="width: 100%" border>
                <el-table-column label="运送到" width="200">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFeeEditArea(scope.$index + 1, scope.row, 'fee_volume_conf')"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="首体积(m³)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="首费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.start_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续体积(m³)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_standard" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="续费(元)">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.add_fee" size="mini" />
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleFeeDeleteArea(scope.$index, 'fee_volume_conf')"
                    >
                      删除
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
                  添加地区
                </el-button>
              </div>
            </section>
            <section class="section section-white shipping-calc">
              <p class="font-bold">不配送城市（优先级最高）</p>
              <p
                v-if="nopost_volume_conf && nopost_volume_conf.length > 0"
                class="font-bold nopost"
              >
                {{ nopost_volume_conf | formatCityData(district) }}
              </p>
              <p v-else class="font-bold nopost">暂无数据</p>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleNoPostEditArea('nopost_volume_conf')"
                >
                  编辑地区
                </el-button>
              </div>
            </section>
            <!--  -->
            <el-checkbox v-model="volumeFreeStatus" true-label="isFree" false-label=""
              >指定条件包邮:</el-checkbox
            >
            <el-checkbox v-model="volumeFreeStatus1" true-label="isAmount" false-label=""
              >指定条件到付:</el-checkbox
            >
            <section
              v-for="info in [volumeFreeStatus, volumeFreeStatus1].filter((v) => v)"
              :key="info"
              class="section section-white shipping-calc"
            >
              <p class="font-bold">为指定地区设置{{ getText(info) }}规则</p>
              <el-table :data="getData('free_volume_conf', info)" style="width: 100%" border>
                <el-table-column label="地区设置" width="150">
                  <template slot-scope="scope">
                    {{ scope.row.area | formatCityData(district) }}
                    <el-button
                      v-if="scope.$index != 0"
                      size="mini"
                      icon="el-icon-edit"
                      type="primary"
                      @click="handleFreeEditArea(scope.$index, scope.row, 'free_volume_conf', info)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column :label="`${getText(info)}条件(m³)`">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.freetype"
                      placeholder="请选择"
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
                      >在&nbsp;<el-input
                        v-model="scope.row.upvolume"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;m³以{{ info == 'isFree' ? '内' : '上' }}{{ getText(info) }}</span
                    >
                    <span v-if="2 == scope.row.freetype || 3 == scope.row.freetype"
                      ><span v-if="3 == scope.row.freetype">,</span>&nbsp;<el-input
                        v-model="scope.row.upmoney"
                        class="inline-input"
                        style="width: 100px"
                      />&nbsp;元以{{ info == 'isFree' ? '上' : '内' }}{{ getText(info) }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button
                      v-if="0 != scope.$index"
                      size="mini"
                      icon="delete"
                      type="danger"
                      @click="handleFeeDeleteArea(scope.$index - 1, free_volume_conf, info)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="content-v-padded">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="mini"
                  @click="handleAddArea('free_volume_conf', info)"
                >
                  添加地区
                </el-button>
              </div>
            </section>
            <!--  -->
          </section>
        </el-col>
      </el-row>
      <div class="section-footer with-border content-center clearfix">
        <el-button type="primary" @click="submitSaveAction"> 保存 </el-button>
      </div>
      <el-dialog title="选择区域1" :visible.sync="dialogAreaFormVisible" width="960px">
        <el-row>
          <el-col :span="6">
            <el-row class="province-list">
              <el-col>省份</el-col>
              <el-col
                v-for="(item, index) in areaInfo"
                :key="'province' + index"
                class="province-item"
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
              <el-col>城市</el-col>
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
              <el-col>城市</el-col>
            </el-row>
          </el-col>
          <el-col v-if="cityIndex > -1" :span="6">
            <el-row class="region-list">
              <el-col>地区</el-col>
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
              <el-col>地区</el-col>
            </el-row>
          </el-col>
          <el-col :span="6">
            <el-row class="region-list">
              <el-col>
                已选：<br />
                {{ conf_area | formatCityData(district, false) }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAreaFormVisible = false"> 取 消 </el-button>
          <el-button type="primary" @click="handleAreaChooseFinish"> 确 定 </el-button>
        </div>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { getAddress } from '@/api/common'
import api from '@/api'
import {
  payForRule,
  cityFeeConfig,
  selectConfig,
  feeStatuConfig,
  fee_money_conf
} from './constants'

//匹配省市区
export default {
  inject: ['refresh'],
  data() {
    return {
      loading: true,
      district: {},
      templatesId: '',
      // 设置运费模式
      ...feeStatuConfig,
      dialogAreaFormVisible: false,
      areaInfoCount: [],
      childChoose: [],
      areaInfo: [],
      provinceIndex: -1,
      cityIndex: -1,
      provinceInfoBackground: '',
      cityInfoBackground: '',
      regionInfoBackground: '',
      form: {
        name: '',
        is_free: '0',
        valuation: '1',
        status: '1',
        fee_conf: [],
        nopost_conf: [],
        free_conf: [],
        price_model: 'single'
      },
      nopost_conf: [],
      nopost_number_conf: [],
      nopost_money_conf: [],
      nopost_volume_conf: [],
      nopost_self_conf: [],
      conf_id: null,
      conf_name: '',
      conf_area: [],
      // 包邮或者到付规则默认值
      ...payForRule,
      // 城市运费默认值
      ...cityFeeConfig,
      ...selectConfig,
      fee_money_conf,
      rule: {
        name: [{ required: true, message: '请填写模板名称', trigger: 'change' }]
      },
      areas: []
    }
  },
  mounted() {
    this.getAddress()
    const id = this.$route.params.itemId || this.$route.params.templatesId

    api.regionauth.getRegionauth().then((res) => {
      this.areas = res?.list?.map((el) => ({
        value: el.regionauth_id,
        label: el.regionauth_name
      }))
    })
    id && this.queryTemplates(id)
  },

  methods: {
    queryTemplates(id) {
      this.templatesId = id
      api.shipping
        .getShippingTemplatesInfo(this.templatesId)
        .then((res) => {
          if (!res) {
            return
          }
          this.form = {
            ...this.form,
            name: res.name,
            is_free: res.is_free,
            intro: res?.intro,
            regionauth_id: res.regionauth_id
          }
          res.nopost_conf = JSON.parse(res.nopost_conf)
          if (this.form.is_free == 1) {
            this.nopost_self_conf = res.nopost_conf
            return
          }
          this.form.valuation = res.valuation
          this.form.status = res.status ? '1' : '0'
          this.form.price_model = res.price_model
          res.fee_conf = JSON.parse(res.fee_conf)
          res.free_conf = JSON.parse(res.free_conf)
          res.cod_conf = JSON.parse(res.cod_conf)

          let { nopost_conf = [], fee_conf = [], free_conf = [], cod_conf = [] } = res
          if (!nopost_conf) {
            nopost_conf = []
          }
          if (!fee_conf) {
            fee_conf = cityFeeConfig?.fee_conf
          }

          if (!free_conf) {
            free_conf = []
          }

          if (!cod_conf) {
            cod_conf = []
          }

          switch (res.valuation) {
            case '1':
              this.fee_conf = fee_conf
              this.free_conf_isFree = free_conf?.length ? free_conf : payForRule?.free_conf_isFree
              this.free_conf_isAmount = cod_conf?.length ? cod_conf : payForRule?.free_conf_isAmount
              this.nopost_conf = nopost_conf
              this.priceFreeStatus = free_conf?.length ? 'isFree' : ''
              this.priceFreeStatus1 = cod_conf?.length ? 'isAmount' : ''
              break
            case '2':
              this.fee_number_conf = fee_conf
              this.free_number_conf_isFree = free_conf?.length
                ? free_conf
                : payForRule?.free_number_conf_isFree
              this.free_number_conf_isAmount = cod_conf?.length
                ? cod_conf
                : payForRule?.free_number_conf_isAmount
              this.nopost_number_conf = nopost_conf
              this.numberFreeStatus = free_conf?.length ? 'isFree' : ''
              this.numberFreeStatus1 = cod_conf?.length ? 'isAmount' : ''
              break
            case '3':
              this.fee_money_conf = fee_conf
              this.nopost_money_conf = nopost_conf
              for (var item in this.fee_money_conf) {
                for (var rules_item in this.fee_money_conf[item].rules) {
                  const _pre = this.fee_money_conf[item]
                  _pre.rules[rules_item].now = _pre.rules[rules_item].down
                  _pre.rules[rules_item].basefee =
                    _pre.rules[rules_item].basefee == 'cod' ? '' : _pre.rules[rules_item].basefee

                  this.$set(
                    this.fee_money_conf[item].rules,
                    rules_item,
                    this.fee_money_conf[item].rules[rules_item]
                  )
                  if (item > 0) {
                    this.handleChangeCheck(
                      item,
                      rules_item,
                      'amountFeeStatus',
                      'fee_money_conf',
                      _pre.rules[rules_item].basefee == ''
                    )
                  }
                }
              }
              break
            case '4':
              this.fee_volume_conf = fee_conf
              this.free_volume_conf_isFree = free_conf?.length
                ? free_conf
                : payForRule?.free_volume_conf_isFree
              this.free_volume_conf_isAmount = cod_conf?.length
                ? cod_conf
                : payForRule?.free_volume_conf_isAmount
              this.nopost_volume_conf = nopost_conf
              this.volumeFreeStatus = free_conf?.length ? 'isFree' : ''
              this.volumeFreeStatus1 = cod_conf?.length ? 'isAmount' : ''
              break
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getText(text) {
      if (!text) {
        return ''
      }
      return text == 'isFree' ? '包邮' : '到付'
    },
    getData(prefix, info) {
      return this[`${prefix}_${info}`]
    },
    async submitSaveAction() {
      const that = this
      if (!this.form.name) {
        this.$message.error('模板名称必填')
        return
      }
      switch (this.form.valuation) {
        case '1':
          this.form.fee_conf = this.fee_conf
          this.form.free_conf = this.priceFreeStatus ? this.free_conf_isFree : []
          this.form.cod_conf = this.priceFreeStatus1 ? this.free_conf_isAmount : []
          this.form.nopost_conf = this.nopost_conf
          break
        case '2':
          this.form.fee_conf = this.fee_number_conf
          this.form.free_conf = this.numberFreeStatus ? this.free_number_conf_isFree : []
          this.form.cod_conf = this.numberFreeStatus1 ? this.free_number_conf_isAmount : []
          this.form.nopost_conf = this.nopost_number_conf
          break
        case '3':
          this.form.fee_conf = this.fee_money_conf
          this.form.nopost_conf = this.nopost_money_conf
          break
        case '4':
          this.form.fee_conf = this.fee_volume_conf
          this.form.free_conf = this.volumeFreeStatus ? this.free_volume_conf_isFree : []
          this.form.cod_conf = this.volumeFreeStatus1 ? this.free_volume_conf_isAmount : []
          this.form.nopost_conf = this.nopost_volume_conf
          break
      }

      if (0 == this.form.is_free) {
        if (3 == this.form.valuation) {
          for (var i in this.form.fee_conf) {
            for (var j in this.form.fee_conf[i].rules) {
              if (this.amountFeeStatus?.[i]?.[j]) {
                this.form.fee_conf[i].rules[j].basefee = 'cod'
              }
              if (this.form.fee_conf[i].rules[j].basefee === '') {
                this.$message.error('运费金额不能为空')
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
            this.$message.error('运费计算不能为空')
            return
          }
        }
      } else {
        this.form.nopost_conf = this.nopost_self_conf
      }

      if (this.form?.cod_conf) {
        this.form.cod_conf = JSON.stringify(this.form.cod_conf)
      }
      try {
        let _res = null
        if (this.templatesId) {
          _res = await api.shipping.updateShippingTemplates(this.templatesId, this.form)
        } else {
          _res = await api.shipping.createShippingTemplates(this.form)
        }
        if (!_res || _res?.message) {
          return
        }
        this.$message({
          message: this.templatesId ? '更新成功' : '添加成功',
          type: 'success',
          duration: 2 * 1000,
          onClose() {
            that.refresh()
            that.$router.go(-1)
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    handleChangeCheck(preIndex, curtindex, key, editName, defaultVal) {
      this[key] = {
        ...this[key],
        [preIndex]: {
          ...(this[key][preIndex] || {}),
          [curtindex]: defaultVal !== undefined ? defaultVal : !this[key]?.[preIndex]?.[curtindex]
        }
      }
      if (editName == 'fee_money_conf') {
        if (this[key]?.[preIndex]?.[curtindex]) {
          this[editName] = this[editName]?.map((pre, id) => {
            if (id == preIndex) {
              return {
                ...pre,
                rules: pre?.rules?.map((el, index) => {
                  if (index == curtindex) {
                    return {
                      ...el,
                      basefee: ''
                    }
                  }
                  return el
                })
              }
            }
            return pre
          })
        }
      }
    },
    // 选择地区
    handleAddArea(type, info) {
      const _key = info ? `${type}_${info}` : type
      const conf = this[_key]
      this.conf_name = _key
      this.formatCityDataClear(conf)
      this.conf_id = null
      this.conf_area = []
      this.provinceIndex = -1
      this.cityIndex = -1
      this.dialogAreaFormVisible = true
    },
    // 运费修改函数
    handleFeeEditArea(index, row, key) {
      this.formatCityDataEdit(this[key], row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = key
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    // 包邮修改函数
    handleFreeEditArea(index, row, prefix, info) {
      const _key = info ? `${prefix}_${info}` : prefix
      this.formatCityDataEdit(this[_key], row)
      this.conf_area = JSON.parse(JSON.stringify(row.area))
      this.conf_name = _key
      this.conf_id = index
      this.dialogAreaFormVisible = true
    },
    // no post修改函数
    handleNoPostEditArea(key) {
      this.formatCityDataEdit([], this[key])
      this.conf_area = JSON.parse(JSON.stringify(this[key]))
      this.conf_name = key
      this.dialogAreaFormVisible = true
    },
    // 按重量运费删除
    handleFeeDeleteArea(index, key, info) {
      const _key = info ? `${key}_${info}` : key
      this[_key].splice(index, 1)
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
          message: '请选择地区'
        })
        return false
      }
      const fee_default_params = {
        area: this.conf_area.sort(),
        start_standard: '',
        start_fee: '',
        add_standard: '',
        add_fee: ''
      }
      const free_default_params = {
        area: this.conf_area.sort(),
        freetype: '1',
        upmoney: ''
      }
      switch (this.conf_name) {
        case 'nopost_number_conf':
        case 'nopost_conf':
        case 'nopost_self_conf':
        case 'nopost_money_conf':
        case 'nopost_volume_conf':
          this[this.conf_name] = this.conf_area.sort()
          break
        case 'fee_conf':
        case 'fee_number_conf':
        case 'fee_volume_conf':
          if (this.conf_id !== null) {
            this[this.conf_name][this.conf_id].area = this.conf_area
            this.$set(this[this.conf_name], this.conf_id, this[this.conf_name][this.conf_id])
          } else {
            this[this.conf_name].push(fee_default_params)
          }
          break
        case 'fee_money_conf':
          if (this.conf_id !== null) {
            this[this.conf_name][this.conf_id].area = this.conf_area
            this.$set(this[this.conf_name], this.conf_id, this[this.conf_name][this.conf_id])
          } else {
            this[this.conf_name].push({
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
        case 'free_number_conf_isAmount':
        case 'free_number_conf_isFree':
          if (this.conf_id !== null) {
            this[this.conf_name][this.conf_id].area = this.conf_area
            this.$set(this[this.conf_name], this.conf_id, this[this.conf_name][this.conf_id])
          } else {
            this[this.conf_name].push({
              ...free_default_params,
              upquantity: ''
            })
          }
          break
        case 'free_conf_isFree':
        case 'free_conf_isAmount':
          if (this.conf_id !== null) {
            this[this.conf_name][this.conf_id].area = this.conf_area
            this.$set(this[this.conf_name], this.conf_id, this[this.conf_name][this.conf_id])
          } else {
            this[this.conf_name].push({
              ...free_default_params,
              inweight: ''
            })
          }
          break
        case 'free_volume_conf_isFree':
        case 'free_volume_conf_isAmount':
          if (this.conf_id !== null) {
            this[this.conf_name][this.conf_id].area = this.conf_area
            this.$set(this[this.conf_name], this.conf_id, this[this.conf_name][this.conf_id])
          } else {
            this[this.conf_name].push({
              ...free_default_params,
              upvolume: ''
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
      Object.assign(provinceInfo[index], { 'checked': checked })
      this.$set(provinceInfo, index, provinceInfo[index])
      searchIndex = this.conf_area.indexOf(provinceInfo[index].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      cityInfo.forEach(function (cityItem) {
        if (typeof checkedRegionAllArrNum[cityItem.value] == 'undefined')
          checkedRegionAllArrNum[cityItem.value] = 0
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        Object.assign(cityItem, { 'checked': checked })
        if (true == cityItem.checked) checkedCityAllNum++
        regionAllNum += that.areaInfoCount[cityItem.value]
        cityItem.children.forEach(function (regionItem) {
          searchIndex = that.conf_area.indexOf(regionItem.value)
          if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
          Object.assign(regionItem, { 'checked': checked })
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
      Object.assign(provinceInfo[this.provinceIndex], { 'checked': false })
      this.$set(provinceInfo, this.provinceIndex, provinceInfo[this.provinceIndex])
      Object.assign(cityInfo[index], { 'checked': checked })
      searchIndex = this.conf_area.indexOf(provinceInfo[this.provinceIndex].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      cityInfo.forEach(function (cityItem) {
        if (typeof checkedRegionAllArrNum[cityItem.value] == 'undefined')
          checkedRegionAllArrNum[cityItem.value] = 0
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == cityItem.checked) {
          checkedCityAllNum++
          Object.assign(provinceInfo[that.provinceIndex], { 'checked': true })
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
        Object.assign(regionItem, { 'checked': checked })
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
      Object.assign(provinceInfo[this.provinceIndex], { 'checked': false })
      this.$set(provinceInfo, this.provinceIndex, provinceInfo[this.provinceIndex])
      Object.assign(cityInfo[this.cityIndex], { 'checked': false })
      Object.assign(regionInfo[index], { 'checked': checked })
      searchIndex = this.conf_area.indexOf(provinceInfo[this.provinceIndex].value)
      if (searchIndex > -1) this.conf_area.splice(searchIndex, 1)
      regionInfo.forEach(function (regionItem) {
        searchIndex = that.conf_area.indexOf(regionItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == regionItem.checked) {
          checkedRegionAllNum++
          Object.assign(cityInfo[that.cityIndex], { 'checked': true })
        }
      })
      cityInfo.forEach(function (cityItem) {
        searchIndex = that.conf_area.indexOf(cityItem.value)
        if (searchIndex > -1) that.conf_area.splice(searchIndex, 1)
        if (true == cityItem.checked) {
          checkedCityAllNum++
          Object.assign(provinceInfo[that.provinceIndex], { 'checked': true })
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
        Object.assign(this.areaInfo[provinceKey], { 'checked': false })
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
          Object.assign(this.areaInfo[provinceKey].children[cityKey], { 'checked': false })
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
              'checked': false
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
        Object.assign(this.areaInfo[provinceKey], { 'checked': false })
        if (cityChooseNowList.indexOf(this.areaInfo[provinceKey].value) > -1) {
          Object.assign(this.areaInfo[provinceKey], { 'checked': true })
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
          Object.assign(this.areaInfo[provinceKey].children[cityKey], { 'checked': false })
          this.$set(
            this.areaInfo[provinceKey].children,
            cityKey,
            this.areaInfo[provinceKey].children[cityKey]
          )
          if (
            cityChooseNowList.indexOf(this.areaInfo[provinceKey].value) > -1 ||
            cityChooseNowList.indexOf(this.areaInfo[provinceKey].children[cityKey].value) > -1
          ) {
            Object.assign(this.areaInfo[provinceKey], { 'checked': true })
            Object.assign(this.areaInfo[provinceKey].children[cityKey], { 'checked': true })
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
              'checked': false
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
              Object.assign(this.areaInfo[provinceKey], { 'checked': true })
              Object.assign(this.areaInfo[provinceKey].children[cityKey], { 'checked': true })
              Object.assign(this.areaInfo[provinceKey].children[cityKey].children[regionKey], {
                'checked': true
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
      getAddress().then((res) => {
        let that = this
        this.district = res.data.data
        this.district.forEach(function (provinceItem) {
          that.areaInfoCount[provinceItem.value] = provinceItem.children.length
          provinceItem.children.forEach(function (cityItem) {
            that.areaInfoCount[cityItem.value] = cityItem.children.length
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
        this.$message.error('金额上限要大于金额下限!')
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
  float: right;
  position: relative;
  top: -4px;
}
.nopost {
  text-align: center;
  background: #fff;
  padding: 15px;
  border: 1px solid #ebeef5;
}
</style>
