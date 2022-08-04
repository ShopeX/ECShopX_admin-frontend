<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
        <SpFilterFormItem prop="keywords" label="商品名称:">
          <el-input v-model="params.keywords" placeholder="请输入商品名称" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="item_bn" label="商品编号:">
          <el-input v-model="params.item_bn" placeholder="请输入商品编号" />
        </SpFilterFormItem>
        <SpFilterFormItem prop="regions_id" label="商品产地:">
          <el-cascader
            v-model="params.regions_id"
            clearable
            placeholder="请选择"
            :options="regions"
          />
        </SpFilterFormItem>
        <SpFilterFormItem prop="approve_status" label="商品状态:">
          <el-select v-model="params.approve_status" clearable placeholder="请选择">
            <el-option
              v-for="item in salesStatus"
              :key="item.value"
              :label="item.title"
              size="mini"
              :value="item.value"
            />
          </el-select>
        </SpFilterFormItem>
        <SpFilterFormItem prop="distributor_id" label="店铺:">
          <SpSelectShop v-model="params.distributor_id" clearable placeholder="请选择" />
        </SpFilterFormItem>
      </SpFilterForm>

      <div class="action-container">
        <el-button type="primary" plain @click="Examine">
批量审核
</el-button>
        <el-button type="primary" plain @click="batchItemsStatus('onsale')">
批量上架
</el-button>
        <el-button type="primary" plain @click="batchItemsStatus('instock')">
强制下架
</el-button>
        <el-dropdown>
          <el-button type="primary" plain icon="iconfont icon-daorucaozuo-01">
            导出<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <export-tip @exportHandle="exportItemsWxappCode('wxa')">
小程序码
</export-tip>
            </el-dropdown-item>
            <el-dropdown-item>
              <export-tip @exportHandle="exportItemsWxappCode('h5')">
H5二维码
</export-tip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <el-tabs v-model="params.audit_status" type="card" @tab-click="onSearch">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.label"
          :name="item.name"
        >
          <el-table
            v-loading="loading"
            border
            :data="tableList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center" label="全选" />
            <el-table-column prop="goods_id" label="商品ID" />
            <el-table-column prop="itemName" label="商品名称">
              <template slot-scope="scope">
                {{ scope.row.item_name }}
                <el-tag v-if="scope.row.special_type == 'drug'" type="danger">
处方药
</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="排序编号">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  size="mini"
                  style="width: 60px"
                  @change="editItemsSort(scope.$index, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="规格">
              <template slot-scope="scope">
                <el-tag v-if="!scope.row.nospec" effect="plain" size="mini" type="success">
                  多规格
                </el-tag>
                <el-tag v-else effect="plain" size="mini">
单规格
</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="market_price" label="市场价（¥）" />
            <el-table-column prop="price" label="销售价（¥）" />
            <el-table-column prop="store" label="库存" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.audit_status == 'processing'">等待审核</span>
                <el-popover
                  v-else-if="scope.row.audit_status == 'rejected'"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.audit_reason"
                >
                  <el-button slot="reference" type="text">
审核驳回
</el-button>
                </el-popover>
                <span v-else-if="scope.row.approve_status == 'onsale'">前台可销</span>
                <span v-else-if="scope.row.approve_status == 'offline_sale'">前台不展示 </span>
                <span v-else-if="scope.row.approve_status == 'only_show'">前台仅展示</span>
                <span v-else>不可销售</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" class="btn-gap">
                  <span @click="editItemsAction(scope.$index, scope.row)"> 查看 </span>
                  <span
                    v-if="scope.row.audit_status == 'processing'"
                    @click="batchItemsAudit(scope.row, $event)"
                  >
                    审核
                  </span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="page.pageIndex"
              :page-sizes="[10, 20, 50]"
              :total="page.total"
              :page-size="page.pageSize"
              @current-change="onCurrentChange"
              @size-change="onSizeChange"
            />
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-dialog title="批量审核店铺商品" :visible.sync="dialogVisible" width="30%">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="审核状态">
            <el-radio-group v-model="form.audit_status">
              <el-radio label="approved">
通过
</el-radio>
              <el-radio label="rejected">
拒绝
</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.audit_status == 'rejected'" label="拒绝原因">
            <el-input v-model="form.audit_reason" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">
确定
</el-button>
            <el-button @click="dialogVisible = false">
取消
</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import district from '@/common/district.json'
import { getItemsList, auditItems, updateItemsStatus } from '@/api/goods'
import { pageMixin } from '@/mixins'
import { SALES_STATUS } from '@/consts'

export default {
  mixins: [pageMixin],
  props: ['getStatus'],
  provide () {
    return {
      refresh: this.fetchList
    }
  },
  data () {
    return {
      dialogVisible: false,
      regions: district,
      tabList: [
        { label: '全部商品', name: '' },
        { label: '待审核', name: 'processing' }
      ],
      form: {
        audit_status: 'approved',
        audit_reason: ''
      },
      activeName: 'first',
      ItemsList: [],
      goods_id: [],
      loading: false,
      params: {
        keywords: '',
        item_bn: '',
        regions_id: [],
        approve_status: '',
        distributor_id: 'all_distributor',
        audit_status: ''
      },
      salesStatus: SALES_STATUS
    }
  },
  computed: {
    ...mapGetters(['wheight'])
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    // 导出
    async exportItemsWxappCode (exportType) {
      let params
      if (this.goods_id.length) {
        params = {
          item_id: this.goods_id
        }
      } else {
        params = {
          ...this.params
        }
      }
      const { status } = await this.$api.goods.exportGoodsCode({
        ...params,
        source: 'distributor',
        export_type: exportType
      })
      if (status) {
        this.$message.success('已加入执行队列，请在设置-导出列表中下载')
        this.$export_open('itemcode')
      } else {
        this.$message.error('导出失败')
      }
    },

    // 批量审批
    Examine () {
      if (this.goods_id.length === 0) {
        this.$message.error('请选择至少一个商品')
        return false
      }

      this.dialogVisible = true
    },
    // 审核确定
    onSubmit () {
      this.form.goods_id = this.goods_id
      auditItems(this.form).then((res) => {
        this.$message.success('保存成功')
        this.dialogVisible = false
        this.fetchList()
      })
    },

    batchItemsAudit (row, e) {
      console.log(row)
      this.goods_id = [row.goods_id]
      this.dialogVisible = true
    },

    handleSelectionChange (val) {
      let goods_id = []
      for (let i in val) {
        goods_id.push(val[i].goods_id)
      }
      this.goods_id = goods_id
    },

    editItemsAction (index, row) {
      // 编辑商品弹框
      var routeData = this.$router.push({
        path: this.matchHidePage('editor/') + row.itemId
      })
    },

    async fetchList () {
      this.loading = true
      const { pageIndex: page, pageSize } = this.page
      let params = {
        page,
        pageSize,
        item_type: 'normal',
        ...this.params
      }
      const { list, total_count } = await this.$api.goods.getItemsList(params)
      list.forEach((item) => {
        item.price = item.price / 100
        item.link = `pages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`
      })
      this.tableList = list
      this.page.total = total_count
      this.loading = false
    },

    batchItemsStatus (status) {
      if (this.goods_id.length === 0) {
        this.$message.error('请选择至少一个商品')
        return false
      }
      this.skuLoading = true
      let params = {}
      if (this.goods_id.length > 0) {
        let data = []
        this.goods_id.forEach((goods_id) => {
          data.push({ goods_id: goods_id })
        })
        params = {
          items: JSON.stringify(data),
          status: status
        }
      }
      this.submitLoading = true
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 2 * 1000
          })
          this.fetchList()
        }
        this.submitLoading = false
        this.skuLoading = false
      })
    }
  }
  // watch: {
  //   $route() {
  //     this.getGoodsList();
  //   },
  // },
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  img {
    width: 90%;
  }
}
.sp-filter-form {
  margin-bottom: 16px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 10px;
  img {
    width: 90%;
  }
}
.row-bg {
  padding: 10px 20px;
  background-color: #f9fafc;
}
.service-label .el-checkbox:first-child {
  margin-left: 15px;
}
.service-label .el-input:first-child {
  margin-left: 15px;
}
.grid-detail {
  max-height: 300px;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.el-carousel {
  width: 375px;
}
.tag-users {
  padding-bottom: 10px;
  line-height: 1.2;
  .icon-user-circle1 {
    margin-right: 10px;
    font-size: 24px;
    color: #ccc;
  }
}
.selected-tags {
  padding-top: 15px;
  margin-bottom: 15px;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  .label {
    margin-bottom: 15px;
  }
  .el-tag {
    margin-right: 10px;
    margin-bottom: 15px;
  }
}
.tag-item {
  cursor: pointer;
  color: #666;
  border-color: #dadadd;
  margin-right: 10px;
  margin-top: 10px;
}
.copy-btn {
  position: relative;
  [class^='copy-link'] {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    visibility: hidden;
  }
}
</style>
<style lang="scss">
.grid-detail {
  table,
  .detail-content-wrap,
  .detail-content-item {
    width: 100% !important;
  }
  img {
    width: 100%;
  }
}
.grid-attribute {
  table {
    width: 100% !important;
  }
}
</style>
