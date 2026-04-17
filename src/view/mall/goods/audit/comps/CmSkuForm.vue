<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.comp-skuform {
  .sku-checkbox {
    .el-checkbox__label {
      height: 28px;
      line-height: 28px;
    }
  }
}
</style>
<style lang="scss" scope>
.form-block-head {
  .block-head-hd {
    font-weight: bold;
    color: #333;
    height: 40px;
    line-height: 40px;
    float: left;
  }
  .block-head-ft {
    height: 40px;
    line-height: 40px;
    float: right;
  }
  border-bottom: 1px solid #efefef;
}
.sub-label {
  margin-bottom: 16px;
  font-size: 15px;
  color: #333;
}
.width-full {
  width: 100%;
}
.sub-block {
  // padding: 0 10px;
  margin-bottom: 40px;
}
.sku-select__checkitem {
  float: left;
  margin-right: 20px;
}
.sku-image {
  margin: 6px 0 6px 24px;
}
.sku-row {
  margin-bottom: 15px;
}
.sku-name {
  width: 80px;
  float: left;
}
.sku-list {
  margin-left: 80px;
}
.clearfix {
  &::after {
    display: block;
    content: '';
    clear: both;
  }
}
</style>
<template>
  <div class="comp-skuform">
    <div class="form-block-head clearfix">
      <div class="block-head-hd">{{ $t('d0549016.5fceb3') }}</div>
      <div class="block-head-ft">
        <el-switch
          v-if="!isEditor"
          v-model="value.nospec"
          style="margin-left: 30px"
          active-color="#13ce66"
          inactive-color="#efefef"
          :active-text="$t('d0549016.fb49c4')"
          :inactive-text="$t('d0549016.5d60de')"
          @change="specOnChange"
        />
        <span style="margin-left: 30px">
          <span style="margin-right: 10px">{{ $t('d0549016.b51e8b') }}</span>
          <el-switch
            v-model="value.isShowSpecimg"
            active-color="#13ce66"
            inactive-color="#efefef"
          />
        </span>
      </div>
    </div>
    <div class="form-block-body">
      <template v-if="value.nospec">
        <el-form label-position="right" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.ce0008')" required>
                <el-select
                  v-model="value.specData.approve_status"
                  class="width-full"
                  :placeholder="$t('d0549016.708c9d')"
                >
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="$t(item.titleKey)"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!isPackageItems" :span="8">
              <el-form-item :label="$t('d0549016.0eac88')">
                <el-input
                  v-model="value.specData.store"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.e9de29')">
                <el-input v-model="value.specData.item_bn" :maxlength="60" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.fcd943')">
                <el-input
                  v-model="value.specData.weight"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                >
                  <template slot="append"> kg </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.972d5f')">
                <el-input
                  v-model="value.specData.volume"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                >
                  <template slot="append"> m³ </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.e29575')">
                <el-input
                  v-model="value.specData.price"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                >
                  <template slot="prepend"> ¥ </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.2e2ce2')">
                <el-input
                  v-model="value.specData.cost_price"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                >
                  <template slot="prepend"> ¥ </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.818fc4')">
                <el-input
                  v-model="value.specData.market_price"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                >
                  <template slot="prepend"> ¥ </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('d0549016.1e8836')">
                <el-input v-model="value.specData.barcode" required min="0" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="pointAccess == 'items'" :span="8">
              <el-form-item :label="$t('d0549016.c07abe')">
                <el-input
                  v-model="value.specData.point_num"
                  type="number"
                  required
                  min="0"
                  placeholder=""
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template v-else>
        <div class="sub-label" />
        <div class="sub-block">
          <!-- {{value.skus}} -->
          <div v-for="(item, index) in value.skus" :key="index" class="sku-row">
            <div class="sku-name">{{ item.sku_name }}：</div>
            <div class="sku-list">
              <el-checkbox-group
                v-model="item.checked_sku"
                class="clearfix"
                @change="handleSkuChange"
              >
                <div v-for="(value, vn) in item.sku_value" :key="vn" class="sku-select__checkitem">
                  <el-checkbox class="sku-checkbox" :label="value.attribute_value_id">
                    <el-input
                      v-if="item.checked_sku.indexOf(value.attribute_value_id) !== -1"
                      v-model="value.custom_attribute_value"
                      size="mini"
                      style="width: 100px"
                      @change="handleSkuName(value, index, vn)"
                    />
                    <span v-else>{{ value.attribute_value }}</span>
                  </el-checkbox>
                  <imgBox
                    v-if="value.image_url"
                    class="sku-image"
                    :img-url="value.image_url"
                    width="50"
                    height="50"
                  />
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="sub-label">{{ $t('d0549016.693413') }}</div>
        <!-- {{value.specImages}} -->
        <div class="sub-block">
          <el-table :data="value.specImages" :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column :label="$t('d0549016.ea887b')" width="240">
              <template slot-scope="scope">
                {{ scope.row.spec_custom_value_name || scope.row.spec_value_name }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.22826b')">
              <template slot-scope="scope">
                <template v-for="(item, index) in scope.row.item_image_url">
                  <imgBox
                    :key="index"
                    style="margin-right: 10px"
                    :img-url="item"
                    inline
                    remove-btn
                    width="50"
                    height="50"
                    @remove="handleImgRemove(scope.$index, index)"
                  />
                </template>
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
        <div class="sub-label">{{ $t('d0549016.29725a') }}</div>
        <div class="sub-block">
          <el-table :data="bulkFilling" :show-header="false" :highlight-current-row="false">
            <el-table-column>
              <template slot-scope="scope">
                {{ scope.row.custom_attribute_value || scope.row.item_spec }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.47f00b')">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.approve_status"
                  size="mini"
                  :placeholder="$t('d0549016.708c9d')"
                >
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="$t(item.titleKey)"
                    size="mini"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="!isPackageItems" :label="$t('d0549016.0eac88')">
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
            <el-table-column :label="$t('d0549016.9b979b')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.fcd943')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.972d5f')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.e29575')">
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
            <el-table-column :label="$t('d0549016.2e2ce2')">
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
            <el-table-column :label="$t('d0549016.818fc4')">
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
            <el-table-column :label="$t('d0549016.1e8836')">
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
            <el-table-column v-if="pointAccess == 'items'" :label="$t('d0549016.c07abe')">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.point_num"
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
                  {{ $t('d0549016.756e44') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="value.specItems"
            :header-cell-style="{ background: '#f5f7fa' }"
            :max-height="600"
            style="width: 100%"
          >
            <el-table-column :label="$t('d0549016.94d502')" prop="spec_name" />
            <el-table-column :label="$t('d0549016.3fea7c')" :render-header="renderRequire">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.approve_status"
                  size="mini"
                  :placeholder="$t('d0549016.708c9d')"
                >
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="$t(item.titleKey)"
                    size="mini"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              v-if="!isPackageItems"
              :label="$t('d0549016.0eac88')"
              :render-header="renderRequire"
            >
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
            <el-table-column :label="$t('d0549016.9b979b')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.8c0d75')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.3b35fa')">
              <template slot-scope="scope">
                <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('d0549016.e29575')" :render-header="renderRequire">
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
            <el-table-column :label="$t('d0549016.2e2ce2')">
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
            <el-table-column :label="$t('d0549016.818fc4')">
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
            <el-table-column :label="$t('d0549016.1e8836')">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.barcode"
                  :maxlength="6000"
                  size="mini"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column v-if="pointAccess == 'items'" :label="$t('d0549016.c07abe')">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.point_num"
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
                <el-button type="text" @click="clearSku(scope.$index)">
                  {{ $t('d0549016.4403fc') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </div>

    <imgPicker
      :dialog-visible="picsDialog"
      :sc-status="isGetPics"
      :is-most="multiple"
      @chooseImg="pickPics"
      @closeImgDialog="closePicsDialog"
    />
  </div>
</template>

<script>
import imgBox from '@/components/element/imgBox'
import imgPicker from '@/components/imageselect'
export default {
  name: 'CmSkuForm',
  components: {
    imgBox,
    imgPicker
  },
  props: ['value', 'isEditor', 'isPackageItems', 'pointAccess'],
  data() {
    return {
      picsDialog: false,
      isGetPics: false,
      multiple: false,
      statusOption: this.VERSION_IN_PURCHASE()
        ? [
            { titleKey: 'd0549016.9b7481', value: 'onsale' },
            { titleKey: 'd0549016.acf86b', value: 'only_show' },
            { titleKey: 'd0549016.ae83a3', value: 'instock' }
          ]
        : [
            { titleKey: 'd0549016.9b7481', value: 'onsale' },
            { titleKey: 'd0549016.2c50a0', value: 'offline_sale' },
            { titleKey: 'd0549016.acf86b', value: 'only_show' },
            { titleKey: 'd0549016.ae83a3', value: 'instock' }
          ],
      bulkFilling: [
        {
          // item_spec: '批量填充',
          approve_status: '',
          store: '',
          item_bn: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: '',
          weight: '',
          volume: ''
        }
      ],
      rowIndex: 0
    }
  },
  created() {
    console.log(this.value)
  },
  methods: {
    specOnChange() {
      this.$emit('specOnChange')
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
    handleSkuChange(data, index) {
      this.$parent.getSkuItems()
    },
    handleSkuName(val, m, n) {
      const { itemSpecList, specImages, specItems } = this.value
      const fd = specImages.find((item) => item.spec_value_id == val.attribute_value_id)
      if (fd) {
        fd.spec_custom_value_name = val.custom_attribute_value
      }
      itemSpecList[m].attribute_values.list[n].custom_attribute_value = val.custom_attribute_value
      specItems.forEach((item) => {
        item.item_spec.forEach((k) => {
          if (k.spec_value_id == val.attribute_value_id) {
            k.spec_custom_value_name = val.custom_attribute_value
          }
        })
      })
      this.$parent.getSkuItems()
    },
    handleImgRemove(parent, index) {
      this.value.specImages[parent].item_image_url.splice(index, 1)
    },
    pickPics(data) {
      // if (this.value.specImages.length + data.length > 5) {
      //   this.$message.error('最多添加5张图片!')
      //   return false
      // } else {
      if (data.length != 0) {
        data.forEach((data) => {
          this.value.specImages[this.rowIndex].item_image_url.push(data.url)
        })
      }
      // }
      this.picsDialog = false
    },
    closePicsDialog() {
      this.picsDialog = false
    },
    handleSkuImg(index) {
      this.picsDialog = true
      this.isGetPics = true
      this.multiple = true
      this.rowIndex = index
    },
    fillSku() {
      const obj = { ...this.bulkFilling[0] }
      this.value.specItems.forEach((item) => {
        Object.assign(item, obj)
      })
    },
    clearSku(index) {
      this.$confirm(this.$t('d0549016.3dd6cf'), this.$t('d0549016.02d981'), {
        confirmButtonText: this.$t('d0549016.38cf16'),
        cancelButtonText: this.$t('d0549016.625fb2'),
        type: 'warning'
      }).then(() => {
        const skuItem = this.value.specItems[index]
        Object.assign(skuItem, {
          approve_status: '',
          store: '',
          item_bn: '',
          price: '',
          cost_price: '',
          market_price: '',
          barcode: '',
          point_num: '',
          weight: '',
          volume: ''
        })
      })
    }
  }
}
</script>
