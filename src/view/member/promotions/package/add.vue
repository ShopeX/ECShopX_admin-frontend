<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <el-form ref="form" :model="form" class="box-set page-package" label-width="120px">
    <el-card :header="$t('a7f95151.bfa895')" shadow="naver">
      <el-form-item :label="$t('a7f95151.d7ec2d')" prop="package_name" :rules="nameRules">
        <el-col :span="20">
          <el-input
            v-model="form.package_name"
            :maxlength="30"
            :placeholder="$t('a7f95151.017ce7')"
          />
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('a7f95151.8a35bb')">
        <el-col :span="20">
          <el-button type="primary" class="el-icon-plus" size="mini" round @click="relMainClick">
            {{ $t('a7f95151.1e72b1') }}
          </el-button>
          <GoodsSelect
            :items-visible="mainVisible"
            :get-status="setMainStatus"
            :single="singleData"
            :rel-items-ids="relMain"
            :item-type="form.item_type"
            @chooseStore="chooseMainAction"
            @closeStoreDialog="closeMainDialogAction"
          />
        </el-col>
        <el-table :data="relMain" style="line-height: normal">
          <el-table-column :label="$t('a7f95151.b718ad')" prop="item_id" width="60" />
          <el-table-column :label="$t('a7f95151.d7ec2d')" prop="item_name" min-width="200" />
          <el-table-column :label="$t('a7f95151.ea887b')" width="200">
            <template slot-scope="scope">
              <div v-if="!scope.row.nospec && !scope.row.spec_items">
                {{ $t('a7f95151.5d60de') }}
              </div>
              <div
                v-else-if="!scope.row.nospec && scope.row.spec_items"
                class="goods-sku-check"
                @click="handleSkuDialogShow(scope.row.spec_items.length)"
              >
                {{ $t('a7f95151.a0f99d') }}
              </div>
              <div v-else>{{ $t('a7f95151.048df4') }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-card>
    <el-card :header="$t('a7f95151.fbd7cb')" shadow="naver">
      <el-table
        v-if="form.main_items.length > 0"
        :data="form.main_items"
        style="line-height: normal"
      >
        <el-table-column :label="$t('a7f95151.b718ad')" prop="item_id" width="60" />
        <el-table-column :label="$t('a7f95151.d7ec2d')" prop="item_title" />
        <el-table-column :label="$t('a7f95151.ea887b')" prop="item_spec_desc" />
        <el-table-column :label="$t('a7f95151.08ee55')" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.item_price"
              min="0.01"
              size="mini"
              onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
            >
              <i slot="prefix" class="el-input__icon">{{ cursymbol }}</i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a7f95151.2b6bc0')" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="deleteMainItemRow(scope.$index, form.main_items)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card :header="$t('a7f95151.912bd1')" shadow="naver">
      <SkuSelector
        :data="relItems"
        :is-input-show="false"
        :rel-store="curStore"
        :need-store="true"
        :lock-store="true"
        :limit="1"
        :hidden-data="relMain"
        @change="getItems"
      />
    </el-card>
    <el-card :header="$t('a7f95151.8ab0d7')" shadow="naver">
      <el-table v-if="form.items.length > 0" :data="form.items" style="line-height: normal">
        <el-table-column :label="$t('a7f95151.b718ad')" prop="item_id" width="60" />
        <el-table-column :label="$t('a7f95151.d7ec2d')" prop="item_title" />
        <el-table-column :label="$t('a7f95151.ea887b')" prop="item_spec_desc" />
        <el-table-column :label="$t('a7f95151.08ee55')" width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.new_price"
              min="0.01"
              size="mini"
              onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
            >
              <i slot="prefix" class="el-input__icon">{{ cursymbol }}</i>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('a7f95151.2b6bc0')" width="50">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="deleteItemRow(scope.$index, form.items)" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card :header="$t('a7f95151.2a30f7')" shadow="naver">
      <!--<el-form-item label="组合价">-->
      <!--{{form.new_price}}元-->
      <!--</el-form-item>-->
      <el-form-item :label="$t('a7f95151.6dbb6f')">
        <el-checkbox-group v-model="validGrade">
          <el-checkbox v-for="grade in memberGrade" :key="grade.grade_id" :label="grade.grade_id">
            {{ grade.grade_name }}
          </el-checkbox>
          <el-checkbox v-for="vipdata in vipGrade" :key="vipdata.lv_type" :label="vipdata.lv_type">
            {{ $t('a7f95151.310f84') }}{{ vipdata.grade_name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="usePlatformVisiable" :label="$t('a7f95151.b90304')">
        <el-radio-group v-model="form.used_platform">
          <el-radio :label="0"> {{ $t('a7f95151.6e78ce') }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('a7f95151.bb114a')">
        <el-col :span="20">
          <el-date-picker
            v-model="activity_date"
            type="datetimerange"
            :range-separator="$t('a7f95151.981cbe')"
            :start-placeholder="$t('a7f95151.fc92e9')"
            :end-placeholder="$t('a7f95151.1fa23f')"
            format="yyyy/MM/dd HH:mm:ss"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-col>
      </el-form-item>
    </el-card>
    <el-dialog :title="$t('a7f95151.c07cd5')" :visible.sync="dialogVisible" width="50%">
      <el-table ref="skuTable" :data="skus" @selection-change="handleSkuChange">
        <el-table-column type="selection" width="55" />
        <el-table-column :label="$t('a7f95151.023809')">
          <template slot-scope="scope">
            {{ scope.row.item_spec_desc }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('a7f95151.0e9fd9')">
          <template slot-scope="scope"> ¥{{ scope.row.price / 100 }} </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('a7f95151.c08ab9') }}</el-button>
        <el-button type="primary" @click="handleSkuSubmit">{{ $t('a7f95151.aa7527') }}</el-button>
      </span>
    </el-dialog>

    <div class="content-center">
      <el-button v-if="hasSaveButton" type="primary" @click="submitActivityAction()">
        {{ $t('a7f95151.be5fbb') }}
      </el-button>
      <el-button @click.native="handleCancel"> {{ $t('a7f95151.5f4112') }} </el-button>
    </div>
  </el-form>
</template>

<script>
import GoodsSelect from '@/components/goodsSelect'
import SkuSelector from '@/components/function/skuSelectorPrice'
import { getGradeList } from '../../../../api/membercard'
import { getItemsList } from '../../../../api/goods'
import { listVipGrade } from '../../../../api/cardticket'
import {
  createPackagePromotions,
  getPackagePromotionsInfo,
  updatePackagePromotions
} from '../../../../api/promotions'

export default {
  inject: ['refresh'],
  components: {
    SkuSelector,
    GoodsSelect
  },
  data() {
    return {
      cursymbol: '￥',
      relItems: [],
      relItemsTemp: [],
      validGrade: [],
      vipGrade: [],
      memberGrade: [],
      activity_date: '',
      form: {
        package_name: '',
        used_platform: 0,
        free_postage: 1,
        items: [],
        main_item: {},
        main_items: [],
        valid_grade: [],
        source_id: '0'
      },
      relMain: [],
      setMainStatus: false,
      mainVisible: false,
      curStore: {},
      singleData: true,
      hasSaveButton: true,
      skuParams: {
        page: 1,
        pageSize: -1,
        item_type: 'normal',
        approve_status: 'onsale',
        is_sku: true,
        item_id: ''
      },
      dialogVisible: false,
      skus: [],
      checkedSkus: []
    }
  },
  computed: {
    nameRules() {
      return [{ required: true, message: this.$t('a7f95151.3efe7f'), trigger: 'blur' }]
    },
    usePlatformVisiable() {
      if (this.IS_ADMIN() && this.form.source_id != '0') {
        return false
      }
      if (this.IS_DISTRIBUTOR()) {
        return false
      }
      return true
    }
  },
  mounted() {
    if (this.$route.query.isshow) {
      this.hasSaveButton = false
    }
    this.getListVipGrade()
    this.getGradeList()
    if (this.$route.params.package_id) {
      this.getPackagePromotionsInfo(this.$route.params.package_id)
    }
  },
  methods: {
    submitActivityAction() {
      const that = this
      if (this.activity_date.length > 0) {
        this.form.start_time = this.activity_date[0] / 1000
        this.form.end_time = this.activity_date[1] / 1000
      }

      if (this.validGrade.length > 0) {
        this.form.valid_grade = this.validGrade
      }

      if (this.relMain.length > 0) {
        console.log(this.relMain, 196)
        this.form.main_item = {
          item_id: this.relMain[0].item_id,
          item_price: this.relMain[0].price
        }
      }

      if (this.$route.params.package_id) {
        updatePackagePromotions(this.$route.params.package_id, this.form)
          .then((response) => {
            this.loading = false
            this.$message({
              message: this.$t('a7f95151.69be67'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          })
          .catch()
      } else {
        createPackagePromotions(this.form)
          .then((response) => {
            this.loading = false
            this.$message({
              message: this.$t('a7f95151.3fdaea'),
              type: 'success',
              duration: 2 * 1000,
              onClose() {
                that.refresh()
                that.$router.go(-1)
              }
            })
          })
          .catch()
      }
    },

    getItems(data) {
      let items = []
      this.relItemsTemp = JSON.parse(JSON.stringify(data))
      data.forEach((item) => {
        items.push({
          item_id: item.itemId,
          item_title: item.itemName,
          activity_store: item.store,
          new_price: item.new_price / 100,
          item_spec_desc: item.item_spec_desc,
          sort: item.sort,
          limit_num: 0,
          item_type: item.item_type
        })
      })
      this.form.items = items
    },
    getListVipGrade() {
      listVipGrade().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          this.vipGrade = response.data.data
        }
      })
    },
    getGradeList() {
      getGradeList().then((response) => {
        if (response != undefined && response.data.data && response.data.data.length > 0) {
          var result = response.data.data
          if (result) {
            this.memberGrade = result
          }
        }
      })
    },
    getPackagePromotionsInfo(id) {
      getPackagePromotionsInfo(id).then((response) => {
        this.form.used_platform = response.data.data.used_platform
        this.form.free_postage = response.data.data.free_postage
        this.form.package_name = response.data.data.package_name
        this.form.source_id = response.data.data.source_id
        this.validGrade = response.data.data.valid_grade
        response.data.data.itemTreeLists.forEach((item) => {
          if (item.spec_items && item.spec_items.length > 0) {
            item.spec_items.map((specItem) => {
              for (let n in response.data.data.new_price) {
                if (n === specItem.item_id) {
                  specItem.price = response.data.data.new_price[n]
                }
              }
            })
          } else {
            item.price = item.new_price
          }
        })

        response.data.data.main_items.forEach((item) => {
          item.item_price = Number(item.item_price) / 100
        })

        this.form.main_items = response.data.data.main_items
        this.relMain = JSON.parse(JSON.stringify(response.data.data.mainItem))
        console.log(this.relMain, 288)
        this.relMain[0].price = response.data.data.mainItem[0].price / 100
        this.relItems = response.data.data.itemTreeLists
        this.activity_date = [
          response.data.data.start_time * 1000,
          response.data.data.end_time * 1000
        ]
      })
    },
    closeMainDialogAction() {
      this.mainVisible = false
    },
    deleteMainItemRow(index, rows) {
      rows.splice(index, 1)
      this.form.main_items = rows
    },
    deleteItemRow(index, rows) {
      rows.splice(index, 1)
      this.form.items = rows
    },
    chooseMainAction(data, store) {
      this.mainVisible = false
      this.relMain = JSON.parse(JSON.stringify(data))
      if (!this.relMain[0].nospec) {
        this.relMain[0].spec_items = []
      } else {
        this.relMain[0].spec_items = this.relMain[0].spec_items
      }
      this.relMain[0].price = this.relMain[0].price / 100
      let index = this.relItemsTemp.findIndex((n) => n.itemId === this.relMain[0].itemId)
      this.relItemsTemp.splice(index, 1)
      this.relItems = JSON.parse(JSON.stringify(this.relItemsTemp))
      if (store.id) {
        this.curStore = store
      } else {
        this.curStore = {
          id: '0',
          name: '总部'
        }
      }
      this.getMainItemList(this.relMain[0].item_id)
    },
    getMainItemList(id) {
      this.skuParams.item_id = id
      let items = []
      getItemsList(this.skuParams).then((res) => {
        res.data.data.list.forEach((item) => {
          items.push({
            item_id: item.itemId,
            item_title: item.itemName,
            activity_store: item.store,
            item_price: item.price / 100,
            item_spec_desc: item.item_spec_desc,
            sort: item.sort,
            limit_num: 0,
            item_type: item.item_type
          })
        })
        this.form.main_items = items
      })
    },
    handleSkuChange(val) {
      this.checkedSkus = val
    },
    handleSkuDialogShow() {
      const that = this
      this.skuParams.item_id = this.relMain[0].item_id
      this.dialogVisible = true
      let checked = this.relMain[0].spec_items
      getItemsList(this.skuParams).then((res) => {
        this.skus = res.data.data.list
        this.$nextTick(() => {
          that.skus.forEach((item) => {
            let index = checked.findIndex((n) => item.item_id === n.item_id)
            if (index !== -1) {
              that.$refs.skuTable.toggleRowSelection(item)
            }
          })
        })
      })
    },
    handleSkuSubmit() {
      this.dialogVisible = false
      this.relMain[0].spec_items = this.checkedSkus
      let items = []
      if (this.checkedSkus.length > 0) {
        this.checkedSkus.forEach((item) => {
          items.push({
            item_id: item.itemId,
            item_title: item.itemName,
            activity_store: item.store,
            item_price: item.price / 100,
            item_spec_desc: item.item_spec_desc,
            sort: item.sort,
            limit_num: 0,
            item_type: item.item_type
          })
        })
        this.relMain[0].spec_items = items
        this.form.main_items = items
      } else {
        this.skus.forEach((item) => {
          items.push({
            item_id: item.itemId,
            item_title: item.itemName,
            activity_store: item.store,
            item_price: item.price / 100,
            item_spec_desc: item.item_spec_desc,
            sort: item.sort,
            limit_num: 0,
            item_type: item.item_type
          })
        })
        this.relMain[0].spec_items = items
        this.form.main_items = items
        console.log(this.skus, 351)
      }
    },
    relMainClick() {
      this.mainVisible = true
      this.setMainStatus = true
    },
    handleCancel() {
      this.$router.back(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-package ::v-deep .el-card {
  margin-bottom: 20px;
}
.goods {
  display: flex;
  position: relative;
  padding: 10px;
  height: 80px;
  margin-bottom: 10px;
  transition: all 0.5s ease;

  &:hover {
    background: #f5f7fa;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
  }
}

.goods-thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-right: 10px;
  background: #efefef;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);

  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.goods-caption {
  flex: 1;
  padding-right: 30px;
}

.goods-title {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  box-orient: vertical;
  margin-bottom: 5px;
  width: 100%;
  max-height: 34px;
  font-size: 15px;
  line-height: 1.2;
  color: #333;
}

.goods-sku {
  color: #888;
}

.goods-sku-check {
  display: inline-block;
  margin-left: 5px;
  color: #1f82e0;
  cursor: pointer;
}

.goods-remove {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    color: #ff5000;
  }
}
</style>
