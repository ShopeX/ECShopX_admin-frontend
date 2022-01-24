<template>
  <div>
    <div v-if="$route.path.indexOf('editor') === -1">
      <el-row class="filter-header" :gutter="20">
        <el-col>
          <el-input
            class="input-m"
            placeholder="商品名称"
            v-model="params.keywords"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsSearch"
            ></el-button>
          </el-input>
          <el-input
            class="input-m"
            placeholder="商品编号"
            v-model="params.item_bn"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="goodsSearch"
            ></el-button>
          </el-input>
          <el-cascader
            placeholder="商品产地"
            :options="regions"
            v-model="select_regions_value"
            clearable
            @change="searchAction"
          >
          </el-cascader>
          <el-select
            v-model="params.approve_status"
            clearable
            placeholder="请选择状态"
            @change="goodsSearch"
          >
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.title"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="params.special_type"
            clearable
            placeholder="商品类型"
            @change="searchAction"
          >
            <el-option
              placeholder="商品类型"
              v-for="item in special_type_list"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <shop-select
            distributors
            @update="goodsSearch"
            @init="resetSearch"
            :shopIdDefault="params.distributor_id"
          ></shop-select>
          <!--distributors wxshops 需要哪个api传哪个-->
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button-group>
            <el-button type="primary" @click="AuditHandle()"
              >批量审核</el-button
            >
            <el-button type="primary" @click="batchItemsStatus('onsale')"
              >批量上架</el-button
            >
            <el-button type="primary" @click="batchItemsStatus('instock')"
              >强制下架</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.name"
          :name="item.activeName"
        >
          <el-table
            :data="ItemsList"
            @selection-change="handleSelectionChange"
            v-loading="loading"
          >
            <el-table-column
              type="selection"
              align="center"
              label="全选"
            ></el-table-column>
            <el-table-column label="操作" width="100" fixed>
              <template slot-scope="scope">
                <el-button type="text" class="btn-gap">
                  <span
                    v-if="scope.row.audit_status == 'processing'"
                    @click="batchItemsAudit(scope.row, $event)"
                    >审核</span
                  >
                  <span v-else @click="editItemsAction(scope.$index, scope.row)"
                    >查看</span
                  >
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="goods_id"
              label="商品ID"
              width="90"
            ></el-table-column>
            <el-table-column label="排序编号" width="90">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.sort"
                  @change="editItemsSort(scope.$index, scope.row)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="规格" width="70">
              <template slot-scope="scope">
                <el-tag effect="plain" type="success" v-if="!scope.row.nospec"
                  >多规格</el-tag
                >
                <el-tag effect="plain" v-else>单规格</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="itemName" label="商品名称">
              <template slot-scope="scope">
                {{ scope.row.item_name }}
                <el-tag type="danger" v-if="scope.row.special_type == 'drug'"
                  >处方药</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="price" label="商品价格">
            </el-table-column>
            <el-table-column
              prop="store"
              label="库存"
              width="80"
            ></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.audit_status == 'processing'"
                  >等待审核</span
                >
                <el-popover
                  v-else-if="scope.row.audit_status == 'rejected'"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="scope.row.audit_reason"
                >
                  <el-button type="text" slot="reference">审核驳回</el-button>
                </el-popover>
                <span v-else-if="scope.row.approve_status == 'onsale'"
                  >前台可销</span
                >
                <span v-else-if="scope.row.approve_status == 'offline_sale'"
                  >可线下销售</span
                >
                <span v-else-if="scope.row.approve_status == 'only_show'"
                  >前台仅展示</span
                >
                <span v-else>不可销售</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="content-center content-top-padded">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :current-page.sync="params.page"
              :page-sizes="[10, 20, 50]"
              :total="total_count"
              :page-size="params.pageSize"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="批量审核店铺商品"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="审核状态">
            <el-radio-group v-model="form.audit_status">
              <el-radio label="approved">通过</el-radio>
              <el-radio label="rejected">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.audit_status == 'rejected'" label="拒绝原因">
            <el-input type="textarea" v-model="form.audit_reason"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { Message } from "element-ui";
import shopSelect from "@/components/shopSelect";
import district from "@/common/district.json";
import { getItemsList, auditItems, updateItemsStatus } from "@/api/goods";

export default {
  components: {
    shopSelect,
  },
  props: ["getStatus"],
  provide() {
    return {
      refresh: this.getGoodsList,
    };
  },
  data() {
    return {
      dialogVisible: false,
      select_regions_value: [],
      special_type_list: [
        { value: "normal", name: "普通商品" },
        { value: "drug", name: "处方药" },
      ],
      regions: district,
      tabList: [
        { name: "全部商品", value: null, activeName: "first" },
        { name: "待审核", value: "processing", activeName: "processing" },
      ],
      form: {
        audit_status: "approved",
        audit_reason: "",
      },
      activeName: "first",
      ItemsList: [],
      goods_id: [],
      loading: false,
      total_count: 0,
      params: {
        page: 1,
        pageSize: 20,
        item_type: "normal",
        keywords: "",
        //audit_status: 'processing',
        is_warning: false,
      },
      statusOption: [
        { title: "前台可销售", value: "onsale" },
        { title: "可线下销售", value: "offline_sale" },
        { title: "前台仅展示", value: "only_show" },
        { title: "不可销售", value: "instock" },
      ],
    };
  },
  computed: {
    ...mapGetters(["wheight"]),
  },
  methods: {
    onSubmit() {
      this.form.goods_id = this.goods_id;
      auditItems(this.form).then((res) => {
        this.$message({ type: "success", message: "保存成功" });
        this.dialogVisible = false;
        this.getGoodsList();
      });
    },
    AuditHandle() {
      console.log(this.goods_id);
      if (this.goods_id.length === 0) {
        this.$message({
          type: "error",
          message: "请选择至少一个商品",
        });
        return false;
      }

      this.dialogVisible = true;
    },
    batchItemsAudit(row, e) {
      console.log(row);
      this.goods_id = [row.goods_id];
      this.dialogVisible = true;
    },
    handleClick() {
      if (this.activeName == "first") {
        delete this.params.audit_status;
      } else if (this.activeName == "processing") {
        this.params.audit_status = "processing";
      }
      this.params.page = 1;
      this.getGoodsList();
    },
    searchAction() {
      this.params.page = 1;
      if (this.select_regions_value) {
        this.params.regions_id = this.select_regions_value;
      }
      this.getGoodsList();
    },
    handleCurrentChange(page_num) {
      this.params.page = page_num;
      this.getGoodsList();
    },
    handleSizeChange(pageSize) {
      this.params.page = 1;
      this.params.pageSize = pageSize;
      this.getGoodsList();
    },
    handleSelectionChange(val) {
      let goods_id = [];
      for (let i in val) {
        goods_id.push(val[i].goods_id);
      }
      this.goods_id = goods_id;
    },
    editItemsAction(index, row) {
      // 编辑商品弹框
      var routeData = this.$router.push({
        path: this.matchHidePage("editor/") + row.itemId,
      });
    },
    goodsSearch(val) {
      this.params.page = 1;
      val && val.shop_id;
      this.params.distributor_id = val.shop_id;
      this.getGoodsList();
    },
    resetSearch() {
      this.select_regions_value = []
      this.params = {
        page: 1,
        pageSize: 20,
        item_type: "normal",
        keywords: "",
        is_warning: false
      }
      this.getGoodsList();
    },
    getGoodsList() {
      let params = {...this.params}
      params.distributor_id = params.distributor_id || 'all_distributor';
      this.loading = true;
      getItemsList(params).then((response) => {
        console.log(response);
        this.ItemsList = response.data.data.list;
        this.ItemsList.forEach((item) => {
          item.price = item.price / 100;
          item.link = `pages/item/espier-detail?gid=${item.goods_id}&id=${item.item_id}`;
        });
        this.total_count = response.data.data.total_count;
        this.loading = false;
      });
    },
    batchItemsStatus(status) {
      if (this.goods_id.length === 0) {
        this.$message({
          type: "error",
          message: "请选择至少一个商品",
        });
        return false;
      }
      this.skuLoading = true;
      let params = {};
      if (this.goods_id.length > 0) {
        let data = [];
        this.goods_id.forEach((goods_id) => {
          data.push({ goods_id: goods_id });
        });
        params = {
          items: JSON.stringify(data),
          status: status,
        };
      }
      this.submitLoading = true;
      updateItemsStatus(params).then((res) => {
        if (res.data.data.status) {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 2 * 1000,
          });
          this.getGoodsList();
        }
        this.submitLoading = false;
        this.skuLoading = false;
      });
    },
  },
  mounted() {
    this.getGoodsList();
  },
  watch: {
    $route() {
      this.getGoodsList();
    },
  },
};
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
  [class^="copy-link"] {
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
