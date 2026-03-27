<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<template>
  <div>
    <el-row :span="20">
      <el-col :span="12">
        {{ $t('6e484b97.0eff7d') }}
        <el-select v-model="shopId" @change="storeChange">
          <el-option
            v-for="item in shopListData"
            :key="item.wxShopId"
            :label="item.storeName"
            :value="item.wxShopId"
          />
        </el-select>
      </el-col>
      <el-col :span="12" class="content-right">
        <el-button type="primary" icon="plus" @click="addResource">
          {{ $t('6e484b97.b58c75') }}{{ resourceName }}
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="resourceLevelList" :height="wheight - 170" border>
      <el-table-column prop="shopName" :label="$t('6e484b97.a6cf26')" />
      <el-table-column prop="name" :label="resourceName + $t('6e484b97.d7ec2d')" />
      <el-table-column prop="materialIds.length" :label="$t('6e484b97.6222a2')" />
      <el-table-column prop="materialIds.status" :label="$t('6e484b97.6222a2')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 'active'"> {{ $t('6e484b97.9db7a8') }} </el-tag>
          <el-tag v-if="scope.row.status == 'invalid'" type="success">
            {{ $t('6e484b97.9c5850') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('6e484b97.2b6bc0')">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="getDetail(scope.row.resourceLevelId)">{{
            $t('6e484b97.607e7a')
          }}</a>
          &nbsp;
          <a
            href="javascript:void(0)"
            @click="updateResource(scope.row.resourceLevelId, scope.row.shopId)"
            >{{ $t('6e484b97.95b351') }}</a
          >
          &nbsp;
          <a
            href="javascript:void(0)"
            @click="deleteResource(scope.row.resourceLevelId, scope.row.shopId)"
            >{{ $t('6e484b97.2f4aad') }}</a
          >
          &nbsp;
          <a
            v-if="scope.row.status == 'active'"
            href="javascript:void(0)"
            @click="updateStatus(scope.row.resourceLevelId, scope.row.status)"
            >{{ $t('6e484b97.b15d91') }}</a
          >
          <a
            v-if="scope.row.status == 'invalid'"
            href="javascript:void(0)"
            @click="updateStatus(scope.row.resourceLevelId, scope.row.status)"
            >{{ $t('6e484b97.cc42dd') }}</a
          >
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="mt-4 text-right">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="params.page"
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="$t('6e484b97.f26225')"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
    >
      <el-form v-model="detailForm" label-width="160px">
        <el-form-item :label="$t('6e484b97.5b4786')">
          <span class="text-ellipsis" :title="detailForm.name">{{ detailForm.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('6e484b97.5b124a')">
          {{ detailForm.shopName }}
        </el-form-item>
        <el-form-item :label="$t('6e484b97.da0075')">
          <el-row>
            <el-col v-for="item in serverproject" :key="index" :span="6" :title="item.label">
              <span>{{ item }}</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('6e484b97.d8a65a')">
          <span class="text-ellipsis" :title="detailForm.description">{{
            detailForm.description
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('6e484b97.51ccb6')">
          <img
            v-if="detailForm.imageUrl"
            :src="detailForm.imageUrl ? wximageurl + detailForm.imageUrl : ''"
            class="avatar"
          >
          <span v-else>{{ $t('6e484b97.5423e2') }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer content-center">
        <el-button type="primary" @click="detailDialog = false">
          {{ $t('6e484b97.38cf16') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  getListResourceLevel,
  getResourceLevel,
  deleteResourceLevel,
  updateResourceLevelStatus
} from '../../../../api/reservation'
import { getWxShopsList } from '../../../../api/shop'
import { getServiceLabelsList } from '../../../../api/goods'
export default {
  props: ['isLoad', 'resourceName'],
  data() {
    return {
      shopListData: [],
      shopId: '',
      resourceLevelList: [],
      levelParams: {},
      pageLimit: 10,
      loading: false,
      params: {
        shopId: '',
        page: 1,
        pageSize: 20
      },
      detailDialog: false,
      serverproject: [],
      expiredAt: '',
      detailForm: {},
      nowTime: Date.parse(new Date()) / 1000,
      total_count: ''
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  watch: {
    isLoad(newValue, oldValue) {
      if (newValue) {
        this.resourceLevelList = []
        this.getStoreList()
        if (this.shopId) {
          this.params.shopId = this.shopId
          this.getLevelList()
        }
      }
    }
  },
  mounted() {
    this.getStoreList()
    this.getLevelList()
  },
  methods: {
    handleCurrentChange(page_num) {
      this.params.page = page_num
      this.params.shopId = this.shopId
      this.getLevelList()
    },
    addResource() {
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: '' } })
    },
    updateResource(resourceLevelId, shopId) {
      var index
      for (index in this.shopListData) {
        if (shopId == this.shopListData[index].wxShopId) {
          var expiredAt = this.shopListData[index].expiredAt
          if (!expiredAt || (expiredAt && expiredAt <= this.nowTime)) {
            this.$message({
              type: 'error',
              message: this.$t('6e484b97.1b47b6')
            })
            return
          }
        }
      }
      this.$router.push({ path: this.matchRoutePath('editor'), query: { id: resourceLevelId } })
    },
    deleteResource(resourceLevelId, shopId) {
      this.$confirm(this.$t('6e484b97.16c34a'), this.$t('6e484b97.02d981'), {
        cancelButtonText: this.$t('6e484b97.625fb2'),
        confirmButtonText: this.$t('6e484b97.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            var params = {
              resource_level_id: resourceLevelId,
              shop_id: shopId
            }
            deleteResourceLevel(params).then((res) => {
              if (res.data.data.status) {
                this.$message({
                  type: 'success',
                  message: this.$t('6e484b97.0007d1')
                })
              }
              this.getLevelList()
            })
          }
          done()
        }
      })
    },
    getDetail(resourceLevelId) {
      if (resourceLevelId) {
        this.detailDialog = true
        getResourceLevel(resourceLevelId).then((res) => {
          this.detailForm = res.data.data
          var materialIds = res.data.data.materialIds
          this.getLabelsList(materialIds)
        })
      }
    },
    storeChange(shopId) {
      this.params.shopId = shopId
      this.params.page = 1
      this.getLevelList()
    },
    getLevelList() {
      this.loading = true
      getListResourceLevel(this.params).then((res) => {
        if (res.data.data.list) {
          this.resourceLevelList = res.data.data.list
          this.total_count = res.data.data.total_count
        } else {
          this.resourceLevelList = []
        }
        this.loading = false
      })
    },
    getStoreList() {
      this.storeList = []
      this.loading = true
      var shopFilter = { page: 1, pageSize: 500 }
      getWxShopsList(shopFilter).then((response) => {
        this.shopListData = response.data.data.list
        if (this.shopId == '' && this.shopListData[0].wxShopId) {
          this.shopId = this.shopListData[0].wxShopId
          this.storeChange(this.shopListData[0].wxShopId)
        }
        this.loading = false
      })
    },
    getLabelsList(materialIds) {
      this.serverproject = []
      var params = { page: 1, pageSize: 100 }
      params.service_type = 'timescard'
      getServiceLabelsList(params).then((response) => {
        var labelsList = response.data.data.list
        var index
        for (var j = 0; j < labelsList.length; j++) {
          for (var n = 0; n < materialIds.length; n++) {
            if (labelsList[j].labelId == materialIds[n]) {
              this.serverproject.push(labelsList[j].labelName)
            }
          }
        }
      })
    },
    updateStatus(id, status) {
      let params = {
        resourceLevelId: id,
        status: status == 'invalid' ? 'true' : 'false'
      }
      let msg = status == 'invalid' ? this.$t('6e484b97.612270') : this.$t('6e484b97.ef0a0b')
      this.$confirm(msg, this.$t('6e484b97.02d981'), {
        cancelButtonText: this.$t('6e484b97.625fb2'),
        confirmButtonText: this.$t('6e484b97.38cf16'),
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            updateResourceLevelStatus(params).then((res) => {
              this.$message({
                type: 'success',
                message: this.$t('6e484b97.69be67')
              })
              this.getLevelList()
            })
          }
          done()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-preview {
  text-align: center;
  max-width: 200px;
  border: 1px solid #ddd;
  padding: 10px;
  position: relative;
  img {
    max-width: 200px;
    margin: 0 auto;
  }
}
.text-ellipsis {
  display: inline-block;
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.avatar {
  width: 200px;
}
</style>
