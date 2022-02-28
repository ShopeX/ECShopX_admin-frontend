<template>
  <el-row>
    <el-col class="flex-right">
      <div class="upload">
        <el-upload
          action=""
          :on-change="uploadHandleChange"
          :auto-upload="false"
          :show-file-list="false"
          class="upload"
        >
          <!-- <el-button type="primary" icon="el-icon-box" :size="size">批量发货222222</el-button> -->
        </el-upload>
      </div>
      <exportTip @exportHandle='exportInvoice'>
        <el-button type="primary" :size="size"
          >导出未开票订单</el-button
        >
      </exportTip>

      <exportTip @exportHandle='exportData' params='normal_order'>
        <el-button type="primary" 
        :size="size"  >导出子订单</el-button
        >
      </exportTip>

      <exportTip @exportHandle='exportData' params='normal_master_order'>
        <el-button type="primary" 
        :size="size" >导出主订单</el-button
        >
      </exportTip>

      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        content="导出任务会以队列执行，点击导出后，请至‘设置-导出列表’页面中查看及下载数据"
      >
        <i class="el-icon-question" slot="reference"></i>
      </el-popover>
    </el-col>

    <el-dialog
      title="订单下载"
      :visible.sync="downloadView"
      :close-on-click-modal="false"
    >
      <template v-if="downloadUrl">
        <a :href="downloadUrl" download>{{ downloadName }}</a>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import { orderExport, exportInvoice } from "@/api/trade";
import { handleUploadFile } from "@/api/common";
export default {
  data() {
    return {
      downloadView: false,
      downloadUrl: "",
      downloadName: "",
    };
  },
  props: ["params","size","filterParams"],
  methods: {
    uploadHandleChange(file) {
      let params = {
        isUploadFile: true,
        file_type: "normal_orders",
        file: file.raw,
      };
      handleUploadFile(params).then(() => {
        this.$message({
          type: "success",
          message: "上传成功，等待处理",
        });
      });
    },
    exportData(type) {
      /** type表示导出订单的类型 */
      this.$emit("changeParams", { type });
      if (this.params.order_type != "normal") {
        this.$message({
          type: "error",
          message: "暂不支持该类型订单导出",
        });
        return;
      }
      orderExport({
        ...this.params,
        type,
        page: 1,
        ...this.filterParams
      }).then((response) => {
        const { status, url, filename } = response.data.data;
        if (status) {
          this.$message({
            type: "success",
            message: "已加入执行队列，请在设置-导出列表中下载",
          });
          this.$export_open(type)
          return;
        } else if (url) {
          this.downloadUrl = url;
          this.downloadName = filename;
          this.downloadView = true;
        } else {
          this.$message({
            type: "error",
            message: "无内容可导出 或 执行失败，请检查重试",
          });
          return;
        }
      });
    },
    exportInvoice() {
      let type = "normal";
      this.$emit("onChangeData", "params", { type });
      exportInvoice({
        ...this.params,
        type,
      }).then((response) => {
        const { status, url, filename } = response.data.data;
        if (status) {
          this.$message({
            type: "success",
            message: "已加入执行队列，请在设置-导出列表中下载",
          });
          this.$export_open('normal');
          return;
        } else if (url) {
          this.downloadUrl = url;
          this.downloadName = filename;
          this.downloadView = true;
        } else {
          this.$message({
            type: "error",
            message: "无内容可导出 或 执行失败，请检查重试",
          });
          return;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss" >
.upload {
  line-height: 48px;
  margin-right: 19px;
}

.flex-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>