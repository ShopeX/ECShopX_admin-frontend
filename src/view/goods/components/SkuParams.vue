<style lang="scss">
.cm-sku-params {
  .icon-edit1 {
    font-size: 13px;
    color: var(--color-theme);
    margin: 0 30px 0 10px;
    visibility: hidden;
  }
  .sku-item {
    height: 100%;
    display: inline-block;
    &:hover {
      .icon-edit1 {
        visibility: visible;
      }
    }
  }
  .sku-image-table {
    .el-table__cell {
      padding: 2px 0;
    }
  }
  .sku-image {
    .image-item {
      margin: 10px 10px 10px 0;
    }
    .icon-times-circle1 {
      top: -10px;
    }
  }
  .required-mark {
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .sku-item-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
}
</style>
<template>
  <div class="cm-sku-params">
    <el-form label-width="100px">
      <el-form-item
        v-for="(item, index) in value.skus"
        :key="`sku-item__${index}`"
        :label="`${item.skuName}:`"
      >
        <el-checkbox-group v-model="item.checkedSku" @change="onSkuChange">
          <div class="sku-item-group">
          <span v-for="sku in item.skuValue" :key="sku.attribute_value_id" class="sku-item">
            <el-checkbox :label="sku.attribute_value_id">{{
              sku.custom_attribute_value || sku.attribute_value
            }}</el-checkbox>
            <el-popover placement="top" trigger="click">
              <div class="popover-edit">
                <el-input v-model="sku.custom_attribute_value" @change="onSkuChange" />
              </div>
              <el-button slot="reference" type="text">
                <i class="iconfont icon-edit1" />
              </el-button>
            </el-popover>
            </span>
          </div>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-table
      v-if="value.skuItemImages.length > 0"
      :data="value.skuItemImages"
      class="sku-image-table"
      border
      style="line-height: initial; width: 100%; margin-bottom: 26px"
    >
      <el-table-column label="规格名称" width="150px">
        <template slot-scope="scope">
          {{ scope.row.custom_attribute_value || scope.row.attribute_value }}
        </template>
      </el-table-column>
      <el-table-column prop="spec_name" label="规格图片">
        <template slot-scope="scope">
          <SpImagePicker v-model="scope.row.sku_images" :max="5" class="sku-image" size="small" />
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="bulkFilling" :show-header="false" :highlight-current-row="false">
      <el-table-column>
        <template slot-scope="scope">
          {{ scope.row.custom_attribute_value || scope.row.item_spec }}
        </template>
      </el-table-column>
      <el-table-column label="状态" v-if="!IS_SUPPLIER() && !isSupplierGoods">
        <template slot-scope="scope">
          <el-select v-model="scope.row.approve_status" size="mini" placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              size="mini"
              :disabled="statusDisabled(item)"
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
            placeholder="库存"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="medicinePrescription" label="最大开方数">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.max_num"
            type="number"
            required
            min="0"
            size="mini"
            placeholder="最大开方数量"
          />
        </template>
      </el-table-column>
      <el-table-column label="货号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.item_bn" :maxlength="60" size="mini" placeholder="货号" />
        </template>
      </el-table-column>
      <el-table-column label="重量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight" :maxlength="60" size="mini" placeholder="重量" />
        </template>
      </el-table-column>
      <el-table-column label="体积">
        <template slot-scope="scope">
          <el-input v-model="scope.row.volume" :maxlength="60" size="mini" placeholder="体积" />
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
            placeholder="销售价"
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
            placeholder="成本价"
            :disabled="disabled"
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
            placeholder="市场价"
          />
        </template>
      </el-table-column>
      <el-table-column label="起订量">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.start_num"
            type="number"
            required
            min="0"
            size="mini"
            placeholder="起订量"
          />
        </template>
      </el-table-column>
      <el-table-column label="发货时间">  
        <template slot-scope="scope"> 
          <el-input v-model="scope.row.delivery_time" :maxlength="60" size="mini" placeholder="发货时间" />
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
            placeholder="条形码"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="isShowPoint" label="获取积分">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.point_num"
            type="number"
            min="0"
            size="mini"
            placeholder="获取积分"
          />
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onFillSpecItems"> 填充 </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-table :data="value.specItems" border style="line-height: initial; width: 100%">
      <el-table-column prop="spec_name" label="规格" />
      <el-table-column label="状态" :render-header="renderRequire" v-if="!IS_SUPPLIER() && !isSupplierGoods">
        <template slot-scope="scope">
          <el-select v-model="scope.row.approve_status" size="mini" placeholder="请选择">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              :value="item.value"
              :disabled="statusDisabled(item)"
              size="mini"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="store" label="库存" :render-header="renderRequire">
        <template slot-scope="scope">
          <el-input v-model="scope.row.store" type="number" min="0" size="mini" />
        </template>
      </el-table-column>

      <el-table-column v-if="medicinePrescription" prop="max_num" label="最大开方数" :render-header="renderRequire">
        <template slot-scope="scope">
          <el-input v-model="scope.row.max_num" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="item_bn" label="货号">
        <template slot-scope="scope">
          <el-input v-model="scope.row.item_bn" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量（kg）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="volume" label="体积（m³）">
        <template slot-scope="scope">
          <el-input v-model="scope.row.volume" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="销售价" :render-header="renderRequire">
        <template slot-scope="scope">
          <el-input v-model="scope.row.price" type="number" min="0" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="cost_price" label="成本价">
        <template slot-scope="scope">
          <el-input v-model="scope.row.cost_price" type="number" min="0" size="mini" :disabled="disabled" />
        </template>
      </el-table-column>
      <el-table-column prop="market_price" label="市场价">
        <template slot-scope="scope">
          <el-input v-model="scope.row.market_price" type="number" min="0" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="start_num" label="起订量">
        <template slot-scope="scope">
          <el-input v-model="scope.row.start_num" type="number" min="0" size="mini" />
        </template>
      </el-table-column>
      <el-table-column prop="delivery_time" label="发货时间"> 
        <template slot-scope="scope"> 
          <el-input v-model="scope.row.delivery_time" :maxlength="60" size="mini" placeholder="发货时间" />
        </template>
      </el-table-column>
      <el-table-column prop="barcode" label="条形码">
        <template slot-scope="scope">
          <el-input v-model="scope.row.barcode" size="mini" />
        </template>
      </el-table-column>
      <el-table-column v-if="isShowPoint" prop="point_num" label="获取积分">
        <template slot-scope="scope">
          <el-input v-model="scope.row.point_num" type="number" min="0" size="mini" />
        </template>
      </el-table-column>
      <el-table-column width="80">
        <template slot-scope="scope">
          <el-button type="text" @click="onClearSpecItem(scope.$index)"> 清除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GOODS_TAX_RATE } from '@/consts'
import { IS_SUPPLIER } from '@/utils'
export default {
  name: 'SkuParams',
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    isShowPoint: {
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default: false
    },
    provinceList: {
      type: Array,
      default: () => []
    },
    isSupplierGoods: {
      type: Boolean,
      default: false
    },
    medicinePrescription:{
      type: Boolean,
      default: false
    }
  },
  data() {
    let statusOption = [
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
    if (!this.VERSION_IN_PURCHASE) {
      statusOption.push({
        title: '前台不展示',
        value: 'offline_sale'
      })
    }
    return {
      tax_rate_list: GOODS_TAX_RATE,
      bulkFilling: [
        {
          approve_status: '',
          store: '',
          max_num:'',
          item_bn: '',
          price: '',
          cost_price: '',
          market_price: '',
          start_num: 0,
          barcode: '',
          point_num: '',
          weight: '',
          volume: '',
          supplier_goods_bn: '',
          tax_rate: '',
          delivery_time:"",
        }
      ],
      statusOption,
      cacheSpecImages: [],
      cacheSpecItems: [],
      isFirst:true
    }
  },
  watch:{
    medicinePrescription(nval){
      if(nval){
        if(this.isFirst){
          //解决第一次渲染改数据时触发组件的验证报错
          this.isFirst = false
        }else{
          this.bulkFilling.forEach(item=>item.approve_status = 'instock')
        }
        if(this.value.specItems.length){
          this.value.specItems.forEach(item=>item.approve_status = 'instock')
        }
      }
    }
  },
  created() {
    this.isFirstRender = true
  },
  methods: {
    renderRequire(h, { column }) {
      return h(
        'label',
        {
          class: 'required-mark'
        },
        column.label
      )
    },
    cartesianProductOf() {
      var result = Array.prototype.reduce.call(
        arguments,
        function (a, b) {
          var ret = []
          if (b.length > 0) {
            a.forEach(function (a) {
              b.forEach(function (b) {
                ret.push(a.concat([b]))
              })
            })
          } else {
            a[0].length ? ret.push(...a) : (ret = [[]])
          }
          return ret
        },
        [[]]
      )
      if (result.length === 1 && result[0].length === 0) {
        result = []
      }
      return result
    },
    statusDisabled({value}){
      if(this.medicinePrescription && value == 'instock' || !this.medicinePrescription){
        return false
      }
      return true
    },
    onSkuChange({ spec_images, spec_items }) {
      this.getSkuItemImages(spec_images)
      this.getSkuItems(spec_items)
    },
    getSkuItemImages(value) {
      const { skuValue = [], checkedSku = [] } =
        JSON.parse(JSON.stringify(this.value.skus))
          .reverse()
          .find((item) => item.isImage) || {}
      if (!skuValue) {
        return
      }
      this.value.skuItemImages = skuValue
        .filter(({ attribute_value_id }) => checkedSku.includes(attribute_value_id))
        .map((item) => {
          if (!value) {
            // 与前一次编辑的缓存数据合并
            const fd = this.value.skuItemImages.find(
              ({ attribute_value_id }) => attribute_value_id == item.attribute_value_id
            )
            if (fd) {
              return {
                ...fd,
                custom_attribute_value: item.custom_attribute_value || fd.custom_attribute_value
              }
            } else {
              return item
            }
          }
          let sku_images = []
          const result = value.find(({ spec_value_id }) => spec_value_id == item.attribute_value_id)
          if (result) {
            sku_images = result.item_image_url
          }

          return {
            ...item,
            sku_images
          }
        })
      // console.log('this.value.skuItemImages', this.value.skuItemImages)
    },
    getSkuItems(value) {
      const skuMartix = this.value.skus.map(({ checkedSku }) => checkedSku)
      const specItems = this.cartesianProductOf(...skuMartix)
      // console.log('getSkuItems:', JSON.stringify(specItems))
      let _specItems = []
      if (value || this.value.specItems) {
        const _value = value || this.value.specItems
        _specItems = _value.map(
          ({
            item_id,
            approve_status,
            store,
            max_num,
            item_bn,
            weight,
            volume,
            price,
            cost_price,
            market_price,
            start_num,
            barcode,
            point_num,
            item_spec,
            supplier_goods_bn,
            tax_rate,
            delivery_time
          }) => {
            const vKey = item_spec.map(({ spec_value_id }) => spec_value_id).join('_')
            const specName = item_spec.map(
              ({ spec_custom_value_name, spec_value_name }) =>
                spec_custom_value_name || spec_value_name
            )
            return {
              item_id,
              sku_id: vKey,
              spec_name: specName.join(' '),
              is_default: false,
              approve_status,
              store,
              max_num,
              item_bn,
              weight,
              item_spec,
              delivery_time,
              volume,
              price: isNaN(price / 100) ? '' : price / 100,
              cost_price: isNaN(cost_price / 100) ? '' : cost_price / 100,
              market_price: isNaN(market_price / 100) ? '' : market_price / 100,
              start_num,
              barcode,
              point_num,
              supplier_goods_bn,
              tax_rate,
            }
          }
        )
      }
      // 新生成的sku
      specItems?.filter(el => !this.noDefaultSpecItems?.includes(el.join('_')))?.forEach((item) => {
        const key = item.join('_')
        if (!_specItems.find(({ sku_id }) => sku_id == key)) {
          const {
            approve_status,
            store,
            max_num,
            item_bn,
            weight,
            volume,
            price,
            cost_price,
            market_price,
            start_num,
            barcode,
            point_num,
            supplier_goods_bn,
            tax_rate,
            delivery_time,
            item_spec,
          } = item
          _specItems.push({
            sku_id: key,
            spec_name: this.getSpecName(item),
            is_default: false,
            approve_status,
            store,
            max_num,
            item_bn,
            weight,
            volume,
            price: isNaN(price / 100) ? '' : price / 100,
            cost_price: isNaN(cost_price / 100) ? '' : cost_price / 100,
            market_price: isNaN(market_price / 100) ? '' : market_price / 100,
            start_num,
            barcode,
            point_num,
            supplier_goods_bn,
            tax_rate,
            delivery_time,
            item_spec,
          })
        }
      })
      if(this.isFirstRender) {
        this.noDefaultSpecItems = _specItems?.filter(el => !el.item_id)?.map(el => el.sku_id)
        _specItems = _specItems?.filter(el => !!el.item_id)
        this.isFirstRender = false
      }
      // 与前一次编辑的缓存数据合并
      this.value.specItems = _specItems.map((item) => {
        const fd = this.value.specItems.find(({ sku_id }) => sku_id == item.sku_id)
        if (fd) {
          return {
            ...fd,
            spec_name: item.spec_name
          }
        } else {
          return item
        }
      })
    },
    // 获取规格名称
    getSpecName(keys) {
      const { skus } = this.value
      const specNames = []
      keys.forEach((key, index) => {
        const { attribute_value, custom_attribute_value } = skus[index]?.skuValue?.find(
          (s) => s?.attribute_value_id == key
        ) || {}
        specNames.push(custom_attribute_value || attribute_value)
      })
      return specNames.join(' ')
    },
    // 批量填充
    onFillSpecItems() {
      const {
        approve_status,
        store,
        max_num,
        item_bn,
        weight,
        volume,
        price,
        cost_price,
        market_price,
        start_num,
        barcode,
        point_num,
        supplier_goods_bn,
        tax_rate,
            delivery_time
      } = this.bulkFilling[0]

      this.value.specItems.forEach((item) => {
        item.approve_status = approve_status
        item.store = store
        item.max_num = max_num
        item.item_bn = item_bn
        item.weight = weight
        item.volume = volume
        item.price = price
        item.cost_price = cost_price
        item.market_price = market_price
        item.start_num = start_num
        item.barcode = barcode
        item.point_num = point_num
        item.supplier_goods_bn = supplier_goods_bn
        item.tax_rate = tax_rate
        item.delivery_time = delivery_time
      })
    },
    // 清除
    async onClearSpecItem(index) {
      await this.$confirm('确定清除当前规格的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      Object.assign(this.value.specItems[index], {
        approve_status: '',
        store: '',
        max_num:'',
        item_bn: '',
        weight: '',
        volume: '',
        price: '',
        cost_price: '',
        market_price: '',
        start_num : 0,
        barcode: '',
        point_num: '',
        supplier_goods_bn: '',
        tax_rate: '',
        delivery_time: ''
      })
    }
  }
}
</script>
