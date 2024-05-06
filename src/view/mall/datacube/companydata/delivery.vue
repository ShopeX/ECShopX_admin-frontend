<template>
  <div>
    <SpFilterForm :model="params" @onSearch="onSearch" @onReset="onSearch">
      <SpFilterFormItem prop="username" label="时间筛选:" size="max">
        <el-date-picker
          v-model="params.value1"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </SpFilterFormItem>
      <SpFilterFormItem prop="username" label="配送员姓名:">
        <el-input v-model="params.username" placeholder="请输入配送员姓名" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="mobile" label="手机号:">
        <el-input v-model="params.mobile" placeholder="手机号" />
      </SpFilterFormItem>
      <SpFilterFormItem prop="payment_method" label="所属店铺:">
        <el-select v-model="params.payment_method" placeholder="请选择">
          <el-option
            v-for="item in belonginStore"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
      <SpFilterFormItem prop="delivery_method" label="所属商家:">
        <el-select v-model="params.delivery_method" placeholder="请选择">
          <el-option
            v-for="item in belongingMerchant"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </SpFilterFormItem>
    </SpFilterForm>
  </div>
</template>
<script>
export default {
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      params: {
        value1:'',
        username: '',
        mobile: '',
        payment_method: '',
        delivery_method: '',
      },
      belonginStore: [],
      belongingMerchant: []
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="" scoped></style>
