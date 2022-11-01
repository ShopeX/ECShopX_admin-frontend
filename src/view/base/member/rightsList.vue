<style type="text/css" lang="scss">
.right-dialog {
  .el-transfer-panel {
    width: 240px;
  }
  .el-transfer-panel__footer {
    height: 38px;
    clear: both;
  }
}
.transfer-footer {
  padding: 6px 5px;
}
.alert-txt {
  padding: 15px 0;
}
.delay-dialog {
  .el-textarea {
    width: 80%;
    vertical-align: middle;
  }
  .option-box {
    padding: 15px 0;
    .el-date-editor {
      width: 70%;
    }
  }
}
</style>

<template>
  <div class="section-white">
    <el-tabs
      v-model="activeName"
      class="section-white content-padded"
    >
      <div class="content-padded">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              v-model="searchMobile"
              placeholder="手机号"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="numberSearch"
              />
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-tab-pane
        label="会员权益列表"
        name="first"
      >
        <div class="content-padded">
          <el-table
            v-loading="loading"
            :data="rightsList"
            element-loading-text="数据加载中"
          >
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div v-for="info in scope.row.label_infos">
                  <span>包含物料：</span><el-tag type="success">
                    {{ info.label_name }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="rights_name"
              label="名称"
              min-width="140"
            />
            <el-table-column
              prop="rights_from"
              label="来源"
              min-width="100"
            />
            <el-table-column
              prop="mobile"
              label="手机号"
              min-width="90"
            />
            <el-table-column
              prop="total_num"
              label="总数量"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.is_not_limit_num == 2">{{ scope.row.total_num }}</span>
                <span v-if="scope.row.is_not_limit_num == 1">无限次</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="total_consum_num"
              label="已核销数量"
            />
            <el-table-column label="过期时间">
              <template slot-scope="scope">
                <span>{{ scope.row.end_time | datetime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <template v-if="scope.row.is_not_limit_num == 2">
                  <el-tag v-if="scope.row.total_num == scope.row.total_consum_num">
                    已用完
                  </el-tag>
                </template>
                <template v-if="scope.row.is_not_limit_num == 1">
                  <el-tag>无限次</el-tag>
                </template>
                <el-tag
                  v-else-if="scope.row.is_valid == '1'"
                  type="success"
                >
                  有效
                </el-tag>
                <el-tag v-else>
                  已过期
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="delayAction(scope.row)"
                >
                  延期
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="total_count > params.pageSize"
            class="content-padded tc"
          >
            <el-pagination
              :total="total_count"
              :page-size="params.pageSize"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加、编辑标识-开始 -->
    <el-dialog
      title="添加权益"
      class="right-dialog"
      :visible.sync="addRightsDialog"
      :before-close="handleCancelLabelsDialog"
    >
      <template>
        <el-form>
          <el-form-item
            label-width="100px"
            label="手机号"
          >
            <el-col :span="9">
              <el-input
                v-model="mobile"
                placeholder="请输入添加权益用户的手机号"
              />
            </el-col>
          </el-form-item>
          <el-form-item
            label-width="100px"
            label="选择权益商品"
          >
            <el-transfer
              v-model="addRightsItems"
              :titles="['商品列表', '已选中']"
              :data="goodsList"
            >
              <div
                slot="left-footer"
                class="transfer-footer"
              >
                <el-pagination
                  v-if="goods_total_count > goodsParams.pageSize"
                  small
                  layout="prev, pager, next"
                  :total="goods_total_count"
                  :page-size="goodsParams.pageSize"
                  @current-change="handleGoodsChange"
                />
              </div>
            </el-transfer>
          </el-form-item>
          <el-form-item class="content-center">
            <el-button
              type="primary"
              @click="onSubmit"
            >
              确定添加
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </el-dialog>
    <!-- 延期 -->
    <el-dialog
      title="延期设置"
      class="delay-dialog"
      :visible.sync="delayDialog"
    >
      <div class="alert-txt">
        <el-alert
          title=""
          type="warning"
          description="消息提示的文案"
          :closable="false"
        >
          权益：{{ rightsInfo.rights_name }} ,有效期至：{{ rightsInfo.end_time | datetime }}
        </el-alert>
      </div>
      <el-row class="option-box">
        <el-col :span="8">
          延期至：<el-date-picker
            v-model="form.delay_date"
            type="date"
            :picker-options="pickerOptions"
          />
        </el-col>
        <el-col :span="12">
          备注：<el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
            :rows="2"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            @click="delaySave"
          >
            提交
          </el-button>
        </el-col>
      </el-row>
      <el-table
        :data="delayData"
        height="380"
        style="width: 100%"
      >
        <el-table-column label="原有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.original_date | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="延期后有效期">
          <template slot-scope="scope">
            <span>{{ scope.row.delay_date | datetime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { findRightsList, createRights, delayRights, getRightsInfo } from '../../../api/trade'
import { getItemsList } from '../../../api/goods'
export default {
  data () {
    var delayDisabledDate = Date.now()
    return {
      loading: false,
      activeName: 'first',
      addRightsDialog: false,
      delayDialog: false,
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
        pageSize: 20
      },
      form: {
        delay_date: [],
        remark: ''
      },
      rightsInfo: {},
      delayData: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < delayDisabledDate
        }
      }
    }
  },
  mounted () {
    this.getRightsList()
  },
  methods: {
    onSubmit () {
      let query = { mobile: this.mobile, itemids: this.addRightsItems }
      createRights(query).then((res) => {
        this.mobile = ''
        this.addRightsItems = []
        this.$message({
          type: 'success',
          message: '添加权益成功'
        })
        this.getRightsList()
        this.addRightsDialog = false
      })
    },
    addResource () {
      this.getGoodsList()
      this.mobile = ''
      this.addRightsDialog = true
    },
    handleCancelLabelsDialog () {
      this.addRightsDialog = false
    },
    handleCurrentChange (val) {
      this.loading = false
      this.params.page = val
      this.getRightsList()
    },
    numberSearch () {
      if (!this.searchMobile) {
        return false
      }
      this.params.mobile = this.searchMobile
      this.getRightsList()
    },
    handleGoodsChange (val) {
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
    getGoodsList () {
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
    getRightsList () {
      this.loading = true
      findRightsList(this.params).then((response) => {
        this.rightsList = response.data.data.list
        this.total_count = Number(response.data.data.total_count)
        this.loading = false
      })
    },
    delayAction (item) {
      this.form.delay_date = ''
      this.form.remark = ''
      this.rightsInfo = item
      this.form.rights_id = item.rights_id
      var filter = { rights_id: item.rights_id }
      getRightsInfo(filter).then((res) => {
        if (res.data.data.logs.list) {
          this.delayData = res.data.data.logs.list
        }
      })
      this.delayDialog = true
    },
    delaySave () {
      delayRights(this.form).then((res) => {
        if (res.data.data) {
          this.delayDialog = false
          this.getRightsList()
        }
      })
    }
  }
}
</script>
