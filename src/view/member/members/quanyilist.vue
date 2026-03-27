<!--
  Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
  See LICENSE file for license details.
-->

<style lang="scss">
.transfer-footer {
  padding: 6px 5px;
}
</style>
<style type="text/css" lang="scss">
.right-dialog {
  .el-transfer-panel {
    width: 240px;
  }
  .el-transfer-panel__body.is-with-footer {
    box-sizing: content-box;
  }
}
</style>
<template>
  <div class="section-white">
    <el-row class="content-bottom-padded" :gutter="20">
      <el-col :span="3">
        <el-button type="primary" icon="plus" @click="addResource">
{{
          $t('67f91254.ba6956')
        }}
</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="rightsList" border>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div v-for="(info, idx) in scope.row.label_infos" :key="idx">
            <span>{{ $t('67f91254.b87551') }}</span
            ><el-tag type="success">
              {{ info.label_name }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="rights_name" :label="$t('67f91254.d7ec2d')" min-width="140" />
      <el-table-column prop="rights_from" :label="$t('67f91254.26ca20')" min-width="100" />
      <el-table-column prop="operator_desc" :label="$t('67f91254.0cba5b')" />
      <el-table-column prop="total_num" :label="$t('67f91254.8887e3')">
        <template slot-scope="scope">
          <span v-if="scope.row.is_not_limit_num == 2">{{ scope.row.total_num }}</span>
          <span v-if="scope.row.is_not_limit_num == 1">{{ $t('67f91254.53e5df') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total_consum_num" :label="$t('67f91254.d6004a')" />
      <el-table-column :label="$t('67f91254.1fa23f')">
        <template slot-scope="scope">
          <span>{{ scope.row.end_time | datetime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('67f91254.3fea7c')">
        <template slot-scope="scope">
          <template v-if="scope.row.is_not_limit_num == 2">
            <el-tag v-if="scope.row.total_num == scope.row.total_consum_num" size="mini">
              {{ $t('67f91254.535023') }}
            </el-tag>
          </template>
          <template v-if="scope.row.is_not_limit_num == 1">
            <el-tag size="mini">{{ $t('67f91254.53e5df') }}</el-tag>
          </template>
          <el-tag v-else-if="scope.row.is_valid == '1'" type="success" size="mini">
{{
            $t('67f91254.c6cc39')
          }}
</el-tag>
          <el-tag v-else size="mini">{{ $t('67f91254.4d5ccd') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total_count > params.pageSize" class="content-padded tc">
      <el-pagination
        :total="total_count"
        :page-size="params.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      :title="$t('67f91254.ba6956')"
      class="right-dialog"
      :visible.sync="addRightsDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form>
          <!-- <el-form-item label-width="100px" label="手机号">
            <el-col :span="9">
              <el-input v-model="mobile"  placeholder="请输入添加权益用户的手机号"></el-input>
            </el-col>
          </el-form-item> -->
          <el-form-item label-width="100px" :label="$t('67f91254.015d03')">
            <el-transfer
              v-model="addRightsItems"
              :titles="[$t('67f91254.437974'), $t('67f91254.543b04')]"
              :data="goodsList"
            >
              <div slot="left-footer" class="transfer-footer">
                <el-pagination
                  v-if="goods_total_count > goodsParams.pageSize"
                  small
                  layout="prev, pager, next"
                  :total="goods_total_count"
                  :page-size="goodsParams.pageSize"
                  @current-change="handleGoodsChange"
                />
              </div>
              <div slot="right-footer" class="transfer-footer" />
            </el-transfer>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button type="primary" @click="onSubmit">{{ $t('67f91254.b04fcb') }}</el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { findRightsList, createRights } from '../../../api/trade'
import { getItemsList } from '../../../api/goods'
export default {
  props: ['userId', 'isLoad', 'userMobile'],
  data() {
    return {
      user_id: 0,
      loading: false,
      addRightsDialog: false,
      mobile: '',
      searchMobile: '',
      goodsList: [],
      mobile: '',
      addRightsItems: [],
      goodsListSelect: [],
      rightsList: [],
      total_count: 0,
      goods_total_count: 0,
      goods_page: 1,
      goodsParams: {
        page: 1,
        pageSize: 20
      },
      params: {
        page: 1,
        pageSize: 20,
        user_id: 0
      }
    }
  },
  watch: {
    userId(newVal, oldVal) {
      if (this.isLoad) {
        this.rightsList = []
        this.params.user_id = newVal
        this.getRightsList()
      }
    },
    isLoad(newVal, oldVal) {
      if (newVal) {
        this.rightsList = []
        this.params.user_id = this.userId
        this.getRightsList()
      }
    },
    userMobile(newVal, oldVal) {
      this.mobile = newVal
    }
  },
  mounted() {
    this.getRightsList()
  },
  methods: {
    onSubmit() {
      let query = { mobile: this.userMobile, itemids: this.addRightsItems }
      createRights(query).then((res) => {
        // this.mobile = ''
        this.addRightsItems = []
        this.$message({
          type: 'success',
          message: this.$t('67f91254.d71d42')
        })
        this.getRightsList()
        this.addRightsDialog = false
      })
    },
    addResource() {
      this.getGoodsList()
      // this.mobile = ''
      this.addRightsDialog = true
    },
    handleCancelLabelsDialog() {
      this.addRightsDialog = false
    },
    handleCurrentChange(val) {
      this.loading = false
      this.params.page = val
      this.getRightsList()
    },
    handleGoodsChange(val) {
      this.goodsParams.page = val
      this.goodsListSelect = []
      this.goodsList.forEach((row) => {
        //如果选中
        let index = this.addRightsItems.indexOf(row.key)
        if (index != -1) {
          this.goodsListSelect.push(row)
        }
      })
      this.getGoodsList()
    },
    getGoodsList() {
      getItemsList(this.goodsParams).then((response) => {
        let list = []
        response.data.data.list.forEach((row) => {
          let index = this.addRightsItems.indexOf(row.itemId)
          //如果未选中
          if (index === -1) {
            list.push({
              key: row.itemId,
              label: row.itemName
            })
          }
        })
        this.goodsList = list.concat(this.goodsListSelect)
        this.goods_total_count = response.data.data.total_count
      })
    },
    getRightsList() {
      this.loading = true
      findRightsList(this.params).then((response) => {
        this.rightsList = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    }
  }
}
</script>
