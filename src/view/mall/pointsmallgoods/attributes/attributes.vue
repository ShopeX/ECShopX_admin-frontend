<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :gutter="20">
      <el-col>
        <el-input
          v-model="params.attribute_name"
          class="input-b"
          :placeholder="$t('0712913a.023809')"
          @change="brandSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="brandSearch" />
        </el-input>
        <el-button type="primary" icon="el-icon-circle-plus" @click="handleNew">
          {{ $t('0712913a.ac469a') }}
        </el-button>
      </el-col>
    </el-row>
    <el-card>
      <el-table
        v-loading="loading"
        :data="list"
        :height="wheight - 170"
        :element-loading-text="$t('0712913a.f09b12')"
        :default-sort="{ prop: 'bind_date', order: 'descending' }"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <span
              v-for="(item, index) in props.row.attribute_values.list"
              :key="index"
              class="sku-value"
              ><img v-if="item.image_url" class="sku-img" :src="item.image_url" />{{
                item.attribute_value
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column :label="$t('0712913a.2b6bc0')" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">
              {{ $t('0712913a.95b351') }}
            </el-button>
            <el-button type="text" @click="handleDelete(scope)">
              {{ $t('0712913a.2f4aad') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="$t('0712913a.226b09')" width="150">
          <template slot-scope="props">
            {{
              props.row.is_image &&
              (JSON.parse(props.row.is_image) ? $t('0712913a.20def7') : $t('0712913a.ca746b'))
            }}
          </template>
        </el-table-column>
        <el-table-column prop="attribute_name" :label="$t('0712913a.023809')" width="200" />
        <el-table-column prop="attribute_memo" :label="$t('0712913a.bfe414')" />
      </el-table>
      <div v-if="total_count > params.pageSize" class="mt-4 text-right">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page.sync="params.page"
          :page-sizes="[10, 20, 50]"
          :total="total_count"
          :page-size="params.pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
    <imgPicker
      :dialog-visible="imgDialog"
      :sc-status="isGetImage"
      @chooseImg="pickImg"
      @closeImgDialog="closeImgDialog"
    />
    <sideBar :visible.sync="show_sideBar" :title="$t('0712913a.ac469a')">
      <el-form>
        <el-form-item :label="$t('0712913a.023809')">
          <el-input v-model="form.attribute_name" />
        </el-form-item>
        <el-form-item :label="$t('0712913a.bfe414')">
          <el-input v-model="form.attribute_memo" />
        </el-form-item>
        <el-form-item :label="$t('0712913a.1ca8f1')">
          <el-radio-group v-model="form.is_image">
            <el-radio :label="false"> {{ $t('0712913a.ca746b') }} </el-radio>
            <el-radio :label="true"> {{ $t('0712913a.20def7') }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('0712913a.94d502')">
          <div class="clearfix" />
          <div
            v-for="(item, index) in form.attribute_values"
            :key="index"
            class="view-flex view-flex-middle key-item"
          >
            <div v-if="form.is_image" class="upload-box" @click="handleImgPicker(index)">
              <img v-if="item.image_url" :src="item.image_url" class="avatar" />
              <i v-else class="el-icon-camera avatar-uploader-icon" />
            </div>
            <div
              class="view-flex-item"
              :class="form.is_image ? 'content-h-padded' : 'content-padded-right'"
            >
              <el-input v-model="item.attribute_value" :placeholder="$t('0712913a.2690c2')" />
            </div>
            <div @click="removeItem(index)">
              <i class="el-icon-delete-solid" />
            </div>
          </div>
          <el-button type="default" size="small" @click="addItem">
            {{ $t('0712913a.cfa46a') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save"> {{ $t('0712913a.939d53') }} </el-button>
        </el-form-item>
      </el-form>
    </sideBar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import imgPicker from '@/components/imageselect'
import {
  getGoodsAttr,
  addGoodsAttr,
  updateGoodsAttr,
  deleteGoodsAttr
} from '../../../../api/pointsmall'
import sideBar from '@/components/element/sideBar'
export default {
  components: {
    sideBar,
    imgPicker
  },
  data() {
    return {
      currentIndex: '',
      form: {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: []
      },
      params: {
        page: 1,
        pageSize: 20,
        attribute_type: 'item_spec',
        attribute_name: ''
      },
      list: [],
      loading: false,
      imgDialog: false,
      isGetImage: false,
      imgIndex: 0,
      brand_name: '',
      total_count: 0,
      show_sideBar: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleDelete(data) {
      this.$confirm(this.$t('0712913a.67d5b6'))
        .then((_) => {
          deleteGoodsAttr(data.row.attribute_id).then((res) => {
            this.list.splice(data.$index, 1)
            this.$message({ type: 'success', message: this.$t('0712913a.33130f') })
          })
        })
        .catch((_) => {})
    },
    handleNew() {
      this.show_sideBar = true
      this.resetData()
    },
    resetData() {
      this.form = {
        is_image: false,
        attribute_type: 'item_spec',
        attribute_id: '',
        attribute_name: '',
        attribute_memo: '',
        attribute_values: []
      }
    },
    handleEdit(data) {
      this.show_sideBar = true
      this.form = {
        is_image: JSON.parse(data.is_image),
        attribute_id: data.attribute_id,
        attribute_type: data.attribute_type,
        attribute_name: data.attribute_name,
        attribute_memo: data.attribute_memo,
        attribute_values: data.attribute_values.list
      }
    },
    addItem() {
      if (this.form.attribute_values.length > 50) {
        this.$message({ type: 'warning', message: this.$t('0712913a.94360c') })
        return
      }
      let item = {
        attribute_value: '',
        image_url: ''
      }
      this.form.attribute_values.push(item)
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.getList()
    },
    handleSizeChange(pageSize) {
      this.params.page = 1
      this.params.pageSize = pageSize
      this.getList()
    },
    removeItem(index) {
      this.$confirm(this.$t('0712913a.167628'))
        .then((_) => {
          this.form.attribute_values.splice(index, 1)
        })
        .catch((_) => {})
    },
    save() {
      let params = JSON.parse(JSON.stringify(this.form))
      params.attribute_values = JSON.stringify(params.attribute_values)
      // 如果没有id，则表示为新增
      if (!this.form.attribute_id) {
        addGoodsAttr(params).then((res) => {
          this.$message({ type: 'success', message: this.$t('0712913a.33130f') })
          this.params.page = 1
          this.resetData()
          this.getList()
        })
      } else {
        updateGoodsAttr(params.attribute_id, params).then((res) => {
          this.$message({ type: 'success', message: this.$t('0712913a.33130f') })
          this.getList()
        })
      }
    },
    getList() {
      this.loading = true
      getGoodsAttr(this.params).then((res) => {
        this.list = res.data.data.list
        this.total_count = res.data.data.total_count
        this.loading = false
      })
    },
    // 品牌搜索
    brandSearch() {
      this.getList()
    },
    handleImgChange(data) {
      this.imgDialog = true
      this.isGetImage = true
      this.imgIndex = data.$index
    },
    handleImgPicker(index) {
      this.currentIndex = index
      this.imgDialog = true
      this.isGetImage = true
    },
    pickImg(data) {
      this.form.attribute_values[this.currentIndex].image_url = data.url
      this.imgDialog = false
    },
    closeImgDialog() {
      this.imgDialog = false
      this.isGetImage = false
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  }
}
</script>
<style scoped lang="scss">
.sku-value {
  margin-right: 10px;
}
.sku-img {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 5px;
  vertical-align: middle;
}
.key-item {
  padding-bottom: 10px;
  .iconfont {
    color: #999;
  }
}
.upload-box {
  width: 50px;
  height: 50px;
  .avatar-uploader-icon {
    line-height: 50px;
    font-size: 20px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
