<template>
  <div>
    <el-card header="搜索">
      <el-row class="flex-center">
        <el-col :span="8" class="flex-center">
          <div class="label">物流名称</div>
          <div class="input">
            <el-input
              placeholder="请输入物流公司名称"
              v-model="form.corp_name"
            />
          </div>
        </el-col>
        <el-col :span="8" class="flex-center">
          <div class="label">物流状态</div>
          <div class="input">
            <el-select v-model="form.status" clearable placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="8" class="flex-center">
          <el-button @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card header="物流列表">
      <el-row :gutter="40">
        <el-col :xs="8" :sm="6" :md="6" :lg="6" :xl="4" v-for="(item, index) in list" :key="index">
          <LogisticsBlock
            :info="item"
            @refreshList="getList"
            :disabled="index === 0"
          />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getLogisticsList } from "@/api/logistics";
import LogisticsBlock from "./component/logisticsBlock";
export default {
  components: { LogisticsBlock },
  data() {
    return {
      form: {
        corp_name: "",
        status: 0,
      },
      statusOptions: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "启用",
        },
        {
          value: 2,
          label: "关闭",
        },
      ],
      list: [],
    };
  },
  methods: {
    handleReset:function(){
      this.form={
        corp_name:"",
        status:0
      }
    },
    handleSearch: function () {
      this.getList();
    },
    getList: function () {
      getLogisticsList({
        ...this.form,
      }).then((res) => {
        const {
          data: {
            data: { list },
          },
        } = res;
        this.list = list;
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="scss">
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;

  .input {
    margin-left: 20px;
  }
}
</style>