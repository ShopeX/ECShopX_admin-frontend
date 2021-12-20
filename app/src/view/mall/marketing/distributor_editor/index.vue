 
<template>
  <section
    class="section section-white content-padded content-padded-bottom-80 distributorIndex"
    onload="init()"
  >
    <el-form label-width="110px" ref="form" :model="form" :rules="rules">
      <BaseForm
        :disabled="disabled"
        :distributor_type="distributor_type"
        :rules="rules"
        :externalForm="form"
        ref="baseFormRef"
      />

      <ImageForm ref="imageFormRef" :externalForm="form" />

      <ShopForm
        :externalForm="form"
        @onChangeData="handleChangeData"
        ref="shopFormRef"
      />

      <DadaForm :rules="rules" ref="dadaFormRef" :externalForm="form" @onChangeData="handleChangeData" />

      <!-- <FashionForm ref="fashionFormRef" :externalForm="form" /> -->

      <!-- <GlobalFooter> -->
        <div class="section-footer content-center">
          <el-button size="large" @click="cancelSubmit">取消</el-button>
          <el-button
            type="primary"
            @click="submitItemsActionConfirm"
            :loading="submitLoading"
            >{{ submitLoading ? "提交中" : "保存" }}</el-button
          >
        </div>
      <!-- </GlobalFooter> -->
    </el-form>
  </section>
</template>
<script>
import { saveDistributor } from "@/api/marketing";
import DadaForm from "./components/DadaForm";
import FashionForm from "./components/FashionForm";
import ImageForm from "./components/ImageForm";
import ShopForm from "./components/ShopForm";
import BaseForm from "./components/BaseForm";
import GlobalFooter from "@/components/global_footer";

export default {
  components: {
    GlobalFooter,
    DadaForm,
    FashionForm,
    ImageForm,
    ShopForm,
    BaseForm,
  },
  data() {
    return {
      submitLoading: false,
      disabled: false,
      dadaShow:false,
      form: {
        lng: "",
        lat: "",
      },
      distributor_id: 0,
      distributor_type: "",
      rules: {
        shop_code: [
          {
            pattern: /^[A-Za-z0-9\-]+$/,
            message: "请输入正确格式的店铺号",
            required: true,
          },
        ],
        name: [{ pattern: /^[*]*$/,message: "店铺名称必填", required: true }],
        contact: [{ message: "联系人必填", required: true }],
        mobile: [{ message: "手机必填", required: true }],
        dada_type: [{ message: "达达业务类型必填", required: true }],
      },
    };
  },
  methods: {
    handleChangeData(changeField, changeValue) {
      if (
        typeof changeValue === "boolean" ||
        typeof changeValue === "string" ||
        typeof changeValue === "undefined"
      ) {
        this[changeField] = changeValue;
      } else {
        this[changeField] = {
          ...this[changeField],
          ...changeValue,
        };
      }
    },
    cancelSubmit() {
      this.$router.go(-1);
    },
    deleteParams(params,obj){
      let result=obj;
      for(let i=0;i<params.length;i++){ 
          delete result[params[i]] 
      } 
      return result;
    },
    submitItemsActionConfirm() {
      console.log('=================1221=============');
      // debugger

      let nodada={
        is_dada:undefined,
        business:undefined
      }

      
      console.log("submitItemsActionConfirm");
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true;
          console.log("this.$refs.baseFormRef.form",this.$refs.baseFormRef.form)
          console.log("this.$refs.imageFormRef.form",this.$refs.imageFormRef.form)
          console.log("this.$refs.shopFormRef.form",this.$refs.shopFormRef.form)
          console.log("this.$refs.dadaFormRef.form",this.$refs.dadaFormRef.form)
          // console.log("this.$refs.fashionFormRef.form",this.$refs.fashionFormRef.form)
          
          const filterParams = {
            ...this.$refs.baseFormRef.form,
            ...this.$refs.imageFormRef.form,
            ...this.deleteParams(['name','logo','contact','mobile','contract_phone','is_audit_goods','is_ziti','banner'],this.$refs.shopFormRef.form),
            ...this.$refs.dadaFormRef.form,
            // ...this.$refs.fashionFormRef.form,
            hour:
              this.$refs.baseFormRef.startTime +
              "-" +
              this.$refs.baseFormRef.endTime,
            distributor_id: this.distributor_id, 
          }; 
          console.log('filterParams=============',filterParams);
          if(this.dadaShow){
            nodada={
              is_dada:this.$refs.dadaFormRef.form.is_dada,
              business:this.$refs.dadaFormRef.form.business
            }
          }
          saveDistributor({
            ...filterParams,
            ...nodada
          })
            .then((res) => {
              this.submitLoading = false;
              this.$message({ type: "success", message: "保存店铺成功" });
              if (this.$store.getters.login_type != "distributor") {
                this.$router.go(-1);
              }
            })
            .catch((error) => {
              this.submitLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.distributorIndex {
  .el-card__header {
    // padding: 8px 20px;
  }
}
.bm-view {
  width: 100%;
  height: 300px;
}
#qqmap_rslist {
  border-right: 1px solid #e7e7eb;
}
#qqmap_container {
  float: left;
  width: 800px;
  height: 400px;
}
.section {
  &.content-padded-bottom-80 {
    padding-bottom: 80px;
  }
}
</style>
