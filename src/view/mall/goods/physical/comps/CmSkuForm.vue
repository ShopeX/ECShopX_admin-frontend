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
      <div class="block-head-hd">商品规格</div>
      <div class="block-head-ft">
        <el-switch
          v-if="!isEditor"
          v-model="value.nospec"
          style="margin-left: 30px"
          active-color="#13ce66"
          inactive-color="#efefef"
          active-text="统一规格"
          inactive-text="多规格"
          @change="specOnChange"
        />
        <span style="margin-left: 30px">
          <span style="margin-right: 10px">是否在商详页成列图片规格</span>
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
              <el-form-item label="商品状态" required>
                <el-select
                  v-model="value.specData.approve_status"
                  class="width-full"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusOption"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="!isPackageItems" :span="8">
              <el-form-item label="库存">
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
              <el-form-item label="商品货号">
                <el-input v-model="value.specData.item_bn" :maxlength="60" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="重量">
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
              <el-form-item label="体积">
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
              <el-form-item label="销售价">
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
              <el-form-item label="成本价">
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
              <el-form-item label="市场价">
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
              <el-form-item label="条形码">
                <el-input v-model="value.specData.barcode" required min="0" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="pointAccess == 'items'" :span="8">
              <el-form-item label="获取积分">
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
                <div
                  v-for="(itemValue, vn) in item.sku_value"
                  :key="vn"
                  class="sku-select__checkitem"
                >
                  {{ itemValue.custom_attribute_value }}
                  <el-checkbox class="sku-checkbox" :label="itemValue.attribute_value_id">
                    <el-input
                      v-if="item.checked_sku.indexOf(itemValue.attribute_value_id) !== -1"
                      v-model="itemValue.custom_attribute_value"
                      size="mini"
                      style="width: 100px"
                      @change="handleSkuName(itemValue, index, vn)"
                    />
                    <span v-else>{{ itemValue.attribute_value }}</span>
                  </el-checkbox>
                  <imgBox
                    v-if="itemValue.image_url"
                    class="sku-image"
                    :img-url="itemValue.image_url"
                    width="50"
                    height="50"
                  />
                </div>
              </el-checkbox-group>
            </div>
          </div>
        </div>
        <div class="sub-label">设置规格图片</div>
        <!-- {{value.specImages}} -->
        <div class="sub-block">
          <el-table :data="value.specImages" :header-cell-style="{ background: '#f5f7fa' }">
            <el-table-column label="规格" width="240">
              <template slot-scope="scope">
                {{ scope.row.spec_custom_value_name || scope.row.spec_value_name }}
              </template>
            </el-table-column>
            <el-table-column label="规格图">
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
        <div class="sub-label">设置规格</div>
        <div class="sub-block">
          <el-table :data="bulkFilling" :show-header="false" :highlight-current-row="false">
            <el-table-column>
              <template slot-scope="scope">
                {{ scope.row.custom_attribute_value || scope.row.item_spec }}
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
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="!isPackageItems" label="库存">
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
                <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="" />
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
            <el-table-column label="市场价">
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
            <el-table-column v-if="pointAccess == 'items'" label="获取积分">
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
                <el-button type="primary" size="mini" @click="fillSku"> 填充 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="value.specItems"
            :header-cell-style="{ background: '#f5f7fa' }"
            :max-height="600"
            style="width: 100%"
          >
            <el-table-column label="规格值" prop="spec_name" />
            <el-table-column label="状态" :render-header="renderRequire">
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
            <el-table-column v-if="!isPackageItems" label="库存" :render-header="renderRequire">
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
                <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column label="重量(kg)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="" />
              </template>
            </el-table-column>
            <el-table-column label="体积(m³)">
              <template slot-scope="scope">
                <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="" />
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
            <el-table-column label="市场价">
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
                  :maxlength="6000"
                  size="mini"
                  placeholder=""
                />
              </template>
            </el-table-column>
            <el-table-column v-if="pointAccess == 'items'" label="获取积分">
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
                <el-button type="text" @click="clearSku(scope.$index)"> 清除 </el-button>
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
      statusOption: this.VERSION_IN_PURCHASE
        ? [
            {
              title: '前台可销售',
              value: 'onsale'
            },
            {
              title: '前台仅展示',
              value: 'only_show'
            },
            {
              title: '不可销售',
              value: 'instock'
            }
          ]
        : [
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
      this.$confirm('确定清除当前规格的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
